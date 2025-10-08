import React from "react";

const AnalyticsDashboard = () => (
  <div className="bg-[#232946] rounded-2xl shadow-lg p-8 flex flex-col gap-8 border border-[#7b52d3]">
    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-[#7b52d3]">
      <span role="img" aria-label="analytics">📊</span>Analytics Dashboard
    </h2>
    <div className="text-gray-300 mb-6 text-lg">
      Pull analytics data from connected platforms using APIs.
    </div>
    {/* Growth Graphs */}
    <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-[#7b52d3] mb-4">
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-[#7b52d3]">
        <span role="img" aria-label="growth">📈</span>Growth Graphs
      </h3>
      <ul className="text-gray-300 text-sm space-y-1">
        <li>Followers over time</li>
        <li className="text-[#7b52d3]">[API: GET /api/influencer/analytics/growth]</li>
      </ul>
    </div>
    {/* Engagement Metrics */}
    <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-[#7b52d3] mb-4">
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-red-400">
        <span role="img" aria-label="engagement">❤️</span>Engagement Metrics
      </h3>
      <ul className="text-gray-300 text-sm space-y-1">
        <li>Likes, comments, shares, engagement rate</li>
        <li className="text-[#7b52d3]">[API: GET /api/influencer/analytics/engagement]</li>
      </ul>
    </div>
    {/* Audience Demographics */}
    <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-[#7b52d3] mb-4">
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-blue-400">
        <span role="img" aria-label="audience">👥</span>Audience Demographics
      </h3>
      <ul className="text-gray-300 text-sm space-y-1">
        <li>Age, gender, location</li>
        <li className="text-[#7b52d3]">[API: GET /api/influencer/analytics/demographics]</li>
      </ul>
    </div>
    {/* Best Time to Post */}
    <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-[#7b52d3] mb-4">
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-gray-300">
        <span role="img" aria-label="clock">🕒</span>Best Time to Post
      </h3>
      <ul className="text-gray-300 text-sm space-y-1">
        <li>Recommended posting times based on audience activity</li>
        <li className="text-[#7b52d3]">[API: GET /api/influencer/analytics/best-time]</li>
      </ul>
    </div>
    {/* Top-Performing Content */}
    <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-[#7b52d3] mb-4">
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-green-400">
        <span role="img" aria-label="top-content">💬</span>Top-Performing Content
      </h3>
      <ul className="text-gray-300 text-sm space-y-1">
        <li>Posts, videos, or stories with highest engagement</li>
        <li className="text-[#7b52d3]">[API: GET /api/influencer/analytics/top-content]</li>
      </ul>
    </div>
    {/* Powered by APIs */}
    <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-green-400">
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-green-400">
        <span role="img" aria-label="check">✅</span>Can be powered by:
      </h3>
      <ul className="text-gray-300 text-sm space-y-1">
        <li>Instagram Graph API</li>
        <li>YouTube Data API</li>
        <li>TikTok Business API (optional later)</li>
      </ul>
    </div>
  </div>
);

export default AnalyticsDashboard;
