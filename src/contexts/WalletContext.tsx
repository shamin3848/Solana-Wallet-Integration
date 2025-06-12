import React, { createContext, useContext, useState, useEffect } from 'react';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

interface WalletContextType {
  wallet: any | null;
  connected: boolean;
  balance: number;
  connecting: boolean;
  publicKey: PublicKey | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType>({
  wallet: null,
  connected: false,
  balance: 0,
  connecting: false,
  publicKey: null,
  connect: async () => {},
  disconnect: async () => {},
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<any | null>(null);
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const [balance, setBalance] = useState(0);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    const getProvider = () => {
      if ('phantom' in window) {
        const provider = (window as any).phantom?.solana;
        if (provider?.isPhantom) return provider;
      }
      window.open('https://phantom.app/', '_blank');
    };

    const provider = getProvider();
    setWallet(provider);
  }, []);

  useEffect(() => {
    if (wallet) {
      wallet.on('connect', (publicKey: PublicKey) => {
        setPublicKey(publicKey);
        setConnected(true);
        setConnecting(false);
      });
      wallet.on('disconnect', () => {
        setPublicKey(null);
        setConnected(false);
      });
    }
  }, [wallet]);

  useEffect(() => {
    const updateBalance = async () => {
      if (publicKey) {
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
        const balance = await connection.getBalance(publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
    };

    updateBalance();
    const interval = setInterval(updateBalance, 10000);
    return () => clearInterval(interval);
  }, [publicKey]);

  const connect = async () => {
    try {
      setConnecting(true);
      await wallet?.connect();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      await wallet?.disconnect();
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connected,
        balance,
        connecting,
        publicKey,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};