import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount, transfer } from '@solana/spl-token';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';

const TokenSender: React.FC = () => {
  const { connected, publicKey, wallet } = useWallet();
  const [sending, setSending] = useState(false);
  const [mintAddress, setMintAddress] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');

  const handleSendTokens = async () => {
    if (!connected || !publicKey || !wallet) return;

    try {
      setSending(true);
      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      const mintPubkey = new PublicKey(mintAddress);
      const recipient = new PublicKey(recipientAddress);

      const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        wallet,
        mintPubkey,
        publicKey
      );

      const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        wallet,
        mintPubkey,
        recipient
      );

      await transfer(
        connection,
        wallet,
        senderTokenAccount.address,
        recipientTokenAccount.address,
        publicKey,
        Number(amount)
      );

      toast.success(`Successfully sent ${amount} tokens!`);
      setAmount('');
      setRecipientAddress('');
    } catch (error) {
      console.error('Error sending tokens:', error);
      toast.error('Failed to send tokens');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-xl shadow-lg">
      <div className="flex items-center space-x-2 mb-4">
        <Send className="h-6 w-6 text-blue-400" />
        <h2 className="text-xl font-semibold">Send Tokens</h2>
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
            className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter mint address"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Recipient Address
          </label>
          <input
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter recipient address"
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
            className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter amount to send"
            min="0"
          />
        </div>

        <button
          onClick={handleSendTokens}
          disabled={!connected || sending || !mintAddress || !recipientAddress || !amount}
          className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
        >
          {sending ? 'Sending...' : 'Send Tokens'}
        </button>
      </div>
    </div>
  );
};

export default TokenSender;