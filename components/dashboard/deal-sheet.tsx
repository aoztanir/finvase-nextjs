'use client'

import { useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/shadcn/sheet"
import { Button } from "@/components/shadcn/button"
import { Badge } from "@/components/shadcn/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card"
import { Separator } from "@/components/shadcn/separator"
import Link from "next/link"

interface Deal {
  id: string
  title: string
  client_name?: string
  deal_value: string
  status: string
  created_at: string
  description?: string
}

interface DealSheetProps {
  deal: Deal
  children: React.ReactNode
}

export function DealSheet({ deal, children }: DealSheetProps) {
  const [isOpen, setIsOpen] = useState(false)

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
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-[500px] sm:w-[600px]">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <SheetTitle>{deal.title}</SheetTitle>
              <SheetDescription>
                {deal.client_name && `Client: ${deal.client_name}`}
              </SheetDescription>
            </div>
            <Badge className={getStatusColor(deal.status)} variant="secondary">
              {deal.status}
            </Badge>
          </div>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Deal Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Deal Value</span>
                  <span className="text-sm font-semibold">{deal.deal_value}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge className={getStatusColor(deal.status)} variant="secondary">
                    {deal.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Created</span>
                  <span className="text-sm">{new Date(deal.created_at).toLocaleDateString()}</span>
                </div>
                {deal.client_name && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Client</span>
                    <span className="text-sm">{deal.client_name}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {deal.description && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{deal.description}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href={`/dashboard/bank/deals/${deal.id}/overview`} onClick={() => setIsOpen(false)}>
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Full Details
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href={`/dashboard/bank/deals/${deal.id}/documents`} onClick={() => setIsOpen(false)}>
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View Documents
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href={`/dashboard/bank/deals/${deal.id}/investors`} onClick={() => setIsOpen(false)}>
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Manage Investors
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  )
}