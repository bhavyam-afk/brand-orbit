"use client" ;

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
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ProfileData {
  id: string;
  userId: string;
  username: string;
  name: string;
  bio?: string;
  niche?: string;
  followersCount?: number;
  profilePic?: string;
  avatarUrl?: string;
  location?: string;
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
  // Add more fields as needed
}

interface ProfileProps {
  data: ProfileData;
}

const Profile: React.FC<ProfileProps> = ({ data }) => {
  // Mock data for past 3 collaborations, earnings, and followers growth (replace with real API data)
  const collaborations = [
    {
      brand: "TechX",
      campaign: "TechX Launch",
      date: "2025-09-10",
      thumbnail: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=96&h=96&q=80"
    },
    {
      brand: "GlowUp",
      campaign: "GlowUp Summer",
      date: "2025-08-15",
      thumbnail: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=96&h=96&q=80"
    },
    {
      brand: "FitLife",
      campaign: "FitLife Challenge",
      date: "2025-07-20",
      thumbnail: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=96&h=96&q=80"
    },
  ];
  const totalEarnings = [1200, 1500, 1100, 1800, 2000];
  const followersGrowth = [11000, 11200, 11500, 11800, 12000];
  const months = ["Jun", "Jul", "Aug", "Sept", "Oct"];

  // Chart data and options
  const earningsData = {
    labels: months,
    datasets: [
      {
        label: "Earnings (₹)",
        data: totalEarnings,
        backgroundColor: "rgba(34,211,238,0.7)",
        borderColor: "#0891b2",
        borderWidth: 2,
        borderRadius: 12,
        barPercentage: 0.7,
        categoryPercentage: 0.7,
      },
    ],
  };
  const earningsOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#fff" },
      },
      y: {
        grid: { color: "#334155" },
        ticks: { color: "#fff" },
        beginAtZero: true,
      },
    },
    elements: {
      bar: {
        borderRadius: 12,
      },
    },
  };
  const followersData = {
    labels: months,
    datasets: [
      {
        label: "Followers",
        data: followersGrowth,
        backgroundColor: "rgba(251,191,36,0.7)",
        borderColor: "#fbbf24",
        borderWidth: 2,
        borderRadius: 12,
        barPercentage: 0.7,
        categoryPercentage: 0.7,
      },
    ],
  };
  const followersOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#fff" },
      },
      y: {
        grid: { color: "#334155" },
        ticks: { color: "#fff" },
        beginAtZero: true,
      },
    },
    elements: {
      bar: {
        borderRadius: 12,
      },
    },
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <div className="flex flex-row gap-8 w-full max-w-6xl">
        {/* Profile Card */}
        <div className="flex-1 min-w-[320px] max-w-[400px] bg-cyan-500 rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center h-[520px] mr-4">
          <div className="w-28 h-28 rounded-full mb-6 overflow-hidden border-4 border-white shadow">
            {data.profilePic && <img src={data.profilePic} alt="Profile" className="w-full h-full object-cover" />}
          </div>
          <div className="text-2xl font-bold mb-2">{data.name}</div>
          <div className="text-base text-black mb-1">{data.followersCount} followers</div>
          <div className="text-base text-black mb-1">niche - {data.niche}</div>
          <div className="text-base text-black mb-1">{data.location}</div>
          <div className="text-base text-black mb-1">Rating: {data.rating}</div>
          <div className="text-sm text-black mt-4 text-center">{data.bio}</div>
        </div>

        <div className="flex-1 flex flex-col gap-6 min-w-[340px]">
          {/* Past 3 Collaborations */}
          <div className="bg-cyan-500 rounded-2xl shadow-lg p-6 min-h-[120px] flex flex-col justify-center">
            <div className="font-semibold mb-4 text-lg">past 3 collaborations</div>
            <div className="flex flex-row gap-4 justify-between">
              {collaborations.map((c, i) => (
                <div key={i} className="bg-white/80 rounded-xl flex flex-col items-center p-3 w-32 shadow-md">
                  <div className="w-14 h-14 rounded-full overflow-hidden mb-2 border-2 border-cyan-400">
                    <img src={c.thumbnail} alt={c.brand + ' thumbnail'} className="w-full h-full object-cover" />
                  </div>
                  <div className="font-bold text-cyan-700 text-sm mb-1 text-center">{c.brand}</div>
                  <div className="text-xs text-gray-800 mb-1 text-center">{c.campaign}</div>
                  <div className="text-xs text-gray-500 text-center">{c.date}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bar Graphs Row */}
          <div className="flex flex-row gap-6">
            {/* Total Earnings (last 5 months) - Bar Graph */}
            <div className="bg-gray-900 rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center w-72 h-72">
              <div className="font-semibold mb-2 text-lg text-gray-200">total earnings<br />last 5 months</div>
              <div className="w-full h-48 flex items-center justify-center">
                <Bar data={earningsData} options={earningsOptions} />
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



