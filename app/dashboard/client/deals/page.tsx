'use client'

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card"
import { Badge } from "@/components/shadcn/badge"
import { Button } from "@/components/shadcn/button"
import { Input } from "@/components/shadcn/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select"
import { Skeleton } from "@/components/shadcn/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs"
import { Progress } from "@/components/shadcn/progress"
import Link from "next/link"
import { 
  Building, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  ArrowUpRight, 
  Filter,
  Users,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react"

interface Deal {
  id: string
  title: string
  description?: string
  status: string
  deal_value: string
  created_at: string
  bank_name: string
  completion_percentage?: number
  investor_count?: number
  next_deadline?: string
  documents_count?: number
  recent_activity?: string
}

export default function ClientDealsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")

  const { data: deals = [], isLoading, error } = useQuery<Deal[]>({
    queryKey: ['client-deals-all'],
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

  const filteredDeals = deals
    .filter(deal => {
      const matchesSearch = deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           deal.bank_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (deal.description || "").toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || deal.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'value':
          return parseFloat(b.deal_value.replace(/[^0-9.-]+/g, "")) - 
                 parseFloat(a.deal_value.replace(/[^0-9.-]+/g, ""))
        case 'title':
          return a.title.localeCompare(b.title)
        case 'completion':
          return (b.completion_percentage || 0) - (a.completion_percentage || 0)
        case 'date':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

  const activeDeals = filteredDeals.filter(deal => deal.status === 'active')
  const pendingDeals = filteredDeals.filter(deal => deal.status === 'pending')
  const closedDeals = filteredDeals.filter(deal => deal.status === 'closed')

  const totalValue = deals.reduce((sum, deal) => {
    const value = parseFloat(deal.deal_value.replace(/[^0-9.-]+/g, "") || "0")
    return sum + value
  }, 0)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
              </CardHeader>
            </Card>
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg text-red-600">Error loading deals</p>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All Deals</h1>
        <p className="text-muted-foreground">
          Manage and track all your investment opportunities
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deals.length}</div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Combined deal value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDeals.length}</div>
            <p className="text-xs text-muted-foreground">
              Currently in progress
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Search deals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="value">Deal Value</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="completion">Completion</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Deals Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Deals ({filteredDeals.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeDeals.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingDeals.length})</TabsTrigger>
          <TabsTrigger value="closed">Closed ({closedDeals.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <DealsList deals={filteredDeals} />
        </TabsContent>

        <TabsContent value="active">
          <DealsList deals={activeDeals} />
        </TabsContent>

        <TabsContent value="pending">
          <DealsList deals={pendingDeals} />
        </TabsContent>

        <TabsContent value="closed">
          <DealsList deals={closedDeals} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function DealsList({ deals }: { deals: Deal[] }) {
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

  if (deals.length === 0) {
    return (
      <div className="text-center py-12">
        <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium">No deals found</h3>
        <p className="text-muted-foreground mb-6">Your investment banker will create deals for you</p>
        <Button variant="outline" asChild>
          <Link href="/dashboard/client/contact">
            Contact Your Banker
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {deals.map((deal) => (
        <Card key={deal.id} className="hover:bg-muted/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(deal.status)}
                      <h3 className="text-lg font-semibold">{deal.title}</h3>
                      <Badge className={getStatusColor(deal.status)} variant="secondary">
                        {deal.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Managed by {deal.bank_name}</p>
                  </div>
                </div>
                
                {deal.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {deal.description}
                  </p>
                )}
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Deal Value</p>
                    <p className="font-medium">{deal.deal_value}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Created</p>
                    <p className="font-medium">{new Date(deal.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Investors</p>
                    <p className="font-medium">{deal.investor_count || 0}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Documents</p>
                    <p className="font-medium">{deal.documents_count || 0}</p>
                  </div>
                </div>

                {deal.completion_percentage !== undefined && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{deal.completion_percentage}%</span>
                    </div>
                    <Progress value={deal.completion_percentage} />
                  </div>
                )}

                {deal.recent_activity && (
                  <div className="border-t pt-3">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Latest: </span>
                      {deal.recent_activity}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="ml-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/dashboard/client/deals/${deal.id}`}>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}