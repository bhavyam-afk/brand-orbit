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
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ProfileData {
  name?: string;
  username?: string;
  bio?: string;
  avatarUrl?: string;
  followersCount?: number;
  title?: string;
  // Add other profile data fields as needed
}

interface ProfileProps {
  data: ProfileData;
}

const Profile2: React.FC<ProfileProps> = ({ data }) => {
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
    <div className="bag w-[full] h-[full]">
      <div className="w-[85vw] mx-auto ">

        <h1 className="text-3xl font-bold mb-5">Welcome in, {data.name} </h1>

        <div className="flex justify-between items-center">
          <div className="flex justify-between gap-8 mb-8">
            <div className="bg-[#F5EBDD] rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{(data.followersCount) / 1000}K+</p>
                  <p className="text-sm text-gray-600">Followers</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-[#F5EBDD] rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">44</p>
                  <p className="text-sm text-gray-600">Collabs</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-[#F5EBDD] rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">1M+</p>
                  <p className="text-sm text-gray-600">Reach</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="border bg-white shadow-lg rounded-xl p-6 mb-8">
          <div className="connected">Connected Platforms :
            <a href="https://www.instagram.com">Insta</a>
            <a href="https://www.tiktok.com">Tik-Tok</a>
            <a href="https://www.youtube.com">Yt</a>
          </div>
        </div> */}
        </div>

        <div className="flex gap-4">

          <div className="w-[25vw] rounded-3xl overflow-hidden relative">
            {/* Main Photo */}
            <img
              src={'/default.png'}
              // src={data.avatarUrl || '/default.png'}
              alt={data.name || 'Profile'}
              className="w-full h-full object-cover"
            />

            {/* Name Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-black/20">
              <h1 className="text-4xl font-bold text-white">{data.name}</h1>
              <p className="text-xl text-white/90">{data.title || 'CREATOR'}</p>
            </div>
          </div>

          <div className="media-type bg-white rounded-xl p-8 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Media Distribution</h3>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col items-center">
              {/* Circular Progress */}
              <div className="relative w-48 h-48 mb-8">
                <div className="absolute inset-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Post - Mint Circle (50%) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#E0F2F1"
                      strokeWidth="10"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#4DB6AC"
                      strokeWidth="10"
                      strokeDasharray="282.7"
                      strokeDashoffset="141.35"
                      className="transition-all duration-1000 ease-out"
                    />
                    {/* Reel - Light Green Circle (30%) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="35"
                      fill="none"
                      stroke="#F0F4E3"
                      strokeWidth="10"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="35"
                      fill="none"
                      stroke="#9CCC65"
                      strokeWidth="10"
                      strokeDasharray="219.9"
                      strokeDashoffset="153.93"
                      className="transition-all duration-1000 ease-out"
                    />
                    {/* Story - Pink Circle (20%) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="25"
                      fill="none"
                      stroke="#FCE4EC"
                      strokeWidth="10"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="25"
                      fill="none"
                      stroke="#F48FB1"
                      strokeWidth="10"
                      strokeDasharray="157.1"
                      strokeDashoffset="125.68"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-3xl font-bold">500</span>
                      <p className="text-sm text-gray-600">POSTS</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-3 gap-8 w-full">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#4DB6AC]"></div>
                    <span className="text-sm text-gray-600">Post</span>
                  </div>
                  <p className="font-semibold">50%</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#9CCC65]"></div>
                    <span className="text-sm text-gray-600">Reel</span>
                  </div>
                  <p className="font-semibold">30%</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#F48FB1]"></div>
                    <span className="text-sm text-gray-600">Story</span>
                  </div>
                  <p className="font-semibold">20%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Followers Growth (last 5 months) - Bar Graph */}
          <div className="bg-[#F5EBDD] rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center w-72 h-72">
            <div className="font-semibold mb-2 text-lg text-black ">followers growth<br />last 5 months</div>
            <div className="text-black w-full h-48 flex items-center justify-center">
              <Bar data={followersData} options={followersOptions} />
            </div>
          </div>

          {/* Total Earnings (last 5 months) - Bar Graph */}
          <div className="bg-[#F5EBDD] rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center w-72 h-72">
            <div className="font-semibold mb-2 text-lg text-black ">total earnings<br />last 5 months</div>
            <div className="w-full h-48 flex items-center justify-center">
              <Bar data={earningsData} options={earningsOptions} />
            </div>
          </div>

        </div>

        {/* Collaborations Section */}
        <div className="bg-[#F5EBDD] rounded-2xl p-8 mt-3 mb-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Top Collaborations</h2>
              <p className="text-gray-600 max-w-lg">Collaborate with high-impact brands and maximize your reach through strategic partnerships. Our platform helps you find the perfect match for your content style.</p>
            </div>
            <div className="flex gap-4">
              <button className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {collaborations.map((collab, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col items-center">
                  <img
                    src={collab.thumbnail}
                    alt={collab.brand}
                    className="w-24 h-24 rounded-full object-cover mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-1">{collab.brand}</h3>
                  <p className="text-gray-600 mb-2">{collab.campaign}</p>
                  <p className="text-sm text-gray-500">{collab.date}</p>
                  <button className="mt-4 rounded-full p-2 hover:bg-gray-100">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Profile2 
