'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card"
import { Button } from "@/components/shadcn/button"
import { Badge } from "@/components/shadcn/badge"
import { Input } from "@/components/shadcn/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select"
import { DealSheet } from "@/components/dashboard/deal-sheet"
import Link from "next/link"

export default function DealsPage() {
  const deals = [
    { 
      id: "deal-1", 
      title: "Tech Acquisition", 
      client_name: "TechCorp Inc", 
      deal_value: "$5.2M", 
      status: "active", 
      created_at: "2024-01-15",
      description: "Acquisition of a leading technology company specializing in AI-powered analytics solutions."
    },
    { 
      id: "deal-2", 
      title: "Real Estate Fund", 
      client_name: "Property Partners", 
      deal_value: "$12.8M", 
      status: "pending", 
      created_at: "2024-01-10",
      description: "Real estate investment fund focusing on commercial properties."
    },
    { 
      id: "deal-3", 
      title: "Healthcare Merger", 
      client_name: "MedGroup LLC", 
      deal_value: "$8.4M", 
      status: "review", 
      created_at: "2024-01-08",
      description: "Strategic merger between two healthcare service providers."
    },
    { 
      id: "deal-4", 
      title: "Energy Investment", 
      client_name: "GreenPower Co", 
      deal_value: "$3.1M", 
      status: "draft", 
      created_at: "2024-01-05",
      description: "Investment in renewable energy infrastructure projects."
    },
    { 
      id: "deal-5", 
      title: "Fintech Startup", 
      client_name: "PayFlow Inc", 
      deal_value: "$2.8M", 
      status: "active", 
      created_at: "2024-01-03",
      description: "Series B funding for innovative payment processing platform."
    },
    { 
      id: "deal-6", 
      title: "Manufacturing Buy-out", 
      client_name: "Steel Works Ltd", 
      deal_value: "$15.6M", 
      status: "closed", 
      created_at: "2023-12-20",
      description: "Management buy-out of established manufacturing company."
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'review': return 'bg-blue-100 text-blue-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'closed': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="flex-1 space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Deals</h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/dashboard/bank/deals/new">Create New Deal</Link>
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search deals..."
          className="max-w-sm"
        />
        <Select>
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
        {deals.map((deal) => (
          <DealSheet key={deal.id} deal={deal}>
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{deal.title}</CardTitle>
                    <CardDescription>{deal.client_name}</CardDescription>
                    <div className="text-sm text-muted-foreground">Created: {new Date(deal.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="text-xl font-bold">{deal.deal_value}</div>
                    <Badge className={getStatusColor(deal.status)} variant="secondary">
                      {deal.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </DealSheet>
        ))}
      </div>
    </div>
  )
}