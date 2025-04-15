"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import {
  LayoutDashboard,
  Users,
  Settings,
  PenSquare,
  FolderKanban,
  Calendar,
  ImageIcon,
  LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminNav() {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState(true)

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("isAdminLoggedIn")
      window.location.href = "/admin"
    }
  }

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard size={20} />
    },
    {
      name: "Chapters",
      href: "/admin/chapters",
      icon: <FolderKanban size={20} />
    },
    {
      name: "Team",
      href: "/admin/team",
      icon: <Users size={20} />
    },
    {
      name: "Events",
      href: "/admin/events",
      icon: <Calendar size={20} />
    },
    {
      name: "Blog",
      href: "/admin/blog",
      icon: <PenSquare size={20} />
    },
    {
      name: "Gallery",
      href: "/admin/gallery",
      icon: <ImageIcon size={20} />
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: <Settings size={20} />
    }
  ]

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/admin/dashboard">
                <div className="flex items-center">
                  <Image
                    src="/ieee-logo.png"
                    alt="IEEE PESCE Logo"
                    width={40}
                    height={40}
                    className="h-8 w-auto"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=32&width=32"
                    }}
                  />
                  <span className="ml-2 font-semibold text-lg dark:text-white">
                    IEEE PESCE Admin
                  </span>
                </div>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
                      pathname === item.href || pathname.startsWith(item.href + "/")
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div>
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="md:hidden p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-3 gap-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`p-2 rounded-md text-sm font-medium flex flex-col items-center justify-center ${
                pathname === item.href || pathname.startsWith(item.href + "/")
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              {item.icon}
              <span className="mt-1 text-xs">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
} 