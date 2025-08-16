"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/shadcn/card";
import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar";
import { Progress } from "@/components/shadcn/progress";
import { Checkbox } from "@/components/shadcn/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import { 
  MoreHorizontal, 
  MessageSquare, 
  Paperclip, 
  Clock, 
  Flag,
  ArrowUpDown,
  Filter
} from "lucide-react";

type Task = {
  id: string;
  title: string;
  description?: string;
  status: 'in_queue' | 'on_progress' | 'blocked' | 'complete';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  category: 'required' | 'recommended' | 'optional';
  assignee?: {
    id: string;
    name: string;
    image?: string;
  };
  createdBy: {
    id: string;
    name: string;
  };
  dueDate?: string;
  createdAt: string;
  progressPercentage: number;
  commentCount: number;
  attachmentCount: number;
  subtaskCount: number;
  completedSubtasks: number;
  isAiGenerated: boolean;
};

type FilterState = {
  assignee: string | null;
  priority: string | null;
  status: string | null;
  category: string | null;
};

type SortField = 'title' | 'priority' | 'dueDate' | 'createdAt' | 'status';
type SortDirection = 'asc' | 'desc';

interface TaskListProps {
  dealId: string;
  filters: FilterState;
  searchQuery: string;
  onTaskSelect: (taskId: string) => void;
}

// Mock data
const mockListTasks: Task[] = [
  {
    id: '1',
    title: 'Review financial statements',
    description: 'Analyze Q3 financial data and prepare summary',
    status: 'in_queue',
    priority: 'high',
    category: 'required',
    assignee: { id: '1', name: 'John Doe', image: '' },
    createdBy: { id: 'ai', name: 'AI Agent' },
    dueDate: '2024-01-15',
    createdAt: '2024-01-08',
    progressPercentage: 0,
    commentCount: 3,
    attachmentCount: 2,
    subtaskCount: 5,
    completedSubtasks: 0,
    isAiGenerated: true,
  },
  {
    id: '2',
    title: 'Upload compliance documents',
    description: 'Missing SOX compliance documentation',
    status: 'on_progress',
    priority: 'urgent',
    category: 'required',
    assignee: { id: '2', name: 'Jane Smith', image: '' },
    createdBy: { id: '1', name: 'John Doe' },
    dueDate: '2024-01-12',
    createdAt: '2024-01-07',
    progressPercentage: 65,
    commentCount: 1,
    attachmentCount: 0,
    subtaskCount: 3,
    completedSubtasks: 2,
    isAiGenerated: false,
  },
  {
    id: '3',
    title: 'Market analysis report',
    description: 'Comprehensive market research for target industry',
    status: 'blocked',
    priority: 'normal',
    category: 'recommended',
    assignee: { id: '3', name: 'Mike Johnson', image: '' },
    createdBy: { id: 'ai', name: 'AI Agent' },
    dueDate: '2024-01-20',
    createdAt: '2024-01-09',
    progressPercentage: 30,
    commentCount: 5,
    attachmentCount: 1,
    subtaskCount: 4,
    completedSubtasks: 1,
    isAiGenerated: true,
  },
  {
    id: '4',
    title: 'Due diligence checklist',
    description: 'Complete all due diligence requirements',
    status: 'complete',
    priority: 'high',
    category: 'required',
    assignee: { id: '1', name: 'John Doe', image: '' },
    createdBy: { id: '2', name: 'Jane Smith' },
    dueDate: '2024-01-10',
    createdAt: '2024-01-05',
    progressPercentage: 100,
    commentCount: 8,
    attachmentCount: 3,
    subtaskCount: 6,
    completedSubtasks: 6,
    isAiGenerated: false,
  },
];

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

