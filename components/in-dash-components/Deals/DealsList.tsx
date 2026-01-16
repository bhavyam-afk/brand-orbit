"use client";

import { CustomPackageRequest } from "@prisma/client";
import { Deal, DealStatus } from "./types";

const dealTabs = [
  { key: "ACTIVE", label: "Active Deals", icon: "🔷" },
  { key: "PENDING", label: "Requests", icon: "🟧" },
  { key: "COMPLETED", label: "Completed Deals", icon: "🏁" },
  { key: "CUSTOM", label: "Custom Deals", icon: "💎" },
] as const;

type Props = {
  deals: Deal[];
  activeTab: "ACTIVE" | "PENDING" | "COMPLETED" | "CUSTOM";
  setActiveTab: (t: DealTabKey) => void;
  onSelect: (d: Deal) => void;
  onAccept: (id: string) => void;
  acceptingIds: string[];
  requests?: CustomPackageRequest[];
};

type DealTabKey = "ACTIVE" | "PENDING" | "COMPLETED" | "CUSTOM";

export function DealsList({
  deals,
  activeTab,
  setActiveTab,
  onSelect,
  onAccept,
  acceptingIds,
  requests,
}: Props) {
  return (
    <>
      <div className="flex gap-4">
        {dealTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as DealTabKey)}
            className={`px-4 py-2 rounded-lg font-semibold ${
              activeTab === tab.key ? "bg-[#7b52d3] text-white" : "bg-[#181c2f] text-[#7b52d3]"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 mt-5 md:grid-cols-2 gap-6">
        {(() => {
          const filteredDeals = deals.filter(d => d.collabstatus === activeTab);
          const customRequests = requests?.filter(() => activeTab === "CUSTOM") ?? [];
          const hasItems = filteredDeals.length > 0 || customRequests.length > 0;
          const tabLabel = dealTabs.find(t => t.key === activeTab)?.label || activeTab;

          if (!hasItems) {
            return (
              <div className="col-span-full text-center py-12 text-[#7b52d3]">
                No {tabLabel.toLowerCase()}.
              </div>
            );
          }

          return (
            <>
              {filteredDeals.map(deal => (
                <div
                  key={deal.id}
                  className="bg-[#181c2f] rounded-xl p-6 border border-[#7b52d3]"
                >
                  <div className="font-bold">{deal.brand.username}</div>
                  <div className="text-[#7b52d3]">{deal.package.title}</div>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => onSelect(deal)}
                      className="px-4 py-2 bg-[#7b52d3] text-white rounded-lg"
                    >
                      View Details
                    </button>

                    {deal.collabstatus === "PENDING" && (
                      <button
                        disabled={acceptingIds.includes(deal.id)}
                        onClick={() => onAccept(deal.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg"
                      >
                        Accept
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {customRequests.map((d) => (
                <div
                  key={d.id}
                  className="bg-[#181c2f] rounded-xl p-6 border border-[#7b52d3]"
                >
                  <div className="text-[#7b52d3]">{d.title}</div>

                  <div className="mt-3 flex gap-2">
                    <button
                      className="px-4 py-2 bg-[#7b52d3] text-white rounded-lg"
                    >
                      View Details
                    </button>

                  </div>
                </div>
              ))}
            </>
          );
        })()}
      </div>
    </>
  );
}
