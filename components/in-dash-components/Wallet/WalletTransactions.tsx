"use client";

import { Transaction } from "./types";

type Props = {
  transactions: Transaction[];
};

export function WalletTransactions({ transactions }: Props) {
  return (
    <div className="p-6 bg-white/5 rounded-xl">
      <h2 className="text-xl font-bold mb-4 text-[#7b52d3]">
        Recent Transactions
      </h2>

      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="bg-white/5 p-4 rounded-lg flex justify-between"
        >
          <span>{tx.type}</span>
          <span>₹{tx.amount}</span>
        </div>
      ))}
    </div>
  );
}
