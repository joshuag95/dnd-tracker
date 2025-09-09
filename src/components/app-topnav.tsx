"use client";

import { Menu, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { AppSidebar } from "./app-sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useViewer } from "@/components/viewer-context";

export function AppTopNav() {
  const { viewer, setViewer } = useViewer();

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center border-b bg-white/80 backdrop-blur">
      <div className="flex w-full items-center gap-2 px-3 md:px-4">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger className="md:hidden rounded p-2 hover:bg-gray-100">
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <AppSidebar />
          </SheetContent>
        </Sheet>

        {/* Brand */}
        <Link href="/dashboard" className="font-semibold">
          DnD Tracker
        </Link>

        {/* Viewer toggle */}
        <div className="ml-auto mr-2 flex items-center gap-3 text-sm">
          <label className="flex items-center gap-1">
            <input
              type="radio"
              checked={viewer.role === "dm"}
              onChange={() => setViewer({ role: "dm" })}
            />
            <span>DM</span>
          </label>

          <label className="flex items-center gap-1">
            <input
              type="radio"
              checked={viewer.role === "pc"}
              onChange={() =>
                setViewer({
                  role: "pc",
                  pcId: viewer.role === "pc" ? viewer.pcId : "",
                })
              }
            />
            <span>PC</span>
          </label>

          {viewer.role === "pc" && (
            <input
              className="border rounded px-2 py-1 h-8"
              placeholder="PC ID (optional)"
              value={viewer.pcId ?? ""}
              onChange={(e) =>
                setViewer({
                  role: "pc",
                  pcId: e.target.value || undefined,
                })
              }
            />
          )}
        </div>

        {/* Placeholder user menu */}
        <button className="rounded p-2 hover:bg-gray-100">
          <User className="h-5 w-5" />
        </button>
        <Avatar className="h-7 w-7">
          <AvatarFallback>{viewer.role === "dm" ? "DM" : "PC"}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
