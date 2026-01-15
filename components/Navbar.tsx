"use client";

import React from "react";
import Navbuttons from "@/components/Auth/Navbuttons";
import { NavBaro } from "@/components/ui/tubelight-navbar";
import { Rocket, Briefcase, Users, Star, HelpCircle, } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface NavItem {
  name: string
  url: string
  icon?: LucideIcon
} 

const navItems: NavItem[] = [
    {
        name: "For Brands",
        url: "/brand",
        icon: Briefcase,
    },
    {
        name: "For Influencers",
        url: "/creator",
        icon: Users,
    },
    {
        name: "Programs",
        url: "/#programs",
        icon: Rocket,
    },
    {
        name: "Success Stories",
        url: "/#success-stories",
        icon: Star,
    },
    {
        name: "Why BrandOrbit",
        url: "/#why-brandorbit",
        // icon: HelpCircle,
    },
];

export function Navbar() {
    return (
        <nav className="bg-white text-black sticky top-4 z-50 flex items-center justify-between px-10 py-4 mx-auto max-w-7xl border rounded-full shadow-md">
            <div className="name">
                <span className="text-2xl font-bold tracking-wide flex flex-col items-start justify-center min-w-[120px]">
                    Brand Orbit 🚀
                </span>
            </div>
            <div className="tubelight_bar">
                <NavBaro items={navItems} />
            </div>
            <div className="flex gap-4 items-center ml-4">
                <Navbuttons type="login" />
                <Navbuttons type="signup" />
            </div>
        </nav>
    );
};

export default Navbar