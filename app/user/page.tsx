import Link from "next/link"
import { IconFileText, IconPlus } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { listSkills } from "@/lib/skills"

export default async function UserPage() {
  const skills = await listSkills()

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">
            Write and save reusable instruction documents.
          </p>
        </div>
        <Link href="/user/skills/new" className={buttonVariants()}>
          <IconPlus />
          New skill
        </Link>
      </div>

      {skills.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-12 text-center">
          <IconFileText className="size-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No skills yet. Write your first one.
          </p>
          <Link
            href="/user/skills/new"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <IconPlus />
            New skill
          </Link>
        </div>
      ) : (
        <ul className="divide-y rounded-lg border">
          {skills.map((skill) => (
            <li key={skill.id}>
              <Link
                href={`/user/skills/${skill.slug}`}
                className="flex flex-col gap-1 p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{skill.name}</span>
                  <Badge variant="secondary">{skill.visibility}</Badge>
                  {skill.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {skill.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  v{skill.currentVersion} · edited{" "}
                  {skill.updatedAt.toLocaleDateString()}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
