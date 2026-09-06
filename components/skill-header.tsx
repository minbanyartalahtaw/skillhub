"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { IconHistory, IconPencil } from "@tabler/icons-react"

import { SkillActions } from "@/components/skill-actions"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import type { Skill } from "@/lib/skills"

/** Height of the sticky app bar this header parks under. */
const APP_BAR = 56

export function SkillHeader({ skill, saves }: { skill: Skill; saves: number }) {
  const sentinel = useRef<HTMLDivElement>(null)
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    const el = sentinel.current
    if (!el) return

    // A zero-height marker above the header: once it passes under the app bar,
    // the header is pinned. Cheaper and steadier than reading scroll offsets.
    const observer = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { rootMargin: `-${APP_BAR}px 0px 0px 0px` }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div ref={sentinel} aria-hidden className="h-px" />

      <div
        data-stuck={stuck || undefined}
        className="group/header sticky top-14 z-10 border-b border-transparent bg-background pt-1 pb-3 transition-colors data-[stuck]:border-border"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-2xl font-semibold transition-[font-size] duration-200 group-data-[stuck]/header:text-lg">
            {skill.name}
          </h1>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href={`/dashboard/skills/${skill.slug}/edit`}
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
