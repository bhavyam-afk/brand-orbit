"use client";

import React, { useState } from "react";
import Profile from "@/components/in-dash-components/Profile/Profile";
import ListPackages from "@/components/in-dash-components/Packages/ListPackages";
import AnalyticsDashboard from "@/components/in-dash-components/AnalyticsDashboard";
import Deals from "@/components/in-dash-components/Deals/Deals";
import Wallet from "@/components/in-dash-components/Wallet/Wallet";
import Settings from "@/components/in-dash-components/Settings";
// import Feed from "@/in-dash-components/Feed";
import MetaConnectButton from "@/components/Meta/MetaConnectButton";
import { signOut } from "next-auth/react";

const sidebarOptions = [
  "Profile",
  "List Packages",
  // "Feed",
  "Analytics",
  "Deals",
  "Wallet",
  "Settings"
];

const InfluencerDashboard = () => {
  const [activeSection, setActiveSection] = useState("Profile");

  return (
    <div className="min-h-screen flex flex-col">

      {/* Top Bar */}
      <div className="mx-auto flex items-center justify-between space-x-6 w-[80vw] px-6 py-4 border-b">

        {/* Logo  */}
        <div className="flex items-center gap-3">
          <img src="/BO.png" alt="Brand Orbit Logo" className="w-8 h-8 rounded-xl cursor-pointer"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "app/public/BO.png";
            }}
            onClick={()=>{setActiveSection("Profile")}}
          />
          <span className="font-bold text-xl text-[#7b52d3] cursor-pointer" onClick={()=>{setActiveSection("Profile")}}>Brand Orbit</span>
        </div>

        <MetaConnectButton />

        {/* Top Bar Options */}
        <nav className="flex text-xs items-center gap-1">
          {sidebarOptions.map((option) => (
            <button
              key={option}
              onClick={() => setActiveSection(option)}
              className={`cursor-pointer px-4 py-2 rounded-full font-medium transition-colors ${activeSection === option ? "text-white" : "text-gray-600 hover:bg-gray-100"}`}
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
                  {option === "Deals" && (
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
                  {/* {option === "Feed" && (
                        <svg width="20" height="20" fill="currentColor">
                          <circle cx="10" cy="7" r="4" />
                          <rect x="4" y="13" width="12" height="5" rx="2" />
                        </svg>
                      )} */}
                </span>
                {option}
              </span>
            </button>
          ))}

          {/* Logout Button */}
          <button
            className="cursor-pointer ml-auto px-4 py-2 text-red-600 hover:bg-red-50 rounded-full font-medium transition-colors"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Logout
          </button>
        </nav>

      </div>

      {/* any style that we want to be common for all the pages in dashboard can be added here */}
      {activeSection === "Profile" && (
        <Profile />
      )}
      {activeSection === "List Packages" && (
        <ListPackages />
      )}
      {activeSection === "Analytics" && (
        <AnalyticsDashboard />
      )}
      {activeSection === "Deals" && (
        <Deals />
      )}
      {activeSection === "Wallet" && (
        <Wallet />
      )}
      {activeSection === "Settings" && (
        <Settings />
      )}
      {/* activeSection === "Feed" && (
          <Feed />
        )} */}

    </div>
  );
};

export default InfluencerDashboard;