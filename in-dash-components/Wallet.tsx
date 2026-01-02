'use client'

import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Transaction {
  id: string;
  amount: string | number; // Handle both string and number for Prisma Decimal
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'PAYMENT' | 'PAYOUT' | 'FEE';
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  date: string;
}

interface WalletData {
  currentBalance: string | number;
  pendingBalance: string | number;
  totalEarned: string | number;
  totalWithdrawn: string | number;
  recentTransactions: Transaction[];
}

interface WalletProps {
  initialData?: WalletData;
}

const mockData = {
  earnings: {
    monthlyData: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      earnings: [2000, 3000, 2500, 4000, 2000, 1500],
    },
  },
};

const Wallet: React.FC<WalletProps> = ({ initialData }) => {
  const [data, setData] = React.useState<WalletData | null>(initialData || null);
  const [loading, setLoading] = React.useState(!initialData);

  React.useEffect(() => {
    const fetchWallet = async () => {
      try {
        const username = window.location.pathname.split('/')[2]; // Get username from URL
        const response = await fetch(`/api/influencer2/${username}/wallet`);
        const walletData = await response.json();
        if (response.ok) {
          setData(walletData);
        } else {
          console.error('Failed to fetch wallet:', walletData.error);
        }
      } catch (error) {
        console.error('Error fetching wallet:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!initialData) {
      fetchWallet();
    }
  }, [initialData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading wallet...</div>;
  }

  if (!data) {
    return <div className="text-center py-8">No wallet data available</div>;
  }

  // Ensure we have a stable shape even if backend omitted some fields
  const safeData: WalletData = {
    currentBalance: data.currentBalance ?? 0,
    pendingBalance: data.pendingBalance ?? 0,
    totalEarned: data.totalEarned ?? 0,
    totalWithdrawn: data.totalWithdrawn ?? 0,
    recentTransactions: data.recentTransactions ?? [],
  };

  return (
    <div className="bg-[#232946] rounded-2xl shadow-lg p-8 flex flex-col gap-8 border border-[#7b52d3]">
      {/* Top Section - Earnings Overview */}
      <div className="grid grid-cols-2 gap-6">
        {/* Chart */}
        <div className="p-6 bg-white/5 backdrop-blur-lg rounded-xl">
          <h2 className="text-xl font-bold mb-4 text-[#7b52d3]">Earnings vs Goal</h2>
          <Bar
            data={{
              labels: mockData.earnings.monthlyData.labels,
              datasets: [
                {
                  label: 'Monthly Earnings',
                  data: mockData.earnings.monthlyData.earnings,
                  backgroundColor: 'rgba(123, 82, 211, 0.6)',
                  borderColor: 'rgba(123, 82, 211, 1)',
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
                title: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-lg">
              <p className="text-gray-400">Total Earnings</p>
              <p className="text-2xl font-bold text-[#7b52d3]">
                {formatCurrency(Number(safeData.totalEarned))}
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <p className="text-gray-400">Current Balance</p>
              <p className="text-2xl font-bold text-[#7b52d3]">
                {formatCurrency(Number(safeData.currentBalance))}
              </p>
            </div>
          </div>
        </div>

        {/* Current and Pending Balance */}
        <div className="p-6 bg-white/5 backdrop-blur-lg rounded-xl">
          <h2 className="text-xl font-bold mb-4 text-[#7b52d3]">Balance Overview</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-lg">
              <p className="text-gray-400">Pending Balance</p>
              <p className="text-2xl font-bold text-yellow-500">
                {formatCurrency(Number(safeData.pendingBalance))}
              </p>
              <p className="text-sm text-gray-400 mt-2">Awaiting clearance</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <p className="text-gray-400">Total Withdrawn</p>
              <p className="text-2xl font-bold text-pink-500">
                {formatCurrency(Number(safeData.totalWithdrawn))}
              </p>
              <p className="text-sm text-gray-400 mt-2">All time</p>
            </div>
          </div>
          <div className="mt-4">
            <button className="px-4 py-2 bg-[#7b52d3] text-white rounded-lg font-bold shadow hover:bg-[#5a3ca0]">
              Withdraw Funds
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section - Transactions */}
      <div className="p-6 bg-white/5 backdrop-blur-lg rounded-xl">
        <h2 className="text-xl font-bold mb-4 text-[#7b52d3]">Recent Transactions</h2>
        <div className="space-y-4">
          {safeData.recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-white/5 p-4 rounded-lg flex justify-between items-center"
            >
              <div className="flex flex-col">
                <span className="text-gray-300 font-medium">
                  {transaction.type.charAt(0) + transaction.type.slice(1).toLowerCase()}
                </span>
                <span className="text-gray-400 text-sm">
                  {formatDate(transaction.date)}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[#7b52d3] font-bold">
                  {formatCurrency(Number(transaction.amount))}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${transaction.status === 'COMPLETED'
                  ? 'bg-green-500/20 text-green-500'
                  : transaction.status === 'PENDING'
                    ? 'bg-yellow-500/20 text-yellow-500'
                    : 'bg-red-500/20 text-red-500'
                  }`}>
                  {transaction.status.charAt(0) + transaction.status.slice(1).toLowerCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Payments */}
      <div className="p-6 bg-white/5 backdrop-blur-lg rounded-xl">
        <h2 className="text-xl font-bold mb-4 text-[#7b52d3]">Pending Payments</h2>
        <div className="space-y-4">
          {safeData.recentTransactions
            .filter(tx => tx.status === 'PENDING')
            .map((tx) => (
              <div
                key={tx.id}
                className="bg-white/5 p-4 rounded-lg flex flex-col gap-2"
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">
                    {tx.type.charAt(0) + tx.type.slice(1).toLowerCase()}
                  </span>
                  <span className="text-[#7b52d3] font-bold">
                    {formatCurrency(Number(tx.amount))}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Date: {formatDate(tx.date)}</span>
                  <span className="bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-full text-xs">
                    Pending
                  </span>
                </div>
              </div>
            ))}
          {safeData.recentTransactions.filter(tx => tx.status === 'PENDING').length === 0 && (
            <div className="text-gray-400 text-center py-4">
              No pending payments
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wallet;