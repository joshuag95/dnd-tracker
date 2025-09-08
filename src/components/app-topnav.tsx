"use client";

import { Menu, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { AppSidebar } from "./app-sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function AppTopNav() {
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

        <div className="ml-auto flex items-center gap-2">
          {/* Placeholder user menu */}
          <button className="rounded p-2 hover:bg-gray-100">
            <User className="h-5 w-5" />
          </button>
          <Avatar className="h-7 w-7">
            <AvatarFallback>DM</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
