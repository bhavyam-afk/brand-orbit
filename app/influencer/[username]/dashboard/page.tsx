"use client";
import React from "react";
import { useRouter } from "next/navigation";

// Dummy campaign data for sketch
const campaignTabs = [
  { key: 'active', label: 'Active Campaigns', icon: '🔷' },
  { key: 'pending', label: 'Pending Offers', icon: '🟧' },
  { key: 'completed', label: '🏁 Completed Campaigns', icon: '🏁' },
];

type Campaign = {
  id: number;
  brand: { name: string; logo: string };
  title: string;
  status: 'active' | 'pending' | 'completed';
  payment: string;
  deliverables: { type: string; date: string }[];
};

const dummyCampaigns: Campaign[] = [
  {
    id: 1,
    brand: { name: 'Brand Orbit', logo: '/brand-orbit-logo.png' },
    title: 'Winter Collection Launch',
    status: 'active',
    payment: 'Paid',
    deliverables: [
      { type: 'Instagram Story', date: '2025-10-10' },
      { type: 'Feed Post', date: '2025-10-12' },
    ],
  },
  {
    id: 2,
    brand: { name: 'TechX', logo: '/techx-logo.png' },
    title: 'Gadget Review',
    status: 'pending',
    payment: 'Pending',
    deliverables: [
      { type: 'YouTube Video', date: '2025-10-15' },
    ],
  },
  {
    id: 3,
    brand: { name: 'Foodies', logo: '/foodies-logo.png' },
    title: 'Recipe Collaboration',
    status: 'completed',
    payment: 'Paid',
    deliverables: [
      { type: 'Instagram Reel', date: '2025-09-30' },
    ],
  },
];




const menuItems = [
  { icon: "👤", label: "Profile" },
  { icon: "📦", label: "List Packages" },
  { icon: "📣", label: "Campaigns" },
  { icon: "📊", label: "Analytics" },
  { icon: "💰", label: "Wallet" },
  { icon: "⚙️", label: "Settings" },
];



