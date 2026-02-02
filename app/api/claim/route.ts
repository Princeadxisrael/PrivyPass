import { NextRequest, NextResponse } from 'next/server';
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  clusterApiUrl,
} from '@solana/web3.js';
import {
  TOKEN_2022_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  getAssociatedTokenAddressSync,
  getAccount,
} from '@solana/spl-token';
import * as fs from 'fs';
import * as path from 'path';

// Rate limiting: simple in-memory store (Best to use something like Redis in production)
const claimHistory = new Map<string, number>();
const CLAIM_COOLDOWN = 24 * 60 * 60 * 1000; // 24 hours
const CLAIM_AMOUNT = 100; // 100 PASS tokens per claim (in token units, not base units)

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json();
    
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address required' },
        { status: 400 }
      );
    }

    // Validate wallet address
    let recipient: PublicKey;
    try {
      recipient = new PublicKey(walletAddress);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    // Check rate limit
    const lastClaim = claimHistory.get(walletAddress);
    if (lastClaim && Date.now() - lastClaim < CLAIM_COOLDOWN) {
      const timeLeft = CLAIM_COOLDOWN - (Date.now() - lastClaim);
      const hoursLeft = Math.ceil(timeLeft / (60 * 60 * 1000));
      
      return NextResponse.json(
        { 
          error: 'Claim cooldown active',
          message: `You can claim again in ${hoursLeft} hours`,
          nextClaimAt: lastClaim + CLAIM_COOLDOWN,
        },
        { status: 429 }
      );
    }

    // Load token config
    const configPath = path.join(process.cwd(), 'token-config.json');
    if (!fs.existsSync(configPath)) {
      return NextResponse.json(
        { error: 'Token not configured. Run setup first.' },
        { status: 500 }
      );
    }
    
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const mintAddress = new PublicKey(config.mintAddress);

    // Connect to network
    const connection = new Connection(clusterApiUrl(config.network), 'confirmed');
    
    // Load mint authority
    const mintAuthorityPath = path.join(process.cwd(), '.keys/mint-authority.json');
    if (!fs.existsSync(mintAuthorityPath)) {
      return NextResponse.json(
        { error: 'Mint authority not found' },
        { status: 500 }
      );
    }
    
    const secretKey = JSON.parse(fs.readFileSync(mintAuthorityPath, 'utf-8'));
    const mintAuthority = Keypair.fromSecretKey(new Uint8Array(secretKey));
    
    // Get associated token account address
    const recipientTokenAccount = getAssociatedTokenAddressSync(
      mintAddress,
      recipient,
      false,
      TOKEN_2022_PROGRAM_ID
    );
    
    // Check if token account exists
    const accountInfo = await connection.getAccountInfo(recipientTokenAccount);
    
    const transaction = new Transaction();
    
    if (!accountInfo) {
      // Create token account
      // Note: We're creating a basic token account here
      // Full confidential transfer setup requires ZK proof generation
      // which is complex in TypeScript. For the demo, we mint to public balance.
      // Users can later use deposit/apply in wallet to move to confidential balance.
      transaction.add(
        createAssociatedTokenAccountInstruction(
          mintAuthority.publicKey,
          recipientTokenAccount,
          recipient,
          mintAddress,
          TOKEN_2022_PROGRAM_ID
        )
      );
    }
    
    // Mint tokens to public balance
    const mintAmount = CLAIM_AMOUNT * Math.pow(10, config.decimals);
    transaction.add(
      createMintToInstruction(
        mintAddress,
        recipientTokenAccount,
        mintAuthority.publicKey,
        mintAmount,
        [],
        TOKEN_2022_PROGRAM_ID
      )
    );
    
    // Send transaction
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = mintAuthority.publicKey;
    
    transaction.sign(mintAuthority);
    
    const signature = await connection.sendRawTransaction(
      transaction.serialize(),
      { skipPreflight: false, preflightCommitment: 'confirmed' }
    );
    
    await connection.confirmTransaction(signature, 'confirmed');

    // Update claim history
    claimHistory.set(walletAddress, Date.now());

    return NextResponse.json({
      success: true,
      signature,
      amount: CLAIM_AMOUNT,
      tokenAccount: recipientTokenAccount.toBase58(),
      explorer: `https://explorer.solana.com/tx/${signature}?cluster=${config.network}`,
      note: 'Tokens minted to public balance. Use deposit/apply in wallet for confidential transfers.',
    });

  } catch (error: any) {
    console.error('Claim error:', error);
    return NextResponse.json(
      { error: 'Failed to process claim', details: error.message },
      { status: 500 }
    );
  }
}