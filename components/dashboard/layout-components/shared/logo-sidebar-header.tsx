import { SidebarHeader } from "@/components/shadcn/sidebar";
import { Logo } from "@/components/ui/logo";

export default function LogoSidebarHeader() {
  return (
    <SidebarHeader className="border-b group-data-[state=collapsed]:py-3 group-data-[state=collapsed]:px-0 p-4">
      <div className="flex items-center gap-2 justify-between group-data-[state=collapsed]:justify-center">
        <div className="group-data-[state=collapsed]:hidden">
          <p className="font-semibold">Finvase</p>
          <p className="text-xs text-muted-foreground">Bank Dashboard</p>
        </div>
        <Logo size={32} />
      </div>
    </SidebarHeader>
  );
}
