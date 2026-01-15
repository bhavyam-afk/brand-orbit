"use client"

import { useBrandWallet } from "./useBrandWallet"
import WalletSpendingChart from "./WalletSpendingChart"
import WalletOverview from "./WalletOverview"
import WalletTransactions from "./WalletTransactions"

export default function BrandWallet() {
  const { data, loading } = useBrandWallet()

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(n)

  if (loading) return <div className="py-8 text-center">Loading wallet…</div>
  if (!data) return <div className="py-8 text-center">No wallet data</div>

  return (
    <div className="bg-white/5 rounded-2xl p-6 space-y-6">
      <div className="grid grid-cols-[1fr_320px] gap-4">
        <WalletSpendingChart
          monthlySpending={data.monthlySpending}
          totalSpent={data.totalSpent}
          balance={data.balance}
          formatCurrency={formatCurrency}
        />

        <WalletOverview
          pendingAmount={data.pendingAmount}
          totalSpent={data.totalSpent}
          formatCurrency={formatCurrency}
        />
      </div>

      <WalletTransactions
        transactions={data.transactions}
        formatCurrency={formatCurrency}
      />
    </div>
  )
}
