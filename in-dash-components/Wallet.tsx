'use client'

import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'completed' | 'pending' | 'processing';
};

type PendingCollab = {
  brandName: string;
  amount: number;
  status: 'pending' | 'processing';
  expectedDate: string;
};

interface WalletProps {
  totalEarnings?: number;
  goalAmount?: number;
  pendingCollabs?: PendingCollab[];
  transactions?: Transaction[];
}

const mockData = {
  earnings: {
    total: 15000,
    goal: 25000,
    monthlyData: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      earnings: [2000, 3000, 2500, 4000, 2000, 1500],
      goals: [4000, 4000, 4000, 4000, 4000, 4000],
    },
  },
  pendingCollabs: [
    { brandName: 'Nike', amount: 2500, status: 'pending', expectedDate: '2025-11-01' },
    { brandName: 'Adidas', amount: 1800, status: 'processing', expectedDate: '2025-10-25' },
    { brandName: 'Puma', amount: 2000, status: 'pending', expectedDate: '2025-11-05' },
  ] as const,
  transactions: [
    { id: '1', date: '2025-10-20', description: 'Campaign Payment - Nike', amount: 3000, status: 'completed' },
    { id: '2', date: '2025-10-15', description: 'Campaign Payment - Adidas', amount: 2500, status: 'completed' },
    { id: '3', date: '2025-10-10', description: 'Campaign Payment - Puma', amount: 1800, status: 'completed' },
  ],
};

const Wallet: React.FC<WalletProps> = ({
  totalEarnings = mockData.earnings.total,
  goalAmount = mockData.earnings.goal,
  pendingCollabs = mockData.pendingCollabs,
  transactions = mockData.transactions,
}) => {
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

  return (
    <div className="bg-[#232946] rounded-2xl shadow-lg p-8 flex flex-col gap-8 border border-[#7b52d3]">
      {/* Top Section - Earnings vs Goal */}
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
                },
                {
                  label: 'Monthly Goals',
                  data: mockData.earnings.monthlyData.goals,
                  backgroundColor: 'rgba(255, 99, 132, 0.6)',
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
                {formatCurrency(totalEarnings)}
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <p className="text-gray-400">Goal</p>
              <p className="text-2xl font-bold text-pink-500">
                {formatCurrency(goalAmount)}
              </p>
            </div>
          </div>
        </div>

        {/* Pending Payments */}
        <div className="p-6 bg-white/5 backdrop-blur-lg rounded-xl">
          <h2 className="text-xl font-bold mb-4 text-[#7b52d3]">Pending Payments</h2>
          <div className="space-y-4">
            {pendingCollabs.map((collab, index) => (
              <div
                key={index}
                className="bg-white/5 p-4 rounded-lg flex flex-col gap-2"
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">{collab.brandName}</span>
                  <span className="text-[#7b52d3] font-bold">
                    {formatCurrency(collab.amount)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Expected: {formatDate(collab.expectedDate)}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    collab.status === 'pending'
                      ? 'bg-yellow-500/20 text-yellow-500'
                      : 'bg-blue-500/20 text-blue-500'
                  }`}>
                    {collab.status.charAt(0).toUpperCase() + collab.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section - Transactions */}
      <div className="p-6 bg-white/5 backdrop-blur-lg rounded-xl">
        <h2 className="text-xl font-bold mb-4 text-[#7b52d3]">Transaction History</h2>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-white/5 p-4 rounded-lg flex justify-between items-center"
            >
              <div className="flex flex-col">
                <span className="text-gray-300 font-medium">
                  {transaction.description}
                </span>
                <span className="text-gray-400 text-sm">
                  {formatDate(transaction.date)}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[#7b52d3] font-bold">
                  {formatCurrency(transaction.amount)}
                </span>
                <span className="bg-green-500/20 text-green-500 px-2 py-1 rounded-full text-xs">
                  Completed
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wallet;