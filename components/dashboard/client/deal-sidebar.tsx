"use client";

import { useParams, useRouter } from "next/navigation";
import { Home, FileText } from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from "@/components/shadcn/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import LogoSidebarHeader from "@/components/dashboard/layout-components/shared/logo-sidebar-header";
import { SidebarNavGroup } from "@/components/dashboard/layout-components/shared/sidebar-nav-group";
import { SidebarDealsList } from "@/components/dashboard/layout-components/shared/sidebar-deals-list";
import { SidebarUserFooter } from "@/components/dashboard/layout-components/shared/sidebar-user-footer";
import { SidebarDealInfo } from "@/components/dashboard/layout-components/shared/sidebar-deal-info";
import { useQuery } from "@tanstack/react-query";

interface Deal {
  id: string;
  title: string;
}

const clientNavItems = [
  {
    title: "Home",
    url: "",
    icon: Home,
  },
  {
    title: "Data Room",
    url: "data-room",
    icon: FileText,
  },
];

export function DealSidebar() {
  const params = useParams();
  const router = useRouter();
  const current_deal_id = params.id as string;

  const { data: deals = [] } = useQuery<Deal[]>({
    queryKey: ["client-deals"],
    queryFn: async () => {
      const response = await fetch("/api/client/deals");
      if (!response.ok) {
        throw new Error("Failed to fetch deals");
      }
      return response.json();
    },
  });

  const handleDealChange = (deal_id: string) => {
    router.push(`/dashboard/client/deals/${deal_id}`);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <LogoSidebarHeader />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarDealInfo dealId={current_deal_id} label="Current Deal" />
        
        <SidebarNavGroup
          label="Core Business"
          items={clientNavItems}
          basePath={`/dashboard/client/deals/${current_deal_id}`}
        />
        
        <SidebarDealsList
          currentDealId={current_deal_id}
          apiEndpoint="/api/client/deals"
          queryKey="client-deals"
          basePath="/dashboard/client/deals"
          label="Your Deals"
        />
      </SidebarContent>
      
      <SidebarFooter>
        <Select onValueChange={handleDealChange} defaultValue={current_deal_id}>
          <SelectTrigger>
            <SelectValue placeholder="Switch Deal..." />
          </SelectTrigger>
          <SelectContent>
            {deals.map((deal) => (
              <SelectItem key={deal.id} value={deal.id}>
                {deal.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SidebarFooter>
    </Sidebar>
  );
}
