'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card"
import { Button } from "@/components/shadcn/button"
import { Badge } from "@/components/shadcn/badge"
import Link from "next/link"

export default function BankDashboard() {
  const stats = [
    { title: "Active Deals", value: "12", change: "+2 this month" },
    { title: "Total Clients", value: "48", change: "+5 this month" },
    { title: "Deal Value", value: "$24.5M", change: "+15% this quarter" },
    { title: "Pending Reviews", value: "3", change: "2 urgent" },
  ]

  const recentDeals = [
    { id: "1", title: "Tech Acquisition", client: "TechCorp Inc", value: "$5.2M", status: "active" },
    { id: "2", title: "Real Estate Fund", client: "Property Partners", value: "$12.8M", status: "pending" },
    { id: "3", title: "Healthcare Merger", client: "MedGroup LLC", value: "$8.4M", status: "review" },
    { id: "4", title: "Energy Investment", client: "GreenPower Co", value: "$3.1M", status: "draft" },
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

  return (
    <div className="flex-1 space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/dashboard/bank/deals/new">Create New Deal</Link>
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
              {recentDeals.map((deal) => (
                <div key={deal.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="space-y-1">
                    <Link href={`/dashboard/bank/deals/${deal.id}/overview`} className="font-medium hover:underline">
                      {deal.title}
                    </Link>
                    <p className="text-sm text-muted-foreground">{deal.client}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="font-medium">{deal.value}</div>
                    <Badge className={getStatusColor(deal.status)} variant="secondary">
                      {deal.status}
                    </Badge>
                  </div>
                </div>
              ))}
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
    </div>
  )
}