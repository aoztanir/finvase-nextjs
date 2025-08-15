"use client";

import { SidebarProvider, SidebarInset } from "@/components/shadcn/sidebar";
import { ClientSidebar } from "@/components/dashboard/client/client-sidebar";
import { DashboardHeader } from "@/components/dashboard/layout-components/bank/header";

export default function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const toggleSidebar = () => {
    // Placeholder
  };

  return (
    <SidebarProvider>
      <ClientSidebar />
      <SidebarInset>
        <DashboardHeader onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
