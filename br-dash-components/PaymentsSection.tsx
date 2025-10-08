import React from "react";

const PaymentsSection = () => (
  <div className="bg-[#232946] rounded-2xl shadow-lg p-8 flex flex-col gap-8 border border-yellow-400">
    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-yellow-400">
      <span role="img" aria-label="payments">💳</span>Budgeting & Payments
    </h2>
    <div className="text-gray-300 mb-6 text-lg">
      <span className="font-bold text-white">Purpose:</span> Manage payments efficiently and securely.
    </div>
    {/* Wallet / Campaign Funds */}
    <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-yellow-300 mb-4">
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-yellow-300">
        <span role="img" aria-label="wallet">👜</span>Wallet / Campaign Funds
      </h3>
      <ul className="text-gray-300 text-sm space-y-1">
        <li>Deposit funds → allocate to campaigns</li>
        <li className="text-yellow-300">[API: POST /api/brand/payments/deposit]</li>
      </ul>
    </div>
    {/* Payment Management */}
    <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-yellow-300 mb-4">
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-green-300">
        <span role="img" aria-label="payment">💸</span>Payment Management
      </h3>
      <ul className="text-gray-300 text-sm space-y-1">
        <li>Split payments among influencers</li>
        <li className="text-yellow-300">[API: POST /api/brand/payments/split]</li>
      </ul>
    </div>
    {/* Invoices & Payout Tracking */}
    <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-yellow-300 mb-4">
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-blue-300">
        <span role="img" aria-label="invoice">🧾</span>Invoices & Payout Tracking
      </h3>
      <ul className="text-gray-300 text-sm space-y-1">
        <li>Auto-generate invoices, mark completed transactions</li>
        <li className="text-yellow-300">[API: GET/POST /api/brand/payments/invoices]</li>
      </ul>
    </div>
    {/* Transaction Logs */}
    <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-yellow-300 mb-4">
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-gray-300">
        <span role="img" aria-label="logs">🌐</span>Transaction Logs
      </h3>
      <ul className="text-gray-300 text-sm space-y-1">
        <li>Payment history, refund records, commission tracking</li>
        <li className="text-yellow-300">[API: GET /api/brand/payments/logs]</li>
      </ul>
    </div>
    {/* Escrow System (optional) */}
    <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-yellow-300">
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-gray-300">
        <span role="img" aria-label="escrow">🔒</span>Escrow System (optional)
      </h3>
      <ul className="text-gray-300 text-sm space-y-1">
        <li>Secure fund holding until deliverables are approved</li>
        <li className="text-yellow-300">[API: POST /api/brand/payments/escrow]</li>
      </ul>
    </div>
  </div>
);

export default PaymentsSection;
