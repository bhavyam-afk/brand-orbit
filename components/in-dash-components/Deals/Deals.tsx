"use client";

import React, { useState } from "react";
import { useDeals } from "./useDeals";
import { DealsList } from "./DealsList";
import { DealModal } from "./DealModal";
import { Deal, DealStatus } from "./types";

export default function Deals() {
  const { deals, setDeals, loading, acceptDeal, acceptingIds, reloadDeals } = useDeals();
  const [tab, setTab] = useState<DealStatus>("ACTIVE");
  const [selected, setSelected] = useState<Deal | null>(null);

  if (loading) return <div className="py-8">Loading deals…</div>;

  return (
    <div className="bg-[#232946] w-[75vw] mx-auto mt-5 rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-white mb-4">Deals</h2>

      <DealsList deals={deals} activeTab={tab} setActiveTab={setTab} onSelect={setSelected} onAccept={acceptDeal} acceptingIds={acceptingIds} />

      {selected && (
        <DealModal
          deal={selected}
          onClose={() => setSelected(null)}
          refreshDeals={() => reloadDeals()}
        />
      )}
    </div>
  );
}
