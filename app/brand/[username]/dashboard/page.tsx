"use client";
import React from "react";
import ProfileSection from "@/br-dash-components/ProfileSection";
import CampaignsSection from "@/br-dash-components/CampaignsSection";
import PaymentsSection from "@/br-dash-components/PaymentsSection";
import AnalyticsSection from "@/br-dash-components/AnalyticsSection";
import SettingsSection from "@/br-dash-components/SettingsSection";
import { useRouter } from "next/navigation";

const sidebarOptions = [
	"Profile",
	"Campaigns",
	"Payments",
	"Analytics",
	"Settings",
];

const BrandDashboard = () => {
	const router = useRouter();
	const [activeSection, setActiveSection] = React.useState("Profile");

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#0a0f2c] via-[#1a1f3c] to-[#232946] flex">
			{/* Sidebar */}
			<div className="w-64 bg-[#181c2f] p-6 flex flex-col gap-8 border-r border-yellow-300">
				<div className="flex items-center gap-3 mb-8">
					<img src="/brand-avatar.png" alt="Avatar" className="w-12 h-12 rounded-full border-2 border-yellow-300 object-cover" />
					<span className="font-bold text-xl text-yellow-300">Brand</span>
				</div>
				<nav className="flex flex-col gap-4">
					{sidebarOptions.map(option => (
						<button key={option} className={`px-4 py-2 rounded-lg font-semibold border ${activeSection === option ? 'bg-yellow-300 text-[#232946]' : 'bg-[#232946] text-yellow-300 border-yellow-300'} transition`} 
            onClick={() => setActiveSection(option)} >
							{option}
						</button>
					))}
				</nav>
				<button
					className="mt-auto px-4 py-2 bg-red-500 text-white rounded-lg font-bold shadow hover:bg-red-700"
					onClick={() => router.push("/")}> Log Out </button>
			</div>

			{/* Main Content */}
			<div className="flex-1 p-10">
				{activeSection === "Profile" && <ProfileSection />}
				{activeSection === "Campaigns" && <CampaignsSection />}
				{activeSection === "Payments" && <PaymentsSection />}
				{activeSection === "Analytics" && <AnalyticsSection />}
				{activeSection === "Settings" && <SettingsSection />}
			</div>
		</div>
	);
};

export default BrandDashboard;




