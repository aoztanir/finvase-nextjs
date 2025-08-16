"use client";

import { useState } from "react";
import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Input } from "@/components/shadcn/input";
import { ScrollArea } from "@/components/shadcn/scroll-area";
import { Avatar, AvatarFallback } from "@/components/shadcn/avatar";
import { Badge } from "@/components/shadcn/badge";
import { Send, Bot, User } from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface ChatPanelProps {
  dealId: string;
}

export function ChatPanel({ dealId }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your data room assistant. I can help you identify missing documents, suggest file organization, and answer questions about your deal documentation. How can I assist you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [is_loading, setIsLoading] = useState(false);

  const quick_actions = [
    { label: "Missing Documents", command: "/missing" },
    { label: "File Summary", command: "/summary" },
    { label: "Recommendations", command: "/recommend" },
  ];

  const handle_send = async () => {
    if (!input.trim()) return;

    const user_message: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, user_message]);
    setInput("");
    setIsLoading(true);

    // TODO: Implement actual AI chat functionality
    setTimeout(() => {
      const ai_response: Message = {
        id: (Date.now() + 1).toString(),
        content: `I understand you're asking about: "${input}". Let me analyze your data room and provide relevant insights. This is a placeholder response - the actual AI integration will be implemented next.`,
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, ai_response]);
      setIsLoading(false);
    }, 1000);
  };

  const handle_quick_action = (command: string) => {
    setInput(command);
  };

  const handle_key_press = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handle_send();
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-6 pb-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {message.role === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
                
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            
            {is_loading && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex flex-wrap gap-2 mb-3">
            {quick_actions.map((action) => (
              <Badge
                key={action.command}
                variant="secondary"
                className="cursor-pointer hover:bg-secondary/80"
                onClick={() => handle_quick_action(action.command)}
              >
                {action.label}
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handle_key_press}
              placeholder="Ask about missing documents, file organization..."
              className="flex-1"
            />
            <Button
              onClick={handle_send}
              disabled={!input.trim() || is_loading}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}