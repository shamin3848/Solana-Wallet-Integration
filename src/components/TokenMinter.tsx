import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { mintTo, getMint, getOrCreateAssociatedTokenAccount } from '@solana/spl-token';
import { Coins } from 'lucide-react';
import toast from 'react-hot-toast';

const TokenMinter: React.FC = () => {
  const { connected, publicKey, wallet } = useWallet();
  const [minting, setMinting] = useState(false);
  const [mintAddress, setMintAddress] = useState('');
  const [amount, setAmount] = useState('');

  const handleMintTokens = async () => {
    if (!connected || !publicKey || !wallet) return;

    try {
      setMinting(true);
      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      const mintPubkey = new PublicKey(mintAddress);
      
      const mintInfo = await getMint(connection, mintPubkey);
      const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        wallet,
        mintPubkey,
        publicKey
      );

      await mintTo(
        connection,
        wallet,
        mintPubkey,
        tokenAccount.address,
        publicKey,
        Number(amount) * (10 ** mintInfo.decimals)
      );

      toast.success(`Successfully minted ${amount} tokens!`);
      setAmount('');
    } catch (error) {
      console.error('Error minting tokens:', error);
      toast.error('Failed to mint tokens');
    } finally {
      setMinting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-xl shadow-lg">
      <div className="flex items-center space-x-2 mb-4">
        <Coins className="h-6 w-6 text-green-400" />
        <h2 className="text-xl font-semibold">Mint Tokens</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Token Mint Address
          </label>
          <input
            type="text"
            value={mintAddress}
            onChange={(e) => setMintAddress(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="Enter mint address"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="Enter amount to mint"
            min="0"
          />
        </div>

        <button
          onClick={handleMintTokens}
          disabled={!connected || minting || !mintAddress || !amount}
          className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
        >
          {minting ? 'Minting...' : 'Mint Tokens'}
        </button>
      </div>
    </div>
  );
};

export default TokenMinter;