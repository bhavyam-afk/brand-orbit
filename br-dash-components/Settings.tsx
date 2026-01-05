import React from "react";

const SettingsSection = () => (
  <div className="bg-[#232946] rounded-2xl shadow-lg p-8 flex flex-col gap-8 border border-gray-400">
    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-300">
      <span role="img" aria-label="settings">⚙️</span>Settings, Integrations, and Support
    </h2>
    <div className="text-gray-300 mb-6 text-lg">
      <span className="font-bold text-white">Purpose:</span> Manage account, team, and external connections.
    </div>
    {/* Account & Security */}
    <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-gray-300 mb-4">
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-yellow-300">
        <span role="img" aria-label="lock">🔒</span>Account & Security
      </h3>
      <ul className="text-gray-300 text-sm space-y-1">
        <li>2FA, API tokens</li>
        <li className="text-gray-300">[API: GET/POST /api/brand/settings/security]</li>
      </ul>
    </div>
    {/* Team Access Management */}
    <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-gray-300 mb-4">
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-blue-300">
        <span role="img" aria-label="team">🧑‍💼</span>Team Access Management
      </h3>
      <ul className="text-gray-300 text-sm space-y-1">
        <li>Admin, Editor, Analyst roles</li>
        <li className="text-gray-300">[API: GET/POST /api/brand/settings/team]</li>
      </ul>
    </div>
    {/* Integrations */}
    <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-gray-300 mb-4">
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-green-300">
        <span role="img" aria-label="integrations">🔗</span>Integrations
      </h3>
      <ul className="text-gray-300 text-sm space-y-1">
        <li>CRM (HubSpot, Notion), ad trackers, Google Analytics</li>
        <li className="text-gray-300">[API: GET/POST /api/brand/settings/integrations]</li>
      </ul>
    </div>
    {/* Subscription Plan Management */}
    <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-gray-300 mb-4">
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-purple-300">
        <span role="img" aria-label="subscription">🗒️</span>Subscription Plan Management
      </h3>
      <ul className="text-gray-300 text-sm space-y-1">
        <li>Manage subscription plans</li>
        <li className="text-gray-300">[API: GET/POST /api/brand/settings/subscription]</li>
      </ul>
    </div>
    {/* Help & Support */}
    <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-red-400">
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-red-400">
        <span role="img" aria-label="support">🆘</span>Help & Support Chatbot / Ticket System
      </h3>
      <ul className="text-gray-300 text-sm space-y-1">
        <li>Chatbot, ticket system for support</li>
        <li className="text-gray-300">[API: GET/POST /api/brand/settings/support]</li>
      </ul>
    </div>
  </div>
);

export default SettingsSection;
