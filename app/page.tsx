'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Header with Logo and CTA */}
      <header className="w-full px-8 py-6 flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="px-6 py-3 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 shadow-2xl">
            <div className="relative">
              {/* Glossy overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent rounded-xl"></div>
              <span className="relative text-2xl font-bold bg-gradient-to-r from-solana-purple to-solana-green bg-clip-text text-transparent">
                Pass
              </span>
            </div>
          </div>
        </motion.div>

        {/* Try Demo Button in Header */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/demo">
            <button className="px-8 py-4 text-lg font-bold rounded-full bg-gradient-to-r from-[#14F195] via-[#9945FF] to-[#00D4FF] hover:shadow-2xl hover:shadow-solana-green/50 transition-all duration-300 hover:scale-105 text-white">
              Try the Demo →
            </button>
          </Link>
        </motion.div>
      </header>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 -mt-20">
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
            Prove access without revealing your holdings.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
          <FeatureCard
            icon="🔐"
            title="Encrypted Balances"
            description="Your token balance stays hidden on-chain. Nobody can see how many tokens you hold."
            delay={0.2}
          />
          <FeatureCard
            icon=""
            title="Zero-Knowledge Proofs"
            description="Prove you meet requirements without revealing exact amounts. Math, not trust."
            delay={0.4}
          />
          <FeatureCard
            icon="🎫"
            title="Private Access"
            description="Get exclusive perks, early access, or VIP status without exposing your wealth."
            delay={0.6}
          />
        </div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-4 text-gray-500"
        >
          Built on Solana • Powered by Token-2022
        </motion.p>
      </div>
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
      className="glass glass-hover p-8 rounded-3xl"
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