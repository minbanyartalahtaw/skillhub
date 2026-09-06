import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { getUser } from "@/lib/dal"
import { listSkills } from "@/lib/skills"

export default async function UserLayout({
  children,
}: LayoutProps<"/user">) {
  // verifySession inside getUser redirects to /login when signed out.
  const [user, recentSkills] = await Promise.all([getUser(), listSkills(5)])

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar user={user} recentSkills={recentSkills} />
        <SidebarInset>
          {/* Mobile only: the sidebar is a sheet there, so it needs a trigger
              outside itself. Plain space — no border, no shadow — so it reads
              as margin rather than chrome. On md+ the trigger lives in the
              sidebar header and this disappears entirely. */}
          <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center bg-background px-3 md:hidden">
            <SidebarTrigger />
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 md:pt-4">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
