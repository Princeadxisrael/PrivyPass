#!/bin/bash

echo "🔧 Fixing Wallet Connection Issues..."
echo "====================================="
echo ""

# Step 1: Clean everything
echo "1️⃣ Cleaning build artifacts and dependencies..."
rm -rf .next node_modules package-lock.json
echo "   ✅ Cleaned"
echo ""

# Step 2: Install dependencies
echo "2️⃣ Installing fresh dependencies..."
npm install
echo "   ✅ Dependencies installed"
echo ""

# Step 3: Verify installation
echo "3️⃣ Verifying installation..."
if [ -d "node_modules/@solana/wallet-adapter-phantom" ]; then
    echo "   ✅ Phantom wallet adapter installed"
else
    echo "   ❌ Phantom wallet adapter missing!"
fi

if [ -d "node_modules/@solana/wallet-adapter-react" ]; then
    echo "   ✅ React wallet adapter installed"
else
    echo "   ❌ React wallet adapter missing!"
fi
echo ""

echo "✨ Fix complete!"
echo ""
echo "🚀 Next steps:"
echo "1. Run: npm run dev"
echo "2. Open: http://localhost:3000/demo"
echo "3. Make sure Phantom is installed and set to Devnet"
echo "4. Click 'Select Wallet' button"
echo "5. Choose Phantom from the modal"
echo ""
echo "💡 Tips:"
echo "- If Phantom doesn't popup, check your browser extensions"
echo "- Make sure popup blockers aren't blocking Phantom"
echo "- Try refreshing the page if wallet doesn't connect"
echo ""