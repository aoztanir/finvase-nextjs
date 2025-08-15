"use client";

import { SidebarProvider, SidebarInset } from "@/components/shadcn/sidebar";
import { DealSidebar } from "@/components/dashboard/client/deal-sidebar";
import { DashboardHeader } from "@/components/dashboard/layout-components/bank/header";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/shadcn/skeleton";
import Link from "next/link";
import { Button } from "@/components/shadcn/button";

interface Deal {
  id: string;
  title: string;
}

export default function ClientDealLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const deal_id = params.id as string;

  const { data: deal, isLoading } = useQuery<Deal>({
    queryKey: ["deal", deal_id],
    queryFn: async () => {
      const response = await fetch(`/api/client/deals/${deal_id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch deal details");
      }
      return response.json();
    },
  });

  const toggleSidebar = () => {
    // Placeholder
  };

  return (
    <SidebarProvider>
      <DealSidebar />
      <SidebarInset>
        <DashboardHeader onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
                {isLoading ? (
                    <Skeleton className="h-10 w-1/2" />
                ) : (
                    <h2 className="text-3xl font-bold tracking-tight">{deal?.title}</h2>
                )}
                <Button asChild variant="outline">
                    <Link href="/dashboard/client">Back to All Deals</Link>
                </Button>
            </div>
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
