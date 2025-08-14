'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card"
import { Badge } from "@/components/shadcn/badge"
import { Button } from "@/components/shadcn/button"

export default function DealTimelinePage() {
  const timelineEvents = [
    {
      id: "1",
      title: "Deal Initiated",
      description: "Initial contact established with TechCorp Inc",
      date: "2024-01-15",
      time: "10:30 AM",
      type: "milestone",
      status: "completed",
      user: "John Smith"
    },
    {
      id: "2",
      title: "NDA Signed",
      description: "Non-disclosure agreement executed by both parties",
      date: "2024-01-16",
      time: "2:45 PM",
      type: "document",
      status: "completed",
      user: "Sarah Johnson"
    },
    {
      id: "3",
      title: "Due Diligence Started",
      description: "Comprehensive due diligence process commenced",
      date: "2024-01-18",
      time: "9:00 AM",
      type: "milestone",
      status: "completed",
      user: "Mike Wilson"
    },
    {
      id: "4",
      title: "Financial Documents Received",
      description: "Q4 2023 financial statements and projections submitted",
      date: "2024-01-20",
      time: "11:15 AM",
      type: "document",
      status: "completed",
      user: "Emma Davis"
    },
    {
      id: "5",
      title: "Management Presentation",
      description: "Executive team presented company overview and growth strategy",
      date: "2024-01-22",
      time: "3:00 PM",
      type: "meeting",
      status: "completed",
      user: "Tom Brown"
    },
    {
      id: "6",
      title: "Valuation Analysis",
      description: "Independent valuation analysis in progress",
      date: "2024-01-24",
      time: "10:00 AM",
      type: "analysis",
      status: "in-progress",
      user: "Lisa Wang"
    },
    {
      id: "7",
      title: "Term Sheet Preparation",
      description: "Preparing preliminary term sheet based on initial findings",
      date: "2024-01-28",
      time: "2:00 PM",
      type: "document",
      status: "pending",
      user: "David Kim"
    },
    {
      id: "8",
      title: "Legal Review",
      description: "Legal team to review all documentation and agreements",
      date: "2024-02-01",
      time: "9:00 AM",
      type: "review",
      status: "pending",
      user: "Alex Rodriguez"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'milestone':
        return (
          <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" />
          </svg>
        )
      case 'document':
        return (
          <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      case 'meeting':
        return (
          <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        )
      case 'analysis':
        return (
          <svg className="h-5 w-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        )
      case 'review':
        return (
          <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-2.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H6.002z" />
          </svg>
        )
      default:
        return (
          <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold">Timeline</h3>
          <p className="text-muted-foreground">Track all deal activities and milestones</p>
        </div>
        <Button>Add Event</Button>
      </div>

      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted"></div>
        <div className="space-y-6">
          {timelineEvents.map((event, index) => (
            <div key={event.id} className="relative flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-background border-2 border-muted rounded-full flex items-center justify-center">
                {getTypeIcon(event.type)}
              </div>
              <Card className="flex-1">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold">{event.title}</h4>
                        <Badge className={getStatusColor(event.status)} variant="secondary">
                          {event.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>{event.date}</span>
                        <span>{event.time}</span>
                        <span>by {event.user}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}