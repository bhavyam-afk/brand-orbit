import React from "react";

const ListPackages = () => (
  <div className="bg-[#232946] rounded-2xl shadow-lg p-8 flex flex-col gap-8">
    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><span>🎁</span>Service Listings</h2>
    <ul className="ml-4 space-y-2">
      <li className="flex items-center gap-2"><span>📄</span>Instagram Story – ₹X</li>
      <li className="flex items-center gap-2"><span>📄</span>Instagram Reel – ₹Y</li>
      <li className="flex items-center gap-2"><span>📄</span>Feed Post – ₹Z</li>
    </ul>
    <h2 className="text-xl font-bold mt-6 flex items-center gap-2"><span>📝</span>Custom Offers</h2>
    <p className="text-gray-300 mb-2">Create custom packages for brands.</p>
    <h2 className="text-xl font-bold mt-6 flex items-center gap-2"><span>📅</span>Availability Calendar</h2>
    <p className="text-gray-300 mb-2">Mark dates as available or booked.</p>
    <h2 className="text-xl font-bold mt-6 flex items-center gap-2"><span>💳</span>Payment Tracking</h2>
    <p className="text-gray-300">Record accepted deals, pending payments, completed campaigns.</p>
  </div>
);

export default ListPackages;
