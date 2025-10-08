"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Profile from "@/in-dash-components/Profile";
import ListPackages from "@/in-dash-components/ListPackages";
import AnalyticsDashboard from "@/in-dash-components/AnalyticsDashboard";
import Campaigns from "@/in-dash-components/Campaigns";
import Wallet from "@/in-dash-components/Wallet";
import Settings from "@/in-dash-components/Settings";

// Dummy campaign data for sketch
const campaignTabs = [
  { key: 'active', label: 'Active Campaigns', icon: '�' },
  { key: 'pending', label: 'Pending Offers', icon: '�' },
  { key: 'completed', label: '🏁 Completed Campaigns', icon: '🏁' },
];

// Removed leftover inline code and type
const sidebarOptions = [
  "Profile",
  "List Packages",
  "Analytics",
  "Campaigns",
  "Wallet",
  "Settings",
];

const InfluencerDashboard = () => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("Profile");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#232946] to-[#7b52d3] flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-[#7b52d3] px-8 py-4 bg-[#181c2f]">
        {/* Hamburger Icon */}
        <button
          className="text-white text-2xl mr-2 focus:outline-none"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-menu"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        {/* Logo & Name */}
        <div className="flex items-center gap-2">
          <img src="/brand-orbit-logo.png" alt="Brand Orbit Logo" className="w-8 h-8 rounded" />
          <span className="font-bold text-xl text-[#7b52d3]">Brand Orbit</span>
        </div>
        {/* Contact & About Links */}
        <div className="flex items-center gap-6">
          <a href="#contact" className="text-white hover:text-[#7b52d3] font-semibold transition">Contact</a>
          <a href="#about" className="text-white hover:text-[#7b52d3] font-semibold transition">About</a>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className={`transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} bg-[#181c2f] p-6 flex flex-col gap-8 border-r border-[#7b52d3]`}>
          <div className="flex items-center gap-3 mb-8">
            <img src="/influencer-avatar.png" alt="Avatar" className="w-12 h-12 rounded-full border-2 border-[#7b52d3] object-cover" />
            {sidebarOpen && <span className="font-bold text-xl text-white">Influencer</span>}
          </div>
          <nav className="flex flex-col gap-4">
            {sidebarOptions.map(option => (
              <button
                key={option}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg font-semibold border ${activeSection === option ? 'bg-[#7b52d3] text-white' : 'bg-[#232946] text-[#7b52d3] border-[#7b52d3]'} transition`}
                onClick={() => setActiveSection(option)}
              >
                {/* Icon for each option (example icons, replace as needed) */}
                <span className="text-2xl">
                  {option === "Profile" && <svg width="20" height="20" fill="currentColor"><circle cx="10" cy="7" r="4"/><rect x="4" y="13" width="12" height="5" rx="2"/></svg>}
                  {option === "List Packages" && <svg width="20" height="20" fill="currentColor"><rect x="3" y="7" width="14" height="10" rx="2"/><rect x="7" y="3" width="6" height="4" rx="1"/></svg>}
                  {option === "Analytics" && <svg width="20" height="20" fill="currentColor"><rect x="3" y="12" width="3" height="5"/><rect x="8" y="9" width="3" height="8"/><rect x="13" y="6" width="3" height="11"/></svg>}
                  {option === "Campaigns" && <svg width="20" height="20" fill="currentColor"><rect x="4" y="4" width="12" height="12" rx="2"/></svg>}
                  {option === "Wallet" && <svg width="20" height="20" fill="currentColor"><rect x="2" y="7" width="16" height="10" rx="2"/><rect x="6" y="3" width="8" height="4" rx="1"/></svg>}
                  {option === "Settings" && <svg width="20" height="20" fill="currentColor"><circle cx="10" cy="10" r="3"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.93 4.93l1.41 1.41M15.66 15.66l1.41 1.41M4.93 15.07l1.41-1.41M15.66 4.34l1.41-1.41"/></svg>}
                </span>
                {sidebarOpen && option}
              </button>
            ))}
          </nav>
          <button
            className="mt-auto px-4 py-2 bg-red-500 text-white rounded-lg font-bold shadow hover:bg-red-700"
            onClick={() => router.push("/")}
          >{sidebarOpen ? "Log Out" : <svg width="20" height="20" fill="currentColor"><path d="M6 18L18 6M6 6l12 12"/></svg>}</button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-10">
          {activeSection === "Profile" && <Profile />}
          {activeSection === "List Packages" && <ListPackages />}
          {activeSection === "Analytics" && <AnalyticsDashboard />}
          {activeSection === "Campaigns" && <Campaigns />}
          {activeSection === "Wallet" && <Wallet />}
          {activeSection === "Settings" && <Settings />}
        </div>
      </div>
    </div>
  );
};

export default InfluencerDashboard;
