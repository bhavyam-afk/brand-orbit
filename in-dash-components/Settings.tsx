import React from "react";

const Settings = () => (
  <div className="bg-[#232946] rounded-2xl shadow-lg p-8 flex flex-col gap-8">
    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><span role="img" aria-label="settings">⚙️</span>Settings & Verification</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Edit Profile, Social Links, Pricing, Notifications */}
      <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-[#7b52d3] flex flex-col gap-2">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><span role="img" aria-label="gear">⚙️</span>Edit Profile & Preferences</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>Edit profile info</li>
          <li>Social links</li>
          <li>Pricing</li>
          <li>Notification preferences</li>
        </ul>
        <div className="mt-2 text-gray-400 text-xs">[Edit/Profile Form Placeholder]</div>
      </div>
      {/* Verification Badge System */}
      <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-[#7b52d3] flex flex-col gap-2">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><span role="img" aria-label="badge">🪪</span>Verification Badge System</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>Email verification</li>
          <li>Identity verification</li>
          <li>Follower authenticity</li>
        </ul>
        <div className="mt-2 text-gray-400 text-xs">[Verification Badge Placeholder]</div>
      </div>
    </div>
  </div>
);

export default Settings;
