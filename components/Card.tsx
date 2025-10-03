"use client" ;

import React, { useState } from "react";

interface CardProps {
  title: string ;
  description: string ;
}

export default function Card({ title, description }: CardProps) {

  const [style, setStyle] = useState({});

  function getCardIcon(title: string): React.ReactNode {
    switch (title) {
      case "AI-Powered Matching":
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="20" fill="#6366f1" />
            <path d="M12 20c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            <circle cx="20" cy="20" r="3" fill="#fff" />
          </svg>
        );
      case "Campaign Analytics":
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="20" fill="#10b981" />
            <rect x="12" y="22" width="4" height="6" fill="#fff" />
            <rect x="18" y="18" width="4" height="10" fill="#fff" />
            <rect x="24" y="14" width="4" height="14" fill="#fff" />
          </svg>
        );
      case "Secure Payments":
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="20" fill="#f59e42" />
            <rect x="12" y="16" width="16" height="10" rx="2" fill="#fff" />
            <circle cx="20" cy="21" r="2" fill="#f59e42" />
          </svg>
        );
      case "Global Reach":
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="20" fill="#38bdf8" />
            <path d="M20 10a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" stroke="#fff" strokeWidth="2" />
            <path d="M20 10v20M10 20h20" stroke="#fff" strokeWidth="2" />
          </svg>
        );
      case "Success Stories":
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="20" fill="#e879f9" />
            <path d="M14 24l6-8 6 8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      default:
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="20" fill="#64748b" />
            <text x="20" y="25" textAnchor="middle" fontSize="12" fill="#fff">?</text>
          </svg>
        );
    }
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -16;
    const rotateY = ((x - centerX) / centerX) * 16;
    setStyle({
      transform: `scale3d(1.1 , 1.1 , 1.1) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      boxShadow: `${rotateY * 2}px ${-rotateX * 2}px 40px rgba(0,0,0,0.3)`,
    });
  }

  function handleMouseLeave() {
    setStyle({ transform: "scale(1)" });
  }

  return (
    <div
      className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-xl p-8 pt-12 transition-all duration-50 cursor-pointer border border-gray-700 relative overflow-visible"
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute left-1/2 -top-8 transform -translate-x-1/2" style={{zIndex:2}}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-transparent">
          {getCardIcon(title)}
        </div>
      </div>
      <h2 className="text-2xl font-semibold mb-2 text-center mt-2">{title}</h2>
      <p className="text-gray-300 text-center">{description}</p>
    </div>
  );
}
