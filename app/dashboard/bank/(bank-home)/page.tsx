'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card"
import { Button } from "@/components/shadcn/button"
import { Badge } from "@/components/shadcn/badge"
import { CreateDealModal } from "@/components/dashboard/create-deal-modal"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import Link from "next/link"

interface Deal {
  id: string
  title: string
  client_name?: string
  deal_value?: string
  status: string
  created_at: string
}

interface Analytics {
  totals: {
    clients: number
    investors: number
    deals: number
    documents: number
  }
  dealsByStatus: Record<string, number>
  recentActivity: {
    newDealsLast30Days: number
  }
  financials: {
    totalDealValue: number
  }
}

export default function BankDashboard() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  
  const { data: analytics, isLoading: analyticsLoading } = useQuery<Analytics>({
    queryKey: ['analytics'],
    queryFn: async () => {
      const response = await fetch('/api/bank/analytics')
      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }
      return response.json()
    }
  })

  const { data: deals = [], isLoading: dealsLoading } = useQuery<Deal[]>({
    queryKey: ['deals'],
    queryFn: async () => {
      const response = await fetch('/api/deals')
      if (!response.ok) {
        throw new Error('Failed to fetch deals')
      }
      return response.json()
    }
  })

  const recentDeals = deals.slice(0, 4)
  const activeDeals = deals.filter(deal => deal.status === 'active').length
  const pendingReviews = deals.filter(deal => deal.status === 'review').length

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(value)
  }

  const stats = [
    { 
      title: "Active Deals", 
      value: activeDeals.toString(), 
      change: analytics ? `${analytics.recentActivity.newDealsLast30Days} new this month` : "Loading..." 
    },
    { 
      title: "Total Clients", 
      value: analytics?.totals.clients.toString() || "0", 
      change: "Managed accounts" 
    },
    { 
      title: "Deal Value", 
      value: analytics ? formatCurrency(analytics.financials.totalDealValue) : "$0", 
      change: "Total portfolio value" 
    },
    { 
      title: "Pending Reviews", 
      value: pendingReviews.toString(), 
      change: "Requiring attention" 
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'review': return 'bg-blue-100 text-blue-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (analyticsLoading || dealsLoading) {
    return (
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setIsCreateModalOpen(true)}>
            Create New Deal
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Deals</CardTitle>
            <CardDescription>Your latest deal activity</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="space-y-4">
              {recentDeals.length > 0 ? recentDeals.map((deal) => (
                <div key={deal.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="space-y-1">
                    <Link href={`/dashboard/bank/deals/${deal.id}/overview`} className="font-medium hover:underline">
                      {deal.title}
                    </Link>
                    <p className="text-sm text-muted-foreground">{deal.client_name || "No client assigned"}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="font-medium">{deal.deal_value || "TBD"}</div>
                    <Badge className={getStatusColor(deal.status)} variant="secondary">
                      {deal.status}
                    </Badge>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-muted-foreground">
                  No deals yet. <button onClick={() => setIsCreateModalOpen(true)} className="text-primary hover:underline">Create your first deal</button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your deals and clients</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button asChild variant="outline" className="justify-start">
              <Link href="/dashboard/bank/deals">
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View All Deals
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="justify-start">
              <Link href="/dashboard/bank/clients">
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                Manage Clients
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="justify-start">
              <Link href="/dashboard/bank/investors">
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                View Investors
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="justify-start">
              <Link href="/dashboard/bank/analytics">
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Analytics
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <CreateDealModal 
        open={isCreateModalOpen} 
        onOpenChange={setIsCreateModalOpen} 
      />
    </div>
  )
}