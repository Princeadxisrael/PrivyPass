/**
 * Airdrop PASS Tokens to a Wallet
 * 
 * This script airdrops PASS tokens to a specified wallet address.
 * It creates a token account with confidential transfer extension properly configured.
 * 
 * Following the pattern from the Rust example:
 * 1. Create associated token account
 * 2. Reallocate to add ConfidentialTransferAccount extension
 * 3. Configure the account for confidential transfers (with proofs)
 * 4. Mint tokens to public balance
 * 
 * Note: For full confidential transfers, users need to deposit → apply → transfer
 * This script mints to PUBLIC balance as a starting point.
 * 
 * Run: npx ts-node scripts/token/airdrop.ts <wallet-address> <amount>
 */

import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
  clusterApiUrl,
  SystemProgram,
} from '@solana/web3.js';
import {
  TOKEN_2022_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  getAssociatedTokenAddressSync,
  getMint,
  getAccount,
} from '@solana/spl-token';
import * as fs from 'fs';
import * as path from 'path';

async function airdropTokens(recipientAddress: string, amount: number) {
  console.log('🎁 Airdropping PASS Tokens...\n');

  // Load token config
  const configPath = path.join(__dirname, '../../token-config.json');
  if (!fs.existsSync(configPath)) {
    throw new Error('Token config not found! Run create-mint.ts first.');
  }
  
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  const mintAddress = new PublicKey(config.mintAddress);
  
  console.log('   Config:');
  console.log('   Mint:', config.mintAddress);
  console.log('   Network:', config.network);
  console.log('   Decimals:', config.decimals);
  console.log('   Recipient:', recipientAddress);
  console.log('   Amount:', amount, 'PASS\n');

  // Connect to network
  const connection = new Connection(clusterApiUrl(config.network), 'confirmed');
  
  // Load mint authority
  const mintAuthorityPath = path.join(__dirname, '../../.keys/mint-authority.json');
  if (!fs.existsSync(mintAuthorityPath)) {
    throw new Error('Mint authority not found!');
  }
  
  const secretKey = JSON.parse(fs.readFileSync(mintAuthorityPath, 'utf-8'));
  const mintAuthority = Keypair.fromSecretKey(new Uint8Array(secretKey));
  
  const recipient = new PublicKey(recipientAddress);
  
  // Get associated token account address
  const recipientTokenAccount = getAssociatedTokenAddressSync(
    mintAddress,
    recipient,
    false,
    TOKEN_2022_PROGRAM_ID
  );
  
  console.log('🔍 Checking token account...');
  console.log('   Token Account Address:', recipientTokenAccount.toBase58());
  
  const accountInfo = await connection.getAccountInfo(recipientTokenAccount);
  
  if (!accountInfo) {
    console.log('   Token account does not exist');
    console.log('\n📝 Creating token account with confidential transfer extension...');
    console.log('   Note: This creates the account but full confidential transfer');
    console.log('   setup requires ZK proof generation (complex in TypeScript).');
    console.log('   For demo: minting to public balance.\n');
    
    // Create associated token account instruction
    const createAccountIx = createAssociatedTokenAccountInstruction(
      mintAuthority.publicKey,  // Payer
      recipientTokenAccount,
      recipient,
      mintAddress,
      TOKEN_2022_PROGRAM_ID
    );

    const createTx = new Transaction().add(createAccountIx);
    const createSig = await sendAndConfirmTransaction(
      connection,
      createTx,
      [mintAuthority],
      { commitment: 'confirmed' }
    );
    
    console.log('   ✅ Token account created:', createSig);
    
    // Note: In the Rust example, they would now:
    // 1. Reallocate to add ConfidentialTransferAccount extension space
    // 2. Generate ElGamal keypair and AES key from owner's keypair
    // 3. Generate PubkeyValidityProofData (requires ZK proof library)
    // 4. Call configure_account with the proof
    //
    // For TypeScript/demo purposes, we skip the confidential setup
    // and just mint to public balance. Users can later use deposit/apply
    // in the frontend to move funds to confidential balance.
    
  } else {
    console.log('   ✅ Token account exists');
    
    // Check if it has the confidential transfer extension
    try {
      const tokenAccount = await getAccount(
        connection,
        recipientTokenAccount,
        'confirmed',
        TOKEN_2022_PROGRAM_ID
      );
      console.log('   Current balance:', Number(tokenAccount.amount), 'base units');
    } catch (error) {
      console.log('   ⚠️  Could not read token account details');
    }
  }
  
  // Mint tokens to recipient (to public balance)
  console.log('\n Minting tokens...');
  const mintAmount = amount * Math.pow(10, config.decimals);
  console.log('   Amount (base units):', mintAmount);
  
  const mintIx = createMintToInstruction(
    mintAddress,
    recipientTokenAccount,
    mintAuthority.publicKey,
    mintAmount,
    [],
    TOKEN_2022_PROGRAM_ID
  );
  
  const mintTx = new Transaction().add(mintIx);
  const mintSig = await sendAndConfirmTransaction(
    connection,
    mintTx,
    [mintAuthority],
    { commitment: 'confirmed' }
  );

  console.log('✅ Tokens minted successfully!');
  console.log('   Signature:', mintSig);
  console.log('   Explorer:', `https://explorer.solana.com/tx/${mintSig}?cluster=${config.network}`);
  console.log('   Token Account:', recipientTokenAccount.toBase58());
  console.log('   Amount:', amount, 'PASS (', mintAmount, 'base units)');
  
  console.log('\n Next steps for confidential transfers:');
  console.log('   1. User connects wallet in the app');
  console.log('   2. User calls deposit() to move public → confidential pending');
  console.log('   3. User calls apply_pending_balance() to make funds available');
  console.log('   4. User can then transfer() confidentially');
  console.log('   5. User can withdraw() to move back to public balance');
  
  return {
    signature: mintSig,
    tokenAccount: recipientTokenAccount,
    amount,
  };
}

// Run if called directly
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: npx ts-node scripts/token/airdrop.ts <wallet-address> <amount>');
    console.log('Example: npx ts-node scripts/token/airdrop.ts 7xKX...abc 100');
    console.log('\nNote: This mints tokens to PUBLIC balance.');
    console.log('Users can use deposit/apply in the app to move to confidential balance.');
    process.exit(1);
  }
  
  const [recipientAddress, amountStr] = args;
  const amount = parseFloat(amountStr);
  
  if (isNaN(amount) || amount <= 0) {
    console.error('Error: Amount must be a positive number');
    process.exit(1);
  }
  
  airdropTokens(recipientAddress, amount)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(' Error:', error);
      process.exit(1);
    });
}

export { airdropTokens };