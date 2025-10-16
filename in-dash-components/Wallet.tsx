import React from "react";
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';


interface WalletProps {
  wallet?: {
    balance?: number;
    payments?: any[];
  };
}


const mockWallet = {
  totalEarnings: 125000,
  pendingPayments: [
    { id: 1, brand: 'Nike', amount: 25000, status: 'Pending', method: 'Stripe' },
    { id: 2, brand: 'L’Oreal', amount: 18000, status: 'Pending', method: 'Razorpay' },
  ],
  earningsTrend: [
    { month: 'Apr', earnings: 18000 },
    { month: 'May', earnings: 22000 },
    { month: 'Jun', earnings: 25000 },
    { month: 'Jul', earnings: 20000 },
    { month: 'Aug', earnings: 30000 },
    { month: 'Sep', earnings: 10000 },
    { month: 'Oct', earnings: 20000 },
  ],
  aiProjection: 27000,
};

const Wallet: React.FC<WalletProps> = () => (
  <div className="bg-[#232946] rounded-2xl shadow-lg p-8 flex flex-col gap-8">
    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><span role="img" aria-label="wallet">💰</span>Wallet</h2>
    {/* 1. Total Earnings */}
    <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-[#7b52d3] flex flex-col gap-2 mb-4">
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><span role="img" aria-label="money">💰</span>Total Earnings</h3>
      <div className="text-gray-400 text-sm">Sum of paid campaigns</div>
      <div className="mt-2 text-3xl font-bold text-[#7b52d3]">₹{mockWallet.totalEarnings.toLocaleString()}</div>
    </div>
    {/* 2. Pending Payments */}
    <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-[#f7b731] flex flex-col gap-2 mb-4">
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><span role="img" aria-label="pending">⏳</span>Pending Payments</h3>
      <div className="text-gray-400 text-sm">Offers in payment process</div>
      <ul className="mt-2 text-gray-300 text-sm space-y-1">
        {mockWallet.pendingPayments.length > 0 ? (
          mockWallet.pendingPayments.map((p) => (
            <li key={p.id}>
              <span className="font-bold text-[#f7b731]">{p.brand}</span>: ₹{p.amount} ({p.method})
            </li>
          ))
        ) : (
          <li>No pending payments.</li>
        )}
      </ul>
    </div>
    {/* 3. Earnings Trend Graph */}
    <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-[#45aaf2] flex flex-col gap-2 mb-4">
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><span role="img" aria-label="trend">📈</span>Earnings Trend Graph</h3>
      <div className="text-gray-400 text-sm mb-2">Monthly earnings visualization</div>
      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={mockWallet.earningsTrend} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#232946" />
          <XAxis dataKey="month" stroke="#fff" fontSize={12} />
          <YAxis stroke="#fff" fontSize={12} />
          <Tooltip wrapperStyle={{ backgroundColor: '#232946', color: '#fff', borderRadius: 8 }} labelStyle={{ color: '#fff' }} itemStyle={{ color: '#45aaf2' }} />
          <Line type="monotone" dataKey="earnings" stroke="#45aaf2" strokeWidth={3} dot={{ stroke: '#f7b731', strokeWidth: 2 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
    {/* 4. AI Projection */}
    <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-[#20bf6b] flex flex-col gap-2 mb-4">
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><span role="img" aria-label="ai">🤖</span>AI Projection</h3>
      <div className="text-gray-400 text-sm">Predicted income next month</div>
      <div className="mt-2 text-2xl font-bold text-[#20bf6b]">₹{mockWallet.aiProjection.toLocaleString()}</div>
    </div>
  </div>
);

export default Wallet;
