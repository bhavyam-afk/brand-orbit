"use client"

import React from "react";
import { usePathname } from 'next/navigation';


interface SettingsData {
  username: string;
  email: string;
  location: string | null;
  niche: string | null;
  nicheTags: string[];
  platformLinks: Record<string, string> | null;
  category: string;
}

interface SettingsProps {
  initialSettings?: SettingsData;
}

const Settings: React.FC<SettingsProps> = ({ initialSettings }) => {
  const pathname = usePathname();

  const [settings, setSettings] = React.useState<SettingsData | null>(initialSettings || null);
  const [loading, setLoading] = React.useState(!initialSettings);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Derive username from pathname in a robust way
        const parts = (pathname || window.location.pathname).split('/').filter(Boolean);
        // Expect URLs like /influencer/<username>/... or /brand/<username>/...
        const username = parts.length >= 2 ? parts[1] : parts[0] ?? '';

        if (!username) {
          console.error('Could not determine username from pathname', pathname);
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/influencer2/${username}/settings`);
        const data = await response.json();
        if (response.ok) {
          setSettings(data);
          setFetchError(null);
        } else {
          const errMsg = `Failed to fetch settings: ${response.status} ${data?.error ?? JSON.stringify(data)}`;
          console.error(errMsg);
          setFetchError(errMsg);
        }
      } catch (error) {
        const errMsg = `Error fetching settings: ${String(error)}`;
        console.error(errMsg);
        setFetchError(errMsg);
      } finally {
        setLoading(false);
      }
    };

    if (!initialSettings) {
      fetchSettings();
    }
  }, [initialSettings, pathname]);

  if (loading) {
    return <div className="text-center py-8">Loading settings...</div>;
  }

  if (!settings) {
    return (
      <div className="text-center py-8">
        {fetchError ? (
          <div className="text-red-500">{fetchError}</div>
        ) : (
          <div>No settings data available</div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-[#232946] rounded-2xl shadow-lg p-8 flex flex-col gap-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><span role="img" aria-label="settings">⚙️</span>Settings & Verification</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-[#7b52d3] flex flex-col gap-2">
          <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><span role="img" aria-label="gear">⚙️</span>Profile Settings</h3>
          <ul className="text-gray-300 text-sm space-y-3">
            <li>
              <div className="text-[#7b52d3] font-semibold">Username</div>
              <div>{settings.username}</div>
            </li>
            <li>
              <div className="text-[#7b52d3] font-semibold">Email</div>
              <div>{settings.email}</div>
            </li>
            <li>
              <div className="text-[#7b52d3] font-semibold">Location</div>
              <div>{settings.location || 'Not set'}</div>
            </li>
            <li>
              <div className="text-[#7b52d3] font-semibold">Niche</div>
              <div>{settings.niche || 'Not set'}</div>
            </li>
            <li>
              <div className="text-[#7b52d3] font-semibold">Creator Category</div>
              <div>{settings.category}</div>
            </li>
          </ul>
          <div className="mt-4">
            <button className="px-4 py-2 bg-[#7b52d3] text-white rounded-lg font-bold shadow hover:bg-[#5a3ca0]">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Connected Platforms */}
        <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-[#7b52d3] flex flex-col gap-2">
          <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><span role="img" aria-label="link">🔗</span>Connected Platforms</h3>
          <div className="space-y-4">
            {settings.platformLinks ? (
              Object.entries(settings.platformLinks).map(([platform, url]) => (
                <div key={platform} className="flex items-center justify-between">
                  <div className="text-[#7b52d3] font-semibold">{platform}</div>
                  <a
                    href={url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-300 hover:text-white"
                  >
                    View Profile →
                  </a>
                </div>
              ))
            ) : (
              <div className="text-gray-400">No platforms connected</div>
            )}
          </div>
          <div className="mt-4 space-y-2">
            <div className="text-[#7b52d3] font-semibold mb-2">Niche Tags</div>
              <div className="flex flex-wrap gap-2">
              {(settings.nicheTags || []).map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-[#7b52d3]/20 rounded-lg text-sm text-[#7b52d3]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <button className="px-4 py-2 bg-[#7b52d3] text-white rounded-lg font-bold shadow hover:bg-[#5a3ca0]">
              Manage Platforms
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
  export default Settings;
