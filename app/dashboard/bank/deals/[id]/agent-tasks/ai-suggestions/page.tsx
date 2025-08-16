"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/shadcn/button";
import { Badge } from "@/components/shadcn/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import {
  ArrowLeft,
  Bot,
  CheckCircle,
  XCircle,
  Clock,
  Flag,
  FileText,
  TrendingUp,
  Users,
  AlertTriangle,
  Lightbulb,
  Filter,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

type AiSuggestion = {
  id: string;
  title: string;
  description: string;
  category: 'required' | 'recommended' | 'optional';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  type: 'document' | 'analysis' | 'compliance' | 'communication' | 'workflow';
  estimatedDuration: string;
  suggestedAssignee?: string;
  reasoning: string;
  isAccepted: boolean;
  isDismissed: boolean;
  createdAt: string;
};

// Mock data
const mockSuggestions: AiSuggestion[] = [
  {
    id: '1',
    title: 'Upload audited financial statements for FY2023',
    description: 'The deal requires comprehensive financial documentation. Latest audited statements are missing from the data room.',
    category: 'required',
    priority: 'urgent',
    type: 'document',
    estimatedDuration: '30 minutes',
    suggestedAssignee: 'John Doe',
    reasoning: 'Required for due diligence process. Most investors will request this within 24-48 hours.',
    isAccepted: false,
    isDismissed: false,
    createdAt: '2024-01-10T09:00:00Z',
  },
  {
    id: '2',
    title: 'Draft market overview for pitch deck',
    description: 'Create a comprehensive market analysis section covering industry trends, competitive landscape, and market size.',
    category: 'recommended',
    priority: 'high',
    type: 'analysis',
    estimatedDuration: '2-3 hours',
    suggestedAssignee: 'Sarah Wilson',
    reasoning: 'Market analysis strengthens the investment thesis and demonstrates thorough preparation.',
    isAccepted: false,
    isDismissed: false,
    createdAt: '2024-01-10T10:30:00Z',
  },
  {
    id: '3',
    title: 'Review compliance with SOX requirements',
    description: 'Conduct thorough review of Sarbanes-Oxley compliance documentation and internal controls.',
    category: 'required',
    priority: 'high',
    type: 'compliance',
    estimatedDuration: '1-2 days',
    suggestedAssignee: 'Mike Johnson',
    reasoning: 'Critical for regulatory compliance. Non-compliance could derail the transaction.',
    isAccepted: true,
    isDismissed: false,
    createdAt: '2024-01-09T14:15:00Z',
  },
  {
    id: '4',
    title: 'Schedule investor Q&A session',
    description: 'Organize a virtual Q&A session with key stakeholders to address investor questions proactively.',
    category: 'recommended',
    priority: 'normal',
    type: 'communication',
    estimatedDuration: '1 hour setup',
    suggestedAssignee: 'Jane Smith',
    reasoning: 'Proactive communication builds investor confidence and reduces back-and-forth emails.',
    isAccepted: false,
    isDismissed: false,
    createdAt: '2024-01-10T11:45:00Z',
  },
  {
    id: '5',
    title: 'Optimize data room folder structure',
    description: 'Reorganize data room documents into standardized categories for easier investor navigation.',
    category: 'optional',
    priority: 'low',
    type: 'workflow',
    estimatedDuration: '45 minutes',
    reasoning: 'Improved organization enhances user experience and demonstrates professionalism.',
    isAccepted: false,
    isDismissed: true,
    createdAt: '2024-01-09T16:20:00Z',
  },
  {
    id: '6',
    title: 'Conduct sensitivity analysis on financial projections',
    description: 'Perform scenario analysis on financial models to demonstrate robustness of projections.',
    category: 'recommended',
    priority: 'normal',
    type: 'analysis',
    estimatedDuration: '4-6 hours',
    suggestedAssignee: 'John Doe',
    reasoning: 'Sensitivity analysis addresses potential investor concerns about projection reliability.',
    isAccepted: false,
    isDismissed: false,
    createdAt: '2024-01-10T13:00:00Z',
  },
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'required':
      return 'bg-red-100 text-red-800';
    case 'recommended':
      return 'bg-orange-100 text-orange-800';
    case 'optional':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return 'bg-red-500';
    case 'high':
      return 'bg-orange-500';
    case 'normal':
      return 'bg-blue-500';
    case 'low':
      return 'bg-gray-500';
    default:
      return 'bg-gray-500';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'document':
      return <FileText className="h-4 w-4" />;
    case 'analysis':
      return <TrendingUp className="h-4 w-4" />;
    case 'compliance':
      return <AlertTriangle className="h-4 w-4" />;
    case 'communication':
      return <Users className="h-4 w-4" />;
    case 'workflow':
      return <RefreshCw className="h-4 w-4" />;
    default:
      return <Lightbulb className="h-4 w-4" />;
  }
};

