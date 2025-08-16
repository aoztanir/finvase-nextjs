'use client'

import { 
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/shadcn/sidebar"
import LogoSidebarHeader from "@/components/dashboard/layout-components/shared/logo-sidebar-header"
import { SidebarNavGroup } from "@/components/dashboard/layout-components/shared/sidebar-nav-group"
import { SidebarUserFooter } from "@/components/dashboard/layout-components/shared/sidebar-user-footer"
import {
  Home,
  Building,
  FileText,
  TrendingUp,
  Search,
  Settings,
  HelpCircle,
} from "lucide-react"

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard/investor",
    icon: Home,
  },
  {
    title: "My Investments",
    url: "/dashboard/investor/investments",
    icon: Building,
  },
  {
    title: "Opportunities",
    url: "/dashboard/investor/opportunities",
    icon: Search,
  },
  {
    title: "Documents",
    url: "/dashboard/investor/documents",
    icon: FileText,
  },
  {
    title: "Performance",
    url: "/dashboard/investor/performance",
    icon: TrendingUp,
  },
]

const supportItems = [
  {
    title: "Settings",
    url: "/dashboard/investor/settings",
    icon: Settings,
  },
  {
    title: "Help & Support",
    url: "/dashboard/investor/help",
    icon: HelpCircle,
  },
]

export function InvestorSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <LogoSidebarHeader />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarNavGroup
          label="Navigation"
          items={navigationItems}
        />
        
        <SidebarNavGroup
          label="Support"
          items={supportItems}
        />
      </SidebarContent>
      
      <SidebarUserFooter />
    </Sidebar>
  )
}