"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/shadcn/button";
import { Badge } from "@/components/shadcn/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar";
import { Progress } from "@/components/shadcn/progress";
import { Textarea } from "@/components/shadcn/textarea";
import { Input } from "@/components/shadcn/input";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/shadcn/sheet";
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
  X,
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
} from "lucide-react";

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

type Subtask = {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  completedAt?: string;
};

type Comment = {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  content: string;
  createdAt: string;
};

type Activity = {
  id: string;
  userId: string;
  userName: string;
  action: string;
  description: string;
  createdAt: string;
};

type Attachment = {
  id: string;
  name: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  createdAt: string;
};

type AiSuggestion = {
  id: string;
  title: string;
  description: string;
  type: 'next_step' | 'improvement' | 'risk' | 'resource';
};

interface TaskSheetProps {
  taskId: string;
  isOpen: boolean;
  onClose: () => void;
}

// Mock data
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

const mockSubtasks: Subtask[] = [
  {
    id: '1',
    title: 'Download Q3 financial statements',
    description: 'Get latest audited financials from client',
    isCompleted: true,
    completedAt: '2024-01-09',
  },
  {
    id: '2',
    title: 'Analyze balance sheet',
    description: 'Review assets, liabilities, and equity',
    isCompleted: true,
    completedAt: '2024-01-10',
  },
  {
    id: '3',
    title: 'Review income statement',
    description: 'Analyze revenue and expense trends',
    isCompleted: false,
  },
  {
    id: '4',
    title: 'Prepare summary report',
    description: 'Compile findings into executive summary',
    isCompleted: false,
  },
];

const mockComments: Comment[] = [
  {
    id: '1',
    userId: '1',
    userName: 'John Doe',
    userImage: '',
    content: 'I\'ve completed the balance sheet analysis. Found some interesting trends in the liability structure.',
    createdAt: '2024-01-10T10:30:00Z',
  },
  {
    id: '2',
    userId: '2',
    userName: 'Jane Smith',
    userImage: '',
    content: 'Great progress! Let me know if you need help with the income statement review.',
    createdAt: '2024-01-10T14:15:00Z',
  },
];

const mockActivities: Activity[] = [
  {
    id: '1',
    userId: '1',
    userName: 'John Doe',
    action: 'completed_subtask',
    description: 'completed "Download Q3 financial statements"',
    createdAt: '2024-01-09T16:20:00Z',
  },
  {
    id: '2',
    userId: '1',
    userName: 'John Doe',
    action: 'updated_progress',
    description: 'updated progress to 65%',
    createdAt: '2024-01-10T11:45:00Z',
  },
  {
    id: '3',
    userId: 'ai',
    userName: 'AI Agent',
    action: 'suggested_improvement',
    description: 'suggested focusing on cash flow analysis',
    createdAt: '2024-01-10T09:30:00Z',
  },
];

const mockAttachments: Attachment[] = [
  {
    id: '1',
    name: 'Q3_Financial_Statements.pdf',
    fileSize: 2547000,
    mimeType: 'application/pdf',
    uploadedBy: 'John Doe',
    createdAt: '2024-01-09T10:00:00Z',
  },
  {
    id: '2',
    name: 'Balance_Sheet_Analysis.xlsx',
    fileSize: 890000,
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    uploadedBy: 'John Doe',
    createdAt: '2024-01-10T15:30:00Z',
  },
];

const mockAiSuggestions: AiSuggestion[] = [
  {
    id: '1',
    title: 'Focus on Cash Flow Analysis',
    description: 'Consider adding detailed cash flow analysis to strengthen the financial review.',
    type: 'next_step',
  },
  {
    id: '2',
    title: 'Request Industry Benchmarks',
    description: 'Compare financial ratios against industry standards for better context.',
    type: 'improvement',
  },
  {
    id: '3',
    title: 'Potential Risk: Debt-to-Equity Ratio',
    description: 'The current debt-to-equity ratio seems higher than industry average.',
    type: 'risk',
  },
];

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

