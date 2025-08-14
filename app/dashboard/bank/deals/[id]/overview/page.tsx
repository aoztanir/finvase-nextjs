'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card"
import { Badge } from "@/components/shadcn/badge"
import { Progress } from "@/components/shadcn/progress"
import { Separator } from "@/components/shadcn/separator"

export default function DealOverviewPage() {
  const dealDetails = {
    description: "Acquisition of a leading technology company specializing in AI-powered analytics solutions. The deal includes intellectual property, customer base, and key personnel retention.",
    timeline: [
      { phase: "Initial Contact", status: "completed", date: "2024-01-15" },
      { phase: "Due Diligence", status: "completed", date: "2024-01-22" },
      { phase: "Valuation", status: "in-progress", date: "2024-01-28" },
      { phase: "Term Sheet", status: "pending", date: "2024-02-05" },
      { phase: "Final Agreement", status: "pending", date: "2024-02-15" },
      { phase: "Closing", status: "pending", date: "2024-02-22" },
    ],
    keyMetrics: [
      { label: "Revenue", value: "$12.5M", change: "+25%" },
      { label: "EBITDA", value: "$3.2M", change: "+18%" },
      { label: "Employees", value: "145", change: "+12%" },
      { label: "Market Share", value: "8.5%", change: "+2%" },
    ],
    investors: [
      { name: "Venture Capital Fund A", amount: "$2.1M", percentage: "40%" },
      { name: "Angel Investor Group", amount: "$1.6M", percentage: "31%" },
      { name: "Strategic Partner", value: "$1.5M", percentage: "29%" },
    ]
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