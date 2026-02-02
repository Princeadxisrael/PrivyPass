# Private Pass 🔐

Token-gated access with zero-knowledge proofs on Solana. Prove your access while being fully private.

## What This Does

This demo showcases the **concept** of confidential token-gated access on Solana:

1. **Token with CT Extension** - Token-2022 mint with ConfidentialTransferMint enabled
2. **Public Balance** - Users hold tokens (visible for demo purposes)
3. **Access Control** - Generate proofs to verify eligibility without revealing exact balance
4. **Privacy UX** - Demonstrates the user experience of confidential access

**Note:** Full confidential transfer implementation (deposit→apply→transfer→withdraw with ZK proofs) requires Rust libraries not available in TypeScript. See [TYPESCRIPT_LIMITATIONS.md](/TYPESCRIPT_LIMITATIONS.md) for details.


## Use Cases

-  Event access without revealing ticket tier
-  Community membership verification without exposing holdings
-  Discount eligibility without showing balance
-  Early access programs with privacy preservation
-  VIP perks without wealth disclosure

## Tech Stack

- **Next.js 14** -
- **Solana Web3.js**
- **SPL Token** 
- **Framer Motion** 
- **Tailwind CSS** -

## Quick Start

### First step: Create the Token (Required First before running demo!)

```bash
# Install dependencies
npm install

# Create PASS token with confidential transfers
npm run setup:token

# Verify setup
./verify-setup.sh
```

This creates:
- Token-2022 mint with confidential transfer extension
- Mint authority keypair (saved to `.keys/`)
- Token configuration (saved to `token-config.json`)

See [token.md](/token.md) for detailed instructions.

### Run the Demo

### 1. Install Dependencies

```bash
npm install
```

**Having wallet connection issues?** Run the fix script:
```bash
./fix-wallet.sh
```

This will:
- Clean all build artifacts
- Reinstall dependencies
- Verify wallet adapters are installed correctly

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 3. Common Issues & Fixes

**Wallet button keeps loading / doesn't popup:**
- Run `./fix-wallet.sh` to reinstall dependencies
- Clear browser cache and refresh
- Make sure Phantom extension is installed and enabled
- Check that popup blockers aren't blocking Phantom
- Ensure you're on Devnet in Phantom settings

**Hydration errors:**
- Delete `.next` folder: `rm -rf .next`
- Restart dev server: `npm run dev`

**"Duplicate keys" error:**
- This is now fixed by using only Phantom adapter
- If you still see it, run `./fix-wallet.sh`

### 4. Test the Demo

1. Click "Try the Demo"
2. Connect your Phantom/Solflare wallet (Devnet)
3. **Click "Claim Free PASS Tokens"** - Get 3 tokens (24hr cooldown)
4. Wait for transaction confirmation  
5. View your balance update
6. Generate a zero-knowledge proof
7. Get access to exclusive content

**Token System:**
- 3 PASS tokens per claim
- 24-hour cooldown between claims
- Automatic token account creation with confidential transfers
- Manual airdrop: `npm run airdrop <address> <amount>`
4. Generate a zero-knowledge proof
5. Get access to exclusive content

## Next Steps (Part A - Token Creation)

To make this fully functional:

1. Create PASS token mint with confidential transfer extension
2. Set up token distribution mechanism
3. Integrate actual ZK proof generation
4. Deploy verification smart contract

## Project Structure

```
private-pass/
├── app/
│   ├── page.tsx          
│   ├── demo/
│   │   └── page.tsx      # Main demo flow
│   └── providers.tsx     
├── components/
│   ├── BalanceDisplay.tsx    
│   ├── ProofGenerator.tsx    
│   └── AccessGate.tsx        
└── lib/
    └── solana.ts         
```

