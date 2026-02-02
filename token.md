# Setup Guide: Token Creation

This guide walks you through creating the PASS token with confidential transfers.

## Prerequisites

- Node.js 18+ installed
- Solana CLI installed (optional, for verification)
- Some SOL on Devnet (airdropped automatically)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Create the PASS Token

This creates a Token-2022 mint with confidential transfer extension:

```bash
npm run setup:token
```

**What this does:**
- Creates a new keypair for mint authority
- Airdrops 2 SOL to the mint authority
- Creates a Token-2022 mint with confidential transfer extension
- Saves configuration to `token-config.json`
- Saves mint authority keypair to `.keys/mint-authority.json`

**Output:**
```
🚀 Creating PASS Token with Confidential Transfers...
🔑 Creating new mint authority...
💰 Airdropping SOL to mint authority...
   ✅ Airdropped 2 SOL

Mint Authority: ABC123...
Mint Address: XYZ789...

✅ Transaction confirmed!
   Signature: abc123...
   Explorer: https://explorer.solana.com/tx/...

🎉 PASS Token created successfully!
```

**Important Files Created:**
- `token-config.json` - Contains mint address and config
- `.keys/mint-authority.json` - Private key for minting tokens (KEEP SECRET!)

## Step 3: Start the Development Server

```bash
npm run dev
```

Visit: http://localhost:3000/demo

## Step 4: Test the Flow

1. **Connect Wallet** - Use Phantom on Devnet
2. **View Balance** - Should show 0 PASS tokens
3. **Claim Tokens** - Click "Claim Free PASS Tokens" button
4. **Wait for Confirmation** - Transaction processes on-chain
5. **Generate Proof** - Once you have tokens, generate ZK proof
6. **Access Granted** - See exclusive content

## Manual Airdrop (Optional)

You can manually airdrop tokens to any address:

```bash
npm run airdrop <wallet-address> <amount>
```

Example:
```bash
npm run airdrop 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU 5
```

## Architecture Overview

### Token Structure
```
PASS Token (Token-2022)
├── Mint Authority: Controls token supply
├── Extensions: Confidential Transfer
├── Decimals: 0 (whole tokens only)
└── Network: Devnet
```

### Confidential Transfer Flow
```
1. User connects wallet
2. Token account created with CT extension
3. Tokens minted to user (visible balance)
4. User can encrypt balance (optional)
5. Proof generated from encrypted/visible balance
6. Access granted if proof valid
```

### Components
- `scripts/token/create-mint.ts` 
- `scripts/token/airdrop.ts` 
- `app/api/claim/route.ts` 
- `lib/solana.ts` 
- `components/BalanceDisplay.tsx` 

## Troubleshooting

### "Token config not found"
Run `npm run setup:token` first

### "Insufficient funds"
Make sure mint authority has SOL:
```bash
solana balance <mint-authority-pubkey> --url devnet
```

### "Account already exists"
Token was already created. Check `token-config.json` for details.

### "Transaction failed"
- Check Devnet status: https://status.solana.com/
- Verify mint authority has SOL
- Try again (Devnet can be unstable)

## Security Notes

**IMPORTANT:**
- `.keys/mint-authority.json` contains the private key for minting
- Never commit this file to version control
- In production, use a secure key management system
- The mint authority can create unlimited tokens

## Next Steps

Once tokens are working:
1. Test the full flow (claim → proof → access)
2. Return to Part B for UI improvements
3. Implement on-chain proof verification (Option A upgrade)
4. Deploy to production environment

## Verification

Check your token on Solana Explorer:
```
https://explorer.solana.com/address/<MINT_ADDRESS>?cluster=devnet
```

You should see:
- Token-2022 Program
- Confidential Transfer Extension enabled
- Mint authority set
- Total supply = amount minted

---
