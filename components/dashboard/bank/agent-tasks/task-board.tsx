"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar";
import { Progress } from "@/components/shadcn/progress";
import { MoreHorizontal, MessageSquare, Paperclip, Clock, Flag } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";

type Task = {
  id: string;
  title: string;
  description?: string;
  status: 'in_queue' | 'on_progress' | 'blocked' | 'complete';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  assignee?: {
    id: string;
    name: string;
    image?: string;
  };
  dueDate?: string;
  progressPercentage: number;
  commentCount: number;
  attachmentCount: number;
  subtaskCount: number;
  completedSubtasks: number;
};

type FilterState = {
  assignee: string | null;
  priority: string | null;
  status: string | null;
  category: string | null;
};

interface TaskBoardProps {
  dealId: string;
  filters: FilterState;
  searchQuery: string;
  onTaskSelect: (taskId: string) => void;
}

const columns = [
  { id: 'in_queue', title: 'In Queue', color: 'border-blue-200 bg-blue-50' },
  { id: 'on_progress', title: 'On Progress', color: 'border-yellow-200 bg-yellow-50' },
  { id: 'blocked', title: 'Blocked', color: 'border-red-200 bg-red-50' },
  { id: 'complete', title: 'Complete', color: 'border-green-200 bg-green-50' },
];

// Mock data - replace with actual API call
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Review financial statements',
    description: 'Analyze Q3 financial data and prepare summary',
    status: 'in_queue',
    priority: 'high',
    assignee: { id: '1', name: 'John Doe', image: '' },
    dueDate: '2024-01-15',
    progressPercentage: 0,
    commentCount: 3,
    attachmentCount: 2,
    subtaskCount: 5,
    completedSubtasks: 0,
  },
  {
    id: '2',
    title: 'Upload compliance documents',
    description: 'Missing SOX compliance documentation',
    status: 'on_progress',
    priority: 'urgent',
    assignee: { id: '2', name: 'Jane Smith', image: '' },
    dueDate: '2024-01-12',
    progressPercentage: 65,
    commentCount: 1,
    attachmentCount: 0,
    subtaskCount: 3,
    completedSubtasks: 2,
  },
  {
    id: '3',
    title: 'Market analysis report',
    description: 'Comprehensive market research for target industry',
    status: 'blocked',
    priority: 'normal',
    assignee: { id: '3', name: 'Mike Johnson', image: '' },
    dueDate: '2024-01-20',
    progressPercentage: 30,
    commentCount: 5,
    attachmentCount: 1,
    subtaskCount: 4,
    completedSubtasks: 1,
  },
  {
    id: '4',
    title: 'Due diligence checklist',
    description: 'Complete all due diligence requirements',
    status: 'complete',
    priority: 'high',
    assignee: { id: '1', name: 'John Doe', image: '' },
    dueDate: '2024-01-10',
    progressPercentage: 100,
    commentCount: 8,
    attachmentCount: 3,
    subtaskCount: 6,
    completedSubtasks: 6,
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

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return <Flag className="h-3 w-3 text-red-600" />;
    case 'high':
      return <Flag className="h-3 w-3 text-orange-600" />;
    default:
      return null;
  }
};

const TaskCard = ({ task, onSelect }: { task: Task; onSelect: (taskId: string) => void }) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'complete';
  
  return (
    <Card className="mb-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => onSelect(task.id)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {getPriorityIcon(task.priority)}
            <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit Task</DropdownMenuItem>
              <DropdownMenuItem>Assign</DropdownMenuItem>
              <DropdownMenuItem>Mark Complete</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardTitle className="text-sm font-medium leading-tight">
          {task.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}
        
        {task.subtaskCount > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">
                Subtasks ({task.completedSubtasks}/{task.subtaskCount})
              </span>
              <span className="text-muted-foreground">
                {task.progressPercentage}%
              </span>
            </div>
            <Progress value={task.progressPercentage} className="h-1" />
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {task.assignee && (
              <Avatar className="h-6 w-6">
                <AvatarImage src={task.assignee.image} />
                <AvatarFallback className="text-xs">
                  {task.assignee.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            )}
            
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              {task.commentCount > 0 && (
                <div className="flex items-center space-x-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{task.commentCount}</span>
                </div>
              )}
              {task.attachmentCount > 0 && (
                <div className="flex items-center space-x-1">
                  <Paperclip className="h-3 w-3" />
                  <span>{task.attachmentCount}</span>
                </div>
              )}
            </div>
          </div>

          {task.dueDate && (
            <div className={`flex items-center space-x-1 text-xs ${
              isOverdue ? 'text-red-600' : 'text-muted-foreground'
            }`}>
              <Clock className="h-3 w-3" />
              <span>
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export function TaskBoard({ dealId, filters, searchQuery, onTaskSelect }: TaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  
  // Filter tasks based on filters and search query
  const filteredTasks = tasks.filter(task => {
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
    return true;
  });

  return (
    <div className="grid grid-cols-4 gap-4 h-[calc(100vh-300px)]">
      {columns.map(column => {
        const columnTasks = filteredTasks.filter(task => task.status === column.id);
        
        return (
          <div key={column.id} className="flex flex-col">
            <div className={`p-3 rounded-t-lg border-t border-x ${column.color}`}>
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">{column.title}</h3>
                <Badge variant="secondary" className="text-xs">
                  {columnTasks.length}
                </Badge>
              </div>
            </div>
            
            <div className="flex-1 p-3 border-x border-b border-gray-200 rounded-b-lg bg-white overflow-y-auto">
              {columnTasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onSelect={onTaskSelect}
                />
              ))}
              
              {columnTasks.length === 0 && (
                <div className="text-center text-muted-foreground text-sm py-8">
                  No tasks in this column
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}