export function TaskSheet({ taskId, isOpen, onClose }: TaskSheetProps) {
  const [task, setTask] = useState<Task>(mockTask);
  const [subtasks, setSubtasks] = useState<Subtask[]>(mockSubtasks);
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [attachments, setAttachments] = useState<Attachment[]>(mockAttachments);
  const [aiSuggestions, setAiSuggestions] = useState<AiSuggestion[]>(mockAiSuggestions);
  const [newComment, setNewComment] = useState('');
  const [newSubtask, setNewSubtask] = useState('');

  const completedSubtasks = subtasks.filter(st => st.isCompleted).length;
  const progressPercentage = subtasks.length > 0 ? Math.round((completedSubtasks / subtasks.length) * 100) : 0;

  const handleSubtaskToggle = (subtaskId: string) => {
    setSubtasks(prev => prev.map(st => 
      st.id === subtaskId 
        ? { 
            ...st, 
            isCompleted: !st.isCompleted, 
            completedAt: !st.isCompleted ? new Date().toISOString() : undefined 
          }
        : st
    ));
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      const newSubtaskObj: Subtask = {
        id: `new-${Date.now()}`,
        title: newSubtask.trim(),
        isCompleted: false,
      };
      setSubtasks(prev => [...prev, newSubtaskObj]);
      setNewSubtask('');
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const newCommentObj: Comment = {
        id: `new-${Date.now()}`,
        userId: 'current-user',
        userName: 'Current User',
        content: newComment.trim(),
        createdAt: new Date().toISOString(),
      };
      setComments(prev => [...prev, newCommentObj]);
      setNewComment('');
    }
  };

  const handleStatusChange = (newStatus: string) => {
    setTask(prev => ({ ...prev, status: newStatus as Task['status'] }));
  };

  const handlePriorityChange = (newPriority: string) => {
    setTask(prev => ({ ...prev, priority: newPriority as Task['priority'] }));
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-[600px] sm:w-[700px] max-w-[90vw] overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="flex items-center space-x-2">
                <SheetTitle className="text-xl">{task.title}</SheetTitle>
                {task.isAiGenerated && (
                  <Badge variant="outline" className="text-xs">
                    <Bot className="mr-1 h-3 w-3" />
                    AI Generated
                  </Badge>
                )}
              </div>
              <SheetDescription className="text-sm">
                Created by {task.createdBy.name} on {new Date(task.createdAt).toLocaleDateString()}
              </SheetDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Header Info */}
          <div className="flex items-center space-x-4">
            <Badge className={getStatusColor(task.status)}>
              {task.status.replace('_', ' ')}
            </Badge>
            <Badge className={getPriorityColor(task.priority)}>
              <Flag className="mr-1 h-3 w-3" />
              {task.priority}
            </Badge>
            {task.dueDate && (
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <Select value={task.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[140px]">
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
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <User className="mr-2 h-4 w-4" />
              Reassign
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit Task</DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuItem>Export</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Assignee and Progress */}
          <div className="space-y-3">
            {task.assignee && (
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={task.assignee.image} />
                  <AvatarFallback>
                    {task.assignee.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-sm">{task.assignee.name}</div>
                  <div className="text-xs text-muted-foreground">{task.assignee.email}</div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{progressPercentage}% ({completedSubtasks}/{subtasks.length} subtasks)</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </div>
        </SheetHeader>

        <Separator className="my-6" />

        <Tabs defaultValue="description" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="comments">
              Comments ({comments.length})
            </TabsTrigger>
            <TabsTrigger value="activities">
              Activities ({activities.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {task.description}
              </p>
            </div>

            {/* Subtasks */}
            <div>
              <h3 className="font-medium mb-3">Subtasks</h3>
              <div className="space-y-2">
                {subtasks.map(subtask => (
                  <div key={subtask.id} className="flex items-start space-x-3 p-2 rounded hover:bg-gray-50">
                    <Checkbox
                      checked={subtask.isCompleted}
                      onCheckedChange={() => handleSubtaskToggle(subtask.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <div className={`text-sm ${subtask.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                        {subtask.title}
                      </div>
                      {subtask.description && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {subtask.description}
                        </div>
                      )}
                      {subtask.completedAt && (
                        <div className="text-xs text-green-600 mt-1">
                          Completed on {new Date(subtask.completedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                <div className="flex items-center space-x-2 mt-3">
                  <Input
                    placeholder="Add new subtask..."
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask()}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={handleAddSubtask}>
                    <CheckSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Attachments */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Attachments ({attachments.length})</h3>
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </Button>
              </div>
              <div className="space-y-2">
                {attachments.map(attachment => (
                  <div key={attachment.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-3">
                      <Paperclip className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">{attachment.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatFileSize(attachment.fileSize)} • Uploaded by {attachment.uploadedBy}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Suggestions */}
            {aiSuggestions.length > 0 && (
              <div>
                <h3 className="font-medium mb-3 flex items-center">
                  <Lightbulb className="mr-2 h-4 w-4" />
                  AI Suggestions
                </h3>
                <div className="space-y-2">
                  {aiSuggestions.map(suggestion => (
                    <div key={suggestion.id} className="p-3 border rounded bg-blue-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="text-sm font-medium">{suggestion.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {suggestion.description}
                          </div>
                        </div>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {suggestion.type.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="comments" className="space-y-4">
            <div className="space-y-4">
              {comments.map(comment => (
                <div key={comment.id} className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.userImage} />
                    <AvatarFallback>
                      {comment.userName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium">{comment.userName}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-end space-x-2">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 resize-none"
                rows={3}
              />
              <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="activities" className="space-y-4">
            <div className="space-y-4">
              {activities.map(activity => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="h-2 w-2 rounded-full bg-blue-500 mt-3" />
                  <div className="flex-1">
                    <div className="text-sm">
                      <span className="font-medium">{activity.userName}</span>
                      <span className="ml-1">{activity.description}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(activity.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}