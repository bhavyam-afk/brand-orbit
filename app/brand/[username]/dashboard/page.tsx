"use client";
import React, { useState } from "react";

const sidebarOptions = [
  { key: "profile", label: "Profile" },
  { key: "feed", label: "Feed" },
  { key: "analytics", label: "Analytics" },
  { key: "wallet", label: "Wallet" },
  { key: "settings", label: "Settings" },
];

const BrandDashboard = () => {
  const [selected, setSelected] = useState("profile");

  return (
    <div className="min-h-screen flex bg-[#f7f7fb]">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r shadow-lg flex flex-col py-8 px-4 gap-2">
        <div className="mb-8 text-2xl font-extrabold text-[#7b52d3] text-center tracking-wide">Brand Dashboard</div>
        {sidebarOptions.map((opt) => (
          <button
            key={opt.key}
            className={`w-full text-left px-4 py-3 rounded-lg font-semibold text-lg transition-colors mb-1 ${selected === opt.key ? "bg-[#7b52d3] text-white shadow" : "text-[#232946] hover:bg-[#ece9f6]"}`}
            onClick={() => setSelected(opt.key)}
          >
            {opt.label}
          </button>
        ))}
      </aside>
      {/* Main content */}
      <main className="flex-1 p-10">
        {selected === "profile" && <div>Brand Profile Section (to be implemented)</div>}
        {selected === "feed" && <div>Brand Feed Section (to be implemented)</div>}
        {selected === "analytics" && <div>Brand Analytics Section (to be implemented)</div>}
        {selected === "wallet" && <div>Brand Wallet Section (to be implemented)</div>}
        {selected === "settings" && <div>Brand Settings Section (to be implemented)</div>}
      </main>
    </div>
  );
};

export default BrandDashboard;
