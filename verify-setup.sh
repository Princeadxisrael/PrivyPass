#!/bin/bash

echo "🔍 Verifying PASS Token Setup..."
echo "================================="
echo ""

# Check if token-config.json exists
if [ -f "token-config.json" ]; then
    echo "✅ Token config found"
    
    # Extract and display config
    MINT=$(cat token-config.json | grep -o '"mintAddress": "[^"]*' | cut -d'"' -f4)
    NETWORK=$(cat token-config.json | grep -o '"network": "[^"]*' | cut -d'"' -f4)
    
    echo "   Mint: $MINT"
    echo "   Network: $NETWORK"
    echo ""
else
    echo "❌ Token config not found"
    echo "   Run: npm run setup:token"
    exit 1
fi

# Check if mint authority exists
if [ -f ".keys/mint-authority.json" ]; then
    echo "✅ Mint authority keypair found"
else
    echo "❌ Mint authority not found"
    echo "   Run: npm run setup:token"
    exit 1
fi

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo "✅ Dependencies installed"
else
    echo "❌ Dependencies not installed"
    echo "   Run: npm install"
    exit 1
fi

echo ""
echo "📊 Testing API endpoints..."
echo ""

# Check if server is running
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "✅ Development server is running"
    
    # Test config endpoint
    echo ""
    echo "Testing /api/config..."
    RESPONSE=$(curl -s http://localhost:3000/api/config)
    if echo "$RESPONSE" | grep -q "mintAddress"; then
        echo "✅ Config API working"
        echo "   Response: $RESPONSE"
    else
        echo "⚠️  Config API returned unexpected response"
        echo "   Response: $RESPONSE"
    fi
else
    echo "⚠️  Development server not running"
    echo "   Start with: npm run dev"
fi

echo ""
echo "🌐 Explorer Links:"
echo "   Mint: https://explorer.solana.com/address/$MINT?cluster=$NETWORK"
echo ""
echo "✨ Setup verification complete!"
echo ""
echo "Next steps:"
echo "1. Start dev server: npm run dev"
echo "2. Visit: http://localhost:3000/demo"
echo "3. Connect wallet and claim tokens"
echo "4. Generate proof and access content"