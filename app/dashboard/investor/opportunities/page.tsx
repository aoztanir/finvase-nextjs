'use client'

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card"
import { Badge } from "@/components/shadcn/badge"
import { Button } from "@/components/shadcn/button"
import { Input } from "@/components/shadcn/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select"
import { Skeleton } from "@/components/shadcn/skeleton"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog"
import { Label } from "@/components/shadcn/label"
import { Textarea } from "@/components/shadcn/textarea"
import { toast } from "sonner"
import Link from "next/link"
import { Building, DollarSign, Calendar, Users, ArrowUpRight, Heart, MessageSquare } from "lucide-react"

interface Deal {
  id: string
  title: string
  description?: string
  bank_name: string
  deal_value: string
  status: string
  created_at: string
  min_investment?: string
  target_close_date?: string
  investor_count?: number
  sector?: string
  is_interested?: boolean
}

export default function OpportunitiesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sectorFilter, setSectorFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [interestReason, setInterestReason] = useState("")
  const [investmentAmount, setInvestmentAmount] = useState("")
  
  const queryClient = useQueryClient()

  const { data: deals = [], isLoading, error } = useQuery<Deal[]>({
    queryKey: ['investor-opportunities'],
    queryFn: async () => {
      const response = await fetch('/api/investor/opportunities')
      if (!response.ok) {
        throw new Error('Failed to fetch opportunities')
      }
      return response.json()
    }
  })

  const expressInterestMutation = useMutation({
    mutationFn: async (data: { deal_id: string; investment_amount: string; notes?: string }) => {
      const response = await fetch('/api/investor/express-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to express interest')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investor-opportunities'] })
      queryClient.invalidateQueries({ queryKey: ['investor-investments'] })
      setSelectedDeal(null)
      setInterestReason("")
      setInvestmentAmount("")
      toast.success("Interest expressed successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    }
  })

  const filteredDeals = deals
    .filter(deal => {
      const matchesSearch = deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           deal.bank_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (deal.description || "").toLowerCase().includes(searchQuery.toLowerCase())
      const matchesSector = sectorFilter === "all" || deal.sector === sectorFilter
      return matchesSearch && matchesSector && deal.status === 'active'
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'value':
          return parseFloat(b.deal_value.replace(/[^0-9.-]+/g, "")) - 
                 parseFloat(a.deal_value.replace(/[^0-9.-]+/g, ""))
        case 'title':
          return a.title.localeCompare(b.title)
        case 'closing':
          if (!a.target_close_date || !b.target_close_date) return 0
          return new Date(a.target_close_date).getTime() - new Date(b.target_close_date).getTime()
        case 'date':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

  const handleExpressInterest = (deal: Deal) => {
    setSelectedDeal(deal)
  }

  const submitInterest = () => {
    if (!selectedDeal || !investmentAmount) {
      toast.error("Please enter an investment amount")
      return
    }

    expressInterestMutation.mutate({
      deal_id: selectedDeal.id,
      investment_amount: investmentAmount,
      notes: interestReason
    })
  }

  const availableSectors = [...new Set(deals.map(deal => deal.sector).filter(Boolean))]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
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
          <p className="text-lg text-red-600">Error loading opportunities</p>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Investment Opportunities</h1>
        <p className="text-muted-foreground">
          Discover and evaluate new investment opportunities
        </p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Input
          placeholder="Search opportunities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select value={sectorFilter} onValueChange={setSectorFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by sector" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sectors</SelectItem>
            {availableSectors.map((sector) => (
              <SelectItem key={sector} value={sector || ""}>{sector}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Latest</SelectItem>
            <SelectItem value="value">Deal Value</SelectItem>
            <SelectItem value="closing">Closing Date</SelectItem>
            <SelectItem value="title">Title</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Opportunities Grid */}
      {filteredDeals.length === 0 ? (
        <div className="text-center py-12">
          <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium">No opportunities found</h3>
          <p className="text-muted-foreground">Check back later for new investment opportunities</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDeals.map((deal) => (
            <Card key={deal.id} className="hover:bg-muted/50 transition-colors relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="line-clamp-2">{deal.title}</CardTitle>
                    <CardDescription>{deal.bank_name}</CardDescription>
                  </div>
                  {deal.is_interested && (
                    <Heart className="h-4 w-4 text-red-500 fill-current" />
                  )}
                </div>
                {deal.sector && (
                  <Badge variant="outline" className="w-fit">
                    {deal.sector}
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {deal.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {deal.description}
                  </p>
                )}
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Deal Value</span>
                    <span className="font-medium">{deal.deal_value}</span>
                  </div>
                  {deal.min_investment && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Min Investment</span>
                      <span className="font-medium">{deal.min_investment}</span>
                    </div>
                  )}
                  {deal.target_close_date && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Target Close</span>
                      <span className="font-medium">{new Date(deal.target_close_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  {deal.investor_count !== undefined && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Investors</span>
                      <span className="font-medium">{deal.investor_count}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={() => handleExpressInterest(deal)}
                    disabled={deal.is_interested || expressInterestMutation.isPending}
                    className="flex-1"
                  >
                    {deal.is_interested ? (
                      <>
                        <Heart className="mr-2 h-4 w-4" />
                        Interested
                      </>
                    ) : (
                      'Express Interest'
                    )}
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/investor/deals/${deal.id}`}>
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Express Interest Dialog */}
      <Dialog open={!!selectedDeal} onOpenChange={() => setSelectedDeal(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Express Interest</DialogTitle>
            <DialogDescription>
              Show your interest in &quot;{selectedDeal?.title}&quot; and provide investment details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="investment-amount">Investment Amount *</Label>
              <Input
                id="investment-amount"
                placeholder="e.g., $100,000"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interest-reason">Additional Notes (Optional)</Label>
              <Textarea
                id="interest-reason"
                placeholder="Why are you interested in this opportunity?"
                value={interestReason}
                onChange={(e) => setInterestReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedDeal(null)}>
              Cancel
            </Button>
            <Button
              onClick={submitInterest}
              disabled={expressInterestMutation.isPending || !investmentAmount}
            >
              {expressInterestMutation.isPending ? "Submitting..." : "Express Interest"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}