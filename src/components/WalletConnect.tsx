import React from 'react';
import { Wallet } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';

const WalletConnect: React.FC = () => {
  const { connected, connecting, connect, disconnect, publicKey, balance } = useWallet();

  return (
    <div className="flex items-center space-x-4">
      {connected && (
        <div className="text-sm">
          <p className="text-gray-300">
            {publicKey?.toString().slice(0, 4)}...
            {publicKey?.toString().slice(-4)}
          </p>
          <p className="text-yellow-400">{balance.toFixed(4)} SOL</p>
        </div>
      )}
      <button
        onClick={connected ? disconnect : connect}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
          connected
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-purple-500 hover:bg-purple-600'
        } transition-colors`}
        disabled={connecting}
      >
        <Wallet className="h-5 w-5" />
        <span>
          {connecting
            ? 'Connecting...'
            : connected
            ? 'Disconnect'
            : 'Connect Wallet'}
        </span>
      </button>
    </div>
  );
};

export default WalletConnect;