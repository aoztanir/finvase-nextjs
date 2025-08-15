import { SidebarHeader } from "@/components/shadcn/sidebar";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/shadcn/button";
import { Avatar, AvatarFallback } from "@/components/shadcn/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { ChevronDown } from "lucide-react";

export function LogoSidebarHeader() {
  return (
    <SidebarHeader className="border-b p-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-start h-auto p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2"
          >
            <div className="flex items-center gap-3 w-full group-data-[collapsible=icon]:gap-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Logo className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col items-start text-left min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-semibold">Finvase</span>
                <span className="text-xs text-muted-foreground">Team Plan</span>
              </div>
              <ChevronDown className="h-4 w-4 flex-shrink-0 group-data-[collapsible=icon]:hidden" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" align="start">
          <DropdownMenuLabel className="font-normal">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Logo className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Finvase</p>
                <p className="text-xs text-muted-foreground">Team Plan • 40 members</p>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <div className="flex items-center gap-3">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">S</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm">Sandra</p>
                <p className="text-xs text-muted-foreground">Personal Plan • 1 member</p>
              </div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarHeader>
  );
}

export default LogoSidebarHeader;