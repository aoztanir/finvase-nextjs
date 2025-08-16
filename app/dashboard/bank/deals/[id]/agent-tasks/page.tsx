"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/shadcn/button";
import { Badge } from "@/components/shadcn/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { Plus, Filter, Search, Moon, Sun } from "lucide-react";
import { Input } from "@/components/shadcn/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { TaskBoard } from "@/components/dashboard/bank/agent-tasks/task-board";
import { TaskTimeline } from "@/components/dashboard/bank/agent-tasks/task-timeline";
import { TaskList } from "@/components/dashboard/bank/agent-tasks/task-list";
import { TaskTable } from "@/components/dashboard/bank/agent-tasks/task-table";
import { TaskSheet } from "@/components/dashboard/bank/agent-tasks/task-sheet";
import Link from "next/link";

type FilterState = {
  assignee: string | null;
  priority: string | null;
  status: string | null;
  category: string | null;
};

export default function AgentTasksPage() {
  const params = useParams();
  const dealId = params.id as string;
  const [activeView, setActiveView] = useState("board");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    assignee: null,
    priority: null,
    status: null,
    category: null,
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const handleFilterChange = (filterType: keyof FilterState, value: string | null) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      assignee: null,
      priority: null,
      status: null,
      category: null,
    });
    setSearchQuery("");
  };

  const taskStats = {
    total: 42,
    inQueue: 12,
    onProgress: 15,
    blocked: 3,
    completed: 12,
  };

  return (
    <div className={`space-y-6 ${isDarkMode ? 'dark' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Agent Tasks</h1>
          <p className="text-sm text-muted-foreground">
            Manage AI-driven and user-assigned tasks for this deal
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button asChild>
            <Link href={`/dashboard/bank/deals/${dealId}/agent-tasks/assign`}>
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center space-x-4">
        <Badge variant="outline" className="text-sm">
          Total: {taskStats.total}
        </Badge>
        <Badge variant="outline" className="text-sm bg-blue-50 text-blue-700">
          In Queue: {taskStats.inQueue}
        </Badge>
        <Badge variant="outline" className="text-sm bg-yellow-50 text-yellow-700">
          On Progress: {taskStats.onProgress}
        </Badge>
        <Badge variant="outline" className="text-sm bg-red-50 text-red-700">
          Blocked: {taskStats.blocked}
        </Badge>
        <Badge variant="outline" className="text-sm bg-green-50 text-green-700">
          Completed: {taskStats.completed}
        </Badge>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {Object.values(filters).some(Boolean) && (
                <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                  {Object.values(filters).filter(Boolean).length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Filter by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleFilterChange('priority', 'high')}>
              High Priority
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterChange('priority', 'urgent')}>
              Urgent
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterChange('status', 'blocked')}>
              Blocked Tasks
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterChange('category', 'required')}>
              Required Tasks
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={clearFilters}>
              Clear Filters
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/bank/deals/${dealId}/agent-tasks/ai-suggestions`}>
            AI Suggestions
          </Link>
        </Button>

        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/bank/deals/${dealId}/agent-tasks/history`}>
            History
          </Link>
        </Button>
      </div>

      {/* Views */}
      <Tabs value={activeView} onValueChange={setActiveView} className="space-y-4">
        <TabsList className="grid w-fit grid-cols-4">
          <TabsTrigger value="board">Board</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="table">Table</TabsTrigger>
        </TabsList>
        
        <TabsContent value="board" className="space-y-4">
          <TaskBoard 
            dealId={dealId} 
            filters={filters}
            searchQuery={searchQuery}
            onTaskSelect={setSelectedTaskId}
          />
        </TabsContent>
        
        <TabsContent value="timeline" className="space-y-4">
          <TaskTimeline 
            dealId={dealId} 
            filters={filters}
            searchQuery={searchQuery}
            onTaskSelect={setSelectedTaskId}
          />
        </TabsContent>
        
        <TabsContent value="list" className="space-y-4">
          <TaskList 
            dealId={dealId} 
            filters={filters}
            searchQuery={searchQuery}
            onTaskSelect={setSelectedTaskId}
          />
        </TabsContent>
        
        <TabsContent value="table" className="space-y-4">
          <TaskTable 
            dealId={dealId} 
            filters={filters}
            searchQuery={searchQuery}
            onTaskSelect={setSelectedTaskId}
          />
        </TabsContent>
      </Tabs>

      {/* Task Details Sheet */}
      {selectedTaskId && (
        <TaskSheet
          taskId={selectedTaskId}
          isOpen={Boolean(selectedTaskId)}
          onClose={() => setSelectedTaskId(null)}
        />
      )}
    </div>
  );
}