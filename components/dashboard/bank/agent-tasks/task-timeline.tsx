"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/shadcn/card";
import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

type Task = {
  id: string;
  title: string;
  status: 'in_queue' | 'on_progress' | 'blocked' | 'complete';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  assignee?: {
    id: string;
    name: string;
    image?: string;
  };
  startDate: string;
  dueDate: string;
  progressPercentage: number;
};

type FilterState = {
  assignee: string | null;
  priority: string | null;
  status: string | null;
  category: string | null;
};

interface TaskTimelineProps {
  dealId: string;
  filters: FilterState;
  searchQuery: string;
  onTaskSelect: (taskId: string) => void;
}

// Mock data
const mockTimelineTasks: Task[] = [
  {
    id: '1',
    title: 'Review financial statements',
    status: 'in_queue',
    priority: 'high',
    assignee: { id: '1', name: 'John Doe', image: '' },
    startDate: '2024-01-10',
    dueDate: '2024-01-15',
    progressPercentage: 0,
  },
  {
    id: '2',
    title: 'Upload compliance documents',
    status: 'on_progress',
    priority: 'urgent',
    assignee: { id: '2', name: 'Jane Smith', image: '' },
    startDate: '2024-01-08',
    dueDate: '2024-01-12',
    progressPercentage: 65,
  },
  {
    id: '3',
    title: 'Market analysis report',
    status: 'blocked',
    priority: 'normal',
    assignee: { id: '3', name: 'Mike Johnson', image: '' },
    startDate: '2024-01-15',
    dueDate: '2024-01-20',
    progressPercentage: 30,
  },
  {
    id: '4',
    title: 'Due diligence checklist',
    status: 'complete',
    priority: 'high',
    assignee: { id: '1', name: 'John Doe', image: '' },
    startDate: '2024-01-05',
    dueDate: '2024-01-10',
    progressPercentage: 100,
  },
  {
    id: '5',
    title: 'Legal document review',
    status: 'in_queue',
    priority: 'normal',
    assignee: { id: '4', name: 'Sarah Wilson', image: '' },
    startDate: '2024-01-18',
    dueDate: '2024-01-25',
    progressPercentage: 0,
  },
];

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

const getStatusColor = (status: string) => {
  switch (status) {
    case 'complete':
      return 'bg-green-500';
    case 'on_progress':
      return 'bg-yellow-500';
    case 'blocked':
      return 'bg-red-500';
    case 'in_queue':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
};

// Generate calendar dates for the timeline
const generateCalendarDates = (startDate: Date, days: number) => {
  const dates = [];
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dates.push(date);
  }
  return dates;
};

// Calculate task position and width
const calculateTaskPosition = (startDate: string, dueDate: string, timelineStart: Date, dayWidth: number) => {
  const taskStart = new Date(startDate);
  const taskEnd = new Date(dueDate);
  
  const startOffset = Math.max(0, Math.floor((taskStart.getTime() - timelineStart.getTime()) / (24 * 60 * 60 * 1000)));
  const duration = Math.ceil((taskEnd.getTime() - taskStart.getTime()) / (24 * 60 * 60 * 1000)) + 1;
  
  return {
    left: startOffset * dayWidth,
    width: Math.max(dayWidth, duration * dayWidth),
  };
};

export function TaskTimeline({ dealId, filters, searchQuery, onTaskSelect }: TaskTimelineProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    return monday;
  });

  const dayWidth = 120;
  const daysToShow = 14; // Show 2 weeks
  const calendarDates = generateCalendarDates(currentWeekStart, daysToShow);

  // Filter tasks
  const filteredTasks = mockTimelineTasks.filter(task => {
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

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(currentWeekStart.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newStart);
  };

  return (
    <div className="space-y-4">
      {/* Timeline Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CalendarDays className="h-5 w-5" />
          <h3 className="text-lg font-medium">Timeline View</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[200px] text-center">
            {currentWeekStart.toLocaleDateString()} - {calendarDates[calendarDates.length - 1].toLocaleDateString()}
          </span>
          <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div style={{ minWidth: dayWidth * daysToShow + 300 }}>
              {/* Calendar Header */}
              <div className="flex border-b">
                <div className="w-[300px] p-4 border-r bg-gray-50 font-medium">
                  Task
                </div>
                {calendarDates.map((date, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 p-2 border-r text-center bg-gray-50"
                    style={{ width: dayWidth }}
                  >
                    <div className="text-xs text-muted-foreground">
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className="text-sm font-medium">
                      {date.getDate()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Task Rows */}
              {filteredTasks.map((task, index) => {
                const taskPosition = calculateTaskPosition(
                  task.startDate,
                  task.dueDate,
                  currentWeekStart,
                  dayWidth
                );

                return (
                  <div key={task.id} className="flex border-b hover:bg-gray-50">
                    {/* Task Info */}
                    <div className="w-[300px] p-4 border-r">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Badge
                            className={`h-2 w-2 rounded-full p-0 ${getStatusColor(task.status)}`}
                          />
                          <span className="text-sm font-medium truncate">
                            {task.title}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {task.assignee && (
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={task.assignee.image} />
                              <AvatarFallback className="text-xs">
                                {task.assignee.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <Badge
                            variant="outline"
                            className={`text-xs ${getPriorityColor(task.priority)} text-white border-none`}
                          >
                            {task.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Timeline Bar */}
                    <div className="relative flex-1 p-4" style={{ width: dayWidth * daysToShow }}>
                      {taskPosition.left >= 0 && taskPosition.left < dayWidth * daysToShow && (
                        <div
                          className="absolute top-1/2 transform -translate-y-1/2 h-6 rounded cursor-pointer transition-all hover:shadow-md"
                          style={{
                            left: Math.max(0, taskPosition.left),
                            width: Math.min(taskPosition.width, dayWidth * daysToShow - Math.max(0, taskPosition.left)),
                          }}
                          onClick={() => onTaskSelect(task.id)}
                        >
                          {/* Background bar */}
                          <div className={`h-full rounded ${getStatusColor(task.status)} opacity-20`} />
                          
                          {/* Progress bar */}
                          <div
                            className={`absolute top-0 h-full rounded ${getStatusColor(task.status)}`}
                            style={{ width: `${task.progressPercentage}%` }}
                          />
                          
                          {/* Task label */}
                          <div className="absolute inset-0 flex items-center px-2">
                            <span className="text-xs font-medium text-white truncate">
                              {task.progressPercentage}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {filteredTasks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No tasks to display in timeline
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex items-center space-x-4 text-sm">
        <div className="flex items-center space-x-1">
          <div className="h-3 w-3 rounded bg-green-500" />
          <span>Complete</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="h-3 w-3 rounded bg-yellow-500" />
          <span>On Progress</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="h-3 w-3 rounded bg-red-500" />
          <span>Blocked</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="h-3 w-3 rounded bg-blue-500" />
          <span>In Queue</span>
        </div>
      </div>
    </div>
  );
}