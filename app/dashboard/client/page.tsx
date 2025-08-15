'use client'

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card"
import { Skeleton } from "@/components/shadcn/skeleton"
import { Button } from "@/components/shadcn/button"
import { Progress } from "@/components/shadcn/progress"
import Link from "next/link"
import { Badge } from "@/components/shadcn/badge"
import { 
  Building, 
  DollarSign, 
  Calendar, 
  Users, 
  FileText, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpRight
} from "lucide-react"

interface Deal {
  id: string
  title: string
  description?: string
  status: string
  deal_value?: string
  created_at: string
  bank_name?: string
  completion_percentage?: number
  investor_count?: number
  next_deadline?: string
  documents_count?: number
  recent_activity?: string
}

interface ClientStats {
  total_deals: number
  active_deals: number
  total_deal_value: string
  avg_completion: number
}

export default function ClientDashboardPage() {
  const { data: deals = [], isLoading: dealsLoading, error: dealsError } = useQuery<Deal[]>({
    queryKey: ['client-deals'],
    queryFn: async () => {
      const response = await fetch('/api/client/deals')
      if (!response.ok) {
        throw new Error('Failed to fetch deals')
      }
      return response.json()
    }
  })

  const { data: stats, isLoading: statsLoading } = useQuery<ClientStats>({
    queryKey: ['client-stats'],
    queryFn: async () => {
      const response = await fetch('/api/client/stats')
      if (!response.ok) {
        throw new Error('Failed to fetch stats')
      }
      return response.json()
    }
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'closed': return 'bg-purple-100 text-purple-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />
      case 'closed': return <CheckCircle className="h-4 w-4 text-purple-600" />
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  if (dealsLoading || statsLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (dealsError) {
    return <div className="text-red-600">Error loading deals.</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Client Dashboard</h1>
        <p className="text-muted-foreground">
          Track your deals and manage your investment process
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_deals || deals.length}</div>
            <p className="text-xs text-muted-foreground">
              All-time deal count
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.active_deals || deals.filter(d => d.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">
              Currently in progress
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_deal_value || 'TBD'}</div>
            <p className="text-xs text-muted-foreground">
              Across all deals
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Completion</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.avg_completion || 0}%</div>
            <p className="text-xs text-muted-foreground">
              Deal progress
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Deals and Quick Actions */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Your Deals</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/client/deals">
                    View All
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <CardDescription>
                Active and recent deals in your portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              {deals.length === 0 ? (
                <div className="text-center py-8">
                  <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No deals yet</h3>
                  <p className="text-muted-foreground mb-4">Your investment banker will create deals for you</p>
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/client/contact">
                      Contact Your Banker
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {deals.slice(0, 3).map((deal) => (
                    <div key={deal.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(deal.status)}
                          <h4 className="font-medium">{deal.title}</h4>
                          <Badge className={getStatusColor(deal.status)} variant="secondary">
                            {deal.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          {deal.bank_name && <span>Bank: {deal.bank_name}</span>}
                          {deal.deal_value && <span>Value: {deal.deal_value}</span>}
                          <span>Created: {new Date(deal.created_at).toLocaleDateString()}</span>
                        </div>
                        {deal.completion_percentage !== undefined && (
                          <div className="flex items-center space-x-2 mt-2">
                            <Progress value={deal.completion_percentage} className="flex-1" />
                            <span className="text-xs text-muted-foreground">{deal.completion_percentage}%</span>
                          </div>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/client/deals/${deal.id}`}>
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" asChild>
                <Link href="/dashboard/client/documents">
                  <FileText className="mr-2 h-4 w-4" />
                  View Documents
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/client/timeline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Deal Timeline
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/client/contact">
                  <Users className="mr-2 h-4 w-4" />
                  Contact Banker
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {deals.filter(d => d.recent_activity).slice(0, 3).map((deal) => (
                  <div key={deal.id} className="text-sm">
                    <p className="font-medium">{deal.title}</p>
                    <p className="text-muted-foreground">{deal.recent_activity}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(deal.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                {deals.filter(d => d.recent_activity).length === 0 && (
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
