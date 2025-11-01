
'use client'

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

type Analytics = {
  followersCount?: number;
  engagementRate?: number;
  demographics?: {
    location?: string;
    niche?: string;
    gender?: {
      male: number;
      female: number;
      other: number;
    };
    age?: {
      '13-17': number;
      '18-24': number;
      '25-34': number;
      '35-44': number;
      '45plus': number;
    };
  };
  historicalData?: {
    followers: number[];
    engagement: number[];
    impressions: number[];
    dates: string[];
  };
  collaborations?: Array<{
    brand: string;
    roi: number;
  }>;
};

interface AnalyticsDashboardProps {
  analytics?: Analytics;
}

// Mock data - Replace with actual data from your DB when available
const mockData = {
  followersHistory: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    data: [1000, 1500, 2200, 3000],
  },
  engagementVsImpression: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    engagement: [4.2, 3.8, 5.1, 4.9, 5.3],
    impression: [8.1, 7.9, 8.4, 8.2, 8.8],
  },
  demographics: {
    gender: {
      labels: ['Male', 'Female', 'Other'],
      data: [45, 50, 5],
    },
    age: {
      labels: ['13-17', '18-24', '25-34', '35-44', '45+'],
      data: [10, 35, 30, 15, 10],
    },
  },
  topCollaborations: [
    { brand: 'Brand A', roi: '2.5x' },
    { brand: 'Brand B', roi: '2.1x' },
    { brand: 'Brand C', roi: '1.8x' },
  ],
};

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ analytics }) => {
  // Use analytics data when available, fall back to mock data when needed
  const data = {
    followers: analytics?.historicalData?.followers || mockData.followersHistory.data,
    dates: analytics?.historicalData?.dates || mockData.followersHistory.labels,
    engagement: analytics?.historicalData?.engagement || mockData.engagementVsImpression.engagement,
    impressions: analytics?.historicalData?.impressions || mockData.engagementVsImpression.impression,
    gender: analytics?.demographics?.gender || mockData.demographics.gender,
    age: analytics?.demographics?.age || mockData.demographics.age,
  };

  return (
    <div className="bg-[#232946] rounded-2xl shadow-lg p-8 flex flex-col gap-8 border border-[#7b52d3]">
      {/* Top Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Follower Growth Chart */}
        <div className="p-6 bg-white/5 backdrop-blur-lg rounded-xl">
          <h2 className="text-xl font-bold mb-4 text-[#7b52d3]">Follower Growth</h2>
          <Bar
            data={{
              labels: data.dates,
              datasets: [
                {
                  label: 'Weekly Followers',
                  data: data.followers,
                  backgroundColor: 'rgba(123, 82, 211, 0.6)',
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                title: { display: true, text: 'Weekly Follower Growth' },
              },
            }}
          />
        </div>

        {/* Engagement vs Impression Rate Chart */}
        <div className="p-6 bg-white/5 backdrop-blur-lg rounded-xl">
          <h2 className="text-xl font-bold mb-4 text-[#7b52d3]">Engagement vs Impression Rate</h2>
          <Line
            data={{
              labels: data.dates,
              datasets: [
                {
                  label: 'Engagement Rate',
                  data: data.engagement,
                  borderColor: 'rgba(123, 82, 211, 1)',
                  tension: 0.4,
                },
                {
                  label: 'Impression Rate',
                  data: data.impressions,
                  borderColor: 'rgba(255, 99, 132, 1)',
                  tension: 0.4,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                title: { display: true, text: 'Performance Metrics' },
              },
            }}
          />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-3 gap-6">
        {/* Top Reach & Impressions */}
        <div className="p-6 bg-white/5 backdrop-blur-lg rounded-xl">
          <h2 className="text-xl font-bold mb-4 text-[#7b52d3]">Performance Summary</h2>
          <div className="space-y-4 text-gray-300">
            <div>
              <h3 className="font-semibold">Top Reach</h3>
              <p className="text-2xl text-[#7b52d3]">125K</p>
            </div>
            <div>
              <h3 className="font-semibold">Top Impressions</h3>
              <p className="text-2xl text-[#7b52d3]">250K</p>
            </div>
            <div className="mt-4 p-4 bg-white/5 rounded-lg">
              <h3 className="font-semibold mb-2">AI Summary</h3>
              <p className="text-sm">
                Your content shows strong engagement with consistent growth in reach.
                Peak performance occurs during evening posts with lifestyle content
                generating highest engagement.
              </p>
            </div>
          </div>
        </div>

        {/* Audience Demographics */}
        <div className="p-6 bg-white/5 backdrop-blur-lg rounded-xl">
          <h2 className="text-xl font-bold mb-4 text-[#7b52d3]">Audience Demographics</h2>
          <div className="grid grid-rows-2 gap-4">
            <Pie
              data={{
                labels: mockData.demographics.gender.labels,
                datasets: [
                  {
                    data: mockData.demographics.gender.data,
                    backgroundColor: [
                      'rgba(123, 82, 211, 0.6)',
                      'rgba(255, 99, 132, 0.6)',
                      'rgba(75, 192, 192, 0.6)',
                    ],
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  title: { display: true, text: 'Gender Distribution' },
                },
              }}
            />
            <Pie
              data={{
                labels: mockData.demographics.age.labels,
                datasets: [
                  {
                    data: mockData.demographics.age.data,
                    backgroundColor: [
                      'rgba(255, 99, 132, 0.6)',
                      'rgba(123, 82, 211, 0.6)',
                      'rgba(255, 206, 86, 0.6)',
                      'rgba(75, 192, 192, 0.6)',
                      'rgba(153, 102, 255, 0.6)',
                    ],
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  title: { display: true, text: 'Age Distribution' },
                },
              }}
            />
          </div>
        </div>

        {/* Top Collaborations */}
        <div className="p-6 bg-white/5 backdrop-blur-lg rounded-xl">
          <h2 className="text-xl font-bold mb-4 text-[#7b52d3]">Top Collaborations ROI</h2>
          <div className="space-y-4">
            {mockData.topCollaborations.map((collab, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-white/5 rounded-lg text-gray-300"
              >
                <span className="font-medium">{collab.brand}</span>
                <span className="text-[#7b52d3]">{collab.roi}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
