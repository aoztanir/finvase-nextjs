'use client'

import { SidebarProvider } from "@/components/shadcn/sidebar"
import { InvestorSidebar } from "@/components/dashboard/layout-components/investor/investor-sidebar"
import { InvestorHeader } from "@/components/dashboard/layout-components/investor/investor-header"

export default function InvestorDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <InvestorSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <InvestorHeader />
          <main className="flex-1 overflow-y-auto p-6 bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}