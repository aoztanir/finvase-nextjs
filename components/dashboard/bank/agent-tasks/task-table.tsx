"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/shadcn/card";
import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar";
import { Checkbox } from "@/components/shadcn/checkbox";
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
import { 
  Save, 
  Edit3, 
  MoreHorizontal, 
  Plus,
  Trash2,
  Calendar,
  User
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
  dueDate?: string;
  progressPercentage: number;
  isAiGenerated: boolean;
};

type FilterState = {
  assignee: string | null;
  priority: string | null;
  status: string | null;
  category: string | null;
};

interface TaskTableProps {
  dealId: string;
  filters: FilterState;
  searchQuery: string;
  onTaskSelect: (taskId: string) => void;
}

// Mock data
const mockTableTasks: Task[] = [
  {
    id: '1',
    title: 'Review financial statements',
    description: 'Analyze Q3 financial data',
    status: 'in_queue',
    priority: 'high',
    category: 'required',
    assignee: { id: '1', name: 'John Doe', image: '' },
    dueDate: '2024-01-15',
    progressPercentage: 0,
    isAiGenerated: true,
  },
  {
    id: '2',
    title: 'Upload compliance documents',
    description: 'SOX compliance docs',
    status: 'on_progress',
    priority: 'urgent',
    category: 'required',
    assignee: { id: '2', name: 'Jane Smith', image: '' },
    dueDate: '2024-01-12',
    progressPercentage: 65,
    isAiGenerated: false,
  },
  {
    id: '3',
    title: 'Market analysis report',
    description: 'Industry research',
    status: 'blocked',
    priority: 'normal',
    category: 'recommended',
    assignee: { id: '3', name: 'Mike Johnson', image: '' },
    dueDate: '2024-01-20',
    progressPercentage: 30,
    isAiGenerated: true,
  },
];

const mockUsers = [
  { id: '1', name: 'John Doe', image: '' },
  { id: '2', name: 'Jane Smith', image: '' },
  { id: '3', name: 'Mike Johnson', image: '' },
  { id: '4', name: 'Sarah Wilson', image: '' },
];

