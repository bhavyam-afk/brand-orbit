import { Package } from "@/types/Package";

export default function DraftPackages({ packages, canActivate, onActivate, onDelete }: { packages: Package[]; canActivate: () => boolean; onActivate: (id: string) => void; onDelete: (id: string) => void }) {
  const drafts = packages.filter((p) => p.status === "DRAFT");

  return (
    <div className="w-full max-w-sm">
      <h3 className="font-semibold mb-3 text-lg">Draft Packages</h3>

      {drafts.length === 0 && (
        <div className="p-4 bg-white rounded shadow text-sm text-gray-500">No drafts</div>
      )}

      <div className="flex flex-col gap-3">
        {drafts.map((pkg) => (
          <div key={pkg.id} className="bg-white p-3 rounded-2xl shadow flex items-start gap-3">
            <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
              {pkg.thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={pkg.thumbnailUrl} alt={pkg.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No image</div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-medium text-gray-900">{pkg.title}</div>
                  <div className="text-xs text-gray-500 mt-1 line-clamp-2" style={{ maxHeight: 36, overflow: 'hidden' }}>{pkg.description}</div>
                </div>
                <div className="text-right text-xs text-gray-500">{pkg.deliveryTimeDays ? `${pkg.deliveryTimeDays}d` : '—'}</div>
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="flex gap-2">
                  {pkg.mediaType && <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">{pkg.mediaType}</span>}
                  {pkg.deliverables && pkg.deliverables.slice(0,2).map((d, i) => (
                    <span key={i} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">{d}</span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (!canActivate()) {
                        alert('There are already 2 active packages');
                        return;
                      }
                      onActivate(pkg.id);
                    }}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${canActivate() ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                    aria-disabled={!canActivate()}
                  >
                    Activate
                  </button>

                  <button
                    onClick={() => {
                      if (!confirm('Delete this draft?')) return;
                      onDelete(pkg.id);
                    }}
                    className="px-3 py-1 rounded-md text-sm font-medium bg-red-50 text-red-600 border border-red-100 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
