"use client";

import React from "react";
import { useState } from "react";
import Navbuttons from "./Navbuttons";
import { NavBaro } from "@/components/ui/tubelight-navbar";
import { Rocket, Briefcase, Users, Star, HelpCircle, } from "lucide-react";

const navItems = [
    {
        name: "Programs",
        url: "/#programs",
        icon: Rocket,
    },
    {
        name: "For Brands",
        url: "/brand/page.jsx",
        icon: Briefcase,
    },
    {
        name: "For Influencers",
        url: "/influencer/page.jsx",
        icon: Users,
    },
    {
        name: "Success Stories",
        url: "/#success-stories",
        icon: Star,
    },
    {
        name: "Why BrandOrbit",
        url: "/#why-brandorbit",
        icon: HelpCircle,
    },
];


type DropdownKey = "Programs" | "Success Stories" | "Why BrandOrbit";
interface DropdownItem { label: string; href: string; }
const dropdowns: Record<DropdownKey, DropdownItem[]> = {
    Programs: [
        { label: "Campaigns", href: "#campaigns" },
        { label: "Affiliate Marketing", href: "#affiliate" },
    ],
    "Success Stories": [
        { label: "Company A", href: "#company-a" },
        { label: "Company B", href: "#company-b" },
        { label: "Company C", href: "#company-c" },
    ],
    "Why BrandOrbit": [
        { label: "Creators Love", href: "#creators-love" },
        { label: "ROI", href: "#roi" },
    ],
};


const Navbar = () => {
    const [hovered, setHovered] = useState<DropdownKey | null>(null);
    return (
        <nav className="bg-white text-black sticky top-4 z-50 flex items-center justify-between px-10 py-4 mx-auto max-w-7xl border rounded-full shadow-md">
            <span className="text-2xl font-bold tracking-wide flex flex-col items-start justify-center min-w-[120px]">
                Brand Orbit 🚀
            </span>
            <div className="flex-1 flex justify-center items-center">
                {/* Tubelight NavBar with dropdown logic */}
                <div className="relative flex items-center bg-white text-black py-2 px-6 gap-2">
                    {navItems.map((item) => {
                        const hasDropdown = ["Programs", "Success Stories", "Why BrandOrbit"].includes(item.name);
                        return (
                            <div
                                key={item.name}
                                className="relative flex flex-col items-center"
                                onMouseEnter={() => hasDropdown && setHovered(item.name as DropdownKey)}
                                onMouseLeave={() => setHovered(null)}
                            >
                                {/* Use tubelight NavBar tab styling and lamp effect */}
                                <NavBaro
                                    items={[item]}
                                />
                                {/* Dropdown */}
                                {hasDropdown && hovered === item.name && (
                                    <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                                        {dropdowns[item.name as DropdownKey].map((d: DropdownItem) => (
                                            <a
                                                key={d.label}
                                                href={d.href}
                                                className="block px-6 py-2 text-black hover:bg-gray-50 rounded-xl text-base"
                                            >
                                                {d.label}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="flex gap-4 items-center ml-4">
                <Navbuttons type="login" />
                <Navbuttons type="signup" />
            </div>
        </nav>
    );
};

export default Navbar