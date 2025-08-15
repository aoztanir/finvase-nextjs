'use client'

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card"
import { Button } from "@/components/shadcn/button"
import { Badge } from "@/components/shadcn/badge"
import { Input } from "@/components/shadcn/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar"
import { useQuery } from "@tanstack/react-query"
import { use } from "react"

export default function DealInvestorsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  
  const { data: investors = [], isLoading, error } = useQuery({
    queryKey: ['deal-investors', id],
    queryFn: async () => {
      const response = await fetch(`/api/deals/${id}/investors`)
      if (!response.ok) {
        throw new Error('Failed to fetch investors')
      }
      return response.json()
    }
  })

  const investorList = investors.length > 0 ? investors.map((investor: any) => ({
    id: investor.id,
    name: investor.investor_name || "Unknown Investor",
    contact: investor.investor_email?.split('@')[0] || "N/A",
    email: investor.investor_email || "N/A",
    phone: "Contact for details",
    investment: investor.investment_amount || "TBD",
    percentage: "TBD",
    status: investor.status || "interested",
    joinedDate: new Date(investor.created_at).toLocaleDateString() || "N/A",
    type: "Investor"
  })) : []

  const filteredInvestors = investorList.filter((investor: any) => {
    const matchesSearch = investor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         investor.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || investor.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading investors...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Error loading investors</div>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'committed': return 'bg-green-100 text-green-800'
      case 'negotiating': return 'bg-blue-100 text-blue-800'
      case 'interested': return 'bg-yellow-100 text-yellow-800'
      case 'declined': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'VC Fund': return 'bg-purple-100 text-purple-800'
      case 'Angel Group': return 'bg-blue-100 text-blue-800'
      case 'Strategic': return 'bg-orange-100 text-orange-800'
      case 'Family Office': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold">Investors</h3>
          <p className="text-muted-foreground">Manage deal investors and their commitments</p>
        </div>
        <Button>Add New Investor</Button>
      </div>

      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search investors..."
          className="max-w-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="vc-fund">VC Fund</SelectItem>
            <SelectItem value="angel-group">Angel Group</SelectItem>
            <SelectItem value="strategic">Strategic</SelectItem>
            <SelectItem value="family-office">Family Office</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="committed">Committed</SelectItem>
            <SelectItem value="negotiating">Negotiating</SelectItem>
            <SelectItem value="interested">Interested</SelectItem>
            <SelectItem value="declined">Declined</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredInvestors.length > 0 ? filteredInvestors.map((investor) => (
          <Card key={investor.id} className="hover:bg-muted/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-muted">
                      {getInitials(investor.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <div>
                      <h4 className="text-lg font-semibold">{investor.name}</h4>
                      <p className="text-sm text-muted-foreground">{investor.contact}</p>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{investor.email}</span>
                      <span>{investor.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getTypeColor(investor.type)} variant="secondary">
                        {investor.type}
                      </Badge>
                      <Badge className={getStatusColor(investor.status)} variant="secondary">
                        {investor.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Joined: {investor.joinedDate}
                    </div>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <div className="text-2xl font-bold">{investor.investment}</div>
                  <div className="text-sm text-muted-foreground">{investor.percentage} of deal</div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Email
                    </Button>
                    <Button variant="ghost" size="sm">
                      <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )) : (
          <div className="text-center py-8 text-muted-foreground">
            No investors found for this deal
          </div>
        )}
      </div>
    </div>
  )
}