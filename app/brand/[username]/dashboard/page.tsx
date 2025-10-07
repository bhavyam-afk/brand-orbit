"use client";
import React from "react";
import { useRouter } from "next/navigation";


function SettingsSection() {
  return (
    <div className="bg-[#232946] rounded-2xl shadow-lg p-8 flex flex-col gap-8 border border-gray-400">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-300">
        <span role="img" aria-label="settings">⚙️</span>Settings, Integrations, and Support
      </h2>
      <div className="text-gray-300 mb-6 text-lg">
        <span className="font-bold text-white">Purpose:</span> Manage account, team, and external connections.
      </div>
      {/* Account & Security */}
      <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-gray-300 mb-4">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-yellow-300">
          <span role="img" aria-label="lock">🔒</span>Account & Security
        </h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>2FA, API tokens</li>
          <li className="text-gray-300">[API: GET/POST /api/brand/settings/security]</li>
        </ul>
      </div>
      {/* Team Access Management */}
      <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-gray-300 mb-4">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-blue-300">
          <span role="img" aria-label="team">🧑‍💼</span>Team Access Management
        </h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>Admin, Editor, Analyst roles</li>
          <li className="text-gray-300">[API: GET/POST /api/brand/settings/team]</li>
        </ul>
      </div>
      {/* Integrations */}
      <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-gray-300 mb-4">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-green-300">
          <span role="img" aria-label="integrations">🔗</span>Integrations
        </h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>CRM (HubSpot, Notion), ad trackers, Google Analytics</li>
          <li className="text-gray-300">[API: GET/POST /api/brand/settings/integrations]</li>
        </ul>
      </div>
      {/* Subscription Plan Management */}
      <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-gray-300 mb-4">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-purple-300">
          <span role="img" aria-label="subscription">🗒️</span>Subscription Plan Management
        </h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>Manage subscription plans</li>
          <li className="text-gray-300">[API: GET/POST /api/brand/settings/subscription]</li>
        </ul>
      </div>
      {/* Help & Support */}
      <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-red-400">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-red-400">
          <span role="img" aria-label="support">🆘</span>Help & Support Chatbot / Ticket System
        </h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>Chatbot, ticket system for support</li>
          <li className="text-gray-300">[API: GET/POST /api/brand/settings/support]</li>
        </ul>
      </div>
    </div>
  );
}

// Dummy campaigns for dashboard
const brandCampaigns = [
  {
    id: 1,
    name: "Summer Launch 2025",
    objective: "Promote new summer collection",
    budget: "$5,000",
    status: "Live",
    deliverables: ["Instagram Reel", "YouTube Video"],
    timeline: "2025-06-01 to 2025-06-30",
    milestones: ["Requested", "Accepted", "Live", "Completed", "Paid"],
    currentStatus: "Live"
  },
  {
    id: 2,
    name: "Brand Awareness Drive",
    objective: "Increase brand reach",
    budget: "$3,000",
    status: "Accepted",
    deliverables: ["Instagram Story"],
    timeline: "2025-07-01 to 2025-07-15",
    milestones: ["Requested", "Accepted", "Live", "Completed", "Paid"],
    currentStatus: "Accepted"
  }
];

type Campaign = {
  id: number;
  name: string;
  objective: string;
  budget: string;
  status: string;
  deliverables: string[];
  timeline: string;
  milestones: string[];
  currentStatus: string;
};

