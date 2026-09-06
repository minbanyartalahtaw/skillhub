"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  IconFileText,
  IconLayoutDashboard,
  IconLogout,
  IconPlus,
  IconSelector,
} from "@tabler/icons-react"

import { logout } from "@/app/actions/auth"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { SkillSummary } from "@/lib/skills"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"

const navItems = [
  { title: "All skills", href: "/user", icon: IconLayoutDashboard },
  { title: "New skill", href: "/user/skills/new", icon: IconPlus },
]

type User = { name: string; email: string }

export function AppSidebar({
  user,
  recentSkills,
}: {
  user: User | null
  recentSkills: SkillSummary[]
}) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/user" />}>
              {/* Wordmark: "Skill" in the sidebar's text color, "Hub" in green. */}
              <span className="truncate font-heading text-lg font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
                <span className="text-sidebar-foreground">Skill</span>
                <span className="text-green-600 dark:text-green-500">Hub</span>
              </span>
              <span className="hidden text-lg font-semibold tracking-tight group-data-[collapsible=icon]:block">
                <span className="text-sidebar-foreground">S</span>
                <span className="text-green-600 dark:text-green-500">H</span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.title}
                    render={<Link href={item.href} />}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Recent skills</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {recentSkills.length === 0 ? (
                <p className="px-2 py-1 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
                  Nothing yet.
                </p>
              ) : (
                recentSkills.map((skill) => {
                  const href = `/user/skills/${skill.slug}`
                  return (
                    <SidebarMenuItem key={skill.id}>
                      <SidebarMenuButton
                        isActive={pathname === href}
                        tooltip={skill.name}
                        render={<Link href={href} />}
                      >
                        <IconFileText />
                        <span>{skill.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {user ? <UserMenu user={user} /> : null}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

function UserMenu({ user }: { user: User }) {
  const { isMobile } = useSidebar()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isSigningOut, startSignOut] = useTransition()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <SidebarMenuButton size="lg">
              <UserAvatar user={user} />
              <span className="flex-1 truncate text-left font-medium">
                {user.name}
              </span>
              <IconSelector className="ml-auto" />
            </SidebarMenuButton>
          }
        />
        <DropdownMenuContent
          // Beside the rail on desktop, above the button on mobile.
          side={isMobile ? "top" : "right"}
          align="end"
          sideOffset={4}
          className="w-auto! min-w-56"
        >
          <div className="flex items-center gap-2 px-2 py-1.5">
            <UserAvatar user={user} />
            <div className="grid flex-1 leading-tight">
              <span className="truncate text-sm font-medium">{user.name}</span>
              <span className="text-xs opacity-70">{user.email}</span>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setConfirmOpen(true)}
          >
            <IconLogout />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <IconLogout />
            </AlertDialogMedia>
            <AlertDialogTitle>Sign out?</AlertDialogTitle>
            <AlertDialogDescription>
              You will need to sign in again to get back to your skills.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSigningOut}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isSigningOut}
              // logout() redirects, so the dialog unmounts with the page.
              onClick={() =>
                startSignOut(async () => {
                  await logout()
                })
              }
            >
              {isSigningOut ? "Signing out…" : "Sign out"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function UserAvatar({ user }: { user: User }) {
  return (
    <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-accent text-xs font-medium text-sidebar-accent-foreground uppercase">
      {user.name.slice(0, 2)}
    </div>
  )
}
