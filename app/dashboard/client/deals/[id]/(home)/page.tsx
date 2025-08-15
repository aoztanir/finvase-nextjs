"use client";

import { DealProgressTimeline } from "@/components/dashboard/client/deal-progress-timeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";

function ChatPanel() {
    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle>Chat with your Assistant</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
                {/* Chat messages will go here */}
                <div className="space-y-4">
                    <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">A</div>
                        <div className="bg-muted p-3 rounded-lg">
                            <p>Hello! How can I help you with the deal today?</p>
                        </div>
                    </div>
                </div>
            </CardContent>
            <div className="p-4 border-t">
                <div className="relative">
                    <Input placeholder="Ask a question about the deal..." className="pr-16" />
                    <Button className="absolute top-1/2 right-1 -translate-y-1/2" size="icon" variant="ghost">
                        {/* Send Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                    </Button>
                </div>
            </div>
        </Card>
    )
}


export default function ClientDealHomePage() {
  return (
    <div className="grid lg:grid-cols-2 gap-4 h-full">
      <div className="col-span-1">
        <DealProgressTimeline />
      </div>
      <div className="col-span-1">
        <ChatPanel />
      </div>
    </div>
  );
}