function CampaignsSection() {
  const [showDashboard, setShowDashboard] = React.useState<Campaign | null>(null);
  return (
    <div className="bg-[#232946] rounded-2xl shadow-lg p-8 flex flex-col gap-8 border border-yellow-300">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-yellow-300"><span>📦</span>Campaign & Brief Management</h2>
      {/* Create Campaigns */}
      <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-yellow-200 mb-4">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><span role="img" aria-label="brief">🗒️</span>Create Campaigns</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>Campaign name, objective, budget, deliverables</li>
          <li><span className="text-yellow-300">[Create Campaign Form Placeholder]</span></li>
        </ul>
      </div>
      {/* Dynamic Contract Creation */}
      <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-yellow-200 mb-4">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><span role="img" aria-label="contract">📑</span>Dynamic Contract Creation</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>Generate contracts via eDocuSign, etc.</li>
          <li><span className="text-yellow-300">[Contract Creation Placeholder]</span></li>
        </ul>
      </div>
      {/* Campaign Dashboard */}
      <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-yellow-200 mb-4">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><span role="img" aria-label="dashboard">📦</span>Campaign Dashboard</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>Each collaboration shows status: <span className="italic">Requested → Accepted → Live → Completed → Paid</span></li>
        </ul>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {brandCampaigns.map(c => (
            <div key={c.id} className="bg-[#232946] rounded-lg p-4 shadow border border-yellow-200 flex flex-col gap-2">
              <div className="font-bold text-lg text-yellow-300">{c.name}</div>
              <div className="text-gray-300 text-sm">Objective: {c.objective}</div>
              <div className="text-gray-300 text-sm">Budget: {c.budget}</div>
              <div className="text-gray-300 text-sm">Deliverables: {c.deliverables.join(", ")}</div>
              <div className="text-gray-300 text-sm">Timeline: {c.timeline}</div>
              <div className="text-gray-300 text-sm">Status: <span className="font-bold text-yellow-300">{c.currentStatus}</span></div>
              <button
                className="mt-2 px-4 py-2 bg-yellow-300 text-[#232946] rounded-lg font-bold shadow hover:bg-yellow-400"
                onClick={() => setShowDashboard(c)}
              >View Dashboard</button>
            </div>
          ))}
        </div>
      </div>
      {/* Timeline & Milestones */}
      <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-yellow-200 mb-4">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><span role="img" aria-label="calendar">📅</span>Timeline & Milestones</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>Campaign start/end dates</li>
          <li>Submission deadlines</li>
          <li><span className="text-yellow-300">[Milestone Tracker Placeholder]</span></li>
        </ul>
      </div>
      {/* Content Deliverables Tracking */}
      <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-yellow-200 mb-4">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><span role="img" aria-label="clipboard">📋</span>Content Deliverables Tracking</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>Number of reels, posts, stories, YouTube integrations, etc.</li>
          <li><span className="text-yellow-300">[Deliverables Table Placeholder]</span></li>
        </ul>
      </div>
      {/* Template Library */}
      <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-yellow-200">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><span role="img" aria-label="template">🧩</span>Template Library</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>Prebuilt templates for "Product Launch", "Event Promotion", "Brand Awareness"</li>
          <li><span className="text-yellow-300">[Template Library Placeholder]</span></li>
        </ul>
      </div>
      {/* Modal for campaign dashboard */}
      {showDashboard && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#232946] rounded-2xl shadow-lg p-8 w-full max-w-lg relative border border-yellow-300">
            <button className="absolute top-4 right-4 text-yellow-300 text-xl" onClick={() => setShowDashboard(null)}>&times;</button>
            <div className="font-bold text-2xl text-yellow-300 mb-2">{showDashboard.name}</div>
            <div className="text-gray-300 mb-2">Objective: {showDashboard.objective}</div>
            <div className="text-gray-300 mb-2">Budget: {showDashboard.budget}</div>
            <div className="text-gray-300 mb-2">Deliverables: {showDashboard.deliverables.join(", ")}</div>
            <div className="text-gray-300 mb-2">Timeline: {showDashboard.timeline}</div>
            <div className="text-gray-300 mb-2">Status Flow:</div>
            <div className="flex gap-2 mb-4">
              {showDashboard.milestones.map((m, i) => (
                <span key={i} className={`px-3 py-1 rounded-lg font-semibold ${showDashboard.currentStatus === m ? 'bg-yellow-300 text-[#232946]' : 'bg-[#181c2f] text-yellow-300 border border-yellow-300'}`}>{m}</span>
              ))}
            </div>
            <button className="px-4 py-2 bg-yellow-300 text-[#232946] rounded-lg font-bold shadow hover:bg-yellow-400">Go to Contract</button>
          </div>
        </div>
      )}
    </div>
  );
}

const brandMenuItems = [
  { icon: "🧭", label: "Profile" },
  { icon: "📦", label: "Campaigns" },
  { icon: "📈", label: "ROI" },
  { icon: "💳", label: "Payments" },
  { icon: "📊", label: "Analytics" },
  { icon: "⚙️", label: "Settings" },
];

function AnalyticsSection() {
  return (
    <div className="bg-[#232946] rounded-2xl shadow-lg p-8 flex flex-col gap-8 border border-green-400">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-green-400">
        <span role="img" aria-label="analytics">📊</span>Analytics & Performance Insights
      </h2>
      <div className="text-gray-300 mb-6 text-lg">
        <span className="font-bold text-white">Purpose:</span> Measure the real impact of influencer campaigns.
      </div>
      {/* Campaign Analytics */}
      <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-green-300 mb-4">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-green-300">
          <span role="img" aria-label="chart">📈</span>Campaign Analytics
        </h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>Impressions, reach, engagement rate, click-through rate</li>
          <li className="text-green-300">[API: GET /api/brand/analytics/campaigns]</li>
        </ul>
      </div>
      {/* ROI Tracking */}
      <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-green-300 mb-4">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-yellow-300">
          <span role="img" aria-label="roi">💰</span>ROI Tracking
        </h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>Cost vs engagement metrics, cost per reach, conversions</li>
          <li className="text-green-300">[API: GET /api/brand/analytics/roi]</li>
        </ul>
      </div>
      {/* AI Insights */}
      <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-green-300 mb-4">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-pink-300">
          <span role="img" aria-label="ai">🧠</span>AI Insights
        </h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>“This influencer performed 32% better than average in your last 3 campaigns.”</li>
          <li className="text-green-300">[API: GET /api/brand/analytics/ai-insights]</li>
        </ul>
      </div>
      {/* Reports Export */}
      <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-green-300 mb-4">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-orange-300">
          <span role="img" aria-label="report">📋</span>Reports Export
        </h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>Download CSV, PDF, or share dashboards with team</li>
          <li className="text-green-300">[API: POST /api/brand/analytics/export]</li>
        </ul>
      </div>
      {/* Cross-Platform Analytics */}
      <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-green-300">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-blue-300">
          <span role="img" aria-label="cross-platform">🔗</span>Cross-Platform Analytics
        </h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>Combine metrics from multiple social platforms (IG + YouTube)</li>
          <li className="text-green-300">[API: GET /api/brand/analytics/cross-platform]</li>
        </ul>
      </div>
    </div>
  );
}



