"use client";

import { useCallback, useEffect, useState } from "react";
import { WalletData } from "./types";

export function useWalletData() {
  const [data, setData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [earningMonths, setEarningMonths] = useState<string[]>([]);
  const [earningsInMonths, setEarningsInMonths] = useState<
    { month: string; amount: number }[]
  >([]);

  const fetchWalletData = useCallback(async () => {
    const username = window.location.pathname.split("/")[2];
    if (!username) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/influencer/${username}/wallet`);
      const walletData = await res.json();

      const normalized: WalletData = {
        currentBalance: Number(walletData.currentBalance ?? 0),
        pendingBalance: Number(walletData.pendingBalance ?? 0),
        totalEarned: Number(walletData.totalEarned ?? 0),
        totalWithdrawn: Number(walletData.totalWithdrawn ?? 0),
        totalSpent: Number(walletData.totalSpent ?? 0),
        withdrawls: walletData.withdrawls ?? [],
        earnings: walletData.earnings ?? [],
      };

      setData(normalized);

      // last 5 months
      const months: string[] = [];
      for (let i = 4; i >= 0; i--) {
        const d = new Date();
        d.setDate(1);
        d.setMonth(d.getMonth() - i);
        months.push(d.toLocaleString("default", { month: "short" }));
      }
      setEarningMonths(months);

      const monthly = months.map((mon, idx) => {
        const d = new Date();
        d.setDate(1);
        d.setMonth(d.getMonth() - (4 - idx));

        const sum = normalized.earnings.reduce((acc, t) => {
          const dt = new Date(t.createdAt || "");
          if (dt.getMonth() === d.getMonth() && dt.getFullYear() === d.getFullYear()) {
            return acc + Number(t.amount || 0);
          }
          return acc;
        }, 0);

        return { month: mon, amount: sum };
      });

      setEarningsInMonths(monthly);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  return {
    data,
    loading,
    earningMonths,
    earningsInMonths,
    fetchWalletData,
  };
}
