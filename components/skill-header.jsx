"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { IconHistory, IconPencil } from "@tabler/icons-react"

import { SkillActions } from "@/components/skill-actions"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"

export function SkillHeader({ skill, saves }) {
  const { isMobile } = useSidebar()
  const sentinel = useRef(null)
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    const el = sentinel.current
    if (!el) return

    // A zero-height marker above the header: once it passes the point the
    // header parks at, the header is pinned. Cheaper and steadier than
    // reading scroll offsets. Mobile parks below its bar; desktop has none.
    const observer = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { rootMargin: `-${isMobile ? 56 : 0}px 0px 0px 0px` }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [isMobile])

  return (
    <>
      <div ref={sentinel} aria-hidden className="h-px" />

      {/* Pinned on desktop it parks at the viewport edge and loses the page's
          top padding, so it pays that back itself. Mobile parks under the app
          bar, which is already the gap. */}
      <div
        data-stuck={stuck || undefined}
        className="group/header sticky top-14 z-10 border-b border-transparent bg-background pt-1 pb-3 transition-[border-color,padding-top] duration-200 data-[stuck]:border-border md:top-0 md:data-[stuck]:pt-4"
      >
        <div className="flex items-start justify-between gap-3">
          {/* Wraps to a second line at rest; pinned, it stays on one row and
              truncates so the actions never get pushed off. */}
          <h1 className="min-w-0 flex-1 text-2xl font-semibold transition-[font-size] duration-200 group-data-[stuck]/header:truncate group-data-[stuck]/header:text-lg">
            {skill.name}
          </h1>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href={`/user/skills/${skill.slug}/edit`}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <IconPencil />
              Edit
            </Link>
            <SkillActions skillId={skill.id} skillName={skill.name} />
          </div>
        </div>

        {/* Collapses to nothing when pinned: 1fr -> 0fr is animatable, height is not. */}
        <div className="grid grid-rows-[1fr] transition-all duration-200 group-data-[stuck]/header:grid-rows-[0fr] group-data-[stuck]/header:opacity-0">
          <div className="overflow-hidden">
            <p className="text-muted-foreground">{skill.description}</p>

            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary">{skill.visibility}</Badge>
              {skill.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
              <span className="ml-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                <IconHistory className="size-3.5" />v{skill.currentVersion}
                {saves > 1 ? ` · ${saves} saves` : null}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
