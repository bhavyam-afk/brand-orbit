"use client";

import React from "react";
import Navbuttons from "./Navbuttons";
import { NavBar } from "@/components/ui/tubelight-navbar";
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

import { useState } from "react";

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
        <nav className="bg-white text-black sticky top-4 z-50 flex items-center justify-between px-8 py-3 mx-auto max-w-7xl border rounded-full">
            <span className="text-2xl font-bold tracking-wide">Brand Orbit 🚀</span>
            <div className="flex justify-center relative">
                <div className="flex items-center bg-white text-black py-1 px-5">
                    {navItems.map((item) => {
                        const hasDropdown = ["Programs", "Success Stories", "Why BrandOrbit"].includes(item.name);
                        return (
                            <div
                                key={item.name}
                                className="relative"
                                onMouseEnter={() => hasDropdown && setHovered(item.name as DropdownKey)}
                                onMouseLeave={() => setHovered(null)}
                            >
                                <a
                                    href={item.url}
                                    className="relative cursor-pointer font-semibold px-6 py-2 rounded-full transition-colors text-black hover:text-black"
                                >
                                    <span className="hidden md:inline">{item.name}</span>
                                    <span className="md:hidden">
                                        <item.icon size={18} strokeWidth={2.5} />
                                    </span>
                                </a>
                                {/* Dropdown */}
                                {hasDropdown && hovered === item.name && (
                                    <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                                        {dropdowns[item.name as DropdownKey].map((d: DropdownItem) => (
                                            <a
                                                key={d.label}
                                                href={d.href}
                                                className="block px-6 py-2 text-black hover:bg-gray-100 rounded-lg"
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
            <div className="flex gap-4 items-center">
                <Navbuttons type="login" />
                <Navbuttons type="signup" />
            </div>
        </nav>
    );
};

export default Navbar



