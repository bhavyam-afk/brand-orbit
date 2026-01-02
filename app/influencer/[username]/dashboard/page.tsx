"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Profile from "@/in-dash-components/Profile";
import ListPackages from "@/in-dash-components/ListPackages";
import AnalyticsDashboard from "@/in-dash-components/AnalyticsDashboard";
import Campaigns from "@/in-dash-components/Campaigns";
import Wallet from "@/in-dash-components/Wallet";
import Settings from "@/in-dash-components/Settings";

const sidebarOptions = [
  "Profile",
  "List Packages",
  "Analytics",
  "Campaigns",
  "Wallet",
  "Settings",
];

const InfluencerDashboard = () => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("Profile");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // State for each section
  const [profile, setProfile] = useState<any>(null);
  const [packages, setPackages] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get username from URL
  const username =
    typeof window !== "undefined" ? window.location.pathname.split("/")[2] : "";

  // Fetch data for active section
  useEffect(() => {
    if (!username) return;
    setLoading(true);
    setError(null);
    const fetchData = async () => {
      try {
        let res, data;
        switch (activeSection) {
          case "Profile":
            res = await fetch(`/api/influencer2/${username}/profile`);
            if (!res.ok) throw new Error("Failed to fetch profile");
            data = await res.json();
            setProfile(data);
            break;
          case "List Packages":
            res = await fetch(`/api/influencer2/${username}/packages`);
            if (!res.ok) throw new Error("Failed to fetch packages");
            data = await res.json();
            setPackages(data.packages || []);
            break;
          case "Analytics":
            res = await fetch(`/api/influencer2/${username}/analytics`);
            if (!res.ok) throw new Error("Failed to fetch analytics");
            data = await res.json();
            setAnalytics(data.analytics || null);
            break;
          case "Campaigns":
            res = await fetch(`/api/influencer2/${username}/campaigns`);
            if (!res.ok) throw new Error("Failed to fetch campaigns");
            data = await res.json();
            setCampaigns(data.campaigns || []);
            break;
          case "Settings":
            res = await fetch(`/api/influencer2/${username}/settings`);
            if (!res.ok) throw new Error("Failed to fetch settings");
            data = await res.json();
            // API returns the settings object directly
            setSettings(data || null);
            break;
          default:
            break;
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeSection, username]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Navigation Bar */}
      <div className="flex flex-col w-full">
        <div className="w-full px-6 py-4 bg-white border-b">
          <div className=" mx-auto flex items-center justify-between space-x-6 w-[80vw]">
            {/* Logo Section */}
            <div className="flex items-center gap-3">
              <img
                src="/BO.png"
                alt="Brand Orbit Logo"
                className="w-8 h-8 rounded"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "app/public/BO.png";
                }}
              />
              <span className="font-bold text-xl text-[#7b52d3]">Brand Orbit</span>
            </div>

            {/* Navigation Options */}
            <nav className="flex text-xs items-center gap-1">
              {sidebarOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setActiveSection(option)}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    activeSection === option 
                      ? "bg-[#2D2D2D] text-white" 
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg">
                      {option === "Profile" && (
                        <svg width="20" height="20" fill="currentColor">
                          <circle cx="10" cy="7" r="4" />
                          <rect x="4" y="13" width="12" height="5" rx="2" />
                        </svg>
                      )}
                      {option === "List Packages" && (
                        <svg width="20" height="20" fill="currentColor">
                          <rect x="3" y="7" width="14" height="10" rx="2" />
                          <rect x="7" y="3" width="6" height="4" rx="1" />
                        </svg>
                      )}
                      {option === "Analytics" && (
                        <svg width="20" height="20" fill="currentColor">
                          <rect x="3" y="12" width="3" height="5" />
                          <rect x="8" y="9" width="3" height="8" />
                          <rect x="13" y="6" width="3" height="11" />
                        </svg>
                      )}
                      {option === "Campaigns" && (
                        <svg width="20" height="20" fill="currentColor">
                          <rect x="4" y="4" width="12" height="12" rx="2" />
                        </svg>
                      )}
                      {option === "Wallet" && (
                        <svg width="20" height="20" fill="currentColor">
                          <rect x="2" y="7" width="16" height="10" rx="2" />
                          <rect x="6" y="3" width="8" height="4" rx="1" />
                        </svg>
                      )}
                      {option === "Settings" && (
                        <svg width="20" height="20" fill="currentColor">
                          <circle cx="10" cy="10" r="3" />
                          <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.93 4.93l1.41 1.41M15.66 15.66l1.41 1.41M4.93 15.07l1.41-1.41M15.66 4.34l1.41-1.41" />
                        </svg>
                      )}
                    </span>
                    {option}
                  </span>
                </button>
              ))}
              {/* Logout Button */}
            <button
              className="ml-auto px-4 py-2 text-red-600 hover:bg-red-50 rounded-full font-medium transition-colors"
              onClick={() => router.push("/")}
            >
              Logout
            </button>
            </nav>

            
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 bg-[#dfd3b0]">
        {loading && (
          <div className="text-gray-600">
            Loading {activeSection.toLowerCase()}...
          </div>
        )}
        {error && <div className="text-red-500">{error}</div>}
        {!loading && !error && activeSection === "Profile" && (
          <Profile initialData={profile} />
        )}
        {!loading && !error && activeSection === "List Packages" && (
          <ListPackages packages={packages} />
        )}
        {!loading && !error && activeSection === "Analytics" && (
          <AnalyticsDashboard analytics={analytics} />
        )}
        {!loading && !error && activeSection === "Campaigns" && (
          <Campaigns initialCampaigns={campaigns} />
        )}
        {!loading && !error && activeSection === "Wallet" && (
          <Wallet />
        )}
        {!loading && !error && activeSection === "Settings" && (
          <Settings initialSettings={settings} />
        )}
      </div>
    </div>
  );
};

export default InfluencerDashboard;