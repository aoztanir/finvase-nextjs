"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  FileBarChart,
  Users,
  Clock,
  FileText,
  BarChart3,
  Settings,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/shadcn/sidebar";
import LogoSidebarHeader from "../shared/logo-sidebar-header";
import { SidebarNavGroup } from "../shared/sidebar-nav-group";
import { SidebarUserFooter } from "../shared/sidebar-user-footer";
import { Separator } from "@/components/shadcn/separator";

const mainNavItems = [
  {
    title: "Dashboard",
    url: "/dashboard/bank",
    icon: LayoutDashboard,
  },
];

const coreBusinessItems = [
  {
    title: "Deals",
    url: "/dashboard/bank/deals",
    icon: FileBarChart,
  },
  {
    title: "Clients",
    url: "/dashboard/bank/clients",
    icon: Users,
  },
  {
    title: "Investors",
    url: "/dashboard/bank/investors",
    icon: Clock,
  },
];

const analyticsItems = [
  {
    title: "Analytics",
    url: "/dashboard/bank/analytics",
    icon: BarChart3,
  },
];

const documentItems = [
  {
    title: "Documents",
    url: "/dashboard/bank/documents",
    icon: FileText,
  },
];

const settingsItems = [
  {
    title: "Settings",
    url: "/dashboard/bank/settings",
    icon: Settings,
  },
  {
    title: "Help",
    url: "/dashboard/bank/help",
    icon: HelpCircle,
  },
];

export function BankSidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className={className}>
      <SidebarHeader>
        <LogoSidebarHeader />
      </SidebarHeader>
      <Separator />

      <SidebarContent className="mt-4">
        {/* Search */}
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="relative group-data-[collapsible=icon]:hidden">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search deals, clients..."
                className="pl-9 pr-12"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                ⌘K
              </kbd>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 group-data-[state=expanded]:hidden"
            >
              <Search className="h-4 w-4" />
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarNavGroup label="Main" items={mainNavItems} />

        <SidebarNavGroup label="Core Business" items={coreBusinessItems} />

        <SidebarNavGroup label="Analytics & Reports" items={analyticsItems} />

        <SidebarNavGroup label="Documents" items={documentItems} />

        <SidebarNavGroup label="Settings" items={settingsItems} />
      </SidebarContent>

      <Separator />
      <SidebarUserFooter />
    </Sidebar>
  );
}
