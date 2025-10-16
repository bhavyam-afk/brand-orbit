import React from "react";

type Package = {
  id: string;
  title: string;
  description?: string;
  price: number;
  inclusions?: string[];
  performancePrediction?: string; // AI Model API
  brandFitScore?: string; // AI Model API
  smartRecommendation?: string; // AI Model API
  deliveryTime?: number;
  platform?: string;
  mediaType?: string;
};

interface ListPackagesProps {
  packages?: Package[];
}

const ListPackages: React.FC<ListPackagesProps> = ({ packages }) => {
  const mockPackages: Package[] = [
    {
      id: "1",
      title: "Instagram Story + Post",
      description: "1 story and 1 feed post",
      price: 250,
      inclusions: ["Instagram Story", "Instagram Post"],
      performancePrediction: "Estimated 2.5k views, 200+ likes",
      brandFitScore: "Fashion Brands — 92% Fit",
      smartRecommendation: "Best for Fashion Brands — 92% Fit",
      platform: "Instagram",
    },
    {
      id: "2",
      title: "Reel Promotion",
      description: "One short-form video",
      price: 500,
      inclusions: ["Instagram Reel"],
      performancePrediction: "Estimated 4k views, 350+ likes",
      brandFitScore: "Lifestyle Brands — 88% Fit",
      smartRecommendation: "Best for Lifestyle Brands — 88% Fit",
      platform: "Instagram",
    },
  ];
  const displayPackages = packages && packages.length > 0 ? packages : mockPackages;
  return (
    <div className="bg-[#232946] rounded-2xl shadow-lg p-8 flex flex-col gap-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><span>🎁</span>Service Listings</h2>
      <ul className="ml-4 space-y-6">
        {displayPackages.map(pkg => (
          <li key={pkg.id} className="bg-[#181c2f] rounded-xl p-4 shadow flex flex-col gap-3 border border-[#7b52d3]/20">
            <div className="flex items-center gap-2">
              <span>📄</span>
              <span className="font-semibold text-[#7b52d3] text-lg">{pkg.title}</span>
              {pkg.platform && <span className="text-xs text-gray-400">({pkg.platform})</span>}
              <span className="ml-auto text-[#7b52d3] font-bold text-lg">₹{pkg.price}</span>
            </div>
            {pkg.description && <div className="text-gray-300">{pkg.description}</div>}
            {pkg.inclusions && pkg.inclusions.length > 0 && (
              <div className="text-sm text-gray-400"><span className="font-semibold text-[#7b52d3]">Inclusions:</span> {pkg.inclusions.join(", ")}</div>
            )}
            {/* AI Model Section - always show for mock data */}
            <div className="flex flex-wrap gap-3 mt-2">
              <div className="flex items-center gap-2 bg-blue-900/40 border border-blue-400 rounded-lg px-3 py-1 text-blue-200 text-sm font-medium">
                <span role="img" aria-label="performance">📈</span>
                <span>Performance Prediction:</span>
                <span className="font-bold">{pkg.performancePrediction}</span>
              </div>
              <div className="flex items-center gap-2 bg-green-900/40 border border-green-400 rounded-lg px-3 py-1 text-green-200 text-sm font-medium">
                <span role="img" aria-label="brand-fit">🏷️</span>
                <span>Brand Fit Score:</span>
                <span className="font-bold">{pkg.brandFitScore}</span>
              </div>
              <div className="flex items-center gap-2 bg-yellow-900/40 border border-yellow-400 rounded-lg px-3 py-1 text-yellow-200 text-sm font-medium">
                <span role="img" aria-label="recommendation">💡</span>
                <span>Smart Recommendation:</span>
                <span className="font-bold italic">{pkg.smartRecommendation}</span>
              </div>
            </div>
            {/* TODO: Replace mock AI fields with real API/model data */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListPackages;
