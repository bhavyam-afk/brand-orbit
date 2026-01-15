export interface Transaction {
  id: string
  amount: string | number
  type: string
  status: string
  createdAt: string
  date?: string
}

export interface WalletData {
  monthlySpending: { month: string; amount: number }[]
  totalSpent: number
  pendingAmount: number
  balance: number
  transactions: Transaction[]
}
