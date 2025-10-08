"use client";

import React from 'react'
import Navbuttons from "./Navbuttons";

const Navbar = () => {
    return (
            <nav className="mx-auto pt-4 pb-4 sticky top-3 z-50 w-[80vw] flex justify-between items-center px-12 bg-[#222] rounded-full shadow-lg">
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold tracking-wide text-white">Brand Orbit 🚀</span>
                </div>
                <div className="flex-1 flex justify-center gap-10">
                    {/* Programs Dropdown */}   
                    <div className="relative group">
                        <button className="text-white font-semibold hover:text-[#7b52d3] transition focus:outline-none">Programs</button>
                        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-[#222] rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto pointer-events-auto transition-opacity z-20"
                            onMouseEnter={e => e.currentTarget.classList.add('opacity-100')}
                            onMouseLeave={e => e.currentTarget.classList.remove('opacity-100')}
                        >
                            <a href="#campaigns" className="block px-6 py-2 text-white hover:text-[#7b52d3] rounded-t-lg">Campaigns</a>
                            <a href="#affiliate" className="block px-6 py-2 text-white hover:text-[#7b52d3] rounded-b-lg">Affiliate Marketing</a>
                        </div>
                    </div>
                    {/* For Brands */}   
                    <div className="relative group">
                        <button className="text-white font-semibold hover:text-[#7b52d3] transition focus:outline-none" onClick={() => window.location.href = '/brand/page.jsx'}>For Brands</button>
                    </div>
                    {/* For Influencers */}   
                    <div className="relative group">
                        <button className="text-white font-semibold hover:text-[#7b52d3] transition focus:outline-none" onClick={() => window.location.href = '/influencer/page.jsx'}>For Influencers</button>
                    </div>
                    {/* Success Stories Dropdown */}
                    <div className="relative group">
                        <button className="text-white font-semibold hover:text-blue-400 transition focus:outline-none">Success Stories</button>
                        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-[#222] rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto pointer-events-auto transition-opacity z-20"
                            onMouseEnter={e => e.currentTarget.classList.add('opacity-100')}
                            onMouseLeave={e => e.currentTarget.classList.remove('opacity-100')}
                        >
                            <a href="#company-a" className="block px-6 py-2 text-white hover:text-[#7b52d3] rounded-t-lg">Company A</a>
                            <a href="#company-b" className="block px-6 py-2 text-white hover:text-[#7b52d3]">Company B</a>
                            <a href="#company-c" className="block px-6 py-2 text-white hover:text-[#7b52d3] rounded-b-lg">Company C</a>
                        </div>
                    </div>
                    {/* Why Brand Orbit Dropdown */}
                    <div className="relative group">
                        <button className="text-white font-semibold hover:text-blue-400 transition focus:outline-none">Why BrandOrbit</button>
                        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-[#222] rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto pointer-events-auto transition-opacity z-20"
                            onMouseEnter={e => e.currentTarget.classList.add('opacity-100')}
                            onMouseLeave={e => e.currentTarget.classList.remove('opacity-100')}
                        >
                            <a href="#creators-love" className="block px-6 py-2 text-white hover:text-[#7b52d3] rounded-t-lg">Creators Love</a>
                            <a href="#roi" className="block px-6 py-2 text-white hover:text-[#7b52d3] rounded-b-lg">ROI</a>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 items-center">
                    <Navbuttons type="login" />
                    <Navbuttons type="signup" />
                </div>
            </nav>
    );
}

export default Navbar