export default function AiSuggestionsPage() {
  const params = useParams();
  const dealId = params.id as string;
  
  const [suggestions, setSuggestions] = useState<AiSuggestion[]>(mockSuggestions);
  const [activeTab, setActiveTab] = useState('pending');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const handleAccept = (suggestionId: string) => {
    setSuggestions(prev => prev.map(s => 
      s.id === suggestionId ? { ...s, isAccepted: true, isDismissed: false } : s
    ));
  };

  const handleDismiss = (suggestionId: string) => {
    setSuggestions(prev => prev.map(s => 
      s.id === suggestionId ? { ...s, isDismissed: true, isAccepted: false } : s
    ));
  };

  const filteredSuggestions = suggestions.filter(suggestion => {
    // Filter by tab
    if (activeTab === 'pending' && (suggestion.isAccepted || suggestion.isDismissed)) return false;
    if (activeTab === 'accepted' && !suggestion.isAccepted) return false;
    if (activeTab === 'dismissed' && !suggestion.isDismissed) return false;

    // Filter by category
    if (filterCategory !== 'all' && suggestion.category !== filterCategory) return false;
    
    // Filter by priority
    if (filterPriority !== 'all' && suggestion.priority !== filterPriority) return false;
    
    // Filter by type
    if (filterType !== 'all' && suggestion.type !== filterType) return false;

    return true;
  });

  const pendingCount = suggestions.filter(s => !s.isAccepted && !s.isDismissed).length;
  const acceptedCount = suggestions.filter(s => s.isAccepted).length;
  const dismissedCount = suggestions.filter(s => s.isDismissed).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/bank/deals/${dealId}/agent-tasks`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tasks
            </Link>
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight flex items-center">
              <Bot className="mr-2 h-6 w-6" />
              AI Task Suggestions
            </h1>
            <p className="text-sm text-muted-foreground">
              AI-generated task recommendations based on deal progress and requirements
            </p>
          </div>
        </div>
        <Button>
          <RefreshCw className="mr-2 h-4 w-4" />
          Generate New Suggestions
        </Button>
      </div>

      {/* Stats */}
      <div className="flex items-center space-x-4">
        <Badge variant="outline" className="text-sm">
          Total: {suggestions.length}
        </Badge>
        <Badge variant="outline" className="text-sm bg-blue-50 text-blue-700">
          Pending: {pendingCount}
        </Badge>
        <Badge variant="outline" className="text-sm bg-green-50 text-green-700">
          Accepted: {acceptedCount}
        </Badge>
        <Badge variant="outline" className="text-sm bg-gray-50 text-gray-700">
          Dismissed: {dismissedCount}
        </Badge>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <Filter className="h-4 w-4" />
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="required">Required</SelectItem>
            <SelectItem value="recommended">Recommended</SelectItem>
            <SelectItem value="optional">Optional</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="document">Document</SelectItem>
            <SelectItem value="analysis">Analysis</SelectItem>
            <SelectItem value="compliance">Compliance</SelectItem>
            <SelectItem value="communication">Communication</SelectItem>
            <SelectItem value="workflow">Workflow</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Suggestions */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-fit grid-cols-3">
          <TabsTrigger value="pending">
            Pending ({pendingCount})
          </TabsTrigger>
          <TabsTrigger value="accepted">
            Accepted ({acceptedCount})
          </TabsTrigger>
          <TabsTrigger value="dismissed">
            Dismissed ({dismissedCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {filteredSuggestions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No pending suggestions</h3>
                <p className="text-muted-foreground">
                  All AI suggestions have been reviewed. Generate new suggestions to see more recommendations.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredSuggestions.map(suggestion => (
                <Card key={suggestion.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(suggestion.type)}
                          <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getCategoryColor(suggestion.category)}>
                            {suggestion.category}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <div className={`h-2 w-2 rounded-full ${getPriorityColor(suggestion.priority)}`} />
                            <span className="text-sm text-muted-foreground">{suggestion.priority} priority</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{suggestion.estimatedDuration}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDismiss(suggestion.id)}
                        >
                          <XCircle className="mr-1 h-4 w-4" />
                          Dismiss
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleAccept(suggestion.id)}
                        >
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Accept
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-muted-foreground">{suggestion.description}</p>
                    
                    {suggestion.suggestedAssignee && (
                      <div className="text-sm">
                        <span className="font-medium">Suggested assignee:</span> {suggestion.suggestedAssignee}
                      </div>
                    )}
                    
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-blue-900 mb-1">AI Reasoning:</div>
                      <div className="text-sm text-blue-800">{suggestion.reasoning}</div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Suggested {new Date(suggestion.createdAt).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="accepted" className="space-y-4">
          {filteredSuggestions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                <h3 className="text-lg font-medium mb-2">No accepted suggestions</h3>
                <p className="text-muted-foreground">
                  Suggestions you accept will appear here and be converted to tasks.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredSuggestions.map(suggestion => (
                <Card key={suggestion.id} className="border-green-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Accepted
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">{suggestion.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="dismissed" className="space-y-4">
          {filteredSuggestions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <XCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No dismissed suggestions</h3>
                <p className="text-muted-foreground">
                  Suggestions you dismiss will appear here for reference.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredSuggestions.map(suggestion => (
                <Card key={suggestion.id} className="border-gray-200 opacity-75">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-2">
                      <XCircle className="h-5 w-5 text-gray-400" />
                      <CardTitle className="text-lg text-gray-600">{suggestion.title}</CardTitle>
                      <Badge variant="outline" className="bg-gray-50 text-gray-600">
                        Dismissed
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">{suggestion.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}