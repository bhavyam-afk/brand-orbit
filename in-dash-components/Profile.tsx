"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ProfileData {
  username: string;
  bio: string | null;
  location: string | null;
  niche: string | null;
  profilePicUrl: string | null;
  nicheTags: string[];
  category: string;
  platformLinks: any | null;
  transactions?: any[];
  collaborations?: any[];
}

const Profile: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<ProfileData | null>(null);
  const [earningsMonths, setEarningsMonths] = React.useState<string[]>([]);
  const [earningsTotals, setEarningsTotals] = React.useState<number[]>([]);
  const [collaborations, setCollaborations] = React.useState<any[]>([]);
  const [followersTotals, setFollowersTotals] = React.useState<number[]>([]);

  React.useEffect(() => {
    const username = window.location.pathname.split("/")[2];
    if (!username) return;

    async function fetchcalls() {
      const res = await fetch(`/api/influencer/${username}/profile`);
      const profileData = await res.json();
      setData(profileData);

      // Get last 4 completed collaborations.
      const pos_status = profileData.collaborations.filter((c: any) => c.status === "COMPLETED");
      const last4 = (pos_status).slice(-4).reverse();
      setCollaborations(last4);

      // lastest 5 months
      const months: string[] = [];
      for (let i = 4; i >= 0; i--) {
        const d = new Date();
        d.setDate(1);
        d.setMonth(d.getMonth() - i);
        const shortMonth = d.toLocaleString('default', { month: 'short' });
        months.push(shortMonth);
      }
      setEarningsMonths(months);

      // sum of each month's completed payouts
      const transactions = Array.isArray(profileData.transactions) ? profileData.transactions : [];
      const totals = months.map((m) => {
        return transactions.reduce((acc: number, t: any) => {
          // prefer updatedAt, then createdAt
          const dateStr = t.updatedAt || t.createdAt;
          if (!dateStr) return acc;
          const tMonth = new Date(dateStr).toLocaleString('default', { month: 'short' });

          // Only sum completed payout transactions
          if (t.type === 'PAYOUT' && t.status === 'COMPLETED' && tMonth === m) {
            const amt = Number(t.amount) || 0;
            return acc + amt;
          }
          return acc;
        }, 0);
      });
      setEarningsTotals(totals);


      const daly_snapshot = await fetch(`/api/influencer/${username}/followers`);
      const fjson = await daly_snapshot.json();
      const snapshots = fjson.snapshots;
      const ftotals: number[] = months.map((m) =>
        snapshots.reduce((acc: number, s: any) => {
          const sMonth = s?.recordedAt ? new Date(s.recordedAt).toLocaleString("default", { month: "short" }) : null;
          if (sMonth === m) return acc + (Number(s.followers_increased) || 0);
          return acc;
        }, 0)
      );
      setFollowersTotals(ftotals);

      setLoading(false);
    }

    fetchcalls();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  if (!data) {
    return <div className="text-center py-8">No profile data available</div>;
  }

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
    labels: earningsMonths,
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
  };
  const earningsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#fff" } },
      y: {
        beginAtZero: true, grid: { color: "#334155" }, ticks: ({
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
              {Array.isArray(data.platformLinks) ? data.platformLinks.map((entry: any, i: number) => {
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

        <div className="flex-1 flex flex-col gap-6">
          {/* Past 4 Collaborations */}
          <div className="bg-cyan-500 rounded-2xl shadow-lg p-4 flex flex-col items-center">
            <div className="font-semibold mb-2 text-lg">Last {collaborations.length} Collaborations</div>
            <div className="flex flex-row gap-4">
              {collaborations.length === 0 && (
                <div className="text-sm text-gray-300">No Collaborations yet</div>
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
                    @{c.brandName}
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
              <div className="font-semibold mb-2 text-lg text-gray-200">Earning Trends</div>
              <div className="w-full h-48">
                <Bar key={`${earningsMonths.join("-")}-${earningsTotals.join("-")}`}
                  data={earningsData}
                  options={earningsOptions}
                />
              </div>
            </div>

            {/* Followers Growth (last 5 months) - Bar Graph */}
            <div className="bg-gray-900 rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center w-72 h-72">
              <div className="font-semibold mb-2 text-lg text-gray-200">Growth Trends</div>
              <div className="w-full h-48 flex items-center justify-center">
                <Bar data={followersData} options={earningsOptions} />
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;



