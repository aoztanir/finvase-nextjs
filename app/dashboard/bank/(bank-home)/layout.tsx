"use client";

import { SidebarProvider, SidebarInset } from "@/components/shadcn/sidebar";
import { BankSidebar } from "@/components/dashboard/layout-components/bank/bank-sidebar";
import { DashboardHeader } from "@/components/dashboard/layout-components/bank/header";

export default function BankHomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const toggleSidebar = () => {
    // This function is kept for potential future use
  };

  return (
    <SidebarProvider>
      <BankSidebar />
      <SidebarInset>
        <DashboardHeader onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
