"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import { Button } from "@/components/shadcn/button";
import { Badge } from "@/components/shadcn/badge";
import { Input } from "@/components/shadcn/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import { DealSheet } from "@/components/dashboard/deal-sheet";
import { CreateDealModal } from "@/components/dashboard/create-deal-modal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Link from "next/link";

interface Deal {
  id: string;
  title: string;
  description?: string;
  client_name?: string;
  deal_value?: string;
  status: string;
  created_at: string;
  updated_at?: string;
}

export default function DealsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: deals = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["deals"],
    queryFn: async () => {
      const response = await fetch("/api/deals");
      if (!response.ok) {
        throw new Error("Failed to fetch deals");
      }
      return response.json();
    },
  });

  const deleteDealmutation = useMutation({
    mutationFn: async (dealId: string) => {
      const response = await fetch(`/api/deals/${dealId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete deal");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      toast.success("Deal deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const filteredDeals = deals.filter((deal: Deal) => {
    const matchesSearch =
      deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (deal.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false);
    const matchesStatus =
      statusFilter === "all" || deal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  const handleDeleteDeal = (dealId: string) => {
    if (confirm("Are you sure you want to delete this deal?")) {
      deleteDealmutation.mutate(dealId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading deals...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Error loading deals</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Deals</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setIsCreateModalOpen(true)}>
            Create New Deal
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search deals..."
          className="max-w-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="review">Review</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredDeals.map((deal: Deal) => (
          <DealSheet key={deal.id} deal={deal}>
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{deal.title}</CardTitle>
                    <CardDescription>
                      {deal.client_name || "No client assigned"}
                    </CardDescription>
                    <div className="text-sm text-muted-foreground">
                      Created: {new Date(deal.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="text-xl font-bold">
                      {deal.deal_value || "TBD"}
                    </div>
                    <Badge
                      className={getStatusColor(deal.status)}
                      variant="secondary"
                    >
                      {deal.status}
                    </Badge>
                    <div className="flex space-x-2 mt-2">
                      <Button asChild variant="ghost" size="sm">
                        <Link
                          href={`/dashboard/bank/deals/${deal.id}/overview`}
                        >
                          View
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteDeal(deal.id);
                        }}
                        disabled={deleteDealmutation.isPending}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </DealSheet>
        ))}
        {filteredDeals.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No deals found
          </div>
        )}
      </div>

      <CreateDealModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
}
