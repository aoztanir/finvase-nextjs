'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card"
import { Button } from "@/components/shadcn/button"
import { Badge } from "@/components/shadcn/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs"

export default function DealCIMPage() {
  const cimSections = [
    {
      id: "executive-summary",
      title: "Executive Summary",
      status: "completed",
      lastUpdated: "2024-01-15",
      content: "Complete overview of the company, investment opportunity, and key highlights."
    },
    {
      id: "company-overview", 
      title: "Company Overview",
      status: "completed",
      lastUpdated: "2024-01-14",
      content: "Detailed company background, history, and organizational structure."
    },
    {
      id: "market-analysis",
      title: "Market Analysis",
      status: "in-progress",
      lastUpdated: "2024-01-12",
      content: "Market size, competitive landscape, and growth opportunities."
    },
    {
      id: "financials",
      title: "Financial Information",
      status: "completed",
      lastUpdated: "2024-01-10",
      content: "Historical financials, projections, and key financial metrics."
    },
    {
      id: "management",
      title: "Management Team",
      status: "pending",
      lastUpdated: "2024-01-08",
      content: "Leadership profiles, organizational chart, and key personnel."
    },
    {
      id: "investment-thesis",
      title: "Investment Thesis",
      status: "draft",
      lastUpdated: "2024-01-05",
      content: "Value proposition, growth strategy, and investment rationale."
    }
  ]

  const cimVersions = [
    { version: "v2.1", date: "2024-01-15", status: "current", downloadCount: 24 },
    { version: "v2.0", date: "2024-01-10", status: "archived", downloadCount: 18 },
    { version: "v1.5", date: "2024-01-05", status: "archived", downloadCount: 12 },
  ]

  const distributionList = [
    { name: "Venture Capital Fund A", email: "partners@vcfunda.com", accessLevel: "full", lastAccessed: "2024-01-15" },
    { name: "Angel Investor Group", email: "investments@angelgroup.com", accessLevel: "limited", lastAccessed: "2024-01-14" },
    { name: "Strategic Partner Corp", email: "bd@strategicpartner.com", accessLevel: "full", lastAccessed: "2024-01-12" },
    { name: "Family Office Partners", email: "deals@familyoffice.com", accessLevel: "limited", lastAccessed: "2024-01-10" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'current': return 'bg-green-100 text-green-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAccessColor = (level: string) => {
    switch (level) {
      case 'full': return 'bg-blue-100 text-blue-800'
      case 'limited': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold">Confidential Information Memorandum</h3>
          <p className="text-muted-foreground">Manage and distribute your deal CIM</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">Preview CIM</Button>
          <Button>Generate New Version</Button>
        </div>
      </div>

      <Tabs defaultValue="sections" className="w-full">
        <TabsList>
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="versions">Versions</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="sections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>CIM Sections</CardTitle>
              <CardDescription>Track completion status of each CIM section</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cimSections.map((section) => (
                  <div key={section.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="space-y-1">
                      <h4 className="font-medium">{section.title}</h4>
                      <p className="text-sm text-muted-foreground">{section.content}</p>
                      <div className="text-xs text-muted-foreground">Last updated: {section.lastUpdated}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(section.status)} variant="secondary">
                        {section.status}
                      </Badge>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="versions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>CIM Versions</CardTitle>
              <CardDescription>Manage different versions of your CIM</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cimVersions.map((version) => (
                  <div key={version.version} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">Version {version.version}</h4>
                        <Badge className={getStatusColor(version.status)} variant="secondary">
                          {version.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Created: {version.date}</p>
                      <p className="text-xs text-muted-foreground">Downloads: {version.downloadCount}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10l0 6m0 0l4-4m-4 4l-4-4" />
                        </svg>
                        Download
                      </Button>
                      <Button variant="ghost" size="sm">
                        <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                        Share
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribution List</CardTitle>
              <CardDescription>Manage who has access to your CIM</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full">Add New Recipient</Button>
                {distributionList.map((recipient, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-medium">{recipient.name}</h4>
                      <p className="text-sm text-muted-foreground">{recipient.email}</p>
                      <p className="text-xs text-muted-foreground">Last accessed: {recipient.lastAccessed}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getAccessColor(recipient.accessLevel)} variant="secondary">
                        {recipient.accessLevel}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}