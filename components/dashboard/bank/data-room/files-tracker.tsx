"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Button } from "@/components/shadcn/button";
import { Progress } from "@/components/shadcn/progress";
import { Badge } from "@/components/shadcn/badge";
import { ScrollArea } from "@/components/shadcn/scroll-area";
import { Separator } from "@/components/shadcn/separator";
import { Input } from "@/components/shadcn/input";
import { 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  Upload, 
  Search,
  Mail,
  Filter
} from "lucide-react";

interface FileRequirement {
  id: string;
  name: string;
  category: string;
  status: "uploaded" | "missing" | "recommended";
  description?: string;
  uploaded_file_id?: string;
  upload_date?: string;
}

interface FilesTrackerProps {
  dealId: string;
}

const MOCK_REQUIREMENTS: FileRequirement[] = [
  // Financials
  { id: "1", name: "Annual Financial Statements (3 years)", category: "Financials", status: "uploaded", upload_date: "2024-01-15" },
  { id: "2", name: "Monthly Financial Reports (12 months)", category: "Financials", status: "uploaded", upload_date: "2024-01-10" },
  { id: "3", name: "Cap Table", category: "Financials", status: "missing", description: "Current capitalization table with all equity holders" },
  { id: "4", name: "Budget & Projections", category: "Financials", status: "missing", description: "3-5 year financial projections" },
  { id: "5", name: "Audit Reports", category: "Financials", status: "recommended", description: "External audit reports if available" },
  
  // Legal
  { id: "6", name: "Articles of Incorporation", category: "Legal", status: "uploaded", upload_date: "2024-01-12" },
  { id: "7", name: "Shareholder Agreements", category: "Legal", status: "missing", description: "All current shareholder agreements" },
  { id: "8", name: "Board Resolutions", category: "Legal", status: "missing", description: "Key board resolutions and meeting minutes" },
  { id: "9", name: "Material Contracts", category: "Legal", status: "recommended", description: "Key customer, supplier, and partnership agreements" },
  
  // HR
  { id: "10", name: "Organizational Chart", category: "HR", status: "uploaded", upload_date: "2024-01-08" },
  { id: "11", name: "Key Employee Contracts", category: "HR", status: "missing", description: "Employment agreements for senior management" },
  { id: "12", name: "Stock Option Plans", category: "HR", status: "recommended", description: "Employee equity compensation plans" },
  
  // Market
  { id: "13", name: "Market Research", category: "Market", status: "recommended", description: "Industry analysis and competitive landscape" },
  { id: "14", name: "Customer References", category: "Market", status: "recommended", description: "Case studies and customer testimonials" },
];

export function FilesTracker({ dealId }: FilesTrackerProps) {
  const [search_filter, setSearchFilter] = useState("");
  const [category_filter, setCategoryFilter] = useState<string>("all");

  const { data: requirements = [], isLoading } = useQuery<FileRequirement[]>({
    queryKey: ["file-requirements", dealId],
    queryFn: async () => {
      const response = await fetch(`/api/bank/deals/${dealId}/file-requirements`);
      if (!response.ok) {
        throw new Error("Failed to fetch file requirements");
      }
      return response.json();
    },
  });

  const categories = ["all", ...Array.from(new Set(requirements.map(req => req.category)))];
  
  const filtered_requirements = requirements.filter(req => {
    const matches_search = req.name.toLowerCase().includes(search_filter.toLowerCase());
    const matches_category = category_filter === "all" || req.category === category_filter;
    return matches_search && matches_category;
  });

  const uploaded_count = requirements.filter(req => req.status === "uploaded").length;
  const missing_count = requirements.filter(req => req.status === "missing").length;
  const recommended_count = requirements.filter(req => req.status === "recommended").length;
  const total_required = uploaded_count + missing_count;
  const completion_percentage = total_required > 0 ? Math.round((uploaded_count / total_required) * 100) : 0;

  const get_status_icon = (status: FileRequirement["status"]) => {
    switch (status) {
      case "uploaded":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "missing":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "recommended":
        return <Lightbulb className="h-4 w-4 text-yellow-500" />;
    }
  };

  const get_status_badge = (status: FileRequirement["status"]) => {
    switch (status) {
      case "uploaded":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Complete</Badge>;
      case "missing":
        return <Badge variant="destructive">Required</Badge>;
      case "recommended":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700">Optional</Badge>;
    }
  };

  const handle_upload_request = (requirement: FileRequirement) => {
    // This would open an upload dialog or navigate to the correct folder
    console.log("Request upload for:", requirement.name);
  };

  const handle_request_from_client = (requirement: FileRequirement) => {
    // This would send an email request to the client
    console.log("Request from client:", requirement.name);
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center space-x-3">
                <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
                <div className="h-4 bg-gray-200 rounded flex-1"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>File Requirements</CardTitle>
        
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{completion_percentage}% Complete</span>
            </div>
            <Progress value={completion_percentage} className="h-2" />
            <div className="text-xs text-muted-foreground">
              {uploaded_count}/{total_required} Required Files Uploaded
            </div>
          </div>

          <div className="flex space-x-2 text-sm">
            <div className="flex items-center space-x-1">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>{uploaded_count} Complete</span>
            </div>
            <div className="flex items-center space-x-1">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span>{missing_count} Missing</span>
            </div>
            <div className="flex items-center space-x-1">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              <span>{recommended_count} Optional</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <div className="px-4 pb-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search requirements..."
              value={search_filter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="pl-8"
            />
          </div>

          <div className="flex space-x-2">
            <Filter className="h-4 w-4 mt-2 text-muted-foreground" />
            <div className="flex flex-wrap gap-1">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={category_filter === category ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => setCategoryFilter(category)}
                >
                  {category === "all" ? "All" : category}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            {filtered_requirements.map((requirement) => (
              <div key={requirement.id} className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2 flex-1">
                    {get_status_icon(requirement.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium leading-none">
                          {requirement.name}
                        </p>
                        {get_status_badge(requirement.status)}
                      </div>
                      
                      {requirement.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {requirement.description}
                        </p>
                      )}
                      
                      {requirement.upload_date && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Uploaded on {new Date(requirement.upload_date).toLocaleDateString()}
                        </p>
                      )}
                      
                      <div className="text-xs text-muted-foreground mt-1">
                        {requirement.category}
                      </div>
                    </div>
                  </div>
                </div>

                {requirement.status !== "uploaded" && (
                  <div className="flex space-x-2 ml-6">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handle_upload_request(requirement)}
                      className="h-7 text-xs"
                    >
                      <Upload className="h-3 w-3 mr-1" />
                      Upload Now
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handle_request_from_client(requirement)}
                      className="h-7 text-xs"
                    >
                      <Mail className="h-3 w-3 mr-1" />
                      Request from Client
                    </Button>
                  </div>
                )}

                <Separator />
              </div>
            ))}

            {filtered_requirements.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No requirements match your filter.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}