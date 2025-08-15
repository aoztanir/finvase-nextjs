"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/shadcn/sidebar";
import LogoSidebarHeader from "@/components/dashboard/layout-components/shared/logo-sidebar-header";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import { useRouter } from "next/navigation";

interface Deal {
  id: string;
  title: string;
}

export function DealSidebar() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const current_deal_id = params.id as string;

  const { data: deals = [], isLoading } = useQuery<Deal[]>({
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

  const nav_items = [
    { href: `/dashboard/client/deals/${current_deal_id}`, label: "Home" },
    { href: `/dashboard/client/deals/${current_deal_id}/data-room`, label: "Data Room" },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <LogoSidebarHeader />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {nav_items.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} className="w-full">
                <SidebarMenuButton isActive={pathname === item.href}>
                  {item.label}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
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
