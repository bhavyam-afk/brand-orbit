
"use client";
import React from "react";


const menuItems = [
  { icon: "👤", label: "Profile" },
  { icon: "📦", label: "List Packages" },
  { icon: "📣", label: "Campaigns" },
  { icon: "📊", label: "Analytics" },
  { icon: "💬", label: "Messages" },
];


const InfluencerDashboard = () => {
  const [activeSection, setActiveSection] = React.useState("Profile");
  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-[#0a0f2c] via-[#1a1f3c] to-[#232946] text-white">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-[#3a3f5c] px-12 py-6">
        <div className="flex items-center gap-4">
          <div className="bg-white rounded-lg px-6 py-2 text-gray-800 font-bold text-lg shadow">logo</div>
        </div>
        <h1 className="text-3xl font-bold text-[#7b52d3]">Influencer's Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="bg-[#232946] rounded-lg px-4 py-2 text-[#7b52d3] font-semibold shadow">username</div>
          <button className="bg-[#7b52d3] hover:bg-[#5a3ca0] text-white px-4 py-2 rounded-lg font-bold shadow">Log Out</button>
        </div>
      </div>
      {/* Main content */}
      <div className="flex flex-row gap-0 w-full flex-1" style={{ minHeight: 'calc(100vh - 80px)' }}>
        {/* Sidebar menu */}
        <div className="flex flex-col gap-2 w-64 bg-[#181c2f] border-r border-[#232946] py-10 px-4">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              className={`flex items-center gap-3 rounded-lg px-6 py-3 text-lg font-semibold transition shadow border border-[#232946] mb-2 ${activeSection === item.label ? 'bg-[#232946] text-[#7b52d3]' : 'bg-[#232946] text-white hover:bg-[#7b52d3] hover:text-white'}`}
              onClick={() => setActiveSection(item.label)}
            >
              <span className="text-2xl">{item.icon}</span> {item.label}
            </button>
          ))}
        </div>
        {/* Dashboard main area */}
        <div className="flex-1 p-12 flex flex-col gap-8">
          {activeSection === "Profile" && (
            <div className="bg-[#232946] rounded-2xl shadow-lg p-8 flex flex-col gap-8">
              {/* ...existing profile code... */}
              <div className="flex gap-8 items-center">
                <img src="/profile-placeholder.png" alt="Profile" className="w-32 h-32 rounded-full border-4 border-[#7b52d3] object-cover" />
                <div>
                  <h2 className="text-2xl font-bold mb-2">Jane Influencer</h2>
                  <p className="text-gray-300 mb-1">Fashion, Travel</p>
                  <p className="text-gray-400">Bio: Passionate creator sharing travel and fashion inspiration.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-6">
                {/* Connected Platforms */}
                <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-[#7b52d3]">
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><span>🌐</span>Connected Platforms</h3>
                  <ul className="space-y-2">
                    <li>Instagram: <span className="font-semibold">120k</span> followers</li>
                    <li>YouTube: <span className="font-semibold">50k</span> subscribers</li>
                    <li>TikTok: <span className="font-semibold">80k</span> followers</li>
                  </ul>
                  <div className="mt-2 text-sm text-gray-400">Engagement rate: <span className="font-bold text-[#7b52d3]">5.2%</span></div>
                  <div className="mt-2 text-sm text-gray-400">Avg likes/comments/views per post</div>
                  <div className="mt-2 text-sm text-gray-400">Verified: <a href="#" className="underline text-[#7b52d3]">OAuth</a></div>
                </div>
                {/* Portfolio Section */}
                <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-[#7b52d3] col-span-2">
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><span>📁</span>Portfolio</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#232946] rounded-lg p-4 shadow">
                      <p className="font-semibold">Collab: Brand Orbit</p>
                      <p className="text-gray-400 text-sm">Sample post, media, etc.</p>
                    </div>
                    <div className="bg-[#232946] rounded-lg p-4 shadow">
                      <p className="font-semibold">Collab: TechX</p>
                      <p className="text-gray-400 text-sm">Sample post, media, etc.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeSection === "List Packages" && (
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
          )}
          {/* Other sections can be added here */}
        </div>
      </div>
    </div>
  );
};


export default InfluencerDashboard;
