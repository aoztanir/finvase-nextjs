'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/shadcn/button"
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/shadcn/sidebar"
import { LogoSidebarHeader } from "@/components/dashboard/layout-components/shared/logo-sidebar-header"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
    href: "/dashboard/investor",
    icon: Home,
  },
  {
    title: "My Investments",
    href: "/dashboard/investor/investments",
    icon: Building,
  },
  {
    title: "Opportunities",
    href: "/dashboard/investor/opportunities",
    icon: Search,
  },
  {
    title: "Documents",
    href: "/dashboard/investor/documents",
    icon: FileText,
  },
  {
    title: "Performance",
    href: "/dashboard/investor/performance",
    icon: TrendingUp,
  },
]

const supportItems = [
  {
    title: "Settings",
    href: "/dashboard/investor/settings",
    icon: Settings,
  },
  {
    title: "Help & Support",
    href: "/dashboard/investor/help",
    icon: HelpCircle,
  },
]

export function InvestorSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <LogoSidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {supportItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}