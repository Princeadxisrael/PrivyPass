import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { 
  getAssociatedTokenAddress, 
  TOKEN_2022_PROGRAM_ID,
  getAccount,
} from '@solana/spl-token';

// Devnet configuration
export const NETWORK = 'devnet';
export const RPC_ENDPOINT = clusterApiUrl(NETWORK);

// Token mint address - will be populated after running create-mint script
// For now, using placeholder. Update this after running the script.
export let PASS_TOKEN_MINT: PublicKey;

// Load mint address from config if available
if (typeof window === 'undefined') {
  // Server-side
  try {
    const fs = require('fs');
    const path = require('path');
    const configPath = path.join(process.cwd(), 'token-config.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      PASS_TOKEN_MINT = new PublicKey(config.mintAddress);
    }
  } catch (error) {
    console.log('Token config not loaded on server');
  }
} else {
  // Client-side - will fetch from API
  PASS_TOKEN_MINT = new PublicKey('11111111111111111111111111111111');
}

export async function getConnection(): Promise<Connection> {
  return new Connection(RPC_ENDPOINT, 'confirmed');
}

/**
 * Get the token account address for a given wallet
 */
export async function getTokenAccount(
  walletPublicKey: PublicKey,
  mintPublicKey: PublicKey = PASS_TOKEN_MINT
): Promise<PublicKey> {
  return await getAssociatedTokenAddress(
    mintPublicKey,
    walletPublicKey,
    false,
    TOKEN_2022_PROGRAM_ID
  );
}

/**
 * Get token balance (will be encrypted for confidential transfers)
 * Returns the pending balance which is visible before applying confidential transfers
 */
export async function getTokenBalance(
  walletPublicKey: PublicKey,
  mintPublicKey: PublicKey = PASS_TOKEN_MINT
): Promise<number | null> {
  try {
    const connection = await getConnection();
    const tokenAccount = await getTokenAccount(walletPublicKey, mintPublicKey);
    
    const accountInfo = await connection.getAccountInfo(tokenAccount);
    if (!accountInfo) {
      return 0; // No account = no tokens
    }
    
    const account = await getAccount(
      connection,
      tokenAccount,
      'confirmed',
      TOKEN_2022_PROGRAM_ID
    );
    
    // For confidential transfers, the balance might be encrypted
    // We return the amount as a number (represents base units)
    return Number(account.amount);
  } catch (error) {
    console.error('Error fetching token balance:', error);
    return null;
  }
}

/**
 * Check if wallet has minimum balance
 */
export async function checkEligibility(
  walletPublicKey: PublicKey,
  minBalance: number = 100 // 100 tokens threshold
): Promise<boolean> {
  const balance = await getTokenBalance(walletPublicKey);
  if (balance === null) return false;
  return balance >= minBalance;
}

/**
 * Claim tokens from the faucet
 */
export async function claimTokens(walletAddress: string): Promise<{
  success: boolean;
  signature?: string;
  amount?: number;
  error?: string;
  message?: string;
  nextClaimAt?: number;
}> {
  try {
    const response = await fetch('/api/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletAddress }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error,
        message: data.message,
        nextClaimAt: data.nextClaimAt,
      };
    }
    
    return {
      success: true,
      signature: data.signature,
      amount: data.amount,
    };
  } catch (error: any) {
    return {
      success: false,
      error: 'Network error',
      message: error.message,
    };
  }
}

/**
 * Generate zero-knowledge proof (simulated for now)
 * In production, this would use actual ZK proof libraries
 */
export interface Proof {
  publicInputs: string[];
  proof: string;
  timestamp: number;
}

export async function generateZKProof(
  walletPublicKey: PublicKey,
  threshold: number = 100 // 100 tokens threshold
): Promise<Proof> {
  // Verify user actually has the balance
  const hasBalance = await checkEligibility(walletPublicKey, threshold);
  if (!hasBalance) {
    throw new Error('Insufficient balance to generate proof');
  }

  // Simulate proof generation delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Mock proof structure
  return {
    publicInputs: [
      walletPublicKey.toBase58(),
      threshold.toString(),
    ],
    proof: generateMockProof(),
    timestamp: Date.now(),
  };
}

function generateMockProof(): string {
  // Generate realistic-looking proof string
  const chars = '0123456789abcdef';
  let proof = '0x';
  for (let i = 0; i < 256; i++) {
    proof += chars[Math.floor(Math.random() * chars.length)];
  }
  return proof;
}

/**
 * Verify a zero-knowledge proof (off-chain for now)
 */
export async function verifyProof(proof: Proof): Promise<boolean> {
  // In production: verify proof cryptographically
  // For now: basic validation
  await new Promise(resolve => setTimeout(resolve, 500));
  return proof.proof.startsWith('0x') && proof.publicInputs.length > 0;
}

/**
 * Load token config from server
 */
export async function loadTokenConfig(): Promise<{
  mintAddress: string;
  network: string;
  decimals: number;
} | null> {
  try {
    const response = await fetch('/api/config');
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Failed to load token config:', error);
    return null;
  }
}