export function TaskList({ dealId, filters, searchQuery, onTaskSelect }: TaskListProps) {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Filter and sort tasks
  const filteredAndSortedTasks = mockListTasks
    .filter(task => {
      if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (filters.priority && task.priority !== filters.priority) {
        return false;
      }
      if (filters.status && task.status !== filters.status) {
        return false;
      }
      if (filters.assignee && task.assignee?.id !== filters.assignee) {
        return false;
      }
      if (statusFilter !== 'all' && task.status !== statusFilter) {
        return false;
      }
      if (categoryFilter !== 'all' && task.category !== categoryFilter) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      let aVal, bVal;
      
      switch (sortField) {
        case 'title':
          aVal = a.title.toLowerCase();
          bVal = b.title.toLowerCase();
          break;
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 };
          aVal = priorityOrder[a.priority as keyof typeof priorityOrder];
          bVal = priorityOrder[b.priority as keyof typeof priorityOrder];
          break;
        case 'dueDate':
          aVal = a.dueDate ? new Date(a.dueDate).getTime() : 0;
          bVal = b.dueDate ? new Date(b.dueDate).getTime() : 0;
          break;
        case 'createdAt':
          aVal = new Date(a.createdAt).getTime();
          bVal = new Date(b.createdAt).getTime();
          break;
        case 'status':
          aVal = a.status;
          bVal = b.status;
          break;
        default:
          return 0;
      }
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectTask = (taskId: string) => {
    setSelectedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTasks.length === filteredAndSortedTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(filteredAndSortedTasks.map(task => task.id));
    }
  };

  const isOverdue = (dueDate?: string) => {
    return dueDate && new Date(dueDate) < new Date();
  };

  return (
    <div className="space-y-4">
      {/* List Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="in_queue">In Queue</SelectItem>
              <SelectItem value="on_progress">On Progress</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
              <SelectItem value="complete">Complete</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="required">Required</SelectItem>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="optional">Optional</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selectedTasks.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {selectedTasks.length} selected
            </span>
            <Button variant="outline" size="sm">
              Bulk Edit
            </Button>
            <Button variant="outline" size="sm">
              Mark Complete
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="p-4 text-left">
                    <Checkbox
                      checked={selectedTasks.length === filteredAndSortedTasks.length && filteredAndSortedTasks.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="p-4 text-left">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('title')}
                      className="font-medium"
                    >
                      Task
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </th>
                  <th className="p-4 text-left">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('status')}
                      className="font-medium"
                    >
                      Status
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </th>
                  <th className="p-4 text-left">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('priority')}
                      className="font-medium"
                    >
                      Priority
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </th>
                  <th className="p-4 text-left">Category</th>
                  <th className="p-4 text-left">Assignee</th>
                  <th className="p-4 text-left">Progress</th>
                  <th className="p-4 text-left">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('dueDate')}
                      className="font-medium"
                    >
                      Due Date
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </th>
                  <th className="p-4 text-left">Activity</th>
                  <th className="p-4 text-left"></th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedTasks.map(task => (
                  <tr
                    key={task.id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => onTaskSelect(task.id)}
                  >
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedTasks.includes(task.id)}
                        onCheckedChange={() => handleSelectTask(task.id)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{task.title}</span>
                          {task.isAiGenerated && (
                            <Badge variant="outline" className="text-xs">
                              AI
                            </Badge>
                          )}
                        </div>
                        {task.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusColor(task.status)}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className={getCategoryColor(task.category)}>
                        {task.category}
                      </Badge>
                    </td>
                    <td className="p-4">
                      {task.assignee ? (
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={task.assignee.image} />
                            <AvatarFallback className="text-xs">
                              {task.assignee.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{task.assignee.name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Unassigned</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>{task.progressPercentage}%</span>
                          <span className="text-muted-foreground">
                            {task.completedSubtasks}/{task.subtaskCount}
                          </span>
                        </div>
                        <Progress value={task.progressPercentage} className="h-2 w-20" />
                      </div>
                    </td>
                    <td className="p-4">
                      {task.dueDate && (
                        <div className={`flex items-center space-x-1 text-sm ${
                          isOverdue(task.dueDate) ? 'text-red-600' : 'text-muted-foreground'
                        }`}>
                          <Clock className="h-4 w-4" />
                          <span>
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3 text-muted-foreground">
                        {task.commentCount > 0 && (
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="h-4 w-4" />
                            <span className="text-xs">{task.commentCount}</span>
                          </div>
                        )}
                        {task.attachmentCount > 0 && (
                          <div className="flex items-center space-x-1">
                            <Paperclip className="h-4 w-4" />
                            <span className="text-xs">{task.attachmentCount}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit Task</DropdownMenuItem>
                          <DropdownMenuItem>Assign</DropdownMenuItem>
                          <DropdownMenuItem>Mark Complete</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredAndSortedTasks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No tasks found matching your criteria
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}