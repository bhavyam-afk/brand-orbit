// components/brand/Profile/BrandProfile.tsx

"use client";

import React from "react";
import { useBrandProfile } from "./useBrandProfile";

export default function BrandProfile() {
  const { profile, collaborations, loading, error } = useBrandProfile();

  return (
    <div className="bg-[#232946] rounded-2xl shadow-lg p-8 flex flex-col gap-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-yellow-300">
        🧭 Brand Profile & Organization Setup
      </h2>

      {loading && <div className="text-gray-300">Loading brand profile…</div>}
      {error && <div className="text-red-400">Error: {error}</div>}

      {!loading && !error && profile && (
        <div className="flex flex-row gap-6 items-start">
          {/* Profile Card */}
          <div className="min-w-[280px] max-w-[420px] bg-[#0b1220] rounded-2xl p-6 shadow">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-yellow-300 bg-gray-800">
                {profile.logoUrl ? (
                  <img
                    src={profile.logoUrl}
                    alt="logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-yellow-300">
                    🏷️
                  </div>
                )}
              </div>

              <div>
                <div className="text-2xl font-bold text-yellow-300">
                  {profile.username}
                </div>
                <div className="text-sm text-gray-300">{profile.bio}</div>
                <div className="mt-2 text-xs text-gray-400">
                  {(profile.industryTags || []).join(" • ")}
                </div>
              </div>
            </div>
          </div>

          {/* Collaborations */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="bg-[#0b1220] rounded-2xl p-4 shadow border border-yellow-200">
              <div className="font-semibold text-yellow-300 mb-3">
                Last {collaborations.length} collaboration(s)
              </div>

              <div className="flex gap-3">
                {collaborations.length === 0 && (
                  <div className="text-gray-400">No collaborations yet</div>
                )}

                {collaborations.filter((a) => a.collabstatus === 'COMPLETED').map((c) => (
                  <div key={c.id} className="bg-[#111827] rounded-lg p-3 w-40 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden mb-2 bg-gray-700">
                      {c.package?.thumbnailUrl ? (
                        <img src={c.package.thumbnailUrl} alt="pkg" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          🎬
                        </div>
                      )}
                    </div>

                    <div className="font-semibold text-sm text-yellow-300">
                      {c.package?.title ?? "—"} 
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification & Tags — unchanged UI */}
          </div>
        </div>
      )}
    </div>
  );
}
