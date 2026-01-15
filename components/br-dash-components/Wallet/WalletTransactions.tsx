import type { Transaction } from "./wallet"

type Props = {
  transactions: Transaction[]
  formatCurrency: (n: number) => string
}

export default function WalletTransactions({
  transactions,
  formatCurrency,
}: Props) {
  return (
    <div className="mt-6 p-4 bg-white/5 rounded-xl">
      <h4 className="font-bold text-[#5b21b6] mb-3">
        Recent Transactions
      </h4>

      <div className="space-y-3">
        {transactions.map(tx => (
          <div
            key={tx.id}
            className="flex justify-between bg-black/5 p-3 rounded-lg"
          >
            <div>
              <div className="font-semibold">{tx.type}</div>
              <div className="text-xs text-gray-400">
                {new Date(tx.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="font-bold">
                {formatCurrency(Number(tx.amount))}
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  tx.status === "COMPLETED"
                    ? "text-green-600 bg-green-600/10"
                    : tx.status === "PENDING"
                    ? "text-yellow-600 bg-yellow-600/10"
                    : "text-red-600 bg-red-600/10"
                }`}
              >
                {tx.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
