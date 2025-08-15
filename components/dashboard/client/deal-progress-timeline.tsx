"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/shadcn/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/shadcn/alert";
import { Terminal } from "lucide-react";

interface DealEvent {
  id: string;
  title: string;
  description?: string;
  status: 'completed' | 'in-progress' | 'pending' | 'action-required';
  created_at: string;
}

export function DealProgressTimeline() {
  const params = useParams();
  const deal_id = params.id as string;

  const { data: events = [], isLoading, error } = useQuery<DealEvent[]>({
    queryKey: ["deal-events", deal_id],
    queryFn: async () => {
      const response = await fetch(`/api/client/deals/${deal_id}/events`);
      if (!response.ok) {
        throw new Error("Failed to fetch deal events");
      }
      return response.json();
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'action-required': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/4" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </CardContent>
        </Card>
    )
  }

  if (error) {
    return (
        <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
                Failed to load deal timeline. Please try again later.
            </AlertDescription>
        </Alert>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deal Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-6">
          {events.length > 0 && <div className="absolute left-3 top-1 bottom-1 w-0.5 bg-muted -z-10"></div>}
          {events.map((event) => (
            <div key={event.id} className="relative flex items-start space-x-4">
                <div className="flex-shrink-0 w-6 h-6 bg-background border-2 rounded-full flex items-center justify-center mt-1">
                    {/* Icon can go here based on event type */}
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{event.title}</h4>
                        <Badge className={getStatusColor(event.status)} variant="secondary">{event.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                    <p className="text-xs text-muted-foreground">{new Date(event.created_at).toLocaleString()}</p>
                    {event.status === 'action-required' && (
                        <Button size="sm" className="mt-2">Action Required</Button>
                    )}
                </div>
            </div>
          ))}
           {events.length === 0 && (
            <p className="text-muted-foreground">No timeline events yet.</p>
           )}
        </div>
      </CardContent>
    </Card>
  );
}
