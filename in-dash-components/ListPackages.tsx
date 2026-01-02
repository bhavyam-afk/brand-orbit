"use client";

import React, { useEffect, useState } from "react";

type Package = {
  id: string;
  title: string;
  description?: string | null;
  price: string | number; // Prisma Decimal becomes a string when serialized
  deliveryTimeDays?: number;
  thumbnailUrl?: string | null;
  mediaType?: string | null;
  deliverables?: string[] | null;
  status?: string;
};

interface ListPackagesProps {
  // If packages are provided by the parent, use them; otherwise this component will
  // try to fetch packages from /api/packages (best-effort).
  packages?: Package[];
  fetchUrl?: string;
}


const ListPackages: React.FC<ListPackagesProps> = ({ packages: initialPackages = [], fetchUrl = '/api/influencer2/:username/packages' }) => {
  const [packages, setPackages] = useState<Package[]>(initialPackages);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If parent gave packages, don't fetch. Otherwise try to fetch from API.
    if (initialPackages && initialPackages.length > 0) return;
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(fetchUrl);
        if (!res.ok) return;
        const data = await res.json();
        // Expect data.packages or data
        const pkgs = data.packages ?? data;
        if (mounted && Array.isArray(pkgs)) setPackages(pkgs);
      } catch {
        // ignore - we keep the empty defaults
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [initialPackages, fetchUrl]);
  // Use first two packages for the two main cards, with sensible fallbacks

  const displayPackages = packages && packages.length > 0 ? packages : [];
  const pkg1: Package | null = displayPackages[0] ?? null;
  const pkg2: Package | null = displayPackages[1] ?? null;

  const formatPrice = (p: string | number) => {
    const num = typeof p === 'string' ? Number(p) : p;
    if (Number.isNaN(num)) return `₹${p}`;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div>
      {loading && <div className="mb-4 text-sm text-gray-500">Loading packages…</div>}
      <div className="w-full h-full flex flex-col gap-6">
        <div className="flex flex-row gap-6">
          {/* Listed Package 1 */}
          <div className="flex-1 min-w-[320px] max-w-[420px] bg-white rounded-2xl shadow p-6 flex flex-row gap-4 items-start">
            <img src={pkg1?.thumbnailUrl ?? '/placeholder1.jpg'} alt={pkg1?.title ?? 'Package'} className="h-20 w-20 rounded-lg object-cover" />
            <div className="flex-1">
              <div className="text-lg font-semibold mb-1 text-gray-900">{pkg1?.title ?? '—'}</div>
              <div className="text-sm text-gray-600 mb-2">{pkg1?.description ?? ''}</div>
              <div className="text-sm text-gray-500 mb-2">{pkg1?.mediaType ?? (pkg1?.deliverables ? pkg1.deliverables!.join(', ') : '')}</div>
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-[#7b52d3]">{formatPrice(pkg1?.price ?? '')}</div>
                <div className="text-xs text-gray-500">{pkg1?.deliveryTimeDays ? `${pkg1.deliveryTimeDays} days` : '—'}</div>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="px-3 py-1 rounded-md bg-gray-100 text-sm">Edit</button>
                <button className="px-3 py-1 rounded-md bg-gray-100 text-sm">Duplicate</button>
                <button className="px-3 py-1 rounded-md bg-gray-100 text-sm">Hide</button>
              </div>
            </div>
          </div>
          {/* Listed Package 2 */}
          <div className="flex-1 min-w-[320px] max-w-[420px] bg-white rounded-2xl shadow p-6 flex flex-row gap-4 items-start">
            <img src={pkg2?.thumbnailUrl ?? '/placeholder2.jpg'} alt={pkg2?.title ?? 'Package'} className="h-20 w-20 rounded-lg object-cover" />
            <div className="flex-1">
              <div className="text-lg font-semibold mb-1 text-gray-900">{pkg2?.title ?? '—'}</div>
              <div className="text-sm text-gray-600 mb-2">{pkg2?.description ?? ''}</div>
              <div className="text-sm text-gray-500 mb-2">{pkg2?.mediaType ?? (pkg2?.deliverables ? pkg2.deliverables!.join(', ') : '')}</div>
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-[#7b52d3]">{formatPrice(pkg2?.price ?? '')}</div>
                <div className="text-xs text-gray-500">{pkg2?.deliveryTimeDays ? `${pkg2.deliveryTimeDays} days` : '—'}</div>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="px-3 py-1 rounded-md bg-gray-100 text-sm">Edit</button>
                <button className="px-3 py-1 rounded-md bg-gray-100 text-sm">Duplicate</button>
                <button className="px-3 py-1 rounded-md bg-gray-100 text-sm">Hide</button>
              </div>
            </div>
          </div>
          {/* Request a custom package button */}
          <div className="flex flex-col justify-start items-center min-w-[180px]">
            <button className="w-full px-4 py-3 bg-transparent border-2 border-[#7b52d3] text-[#7b52d3] rounded-xl font-semibold shadow hover:bg-[#7b52d3] hover:text-white transition mb-2">request a custom package</button>
          </div>
        </div>
        {/* Lower grid: Most Requested Package and Availability Calendar */}
        <div className="flex flex-row gap-6 mt-2 w-full">
          {/* Most Requested Package and Rebooking Percentage */}
          <div className="flex-1 min-h-[180px] bg-[#232946] rounded-2xl shadow-lg p-6 flex flex-col justify-center items-center max-w-[420px]">
            <div className="text-lg font-semibold text-white mb-2 text-center">Most Requested Package</div>
            <div className="text-base text-[#7b52d3] font-bold mb-1">{pkg1?.title ?? '—'}</div>
            <div className="text-sm text-gray-300 mb-2">{pkg1?.description ?? ''}</div>
            <div className="text-xs text-gray-400 mb-2">Type: {pkg1?.mediaType ?? (pkg1?.deliverables ? pkg1.deliverables!.join(', ') : '—')}</div>
            <div className="text-xs text-gray-400 mb-2">Rebooking Rate: <span className="text-green-400 font-bold">82%</span></div>
          </div>
          {/* Availability Calendar */}
          <div className="flex-1 min-h-[180px] bg-[#232946] rounded-2xl shadow-lg p-6 flex flex-col justify-center items-center max-w-[520px]">
            <div className="text-lg font-semibold text-white mb-4 text-center">Availability Calendar</div>
            {/* Placeholder calendar grid */}
            <div className="grid grid-cols-7 gap-2 w-full max-w-xs">
              {[...Array(28)].map((_, i) => (
                <div key={i} className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold ${i % 5 === 0 ? 'bg-[#7b52d3] text-white' : 'bg-gray-800 text-gray-300'}`}>{i + 1}</div>
              ))}
            </div>
            <div className="mt-2 text-xs text-gray-400">(Purple = Booked)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListPackages;
