import React from "react";

const campaignTabs = [
  { key: 'active', label: 'Active Campaigns', icon: '🔷' },
  { key: 'pending', label: 'Pending Offers', icon: '🟧' },
  { key: 'completed', label: '🏁 Completed Campaigns', icon: '🏁' },
];

interface Campaign {
  id: string;
  brandName: string;
  brandLogo?: string;
  campaignName?: string;
  packageTitle: string;
  status: string;
  cost: number;
  reach?: number;
  engagement?: number;
  postLinks?: any;
}

interface CampaignsProps {
  initialCampaigns?: Campaign[];
}

const Campaigns: React.FC<CampaignsProps> = ({ initialCampaigns }) => {
  const [campaignTab, setCampaignTab] = React.useState<string>('ACTIVE');
  const [selectedCampaign, setSelectedCampaign] = React.useState<Campaign | null>(null);
  const [campaigns, setCampaigns] = React.useState<Campaign[]>(initialCampaigns || []);
  const [loading, setLoading] = React.useState(!initialCampaigns);

  React.useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const username = window.location.pathname.split('/')[2]; // Get username from URL
        const response = await fetch(`/api/influencer2/${username}/campaigns`);
        const data = await response.json();
        if (response.ok) {
          setCampaigns(data.campaigns);
        } else {
          console.error('Failed to fetch campaigns:', data.error);
        }
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!initialCampaigns) {
      fetchCampaigns();
    }
  }, [initialCampaigns]);

  if (loading) {
    return <div className="text-center py-8">Loading campaigns...</div>;
  }

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
                {campaign.brandLogo && <img src={campaign.brandLogo} alt={campaign.brandName} className="w-10 h-10 rounded-full border-2 border-[#7b52d3] object-cover" />}
                <span className="font-bold text-lg">{campaign.brandName}</span>
              </div>
              <div className="font-semibold text-[#7b52d3]">{campaign.packageTitle}</div>
              <div className="text-sm text-gray-400">Status: <span className="font-bold text-white">{campaign.status}</span></div>
              <div className="text-sm text-gray-400">Cost: <span className="font-bold text-white">${Number(campaign.cost).toLocaleString()}</span></div>
              {campaign.reach && (
                <div className="text-sm text-gray-400">
                  Reach: <span className="font-bold text-white">{campaign.reach.toLocaleString()}</span>
                </div>
              )}
              {campaign.engagement && (
                <div className="text-sm text-gray-400">
                  Engagement: <span className="font-bold text-white">{campaign.engagement}%</span>
                </div>
              )}
              {campaign.postLinks && (
                <div className="mt-2">
                  <div className="text-sm text-gray-400 mb-2">Posts:</div>
                  <div className="flex gap-2 flex-wrap">
                    {Object.entries(campaign.postLinks).map(([platform, url]) => (
                      <a
                        key={platform}
                        href={url as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-[#7b52d3]/20 rounded-lg text-sm text-[#7b52d3] hover:bg-[#7b52d3]/30"
                      >
                        {platform}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              <button
                className="mt-2 px-4 py-2 bg-[#7b52d3] text-white rounded-lg font-bold shadow hover:bg-[#5a3ca0]"
                onClick={() => setSelectedCampaign(campaign)}
              >View Details</button>
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
              {selectedCampaign.brandLogo && (
                <img src={selectedCampaign.brandLogo} alt={selectedCampaign.brandName} className="w-12 h-12 rounded-full border-2 border-[#7b52d3] object-cover" />
              )}
              <span className="font-bold text-2xl">{selectedCampaign.brandName}</span>
            </div>
            <div className="font-semibold text-[#7b52d3] text-xl mb-2">{selectedCampaign.packageTitle}</div>
            <div className="text-sm text-gray-400 mb-2">Status: <span className="font-bold text-white">{selectedCampaign.status}</span></div>
            <div className="text-sm text-gray-400 mb-2">Cost: <span className="font-bold text-white">${Number(selectedCampaign.cost).toLocaleString()}</span></div>
            
            {selectedCampaign.reach && (
              <div className="text-sm text-gray-400 mb-2">
                Reach: <span className="font-bold text-white">{selectedCampaign.reach.toLocaleString()}</span>
              </div>
            )}
            
            {selectedCampaign.engagement && (
              <div className="text-sm text-gray-400 mb-2">
                Engagement: <span className="font-bold text-white">{selectedCampaign.engagement}%</span>
              </div>
            )}

            {selectedCampaign.postLinks && (
              <div className="mt-4">
                <div className="text-sm text-gray-400 mb-2">Posted Content:</div>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(selectedCampaign.postLinks).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-[#7b52d3]/20 rounded-lg text-sm text-[#7b52d3] hover:bg-[#7b52d3]/30"
                    >
                      {platform}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {selectedCampaign.status === 'ACTIVE' && (
              <button className="mt-4 px-4 py-2 bg-[#7b52d3] text-white rounded-lg font-bold shadow hover:bg-[#5a3ca0]">
                Submit Work
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Campaigns;
