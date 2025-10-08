import React from "react";

const AnalyticsSection = () => (
  <div className="bg-[#232946] rounded-2xl shadow-lg p-8 flex flex-col gap-8 border border-green-400">
    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-green-400">
      <span role="img" aria-label="analytics">📊</span>Analytics & Performance Insights
    </h2>
    <div className="text-gray-300 mb-6 text-lg">
      <span className="font-bold text-white">Purpose:</span> Measure the real impact of influencer campaigns.
    </div>
    {/* Campaign Analytics */}
    <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-green-300 mb-4">
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-green-300">
        <span role="img" aria-label="chart">📈</span>Campaign Analytics
      </h3>
      <ul className="text-gray-300 text-sm space-y-1">
        <li>Impressions, reach, engagement rate, click-through rate</li>
        <li className="text-green-300">[API: GET /api/brand/analytics/campaigns]</li>
      </ul>
    </div>
    {/* ROI Tracking */}
    <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-green-300 mb-4">
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-yellow-300">
        <span role="img" aria-label="roi">💰</span>ROI Tracking
      </h3>
      <ul className="text-gray-300 text-sm space-y-1">
        <li>Cost vs engagement metrics, cost per reach, conversions</li>
        <li className="text-green-300">[API: GET /api/brand/analytics/roi]</li>
      </ul>
    </div>
    {/* AI Insights */}
    <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-green-300 mb-4">
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-pink-300">
        <span role="img" aria-label="ai">🧠</span>AI Insights
      </h3>
      <ul className="text-gray-300 text-sm space-y-1">
        <li>“This influencer performed 32% better than average in your last 3 campaigns.”</li>
        <li className="text-green-300">[API: GET /api/brand/analytics/ai-insights]</li>
      </ul>
    </div>
    {/* Reports Export */}
    <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-green-300 mb-4">
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-orange-300">
        <span role="img" aria-label="report">📋</span>Reports Export
      </h3>
      <ul className="text-gray-300 text-sm space-y-1">
        <li>Download CSV, PDF, or share dashboards with team</li>
        <li className="text-green-300">[API: POST /api/brand/analytics/export]</li>
      </ul>
    </div>
    {/* Cross-Platform Analytics */}
    <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-green-300">
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-blue-300">
        <span role="img" aria-label="cross-platform">🔗</span>Cross-Platform Analytics
      </h3>
      <ul className="text-gray-300 text-sm space-y-1">
        <li>Combine metrics from multiple social platforms (IG + YouTube)</li>
        <li className="text-green-300">[API: GET /api/brand/analytics/cross-platform]</li>
      </ul>
    </div>
  </div>
);

export default AnalyticsSection;
