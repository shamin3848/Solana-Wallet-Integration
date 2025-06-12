import React, { useEffect, useState } from 'react';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Toaster } from 'react-hot-toast';
import { Wallet, Coins, Send } from 'lucide-react';
import { WalletProvider } from './contexts/WalletContext';
import WalletConnect from './components/WalletConnect';
import TokenCreator from './components/TokenCreator';
import TokenMinter from './components/TokenMinter';
import TokenSender from './components/TokenSender';
import TransactionHistory from './components/TransactionHistory';

function App() {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Coins className="h-8 w-8 text-yellow-400" />
                <h1 className="text-2xl font-bold">Solana Token Manager</h1>
              </div>
              <WalletConnect />
            </div>
          </header>

          <main className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <TokenCreator />
              <TokenMinter />
              <TokenSender />
            </div>
            
            <TransactionHistory />
          </main>
        </div>
        <Toaster position="bottom-right" />
      </div>
    </WalletProvider>
  );
}

export default App;