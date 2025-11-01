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


const ListPackages: React.FC<ListPackagesProps> = ({ packages = [] }) => {
  // Use first two packages for the two main cards
  const [pkg1, pkg2] = packages.length >= 2 ? packages : [
    {
      id: '1',
      title: 'Listed Package 1',
      description: 'Instagram Story + Post',
      price: 5000,
      deliveryTime: 3,
      platform: 'Instagram',
      mediaType: 'Story/Post',
    },
    {
      id: '2',
      title: 'Listed Package 2',
      description: 'YouTube Shoutout',
      price: 8000,
      deliveryTime: 5,
      platform: 'YouTube',
      mediaType: 'Video',
    }
  ];

  return (
    <div className="w-full h-full flex flex-col gap-6">
      <div className="flex flex-row gap-6">
        {/* Listed Package 1 */}
        <div className="flex-1 min-w-[220px] max-w-[320px] aspect-square bg-[#232946] rounded-2xl shadow-lg p-6 flex flex-col justify-center items-center">
          <div className="text-xl font-semibold mb-2 text-white">{pkg1.title}</div>
          <div className="text-base text-gray-300 mb-2">{pkg1.description}</div>
          <div className="text-sm text-gray-400 mb-1">{pkg1.platform} • {pkg1.mediaType}</div>
          <div className="text-lg font-bold text-[#7b52d3] mb-2">₹{pkg1.price}</div>
          <div className="text-xs text-gray-400">Delivery: {pkg1.deliveryTime} days</div>
        </div>
        {/* Listed Package 2 */}
        <div className="flex-1 min-w-[220px] max-w-[320px] aspect-square bg-[#232946] rounded-2xl shadow-lg p-6 flex flex-col justify-center items-center">
          <div className="text-xl font-semibold mb-2 text-white">{pkg2.title}</div>
          <div className="text-base text-gray-300 mb-2">{pkg2.description}</div>
          <div className="text-sm text-gray-400 mb-1">{pkg2.platform} • {pkg2.mediaType}</div>
          <div className="text-lg font-bold text-[#7b52d3] mb-2">₹{pkg2.price}</div>
          <div className="text-xs text-gray-400">Delivery: {pkg2.deliveryTime} days</div>
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
          <div className="text-base text-[#7b52d3] font-bold mb-1">{pkg1.title}</div>
          <div className="text-sm text-gray-300 mb-2">{pkg1.description}</div>
          <div className="text-xs text-gray-400 mb-2">Platform: {pkg1.platform}</div>
          <div className="text-xs text-gray-400 mb-2">Rebooking Rate: <span className="text-green-400 font-bold">82%</span></div>
        </div>
        {/* Availability Calendar */}
        <div className="flex-1 min-h-[180px] bg-[#232946] rounded-2xl shadow-lg p-6 flex flex-col justify-center items-center max-w-[520px]">
          <div className="text-lg font-semibold text-white mb-4 text-center">Availability Calendar</div>
          {/* Placeholder calendar grid */}
          <div className="grid grid-cols-7 gap-2 w-full max-w-xs">
            {[...Array(28)].map((_, i) => (
              <div key={i} className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold ${i % 5 === 0 ? 'bg-[#7b52d3] text-white' : 'bg-gray-800 text-gray-300'}`}>{i+1}</div>
            ))}
          </div>
          <div className="mt-2 text-xs text-gray-400">(Purple = Booked)</div>
        </div>
      </div>
    </div>
  );
};

export default ListPackages;
