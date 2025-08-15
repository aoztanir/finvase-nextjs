'use client'

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card"
import { Badge } from "@/components/shadcn/badge"
import { Button } from "@/components/shadcn/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs"
import { Progress } from "@/components/shadcn/progress"
import { Skeleton } from "@/components/shadcn/skeleton"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog"
import { Label } from "@/components/shadcn/label"
import { Input } from "@/components/shadcn/input"
import { Textarea } from "@/components/shadcn/textarea"
import { useState } from "react"
import { toast } from "sonner"
import { 
  Building, 
  DollarSign, 
  Calendar, 
  Users, 
  FileText, 
  Download,
  MessageSquare,
  TrendingUp,
  Clock,
  Heart
} from "lucide-react"

interface Deal {
  id: string
  title: string
  description: string
  bank_name: string
  deal_value: string
  status: string
  created_at: string
  target_close_date?: string
  min_investment?: string
  max_investment?: string
  investor_count: number
  sector?: string
  location?: string
  is_interested: boolean
  my_investment?: {
    amount: string
    status: string
    date: string
    notes?: string
  }
}

interface Document {
  id: string
  name: string
  file_type: string
  created_at: string
  file_size?: string
}

export default function InvestorDealPage({ params }: { params: { id: string } }) {
  const [showInvestDialog, setShowInvestDialog] = useState(false)
  const [investmentAmount, setInvestmentAmount] = useState("")
  const [investmentNotes, setInvestmentNotes] = useState("")
  
  const queryClient = useQueryClient()

  const { data: deal, isLoading, error } = useQuery<Deal>({
    queryKey: ['investor-deal', params.id],
    queryFn: async () => {
      const response = await fetch(`/api/investor/deals/${params.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch deal')
      }
      return response.json()
    }
  })

  const { data: documents = [] } = useQuery<Document[]>({
    queryKey: ['investor-deal-documents', params.id],
    queryFn: async () => {
      const response = await fetch(`/api/investor/deals/${params.id}/documents`)
      if (!response.ok) {
        throw new Error('Failed to fetch documents')
      }
      return response.json()
    }
  })

  const expressInterestMutation = useMutation({
    mutationFn: async (data: { investment_amount: string; notes?: string }) => {
      const response = await fetch('/api/investor/express-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deal_id: params.id,
          ...data
        })
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to express interest')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investor-deal', params.id] })
      setShowInvestDialog(false)
      setInvestmentAmount("")
      setInvestmentNotes("")
      toast.success("Interest expressed successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    }
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-purple-100 text-purple-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getInvestmentStatusColor = (status: string) => {
    switch (status) {
      case 'committed': return 'bg-green-100 text-green-800'
      case 'interested': return 'bg-blue-100 text-blue-800'
      case 'declined': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleExpressInterest = () => {
    if (!investmentAmount) {
      toast.error("Please enter an investment amount")
      return
    }
    expressInterestMutation.mutate({
      investment_amount: investmentAmount,
      notes: investmentNotes
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-96" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error || !deal) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg text-red-600">Error loading deal</p>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold tracking-tight">{deal.title}</h1>
            <Badge className={getStatusColor(deal.status)} variant="secondary">
              {deal.status}
            </Badge>
            {deal.is_interested && (
              <Heart className="h-5 w-5 text-red-500 fill-current" />
            )}
          </div>
          <p className="text-muted-foreground">Managed by {deal.bank_name}</p>
        </div>
        
        {!deal.is_interested && deal.status === 'active' && (
          <Button onClick={() => setShowInvestDialog(true)}>
            Express Interest
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Deal Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{deal.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Sector</p>
                      <p>{deal.sector || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Location</p>
                      <p>{deal.location || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Deal Value</p>
                      <p className="text-lg font-semibold">{deal.deal_value}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Target Close</p>
                      <p>{deal.target_close_date ? new Date(deal.target_close_date).toLocaleDateString() : 'TBD'}</p>
                    </div>
                  </div>

                  {(deal.min_investment || deal.max_investment) && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Investment Range</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {deal.min_investment && (
                          <div>
                            <p className="text-sm text-muted-foreground">Minimum</p>
                            <p className="font-medium">{deal.min_investment}</p>
                          </div>
                        )}
                        {deal.max_investment && (
                          <div>
                            <p className="text-sm text-muted-foreground">Maximum</p>
                            <p className="font-medium">{deal.max_investment}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {deal.my_investment && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">My Investment</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>Amount:</span>
                          <span className="font-medium">{deal.my_investment.amount}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Status:</span>
                          <Badge className={getInvestmentStatusColor(deal.my_investment.status)} variant="secondary">
                            {deal.my_investment.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Date:</span>
                          <span>{new Date(deal.my_investment.date).toLocaleDateString()}</span>
                        </div>
                        {deal.my_investment.notes && (
                          <div>
                            <p className="text-sm text-muted-foreground">Notes:</p>
                            <p className="text-sm">{deal.my_investment.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>
                    Access deal documents and data room materials
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {documents.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No documents available</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {doc.file_type} • {doc.file_size} • {new Date(doc.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline">
              <Card>
                <CardHeader>
                  <CardTitle>Deal Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">Deal Created</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(deal.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {deal.my_investment && (
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">Interest Expressed</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(deal.my_investment.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}
                    {deal.target_close_date && (
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                        <div>
                          <p className="font-medium">Target Close Date</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(deal.target_close_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Investors</span>
                </div>
                <span className="font-medium">{deal.investor_count}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Created</span>
                </div>
                <span className="font-medium">{new Date(deal.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Value</span>
                </div>
                <span className="font-medium">{deal.deal_value}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact Banker
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Express Interest Dialog */}
      <Dialog open={showInvestDialog} onOpenChange={setShowInvestDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Express Interest</DialogTitle>
            <DialogDescription>
              Show your interest in &quot;{deal.title}&quot; and provide investment details.
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
              <Label htmlFor="investment-notes">Additional Notes (Optional)</Label>
              <Textarea
                id="investment-notes"
                placeholder="Why are you interested in this opportunity?"
                value={investmentNotes}
                onChange={(e) => setInvestmentNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInvestDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleExpressInterest}
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