"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, Sparkles, Library } from "lucide-react";

const mobileItems = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Assignments", href: "/assignments", icon: FileText },
  { name: "AI Toolkit", href: "/ai-toolkit", icon: Sparkles },
  { name: "Library", href: "/library", icon: Library },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-border-gray bg-white lg:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {mobileItems.map((item) => {
          const isActive = pathname.startsWith(item.href) || (item.href === "/assignments" && pathname === "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 w-16 py-1 text-center transition-all ${
                isActive ? "text-brand-orange" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Icon className="h-5.5 w-5.5" />
              <span className="text-[10px] font-medium tracking-tight">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