const InfluencerDashboard = () => {
  const [activeSection, setActiveSection] = React.useState("Profile");
  const [campaignTab, setCampaignTab] = React.useState<'active' | 'pending' | 'completed'>('active');
  const [selectedCampaign, setSelectedCampaign] = React.useState<Campaign | null>(null);
  const router = useRouter();
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
          <button
            className="bg-[#7b52d3] hover:bg-[#5a3ca0] text-white px-4 py-2 rounded-lg font-bold shadow"
            onClick={() => router.push("/")}
          >Log Out</button>
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
            // ...existing profile code...
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
            // ...existing List Packages code...
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
          
          
          {activeSection === "Analytics" && (
            <div className="bg-[#232946] rounded-2xl shadow-lg p-8 flex flex-col gap-8 border border-[#7b52d3]">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-[#7b52d3]">
                <span role="img" aria-label="analytics">📊</span>Analytics Dashboard
              </h2>
              <div className="text-gray-300 mb-6 text-lg">
                Pull analytics data from connected platforms using APIs.
              </div>
              {/* Growth Graphs */}
              <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-[#7b52d3] mb-4">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-[#7b52d3]">
                  <span role="img" aria-label="growth">📈</span>Growth Graphs
                </h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>Followers over time</li>
                  <li className="text-[#7b52d3]">[API: GET /api/influencer/analytics/growth]</li>
                </ul>
              </div>
              {/* Engagement Metrics */}
              <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-[#7b52d3] mb-4">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-red-400">
                  <span role="img" aria-label="engagement">❤️</span>Engagement Metrics
                </h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>Likes, comments, shares, engagement rate</li>
                  <li className="text-[#7b52d3]">[API: GET /api/influencer/analytics/engagement]</li>
                </ul>
              </div>
              {/* Audience Demographics */}
              <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-[#7b52d3] mb-4">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-blue-400">
                  <span role="img" aria-label="audience">�</span>Audience Demographics
                </h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>Age, gender, location</li>
                  <li className="text-[#7b52d3]">[API: GET /api/influencer/analytics/demographics]</li>
                </ul>
              </div>
              {/* Best Time to Post */}
              <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-[#7b52d3] mb-4">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-gray-300">
                  <span role="img" aria-label="clock">🕒</span>Best Time to Post
                </h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>Recommended posting times based on audience activity</li>
                  <li className="text-[#7b52d3]">[API: GET /api/influencer/analytics/best-time]</li>
                </ul>
              </div>
              {/* Top-Performing Content */}
              <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-[#7b52d3] mb-4">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-green-400">
                  <span role="img" aria-label="top-content">💬</span>Top-Performing Content
                </h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>Posts, videos, or stories with highest engagement</li>
                  <li className="text-[#7b52d3]">[API: GET /api/influencer/analytics/top-content]</li>
                </ul>
              </div>
              {/* Powered by APIs */}
              <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-green-400">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-green-400">
                  <span role="img" aria-label="check">✅</span>Can be powered by:
                </h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>Instagram Graph API</li>
                  <li>YouTube Data API</li>
                  <li>TikTok Business API (optional later)</li>
                </ul>
              </div>
            </div>
          )}
          
          
          {activeSection === "Campaigns" && (
            <div className="bg-[#232946] rounded-2xl shadow-lg p-8 flex flex-col gap-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><span>�</span>Campaigns</h2>
              {/* Tabs */}
              <div className="flex gap-4 mb-6">
                {campaignTabs.map(tab => (
                  <button
                    key={tab.key}
                    className={`px-4 py-2 rounded-lg font-semibold border ${campaignTab === tab.key ? 'bg-[#7b52d3] text-white' : 'bg-[#181c2f] text-[#7b52d3] border-[#7b52d3]'} transition`}
                    onClick={() => setCampaignTab(tab.key as 'active' | 'pending' | 'completed')}
                  >
                    <span className="mr-2">{tab.icon}</span>{tab.label}
                  </button>
                ))}
              </div>
              {/* Campaign Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dummyCampaigns.filter(c =>
                  (campaignTab === 'active' && c.status === 'active') ||
                  (campaignTab === 'pending' && c.status === 'pending') ||
                  (campaignTab === 'completed' && c.status === 'completed')
                ).map(campaign => (
                  <div key={campaign.id} className="bg-[#181c2f] rounded-xl p-6 shadow border border-[#7b52d3] flex flex-col gap-3">
                    <div className="flex items-center gap-3 mb-2">
                      <img src={campaign.brand.logo} alt={campaign.brand.name} className="w-10 h-10 rounded-full border-2 border-[#7b52d3] object-cover" />
                      <span className="font-bold text-lg">{campaign.brand.name}</span>
                    </div>
                    <div className="font-semibold text-[#7b52d3]">{campaign.title}</div>
                    <div className="text-sm text-gray-400">Status: <span className="font-bold text-white">{campaign.status}</span></div>
                    <div className="text-sm text-gray-400">Payment: <span className="font-bold text-white">{campaign.payment}</span></div>
                    <div className="text-sm text-gray-400 mb-2">Deliverables:</div>
                    <ul className="ml-4 text-sm text-gray-300 mb-2">
                      {campaign.deliverables.map((d, i) => (
                        <li key={i}>{d.type} – {d.date}</li>
                      ))}
                    </ul>
                    <button
                      className="mt-2 px-4 py-2 bg-[#7b52d3] text-white rounded-lg font-bold shadow hover:bg-[#5a3ca0]"
                      onClick={() => setSelectedCampaign(campaign)}
                    >View Details / Submit Work</button>
                  </div>
                ))}
              </div>
              {/* Modal for campaign details */}
              {selectedCampaign && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                  <div className="bg-[#232946] rounded-2xl shadow-lg p-8 w-full max-w-lg relative">
                    <button className="absolute top-4 right-4 text-white text-xl" onClick={() => setSelectedCampaign(null)}>&times;</button>
                    <div className="flex items-center gap-3 mb-4">
                      <img src={selectedCampaign.brand.logo} alt={selectedCampaign.brand.name} className="w-12 h-12 rounded-full border-2 border-[#7b52d3] object-cover" />
                      <span className="font-bold text-2xl">{selectedCampaign.brand.name}</span>
                    </div>
                    <div className="font-semibold text-[#7b52d3] text-xl mb-2">{selectedCampaign.title}</div>
                    <div className="text-sm text-gray-400 mb-2">Status: <span className="font-bold text-white">{selectedCampaign.status}</span></div>
                    <div className="text-sm text-gray-400 mb-2">Payment: <span className="font-bold text-white">{selectedCampaign.payment}</span></div>
                    <div className="text-sm text-gray-400 mb-2">Deliverables:</div>
                    <ul className="ml-4 text-sm text-gray-300 mb-4">
                      {selectedCampaign.deliverables.map((d, i) => (
                        <li key={i}>{d.type} – {d.date}</li>
                      ))}
                    </ul>
                    <button className="px-4 py-2 bg-[#7b52d3] text-white rounded-lg font-bold shadow hover:bg-[#5a3ca0]">Submit Work</button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          
          {activeSection === "Wallet" && (
            <div className="bg-[#232946] rounded-2xl shadow-lg p-8 flex flex-col gap-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><span role="img" aria-label="wallet">💰</span>Wallet & Payments</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Wallet Balance */}
                <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-[#7b52d3] flex flex-col gap-2">
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><span role="img" aria-label="money">💰</span>Wallet Balance</h3>
                  <div className="text-gray-400 text-sm">Show current earnings</div>
                  <div className="mt-2 text-3xl font-bold text-[#7b52d3]">₹12,500</div>
                </div>
                {/* Transactions */}
                <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-[#7b52d3] flex flex-col gap-2">
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><span role="img" aria-label="transactions">🔄</span>Transactions</h3>
                  <div className="text-gray-400 text-sm">Payouts, pending, received</div>
                  <ul className="mt-2 text-gray-300 text-sm space-y-1">
                    <li>Received: ₹5,000 (Stripe)</li>
                    <li>Pending: ₹2,500 (Razorpay)</li>
                    <li>Payout: ₹5,000 (PayPal)</li>
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
          )}
          
          
          {activeSection === "Settings" && (
            <div className="bg-[#232946] rounded-2xl shadow-lg p-8 flex flex-col gap-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><span role="img" aria-label="settings">⚙️</span>Settings & Verification</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Edit Profile, Social Links, Pricing, Notifications */}
                <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-[#7b52d3] flex flex-col gap-2">
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><span role="img" aria-label="gear">⚙️</span>Edit Profile & Preferences</h3>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>Edit profile info</li>
                    <li>Social links</li>
                    <li>Pricing</li>
                    <li>Notification preferences</li>
                  </ul>
                  <div className="mt-2 text-gray-400 text-xs">[Edit/Profile Form Placeholder]</div>
                </div>
                {/* Verification Badge System */}
                <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-[#7b52d3] flex flex-col gap-2">
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><span role="img" aria-label="badge">🪪</span>Verification Badge System</h3>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>Email verification</li>
                    <li>Identity verification</li>
                    <li>Follower authenticity</li>
                  </ul>
                  <div className="mt-2 text-gray-400 text-xs">[Verification Badge Placeholder]</div>
                </div>
              </div>
            </div>
          )}


        </div>
      </div>
    </div>
  );
};


export default InfluencerDashboard;
