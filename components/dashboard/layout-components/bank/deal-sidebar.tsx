"use client";

import { BarChart3, FileText, Users, Clock, Settings, FolderOpen, CheckSquare } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/shadcn/sidebar";
import LogoSidebarHeader from "@/components/dashboard/layout-components/shared/logo-sidebar-header";
import { SidebarNavGroup } from "@/components/dashboard/layout-components/shared/sidebar-nav-group";
import { SidebarDealsList } from "@/components/dashboard/layout-components/shared/sidebar-deals-list";
import { SidebarUserFooter } from "@/components/dashboard/layout-components/shared/sidebar-user-footer";
import { SidebarBackNav } from "@/components/dashboard/layout-components/shared/sidebar-back-nav";
import { SidebarDealInfo } from "@/components/dashboard/layout-components/shared/sidebar-deal-info";
import { Separator } from "@/components/shadcn/separator";

const dealNavItems = [
  {
    title: "Overview",
    url: "overview",
    icon: BarChart3,
  },
  {
    title: "Agent Tasks",
    url: "agent-tasks",
    icon: CheckSquare,
  },
  {
    title: "CIM",
    url: "cim",
    icon: FileText,
  },
  {
    title: "Data Room",
    url: "data-room",
    icon: FolderOpen,
  },
  {
    title: "Investors",
    url: "investors",
    icon: Users,
  },
  {
    title: "Timeline",
    url: "timeline",
    icon: Clock,
  },
  {
    title: "Settings",
    url: "settings",
    icon: Settings,
  },
];

interface DealSidebarProps {
  className?: string;
  dealId: string;
}

export function DealSidebar({ className, dealId }: DealSidebarProps) {
  return (
    <Sidebar collapsible="icon" className={className}>
      <SidebarHeader>
        <LogoSidebarHeader />
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarDealInfo dealId={dealId} label="Current Deal" />

        <SidebarNavGroup
          label="Deal Management"
          items={dealNavItems}
          basePath={`/dashboard/bank/deals/${dealId}`}
        />
        <Separator />
        <SidebarDealsList
          currentDealId={dealId}
          apiEndpoint="/api/bank/deals"
          queryKey="bank-deals"
          basePath="/dashboard/bank/deals"
          label="All Deals"
        />

        <SidebarBackNav href="/dashboard/bank" />
      </SidebarContent>
      <Separator />
      <SidebarUserFooter />
    </Sidebar>
  );
}