export function TaskTable({ dealId, filters, searchQuery, onTaskSelect }: TaskTableProps) {
  const [tasks, setTasks] = useState<Task[]>(mockTableTasks);
  const [editingCell, setEditingCell] = useState<{ taskId: string; field: string } | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [editValues, setEditValues] = useState<Record<string, any>>({});

  // Filter tasks
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

  const handleEditCell = (taskId: string, field: string, currentValue: any) => {
    setEditingCell({ taskId, field });
    setEditValues({ [`${taskId}-${field}`]: currentValue });
  };

  const handleSaveCell = (taskId: string, field: string) => {
    const key = `${taskId}-${field}`;
    const newValue = editValues[key];
    
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, [field]: newValue } : task
    ));
    
    setEditingCell(null);
    setEditValues(prev => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleCancelEdit = () => {
    setEditingCell(null);
    setEditValues({});
  };

  const handleSelectTask = (taskId: string) => {
    setSelectedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTasks.length === filteredTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(filteredTasks.map(task => task.id));
    }
  };

  const addNewTask = () => {
    const newTask: Task = {
      id: `new-${Date.now()}`,
      title: 'New Task',
      status: 'in_queue',
      priority: 'normal',
      category: 'required',
      progressPercentage: 0,
      isAiGenerated: false,
    };
    setTasks(prev => [...prev, newTask]);
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    setSelectedTasks(prev => prev.filter(id => id !== taskId));
  };

  const bulkDelete = () => {
    setTasks(prev => prev.filter(task => !selectedTasks.includes(task.id)));
    setSelectedTasks([]);
  };

  const renderEditableCell = (task: Task, field: string, value: any, type: 'text' | 'select' | 'date' | 'number' = 'text') => {
    const isEditing = editingCell?.taskId === task.id && editingCell?.field === field;
    const key = `${task.id}-${field}`;

    if (isEditing) {
      switch (type) {
        case 'select':
          let options: { value: string; label: string }[] = [];
          if (field === 'status') {
            options = [
              { value: 'in_queue', label: 'In Queue' },
              { value: 'on_progress', label: 'On Progress' },
              { value: 'blocked', label: 'Blocked' },
              { value: 'complete', label: 'Complete' },
            ];
          } else if (field === 'priority') {
            options = [
              { value: 'low', label: 'Low' },
              { value: 'normal', label: 'Normal' },
              { value: 'high', label: 'High' },
              { value: 'urgent', label: 'Urgent' },
            ];
          } else if (field === 'category') {
            options = [
              { value: 'required', label: 'Required' },
              { value: 'recommended', label: 'Recommended' },
              { value: 'optional', label: 'Optional' },
            ];
          }
          
          return (
            <div className="flex items-center space-x-1">
              <Select
                value={editValues[key] || value}
                onValueChange={(newValue) => setEditValues(prev => ({ ...prev, [key]: newValue }))}
              >
                <SelectTrigger className="w-[120px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {options.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleSaveCell(task.id, field)}
                className="h-6 w-6 p-0"
              >
                <Save className="h-3 w-3" />
              </Button>
            </div>
          );
        
        case 'date':
          return (
            <div className="flex items-center space-x-1">
              <Input
                type="date"
                value={editValues[key] || value}
                onChange={(e) => setEditValues(prev => ({ ...prev, [key]: e.target.value }))}
                className="w-[140px] h-8"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleSaveCell(task.id, field)}
                className="h-6 w-6 p-0"
              >
                <Save className="h-3 w-3" />
              </Button>
            </div>
          );
        
        case 'number':
          return (
            <div className="flex items-center space-x-1">
              <Input
                type="number"
                min="0"
                max="100"
                value={editValues[key] || value}
                onChange={(e) => setEditValues(prev => ({ ...prev, [key]: parseInt(e.target.value) }))}
                className="w-[80px] h-8"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleSaveCell(task.id, field)}
                className="h-6 w-6 p-0"
              >
                <Save className="h-3 w-3" />
              </Button>
            </div>
          );
        
        default:
          return (
            <div className="flex items-center space-x-1">
              <Input
                value={editValues[key] || value}
                onChange={(e) => setEditValues(prev => ({ ...prev, [key]: e.target.value }))}
                className="h-8"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleSaveCell(task.id, field)}
                className="h-6 w-6 p-0"
              >
                <Save className="h-3 w-3" />
              </Button>
            </div>
          );
      }
    }

    return (
      <div 
        className="group flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
        onClick={() => handleEditCell(task.id, field, value)}
      >
        <span>{value || '-'}</span>
        <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-100" />
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Table Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={addNewTask}>
            <Plus className="mr-2 h-4 w-4" />
            Add Row
          </Button>
          
          {selectedTasks.length > 0 && (
            <Button variant="outline" size="sm" onClick={bulkDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected ({selectedTasks.length})
            </Button>
          )}
        </div>

        <div className="text-sm text-muted-foreground">
          {filteredTasks.length} tasks • Click any cell to edit
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="p-4 w-[50px]">
                    <Checkbox
                      checked={selectedTasks.length === filteredTasks.length && filteredTasks.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="p-4 text-left font-medium">Title</th>
                  <th className="p-4 text-left font-medium">Description</th>
                  <th className="p-4 text-left font-medium">Status</th>
                  <th className="p-4 text-left font-medium">Priority</th>
                  <th className="p-4 text-left font-medium">Category</th>
                  <th className="p-4 text-left font-medium">Assignee</th>
                  <th className="p-4 text-left font-medium">Due Date</th>
                  <th className="p-4 text-left font-medium">Progress %</th>
                  <th className="p-4 text-left font-medium">Type</th>
                  <th className="p-4 w-[50px]"></th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map(task => (
                  <tr key={task.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <Checkbox
                        checked={selectedTasks.includes(task.id)}
                        onCheckedChange={() => handleSelectTask(task.id)}
                      />
                    </td>
                    
                    <td className="p-4 min-w-[200px]">
                      {renderEditableCell(task, 'title', task.title)}
                    </td>
                    
                    <td className="p-4 min-w-[200px]">
                      {renderEditableCell(task, 'description', task.description)}
                    </td>
                    
                    <td className="p-4">
                      {editingCell?.taskId === task.id && editingCell?.field === 'status' ? (
                        renderEditableCell(task, 'status', task.status, 'select')
                      ) : (
                        <div onClick={() => handleEditCell(task.id, 'status', task.status)}>
                          <Badge className={`cursor-pointer ${
                            task.status === 'complete' ? 'bg-green-100 text-green-800' :
                            task.status === 'on_progress' ? 'bg-yellow-100 text-yellow-800' :
                            task.status === 'blocked' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {task.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      )}
                    </td>
                    
                    <td className="p-4">
                      {editingCell?.taskId === task.id && editingCell?.field === 'priority' ? (
                        renderEditableCell(task, 'priority', task.priority, 'select')
                      ) : (
                        <div onClick={() => handleEditCell(task.id, 'priority', task.priority)}>
                          <Badge className={`cursor-pointer ${
                            task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                            task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            task.priority === 'normal' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {task.priority}
                          </Badge>
                        </div>
                      )}
                    </td>
                    
                    <td className="p-4">
                      {editingCell?.taskId === task.id && editingCell?.field === 'category' ? (
                        renderEditableCell(task, 'category', task.category, 'select')
                      ) : (
                        <div onClick={() => handleEditCell(task.id, 'category', task.category)}>
                          <Badge variant="outline" className="cursor-pointer">
                            {task.category}
                          </Badge>
                        </div>
                      )}
                    </td>
                    
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {task.assignee ? (
                          <>
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={task.assignee.image} />
                              <AvatarFallback className="text-xs">
                                {task.assignee.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{task.assignee.name}</span>
                          </>
                        ) : (
                          <Button variant="ghost" size="sm" className="h-6 text-muted-foreground">
                            <User className="mr-1 h-3 w-3" />
                            Assign
                          </Button>
                        )}
                      </div>
                    </td>
                    
                    <td className="p-4">
                      {editingCell?.taskId === task.id && editingCell?.field === 'dueDate' ? (
                        renderEditableCell(task, 'dueDate', task.dueDate, 'date')
                      ) : (
                        <div 
                          className="flex items-center space-x-1 cursor-pointer hover:bg-gray-100 p-1 rounded"
                          onClick={() => handleEditCell(task.id, 'dueDate', task.dueDate)}
                        >
                          <Calendar className="h-3 w-3" />
                          <span className="text-sm">
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Set date'}
                          </span>
                        </div>
                      )}
                    </td>
                    
                    <td className="p-4">
                      {renderEditableCell(task, 'progressPercentage', task.progressPercentage, 'number')}
                    </td>
                    
                    <td className="p-4">
                      <Badge variant={task.isAiGenerated ? "default" : "outline"} className="text-xs">
                        {task.isAiGenerated ? 'AI' : 'Manual'}
                      </Badge>
                    </td>
                    
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onTaskSelect(task.id)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => deleteTask(task.id)}
                            className="text-red-600"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredTasks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No tasks found. Click "Add Row" to create a new task.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}