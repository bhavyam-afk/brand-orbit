'use client'

import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

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
  withdrawls?: Transaction[];
  earnings?: Transaction[];
}

const Wallet = () => {
  const [data, setData] = React.useState<WalletData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [earningsinmonths, setEarnings] = React.useState<{ month: string; amount: number }[]>([]);
  const [earningmonths, setEarningmonths] = React.useState<string[]>([]);
  const [open, setOpen] = React.useState(false);
  const [withdrawing, setWithdrawing] = React.useState(false);

  // Define the fetch logic here so it can be reused
  const fetchWalletData = React.useCallback(async () => {
    const username = typeof window !== 'undefined' ? window.location.pathname.split('/')[2] : '';
    if (!username) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/influencer/${username}/wallet`);
      const walletData = await res.json();

      // Normalize backend response to our frontend WalletData shape
      const normalized = {
        currentBalance: Number(walletData.currentBalance ?? 0),
        pendingBalance: Number(walletData.pendingBalance ?? 0),
        totalEarned: Number(walletData.totalEarned ?? 0),
        totalWithdrawn: Number(walletData.totalWithdrawn ?? 0),
        totalSpent: Number(walletData.totalSpent ?? 0),
        withdrawls: Array.isArray(walletData.withdrawls) ? walletData.withdrawls.map((t: any) => ({
          id: String(t.id ?? ''),
          amount: Number(t.amount ?? 0),
          type: t.type ?? '',
          status: t.status ?? '',
          createdAt: t.createdAt ?? '',
        })) : [],
        earnings: Array.isArray(walletData.earnings) ? walletData.earnings.map((t: any) => ({
          id: String(t.id ?? ''),
          amount: Number(t.amount ?? 0),
          type: t.type ?? '',
          status: t.status ?? '',
          createdAt: t.createdAt ?? '',
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

      // Compute earnings per month from transactions
      const earningsPerMonth = months.map((mon, idx) => {
        const d = new Date();
        d.setDate(1);
        d.setMonth(d.getMonth() - (4 - idx));
        const year = d.getFullYear();
        const month = d.getMonth();

        const sum = normalized.earnings?.reduce((acc, t) => {
          const tDate = new Date(t.createdAt || t.date || '');
          if (tDate.getFullYear() === year && tDate.getMonth() === month) {
            const amt = Number(t.amount ?? 0);
            return acc + (amt > 0 ? amt : 0);
          }
          return acc;
        }, 0);
        return { month: mon, amount: sum };
      });

      setEarnings((earningsPerMonth as Array<{ month: string; amount: number }>) || months.map(m => ({ month: m, amount: 0 })));
    } catch (error) {
      console.error("Failed to fetch wallet data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  React.useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const alltransactions = data ? ([...(data.withdrawls || []), ...(data.earnings || [])]) : [];
  const canWithdraw = data ? data.currentBalance > 0 ? true : false : false;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleWithdraw = async () => {
    try {
      setWithdrawing(true);

      const res = await fetch("/api/influencer/wallet/withdraw", {
        method: "POST",
      });

      // Renamed to responseData to avoid conflict with state 'data'
      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData?.error || "Withdraw failed");
      }

      alert("Withdrawal initiated successfully");
      setOpen(false);

      // Refresh wallet data - Now this works because fetchWalletData is in scope
      await fetchWalletData();
    } catch (err: any) {
      alert(err.message || "Withdraw failed");
    } finally {
      setWithdrawing(false);
    }
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
        data: earningsinmonths.map(e => e.amount),
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
                {formatCurrency(Number((earningsinmonths || []).reduce((s, x) => s + Number(x.amount || 0), 0)))}
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
            <button className="px-4 py-2 bg-[#7b52d3] text-white rounded-lg font-bold shadow hover:bg-[#5a3ca0] disabled:bg-gray-500"
              disabled={!canWithdraw}
              onClick={() => {
                setOpen(true);
              }}
            >
              Withdraw Funds
            </button>
          </div>
        </div>

        {open && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-[#232946] rounded-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-2 text-white">Withdraw Funds</h3>

              <p className="text-gray-300 mb-4">
                Available balance:{" "}
                <span className="font-bold">
                  {formatCurrency(Number(data?.currentBalance))}
                </span>
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleWithdraw}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold"
                >
                  Confirm Withdraw
                </button>

                <button
                  onClick={() => setOpen(false)}
                  className="flex-1 bg-gray-600 text-white py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Bottom Section - Transactions */}
      <div className="p-6 bg-white/5 backdrop-blur-lg rounded-xl">
        <h2 className="text-xl font-bold mb-4 text-[#7b52d3]">Recent Transactions</h2>
        <div className="space-y-4">
          {(alltransactions || []).map((transaction) => (
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
                  : transaction.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'}`}>
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
          {(alltransactions || [])
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
          {(alltransactions || []).filter(tx => tx.status === 'PENDING').length === 0 && (
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