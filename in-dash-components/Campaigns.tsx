import React from "react";

const campaignTabs = [
  { key: 'active', label: 'Active Campaigns', icon: '🔷' },
  { key: 'pending', label: 'Pending Offers', icon: '🟧' },
  { key: 'completed', label: '🏁 Completed Campaigns', icon: '🏁' },
];

interface CampaignsProps {
  campaigns?: any[];
}

const Campaigns: React.FC<CampaignsProps> = ({ campaigns = [] }) => {
  const [campaignTab, setCampaignTab] = React.useState<string>('active');
  const [selectedCampaign, setSelectedCampaign] = React.useState<any | null>(null);
  // Filter campaigns by tab
  const filtered = campaigns.filter(c => c.status === campaignTab);
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
        {filtered.length > 0 ? (
          filtered.map(campaign => (
            <div key={campaign.id} className="bg-[#181c2f] rounded-xl p-6 shadow border border-[#7b52d3] flex flex-col gap-3">
              <div className="flex items-center gap-3 mb-2">
                {campaign.brand?.logo && <img src={campaign.brand.logo} alt={campaign.brand?.name || "Brand"} className="w-10 h-10 rounded-full border-2 border-[#7b52d3] object-cover" />}
                <span className="font-bold text-lg">{campaign.brand?.name || "Brand"}</span>
              </div>
              <div className="font-semibold text-[#7b52d3]">{campaign.title}</div>
              <div className="text-sm text-gray-400">Status: <span className="font-bold text-white">{campaign.status}</span></div>
              <div className="text-sm text-gray-400">Payment: <span className="font-bold text-white">{campaign.payment}</span></div>
              <div className="text-sm text-gray-400 mb-2">Deliverables:</div>
              <ul className="ml-4 text-sm text-gray-300 mb-2">
                {Array.isArray(campaign.deliverables) && campaign.deliverables.map((d: { type: string; date: string }, i: number) => (
                  <li key={i}>{d.type} – {d.date}</li>
                ))}
              </ul>
              <button
                className="mt-2 px-4 py-2 bg-[#7b52d3] text-white rounded-lg font-bold shadow hover:bg-[#5a3ca0]"
                onClick={() => setSelectedCampaign(campaign)}
              >View Details / Submit Work</button>
            </div>
          ))
        ) : (
          <div className="text-gray-400">No campaigns found for this status.</div>
        )}
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
