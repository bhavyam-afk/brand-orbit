import React from "react";


interface WalletProps {
  wallet?: {
    balance?: number;
    payments?: any[];
  };
}

const Wallet: React.FC<WalletProps> = ({ wallet }) => (
  <div className="bg-[#232946] rounded-2xl shadow-lg p-8 flex flex-col gap-8">
    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><span role="img" aria-label="wallet">💰</span>Wallet & Payments</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Wallet Balance */}
      <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-[#7b52d3] flex flex-col gap-2">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><span role="img" aria-label="money">💰</span>Wallet Balance</h3>
        <div className="text-gray-400 text-sm">Current earnings</div>
        <div className="mt-2 text-3xl font-bold text-[#7b52d3]">₹{wallet?.balance ?? 0}</div>
      </div>
      {/* Transactions */}
      <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-[#7b52d3] flex flex-col gap-2">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><span role="img" aria-label="transactions">🔄</span>Transactions</h3>
        <div className="text-gray-400 text-sm">Payouts, pending, received</div>
        <ul className="mt-2 text-gray-300 text-sm space-y-1">
          {wallet?.payments && wallet.payments.length > 0 ? (
            wallet.payments.map((p, idx) => (
              <li key={idx}>
                {p.status}: ₹{p.amount} ({p.method || 'Unknown'})
              </li>
            ))
          ) : (
            <li>No transactions found.</li>
          )}
        </ul>
      </div>
      {/* Payment Integration */}
      <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-[#7b52d3] col-span-2 flex flex-col gap-2">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><span role="img" aria-label="receipt">🧾</span>Payment Integration</h3>
        <div className="text-gray-400 text-sm">Stripe / Razorpay / PayPal</div>
        <div className="mt-2 text-gray-300">[Integration Placeholder]</div>
      </div>
    </div>
  </div>
);

export default Wallet;
