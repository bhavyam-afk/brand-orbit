
import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, BarChart, Bar, XAxis, YAxis } from 'recharts';

type Analytics = {
  followersCount?: number;
  engagementRate?: number;
  audienceGrowth?: number[];
  postFrequency?: number;
  contentTypeSplit?: { type: string; value: number }[];
  topPosts?: { thumbnail: string; likes: number; comments: number }[];
  demographics?: {
    location?: string;
    niche?: string;
  };
  contentQualityScore?: number;
  authenticityIndex?: number;
  audienceDemographicsPrediction?: string;
  audienceDemographicsChart?: { group: string; value: number }[];
  nicheStrengthScore?: number;
  brandMatchProbability?: number;
  campaignROIForecast?: number;
};

interface AnalyticsDashboardProps {
  analytics?: Analytics;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ analytics }) => {
  // Vibrant fake data for all metrics
  const dummy = {
    followersCount: 10000,
    engagementRate: 4.2,
    audienceGrowth: [10000, 12050, 13100, 15200, 10300, 10400, 20500, 22000 ,24599],
    postFrequency: 7,
    contentTypeSplit: [
      { type: 'Reels', value: 50 },
      { type: 'Posts', value: 30 },
      { type: 'Stories', value: 20 },
    ],
    topPosts: [
      { thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=60&h=60', likes: 1200, comments: 320 },
      { thumbnail: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=60&h=60', likes: 980, comments: 210 },
      { thumbnail: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=60&h=60', likes: 870, comments: 180 },
    ],
    demographics: { location: 'Mumbai', niche: 'Travel' },
    contentQualityScore: 93,
    authenticityIndex: 88,
    audienceDemographicsPrediction: '21-30, Male, Tier 1 Cities',
    audienceDemographicsChart: [
      { group: '18-24', value: 40 },
      { group: '25-34', value: 35 },
      { group: 'Male', value: 60 },
      { group: 'Female', value: 40 },
      { group: 'Tier 1', value: 50 },
      { group: 'Tier 2', value: 30 },
      { group: 'Tier 3', value: 20 },
    ],
    nicheStrengthScore: 85,
    brandMatchProbability: 82,
    campaignROIForecast: 74,
  };
  // Bar chart colors
  const barColors = ['#45aaf2', '#f7b731', '#20bf6b', '#ff6b6b', '#8854d0', '#fd9644', '#a55eea'];
  // Always use dummy data for charts if missing
  const data = {
    ...dummy,
    ...analytics,
    audienceGrowth: analytics?.audienceGrowth && analytics.audienceGrowth.length > 0 ? analytics.audienceGrowth : dummy.audienceGrowth,
    contentTypeSplit: analytics?.contentTypeSplit && analytics.contentTypeSplit.length > 0 ? analytics.contentTypeSplit : dummy.contentTypeSplit,
    topPosts: analytics?.topPosts && analytics.topPosts.length > 0 ? analytics.topPosts : dummy.topPosts,
    audienceDemographicsChart: analytics?.audienceDemographicsChart && analytics.audienceDemographicsChart.length > 0 ? analytics.audienceDemographicsChart : dummy.audienceDemographicsChart,
  };
  // Vibrant chart colors
  const pieColors = ['#ff6b6b', '#f7b731', '#45aaf2'];
  const radarColor = '#20bf6b';

  // Radar chart data
  const radarData = [
    { metric: 'Quality', value: data.contentQualityScore ?? 0 },
    { metric: 'Authenticity', value: data.authenticityIndex ?? 0 },
    { metric: 'Niche Strength', value: data.nicheStrengthScore ?? 0 },
    { metric: 'Brand Match', value: data.brandMatchProbability ?? 0 },
    { metric: 'ROI', value: data.campaignROIForecast ?? 0 },
  ];

  return (
  <div className="bg-gradient-to-br from-[#232946] to-[#3d1c5a] rounded-2xl shadow-2xl p-8 flex flex-col gap-8 border border-[#7b52d3]">
      <h2 className="text-3xl font-extrabold mb-6 flex items-center gap-3 text-[#ff6b6b]">
        <span role="img" aria-label="analytics">📊</span>Analytics Dashboard
      </h2>
      {/* Core Metrics */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="flex flex-col gap-4">
          <div className="text-xl text-[#f7b731] font-bold mb-2">Instagram Core Metrics</div>
          <div>Followers: <span className="text-[#ff6b6b] font-extrabold">{data.followersCount}</span></div>
          <div>Engagement Rate: <span className="text-[#45aaf2] font-extrabold">{data.engagementRate}%</span></div>
          <div>Post Frequency: <span className="text-[#f7b731] font-extrabold">{data.postFrequency} / week</span></div>
          <div>Location: <span className="text-[#45aaf2] font-bold">{data.demographics?.location ?? 'N/A'}</span></div>
          <div>Niche: <span className="text-[#20bf6b] font-bold">{data.demographics?.niche ?? 'N/A'}</span></div>
          {/* Audience Growth Trend (Sparkline) */}
          <div className="mt-4 bg-[#1e1e2f] rounded-xl p-3 shadow-lg">
            <div className="text-sm text-gray-200 mb-1">Audience Growth Trend</div>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={data.audienceGrowth.map((v, i) => ({ day: i + 1, value: v }))} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <Line type="monotone" dataKey="value" stroke="#f7b731" strokeWidth={3} dot={{ stroke: '#ff6b6b', strokeWidth: 2 }} />
                <Tooltip wrapperStyle={{ backgroundColor: '#232946', color: '#fff', borderRadius: 8 }} labelStyle={{ color: '#fff' }} itemStyle={{ color: '#f7b731' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {/* Content Type Split (Pie Chart) */}
          <div className="mt-4 bg-[#1e1e2f] rounded-xl p-3 shadow-lg">
            <div className="text-sm text-gray-200 mb-1">Content Type Split</div>
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie data={data.contentTypeSplit} dataKey="value" nameKey="type" cx="50%" cy="50%" outerRadius={40} label={({ name }) => name} labelLine={false}>
                  {data.contentTypeSplit.map((entry: { type: string; value: number }, idx: number) => (
                    <Cell key={`cell-${idx}`} fill={pieColors[idx % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip wrapperStyle={{ backgroundColor: '#232946', color: '#fff', borderRadius: 8 }} labelStyle={{ color: '#fff' }} itemStyle={{ color: '#ff6b6b' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Top Posts Thumbnails */}
          <div className="mt-4">
            <div className="text-sm text-gray-400 mb-1">Top Posts</div>
            <div className="flex gap-4">
              {(data.topPosts ?? []).map((post, idx) => (
                <div key={idx} className="flex flex-col items-center bg-[#1e272e] rounded-xl p-2 shadow-lg">
                  <img src={post.thumbnail} alt={`Top Post ${idx + 1}`} className="rounded-lg shadow w-16 h-16 object-cover border-2 border-[#f7b731]" />
                  <span className="text-xs text-[#ff6b6b] font-bold mt-1">{post.likes} ❤</span>
                  <span className="text-xs text-[#45aaf2]">{post.comments} 💬</span>
                </div>
              ))}
            </div>
          </div>
        </div>
  {/* Smart AI Analytics */}
        <div className="flex flex-col gap-4">
          <div className="text-xl text-[#20bf6b] font-bold mb-2">Smart AI Analytics</div>
          <div>Content Quality Score: <span className="text-[#ff6b6b] font-extrabold">{data.contentQualityScore}</span></div>
          <div>Authenticity Index: <span className="text-[#f7b731] font-extrabold">{data.authenticityIndex}</span></div>
          <div>Audience Demographics Prediction: <span className="text-[#45aaf2] font-bold">{data.audienceDemographicsPrediction}</span></div>
          {/* Demographics Bar Chart */}
          <div className="mt-4">
            <div className="text-sm text-gray-400 mb-1">Demographics Split</div>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={data.audienceDemographicsChart ?? []}>
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {(data.audienceDemographicsChart ?? []).map((entry: { group: string; value: number }, idx: number) => (
                    <Cell key={`cell-bar-${idx}`} fill={barColors[idx % barColors.length]} />
                  ))}
                </Bar>
                <XAxis dataKey="group" stroke="#fff" fontSize={12} />
                <YAxis stroke="#fff" fontSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>Niche Strength Score: <span className="text-[#20bf6b] font-extrabold">{data.nicheStrengthScore}</span></div>
          <div>Brand Match Probability: <span className="text-[#20bf6b] font-extrabold">{data.brandMatchProbability}%</span></div>
          <div>Campaign ROI Forecast: <span className="text-[#f7b731] font-extrabold">{data.campaignROIForecast}%</span></div>
          {/* Influencer Health Card (Radar Chart) */}
          <div className="mt-4">
            <div className="text-sm text-gray-400 mb-1">Influencer Health Card</div>
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart cx="50%" cy="50%" outerRadius={90} data={radarData}>
                <PolarGrid stroke="#45aaf2" />
                <PolarAngleAxis dataKey="metric" stroke="#f7b731" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#ff6b6b" />
                <Radar name="Scores" dataKey="value" stroke={radarColor} fill={radarColor} fillOpacity={0.5} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
