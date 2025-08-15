'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog"
import { Button } from "@/components/shadcn/button"
import { Input } from "@/components/shadcn/input"
import { Label } from "@/components/shadcn/label"
import { Textarea } from "@/components/shadcn/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

interface Client {
  id: string
  name: string
  email: string
}

interface CreateDealModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateDealModal({ open, onOpenChange }: CreateDealModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    client_id: "",
    deal_value: "",
    status: "draft"
  })
  const queryClient = useQueryClient()

  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: async () => {
      const response = await fetch('/api/bank/clients')
      if (!response.ok) {
        throw new Error('Failed to fetch clients')
      }
      return response.json()
    }
  })

  const createDealMutation = useMutation({
    mutationFn: async (dealData: typeof formData) => {
      console.log('Creating deal with data:', dealData)
      const response = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dealData)
      })
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }))
        console.error('API Error:', errorData)
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to create deal`)
      }
      const result = await response.json()
      console.log('Deal created successfully:', result)
      return result
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['deals'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
      toast.success("Deal created successfully")
      onOpenChange(false)
      resetForm()
    },
    onError: (error: Error) => {
      console.error('Create deal error:', error)
      toast.error(`Failed to create deal: ${error.message}`)
    }
  })

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      client_id: "",
      deal_value: "",
      status: "draft"
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error("Please enter a deal title")
      return
    }

    // Prepare data for submission, converting "none" client_id to null
    const submitData = {
      ...formData,
      client_id: formData.client_id === "none" || formData.client_id === "" ? null : formData.client_id
    }

    createDealMutation.mutate(submitData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !createDealMutation.isPending) {
      resetForm()
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Deal</DialogTitle>
          <DialogDescription>
            Set up a new investment banking deal
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Deal Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Tech Acquisition, Series A Funding"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the deal, its objectives, and key details..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Select value={formData.client_id} onValueChange={(value) => handleInputChange('client_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a client (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No client assigned</SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deal_value">Deal Value</Label>
              <Input
                id="deal_value"
                value={formData.deal_value}
                onChange={(e) => handleInputChange('deal_value', e.target.value)}
                placeholder="e.g., $5.2M, $12.8M"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Initial Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="review">Under Review</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => handleOpenChange(false)}
              disabled={createDealMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createDealMutation.isPending}
            >
              {createDealMutation.isPending ? "Creating..." : "Create Deal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}