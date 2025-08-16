"use client";

import { Badge } from "@/components/shadcn/badge";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/shadcn/sidebar";

interface SidebarDealInfoProps {
  dealId: string;
  label?: string;
  badgeText?: string;
}

export function SidebarDealInfo({ dealId, label = "Current Deal", badgeText }: SidebarDealInfoProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex items-center justify-between">
        <span>{label}</span>
        {badgeText && (
          <Badge variant="secondary" className="text-xs">
            {badgeText}
          </Badge>
        )}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <div className="px-2 py-1 text-sm text-muted-foreground">
          #{dealId?.slice(0, 8)}
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}