"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, MapPin, Users, CalendarClock, Boxes } from "lucide-react";

type Item = { href: string; label: string; icon: React.ComponentType<any> };

const navItems: Item[] = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/campaigns", label: "Campaigns", icon: Boxes },
  { href: "/dashboard/locations", label: "Locations", icon: MapPin },
  { href: "/dashboard/npcs", label: "NPCs", icon: Users },
  { href: "/dashboard/events", label: "Events", icon: CalendarClock },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 lg:w-72 shrink-0 border-r bg-white">
      <nav className="flex w-full flex-col p-3">
        <div className="px-2 py-3 text-xs uppercase tracking-wide text-gray-500">
          DnD Tracker
        </div>
        <ul className="space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname?.startsWith(href + "/");
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition",
                    active
                      ? "bg-gray-900 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-auto px-3 pt-4 text-xs text-gray-400">
          v0.1 • local data
        </div>
      </nav>
    </aside>
  );
}
