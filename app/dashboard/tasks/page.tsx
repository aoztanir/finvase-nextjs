'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Badge } from '@/components/shadcn/badge'
import { Button } from '@/components/shadcn/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import { Input } from '@/components/shadcn/input'
import { Separator } from '@/components/shadcn/separator'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/shadcn/resizable'
import { 
  Calendar, 
  Clock, 
  MessageCircle, 
  Paperclip, 
  Download, 
  Eye, 
  Share, 
  Expand, 
  MoreHorizontal,
  FileText,
  CalendarDays,
  Target,
  Package,
  CheckCircle,
  Circle,
  PlayCircle
} from 'lucide-react'

interface Task {
  id: string
  title: string
  priority: 'high' | 'medium' | 'low'
  status: 'todo' | 'in_progress' | 'completed'
  daysLeft: number
  comments: number
  attachments: number
  category: string
  description: string
  timeSpent: string
  dateRange: string
  files: Array<{
    name: string
    type: string
    timestamp: string
    size?: string
  }>
  comments_list: Array<{
    user: string
    avatar: string
    message: string
    timestamp: string
  }>
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Schedule me an appointment with my endocrinologist',
    priority: 'high',
    status: 'todo',
    daysLeft: 15,
    comments: 6,
    attachments: 17,
    category: 'Appointments',
    description: 'Specializes in the diagnosis and treatment of diseases related to the endocrine system, which includes glands and organs that produce hormones.\n\nThese hormones regulate various bodily functions such as metabolism, growth, and reproduction.',
    timeSpent: '12:45:00',
    dateRange: 'Jul 10 - 14',
    files: [
      { name: 'Medical Prescription.docx', type: 'docx', timestamp: '12:32 PM, 22 August' },
      { name: 'Doctor Appointment.pdf', type: 'pdf', timestamp: '14:35 PM, 24 August' }
    ],
    comments_list: [
      { user: 'John Smith', avatar: 'JS', message: 'I want a complete diet plan.', timestamp: '17th Feb 2024' },
      { user: 'John Smith', avatar: 'JS', message: 'Do you have any update?', timestamp: 'Just Now' }
    ]
  },
  {
    id: '2',
    title: 'Help DStudio get more customers',
    priority: 'medium',
    status: 'todo',
    daysLeft: 15,
    comments: 23,
    attachments: 12,
    category: 'Marketing',
    description: 'Develop a comprehensive marketing strategy to increase customer acquisition for DStudio.',
    timeSpent: '8:30:00',
    dateRange: 'Jul 15 - 20',
    files: [],
    comments_list: []
  },
  {
    id: '3',
    title: 'Plan an event',
    priority: 'high',
    status: 'in_progress',
    daysLeft: 15,
    comments: 7,
    attachments: 32,
    category: 'Events',
    description: 'Organize and plan the upcoming company event.',
    timeSpent: '16:20:00',
    dateRange: 'Jul 20 - 25',
    files: [],
    comments_list: []
  },
  {
    id: '4',
    title: 'Return a package',
    priority: 'low',
    status: 'in_progress',
    daysLeft: 15,
    comments: 34,
    attachments: 8,
    category: 'Personal',
    description: 'Process return for the recent package delivery.',
    timeSpent: '2:15:00',
    dateRange: 'Jul 25 - 30',
    files: [],
    comments_list: []
  },
  {
    id: '5',
    title: 'Find a kids activity',
    priority: 'medium',
    status: 'completed',
    daysLeft: 0,
    comments: 12,
    attachments: 5,
    category: 'Personal',
    description: 'Research and find suitable activities for children.',
    timeSpent: '4:45:00',
    dateRange: 'Completed',
    files: [],
    comments_list: []
  }
]

const sidebarItems = [
  { icon: Calendar, active: false },
  { icon: Target, active: true },
  { icon: MessageCircle, active: false },
  { icon: FileText, active: false },
  { icon: Package, active: false },
]

const priorityColors = {
  high: 'bg-red-100 text-red-800 border-red-200',
  medium: 'bg-purple-100 text-purple-800 border-purple-200',
  low: 'bg-green-100 text-green-800 border-green-200'
}

const statusIcons = {
  todo: Circle,
  in_progress: PlayCircle,
  completed: CheckCircle
}

