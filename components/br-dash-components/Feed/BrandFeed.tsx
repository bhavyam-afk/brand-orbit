// components/brand/Feed/BrandFeed.tsx

"use client";

import { useBrandFeed } from "./useBrandFeed";
import PackagesModal from "./PackagesModal";

export default function BrandFeed() {
  const {
    creators,
    loading,
    error,
    modalOpen,
    selectedCreator,
    openPackages,
    closeModal,
    ...modalProps
  } = useBrandFeed();

  if (loading) return <div className="p-6 text-gray-300">Loading creators…</div>;
  if (error) return <div className="p-6 text-red-400">Error: {error}</div>;

  return (
    <>
      {modalOpen && selectedCreator && (
        <PackagesModal
          creator={selectedCreator}
          onClose={closeModal}
          {...modalProps}
        />
      )}

      <div className={modalOpen ? "pointer-events-none" : ""}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {creators.map((c) => (
            <div key={c.id} className="bg-white/5 rounded-lg p-4 shadow border border-yellow-200">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700 border-2 border-yellow-300">
                  {c.profilePicUrl ? (
                    <img src={c.profilePicUrl} alt={c.username} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-yellow-300">🙂</div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="font-semibold text-yellow-300">@{c.username}</div>
                  <div className="text-sm text-gray-300">{c.category ?? c.niche ?? "Creator"}</div>
                  {c.location && <div className="text-xs text-gray-400">{c.location}</div>}
                </div>
              </div>

              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => openPackages(c)}
                  className="px-3 py-1 rounded bg-[#7b52d3] text-white text-sm"
                >
                  See Packages
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
