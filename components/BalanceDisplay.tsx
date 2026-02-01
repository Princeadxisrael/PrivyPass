'use client';

import { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { getTokenBalance, claimTokens } from '@/lib/solana';

export default function BalanceDisplay() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [claimResult, setClaimResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const fetchBalance = async () => {
    if (!publicKey) return;
    
    setLoading(true);
    try {
      const bal = await getTokenBalance(publicKey);
      setBalance(bal);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [publicKey, connection]);

  const handleClaim = async () => {
    if (!publicKey || claiming) return;
    
    setClaiming(true);
    setClaimResult(null);
    
    try {
      const result = await claimTokens(publicKey.toBase58());
      
      if (result.success) {
        setClaimResult({
          success: true,
          message: `🎉 Successfully claimed ${result.amount} PASS tokens!`,
        });
        // Refresh balance after claim
        setTimeout(fetchBalance, 2000);
      } else {
        setClaimResult({
          success: false,
          message: result.message || result.error || 'Failed to claim tokens',
        });
      }
    } catch (error: any) {
      setClaimResult({
        success: false,
        message: error.message || 'Failed to claim tokens',
      });
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-solana-purple mx-auto mb-4"></div>
        <p className="text-gray-400">Checking token balance...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encrypted Balance Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-hover p-6 rounded-xl"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-400">On-Chain Balance:</span>
          <span className="text-2xl font-mono">██████████████</span>
        </div>
        <p className="text-sm text-gray-500">
          With confidential transfers, balances are encrypted on-chain. Only you can decrypt.
        </p>
      </motion.div>

      {/* Actual Balance */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-hover p-6 rounded-xl border-2 border-yellow-500/30"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-400">Your Balance:</span>
          <span className="text-3xl font-bold bg-gradient-to-r from-solana-purple to-solana-green bg-clip-text text-transparent">
            {balance !== null ? balance : '?'} PASS
          </span>
        </div>
        <p className="text-sm text-yellow-500/80">
          💡 This is your decrypted balance visible only to you via your wallet.
        </p>
      </motion.div>

      {/* Claim Button */}
      {balance !== null && balance < 100 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={handleClaim}
            disabled={claiming}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-solana-purple to-solana-green hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
          >
            {claiming ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Claiming Tokens...
              </span>
            ) : (
              ' Claim PASS Tokens'
            )}
          </button>
          
          {claimResult && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-3 p-3 rounded-lg ${
                claimResult.success
                  ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                  : 'bg-red-500/10 border border-red-500/30 text-red-400'
              }`}
            >
              {claimResult.message}
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Eligibility Status */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`p-4 rounded-lg ${
          balance && balance >= 100
            ? 'bg-green-500/10 border border-green-500/30'
            : 'bg-red-500/10 border border-red-500/30'
        }`}
      >
        {balance && balance >= 100 ? (
          <p className="text-green-400">✓ You're eligible! Proceed to generate proof.</p>
        ) : (
          <div>
            <p className="text-red-400 mb-2">✗ You need at least 100 PASS tokens to access.</p>
            {balance !== null && balance < 100 && (
              <p className="text-sm text-gray-500">Click the claim button above to get your tokens!</p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}