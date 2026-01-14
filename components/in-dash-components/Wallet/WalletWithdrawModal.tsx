"use client";

import React from "react";

type Props = {
  open: boolean;
  balance: number;
  loading: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export function WalletWithdrawModal({
  open,
  balance,
  loading,
  onConfirm,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#232946] rounded-xl p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-2 text-white">Withdraw Funds</h3>

        <p className="text-gray-300 mb-4">
          Available balance: <span className="font-bold">₹{balance}</span>
        </p>

        <div className="flex gap-3">
          <button
            disabled={loading}
            onClick={onConfirm}
            className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold"
          >
            {loading ? "Processing…" : "Confirm Withdraw"}
          </button>

          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 text-white py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
