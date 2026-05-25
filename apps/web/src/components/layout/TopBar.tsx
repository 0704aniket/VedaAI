"use client";

import { Bell, ChevronDown, Menu } from "lucide-react";
import { usePathname } from "next/navigation";

interface TopBarProps {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const pathname = usePathname();

  // Helper to determine title/breadcrumb based on route
  const getPageDetails = () => {
    if (pathname.startsWith("/create-assignment")) {
      return {
        title: "Create Assignment",
        breadcrumb: "Assignments / Create New",
      };
    }
    if (pathname.match(/\/assignments\/[a-zA-Z0-9_-]+/)) {
      return {
        title: "Question Paper",
        breadcrumb: "Assignments / Generated Paper",
      };
    }
    return {
      title: "Assignments",
      breadcrumb: "Home / Assignments",
    };
  };

  const { title, breadcrumb } = getPageDetails();

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-border-gray bg-white px-6">
      {/* Left side: Mobile menu toggle + breadcrumb title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-brand-black lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="hidden sm:block">
          <p className="text-xs font-medium text-gray-400">{breadcrumb}</p>
          <h1 className="text-lg font-bold text-brand-black tracking-tight leading-none mt-0.5">
            {title}
          </h1>
        </div>
        <div className="sm:hidden">
          <h1 className="text-base font-bold text-brand-black tracking-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Right side: Notifications + Profile */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative rounded-xl p-2 text-gray-500 hover:bg-gray-100 hover:text-brand-black transition-all">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand-orange ring-2 ring-white" />
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-200" />

        {/* Profile Dropdown */}
        <button className="flex items-center gap-2.5 rounded-xl p-1.5 transition-all hover:bg-gray-50 text-left">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange font-bold text-sm">
            JD
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-semibold text-gray-400 leading-none">Teacher</p>
            <p className="text-sm font-bold text-brand-black mt-0.5 leading-none">John Doe</p>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>
      </div>
    </header>
  );
}
