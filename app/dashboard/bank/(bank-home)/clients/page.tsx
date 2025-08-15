'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card"
import { Button } from "@/components/shadcn/button"
import { Badge } from "@/components/shadcn/badge"
import { Input } from "@/components/shadcn/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shadcn/dialog"
import { Label } from "@/components/shadcn/label"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

interface Client {
  id: string
  name: string
  email: string
  created_at: string
  deal_count: number
}

export default function ClientsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [newClient, setNewClient] = useState({ name: "", email: "", password: "" })
  const queryClient = useQueryClient()

  const { data: clients = [], isLoading, error } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const response = await fetch('/api/bank/clients')
      if (!response.ok) {
        throw new Error('Failed to fetch clients')
      }
      return response.json()
    }
  })

  const createClientMutation = useMutation({
    mutationFn: async (clientData: { name: string; email: string; password: string }) => {
      const response = await fetch('/api/bank/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData)
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create client')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      setIsAddDialogOpen(false)
      setNewClient({ name: "", email: "", password: "" })
      toast.success("Client created successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    }
  })

  const deleteClientMutation = useMutation({
    mutationFn: async (clientId: string) => {
      const response = await fetch(`/api/bank/clients/${clientId}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        throw new Error('Failed to delete client')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      toast.success("Client deleted successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    }
  })

  const filteredClients = clients.filter((client: Client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddClient = () => {
    if (!newClient.name || !newClient.email || !newClient.password) {
      toast.error("Please fill in all fields")
      return
    }
    createClientMutation.mutate(newClient)
  }

  const handleDeleteClient = (clientId: string) => {
    if (confirm("Are you sure you want to delete this client?")) {
      deleteClientMutation.mutate(clientId)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getIndustryColor = (industry: string) => {
    switch (industry) {
      case 'Technology': return 'bg-blue-100 text-blue-800'
      case 'Real Estate': return 'bg-orange-100 text-orange-800'
      case 'Healthcare': return 'bg-purple-100 text-purple-800'
      case 'Energy': return 'bg-green-100 text-green-800'
      case 'Fintech': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase()
  }

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading clients...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Error loading clients</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Clients</h2>
        <div className="flex items-center space-x-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add New Client</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Client</DialogTitle>
                <DialogDescription>
                  Create a new client account. They will receive login credentials via email.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newClient.name}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    className="col-span-3"
                    placeholder="Client name"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    className="col-span-3"
                    placeholder="client@example.com"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={newClient.password}
                    onChange={(e) => setNewClient({ ...newClient, password: e.target.value })}
                    className="col-span-3"
                    placeholder="Temporary password"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleAddClient}
                  disabled={createClientMutation.isPending}
                >
                  {createClientMutation.isPending ? "Creating..." : "Create Client"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search clients..."
          className="max-w-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {filteredClients.map((client: Client) => (
          <Card key={client.id} className="hover:bg-muted/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-muted">
                      {getInitials(client.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <div>
                      <h4 className="text-lg font-semibold">{client.name}</h4>
                      <p className="text-sm text-muted-foreground">{client.email}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Client since: {new Date(client.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <div className="text-sm text-muted-foreground">{client.deal_count} deals</div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Email
                    </Button>
                    <Button variant="ghost" size="sm">
                      <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteClient(client.id)}
                      disabled={deleteClientMutation.isPending}
                    >
                      <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredClients.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No clients found
          </div>
        )}
      </div>
    </div>
  )
}