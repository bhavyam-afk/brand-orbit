import React from "react";

// Mock data for demonstration
const mockCampaigns = [
  {
    id: 1,
    status: 'active',
    brand: { name: 'Nike', logo: 'https://logo.clearbit.com/nike.com' },
    title: 'Nike Diwali Campaign',
    payment: '₹25,000',
    deliverables: [
      { type: 'Instagram Reel', date: '2025-10-20' },
      { type: 'Story', date: '2025-10-22' },
    ],
  },
  {
    id: 2,
    status: 'pending',
    brand: { name: 'L’Oreal', logo: 'https://logo.clearbit.com/loreal.com' },
    title: 'L’Oreal Festive Offer',
    payment: '₹18,000',
    deliverables: [
      { type: 'Instagram Post', date: '2025-10-25' },
    ],
  },
  {
    id: 3,
    status: 'active',
    brand: { name: 'Adidas', logo: 'https://logo.clearbit.com/adidas.com' },
    title: 'Adidas Winter Launch',
    payment: '₹30,000',
    deliverables: [
      { type: 'Reel', date: '2025-10-28' },
    ],
  },
];

const mockPerformance = {
  clicks: 1200,
  conversions: 320,
  summary: 'Last 30 days: 1200 clicks, 320 conversions',
};
const mockAISuggestion = 'You’re performing 20% better with beauty brands.';

interface CampaignsProps {
  campaigns?: any[];
}

const Campaigns: React.FC<CampaignsProps> = ({ campaigns = [] }) => {
  const [campaignTab, setCampaignTab] = React.useState<string>('active');
  const [selectedCampaign, setSelectedCampaign] = React.useState<any | null>(null);
  return (
    <div className="bg-[#232946] rounded-2xl shadow-lg p-8 flex flex-col gap-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><span>📣</span>Campaigns</h2>
      {/* 1. Active Campaigns */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-[#7b52d3] mb-2">Active Campaigns</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockCampaigns.filter(c => c.status === 'active').map(campaign => (
            <div key={campaign.id} className="bg-[#181c2f] rounded-xl p-4 shadow border border-[#7b52d3]">
              <div className="flex items-center gap-3 mb-2">
                {campaign.brand?.logo && <img src={campaign.brand.logo} alt={campaign.brand?.name || 'Brand'} className="w-8 h-8 rounded-full border-2 border-[#7b52d3] object-cover" />}
                <span className="font-bold text-base">{campaign.brand?.name || 'Brand'}</span>
              </div>
              <div className="font-semibold text-[#7b52d3]">{campaign.title}</div>
              <div className="text-sm text-gray-400">Payment: <span className="font-bold text-white">{campaign.payment}</span></div>
              <div className="text-sm text-gray-400 mb-2">Deliverables:</div>
              <ul className="ml-4 text-sm text-gray-300 mb-2">
                {Array.isArray(campaign.deliverables) && campaign.deliverables.map((d: { type: string; date: string }, i: number) => (
                  <li key={i}>{d.type} – {d.date}</li>
                ))}
              </ul>
              <button className="mt-2 px-3 py-1 bg-[#7b52d3] text-white rounded-lg font-bold shadow hover:bg-[#5a3ca0]" onClick={() => setSelectedCampaign(campaign)}>View Details</button>
            </div>
          ))}
          {mockCampaigns.filter(c => c.status === 'active').length === 0 && (
            <div className="text-gray-400">No active campaigns.</div>
          )}
        </div>
      </div>
      {/* 2. Pending Offers */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-[#f7b731] mb-2">Pending Offers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockCampaigns.filter(c => c.status === 'pending').map(campaign => (
            <div key={campaign.id} className="bg-[#181c2f] rounded-xl p-4 shadow border border-[#f7b731]">
              <div className="flex items-center gap-3 mb-2">
                {campaign.brand?.logo && <img src={campaign.brand.logo} alt={campaign.brand?.name || 'Brand'} className="w-8 h-8 rounded-full border-2 border-[#f7b731] object-cover" />}
                <span className="font-bold text-base">{campaign.brand?.name || 'Brand'}</span>
              </div>
              <div className="font-semibold text-[#f7b731]">{campaign.title}</div>
              <div className="text-sm text-gray-400">Payment: <span className="font-bold text-white">{campaign.payment}</span></div>
              <div className="text-sm text-gray-400 mb-2">Deliverables:</div>
              <ul className="ml-4 text-sm text-gray-300 mb-2">
                {Array.isArray(campaign.deliverables) && campaign.deliverables.map((d: { type: string; date: string }, i: number) => (
                  <li key={i}>{d.type} – {d.date}</li>
                ))}
              </ul>
              <button className="mt-2 px-3 py-1 bg-[#f7b731] text-white rounded-lg font-bold shadow hover:bg-[#bfa12e]" onClick={() => setSelectedCampaign(campaign)}>Accept / Reject</button>
            </div>
          ))}
          {mockCampaigns.filter(c => c.status === 'pending').length === 0 && (
            <div className="text-gray-400">No pending offers.</div>
          )}
        </div>
      </div>
      {/* 3. Performance Summary */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-[#45aaf2] mb-2">Performance Summary</h3>
        <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-[#45aaf2]">
          <div className="text-gray-200 mb-2">{mockPerformance.summary}</div>
          <div className="flex gap-6 mt-2">
            <div className="bg-[#232946] rounded-lg px-4 py-2 text-[#f7b731] font-bold">Clicks: {mockPerformance.clicks}</div>
            <div className="bg-[#232946] rounded-lg px-4 py-2 text-[#20bf6b] font-bold">Conversions: {mockPerformance.conversions}</div>
          </div>
        </div>
      </div>
      {/* 4. AI Suggestions */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-[#20bf6b] mb-2">AI Suggestions</h3>
        <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-[#20bf6b]">
          <div className="text-gray-200 text-lg font-semibold">{mockAISuggestion}</div>
        </div>
      </div>
      {/* Details Modal (unchanged) */}
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
              {Array.isArray(selectedCampaign.deliverables) && selectedCampaign.deliverables.map((d: { type: string; date: string }, i: number) => (
                <li key={i}>{d.type} – {d.date}</li>
              ))}
            </ul>
            <button className="px-4 py-2 bg-[#7b52d3] text-white rounded-lg font-bold shadow hover:bg-[#5a3ca0]">Submit Work</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Campaigns;
