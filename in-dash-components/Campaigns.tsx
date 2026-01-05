"use client";

import React from "react";

const campaignTabs = [
  { key: "ACTIVE", label: "Active Campaigns", icon: "🔷" },
  { key: "PENDING", label: "Requests", icon: "🟧" },
  { key: "COMPLETED", label: "Completed Campaigns", icon: "🏁" },
] as const;

type CampaignStatus = "ACTIVE" | "PENDING" | "COMPLETED";

interface Campaign {
  id: string;
  brandName: string;
  brandLogo?: string;
  campaignName?: string;
  packageTitle: string;
  status: CampaignStatus;
  cost: number;
  reach?: number;
  engagement?: number;
  postLinks?: Record<string, string>;
}

interface CampaignsProps {
  initialCampaigns?: Campaign[];
}

const Campaigns: React.FC<CampaignsProps> = ({ initialCampaigns }) => {
  const [campaignTab, setCampaignTab] = React.useState<CampaignStatus>("ACTIVE");
  const [selectedCampaign, setSelectedCampaign] = React.useState<Campaign | null>(null);
  const [campaigns, setCampaigns] = React.useState<Campaign[]>(initialCampaigns || []);
  const [loading, setLoading] = React.useState(!initialCampaigns);
  const [acceptingIds, setAcceptingIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    const username = window.location.pathname.split("/")[2];
    if (!username) return;

    // Only skip fetch if initialCampaigns actually has data
    if (initialCampaigns && initialCampaigns.length > 0) {
      setLoading(false);
      return;
    }

    setLoading(true);

    fetch(`/api/influencer2/${username}/campaigns`)
      .then(res => res.json())
      .then(data => {
        console.log("RAW API RESPONSE:", data);

        const raw = data?.collaborations ?? data?.campaigns ?? [];

        const mapped: Campaign[] = raw.map((c: any) => ({
          id: c.id,
          brandName: c.brand?.username ?? "Brand",
          brandLogo: c.brand?.logoUrl,
          campaignName: c.campaign?.name,
          packageTitle: c.package?.title ?? "Package",
          status: c.status,
          cost: Number(c.finalCost),
          reach: c.reportedReach ?? undefined,
          engagement: c.reportedEngagement ?? undefined,
          postLinks: c.linksToPosts ?? undefined,
        }));
        setCampaigns(mapped);
      })
      .catch(err => {
        console.error("campaigns fetch error", err);
      })
      .finally(() => setLoading(false));
  }, [initialCampaigns]);

  if (loading) {
    return <div className="text-center py-8">Loading campaigns...</div>;
  }

  const filteredCampaigns = campaigns.filter(c => c.status === campaignTab);
  return (
    <div className="bg-[#232946] rounded-2xl shadow-lg p-8 flex flex-col gap-8">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <span>📣</span> Campaigns
      </h2>

      {/* Tabs */}
      <div className="flex gap-4">
        {campaignTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setCampaignTab(tab.key)}
            className={`px-4 py-2 rounded-lg font-semibold border transition
              ${campaignTab === tab.key
                ? "bg-[#7b52d3] text-white"
                : "bg-[#181c2f] text-[#7b52d3] border-[#7b52d3]"
              }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Campaign Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCampaigns.length === 0 && (
          <div className="text-gray-400">No campaigns found.</div>
        )}

        {filteredCampaigns.map(campaign => (
          <div
            key={campaign.id}
            className="bg-[#181c2f] rounded-xl p-6 shadow border border-[#7b52d3] flex flex-col gap-3"
          >
            <div className="flex items-center gap-3">
              {campaign.brandLogo && (
                <img
                  src={campaign.brandLogo}
                  alt={campaign.brandName}
                  className="w-10 h-10 rounded-full border-2 border-[#7b52d3] object-cover"
                />
              )}
              <span className="font-bold text-lg">{campaign.brandName}</span>
            </div>

            <div className="font-semibold text-[#7b52d3]">
              {campaign.packageTitle}
            </div>

            {campaign.campaignName && (
              <div className="text-sm text-gray-400">
                Campaign: <span className="text-white">{campaign.campaignName}</span>
              </div>
            )}

            <div className="text-sm text-gray-400">
              Status: <span className="text-white font-bold">{campaign.status}</span>
            </div>

            <div className="text-sm text-gray-400">
              Cost: <span className="text-white font-bold">₹{campaign.cost.toLocaleString()}</span>
            </div>

            {campaign.reach && (
              <div className="text-sm text-gray-400">
                Reach: <span className="text-white">{campaign.reach.toLocaleString()}</span>
              </div>
            )}

            {campaign.engagement && (
              <div className="text-sm text-gray-400">
                Engagement: <span className="text-white">{campaign.engagement}%</span>
              </div>
            )}
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setSelectedCampaign(campaign)}
                className="px-4 py-2 bg-[#7b52d3] text-white rounded-lg font-bold hover:bg-[#5a3ca0]"
              >
                View Details
              </button>

              {campaign.status === 'PENDING' && (
                <button
                  onClick={async () => {
                    const username = window.location.pathname.split('/')[2];
                    if (!username) return;
                    setAcceptingIds(prev => [...prev, campaign.id]);
                    try {
                      const res = await fetch(`/api/influencer2/${encodeURIComponent(username)}/collaborations/${campaign.id}/accept`, { method: 'POST' });
                      if (!res.ok) {
                        const d = await res.json().catch(() => ({}));
                        throw new Error(d?.error || res.statusText || 'Accept failed');
                      }
                      const data = await res.json().catch(() => ({}));
                      const updated = data?.collaboration ?? data;
                      setCampaigns(prev => prev.map(p => p.id === campaign.id ? { ...p, status: updated?.status ?? 'ACTIVE' } : p));
                      setCampaignTab('ACTIVE');
                    } catch (err) {
                      console.error('Accept error', err);
                    } finally {
                      setAcceptingIds(prev => prev.filter(id => id !== campaign.id));
                    }
                  }}
                  disabled={acceptingIds.includes(campaign.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-500"
                >
                  {acceptingIds.includes(campaign.id) ? 'Accepting…' : 'Accept'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#232946] rounded-2xl p-8 w-full max-w-lg relative">
            <button
              className="absolute top-4 right-4 text-white text-xl"
              onClick={() => setSelectedCampaign(null)}
            >
              &times;
            </button>

            <h3 className="text-2xl font-bold mb-4">
              {selectedCampaign.brandName}
            </h3>

            <div className="text-[#7b52d3] font-semibold text-lg mb-2">
              {selectedCampaign.packageTitle}
            </div>

            <div className="text-sm text-gray-400">
              Status: <span className="text-white">{selectedCampaign.status}</span>
            </div>

            <div className="text-sm text-gray-400">
              Cost: <span className="text-white">₹{selectedCampaign.cost.toLocaleString()}</span>
            </div>

            {selectedCampaign.status === "ACTIVE" && (
              <button className="mt-6 px-4 py-2 bg-[#7b52d3] text-white rounded-lg font-bold hover:bg-[#5a3ca0]">
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
