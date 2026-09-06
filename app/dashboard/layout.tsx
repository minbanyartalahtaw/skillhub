import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { getUser } from "@/lib/dal"
import { listSkills } from "@/lib/skills"

export default async function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  // verifySession inside getUser redirects to /login when signed out.
  const [user, recentSkills] = await Promise.all([getUser(), listSkills(5)])

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar user={user} recentSkills={recentSkills} />
        <SidebarInset>
          <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
            <SidebarTrigger className="-ml-1" />
            
            <span className="text-sm font-medium"></span>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
