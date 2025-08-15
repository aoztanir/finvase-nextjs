'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card"
import { Badge } from "@/components/shadcn/badge"
import { Progress } from "@/components/shadcn/progress"
import { Separator } from "@/components/shadcn/separator"
import { useQuery } from "@tanstack/react-query"
import { use } from "react"

interface Deal {
  id: string
  title: string
  description?: string
  client_name?: string
  client_email?: string
  deal_value?: string
  status: string
  created_at: string
  updated_at?: string
}

export default function DealOverviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  
  const { data: deal, isLoading, error } = useQuery<Deal>({
    queryKey: ['deal', id],
    queryFn: async () => {
      const response = await fetch(`/api/deals/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch deal')
      }
      return response.json()
    }
  })

  const { data: investors = [] } = useQuery({
    queryKey: ['deal-investors', id],
    queryFn: async () => {
      const response = await fetch(`/api/deals/${id}/investors`)
      if (!response.ok) {
        throw new Error('Failed to fetch investors')
      }
      return response.json()
    }
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading deal overview...</div>
      </div>
    )
  }

  if (error || !deal) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error loading deal overview</div>
      </div>
    )
  }
  const dealDetails = {
    description: deal.description || "No description available for this deal.",
    timeline: [
      { phase: "Initial Contact", status: "completed", date: deal.created_at },
      { phase: "Due Diligence", status: deal.status === "draft" ? "pending" : "completed", date: deal.created_at },
      { phase: "Valuation", status: deal.status === "active" ? "in-progress" : deal.status === "draft" ? "pending" : "completed", date: deal.updated_at || deal.created_at },
      { phase: "Term Sheet", status: deal.status === "pending" ? "in-progress" : deal.status === "closed" ? "completed" : "pending", date: deal.updated_at || deal.created_at },
      { phase: "Final Agreement", status: deal.status === "closed" ? "completed" : "pending", date: deal.updated_at || deal.created_at },
      { phase: "Closing", status: deal.status === "closed" ? "completed" : "pending", date: deal.updated_at || deal.created_at },
    ],
    keyMetrics: [
      { label: "Deal Value", value: deal.deal_value || "TBD", change: "N/A" },
      { label: "Status", value: deal.status.charAt(0).toUpperCase() + deal.status.slice(1), change: "Current" },
      { label: "Client", value: deal.client_name || "Unassigned", change: "Primary" },
      { label: "Investors", value: investors.length.toString(), change: "Active" },
    ],
    investors: investors.map((investor: any) => ({
      name: investor.investor_name || "Unknown Investor",
      amount: investor.investment_amount || "TBD",
      percentage: "TBD"
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const completedPhases = dealDetails.timeline.filter(phase => phase.status === 'completed').length
  const totalPhases = dealDetails.timeline.length
  const progressPercentage = (completedPhases / totalPhases) * 100

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Deal Overview</CardTitle>
          <CardDescription>Complete overview of the current deal status and details</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">{dealDetails.description}</p>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{completedPhases}/{totalPhases} phases complete</span>
            </div>
            <Progress value={progressPercentage} className="w-full" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
            <CardDescription>Financial and operational metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dealDetails.keyMetrics.map((metric) => (
                <div key={metric.label} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{metric.label}</span>
                  <div className="text-right">
                    <div className="font-semibold">{metric.value}</div>
                    <div className="text-xs text-green-600">{metric.change}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
            <CardDescription>Deal progression timeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dealDetails.timeline.map((phase, index) => (
                <div key={phase.phase} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">{phase.phase}</div>
                    <div className="text-xs text-muted-foreground">{phase.date}</div>
                  </div>
                  <Badge className={getStatusColor(phase.status)} variant="secondary">
                    {phase.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Investment Breakdown</CardTitle>
          <CardDescription>Current investor commitments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dealDetails.investors.map((investor) => (
              <div key={investor.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium">{investor.name}</div>
                  <div className="text-sm text-muted-foreground">{investor.percentage} of total</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{investor.amount}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}