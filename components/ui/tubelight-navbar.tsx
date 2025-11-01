"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}


export function NavBar({ items, className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name)
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className={cn("relative flex items-center bg-white text-black py-1 px-5 overflow-visible", className)}>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.name;
        const isHovered = hoveredTab === item.name;
        // Only show lamp/dash for the tab that is currently hovered, else active
        const showLamp = hoveredTab ? isHovered : isActive;
        return (
          <div
            key={item.name}
            className="relative flex flex-col items-center"
            onMouseEnter={() => setHoveredTab(item.name)}
            onMouseLeave={() => setHoveredTab(null)}
          >
            {showLamp && (
              <>
                {/* Sleek solid top border for active/hover tab */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-black rounded-t-full z-40" />
                {/* Sleek lamp effect */}
                <motion.div
                  layoutId="lamp"
                  className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-2 z-40"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="w-8 h-1.5 bg-black rounded-t-full opacity-80" />
                  <div className="absolute w-12 h-6 bg-black/15 rounded-full blur-md -top-1 -left-2" />
                  <div className="absolute w-8 h-6 bg-black/10 rounded-full blur-md -top-0.5 left-0" />
                  <div className="absolute w-5 h-5 bg-black/10 rounded-full blur-sm top-0 left-1.5" />
                </motion.div>
              </>
            )}
            <Link
              href={item.url}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                "cursor-pointer font-semibold px-5 py-2 rounded-xl transition-colors text-base min-w-[140px] whitespace-nowrap flex justify-center items-center",
                "text-black hover:text-black hover:bg-gray-50",
                isActive && "bg-gray-100 text-black shadow-sm",
              )}
            >
              <span className="inline whitespace-nowrap">{item.name}</span>
              {Icon && (
                <span className="md:hidden">
                  <Icon size={18} strokeWidth={2.2} />
                </span>
              )}
            </Link>
          </div>
        );
      })}
    </div>
  )
}