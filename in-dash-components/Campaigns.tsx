import React from "react";

const campaignTabs = [
  { key: 'active', label: 'Active Campaigns', icon: '🔷' },
  { key: 'pending', label: 'Pending Offers', icon: '🟧' },
  { key: 'completed', label: '🏁 Completed Campaigns', icon: '🏁' },
];

type Campaign = {
  id: number;
  brand: { name: string; logo: string };
  title: string;
  status: string;
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

const Campaigns = () => {
  const [campaignTab, setCampaignTab] = React.useState<string>('active');
  const [selectedCampaign, setSelectedCampaign] = React.useState<Campaign | null>(null);
  return (
    <div className="bg-[#232946] rounded-2xl shadow-lg p-8 flex flex-col gap-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><span>📣</span>Campaigns</h2>
      <div className="flex gap-4 mb-6">
        {campaignTabs.map(tab => (
          <button
            key={tab.key}
            className={`px-4 py-2 rounded-lg font-semibold border ${campaignTab === tab.key ? 'bg-[#7b52d3] text-white' : 'bg-[#181c2f] text-[#7b52d3] border-[#7b52d3]'} transition`}
            onClick={() => setCampaignTab(tab.key)}
          >
            <span className="mr-2">{tab.icon}</span>{tab.label}
          </button>
        ))}
      </div>
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
  );
};

export default Campaigns;
