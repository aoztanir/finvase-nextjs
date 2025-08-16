"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Textarea } from "@/components/shadcn/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar";
import { Badge } from "@/components/shadcn/badge";
import { Checkbox } from "@/components/shadcn/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/shadcn/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn/popover";
import { Calendar } from "@/components/shadcn/calendar";
import { Label } from "@/components/shadcn/label";
import { Separator } from "@/components/shadcn/separator";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Check,
  ChevronsUpDown,
  User,
  Users,
  Bot,
  Plus,
  X,
  Flag,
  Clock,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

// Mock data
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'Senior Analyst',
    image: '',
    isAvailable: true,
    currentTasks: 3,
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    role: 'Vice President',
    image: '',
    isAvailable: true,
    currentTasks: 5,
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    role: 'Associate',
    image: '',
    isAvailable: false,
    currentTasks: 8,
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@company.com',
    role: 'Director',
    image: '',
    isAvailable: true,
    currentTasks: 2,
  },
  {
    id: 'ai',
    name: 'AI Agent',
    email: 'ai@system',
    role: 'AI Assistant',
    image: '',
    isAvailable: true,
    currentTasks: 0,
  },
];

const mockClients = [
  {
    id: 'client1',
    name: 'Robert Chen',
    email: 'robert.chen@techcorp.com',
    company: 'TechCorp Inc',
    image: '',
  },
  {
    id: 'client2',
    name: 'Lisa Rodriguez',
    email: 'lisa.rodriguez@techcorp.com',
    company: 'TechCorp Inc',
    image: '',
  },
];

type Subtask = {
  id: string;
  title: string;
  description?: string;
};

