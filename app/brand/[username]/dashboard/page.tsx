"use client";

import React from "react";

const BrandDashboard = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center py-16 px-4 text-white">
      <div className="bg-[#181c2f] bg-opacity-80 rounded-2xl shadow-2xl p-10 w-full max-w-3xl border border-yellow-300">
        <h1 className="text-4xl font-extrabold mb-8 text-center">Brand Dashboard</h1>
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="bg-[#232946] rounded-xl p-6 shadow-lg border border-yellow-200">
            <h2 className="text-2xl font-bold mb-2 text-yellow-300">Active Campaigns</h2>
            <p className="text-lg">5</p>
          </div>
          <div className="bg-[#232946] rounded-xl p-6 shadow-lg border border-yellow-200">
            <h2 className="text-2xl font-bold mb-2 text-yellow-300">Total Spend</h2>
            <p className="text-lg">$12,000</p>
          </div>
        </div>
        <div className="bg-[#232946] rounded-xl p-6 shadow-lg border border-yellow-200">
          <h2 className="text-xl font-bold mb-2 text-yellow-300">Recent Campaigns</h2>
          <ul className="list-disc ml-6">
            <li>Summer Launch 2025</li>
            <li>Influencer Collab Q3</li>
            <li>Brand Awareness Drive</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BrandDashboard;
