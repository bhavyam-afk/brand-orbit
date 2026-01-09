"use client";

import React, { useEffect, useState } from "react";

type Creator = {
  id: string;
  username: string;
  profilePicUrl?: string | null;
  category?: string | null;
  niche?: string | null;
  nicheTags?: string[];
  location?: string | null;
};

const BrandFeed: React.FC = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [creatorPackages, setCreatorPackages] = useState<any[]>([]);
  const [pkgsLoading, setPkgsLoading] = useState(false);
  const [requestingPackageId, setRequestingPackageId] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [requestedPackageIds, setRequestedPackageIds] = useState<string[]>([]);
  const [activePackageIds, setActivePackageIds] = useState<string[]>([]);

  useEffect(() => {
    // derive username from path: /brand/[username]/dashboard
    let username: string | undefined;
    if (typeof window !== "undefined") {
      const parts = window.location.pathname.split("/").filter(Boolean);
      const brandIndex = parts.indexOf("brand");
      if (brandIndex !== -1 && parts.length > brandIndex + 1) {
        username = parts[brandIndex + 1];
      } else if (parts.length >= 2) {
        username = parts[1];
      }
    }

    if (!username) {
      setError("No brand username found in URL");
      setLoading(false);
      return;
    }

    const url = `/api/brand2/${encodeURIComponent(username)}/feed`;
    setLoading(true);

    fetch(url)
      .then(async (res) => {
        const ct = String(res.headers.get("content-type") || "");
        if (!res.ok) {
          if (ct.includes("application/json")) {
            const d = await res.json().catch(() => ({}));
            throw new Error(d?.error || res.statusText || "Failed to fetch");
          }
          const text = await res.text().catch(() => "");
          throw new Error(`Server returned non-JSON: ${String(text).slice(0,200)}`);
        }
        if (!ct.includes("application/json")) {
          const text = await res.text().catch(() => "");
          throw new Error(`Server returned non-JSON: ${String(text).slice(0,200)}`);
        }
        return res.json();
      })
      .then((data) => {
        const arr = Array.isArray(data?.creators) ? data.creators : [];
        setCreators(arr);
        setError(null);
      })
      .catch((err) => {
        console.error("Brand feed error", err);
        setError(String(err?.message || err));
        setCreators([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-gray-300">Loading creators…</div>;
  if (error) return <div className="p-6 text-red-400">Error: {error}</div>;

  const openPackages = async (creator: Creator) => {
    setSelectedCreator(creator);
    setModalOpen(true);
    setPkgsLoading(true);
    try {
      const username = encodeURIComponent(creator.username);
      const res = await fetch(`/api/influencer/${username}/packages`);
      if (!res.ok) {
        setCreatorPackages([]);
      } else {
        const data = await res.json().catch(() => ({}));
        const list = data.packages ?? data ?? [];
        setCreatorPackages(Array.isArray(list) ? list : []);
      }
      // Fetch existing pending collaborations for this brand -> mark requested packages
      try {
        const brandUsername = getBrandUsername();
        if (brandUsername) {
          const collRes = await fetch(`/api/brand2/${encodeURIComponent(brandUsername)}/collaborations`);
          if (collRes.ok) {
            const collData = await collRes.json().catch(() => ({}));
            const collList = Array.isArray(collData) ? collData : Array.isArray(collData?.collaborations) ? collData.collaborations : [];
            // Separate DRAFT (requested) and ACTIVE (accepted) collaborations for this creator
            const draftIds: string[] = [];
            const activeIds: string[] = [];
            collList.forEach((c: any) => {
              const cUsername = c?.creator?.username ?? c?.creatorUsername ?? c?.creator?.user?.username ?? '';
              if (cUsername !== creator.username) return;
              const pkgCollabs = Array.isArray(c?.packageCollaborations) ? c.packageCollaborations : [];
              pkgCollabs.forEach((pc: any) => {
                const pkgId = String(c?.packageId ?? c?.package?.id ?? '');
                if (!pkgId) return;
                if (pc.status === 'DRAFT') {
                  draftIds.push(pkgId);
                } else if (pc.status === 'ACTIVE') {
                  activeIds.push(pkgId);
                }
              });
            });
            setRequestedPackageIds(draftIds);
            setActivePackageIds(activeIds);
          }
        }
      } catch (err) {
        console.warn('Could not fetch brand collaborations', err);
      }
    } catch (err) {
      console.error('Failed to load packages', err);
      setCreatorPackages([]);
    } finally {
      setPkgsLoading(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCreator(null);
    setCreatorPackages([]);
    setRequestedPackageIds([]);
    setActivePackageIds([]);
  };

  const getBrandUsername = (): string | null => {
    if (typeof window === 'undefined') return null;
    const parts = window.location.pathname.split('/').filter(Boolean);
    const brandIndex = parts.indexOf('brand');
    if (brandIndex !== -1 && parts.length > brandIndex + 1) return parts[brandIndex + 1];
    if (parts.length >= 2) return parts[1];
    return null;
  };

  const requestPackage = async (pkg: any) => {
    setRequestError(null);
    setRequestedPackageIds([]);
    const creator = selectedCreator;
    if (!creator) {
      setRequestError('No creator selected');
      return;
    }
    const brandUsername = getBrandUsername();
    if (!brandUsername) {
      setRequestError('Brand username not found in URL');
      return;
    }
    setRequestingPackageId(pkg.id ?? pkg.title ?? '');
    try {
      const res = await fetch(`/api/brand2/${encodeURIComponent(brandUsername)}/request-package`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creatorUsername: creator.username, packageId: pkg.id }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || res.statusText || 'Request failed');
      }
      const data = await res.json().catch(() => ({}));
      // determine package id returned from collaboration (or fallback to pkg.id)
      const collab = data?.collaboration ?? data?.collaboration ?? data;
      const returnedPkgId = String(collab?.package?.id ?? collab?.packageId ?? pkg.id ?? pkg.title ?? '');
      setRequestedPackageIds((prev) => {
        if (!returnedPkgId) return prev;
        if (prev.includes(returnedPkgId)) return prev;
        return [...prev, returnedPkgId];
      });
    } catch (err) {
      console.error('Request package failed', err);
      setRequestError(String((err as any)?.message || err));
    } finally {
      setRequestingPackageId(null);
    }
  };

  return (
    <>
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }} onClick={closeModal} />
          <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 'min(900px,96%)', maxHeight: '85vh', overflowY: 'auto', zIndex: 70 }}>
            <div className="bg-[#0b1220] rounded-2xl p-6 shadow-lg border border-yellow-200">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xl font-bold text-yellow-300">Packages — @{selectedCreator?.username}</div>
                  <div className="text-sm text-gray-300 mt-1">{selectedCreator?.category ?? selectedCreator?.niche ?? ''}</div>
                </div>
                <div>
                  <button onClick={closeModal} className="px-3 py-1 bg-gray-700 rounded text-white">Close</button>
                </div>
              </div>

              <div className="mt-4">
                {pkgsLoading && <div className="text-gray-300">Loading packages…</div>}
                {!pkgsLoading && creatorPackages.length === 0 && <div className="text-gray-400">No packages available</div>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                  {creatorPackages.map((p: any) => (
                    <div key={p.id ?? p.title} className="bg-white/5 rounded-lg p-4">
                      <div className="font-semibold text-white">{p.title}</div>
                      <div className="text-sm text-gray-300">{p.description ?? ''}</div>
                      <div className="mt-2 text-[#7b52d3] font-bold">{p.price ? (typeof p.price === 'string' ? p.price : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(p.price))) : '—'}</div>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {activePackageIds.includes(String(p.id ?? p.title)) && <span className="text-blue-400 text-sm">Active ✓</span>}
                          {requestedPackageIds.includes(String(p.id ?? p.title)) && !activePackageIds.includes(String(p.id ?? p.title)) && <span className="text-green-400 text-sm">Requested ✓</span>}
                          {requestError && requestError.length > 0 && <span className="text-red-400 text-sm">{requestError}</span>}
                        </div>
                        <div>
                          <button
                            onClick={() => requestPackage(p)}
                            disabled={requestingPackageId === (p.id ?? p.title) || requestedPackageIds.includes(String(p.id ?? p.title)) || activePackageIds.includes(String(p.id ?? p.title))}
                            className="px-3 py-1 rounded bg-yellow-300 text-black text-sm"
                          >
                            {requestingPackageId === (p.id ?? p.title) ? 'Requesting…' : activePackageIds.includes(String(p.id ?? p.title)) ? 'Active' : requestedPackageIds.includes(String(p.id ?? p.title)) ? 'Requested' : 'Request Package'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={modalOpen ? 'pointer-events-none' : ''}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {creators.map((c) => (
            <div key={c.id} className="bg-white/5 rounded-lg p-4 shadow border border-yellow-200">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700 border-2 border-yellow-300">
                  {c.profilePicUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.profilePicUrl} alt={c.username} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-yellow-300">🙂</div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-yellow-300">@{c.username}</div>
                  <div className="text-sm text-gray-300">{c.category ?? c.niche ?? 'Creator'}</div>
                  {c.location && <div className="text-xs text-gray-400">{c.location}</div>}
                </div>
              </div>
              {c.nicheTags && c.nicheTags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {c.nicheTags.map((t) => (
                    <span key={t} className="text-xs bg-yellow-300/10 text-yellow-300 px-2 py-1 rounded-full">{t}</span>
                  ))}
                </div>
              )}
              <div className="mt-3 flex justify-end">
                <button onClick={() => openPackages(c)} className="px-3 py-1 rounded bg-[#7b52d3] text-white text-sm">See Packages</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BrandFeed;
