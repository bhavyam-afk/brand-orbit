"use client";

import React from "react";

const dealTabs = [
  { key: "ACTIVE", label: "Active Deals", icon: "🔷" },
  { key: "PENDING", label: "Requests", icon: "🟧" },
  { key: "COMPLETED", label: "Completed Deals", icon: "🏁" },
] as const;

type DealStatus = "ACTIVE" | "PENDING" | "COMPLETED";

interface Deal {
  id: string;
  brandName: string;
  brandLogo?: string;
  campaignName?: string;
  packageTitle: string;
  status: DealStatus;
  cost: number;
  reach?: number;
  engagement?: number;
  postLinks?: Record<string, string>;
}

interface DealsProps {
  initialDeals?: Deal[];
}

const Deals: React.FC<DealsProps> = () => {
  const [dealTab, setDealTab] = React.useState<DealStatus>("ACTIVE");
  const [selectedDeal, setSelectedDeal] = React.useState<Deal | null>(null);
  const [deals, setDeals] = React.useState<Deal[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [acceptingIds, setAcceptingIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    const username = window.location.pathname.split("/")[2];
    if (!username) return;

    async function fetchcalls(){
      const res = await fetch(`/api/influencer/${username}/collaborations`);
      const data = await res.json();
      setDeals(data.collaborations || []);
      setLoading(false);
    }

    fetchcalls();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading campaigns...</div>;
  }

  // const filteredDeals = deals.filter(d => d.status === dealTab);
  return (
    <div className="bg-[#232946] w-[75vw] text-center mx-auto mt-5 rounded-2xl shadow-lg p-8 flex flex-col gap-8">

      <h2 className="text-2xl text-white font-bold flex items-center gap-2">
        <span>📣</span> Deals
      </h2>

      {/* Tabs */}
      <div className="flex gap-4">
        {dealTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setDealTab(tab.key)}
            className={`px-4 py-2 rounded-lg font-semibold border transition ${dealTab === tab.key ? "bg-[#7b52d3] text-white" : "bg-[#181c2f] text-[#7b52d3] border-[#7b52d3]" }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Deal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {deals.length === 0 && (
          <div className="text-gray-400">No deals found.</div>
        )}
 
        {deals.map(deal => ( dealTab === deal.status &&
          <div
            key={deal.id}
            className="bg-[#181c2f] rounded-xl p-6 shadow border border-[#7b52d3] flex flex-col gap-3"
          >
            <div className="flex items-center gap-3">
              {deal.brandLogo && (
                <img
                  src={deal.brandLogo}
                  alt={deal.brandName}
                  className="w-10 h-10 rounded-full border-2 border-[#7b52d3] object-cover"
                />
              )}
              <span className="font-bold text-lg">{deal.brandName}</span>
            </div>

            <div className="font-semibold text-[#7b52d3]">
              {deal.packageTitle}
            </div>

            <div className="text-sm text-gray-400">
              Status: <span className="text-white font-bold">{deal.status}</span>
            </div>

            <div className="text-sm text-gray-400">
              Cost: <span className="text-white font-bold">₹{Number(deal.cost ?? 0).toLocaleString()}</span>
            </div>

            {deal.reach && (
              <div className="text-sm text-gray-400">
                Reach: <span className="text-white">{deal.reach.toLocaleString()}</span>
              </div>
            )}

            {deal.engagement && (
              <div className="text-sm text-gray-400">
                Engagement: <span className="text-white">{deal.engagement}%</span>
              </div>
            )}
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setSelectedDeal(deal)}
                className="px-4 py-2 bg-[#7b52d3] text-white rounded-lg font-bold hover:bg-[#5a3ca0]"
              >
                View Details
              </button>

              {deal.status === 'PENDING' && (
                <button
                  onClick={async () => {
                    const username = window.location.pathname.split('/')[2];
                    if (!username) return;
                    setAcceptingIds(prev => [...prev, deal.id]);
                    try {
                      const res = await fetch(`/api/influencer/${encodeURIComponent(username)}/collaborations/${deal.id}/accept`, { method: 'POST' });
                      if (!res.ok) {
                        const d = await res.json();
                        throw new Error(d?.error || res.statusText || 'Accept failed');
                      }
                      const data = await res.json();
                      const updated = data.collaboration ?? data;
                      setDeals(prev => prev.map(p => p.id === deal.id ? { ...p, status: updated?.status ?? 'ACTIVE' } : p));
                      // why this ? 
                      setDealTab('ACTIVE');
                    } catch (err) {
                      console.error('Accept error', err);
                    } finally {
                      setAcceptingIds(prev => prev.filter(id => id !== deal.id));
                    }
                  }}
                  disabled={acceptingIds.includes(deal.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-500"
                >
                  {acceptingIds.includes(deal.id) ? 'Accepting…' : 'Accept'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedDeal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#232946] rounded-2xl p-8 w-full max-w-lg relative">
            <button
              className="absolute top-4 right-4 text-white text-xl"
              onClick={() => setSelectedDeal(null)}
            >
              &times;
            </button>

            <h3 className="text-2xl font-bold mb-4">
              {selectedDeal.brandName}
            </h3>

            <div className="text-[#7b52d3] font-semibold text-lg mb-2">
              {selectedDeal.packageTitle}
            </div>

            <div className="text-sm text-gray-400">
              Status: <span className="text-white">{selectedDeal.status}</span>
            </div>

            <div className="text-sm text-gray-400">
              Cost: <span className="text-white font-bold">₹{Number(selectedDeal.cost ?? 0).toLocaleString()}</span>
            </div>

            {selectedDeal.status === "ACTIVE" && (
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

export default Deals;
