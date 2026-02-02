'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-4xl mx-auto"
      >
        <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-solana-purple to-solana-green bg-clip-text text-transparent">
          Prove Your Access.
        </h1>
        <h2 className="text-4xl md:text-6xl font-bold mb-8">
          Keep Your Holdings Private.
        </h2>
        
        <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto">
          Token-gated access powered by zero-knowledge proofs on Solana. 
          Prove your eligibility without revealing your balance.
        </p>
      </motion.div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
        <FeatureCard
          icon="🔐"
          title="Encrypted Balances"
          description="Your token balance stays hidden on-chain. Nobody can see how many tokens you hold."
          delay={0.2}
        />
        <FeatureCard
          icon="✨"
          title="Zero-Knowledge Proofs"
          description="Prove you meet requirements without revealing exact amounts."
          delay={0.4}
        />
        <FeatureCard
          icon="🎫"
          title="Private Access"
          description="Get exclusive perks, early access, or VIP status while keeping your holdings private."
          delay={0.6}
        />
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Link href="/demo">
          <button className="px-12 py-6 text-2xl font-bold rounded-2xl bg-gradient-to-r from-solana-purple to-solana-green hover:shadow-2xl hover:shadow-solana-purple/50 transition-all duration-300 hover:scale-105">
            Try the Demo 
          </button>
        </Link>
      </motion.div>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="mt-8 text-gray-500"
      >
        Built on Solana • Powered by Confidential Transfers
      </motion.p>
    </main>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  delay 
}: { 
  icon: string; 
  title: string; 
  description: string; 
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="glass glass-hover p-8 rounded-2xl"
    >
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-solana-purple to-solana-green bg-clip-text text-transparent">
        {title}
      </h3>
      <p className="text-gray-400 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}