export default function AssignTaskPage() {
  const params = useParams();
  const router = useRouter();
  const dealId = params.id as string;

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal');
  const [category, setCategory] = useState<'required' | 'recommended' | 'optional'>('required');
  const [assigneeType, setAssigneeType] = useState<'team' | 'client' | 'ai'>('team');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('');
  const [dueDate, setDueDate] = useState<Date>();
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtask, setNewSubtask] = useState('');
  const [sendNotification, setSendNotification] = useState(true);
  const [isUrgent, setIsUrgent] = useState(false);

  // UI state
  const [open, setOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      const subtask: Subtask = {
        id: `subtask-${Date.now()}`,
        title: newSubtask.trim(),
      };
      setSubtasks(prev => [...prev, subtask]);
      setNewSubtask('');
    }
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(prev => prev.filter(st => st.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send the data to your API
    const taskData = {
      title,
      description,
      priority,
      category,
      assigneeType,
      assigneeId: selectedAssignee,
      dueDate,
      subtasks,
      sendNotification,
      dealId,
    };

    console.log('Creating task:', taskData);
    
    // Redirect back to tasks page
    router.push(`/dashboard/bank/deals/${dealId}/agent-tasks`);
  };

  const getAssigneeOptions = () => {
    switch (assigneeType) {
      case 'team':
        return mockUsers.filter(u => u.id !== 'ai');
      case 'client':
        return mockClients;
      case 'ai':
        return mockUsers.filter(u => u.id === 'ai');
      default:
        return [];
    }
  };

  const selectedAssigneeData = getAssigneeOptions().find(u => u.id === selectedAssignee);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/bank/deals/${dealId}/agent-tasks`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tasks
          </Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Create New Task</h1>
          <p className="text-sm text-muted-foreground">
            Assign a new task to team members, clients, or AI agents
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task Details */}
            <Card>
              <CardHeader>
                <CardTitle>Task Details</CardTitle>
                <CardDescription>
                  Provide the basic information about the task
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Task Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter task title..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide detailed task description..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={(value: any) => setCategory(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="required">Required</SelectItem>
                        <SelectItem value="recommended">Recommended</SelectItem>
                        <SelectItem value="optional">Optional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subtasks */}
            <Card>
              <CardHeader>
                <CardTitle>Subtasks</CardTitle>
                <CardDescription>
                  Break down the task into smaller, manageable steps
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {subtasks.map(subtask => (
                    <div key={subtask.id} className="flex items-center space-x-2 p-2 border rounded">
                      <Checkbox defaultChecked={false} />
                      <span className="flex-1">{subtask.title}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSubtask(subtask.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center space-x-2">
                  <Input
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    placeholder="Add a subtask..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask())}
                  />
                  <Button type="button" variant="outline" onClick={handleAddSubtask}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Assignment Panel */}
          <div className="space-y-6">
            {/* Assignee Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Assignment</CardTitle>
                <CardDescription>
                  Choose who will be responsible for this task
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Assign to</Label>
                  <Select value={assigneeType} onValueChange={(value: any) => {
                    setAssigneeType(value);
                    setSelectedAssignee('');
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="team">
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4" />
                          Team Member
                        </div>
                      </SelectItem>
                      <SelectItem value="client">
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          Client
                        </div>
                      </SelectItem>
                      <SelectItem value="ai">
                        <div className="flex items-center">
                          <Bot className="mr-2 h-4 w-4" />
                          AI Agent
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Select {assigneeType === 'team' ? 'Team Member' : assigneeType === 'client' ? 'Client' : 'AI Agent'}</Label>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                      >
                        {selectedAssigneeData
                          ? selectedAssigneeData.name
                          : "Select assignee..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search..." />
                        <CommandEmpty>No assignee found.</CommandEmpty>
                        <CommandList>
                          <CommandGroup>
                            {getAssigneeOptions().map((user) => (
                              <CommandItem
                                key={user.id}
                                value={user.id}
                                onSelect={(currentValue) => {
                                  setSelectedAssignee(currentValue === selectedAssignee ? "" : currentValue);
                                  setOpen(false);
                                }}
                              >
                                <div className="flex items-center space-x-2 flex-1">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={user.image} />
                                    <AvatarFallback>
                                      {user.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="text-sm font-medium">{user.name}</div>
                                    {'role' in user && (
                                      <div className="text-xs text-muted-foreground">{user.role}</div>
                                    )}
                                    {'company' in user && (
                                      <div className="text-xs text-muted-foreground">{user.company}</div>
                                    )}
                                  </div>
                                  {'isAvailable' in user && (
                                    <div className="flex items-center space-x-1">
                                      {user.isAvailable ? (
                                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                                          Available
                                        </Badge>
                                      ) : (
                                        <Badge variant="outline" className="text-xs bg-red-50 text-red-700">
                                          Busy
                                        </Badge>
                                      )}
                                      {'currentTasks' in user && (
                                        <span className="text-xs text-muted-foreground">
                                          {user.currentTasks} tasks
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <Check
                                  className={`ml-2 h-4 w-4 ${
                                    selectedAssignee === user.id ? "opacity-100" : "opacity-0"
                                  }`}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {selectedAssigneeData && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={selectedAssigneeData.image} />
                        <AvatarFallback>
                          {selectedAssigneeData.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">{selectedAssigneeData.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {'role' in selectedAssigneeData && selectedAssigneeData.role}
                          {'company' in selectedAssigneeData && selectedAssigneeData.company}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Due Date */}
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
                <CardDescription>
                  Set when this task should be completed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, "PPP") : "Select due date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={(date) => {
                          setDueDate(date);
                          setShowCalendar(false);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="urgent"
                    checked={isUrgent}
                    onCheckedChange={(checked) => setIsUrgent(checked as boolean)}
                  />
                  <Label htmlFor="urgent" className="text-sm">
                    Mark as urgent (requires immediate attention)
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Choose how to notify the assignee
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="notification"
                    checked={sendNotification}
                    onCheckedChange={(checked) => setSendNotification(checked as boolean)}
                  />
                  <Label htmlFor="notification" className="text-sm">
                    Send email notification to assignee
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-2 pt-6 border-t">
          <Button type="button" variant="outline" asChild>
            <Link href={`/dashboard/bank/deals/${dealId}/agent-tasks`}>
              Cancel
            </Link>
          </Button>
          <Button type="submit" disabled={!title.trim() || !selectedAssignee}>
            Create Task
          </Button>
        </div>
      </form>
    </div>
  );
}