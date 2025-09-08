import type { ReactNode } from "react";
import { AppTopNav } from "@/components/app-topnav";
import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-slate-50">
      <AppTopNav />
      <div className="mx-auto flex max-w-7xl gap-0 md:gap-6 px-2 md:px-4">
        <AppSidebar />
        <main className="flex-1 p-3 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
