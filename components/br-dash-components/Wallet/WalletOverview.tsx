type Props = {
  pendingAmount: number
  totalSpent: number
  formatCurrency: (n: number) => string
}

export default function WalletOverview({
  pendingAmount,
  totalSpent,
  formatCurrency,
}: Props) {
  return (
    <div className="p-4 bg-white/5 rounded-xl">
      <h3 className="text-md font-bold text-[#5b21b6]">Overview</h3>

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Pending Payments</span>
          <span className="font-bold">
            {formatCurrency(pendingAmount)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Total Spent</span>
          <span className="font-bold">
            {formatCurrency(totalSpent)}
          </span>
        </div>
      </div>
    </div>
  )
}
