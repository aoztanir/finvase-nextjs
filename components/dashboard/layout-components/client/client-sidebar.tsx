"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { ChevronDown, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/shadcn/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/shadcn/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/shadcn/sidebar"
import { Logo } from "@/components/ui/logo"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select"

interface NavItem {
  title: string
  url: string
  icon: React.ComponentType
  subItems?: Array<{
    title: string
    url: string
  }>
}

const clientNavItems: NavItem[] = [
  {
    title: "Overview",
    url: "/dashboard/client",
    icon: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect width="7" height="9" x="3" y="3" rx="1" />
        <rect width="7" height="5" x="14" y="3" rx="1" />
        <rect width="7" height="9" x="14" y="12" rx="1" />
        <rect width="7" height="5" x="3" y="16" rx="1" />
      </svg>
    ),
  },
  {
    title: "My Deals",
    url: "/dashboard/client/deals",
    icon: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14,2 14,8 20,8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
]

const mockDeals = [
  { id: "1", title: "TechCorp Acquisition", bank: "Goldman Sachs", status: "active" },
  { id: "2", title: "Series B Funding", bank: "Morgan Stanley", status: "completed" },
  { id: "3", title: "IPO Preparation", bank: "JP Morgan", status: "pending" },
]

export function ClientSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [selectedDeal, setSelectedDeal] = useState<string>("")
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const dealId = pathname.split("/deals/")[1]?.split("/")[0]
  const isDealPage = pathname.includes("/dashboard/client/deals/") && dealId

  const dealNavItems: NavItem[] = isDealPage ? [
    {
      title: "Home",
      url: `/dashboard/client/deals/${dealId}`,
      icon: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9,22 9,12 15,12 15,22" />
        </svg>
      ),
    },
    {
      title: "Data Room",
      url: `/dashboard/client/deals/${dealId}/data-room`,
      icon: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14,2 14,8 20,8" />
        </svg>
      ),
    },
  ] : []

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    )
  }

  const isItemActive = (item: NavItem) => {
    if (pathname === item.url) return true
    if (item.subItems) {
      return item.subItems.some((subItem) => pathname === subItem.url)
    }
    return false
  }

  const currentDeal = mockDeals.find(deal => deal.id === dealId)

  return (
    <Sidebar collapsible="icon" className="border-r border-gray-200 bg-white">
      <SidebarHeader className="h-16 border-b border-gray-200 px-6">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
            <Logo className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-lg font-semibold text-gray-900">Finvase</span>
            <span className="text-xs text-gray-500">Client Portal</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        {!isDealPage ? (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-medium text-gray-500 px-3 py-2 group-data-[collapsible=icon]:hidden">
              Main Menu
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {clientNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={cn(
                        "w-full justify-start group-data-[collapsible=icon]:justify-center h-9 px-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                        pathname === item.url && "bg-green-50 text-green-700 border-r-2 border-green-600 font-medium"
                      )}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span className="group-data-[collapsible=icon]:hidden font-medium">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : (
          <>
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-gray-500 px-3 py-2 group-data-[collapsible=icon]:hidden">
                Current Deal
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-3 py-2 group-data-[collapsible=icon]:hidden">
                  <div className="rounded-lg border border-gray-200 p-3 bg-gray-50">
                    <h3 className="text-sm font-medium text-gray-900 mb-1">{currentDeal?.title}</h3>
                    <p className="text-xs text-gray-500">Bank: {currentDeal?.bank}</p>
                    <div className="mt-2">
                      <span className={cn(
                        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                        currentDeal?.status === "active" && "bg-green-100 text-green-700",
                        currentDeal?.status === "completed" && "bg-blue-100 text-blue-700",
                        currentDeal?.status === "pending" && "bg-yellow-100 text-yellow-700"
                      )}>
                        {currentDeal?.status}
                      </span>
                    </div>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-gray-500 px-3 py-2 group-data-[collapsible=icon]:hidden">
                Deal Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {dealNavItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        className={cn(
                          "w-full justify-start group-data-[collapsible=icon]:justify-center h-9 px-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                          pathname === item.url && "bg-green-50 text-green-700 border-r-2 border-green-600 font-medium"
                        )}
                      >
                        <Link href={item.url}>
                          <item.icon />
                          <span className="group-data-[collapsible=icon]:hidden font-medium">
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        {isDealPage && (
          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
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
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-sm text-gray-600 group-data-[collapsible=icon]:hidden">
            All systems operational
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}