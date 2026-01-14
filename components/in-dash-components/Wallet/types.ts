export interface Transaction {
  id: string;
  amount: number;
  type: string;
  status: string;
  createdAt: string;
  date?: string;
}

export interface WalletData {
  currentBalance: number;
  pendingBalance: number;
  totalEarned: number;
  totalWithdrawn: number;
  totalSpent: number;
  withdrawls: Transaction[];
  earnings: Transaction[];
}
