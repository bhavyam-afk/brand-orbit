import { Package } from "@/types/Package";
import { formatPrice } from "./package.utils";

export default function PackageCard({ pkg, actionLabel, onAction }: { pkg: Package; actionLabel: string; onAction: () => void; }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 w-[420px]">
      {pkg.thumbnailUrl ? (
        <img src={pkg.thumbnailUrl} alt={pkg.title} className="w-full h-40 object-cover rounded-md mb-3" />
      ) : (
        <div className="w-full h-40 bg-gray-100 rounded-md mb-3 flex items-center justify-center text-sm text-gray-400">No image</div>
      )}

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{pkg.title}</h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2" style={{ maxHeight: 40, overflow: 'hidden' }}>{pkg.description}</p>
          {pkg.mediaType && <div className="text-xs text-gray-500 mt-2">{pkg.mediaType}</div>}
          {pkg.deliverables && pkg.deliverables.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {pkg.deliverables.slice(0,3).map((d, i) => (
                <span key={i} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">{d}</span>
              ))}
            </div>
          )}
        </div>

        <div className="ml-4 text-right">
          <div className="text-lg font-bold text-[#7b52d3]">{formatPrice(pkg.price)}</div>
          <button onClick={onAction} className="mt-3 px-3 py-1 rounded bg-[#7b52d3] text-white text-sm">{actionLabel}</button>
        </div>
      </div>
    </div>
  );
}
