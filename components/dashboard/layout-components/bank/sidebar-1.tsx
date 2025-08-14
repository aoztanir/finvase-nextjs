'use client'

import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/shadcn/sidebar"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"

const bankNavItems = [
  {
    title: "Dashboard",
    url: "/dashboard/bank",
    icon: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="7" height="9" x="3" y="3" rx="1"/>
        <rect width="7" height="5" x="14" y="3" rx="1"/>
        <rect width="7" height="9" x="14" y="12" rx="1"/>
        <rect width="7" height="5" x="3" y="16" rx="1"/>
      </svg>
    ),
  },
  {
    title: "Deals",
    url: "/dashboard/bank/deals",
    icon: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14,2 14,8 20,8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10,9 9,9 8,9"/>
      </svg>
    ),
  },
  {
    title: "Clients",
    url: "/dashboard/bank/clients",
    icon: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="m22 21-3-3"/>
        <path d="m16 16 3 3"/>
      </svg>
    ),
  },
  {
    title: "Investors",
    url: "/dashboard/bank/investors",
    icon: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
  },
  {
    title: "Analytics",
    url: "/dashboard/bank/analytics",
    icon: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18"/>
        <path d="m19 9-5 5-4-4-3 3"/>
      </svg>
    ),
  }
]

interface BankSidebarProps {
  isCollapsed: boolean
}

export function BankSidebar({ isCollapsed }: BankSidebarProps) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className={cn("transition-all duration-300", isCollapsed && "w-12")}>
      {!isCollapsed && (
        <SidebarHeader className="border-b p-4">
          <div className="flex items-center gap-2">
            <Logo size={24} className="text-blue-600" />
            <span className="font-semibold">Finvase</span>
          </div>
        </SidebarHeader>
      )}
      <SidebarContent className="p-2">
        <SidebarGroup>
          {!isCollapsed && <SidebarGroupLabel className="px-2 text-xs">Bank Dashboard</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {bankNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className={cn(
                      "w-full justify-start",
                      isCollapsed && "px-2 justify-center"
                    )}
                    tooltip={isCollapsed ? item.title : undefined}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      {!isCollapsed && <span className="ml-2">{item.title}</span>}
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