"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  FileText,
  Sparkles,
  Library,
  Settings,
  Plus,
} from "lucide-react";

const menuItems = [
  { name: "Home", href: "/home", icon: Home },
  { name: "My Groups", href: "/groups", icon: Users },
  { name: "Assignments", href: "/assignments", icon: FileText, badge: 12 },
  { name: "AI Teacher's Toolkit", href: "/ai-toolkit", icon: Sparkles },
  { name: "My Library", href: "/library", icon: Library },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-border-gray bg-white flex flex-col justify-between lg:flex">
      {/* Top Section */}
      <div className="flex flex-col flex-1">
        {/* Logo */}
        <div className="flex h-16 items-center px-6 border-b border-border-gray">
          <Link href="/assignments" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-orange text-white shadow-md shadow-brand-orange/20">
              <span className="text-xl font-bold italic tracking-tighter">V</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-brand-black">
              Veda<span className="text-brand-orange">AI</span>
            </span>
          </Link>
        </div>

        {/* CTA Button */}
        <div className="px-4 py-6">
          <Link
            href="/create-assignment"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-black px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-brand-black/90 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Create Assignment
            <Sparkles className="h-3.5 w-3.5 text-brand-orange fill-brand-orange/20" />
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1 px-3">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href) || (item.href === "/assignments" && pathname === "/");
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-brand-orange/10 text-brand-orange"
                    : "text-gray-600 hover:bg-gray-50 hover:text-brand-black"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-5 w-5 transition-colors ${
                      isActive ? "text-brand-orange" : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      isActive ? "bg-brand-orange text-white" : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-border-gray p-4 space-y-4">
        {/* Settings Link */}
        <Link
          href="/settings"
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-150 ${
            pathname === "/settings"
              ? "bg-brand-orange/10 text-brand-orange"
              : "text-gray-600 hover:bg-gray-50 hover:text-brand-black"
          }`}
        >
          <Settings
            className={`h-5 w-5 ${
              pathname === "/settings" ? "text-brand-orange" : "text-gray-400"
            }`}
          />
          <span>Settings</span>
        </Link>

        {/* Profile Card */}
        <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200 text-gray-700 font-bold text-sm shadow-inner">
            DP
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">School</p>
            <p className="text-sm font-bold text-brand-black truncate">Delhi Public School</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
