'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import Link from 'next/link';
import WalletButton from '@/components/WalletButton';
import BalanceDisplay from '@/components/BalanceDisplay';
import ProofGenerator from '@/components/ProofGenerator';
import AccessGate from '@/components/AccessGate';

export default function DemoPage() {
  const { connected } = useWallet();
  const [hasProof, setHasProof] = useState(false);

  return (
    <main className="min-h-screen p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <Link href="/" className="text-solana-purple hover:text-solana-green transition-colors">
          ← Back to Home
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-solana-purple to-solana-green bg-clip-text text-transparent">
            Private Access Demo
          </h1>
          <p className="text-xl text-gray-400">
            Connect your wallet to experience zero-knowledge access control
          </p>
        </motion.div>

        {/* Step 1: Connect Wallet */}
        <div className="mb-8">
          <StepCard number={1} title="Connect Your Wallet" active={!connected}>
            <div className="flex justify-center">
              <WalletButton />
            </div>
          </StepCard>
        </div>

        {/* Step 2: View Balance */}
        <AnimatePresence>
          {connected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <StepCard number={2} title="Your Encrypted Balance" active={connected && !hasProof}>
                <BalanceDisplay />
              </StepCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 3: Generate Proof */}
        <AnimatePresence>
          {connected && !hasProof && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <StepCard number={3} title="Prove Eligibility" active={connected && !hasProof}>
                <ProofGenerator onProofGenerated={() => setHasProof(true)} />
              </StepCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 4: Access Granted */}
        <AnimatePresence>
          {hasProof && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <StepCard number={4} title="Access Granted" active={hasProof}>
                <AccessGate />
              </StepCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="max-w-4xl mx-auto mt-16 text-center text-gray-500 text-sm"
      >
        <p>This demo uses Solana Devnet. No real tokens are involved.</p>
        <p className="mt-2">Need test tokens? DM us on Twitter for an airdrop.</p>
      </motion.div>
    </main>
  );
}

function StepCard({ 
  number, 
  title, 
  children, 
  active 
}: { 
  number: number; 
  title: string; 
  children: React.ReactNode;
  active: boolean;
}) {
  return (
    <motion.div
      className={`glass p-8 rounded-2xl transition-all duration-300 ${
        active ? 'border-solana-purple shadow-lg shadow-solana-purple/20' : 'opacity-60'
      }`}
    >
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
          active 
            ? 'bg-gradient-to-r from-solana-purple to-solana-green' 
            : 'bg-gray-700'
        }`}>
          {number}
        </div>
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      <div>{children}</div>
    </motion.div>
  );
}