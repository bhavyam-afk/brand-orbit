"use client";

import { set } from "mongoose";
import React, { useEffect, useState } from "react";

type BrandProfile = {
  id: string;
  userId: string;
  username: string;
  logoUrl?: string | null;
  bio?: string | null;
  industryTags?: string[];
  socialLinks?: any;
  collaborations?: any[];
};

export default function Profile() {
  const [profile, setProfile] = useState<BrandProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [collaborations, setCollaborations] = useState<any[]>([]);

  useEffect(() => {
    // compute username on client to avoid SSR window access errors
    const getUsernameFromPath = (): string | null => {
      if (typeof window === 'undefined') return null;
      const parts = window.location.pathname.split('/').filter(Boolean);
      // prefer /brand/:username
      const brandIndex = parts.indexOf('brand');
      if (brandIndex !== -1 && parts.length > brandIndex + 1) return decodeURIComponent(parts[brandIndex + 1]);
      if (parts.length >= 2) return decodeURIComponent(parts[1]);
      return null;
    };

    const resolvedUsername = getUsernameFromPath();

    if (!resolvedUsername) {
      setLoading(false);
      setError('No username provided for brand profile');
      setProfile(null);
      setCollaborations([]);
      return;
    }

    setLoading(true);

    async function fetchProfile(){
      const res = await fetch(`/api/brand2/${resolvedUsername}/profile`);
      const data = await res.json();
      setProfile(data);
      setCollaborations(data?.collaborations || []);
      setLoading(false);
    };

    fetchProfile();
  }, []);

  return (
    <div className="bg-[#232946] rounded-2xl shadow-lg p-8 flex flex-col gap-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-yellow-300"><span>🧭</span>Brand Profile & Organization Setup</h2>

      {loading && <div className="text-gray-300">Loading brand profile…</div>}
      {error && <div className="text-red-400">Error: {error}</div>}

      {!loading && !error && (
        <div className="flex flex-row gap-6 items-start">
          {/* Profile Card */}
          <div className="min-w-[280px] max-w-[420px] bg-[#0b1220] rounded-2xl p-6 shadow">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-yellow-300 bg-gray-800">
                {profile?.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.logoUrl} alt="logo" className="w-full h-full object-cover" />) : (<div className="w-full h-full flex items-center justify-center text-yellow-300">🏷️</div>
                )}
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-300">{profile?.username ?? '—'}</div>
                <div className="text-sm text-gray-300">{profile?.bio ?? ''}</div>
                <div className="mt-2 text-xs text-gray-400">{(profile?.industryTags || []).join(' • ')}</div>
              </div>
            </div>

            <div className="mt-6 text-sm text-gray-300 space-y-2">
              <div>Website: <span className="text-yellow-300">{profile?.socialLinks?.find?.((s: any) => s.platform === 'website')?.url ?? '—'}</span></div>
              <div>Type: <span className="text-yellow-300">{(profile?.industryTags && profile.industryTags[0]) ?? '—'}</span></div>
              <div>Team: <span className="text-yellow-300">—</span></div>
            </div>
          </div>


          <div className="flex-1 flex flex-col gap-4">
            {/* Last 3 Collaborations */}
            <div className="bg-[#0b1220] rounded-2xl p-4 shadow border border-yellow-200">
              <div className="font-semibold text-yellow-300 mb-3">Last 3 collaborations</div>
              <div className="flex gap-3">
                {collaborations.length === 0 && <div className="text-gray-400">No collaborations yet</div>}
                {collaborations.map((c) => (
                  <div key={c.id} className="bg-[#111827] rounded-lg p-3 w-40 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden mb-2 bg-gray-700">
                      {c.package?.thumbnailUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.package.thumbnailUrl} alt="pkg" className="w-full h-full object-cover" />) : (<div className="w-full h-full flex items-center justify-center text-gray-300">🎬</div>
                      )}
                    </div>
                    <div className="font-semibold text-sm text-yellow-300">@{c.package?.title ?? c.creatorName ?? '—'}</div>
                    <div className="text-xs text-gray-500 mt-1">{new Date(c.createdAt).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reuse remaining sections: Verification and Tagging */}
            <div className="bg-[#0b1220] rounded-2xl p-4 shadow border border-yellow-200">
              <h3 className="font-bold text-yellow-300 mb-2">Verification System</h3>
              <div className="text-gray-300 text-sm">Business verification via domain/email — <span className="text-yellow-300">[Verify Now]</span></div>
            </div>

            <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-yellow-200 mb-4">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><span role="img" aria-label="verified">✅</span>Verification System</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>Business verification via domain/email</li>
                <li>Meta's verification API</li>
                <li><span className="text-yellow-300">[Verify Now Button]</span></li>
              </ul>
            </div>

            <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-yellow-200">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><span role="img" aria-label="tag">💼</span>Brand Type Tagging</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                {(profile?.industryTags && profile.industryTags.length > 0) ? profile.industryTags.map((t) => <li key={t}>{t}</li>) : <li><span className="text-yellow-300">[Select/Tag Brand Type]</span></li>
                }
              </ul>
            </div>

          </div>
        </div>
      )}
    </div>
  );
} 
