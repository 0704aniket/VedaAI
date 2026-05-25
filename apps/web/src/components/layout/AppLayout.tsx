"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import MobileNav from "./MobileNav";
import { X, Sparkles, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, FileText, Library, Settings } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { name: "Home", href: "/home", icon: Home },
  { name: "My Groups", href: "/groups", icon: Users },
  { name: "Assignments", href: "/assignments", icon: FileText, badge: 12 },
  { name: "AI Teacher's Toolkit", href: "/ai-toolkit", icon: Sparkles },
  { name: "My Library", href: "/library", icon: Library },
];

export default function AppLayout({ children }: AppLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="min-h-screen bg-app-bg text-brand-black flex">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={toggleMobileMenu}
          />

          {/* Drawer Content */}
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4 shadow-xl transition-all duration-300 ease-in-out">
            <div className="absolute top-4 right-4">
              <button
                onClick={toggleMobileMenu}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-brand-black"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Logo */}
            <div className="flex items-center px-6 h-12 border-b border-border-gray">
              <Link href="/assignments" className="flex items-center gap-2.5" onClick={toggleMobileMenu}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-orange text-white">
                  <span className="text-lg font-bold italic tracking-tighter">V</span>
                </div>
                <span className="text-lg font-bold tracking-tight text-brand-black">
                  Veda<span className="text-brand-orange">AI</span>
                </span>
              </Link>
            </div>

            {/* CTA Button */}
            <div className="px-4 py-6">
              <Link
                href="/create-assignment"
                onClick={toggleMobileMenu}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-black px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all"
              >
                <Plus className="h-4 w-4" />
                Create Assignment
                <Sparkles className="h-3.5 w-3.5 text-brand-orange fill-brand-orange/20" />
              </Link>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 space-y-1 px-3 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = pathname.startsWith(item.href) || (item.href === "/assignments" && pathname === "/");
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={toggleMobileMenu}
                    className={`group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-brand-orange/10 text-brand-orange"
                        : "text-gray-600 hover:bg-gray-50 hover:text-brand-black"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`h-5 w-5 ${
                          isActive ? "text-brand-orange" : "text-gray-400 group-hover:text-gray-600"
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          isActive ? "bg-brand-orange text-white" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Settings & Profile Bottom */}
            <div className="border-t border-border-gray p-4 space-y-4">
              <Link
                href="/settings"
                onClick={toggleMobileMenu}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  pathname === "/settings"
                    ? "bg-brand-orange/10 text-brand-orange"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Settings
                  className={`h-5 w-5 ${
                    pathname === "/settings" ? "text-brand-orange" : "text-gray-400"
                  }`}
                />
                <span>Settings</span>
              </Link>

              <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200 text-gray-700 font-bold text-sm">
                  DP
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">School</p>
                  <p className="text-sm font-bold text-brand-black truncate">Delhi Public School</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main View Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-h-screen">
        {/* Top Header bar */}
        <TopBar onMenuClick={toggleMobileMenu} />

        {/* Content body */}
        <main className="flex-1 p-6 pb-24 lg:pb-6 overflow-x-hidden">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileNav />
      </div>
    </div>
  );
}
