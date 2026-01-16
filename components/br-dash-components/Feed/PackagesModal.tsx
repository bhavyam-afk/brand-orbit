"use client";

import React from "react";
import { Creator, CreatorPackage, DraftInfo } from "./types";
import DraftViewerModal from "./DraftViewerModal";

interface PackagesModalProps {
  creator: Creator;
  onClose: () => void;

  creatorPackages: CreatorPackage[];
  pkgsLoading: boolean;

  requestingPackageId: string | null;
  requestedPackageIds: string[];
  activePackageIds: string[];
  draftedPackageIds: string[];
  draftedFilesMap: Record<string, DraftInfo>;

  requestError: string | null;

  requestPackage: (pkg: CreatorPackage) => Promise<void>;

  selectedDraft: DraftInfo | null;
  setSelectedDraft: (d: DraftInfo | null) => void;
}

export default function PackagesModal({
  creator,
  onClose,
  creatorPackages,
  pkgsLoading,
  requestingPackageId,
  requestedPackageIds,
  activePackageIds,
  draftedPackageIds,
  draftedFilesMap,
  requestError,
  requestPackage,
  selectedDraft,
  setSelectedDraft,
}: PackagesModalProps) {
  return (
    <>
      <div className="fixed inset-0 z-[60]">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-md"
          onClick={onClose}
        />

        <div className="absolute left-1/2 top-1/2 w-[min(900px,96%)] max-h-[85vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto z-[70]">
          <div className="bg-[#0b1220] rounded-2xl p-6 shadow-lg border border-yellow-200">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xl font-bold text-yellow-300">
                  Packages — @{creator.username}
                </div>
                <div className="text-sm text-gray-300 mt-1">
                  {creator.category ?? creator.niche ?? ""}
                </div>
              </div>

              <button
                onClick={onClose}
                className="px-3 py-1 bg-gray-700 rounded text-white"
              >
                Close
              </button>
            </div>

            {/* Body */}
            <div className="mt-4">
              {pkgsLoading && (
                <div className="text-gray-300">Loading packages…</div>
              )}

              {!pkgsLoading && creatorPackages.length === 0 && (
                <div className="text-gray-400">No packages available</div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                {creatorPackages.map((p) => {
                  const pid = p.id;

                  const isDrafted = draftedPackageIds.includes(pid);
                  const isActive = activePackageIds.includes(pid);
                  const isRequested = requestedPackageIds.includes(pid);

                  return (
                    <div key={pid} className="bg-white/5 rounded-lg p-4">
                      <div className="font-semibold text-white">
                        {p.title}
                      </div>

                      {p.description && (
                        <div className="text-sm text-gray-300">
                          {p.description}
                        </div>
                      )}

                      <div className="mt-2 text-[#7b52d3] font-bold">
                        {p.price
                          ? typeof p.price === "string"
                            ? p.price
                            : new Intl.NumberFormat("en-IN", {
                                style: "currency",
                                currency: "INR",
                              }).format(Number(p.price))
                          : "—"}
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-2">
                        {/* Status */}
                        <div className="flex items-center gap-2 text-sm">
                          {isDrafted && (
                            <>
                              <span className="text-yellow-300">
                                Draft uploaded
                              </span>

                              {draftedFilesMap[pid]?.fileUrls?.length > 0 && (
                                <button
                                  onClick={() =>
                                    setSelectedDraft(draftedFilesMap[pid])
                                  }
                                  className="px-2 py-1 border border-yellow-300 text-yellow-300 rounded text-xs"
                                >
                                  View Draft
                                </button>
                              )}
                            </>
                          )}

                          {!isDrafted && isActive && (
                            <span className="text-blue-400">Active ✓</span>
                          )}

                          {!isDrafted && !isActive && isRequested && (
                            <span className="text-green-400">
                              Requested ✓
                            </span>
                          )}

                          {requestError && (
                            <span className="text-red-400">
                              {requestError}
                            </span>
                          )}
                        </div>

                        {/* Action */}
                        <button
                          onClick={() => requestPackage(p)}
                          disabled={
                            requestingPackageId === pid ||
                            isRequested ||
                            isActive ||
                            isDrafted
                          }
                          className="px-3 py-1 rounded bg-yellow-300 text-black text-sm disabled:opacity-60"
                        >
                          {requestingPackageId === pid
                            ? "Requesting…"
                            : isDrafted
                            ? "Draft uploaded"
                            : isActive
                            ? "Active"
                            : isRequested
                            ? "Requested"
                            : "Request Package"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedDraft && (
        <DraftViewerModal
          draft={selectedDraft}
          onClose={() => setSelectedDraft(null)}
        />
      )}
    </>
  );
}
