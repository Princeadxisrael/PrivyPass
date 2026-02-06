'use client';

import { useState,useEffect } from 'react';
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

    // Reset proof state when wallet disconnects
  useEffect(() => {
    if (!connected) {
      setHasProof(false);
    }
  }, [connected]);

  return (
    <main className="min-h-screen p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#14F195] to-[#00D4FF] text-white font-bold hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300"
          >
            ← Back to Home
          </motion.button>
        </Link>
      </div>

<div className="sticky top-6 flex justify-end z-[1000] opacity-90 hover:opacity-100 transition-opacity">
  <WalletButton />
</div>

      {/* Main */}
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-solana-purple to-solana-green bg-clip-text text-transparent">
            Private Access Demo
          </h1>
          <p className="text-xl text-gray-400">
            Connect your wallet to experience zero-knowledge access 
          </p>
        </motion.div>
      
        {/* Connect Wallet */}
        <AnimatePresence>
        {!connected && (
        
        <motion.div>
          <StepCard  title="Connect Wallet" active={true} children={undefined}>
          </StepCard>
        </motion.div>
        )}
        </AnimatePresence>

        {/*  View Balance */}
        <AnimatePresence>
          {connected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-12"
            >
              <StepCard  title="Your Token Balance" active={connected && !hasProof}>
                <BalanceDisplay />
              </StepCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/*  Generate Proof */}
        <AnimatePresence>
          {connected && !hasProof && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-12"
            >
              <StepCard  title="Prove Eligibility" active={connected && !hasProof}>
                <ProofGenerator onProofGenerated={() => setHasProof(true)} />
              </StepCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Access Granted */}
        <AnimatePresence>
          {hasProof && connected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <StepCard  title="Access Granted" active={hasProof}>
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
        className="max-w-4xl mx-auto mt-20 text-center text-gray-500 text-sm"
      >
        <p>This demo uses Solana Devnet. No real tokens are involved.</p>
      </motion.div>
    </main>
  );
}

function StepCard({ 
  // number, 
  title, 
  children, 
  active 
}: { 
  // number: number; 
  title: string; 
  children: React.ReactNode;
  active: boolean;
}) {
  return (
    <motion.div
      className={`p-8 rounded-3xl transition-all duration-300 border-2 overflow-visible ${
        active 
          ? 'border-solana-purple shadow-xl shadow-solana-purple/30' 
          : 'border-transparent opacity-60'
      }`}
    >
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
          active 
            ? 'bg-gradient-to-r from-solana-purple to-solana-green' 
            : 'bg-gray-700'
        }`}>
          {/* {number} */}
        </div>
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      <div>{children}</div>
    </motion.div>
  );
}