"use client";

import React, { useState } from "react";
import { useWalletData } from "./useWalletData";
import { WalletWithdrawModal } from "./WalletWithdrawModal";
import { WalletCharts } from "./WalletCharts";
import { WalletTransactions } from "./WalletTransactions";

export default function Wallet() {
  const { data, loading, earningMonths, earningsInMonths, fetchWalletData } = useWalletData();
  const [open, setOpen] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  if (loading) return <div>Loading wallet…</div>;
  if (!data) return <div>No wallet data</div>;

  async function handleWithdraw() {
    setWithdrawing(true);
    await fetch("/api/influencer/wallet/withdraw", { method: "POST" });
    await fetchWalletData();
    setWithdrawing(false);
    setOpen(false);
  }

  const fmt = (v: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);

  return (
    <div className="bg-[#232946] rounded-2xl p-8 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white/5 p-4 rounded-2xl">
            <div className="text-sm text-gray-300">Current Balance</div>
            <div className="text-2xl font-bold text-white mt-2">{fmt(data.currentBalance)}</div>
            <div className="mt-3">
              <button
                onClick={() => setOpen(true)}
                disabled={data.currentBalance <= 0 || withdrawing}
                className={`px-4 py-2 rounded-lg font-bold ${data.currentBalance > 0 && !withdrawing ? 'bg-[#7b52d3] text-white' : 'bg-gray-600 text-gray-300 cursor-not-allowed'}`}
              >
                {withdrawing ? 'Withdrawing…' : 'Withdraw'}
              </button>
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-2xl">
            <div className="text-sm text-gray-300">Pending Balance</div>
            <div className="text-2xl font-bold text-white mt-2">{fmt(data.pendingBalance)}</div>
            <div className="text-xs text-gray-400 mt-2">Funds pending clearance from brands</div>
          </div>
        </div>

        <div className="w-full md:w-80 bg-white/5 p-4 rounded-2xl flex flex-col gap-3">
          <div className="text-sm text-gray-300">Summary</div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">Total Earned</div>
            <div className="font-semibold text-white">{fmt(data.totalEarned)}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">Total Withdrawn</div>
            <div className="font-semibold text-white">{fmt(data.totalWithdrawn)}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">Total Spent</div>
            <div className="font-semibold text-white">{fmt(data.totalSpent)}</div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 p-4 rounded-2xl">
        <WalletCharts months={earningMonths} earnings={earningsInMonths.map((e) => e.amount)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <WalletTransactions transactions={[...data.withdrawls, ...data.earnings]} />
        </div>
        <div>
          <div className="bg-white/5 p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-[#7b52d3] mb-3">Quick Actions</h3>
            <button
              onClick={() => fetchWalletData()}
              className="w-full px-4 py-2 rounded-lg bg-[#6b7280] text-white mb-3"
            >
              Refresh Wallet
            </button>
            <button
              onClick={() => alert('Export CSV - to be implemented')}
              className="w-full px-4 py-2 rounded-lg bg-white/10 text-white"
            >
              Export Transactions
            </button>
          </div>
        </div>
      </div>
      <WalletWithdrawModal open={open} balance={data.currentBalance} loading={withdrawing} onConfirm={handleWithdraw} onClose={() => setOpen(false)} />
    </div>
  );
}
