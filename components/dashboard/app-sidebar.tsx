'use client'

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { ChevronDown, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/shadcn/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar"
import { Badge } from "@/components/shadcn/badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/shadcn/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu"
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

interface NavItem {
  title: string
  url: string
  icon: React.ComponentType
  subItems?: Array<{
    title: string
    url: string
  }>
}

const bankNavItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard/bank",
    icon: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14,2 14,8 20,8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
    subItems: [
      { title: "Active Deals", url: "/dashboard/bank/deals?status=active" },
      { title: "Pending Deals", url: "/dashboard/bank/deals?status=pending" },
      { title: "Completed Deals", url: "/dashboard/bank/deals?status=completed" },
      { title: "Deal Templates", url: "/dashboard/bank/deals/templates" },
    ],
  },
  {
    title: "Clients",
    url: "/dashboard/bank/clients",
    icon: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="m22 21-3-3"/>
        <path d="m16 16 3 3"/>
      </svg>
    ),
    subItems: [
      { title: "All Clients", url: "/dashboard/bank/clients" },
      { title: "Active Clients", url: "/dashboard/bank/clients?status=active" },
      { title: "Potential Clients", url: "/dashboard/bank/clients?status=potential" },
      { title: "Client Analytics", url: "/dashboard/bank/clients/analytics" },
    ],
  },
  {
    title: "Investors",
    url: "/dashboard/bank/investors",
    icon: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
    subItems: [
      { title: "All Investors", url: "/dashboard/bank/investors" },
      { title: "Portfolio Management", url: "/dashboard/bank/investors/portfolio" },
      { title: "Investor Relations", url: "/dashboard/bank/investors/relations" },
      { title: "Investment Tracking", url: "/dashboard/bank/investors/tracking" },
    ],
  },
  {
    title: "Analytics",
    url: "/dashboard/bank/analytics",
    icon: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 3v18h18"/>
        <path d="m19 9-5 5-4-4-3 3"/>
      </svg>
    ),
    subItems: [
      { title: "Deal Analytics", url: "/dashboard/bank/analytics/deals" },
      { title: "Client Performance", url: "/dashboard/bank/analytics/clients" },
      { title: "Revenue Analytics", url: "/dashboard/bank/analytics/revenue" },
      { title: "Market Insights", url: "/dashboard/bank/analytics/market" },
    ],
  },
  {
    title: "Documents",
    url: "/dashboard/bank/documents",
    icon: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14,2 14,8 20,8"/>
      </svg>
    ),
    subItems: [
      { title: "All Documents", url: "/dashboard/bank/documents" },
      { title: "CIM Documents", url: "/dashboard/bank/documents/cim" },
      { title: "Legal Documents", url: "/dashboard/bank/documents/legal" },
      { title: "Financial Reports", url: "/dashboard/bank/documents/financial" },
    ],
  },
  {
    title: "Team Management",
    url: "/dashboard/bank/team",
    icon: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M22 11c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2z"/>
        <path d="M16 13c.6-.6 1.4-1 2.2-1h.6c1.1 0 2.2.9 2.2 2v2"/>
      </svg>
    ),
    subItems: [
      { title: "Team Overview", url: "/dashboard/bank/team" },
      { title: "Permissions", url: "/dashboard/bank/team/permissions" },
      { title: "Activity Logs", url: "/dashboard/bank/team/activity" },
      { title: "Team Settings", url: "/dashboard/bank/team/settings" },
    ],
  },
]


interface AppSidebarProps {
  className?: string
}

export function AppSidebar({ className }: AppSidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const getInitials = (name: string) => {
    return name?.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase() || 'U'
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'bank': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'client': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'investor': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    }
  }

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const isItemActive = (item: NavItem) => {
    if (pathname === item.url) return true
    if (item.subItems) {
      return item.subItems.some(subItem => pathname === subItem.url)
    }
    return false
  }

  return (
    <Sidebar collapsible="icon" className={cn("border-r", className)}>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
          <Logo size={24} className="text-foreground" />
          <span className="font-semibold group-data-[collapsible=icon]:hidden">Finvase</span>
          <Badge variant="secondary" className="ml-auto text-xs bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900 dark:text-blue-200 group-data-[collapsible=icon]:hidden">
            Early Access
          </Badge>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground px-3 py-2 group-data-[collapsible=icon]:hidden">
            Bank Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {bankNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.subItems ? (
                    <Collapsible
                      open={expandedItems.includes(item.title)}
                      onOpenChange={() => toggleExpanded(item.title)}
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.title}
                          className={cn(
                            "w-full justify-between group-data-[collapsible=icon]:justify-center",
                            isItemActive(item) && "bg-accent text-accent-foreground"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <item.icon />
                            <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                          </div>
                          {expandedItems.includes(item.title) ? (
                            <ChevronDown className="h-4 w-4 group-data-[collapsible=icon]:hidden" />
                          ) : (
                            <ChevronRight className="h-4 w-4 group-data-[collapsible=icon]:hidden" />
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.subItems.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={pathname === subItem.url}
                              >
                                <Link href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      tooltip={item.title}
                      className="w-full justify-start group-data-[collapsible=icon]:justify-center"
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start h-auto p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2">
              <div className="flex items-center gap-3 group-data-[collapsible=icon]:gap-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={session?.user?.name || ""} />
                  <AvatarFallback className="text-xs font-medium">
                    {getInitials(session?.user?.name || "")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-left min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                  <p className="text-sm font-medium leading-none truncate">
                    {session?.user?.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={cn("text-xs", getRoleColor(session?.user?.role || ''))} variant="secondary">
                      {session?.user?.role}
                    </Badge>
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 flex-shrink-0 group-data-[collapsible=icon]:hidden" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" side="top">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session?.user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Help & Support
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/login' })}>
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}