'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select"
import { Progress } from "@/components/shadcn/progress"
import { useQuery } from "@tanstack/react-query"

export default function AnalyticsPage() {
  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const response = await fetch('/api/bank/analytics')
      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }
      return response.json()
    }
  })

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading analytics...</div>
        </div>
      </div>
    )
  }

  if (error || !analytics) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Error loading analytics</div>
        </div>
      </div>
    )
  }

  const dealMetrics = [
    { label: "Total Clients", value: analytics.totals.clients.toString(), change: "+12%", trend: "up" },
    { label: "Total Investors", value: analytics.totals.investors.toString(), change: "+8%", trend: "up" },
    { label: "Total Deals", value: analytics.totals.deals.toString(), change: "+23%", trend: "up" },
    { label: "Documents", value: analytics.totals.documents.toString(), change: "+5%", trend: "up" },
  ]

  const performanceData = [
    { month: "Jan", deals: 8, value: 12.5 },
    { month: "Feb", deals: 6, value: 9.8 },
    { month: "Mar", deals: 10, value: 15.2 },
    { month: "Apr", deals: 12, value: 18.7 },
    { month: "May", deals: 9, value: 14.1 },
    { month: "Jun", deals: 11, value: 16.9 },
  ]

  const industryBreakdown = [
    { industry: "Technology", deals: 8, percentage: 33, color: "bg-blue-500" },
    { industry: "Healthcare", deals: 6, percentage: 25, color: "bg-green-500" },
    { industry: "Real Estate", deals: 4, percentage: 17, color: "bg-orange-500" },
    { industry: "Energy", deals: 3, percentage: 13, color: "bg-yellow-500" },
    { industry: "Fintech", deals: 3, percentage: 12, color: "bg-purple-500" },
  ]

  const topInvestors = [
    { name: "Venture Capital Fund A", deals: 5, investment: "$12.5M" },
    { name: "Strategic Partner Corp", deals: 3, investment: "$15.4M" },
    { name: "Angel Investor Group", deals: 8, investment: "$8.2M" },
    { name: "Family Office Partners", deals: 3, investment: "$6.1M" },
  ]

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <div className="flex items-center space-x-2">
          <Select defaultValue="6months">
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="3months">Last 3 months</SelectItem>
              <SelectItem value="6months">Last 6 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dealMetrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
              <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{metric.change}</span> from last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="deals">Deal Performance</TabsTrigger>
          <TabsTrigger value="investors">Investor Analytics</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Deal Performance by Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceData.map((data) => (
                    <div key={data.month} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{data.month}</p>
                        <p className="text-xs text-muted-foreground">{data.deals} deals</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">${data.value}M</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Industry Breakdown</CardTitle>
                <CardDescription>Deal distribution by industry</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {industryBreakdown.map((industry) => (
                    <div key={industry.industry} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{industry.industry}</span>
                        <span className="text-sm text-muted-foreground">{industry.deals} deals</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={industry.percentage} className="flex-1" />
                        <span className="text-xs text-muted-foreground w-8">{industry.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="deals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Deal Status Distribution</CardTitle>
              <CardDescription>Current status of all deals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{analytics.dealsByStatus.active || 0}</div>
                  <div className="text-sm text-muted-foreground">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{analytics.dealsByStatus.pending || 0}</div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{analytics.dealsByStatus.draft || 0}</div>
                  <div className="text-sm text-muted-foreground">Draft</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{analytics.dealsByStatus.closed || 0}</div>
                  <div className="text-sm text-muted-foreground">Closed</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="investors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Investment Overview</CardTitle>
              <CardDescription>Total deal value and investor participation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">${analytics.financials.totalDealValue.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total Deal Value</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">{analytics.financials.investorParticipation.length}</div>
                    <div className="text-sm text-muted-foreground">Active Investments</div>
                  </div>
                </div>
                {analytics.financials.investorParticipation.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Investment Breakdown by Deal</h4>
                    {analytics.financials.investorParticipation.map((investment: { deal_id?: string; investor_count: number; total_investment?: number }, index: number) => (
                      <div key={investment.deal_id || index} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="text-sm font-medium">Deal #{investment.deal_id?.slice(-6) || 'Unknown'}</p>
                          <p className="text-xs text-muted-foreground">{investment.investor_count} investors</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">${investment.total_investment?.toLocaleString() || '0'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Funnel</CardTitle>
              <CardDescription>Deal progression through pipeline stages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Initial Contact</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={100} className="w-32" />
                    <span className="text-sm">45 deals</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Due Diligence</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={75} className="w-32" />
                    <span className="text-sm">34 deals</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Term Sheet</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={55} className="w-32" />
                    <span className="text-sm">25 deals</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Final Agreement</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={35} className="w-32" />
                    <span className="text-sm">16 deals</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Closed</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={25} className="w-32" />
                    <span className="text-sm">12 deals</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}