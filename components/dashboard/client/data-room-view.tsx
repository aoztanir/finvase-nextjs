"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/shadcn/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Button } from "@/components/shadcn/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/shadcn/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { Folder, File, Upload } from "lucide-react";

interface Document {
  id: string;
  name: string;
  file_type: string;
  updated_at: string;
}

export function DataRoomView() {
  const params = useParams();
  const deal_id = params.id as string;

  const { data: documents = [], isLoading, error } = useQuery<Document[]>({
    queryKey: ["deal-documents", deal_id],
    queryFn: async () => {
      const response = await fetch(`/api/client/deals/${deal_id}/documents`);
      if (!response.ok) {
        throw new Error("Failed to fetch documents");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full mt-2" />
          <Skeleton className="h-10 w-full mt-2" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load data room.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Data Room</CardTitle>
                    <CardDescription>View and manage your deal documents.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Last Modified</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {documents.map((doc) => (
                                <TableRow key={doc.id}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        {doc.file_type === 'folder' ? <Folder size={16} /> : <File size={16} />}
                                        {doc.name}
                                    </TableCell>
                                    <TableCell>{new Date(doc.updated_at).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">Download</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                             {documents.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center">No documents uploaded yet.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
        <div className="col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle>Upload Files</CardTitle>
                    <CardDescription>Add documents to the data room.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center text-center p-8 space-y-2">
                    <Upload size={48} className="text-muted-foreground" />
                    <p className="text-muted-foreground">Drag & drop files here</p>
                    <p className="text-xs text-muted-foreground">or</p>
                    <Button>Browse Files</Button>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
