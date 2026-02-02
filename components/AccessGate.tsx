'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function AccessGate() {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      {/* Confetti Effect */}
      {showConfetti && <Confetti />}

      {/* Success Message */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="text-center mb-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-block text-8xl mb-4"
        >
        </motion.div>
        <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-solana-purple to-solana-green bg-clip-text text-transparent">
          Access Granted!
        </h2>
        <p className="text-xl text-gray-400">
          Access Proven. Your balance remains private.
        </p>
      </motion.div>

      {/* Exclusive Content */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="glass-hover p-8 rounded-2xl space-y-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-solana-purple to-solana-green flex items-center justify-center text-2xl">
            👑
          </div>
          <h3 className="text-2xl font-bold">Welcome to the VIP Room</h3>
        </div>

        <p className="text-gray-300 leading-relaxed">
          This is exclusive content only accessible to verified token holders. 
          In a real application, this could be:
        </p>

        <ul className="space-y-3">
          <ExclusiveItem icon="🎫" text="Early access to NFT drops" />
          <ExclusiveItem icon="💬" text="Private Discord channels" />
          <ExclusiveItem icon="🎁" text="Exclusive airdrops and rewards" />
          <ExclusiveItem icon="📊" text="Premium analytics and tools" />
          <ExclusiveItem icon="🎯" text="Priority support and features" />
        </ul>

        <div className="pt-6 border-t border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="text-green-400"></span>
            <span>Proof verified • Your balance remains private</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 grid grid-cols-3 gap-4"
      >
        <StatCard label="Proof" value="1,247" />
        <StatCard label="Privacy" value="100%" />
        <StatCard label="Protection" value="Fast" />
      </motion.div>
    </div>
  );
}

function ExclusiveItem({ icon, text }: { icon: string; text: string }) {
  return (
    <motion.li
      initial={{ x: -10, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="flex items-center gap-3 glass-hover p-3 rounded-lg"
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-gray-300">{text}</span>
    </motion.li>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-hover p-4 rounded-lg text-center">
      <div className="text-2xl font-bold bg-gradient-to-r from-solana-purple to-solana-green bg-clip-text text-transparent">
        {value}
      </div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
}

function Confetti() {
  const [dimensions, setDimensions] = useState({ width: 1000, height: 1000 });

  useEffect(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * dimensions.width,
            y: -20,
            rotate: Math.random() * 360,
          }}
          animate={{
            y: dimensions.height + 20,
            rotate: Math.random() * 360 + 720,
          }}
          transition={{
            duration: Math.random() * 2 + 2,
            ease: "linear",
            delay: Math.random() * 0.5,
          }}
          className="absolute w-3 h-3 rounded-full"
          style={{
            background: i % 2 === 0 ? '#9945FF' : '#14F195',
          }}
        />
      ))}
    </div>
  );
}