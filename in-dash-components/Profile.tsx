import React from 'react'

const profile = () => {
    const [activeSection, setActiveSection] = React.useState("Profile");
  return (
            <div className="bg-[#232946] rounded-2xl shadow-lg p-8 flex flex-col gap-8">
              <div className="flex gap-8 items-center">
                <img src="/profile-placeholder.png" alt="Profile" className="w-32 h-32 rounded-full border-4 border-[#7b52d3] object-cover" />
                <div>
                  <h2 className="text-2xl font-bold mb-2">Jane Influencer</h2>
                  <p className="text-gray-300 mb-1">Fashion, Travel</p>
                  <p className="text-gray-400">Bio: Passionate creator sharing travel and fashion inspiration.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-6">
                {/* Connected Platforms */}
                <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-[#7b52d3]">
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><span>🌐</span>Connected Platforms</h3>
                  <ul className="space-y-2">
                    <li>Instagram: <span className="font-semibold">120k</span> followers</li>
                    <li>YouTube: <span className="font-semibold">50k</span> subscribers</li>
                    <li>TikTok: <span className="font-semibold">80k</span> followers</li>
                  </ul>
                  <div className="mt-2 text-sm text-gray-400">Engagement rate: <span className="font-bold text-[#7b52d3]">5.2%</span></div>
                  <div className="mt-2 text-sm text-gray-400">Avg likes/comments/views per post</div>
                  <div className="mt-2 text-sm text-gray-400">Verified: <a href="#" className="underline text-[#7b52d3]">OAuth</a></div>
                </div>
                {/* Portfolio Section */}
                <div className="bg-[#181c2f] rounded-xl p-6 shadow border border-[#7b52d3] col-span-2">
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><span>📁</span>Portfolio</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#232946] rounded-lg p-4 shadow">
                      <p className="font-semibold">Collab: Brand Orbit</p>
                      <p className="text-gray-400 text-sm">Sample post, media, etc.</p>
                    </div>
                    <div className="bg-[#232946] rounded-lg p-4 shadow">
                      <p className="font-semibold">Collab: TechX</p>
                      <p className="text-gray-400 text-sm">Sample post, media, etc.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  )
}

export default profile



