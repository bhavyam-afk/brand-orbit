type ProfileData = {
  id: string;
  userId: string;
  username: string;
  name: string;
  bio?: string;
  niche?: string;
  followersCount?: number;
  platformLinks?: Record<string, string>;
  profilePic?: string;
  avatarUrl?: string;
  location?: string;
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
  packages?: any[];
  offers?: any[];
  payments?: any[];
  categories?: string;
  platforms?: Record<string, string>;
  // Optionals for future
  engagementRate?: number;
  verified?: boolean;
  portfolio?: { brand: string; description: string }[];
};

interface ProfileProps {
  data: ProfileData;
}

const Profile: React.FC<ProfileProps> = ({ data }) => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-[#232946] to-[#2d325a] rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-[#7b52d3]/40">
      {/* Sidebar Avatar & Basic Info */}
      <div className="bg-[#181c2f] flex flex-col items-center justify-center p-10 md:w-1/3 w-full min-h-[350px] border-r border-[#7b52d3]/30">
        <img
          src={data.avatarUrl || "/profile-placeholder.png"}
          alt="Profile"
          className="w-36 h-36 rounded-full border-4 border-[#7b52d3] object-cover shadow-lg mb-4"
        />
        <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight flex items-center gap-2">
          {data.name}
          {typeof data.rating === 'number' && (
            <span className="ml-2 text-yellow-400 text-lg" title="Rating">
              ★ {data.rating}
            </span>
          )}
        </h2>
        {data.categories && (
          <span className="bg-[#7b52d3]/20 text-[#7b52d3] px-3 py-1 rounded-full text-xs font-semibold mb-2">
            {data.categories}
          </span>
        )}
        {data.niche && !data.categories && (
          <span className="bg-[#7b52d3]/20 text-[#7b52d3] px-3 py-1 rounded-full text-xs font-semibold mb-2">
            {data.niche}
          </span>
        )}
        {data.location && (
          <span className="text-gray-400 text-sm mb-2 flex items-center gap-1">
            <svg width="16" height="16" fill="currentColor" className="inline"><circle cx="8" cy="8" r="8" fill="#7b52d3"/><circle cx="8" cy="8" r="4" fill="#fff"/></svg>
            {data.location}
          </span>
        )}
        {data.verified && (
          <span className="inline-flex items-center gap-1 text-green-400 text-xs font-bold bg-green-900/30 px-2 py-0.5 rounded-full mt-1">
            <svg width="14" height="14" fill="currentColor" className="inline"><circle cx="7" cy="7" r="7" fill="#22c55e"/><path d="M4 7l2 2 4-4" stroke="#fff" strokeWidth="2" fill="none"/></svg>
            Verified
          </span>
        )}
      </div>
      {/* Main Info & Stats */}
      <div className="flex-1 flex flex-col gap-8 p-10">
        {/* Bio & Followers */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-[#7b52d3] mb-1 flex items-center gap-2">
              <svg width="20" height="20" fill="currentColor" className="inline"><circle cx="10" cy="10" r="10" fill="#7b52d3"/><text x="10" y="15" textAnchor="middle" fontSize="12" fill="#fff">i</text></svg>
              Bio
            </h3>
            <p className="text-gray-200 text-base max-w-xl">
              {data.bio || <span className="text-gray-500">No bio provided.</span>}
            </p>
          </div>
          <div className="flex flex-row gap-6 items-center">
            {typeof data.followersCount === 'number' && (
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-[#7b52d3]">{data.followersCount.toLocaleString()}</span>
                <span className="text-xs text-gray-400">Followers</span>
              </div>
            )}
            {typeof data.engagementRate === 'number' && (
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-[#7b52d3]">{data.engagementRate}%</span>
                <span className="text-xs text-gray-400">Engagement</span>
              </div>
            )}
        {/* Extra Info: Show packages, offers, payments counts if available */}
        <div className="flex flex-row gap-6 items-center mt-4">
          {Array.isArray(data.packages) && (
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-[#7b52d3]">{data.packages.length}</span>
              <span className="text-xs text-gray-400">Packages</span>
            </div>
          )}
          {Array.isArray(data.offers) && (
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-[#7b52d3]">{data.offers.length}</span>
              <span className="text-xs text-gray-400">Offers</span>
            </div>
          )}
          {Array.isArray(data.payments) && (
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-[#7b52d3]">{data.payments.length}</span>
              <span className="text-xs text-gray-400">Payments</span>
            </div>
          )}
        </div>
          </div>
        </div>
        {/* Connected Platforms */}
        <div className="bg-[#232946] rounded-xl p-6 shadow border border-[#7b52d3]/30">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-[#7b52d3]">
            <svg width="20" height="20" fill="currentColor" className="inline"><circle cx="10" cy="10" r="10" fill="#7b52d3"/><text x="10" y="15" textAnchor="middle" fontSize="12" fill="#fff">🌐</text></svg>
            Connected Platforms
          </h3>
          <ul className="flex flex-wrap gap-4">
            {data.platforms && Object.entries(data.platforms).length > 0 ? (
              Object.entries(data.platforms).map(([platform, link], idx) => (
                <li key={platform + idx} className="flex items-center gap-2 bg-[#7b52d3]/10 px-3 py-1 rounded-full text-sm text-[#7b52d3] font-semibold">
                  <span className="capitalize">{platform}</span>
                  <a href={link} target="_blank" rel="noopener noreferrer" className="underline text-blue-400 hover:text-blue-200">Visit</a>
                </li>
              ))
            ) : (
              <li className="text-gray-400">No platforms linked</li>
            )}
          </ul>
        </div>
        {/* Portfolio Section (optional) */}
        {data.portfolio && data.portfolio.length > 0 && (
          <div className="bg-[#232946] rounded-xl p-6 shadow border border-[#7b52d3]/30">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-[#7b52d3]">
              <svg width="20" height="20" fill="currentColor" className="inline"><circle cx="10" cy="10" r="10" fill="#7b52d3"/><text x="10" y="15" textAnchor="middle" fontSize="12" fill="#fff">📁</text></svg>
              Portfolio
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.portfolio.map((item, idx) => (
                <div key={item.brand + idx} className="bg-[#181c2f] rounded-lg p-4 shadow flex flex-col gap-1 border border-[#7b52d3]/20">
                  <p className="font-semibold text-[#7b52d3]">{item.brand}</p>
                  <p className="text-gray-300 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;



