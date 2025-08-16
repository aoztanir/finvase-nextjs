"use client"

import { usePathname } from "next/navigation"
import { LayoutDashboard, FileBarChart } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "@/components/shadcn/sidebar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select"
import LogoSidebarHeader from "@/components/dashboard/layout-components/shared/logo-sidebar-header"
import { SidebarNavGroup } from "@/components/dashboard/layout-components/shared/sidebar-nav-group"
import { SidebarUserFooter } from "@/components/dashboard/layout-components/shared/sidebar-user-footer"

const clientNavItems = [
  {
    title: "Overview",
    url: "/dashboard/client",
    icon: LayoutDashboard,
  },
  {
    title: "My Deals",
    url: "/dashboard/client/deals",
    icon: FileBarChart,
  },
]

const mockDeals = [
  { id: "1", title: "TechCorp Acquisition", bank: "Goldman Sachs", status: "active" },
  { id: "2", title: "Series B Funding", bank: "Morgan Stanley", status: "completed" },
  { id: "3", title: "IPO Preparation", bank: "JP Morgan", status: "pending" },
]

export function ClientSidebar() {
  const pathname = usePathname()
  const dealId = pathname.split("/deals/")[1]?.split("/")[0]
  const isDealPage = pathname.includes("/dashboard/client/deals/") && dealId
  const currentDeal = mockDeals.find(deal => deal.id === dealId)

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <LogoSidebarHeader />
      </SidebarHeader>

      <SidebarContent>
        <SidebarNavGroup
          label="Main Menu"
          items={clientNavItems}
        />
        
        {isDealPage && (
          <SidebarGroup className="mt-auto">
            <div className="px-3 group-data-[collapsible=icon]:hidden">
              <Select value={dealId} onValueChange={(value) => window.location.href = `/dashboard/client/deals/${value}`}>
                <SelectTrigger className="w-full h-9 text-sm">
                  <SelectValue placeholder="Switch Deal" />
                </SelectTrigger>
                <SelectContent>
                  {mockDeals.map((deal) => (
                    <SelectItem key={deal.id} value={deal.id}>
                      {deal.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarUserFooter />
    </Sidebar>
  )
}