"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useDocuments, useCreateFolder, useUploadFiles } from "@/hooks/use-documents";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/shadcn/dropdown-menu";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/shadcn/breadcrumb";
import { Alert, AlertDescription } from "@/components/shadcn/alert";
import { Skeleton } from "@/components/shadcn/skeleton";
import { 
  Folder, 
  File, 
  Upload, 
  Search, 
  MoreHorizontal, 
  Download, 
  Edit, 
  Share, 
  Trash2,
  ChevronRight,
  Plus,
  FolderPlus
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Document {
  id: string;
  name: string;
  file_type: string;
  file_path?: string;
  parent_id?: string;
  file_size?: number;
  uploaded_by: string;
  uploader_name?: string;
  created_at: string;
  updated_at: string;
}

interface BreadcrumbPath {
  id: string;
  name: string;
}

interface FileDashboardProps {
  onFileSelect?: (file: Document) => void;
}

export function FileDashboard({ onFileSelect }: FileDashboardProps = {}) {
  const params = useParams();
  const deal_id = params.id as string;
  const [current_folder_id, setCurrentFolderId] = useState<string | null>(null);
  const [search_query, setSearchQuery] = useState("");
  const [drag_active, setDragActive] = useState(false);
  const [new_folder_name, setNewFolderName] = useState("");
  const [show_folder_input, setShowFolderInput] = useState(false);

  // Use custom hooks
  const { data: documents = [], isLoading, error } = useDocuments(deal_id, current_folder_id || undefined);
  const create_folder_mutation = useCreateFolder(deal_id, current_folder_id || undefined);
  const upload_files_mutation = useUploadFiles(deal_id, current_folder_id || undefined);

  const { data: breadcrumb_path = [] } = useQuery<BreadcrumbPath[]>({
    queryKey: ["document-breadcrumb", deal_id, current_folder_id],
    queryFn: async () => {
      if (!current_folder_id) return [];
      
      const response = await fetch(`/api/bank/deals/${deal_id}/documents/${current_folder_id}/breadcrumb`);
      if (!response.ok) {
        throw new Error("Failed to fetch breadcrumb");
      }
      return response.json();
    },
    enabled: !!current_folder_id,
  });

  const filtered_documents = documents.filter(doc =>
    doc.name.toLowerCase().includes(search_query.toLowerCase())
  );

  const handle_folder_click = (folder_id: string) => {
    setCurrentFolderId(folder_id);
  };

  const handle_breadcrumb_click = (folder_id: string | null) => {
    setCurrentFolderId(folder_id);
  };

  const handle_file_upload = async (files: FileList) => {
    try {
      await upload_files_mutation.mutateAsync({
        files,
        parent_id: current_folder_id || undefined,
      });
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    }
  };

  const handle_drag_over = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handle_drag_leave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handle_drop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handle_file_upload(files);
    }
  };

  const handle_file_input_change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handle_file_upload(files);
    }
  };

  const handle_create_folder = async () => {
    if (!new_folder_name.trim()) return;
    
    try {
      await create_folder_mutation.mutateAsync({
        name: new_folder_name,
        parent_id: current_folder_id || undefined,
      });
      
      setNewFolderName("");
      setShowFolderInput(false);
    } catch (error) {
      console.error('Error creating folder:', error);
      alert('Failed to create folder. Please try again.');
    }
  };

  const get_file_icon = (file_type: string, name: string) => {
    if (file_type === 'folder') return <Folder className="h-4 w-4 text-blue-500" />;
    
    const extension = name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <File className="h-4 w-4 text-red-500" />;
      case 'xlsx':
      case 'xls':
        return <File className="h-4 w-4 text-green-500" />;
      case 'docx':
      case 'doc':
        return <File className="h-4 w-4 text-blue-600" />;
      default:
        return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  const format_file_size = (bytes?: number) => {
    if (!bytes) return '-';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const format_date = (date_string: string) => {
    return new Date(date_string).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load data room files.</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Data Room Files</CardTitle>
            <div className="flex items-center space-x-2 mt-2">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink 
                      onClick={() => handle_breadcrumb_click(null)}
                      className="cursor-pointer"
                    >
                      Root
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {breadcrumb_path.map((path, index) => (
                    <BreadcrumbItem key={path.id}>
                      <BreadcrumbSeparator>
                        <ChevronRight className="h-4 w-4" />
                      </BreadcrumbSeparator>
                      {index === breadcrumb_path.length - 1 ? (
                        <BreadcrumbPage>{path.name}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink 
                          onClick={() => handle_breadcrumb_click(path.id)}
                          className="cursor-pointer"
                        >
                          {path.name}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {show_folder_input ? (
              <div className="flex items-center space-x-2">
                <Input
                  value={new_folder_name}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Folder name"
                  className="w-32"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handle_create_folder();
                    }
                    if (e.key === 'Escape') {
                      setShowFolderInput(false);
                      setNewFolderName("");
                    }
                  }}
                  autoFocus
                />
                <Button
                  size="sm"
                  onClick={handle_create_folder}
                  disabled={!new_folder_name.trim() || create_folder_mutation.isPending}
                >
                  {create_folder_mutation.isPending ? 'Creating...' : 'Create'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowFolderInput(false);
                    setNewFolderName("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFolderInput(true)}
              >
                <FolderPlus className="h-4 w-4 mr-2" />
                New Folder
              </Button>
            )}
            <div className="relative">
              <input
                type="file"
                multiple
                onChange={handle_file_input_change}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={upload_files_mutation.isPending}
                title="Upload files"
                aria-label="Upload files"
              />
              <Button size="sm" disabled={upload_files_mutation.isPending}>
                <Plus className="h-4 w-4 mr-2" />
                {upload_files_mutation.isPending ? 'Uploading...' : 'Upload Files'}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={search_query}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent 
        className={cn(
          "flex-1 relative",
          drag_active && "bg-blue-50 border-blue-300"
        )}
        onDragOver={handle_drag_over}
        onDragLeave={handle_drag_leave}
        onDrop={handle_drop}
      >
        {drag_active && (
          <div className="absolute inset-0 bg-blue-100/50 border-2 border-dashed border-blue-400 rounded-lg flex items-center justify-center z-10">
            <div className="text-center">
              <Upload className="h-12 w-12 mx-auto mb-2 text-blue-500" />
              <p className="text-blue-700 font-medium">Drop files here to upload</p>
            </div>
          </div>
        )}
        {upload_files_mutation.isPending && (
          <div className="mb-4 p-4 border-2 border-dashed border-blue-300 bg-blue-50 rounded-lg text-center">
            <Upload className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <p className="text-blue-700">Uploading files...</p>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Modified</TableHead>
              <TableHead>Uploaded by</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered_documents.map((document) => (
              <TableRow 
                key={document.id}
                className={cn(
                  "cursor-pointer hover:bg-muted/50",
                  document.file_type === 'folder' && "hover:bg-blue-50"
                )}
                onClick={() => {
                  if (document.file_type === 'folder') {
                    handle_folder_click(document.id);
                  } else if (onFileSelect) {
                    onFileSelect(document);
                  }
                }}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-3">
                    {get_file_icon(document.file_type, document.name)}
                    <span>{document.name}</span>
                  </div>
                </TableCell>
                <TableCell>{format_file_size(document.file_size)}</TableCell>
                <TableCell>{format_date(document.updated_at)}</TableCell>
                <TableCell>{document.uploader_name || 'Unknown'}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {document.file_type !== 'folder' && (
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share className="h-4 w-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            
            {filtered_documents.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="flex flex-col items-center space-y-2">
                    <Folder className="h-12 w-12 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {search_query ? 'No files match your search.' : 'This folder is empty.'}
                    </p>
                    {!search_query && (
                      <p className="text-sm text-muted-foreground">
                        Drag and drop files here or click upload to get started.
                      </p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}