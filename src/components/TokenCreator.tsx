import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { Connection, clusterApiUrl } from '@solana/web3.js';
import { createMint } from '@solana/spl-token';
import { Coins } from 'lucide-react';
import toast from 'react-hot-toast';

const TokenCreator: React.FC = () => {
  const { connected, publicKey, wallet } = useWallet();
  const [creating, setCreating] = useState(false);
  const [decimals, setDecimals] = useState(9);

  const handleCreateToken = async () => {
    if (!connected || !publicKey || !wallet) return;

    try {
      setCreating(true);
      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      
      const mint = await createMint(
        connection,
        wallet,
        publicKey,
        publicKey,
        decimals
      );

      toast.success(`Token created! Mint address: ${mint.toBase58()}`);
    } catch (error) {
      console.error('Error creating token:', error);
      toast.error('Failed to create token');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-xl shadow-lg">
      <div className="flex items-center space-x-2 mb-4">
        <Coins className="h-6 w-6 text-purple-400" />
        <h2 className="text-xl font-semibold">Create Token</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Decimals
          </label>
          <input
            type="number"
            value={decimals}
            onChange={(e) => setDecimals(Number(e.target.value))}
            className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            min="0"
            max="9"
          />
        </div>

        <button
          onClick={handleCreateToken}
          disabled={!connected || creating}
          className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
        >
          {creating ? 'Creating...' : 'Create Token'}
        </button>
      </div>
    </div>
  );
};

export default TokenCreator;