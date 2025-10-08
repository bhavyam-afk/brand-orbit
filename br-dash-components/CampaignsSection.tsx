import React, { useState } from "react";

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

const brandCampaigns: Campaign[] = [
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

const CampaignsSection = () => {
  const [showDashboard, setShowDashboard] = useState<Campaign | null>(null);
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
};

export default CampaignsSection;
