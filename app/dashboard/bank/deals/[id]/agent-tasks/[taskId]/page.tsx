"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/shadcn/button";
import { Badge } from "@/components/shadcn/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar";
import { Progress } from "@/components/shadcn/progress";
import { Textarea } from "@/components/shadcn/textarea";
import { Input } from "@/components/shadcn/input";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { Separator } from "@/components/shadcn/separator";
import {
  ArrowLeft,
  Calendar,
  User,
  Flag,
  MessageSquare,
  Paperclip,
  Clock,
  CheckSquare,
  MoreHorizontal,
  Send,
  Upload,
  Bot,
  Lightbulb,
  Download,
  Eye,
  Edit,
  Save,
  X,
} from "lucide-react";
import Link from "next/link";

type Task = {
  id: string;
  title: string;
  description: string;
  status: 'in_queue' | 'on_progress' | 'blocked' | 'complete';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  category: 'required' | 'recommended' | 'optional';
  assignee?: {
    id: string;
    name: string;
    image?: string;
    email: string;
  };
  createdBy: {
    id: string;
    name: string;
    image?: string;
  };
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  progressPercentage: number;
  isAiGenerated: boolean;
};

// Mock data - would be fetched from API
const mockTask: Task = {
  id: '1',
  title: 'Review financial statements',
  description: 'Analyze Q3 financial data and prepare comprehensive summary for stakeholders. This includes reviewing balance sheets, income statements, and cash flow analysis.',
  status: 'on_progress',
  priority: 'high',
  category: 'required',
  assignee: { 
    id: '1', 
    name: 'John Doe', 
    image: '', 
    email: 'john.doe@company.com' 
  },
  createdBy: { 
    id: 'ai', 
    name: 'AI Agent', 
    image: '' 
  },
  dueDate: '2024-01-15',
  createdAt: '2024-01-08',
  updatedAt: '2024-01-10',
  progressPercentage: 65,
  isAiGenerated: true,
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'normal':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'low':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'complete':
      return 'bg-green-100 text-green-800';
    case 'on_progress':
      return 'bg-yellow-100 text-yellow-800';
    case 'blocked':
      return 'bg-red-100 text-red-800';
    case 'in_queue':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function TaskDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const dealId = params.id as string;
  const taskId = params.taskId as string;
  
  const [task, setTask] = useState<Task>(mockTask);
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    title: task.title,
    description: task.description,
  });

  const handleSave = () => {
    setTask(prev => ({
      ...prev,
      title: editValues.title,
      description: editValues.description,
    }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValues({
      title: task.title,
      description: task.description,
    });
    setIsEditing(false);
  };

  const handleStatusChange = (newStatus: string) => {
    setTask(prev => ({ ...prev, status: newStatus as Task['status'] }));
  };

  const handlePriorityChange = (newPriority: string) => {
    setTask(prev => ({ ...prev, priority: newPriority as Task['priority'] }));
  };

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
            <h1 className="text-2xl font-semibold tracking-tight">Task Details</h1>
            <p className="text-sm text-muted-foreground">
              Created on {new Date(task.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!isEditing ? (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Task
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Duplicate Task</DropdownMenuItem>
              <DropdownMenuItem>Export</DropdownMenuItem>
              <DropdownMenuItem>Share</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Delete Task</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  {isEditing ? (
                    <Input
                      value={editValues.title}
                      onChange={(e) => setEditValues(prev => ({ ...prev, title: e.target.value }))}
                      className="text-xl font-semibold"
                    />
                  ) : (
                    <CardTitle className="text-xl">{task.title}</CardTitle>
                  )}
                  <div className="flex items-center space-x-2">
                    {task.isAiGenerated && (
                      <Badge variant="outline" className="text-xs">
                        <Bot className="mr-1 h-3 w-3" />
                        AI Generated
                      </Badge>
                    )}
                    <Badge className={getStatusColor(task.status)}>
                      {task.status.replace('_', ' ')}
                    </Badge>
                    <Badge className={getPriorityColor(task.priority)}>
                      <Flag className="mr-1 h-3 w-3" />
                      {task.priority}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <Textarea
                  value={editValues.description}
                  onChange={(e) => setEditValues(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="resize-none"
                />
              ) : (
                <p className="text-muted-foreground leading-relaxed">
                  {task.description}
                </p>
              )}

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
                  <span>{task.progressPercentage}%</span>
                </div>
                <Progress value={task.progressPercentage} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Subtasks, Comments, etc. would go here */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="subtasks" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="subtasks">Subtasks</TabsTrigger>
                  <TabsTrigger value="comments">Comments</TabsTrigger>
                  <TabsTrigger value="activities">Activities</TabsTrigger>
                  <TabsTrigger value="attachments">Attachments</TabsTrigger>
                </TabsList>
                
                <TabsContent value="subtasks">
                  <div className="text-center text-muted-foreground py-8">
                    Subtask management would be implemented here
                  </div>
                </TabsContent>
                
                <TabsContent value="comments">
                  <div className="text-center text-muted-foreground py-8">
                    Comment system would be implemented here
                  </div>
                </TabsContent>
                
                <TabsContent value="activities">
                  <div className="text-center text-muted-foreground py-8">
                    Activity timeline would be implemented here
                  </div>
                </TabsContent>
                
                <TabsContent value="attachments">
                  <div className="text-center text-muted-foreground py-8">
                    File attachments would be implemented here
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select value={task.status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_queue">In Queue</SelectItem>
                  <SelectItem value="on_progress">On Progress</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                  <SelectItem value="complete">Complete</SelectItem>
                </SelectContent>
              </Select>

              <Select value={task.priority} onValueChange={handlePriorityChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="normal">Normal Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>

              <Button className="w-full" variant="outline">
                <User className="mr-2 h-4 w-4" />
                Reassign Task
              </Button>

              <Button className="w-full" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Change Due Date
              </Button>
            </CardContent>
          </Card>

          {/* Assignee Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Assignee</CardTitle>
            </CardHeader>
            <CardContent>
              {task.assignee ? (
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={task.assignee.image} />
                    <AvatarFallback>
                      {task.assignee.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{task.assignee.name}</div>
                    <div className="text-sm text-muted-foreground">{task.assignee.email}</div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  No assignee set
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Created</span>
                <span>{new Date(task.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Updated</span>
                <span>{new Date(task.updatedAt).toLocaleDateString()}</span>
              </div>
              {task.dueDate && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Due Date</span>
                  <span className={new Date(task.dueDate) < new Date() ? 'text-red-600' : ''}>
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Created By</span>
                <span>{task.createdBy.name}</span>
              </div>
            </CardContent>
          </Card>

          {/* AI Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <Lightbulb className="mr-2 h-4 w-4" />
                AI Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm p-2 bg-blue-50 rounded border">
                  Consider adding cash flow analysis to strengthen the review
                </div>
                <div className="text-sm p-2 bg-blue-50 rounded border">
                  Request industry benchmarks for comparison
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}