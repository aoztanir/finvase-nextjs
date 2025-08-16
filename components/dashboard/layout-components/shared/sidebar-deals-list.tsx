"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/shadcn/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/shadcn/collapsible";

interface Deal {
  id: string;
  title: string;
}

interface SidebarDealsListProps {
  currentDealId?: string;
  apiEndpoint: string;
  queryKey: string;
  basePath: string;
  label?: string;
  defaultOpen?: boolean;
}

export function SidebarDealsList({
  currentDealId,
  apiEndpoint,
  queryKey,
  basePath,
  label = "Deals",
  defaultOpen = true,
}: SidebarDealsListProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const { data: deals = [] } = useQuery<Deal[]>({
    queryKey: [queryKey],
    queryFn: async () => {
      const response = await fetch(apiEndpoint);
      if (!response.ok) {
        throw new Error("Failed to fetch deals");
      }
      return response.json();
    },
  });

  return (
    <SidebarGroup>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <SidebarGroupLabel className="cursor-pointer hover:text-foreground flex items-center justify-between">
            <span>{label}</span>
            {isOpen ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </SidebarGroupLabel>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {deals.map((deal) => (
                <SidebarMenuItem key={deal.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={currentDealId === deal.id}
                    className="text-sm"
                  >
                    <Link href={`${basePath}/${deal.id}`}>
                      <span className="truncate">{deal.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </Collapsible>
    </SidebarGroup>
  );
}