'use client'

import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { set } from 'mongoose';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Transaction {
  id: string;
  amount: string | number;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'PAYMENT' | 'PAYOUT' | 'FEE' | string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | string;
  createdAt: string;
  date?: string;
}

interface WalletData {
  currentBalance: number;
  pendingBalance: number;
  totalEarned: number;
  totalWithdrawn: number;
  totalSpent: number;
  transactions: Transaction[];
}


const Wallet: React.FC<WalletData> = () => {
  const [data, setData] = React.useState<WalletData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [earnings, setEarnings] = React.useState<{ month: string; amount: number }[]>([]);
  const [earningmonths, setEarningmonths] = React.useState<string[]>([]);

  React.useEffect(() => {
    const username = typeof window !== 'undefined' ? window.location.pathname.split('/')[2] : '';
    if (!username) return;

    async function fetchcalls() {

      setLoading(true);
      const res = await fetch(`/api/influencer/${username}/wallet`);
      const walletData = await res.json();

      // Normalize backend response to our frontend WalletData shape
      const normalized = {
        currentBalance: Number(walletData.currentBalance ?? 0),
        pendingBalance: Number(walletData.pendingBalance ?? 0),
        totalEarned: Number(walletData.totalEarned ?? 0),
        totalWithdrawn: Number(walletData.totalWithdrawn ?? 0),
        totalSpent: Number(walletData.totalSpent ?? 0),
        transactions: Array.isArray(walletData.transactions) ? walletData.transactions.map((t: any) => ({
          id: String(t.id ?? t._id ?? ''),
          amount: Number(t.amount ?? 0),
          type: t.type ?? t.transactionType ?? '',
          status: t.status ?? t.state ?? '',
          createdAt: t.createdAt ?? t.date ?? '',
        })) : [],
      } as WalletData;

      setData(normalized);

      // lastest 5 months
      const months: string[] = [];
      for (let i = 4; i >= 0; i--) {
        const d = new Date();
        d.setDate(1);
        d.setMonth(d.getMonth() - i);
        const shortMonth = d.toLocaleString('default', { month: 'short' });
        months.push(shortMonth);
      }
      setEarningmonths(months);

      // Compute earnings per month from transactions (fallback when backend doesn't provide `earnings`)
      const txs = normalized.transactions || [];
      const earningsPerMonth = months.map((mon, idx) => {
        // month index relative to now: i from 4..0 -> months[0] is oldest
        const d = new Date();
        d.setDate(1);
        d.setMonth(d.getMonth() - (4 - idx));
        const year = d.getFullYear();
        const month = d.getMonth();

        const sum = txs.reduce((acc, t) => {
          const tDate = new Date(t.createdAt || t.date || '');
          if (tDate.getFullYear() === year && tDate.getMonth() === month) {
            const amt = Number(t.amount ?? 0);
            // consider deposits/payments as earnings (positive amounts)
            return acc + (amt > 0 ? amt : 0);
          }
          return acc;
        }, 0);
        return { month: mon, amount: sum };
      });

      setEarnings(earningsPerMonth);

      setLoading(false);
    };

    fetchcalls();

  }, []);
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
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

  const earningsData = {
    labels: earningmonths,
    datasets: [
      {
        label: "Earnings (₹)",
        data: earnings.map(e => e.amount),
        backgroundColor: "rgba(34,211,238,0.9)",
        borderColor: "#0891b2",
        borderWidth: 1,
        borderRadius: 8,
        barThickness: 18,
        barPercentage: 0.7,
        categoryPercentage: 0.7,
      },
    ],
  };
   const earningsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#fff" } },
      y: {
        beginAtZero: true, grid: { color: "#334155" }, ticks: ({
          color: "#fff",
          callback: function (value: any) {
            const n = Number(value);
            if (isNaN(n)) return String(value);
            if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'k';
            return String(n);
          },
        } as unknown) as any,
      },
    },
  };

  return (
    <div className="bg-[#232946] rounded-2xl shadow-lg p-8 flex flex-col gap-8 border border-[#7b52d3]">
      {/* Top Section - Earnings Overview */}
      <div className="grid grid-cols-2 gap-6">
        {/* Chart */}
        <div className="p-6 bg-white/5 backdrop-blur-lg rounded-xl">
          <h2 className="text-xl font-bold mb-4 text-[#7b52d3]">Earnings vs Goal</h2>
          <div style={{ height: 240 }}>
            <Bar
              data={earningsData}
              options={earningsOptions}
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-lg">
              <p className="text-gray-400">Total Earnings</p>
              <p className="text-2xl font-bold text-[#7b52d3]">
                {formatCurrency(Number((earnings || []).reduce((s, x) => s + Number(x.amount || 0), 0)))}
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <p className="text-gray-400">Current Balance</p>
              <p className="text-2xl font-bold text-[#7b52d3]">
                {formatCurrency(Number(data?.currentBalance ?? 0))}
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
                {formatCurrency(Number(data?.pendingBalance ?? 0))}
              </p>
              <p className="text-sm text-gray-400 mt-2">Awaiting clearance</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <p className="text-gray-400">Total Withdrawn</p>
              <p className="text-2xl font-bold text-pink-500">
                {formatCurrency(Number(data?.totalWithdrawn ?? 0))}
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
          {(data?.transactions || []).map((transaction) => (
            <div
              key={transaction.id}
              className="bg-white/5 p-4 rounded-lg flex justify-between items-center"
            >
              <div className="flex flex-col">
                <span className="text-gray-300 font-medium">
                  {transaction.type ? (transaction.type.charAt(0) + transaction.type.slice(1).toLowerCase()) : ''}
                </span>
                <span className="text-gray-400 text-sm">
                  {formatDate(transaction.createdAt || transaction.date || '')}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[#7b52d3] font-bold">
                  {formatCurrency(Number(transaction.amount))}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${transaction.status === 'COMPLETED' ? 'bg-green-500/20 text-green-500'
                  : transaction.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500' }`}> 
                  {transaction.status ? (transaction.status.charAt(0) + transaction.status.slice(1).toLowerCase()) : ''}
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
          {(data?.transactions || [])
            .filter(tx => tx.status === 'PENDING')
            .map((tx) => (
              <div
                key={tx.id}
                className="bg-white/5 p-4 rounded-lg flex flex-col gap-2"
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">
                    {tx.type ? (tx.type.charAt(0) + tx.type.slice(1).toLowerCase()) : ''}
                  </span>
                  <span className="text-[#7b52d3] font-bold">
                    {formatCurrency(Number(tx.amount))}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Date: {formatDate(tx.createdAt || tx.date || '')}</span>
                  <span className="bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-full text-xs">
                    Pending
                  </span>
                </div>
              </div>
            ))}
          {(data?.transactions || []).filter(tx => tx.status === 'PENDING').length === 0 && (
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