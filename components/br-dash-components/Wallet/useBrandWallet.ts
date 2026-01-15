"use client"

import { useEffect, useState } from "react"
import type { WalletData } from "./wallet"

export function useBrandWallet() {
  const [data, setData] = useState<WalletData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const fetchWallet = async () => {
      try {
        setLoading(true)
        const username =
          typeof window !== "undefined"
            ? window.location.pathname.split("/")[2]
            : ""

        if (!username) return

        const res = await fetch(`/api/brand2/${username}/wallet`)
        const walletData = await res.json()

        if (cancelled) return

        if (res.ok) {
          const normalized: WalletData = {
            monthlySpending: Array.isArray(walletData.monthlySpending)
              ? walletData.monthlySpending.map((m: any) => ({
                  month: m.month,
                  amount: Number(m.amount || 0),
                }))
              : [],
            totalSpent: Number(walletData.totalSpent || 0),
            pendingAmount: Number(walletData.pendingAmount || 0),
            balance: Number(walletData.balance || 0),
            transactions: Array.isArray(walletData.transactions)
              ? walletData.transactions.map((t: any) => ({
                  id: t.id,
                  amount: t.amount,
                  type: t.type,
                  status: t.status,
                  createdAt: t.createdAt,
                }))
              : [],
          }

          setData(normalized)
        } else {
          console.error("Failed to fetch brand wallet:", walletData?.error)
        }
      } catch (err) {
        if (!cancelled) console.error("Wallet fetch error", err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchWallet()
    return () => {
      cancelled = true
    }
  }, [])

  return { data, loading }
}
