'use client'

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card"
import { Skeleton } from "@/components/shadcn/skeleton"
import { Badge } from "@/components/shadcn/badge"
import { Progress } from "@/components/shadcn/progress"
import { Button } from "@/components/shadcn/button"
import Link from "next/link"
import { 
  TrendingUp, 
  DollarSign, 
  Building, 
  FileText, 
  Calendar,
  ArrowUpRight,
  Activity
} from "lucide-react"

interface Investment {
  id: string
  deal_title: string
  deal_id: string
  investment_amount: string
  status: string
  created_at: string
  deal_value: string
  deal_status: string
}

interface DashboardStats {
  total_investments: number
  total_investment_amount: string
  active_deals: number
  pending_opportunities: number
}

export default function InvestorDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['investor-stats'],
    queryFn: async () => {
      const response = await fetch('/api/investor/stats')
      if (!response.ok) {
        throw new Error('Failed to fetch stats')
      }
      return response.json()
    }
  })

  const { data: investments = [], isLoading: investmentsLoading } = useQuery<Investment[]>({
    queryKey: ['investor-investments'],
    queryFn: async () => {
      const response = await fetch('/api/investor/investments')
      if (!response.ok) {
        throw new Error('Failed to fetch investments')
      }
      return response.json()
    }
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'committed': return 'bg-green-100 text-green-800'
      case 'interested': return 'bg-blue-100 text-blue-800'
      case 'declined': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDealStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-purple-100 text-purple-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (statsLoading || investmentsLoading) {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Investment Portfolio</h1>
        <p className="text-muted-foreground">
          Track your investments and discover new opportunities
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investments</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_investments || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active portfolio positions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_investment_amount || '$0'}</div>
            <p className="text-xs text-muted-foreground">
              Across all investments
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.active_deals || 0}</div>
            <p className="text-xs text-muted-foreground">
              Currently in progress
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Opportunities</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pending_opportunities || 0}</div>
            <p className="text-xs text-muted-foreground">
              Available for review
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Investments */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Investments</CardTitle>
              <CardDescription>
                Your latest investment activity and deal participation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {investments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No investments yet</p>
                    <p className="text-sm">Explore available deals to get started</p>
                  </div>
                ) : (
                  investments.slice(0, 5).map((investment) => (
                    <div key={investment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{investment.deal_title}</h4>
                          <Badge className={getDealStatusColor(investment.deal_status)} variant="secondary">
                            {investment.deal_status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Investment: {investment.investment_amount}</span>
                          <span>Deal Value: {investment.deal_value}</span>
                          <span>Date: {new Date(investment.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(investment.status)} variant="secondary">
                          {investment.status}
                        </Badge>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/investor/deals/${investment.deal_id}`}>
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {investments.length > 5 && (
                <div className="mt-4 text-center">
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/investor/investments">
                      View All Investments
                    </Link>
                  </Button>
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
                <Link href="/dashboard/investor/opportunities">
                  <FileText className="mr-2 h-4 w-4" />
                  Browse Opportunities
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/investor/investments">
                  <Building className="mr-2 h-4 w-4" />
                  View Portfolio
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/investor/documents">
                  <FileText className="mr-2 h-4 w-4" />
                  Document Library
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Portfolio Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Active Investments</span>
                    <span>{((stats?.active_deals || 0) / Math.max(stats?.total_investments || 1, 1) * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={(stats?.active_deals || 0) / Math.max(stats?.total_investments || 1, 1) * 100} />
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  Portfolio diversification metrics
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}