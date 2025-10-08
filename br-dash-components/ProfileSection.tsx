import React from "react";

const ProfileSection = () => (
  <div className="bg-[#232946] rounded-2xl shadow-lg p-8 flex flex-col gap-8 border border-yellow-300">
    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-yellow-300"><span>🧭</span>Brand Profile & Organization Setup</h2>
    {/* Brand Info Page */}
    <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-yellow-200 mb-4">
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><span role="img" aria-label="id">🪪</span>Brand Info</h3>
      <ul className="text-gray-300 text-sm space-y-1">
        <li>Name: <span className="font-semibold">Brand Orbit</span></li>
        <li>Logo: <span className="font-semibold">[Logo Upload]</span></li>
        <li>Industry: <span className="font-semibold">Fashion</span></li>
        <li>Website: <span className="font-semibold">www.brandorbit.com</span></li>
        <li>Description: <span className="font-semibold">Leading fashion brand for Gen Z</span></li>
        <li>Team Size: <span className="font-semibold">12</span></li>
        <li>Location: <span className="font-semibold">Mumbai, India</span></li>
      </ul>
    </div>
    {/* Team Members & Roles */}
    <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-yellow-200 mb-4">
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><span role="img" aria-label="team">👥</span>Team Members & Roles</h3>
      <ul className="text-gray-300 text-sm space-y-1">
        <li>Jane Doe – Marketing Lead</li>
        <li>John Smith – Finance</li>
        <li>Priya Patel – Analyst</li>
        <li><span className="text-yellow-300">[Invite teammate + set role]</span></li>
      </ul>
    </div>
    {/* Verification System */}
    <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-yellow-200 mb-4">
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><span role="img" aria-label="verified">✅</span>Verification System</h3>
      <ul className="text-gray-300 text-sm space-y-1">
        <li>Business verification via domain/email</li>
        <li>Meta's verification API</li>
        <li><span className="text-yellow-300">[Verify Now Button]</span></li>
      </ul>
    </div>
    {/* Brand Type Tagging */}
    <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-yellow-200">
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><span role="img" aria-label="tag">💼</span>Brand Type Tagging</h3>
      <ul className="text-gray-300 text-sm space-y-1">
        <li>FMCG</li>
        <li>Fashion</li>
        <li>Tech</li>
        <li>Fitness</li>
        <li><span className="text-yellow-300">[Select/Tag Brand Type]</span></li>
      </ul>
    </div>
  </div>
);

export default ProfileSection;
