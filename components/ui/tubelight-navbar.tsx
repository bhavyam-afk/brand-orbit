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
    // <div className={cn("absolute left-1/2 -top-1/12 -translate-x-1/2 z-50 w-fit pt-4", className,)} >
      <div className="flex items-center bg-white text-black py-1 px-5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;
          return (
            <Link key={item.name} href={item.url} onClick={() => setActiveTab(item.name)}
              className={cn(
                "relative cursor-pointer font-semibold px-6 py-2 rounded-full transition-colors",
                "text-black hover:text-black",
                isActive && "bg-gray-100 text-black",
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-2"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="w-8 h-1 bg-black rounded-t-full" />
                  <div className="absolute w-12 h-6 bg-black/10 rounded-full blur-md -top-2 -left-2" />
                  <div className="absolute w-8 h-6 bg-black/10 rounded-full blur-md -top-1" />
                  <div className="absolute w-4 h-4 bg-black/10 rounded-full blur-sm top-0 left-2" />
                </motion.div>
              )}
            </Link>
          );
        })}
      </div>
    // </div>
  )
}
