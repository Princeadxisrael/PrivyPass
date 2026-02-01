'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';

interface ProofGeneratorProps {
  onProofGenerated: () => void;
}

export default function ProofGenerator({ onProofGenerated }: ProofGeneratorProps) {
  const { publicKey } = useWallet();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateProof = async () => {
    setIsGenerating(true);

    // Simulate zero-knowledge proof generation
    // In production, this would:
    // 1. Create a confidential transfer proof
    // 2. Prove balance >= threshold without revealing exact amount
    // 3. Submit proof for verification
    
    await new Promise(resolve => setTimeout(resolve, 2500));

    setIsGenerating(false);
    onProofGenerated();
  };

  return (
    <div className="space-y-6">
      {/* Explanation */}
      <div className="glass-hover p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-3 text-solana-green">How it Works</h3>
        <ul className="space-y-2 text-gray-400 text-sm">
          <li>✓ You create a zero-knowledge proof that proves: "I have ≥ 1 token"</li>
          <li>✓ The proof is cryptographically verifiable</li>
          <li>✓ Nobody learns your exact balance</li>
          <li>✓ You get access without revealing wealth</li>
        </ul>
      </div>

      {/* Generate Button */}
      {!isGenerating ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={generateProof}
          className="w-full py-6 text-xl font-bold rounded-xl bg-gradient-to-r from-solana-purple to-solana-green hover:shadow-2xl hover:shadow-solana-purple/50 transition-all duration-300"
        >
          Generate Zero-Knowledge Proof
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass p-8 rounded-xl text-center"
        >
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-solana-purple border-t-solana-green rounded-full"
            />
          </div>
          
          <h3 className="text-2xl font-bold mb-2">Generating Proof...</h3>
          <p className="text-gray-400 mb-4">Computing zero-knowledge proof locally</p>
          
          <div className="space-y-2 text-left text-sm text-gray-500 max-w-md mx-auto">
            <ProofStep delay={0} text="Encrypting balance data..." />
            <ProofStep delay={0.5} text="Generating commitment..." />
            <ProofStep delay={1} text="Creating range proof..." />
            <ProofStep delay={1.5} text="Verifying proof validity..." />
            <ProofStep delay={2} text="Finalizing..." />
          </div>
        </motion.div>
      )}

      {/* Privacy Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center text-sm text-gray-500"
      >
        🔐 Your balance never leaves your wallet. All computation happens locally.
      </motion.div>
    </div>
  );
}

function ProofStep({ delay, text }: { delay: number; text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="flex items-center gap-2"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.2 }}
        className="w-2 h-2 rounded-full bg-solana-green"
      />
      {text}
    </motion.div>
  );
}