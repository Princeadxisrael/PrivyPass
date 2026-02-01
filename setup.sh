#!/bin/bash

echo "🚀 Setting up Private Pass Demo..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js detected: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✨ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Run 'npm run dev' to start the development server"
echo "2. Open http://localhost:3000 in your browser"
echo "3. Connect your Phantom wallet (make sure you're on Devnet)"
echo "4. Try the demo!"
echo ""
echo "🔧 To complete the full implementation:"
echo "- Create the PASS token mint with confidential transfers (Part A)"
echo "- Set up token distribution"
echo "- Integrate real ZK proof generation"
echo ""
echo "Keep building!"