export default function TasksPage() {
  const [selectedTask, setSelectedTask] = useState<Task>(mockTasks[0])

  const todoTasks = mockTasks.filter(task => task.status === 'todo')
  const inProgressTasks = mockTasks.filter(task => task.status === 'in_progress')
  const completedTasks = mockTasks.filter(task => task.status === 'completed')

  const StatusIcon = statusIcons[selectedTask.status]

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Fixed Sidebar Navigation */}
      <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-4">
        <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">S</span>
        </div>
        <Separator className="w-8" />
        {sidebarItems.map((item, index) => {
          const Icon = item.icon
          return (
            <button
              key={index}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                item.active 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon size={20} />
            </button>
          )
        })}
      </div>

      {/* Main Content Area */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Task List Panel */}
        <ResizablePanel defaultSize={35} minSize={25}>
          <div className="h-full bg-white border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-2xl font-semibold text-gray-900">My Events</h1>
              <div className="flex space-x-4 mt-4">
                <button className="text-sm font-medium text-gray-900 border-b-2 border-gray-900 pb-2">All</button>
                <button className="text-sm font-medium text-gray-500 pb-2">Remote</button>
                <button className="text-sm font-medium text-gray-500 pb-2">In Person</button>
              </div>
            </div>

            {/* Task Categories */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* TODO Section */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">TODO</h3>
                  <Badge variant="secondary" className="text-xs">{todoTasks.length}</Badge>
                </div>
                <div className="space-y-3">
                  {todoTasks.map((task) => (
                    <Card 
                      key={task.id} 
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedTask.id === task.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedTask(task)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-sm font-medium text-gray-900 leading-5">{task.title}</h4>
                          <Badge className={`text-xs ${priorityColors[task.priority]}`}>
                            {task.priority === 'high' ? 'High Priority' : 
                             task.priority === 'medium' ? 'Medium Priority' : 'Low Priority'}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock size={12} />
                            <span>{task.daysLeft} Days left</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle size={12} />
                            <span>{task.comments}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Paperclip size={12} />
                            <span>{task.attachments}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* IN PROGRESS Section */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">IN PROGRESS</h3>
                  <Badge variant="secondary" className="text-xs">{inProgressTasks.length}</Badge>
                </div>
                <div className="space-y-3">
                  {inProgressTasks.map((task) => (
                    <Card 
                      key={task.id} 
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedTask.id === task.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedTask(task)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-sm font-medium text-gray-900 leading-5">{task.title}</h4>
                          <Badge className={`text-xs ${priorityColors[task.priority]}`}>
                            {task.priority === 'high' ? 'High Priority' : 
                             task.priority === 'medium' ? 'Medium Priority' : 'Low Priority'}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock size={12} />
                            <span>{task.daysLeft} Days left</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle size={12} />
                            <span>{task.comments}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Paperclip size={12} />
                            <span>{task.attachments}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* COMPLETED Section */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">COMPLETED</h3>
                  <Badge variant="secondary" className="text-xs">{completedTasks.length}</Badge>
                </div>
                <div className="space-y-3">
                  {completedTasks.map((task) => (
                    <Card 
                      key={task.id} 
                      className={`cursor-pointer transition-all hover:shadow-md opacity-75 ${
                        selectedTask.id === task.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedTask(task)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-sm font-medium text-gray-900 leading-5">{task.title}</h4>
                          <Badge className={`text-xs ${priorityColors[task.priority]}`}>
                            {task.priority === 'high' ? 'High Priority' : 
                             task.priority === 'medium' ? 'Medium Priority' : 'Low Priority'}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <CheckCircle size={12} />
                            <span>Completed</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle size={12} />
                            <span>{task.comments}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Paperclip size={12} />
                            <span>{task.attachments}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle />

        {/* Task Detail Panel */}
        <ResizablePanel defaultSize={65} minSize={40}>
          <div className="h-full bg-white flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <CalendarDays size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-500">{selectedTask.category}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Share size={16} className="mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <Expand size={16} className="mr-2" />
                    Expand
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal size={16} />
                  </Button>
                </div>
              </div>
              
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">{selectedTask.title}</h1>
              
              <div className="flex items-center space-x-4">
                <Badge className={`${priorityColors[selectedTask.priority]}`}>
                  {selectedTask.priority === 'high' ? 'High Priority' : 
                   selectedTask.priority === 'medium' ? 'Medium Priority' : 'Low Priority'}
                </Badge>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock size={14} />
                  <span>{selectedTask.dateRange}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Time Tracker */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                        <Clock size={16} className="text-white" />
                      </div>
                      <span className="font-medium text-gray-900">Time Spent on this project</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{selectedTask.timeSpent}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Description</h3>
                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {selectedTask.description}
                </div>
              </div>

              {/* Attachments */}
              {selectedTask.files.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Attachments</h3>
                  <div className="space-y-3">
                    {selectedTask.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                            <FileText size={16} className="text-red-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{file.name}</div>
                            <div className="text-sm text-gray-500">{file.timestamp}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye size={14} className="mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download size={14} className="mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments */}
              <div>
                <div className="flex items-center space-x-4 border-b border-gray-200 mb-4">
                  <button className="pb-3 border-b-2 border-gray-900 font-medium text-gray-900">Comments</button>
                  <button className="pb-3 font-medium text-gray-500">Updates</button>
                </div>
                
                {selectedTask.comments_list.length > 0 && (
                  <div className="space-y-4 mb-6">
                    {selectedTask.comments_list.map((comment, index) => (
                      <div key={index} className="flex space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                            {comment.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900">{comment.user}</span>
                            <span className="text-sm text-gray-500">{comment.timestamp}</span>
                          </div>
                          <p className="text-gray-700">{comment.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">U</AvatarFallback>
                  </Avatar>
                  <Input 
                    placeholder="Add a comment..." 
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}