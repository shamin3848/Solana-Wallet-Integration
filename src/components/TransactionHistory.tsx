import React, { useEffect, useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { Connection, clusterApiUrl } from '@solana/web3.js';
import { History } from 'lucide-react';

const TransactionHistory: React.FC = () => {
  const { connected, publicKey } = useWallet();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!connected || !publicKey) return;

      try {
        setLoading(true);
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
        const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 10 });
        
        const txns = await Promise.all(
          signatures.map(async (sig) => {
            const tx = await connection.getTransaction(sig.signature);
            return {
              signature: sig.signature,
              timestamp: sig.blockTime,
              status: tx?.meta?.err ? 'Failed' : 'Success',
            };
          })
        );

        setTransactions(txns);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
    const interval = setInterval(fetchTransactions, 30000);
    return () => clearInterval(interval);
  }, [connected, publicKey]);

  if (!connected) return null;

  return (
    <div className="p-6 bg-gray-800 rounded-xl shadow-lg">
      <div className="flex items-center space-x-2 mb-4">
        <History className="h-6 w-6 text-yellow-400" />
        <h2 className="text-xl font-semibold">Transaction History</h2>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading transactions...</div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-4 text-gray-400">No transactions found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400">
                <th className="pb-2">Signature</th>
                <th className="pb-2">Time</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.signature} className="border-t border-gray-700">
                  <td className="py-2">
                    <a
                      href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      {tx.signature.slice(0, 8)}...{tx.signature.slice(-8)}
                    </a>
                  </td>
                  <td className="py-2">
                    {tx.timestamp
                      ? new Date(tx.timestamp * 1000).toLocaleString()
                      : 'Unknown'}
                  </td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        tx.status === 'Success'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;