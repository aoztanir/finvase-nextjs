"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/shadcn/sidebar";

interface SidebarBackNavProps {
  href: string;
  label?: string;
}

export function SidebarBackNav({ href, label = "Back to Dashboard" }: SidebarBackNavProps) {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={label} className="text-muted-foreground">
              <Link href={href}>
                <ArrowLeft />
                <span>{label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}