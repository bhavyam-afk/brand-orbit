import React from "react";

type Package = {
  id: string;
  title: string;
  description?: string;
  price: number;
  deliveryTime?: number;
  platform?: string;
  mediaType?: string;
};

interface ListPackagesProps {
  packages?: Package[];
}

const ListPackages: React.FC<ListPackagesProps> = ({ packages = [] }) => (
  <div className="bg-[#232946] rounded-2xl shadow-lg p-8 flex flex-col gap-8">
    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><span>🎁</span>Service Listings</h2>
    <ul className="ml-4 space-y-2">
      {packages.length > 0 ? (
        packages.map(pkg => (
          <li key={pkg.id} className="flex items-center gap-2">
            <span>📄</span>
            <span className="font-semibold text-[#7b52d3]">{pkg.title}</span>
            {pkg.platform && <span className="text-xs text-gray-400">({pkg.platform})</span>}
            <span className="text-gray-300">{pkg.description}</span>
            <span className="ml-auto text-[#7b52d3] font-bold">₹{pkg.price}</span>
          </li>
        ))
      ) : (
        <li className="text-gray-400">No packages available.</li>
      )}
    </ul>
    {/* Additional sections can be added here if needed */}
  </div>
);

export default ListPackages;
