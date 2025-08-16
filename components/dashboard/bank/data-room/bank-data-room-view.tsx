"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/shadcn/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/shadcn/sheet";
import { FileDashboard } from "./file-dashboard";
import { FilesTracker } from "./files-tracker";
import { ChatPanel } from "./chat-panel";
import { Bot } from "lucide-react";

interface FileDetails {
  id: string;
  name: string;
  file_type: string;
  file_size?: number;
  mime_type?: string;
  updated_at: string;
  uploader_name?: string;
}

export function BankDataRoomView() {
  const params = useParams();
  const deal_id = params.id as string;
  const [selected_file, setSelectedFile] = useState<FileDetails | null>(null);

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      {/* Header with AI Assistant Button */}
      <div className="flex justify-end mb-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <Bot className="h-4 w-4 mr-2" />
              AI Assistant
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Assistant
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 h-[calc(100vh-120px)]">
              <ChatPanel dealId={deal_id} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content - Responsive Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* File Dashboard - Takes full width on mobile, 2/3 on large screens */}
        <div className="lg:col-span-8">
          <FileDashboard onFileSelect={setSelectedFile} />
        </div>

        {/* Files Tracker - Full width on mobile, 1/3 on large screens */}
        <div className="lg:col-span-4">
          <FilesTracker dealId={deal_id} />
        </div>
      </div>

      {/* File Detail Sheet */}
      {selected_file && (
        <Sheet open={!!selected_file} onOpenChange={() => setSelectedFile(null)}>
          <SheetContent side="right" className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>File Details</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Name</h4>
                  <p className="text-sm text-muted-foreground">{selected_file.name}</p>
                </div>
                {selected_file.file_size && (
                  <div>
                    <h4 className="font-medium">Size</h4>
                    <p className="text-sm text-muted-foreground">
                      {Math.round(selected_file.file_size / 1024)} KB
                    </p>
                  </div>
                )}
                <div>
                  <h4 className="font-medium">Type</h4>
                  <p className="text-sm text-muted-foreground">
                    {selected_file.mime_type || selected_file.file_type}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Last Modified</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selected_file.updated_at).toLocaleDateString()}
                  </p>
                </div>
                {selected_file.uploader_name && (
                  <div>
                    <h4 className="font-medium">Uploaded by</h4>
                    <p className="text-sm text-muted-foreground">{selected_file.uploader_name}</p>
                  </div>
                )}
                {/* File preview placeholder */}
                <div className="border rounded-lg p-8 text-center text-muted-foreground">
                  <div className="space-y-2">
                    <div className="text-4xl">📄</div>
                    <p>File preview not available</p>
                    <p className="text-xs">Preview functionality coming soon</p>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