const BrandDashboard = () => {
  const [activeSection, setActiveSection] = React.useState("Profile");
  const router = useRouter();

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-[#0a0f2c] via-[#1a1f3c] to-[#232946] text-white">


      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-yellow-300 px-12 py-6">
        <div className="flex items-center gap-4">
          <div className="bg-white rounded-lg px-6 py-2 text-gray-800 font-bold text-lg shadow">logo</div>
        </div>
        <h1 className="text-3xl font-bold text-yellow-300">Brand Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="bg-[#232946] rounded-lg px-4 py-2 text-yellow-300 font-semibold shadow">brandname</div>
          <button
            className="bg-yellow-300 hover:bg-yellow-400 text-[#232946] px-4 py-2 rounded-lg font-bold shadow"
            onClick={() => router.push("/")}
          >Log Out</button>
        </div>
      </div>


      {/* Main content */}
      <div className="flex flex-row gap-0 w-full flex-1" style={{ minHeight: 'calc(100vh - 80px)' }}>


        {/* Sidebar menu */}
        <div className="flex flex-col gap-2 w-64 bg-[#181c2f] border-r border-yellow-300 py-10 px-4">
          {brandMenuItems.map((item, idx) => (
            <button
              key={idx}
              className={`flex items-center gap-3 rounded-lg px-6 py-3 text-lg font-semibold transition shadow border border-yellow-300 mb-2 ${activeSection === item.label ? 'bg-yellow-300 text-[#232946]' : 'bg-[#232946] text-yellow-300 hover:bg-yellow-400 hover:text-[#232946]'}`}
              onClick={() => setActiveSection(item.label)}
            >
              <span className="text-2xl">{item.icon}</span> {item.label}
            </button>
          ))}
        </div>


        {/* Dashboard main area */}
        <div className="flex-1 p-12 flex flex-col gap-8">


          {activeSection === "Profile" && (
            <div className="bg-[#232946] rounded-2xl shadow-lg p-8 flex flex-col gap-8 border border-yellow-300">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-yellow-300"><span>🧭</span>Brand Profile & Organization Setup</h2>
              {/* Brand Info Page */}
              <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-yellow-200 mb-4">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><span role="img" aria-label="id">🪪</span>Brand Info</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>Name: <span className="font-semibold">Brand Orbit</span></li>
                  <li>Logo: <span className="font-semibold">[Logo Upload]</span></li>
                  <li>Industry: <span className="font-semibold">Fashion</span></li>
                  <li>Website: <span className="font-semibold">www.brandorbit.com</span></li>
                  <li>Description: <span className="font-semibold">Leading fashion brand for Gen Z</span></li>
                  <li>Team Size: <span className="font-semibold">12</span></li>
                  <li>Location: <span className="font-semibold">Mumbai, India</span></li>
                </ul>
              </div>
              {/* Team Members & Roles */}
              <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-yellow-200 mb-4">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><span role="img" aria-label="team">👥</span>Team Members & Roles</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>Jane Doe – Marketing Lead</li>
                  <li>John Smith – Finance</li>
                  <li>Priya Patel – Analyst</li>
                  <li><span className="text-yellow-300">[Invite teammate + set role]</span></li>
                </ul>
              </div>
              {/* Verification System */}
              <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-yellow-200 mb-4">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><span role="img" aria-label="verified">✅</span>Verification System</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>Business verification via domain/email</li>
                  <li>Meta's verification API</li>
                  <li><span className="text-yellow-300">[Verify Now Button]</span></li>
                </ul>
              </div>
              {/* Brand Type Tagging */}
              <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-yellow-200">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><span role="img" aria-label="tag">💼</span>Brand Type Tagging</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>FMCG</li>
                  <li>Fashion</li>
                  <li>Tech</li>
                  <li>Fitness</li>
                  <li><span className="text-yellow-300">[Select/Tag Brand Type]</span></li>
                </ul>
              </div>
            </div>
          )}

          {activeSection === "Campaigns" && (
            <CampaignsSection />
          )}

          {activeSection === "Analytics" && (
            <AnalyticsSection />
          )}

          {activeSection === "Settings" && (
            <SettingsSection />
          )}


        </div>
      </div>
    </div>
  );
}

export default BrandDashboard;


