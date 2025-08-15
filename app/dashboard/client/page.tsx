'use client'

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card"
import { Skeleton } from "@/components/shadcn/skeleton"
import Link from "next/link"
import { Badge } from "@/components/shadcn/badge"

interface Deal {
  id: string
  title: string
  description?: string
  status: string
  deal_value?: string
  created_at: string
}

export default function ClientDashboardPage() {
  const { data: deals = [], isLoading, error } = useQuery<Deal[]>({
    queryKey: ['client-deals'],
    queryFn: async () => {
      const response = await fetch('/api/client/deals')
      if (!response.ok) {
        throw new Error('Failed to fetch deals')
      }
      return response.json()
    }
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'closed': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/4" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full mt-2" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="text-red-600">Error loading deals.</div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Your Deals</h2>
      {deals.length === 0 ? (
        <p>You are not associated with any deals yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {deals.map((deal) => (
            <Link key={deal.id} href={`/dashboard/client/deals/${deal.id}`}>
              <Card className="hover:bg-muted/50 transition-colors h-full">
                <CardHeader>
                  <CardTitle>{deal.title}</CardTitle>
                  <CardDescription>
                    Created on {new Date(deal.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {deal.description || "No description available."}
                  </p>
                  <div className="flex justify-between items-center pt-2">
                    <Badge className={getStatusColor(deal.status)} variant="secondary">
                      {deal.status}
                    </Badge>
                    <span className="text-lg font-semibold">{deal.deal_value || "TBD"}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
