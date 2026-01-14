"use client";
import React, { useState } from "react";
import Profile from "@/components/br-dash-components/Profile"; 
import BrandFeed from "@/components/br-dash-components/BrandFeed";
import Settings from "@/components/br-dash-components/Settings";
import Analytics from "@/components/br-dash-components/Analytics";
import Wallet from "@/components/br-dash-components/Wallet";
import Deals from "@/components/br-dash-components/Deals";
import Plans from "@/components/br-dash-components/Plans";
import { signOut } from "next-auth/react";

const sidebarOptions = [
  { key: "profile", label: "Profile" },
  { key: "feed", label: "Feed" },
  { key: "Deals", label: "Deals" },
  { key: "analytics", label: "Analytics" },
  { key: "wallet", label: "Wallet" },
  { key: "settings", label: "Settings" },
  { key: "plan", label: "Plan" },
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
        <div className="mt-auto">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full text-left px-4 py-3 rounded-lg font-semibold text-lg transition-colors mb-1 bg-red-500 text-white hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </aside>
      {/* Main content */}
      <main className="flex-1 p-10">
        {selected === "profile" && <Profile />}
        {selected === "feed" && <div><BrandFeed /></div>}
        {selected === "Deals" && <div><Deals /></div>}
        {selected === "analytics" && <div><Analytics /></div>}
        {selected === "wallet" && <div><Wallet /></div>}
        {selected === "settings" && <div><Settings /></div>}
        {selected === "plan" && <div><Plans /></div>} 
      </main>
    </div>
  );
};

export default BrandDashboard;
