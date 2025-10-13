
type Analytics = {
  followersCount?: number;
  engagementRate?: number;
  demographics?: {
    location?: string;
    niche?: string;
  };
  // Add more fields as needed
};

interface AnalyticsDashboardProps {
  analytics?: Analytics;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ analytics }) => (
  <div className="bg-[#232946] rounded-2xl shadow-lg p-8 flex flex-col gap-8 border border-[#7b52d3]">
    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-[#7b52d3]">
      <span role="img" aria-label="analytics">📊</span>Analytics Dashboard
    </h2>
    <div className="text-gray-300 mb-6 text-lg">
      {analytics ? (
        <>
          <div>Followers: <span className="text-[#7b52d3] font-bold">{analytics.followersCount ?? 'N/A'}</span></div>
          <div>Engagement Rate: <span className="text-[#7b52d3] font-bold">{analytics.engagementRate ?? 'N/A'}</span></div>
          <div>Location: <span className="text-[#7b52d3] font-bold">{analytics.demographics?.location ?? 'N/A'}</span></div>
          <div>Niche: <span className="text-[#7b52d3] font-bold">{analytics.demographics?.niche ?? 'N/A'}</span></div>
        </>
      ) : (
        <>No analytics data available.</>
      )}
    </div>
    {/* Additional analytics sections can be added here */}
  </div>
);

export default AnalyticsDashboard;
