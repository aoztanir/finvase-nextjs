"use client";

import { useParams, usePathname } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/shadcn/sidebar";
import { DealSidebar } from "@/components/dashboard/layout-components/bank/deal-sidebar";
import { DashboardHeader } from "@/components/dashboard/layout-components/bank/header";
import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Separator } from "@/components/shadcn/separator";
import Link from "next/link";

export default function DealLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const dealId = params.id as string;

  const dealInfo = {
    title: "Tech Acquisition",
    client: "TechCorp Inc",
    value: "$5.2M",
    status: "active",
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "review":
        return "bg-blue-100 text-blue-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "closed":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const toggleSidebar = () => {
    // This function is kept for potential future use
  };

  return (
    <SidebarProvider>
      <DealSidebar dealId={dealId} />
      <SidebarInset>
        <DashboardHeader onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/bank/deals">
                      <svg
                        className="mr-1 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Back to Deals
                    </Link>
                  </Button>
                </div>
                <h2 className="text-3xl font-bold tracking-tight">
                  {dealInfo.title}
                </h2>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>Client: {dealInfo.client}</span>
                  <span>Value: {dealInfo.value}</span>
                  <Badge
                    className={getStatusColor(dealInfo.status)}
                    variant="secondary"
                  >
                    {dealInfo.status}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline">Share</Button>

                <Button>Edit Deal</Button>
              </div>
            </div>

            <Separator />

            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
