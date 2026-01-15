"use client"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js"
import { Bar } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

type Props = {
  monthlySpending: { month: string; amount: number }[]
  totalSpent: number
  balance: number
  formatCurrency: (n: number) => string
}

export default function WalletSpendingChart({
  monthlySpending,
  totalSpent,
  balance,
  formatCurrency,
}: Props) {
  return (
    <div className="p-4 bg-white/5 rounded-xl">
      <h3 className="text-lg font-bold text-[#5b21b6] mb-3">
        Spending (last months)
      </h3>

      <div className="h-[220px]">
        <Bar
          data={{
            labels: monthlySpending.map(m => {
              const idx = Number(String(m.month).split("-")[1]) - 1
              return new Date(0, idx).toLocaleString("en-US", { month: "short" })
            }),
            datasets: [
              {
                data: monthlySpending.map(m => m.amount),
                backgroundColor: "rgba(99,102,241,0.7)",
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } },
          }}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="bg-white/5 p-3 rounded-lg">
          <div className="text-xs text-gray-400">Total Spent</div>
          <div className="text-lg font-bold">
            {formatCurrency(totalSpent)}
          </div>
        </div>
        <div className="bg-white/5 p-3 rounded-lg">
          <div className="text-xs text-gray-400">Current Balance</div>
          <div className="text-lg font-bold">
            {formatCurrency(balance)}
          </div>
        </div>
      </div>
    </div>
  )
}
