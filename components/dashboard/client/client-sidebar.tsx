"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/shadcn/sidebar";
import LogoSidebarHeader from "@/components/dashboard/layout-components/shared/logo-sidebar-header";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Skeleton } from "@/components/shadcn/skeleton";

interface Deal {
  id: string;
  title: string;
}

export function ClientSidebar() {
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

  return (
    <Sidebar>
      <SidebarHeader>
        <LogoSidebarHeader />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/dashboard/client" className="w-full">
                <SidebarMenuButton>Dashboard</SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
            <p className="text-xs text-gray-500 px-4">Deals</p>
            {isLoading && (
                <div className="px-2 space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
            )}
            {deals.map((deal) => (
                <SidebarMenuItem key={deal.id}>
                    <Link href={`/dashboard/client/deals/${deal.id}`} className="w-full">
                        <SidebarMenuButton>{deal.title}</SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
