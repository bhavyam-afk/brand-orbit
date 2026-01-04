"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ProfileData {
  username: string;
  bio: string | null;
  location: string | null;
  niche: string | null;
  profilePicUrl: string | null;
  introClipUrl: string | null;
  nicheTags: string[];
  portfolio: any | null;
  category: string;
  platformLinks: any | null;
  email: string;
}

interface ProfileProps {
  initialData?: ProfileData;
}

const Profile: React.FC<ProfileProps> = ({ initialData }) => {
  const [data, setData] = React.useState<ProfileData | null>(initialData || null);
  const [loading, setLoading] = React.useState(!initialData);
  const [earningsMonths, setEarningsMonths] = React.useState<string[]>([]);
  const [earningsTotals, setEarningsTotals] = React.useState<number[]>([]);
  const [collaborations, setCollaborations] = React.useState<any[]>([]);
  const [followersMonths, setFollowersMonths] = React.useState<string[]>([]);
  const [followersTotals, setFollowersTotals] = React.useState<number[]>([]);

  React.useEffect(() => {
    const username = window.location.pathname.split("/")[2];
    if (!username) return;

    // 1️⃣ Fetch profile ONLY if initialData not provided
    if (!initialData) {
      fetch(`/api/influencer2/${username}/profile`)
        .then(res => res.json())
        .then(setData)
        .catch(err => console.error("profile fetch failed", err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    // 2️⃣ ALWAYS fetch earnings
    fetch(`/api/influencer2/${username}/earnings`)
      .then(res => res.json())
      .then(earnJson => {
        const months = Array.isArray(earnJson.months) ? earnJson.months : [];
        const totals = Array.isArray(earnJson.totals) ? earnJson.totals.map((n: any) => Number(n) || 0) : [];
        setEarningsMonths(months);
        setEarningsTotals(totals);
      })
      .catch(err => console.error("earnings fetch failed", err));

    // 3️⃣ fetch last 3 collaborations (campaigns endpoint returns collaborations array)
    fetch(`/api/influencer2/${username}/campaigns`)
      .then(res => res.json())
      .then((json) => {
        const arr = Array.isArray(json?.campaigns) ? json.campaigns : json?.campaigns ?? [];
        // take last 3 if available
        const last3 = arr.slice(-3).reverse();
        setCollaborations(last3);
      })
      .catch(err => console.error("collabs fetch failed", err));

    // 4️⃣ fetch followers history (last 5 months)
    fetch(`/api/influencer2/${username}/followers`)
      .then(res => res.json())
      .then(fjson => {
        const months = Array.isArray(fjson.months) ? fjson.months : [];
        const totals = Array.isArray(fjson.totals) ? fjson.totals.map((n: any) => Number(n) || 0) : [];
        setFollowersMonths(months);
        setFollowersTotals(totals);
      })
      .catch(err => console.error("followers fetch failed", err));
  }, [initialData]);

  if (loading) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  if (!data) {
    return <div className="text-center py-8">No profile data available</div>;
  }

  // collaborations state is fetched from the API; default empty while loading

  // Chart data and options (memoized so Chart updates reliably)
  const earningsData = {
    labels: earningsMonths,
    datasets: [
      {
        label: "Earnings (₹)",
        data: earningsTotals,
        backgroundColor: "rgba(34,211,238,0.9)",
        borderColor: "#0891b2",
        borderWidth: 1,
        borderRadius: 8,
        barThickness: 18,
        barPercentage: 0.7,
        categoryPercentage: 0.7,
      },
    ],
  };

  const followersData = {
    labels: followersMonths,
    datasets: [
      {
        label: "Followers",
        data: followersTotals,
        backgroundColor: "rgba(99,102,241,0.9)",
        borderColor: "#7c3aed",
        borderWidth: 1,
        borderRadius: 6,
        barThickness: 16,
      },
    ],
  }

  const followersOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#fff" } },
      y: { beginAtZero: true, grid: { color: "#334155" }, ticks: { color: "#fff" } },
    },
  };

  const earningsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#fff" },
      },
      y: {
        beginAtZero: true,

        suggestedMax: Math.max(...earningsTotals, 1000),

        grid: { color: "#334155" },
        ticks: ({
          color: "#fff",
          callback: function (value: any) {
            const n = Number(value);
            if (isNaN(n)) return String(value);
            if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'k';
            return String(n);
          },
        } as unknown) as any,
      },
    },
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <div className="flex flex-row gap-8 w-full max-w-6xl">
        {/* Profile Card */}
        <div className="flex-1 min-w-[320px] max-w-[400px] bg-cyan-500 rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center h-[520px] mr-4">
          <div className="w-28 h-28 rounded-full mb-6 overflow-hidden border-4 border-white shadow">
            {data.profilePicUrl && <img src={data.profilePicUrl} alt="Profile" className="w-full h-full object-cover" />}
          </div>
          <div className="text-2xl font-bold mb-2">@{data.username}</div>
          <div className="text-base text-black mb-1">Category: {data.category}</div>
          {data.niche && <div className="text-base text-black mb-1">Niche: {data.niche}</div>}
          {data.location && <div className="text-base text-black mb-1">Location: {data.location}</div>}
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {data.nicheTags.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-white/20 rounded-full text-xs text-black">
                {tag}
              </span>
            ))}
          </div>
          {data.bio && <div className="text-sm text-black mt-4 text-center">{data.bio}</div>}
          {data.platformLinks && (
            <div className="mt-4 flex gap-2">
              {Array.isArray(data.platformLinks)
                ? data.platformLinks.map((entry: any, i: number) => {
                    const name = entry.platform || entry.name || `link${i + 1}`;
                    const url = entry.url || entry.href || "";
                    const label = typeof name === "string" ? name.charAt(0).toUpperCase() + name.slice(1) : String(name);
                    return (
                      <a
                        key={`${name}-${i}`}
                        href={String(url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                      >
                        {label}
                      </a>
                    );
                  })
                : Object.entries(data.platformLinks).map(([platformName, url]) => (
                    <a
                      key={platformName}
                      href={String(url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                    >
                      {platformName}
                    </a>
                  ))}
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col gap-6 min-w-[340px]">
          {/* Past 3 Collaborations */}
          <div className="bg-cyan-500 rounded-2xl shadow-lg p-6 min-h-[120px] flex flex-col justify-center">
            <div className="font-semibold mb-4 text-lg">past 3 collaborations</div>
            <div className="flex flex-row gap-4 justify-between">
              {collaborations.length === 0 && (
                <div className="text-sm text-gray-300">No collaborations yet</div>
              )}
              {collaborations.map((c, i) => (
                <div
                  key={c.id}
                  className="bg-white/80 rounded-xl flex flex-col items-center p-3 w-32 shadow-md"
                >
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-full overflow-hidden mb-2 border-2 border-cyan-400">
                    {c.brand?.logoUrl || c.package?.thumbnailUrl ? (
                      <img
                        src={c.brand?.logoUrl || c.package?.thumbnailUrl}
                        alt="brand"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>

                  {/* Brand name */}
                  <div className="font-bold text-cyan-700 text-sm mb-1 text-center">
                    @{c.brand?.username}
                  </div>

                  {/* Campaign / Package */}
                  <div className="text-xs text-gray-800 mb-1 text-center">
                    {c.campaign?.name || c.package?.title}
                  </div>

                  {/* Date */}
                  <div className="text-xs text-gray-500 text-center">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}

            </div>
          </div>

          {/* Bar Graphs Row */}
          <div className="flex flex-row gap-6">

            {/* Total Earnings (last 5 months) - Bar Graph */}
            <div className="bg-gray-900 rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center w-72 h-72">
              <div className="font-semibold mb-2 text-lg text-gray-200">total earnings<br />last 5 months</div>
              <div className="w-full h-48">
                <Bar
                  key={`${earningsMonths.join("-")}-${earningsTotals.join("-")}`}
                  data={earningsData}
                  options={earningsOptions}
                />
              </div>
            </div>

            {/* Followers Growth (last 5 months) - Bar Graph */}
            <div className="bg-gray-900 rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center w-72 h-72">
              <div className="font-semibold mb-2 text-lg text-gray-200">followers growth<br />last 5 months</div>
              <div className="w-full h-48 flex items-center justify-center">
                <Bar data={followersData} options={followersOptions} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;



