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
import { Building, TrendingUp, DollarSign, Calendar, ArrowUpRight, Filter } from "lucide-react"

interface Investment {
  id: string
  deal_title: string
  deal_id: string
  investment_amount: string
  status: string
  created_at: string
  deal_value: string
  deal_status: string
  deal_description?: string
  bank_name: string
  expected_return?: string
  completion_date?: string
}

export default function InvestmentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")

  const { data: investments = [], isLoading, error } = useQuery<Investment[]>({
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
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredInvestments = investments
    .filter(investment => {
      const matchesSearch = investment.deal_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           investment.bank_name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || investment.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return parseFloat(b.investment_amount.replace(/[^0-9.-]+/g, "")) - 
                 parseFloat(a.investment_amount.replace(/[^0-9.-]+/g, ""))
        case 'title':
          return a.deal_title.localeCompare(b.deal_title)
        case 'date':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

  const activeInvestments = filteredInvestments.filter(inv => ['committed', 'interested'].includes(inv.status))
  const closedInvestments = filteredInvestments.filter(inv => ['declined'].includes(inv.status))

  const totalInvested = investments
    .filter(inv => inv.status === 'committed')
    .reduce((sum, inv) => sum + parseFloat(inv.investment_amount.replace(/[^0-9.-]+/g, "") || "0"), 0)

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
          <p className="text-lg text-red-600">Error loading investments</p>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Investments</h1>
        <p className="text-muted-foreground">
          Track and manage your investment portfolio
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalInvested.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across {investments.filter(inv => inv.status === 'committed').length} deals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeInvestments.length}</div>
            <p className="text-xs text-muted-foreground">
              Currently ongoing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12.5%</div>
            <p className="text-xs text-muted-foreground">
              Estimated return
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Search investments..."
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
              <SelectItem value="committed">Committed</SelectItem>
              <SelectItem value="interested">Interested</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="amount">Amount</SelectItem>
              <SelectItem value="title">Deal Title</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Investments Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Investments ({filteredInvestments.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeInvestments.length})</TabsTrigger>
          <TabsTrigger value="closed">Closed ({closedInvestments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <InvestmentList investments={filteredInvestments} />
        </TabsContent>

        <TabsContent value="active">
          <InvestmentList investments={activeInvestments} />
        </TabsContent>

        <TabsContent value="closed">
          <InvestmentList investments={closedInvestments} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function InvestmentList({ investments }: { investments: Investment[] }) {
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
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (investments.length === 0) {
    return (
      <div className="text-center py-12">
        <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium">No investments found</h3>
        <p className="text-muted-foreground mb-6">Start exploring available opportunities</p>
        <Button asChild>
          <Link href="/dashboard/investor/opportunities">
            Browse Opportunities
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {investments.map((investment) => (
        <Card key={investment.id} className="hover:bg-muted/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold">{investment.deal_title}</h3>
                      <Badge className={getDealStatusColor(investment.deal_status)} variant="secondary">
                        {investment.deal_status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{investment.bank_name}</p>
                  </div>
                  <Badge className={getStatusColor(investment.status)} variant="secondary">
                    {investment.status}
                  </Badge>
                </div>
                
                {investment.deal_description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {investment.deal_description}
                  </p>
                )}
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Investment Amount</p>
                    <p className="font-medium">{investment.investment_amount}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Deal Value</p>
                    <p className="font-medium">{investment.deal_value}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Investment Date</p>
                    <p className="font-medium">{new Date(investment.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Expected Return</p>
                    <p className="font-medium">{investment.expected_return || 'TBD'}</p>
                  </div>
                </div>
              </div>
              
              <div className="ml-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/dashboard/investor/deals/${investment.deal_id}`}>
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