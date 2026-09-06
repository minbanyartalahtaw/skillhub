"use server"

import { ObjectId } from "mongodb"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import * as z from "zod"

import {
  ensureSkillIndexes,
  getSkills,
  getSkillVersions,
} from "@/lib/collections"
import { verifySession } from "@/lib/dal"
import { SkillFormSchema, type SkillFormState } from "@/lib/definitions"
import { slugify } from "@/lib/skills"

function parse(formData: FormData) {
  return SkillFormSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    content: formData.get("content"),
    tags: formData.get("tags") ?? "",
    visibility: formData.get("visibility"),
  })
}

/** Sidebar and dashboard both read the owner's list, so refresh the layout. */
function refreshSkillViews() {
  revalidatePath("/user", "layout")
}

export async function createSkill(
  _state: SkillFormState,
  formData: FormData
): Promise<SkillFormState> {
  const validated = parse(formData)
  if (!validated.success) {
    return { errors: z.flattenError(validated.error).fieldErrors }
  }

  const session = await verifySession()
  const { name, description, content, tags, visibility } = validated.data
  const ownerId = new ObjectId(session.userId)
  const skills = await getSkills()
  const versions = await getSkillVersions()

  await ensureSkillIndexes()

  const now = new Date()
  const base = slugify(name)

  // {ownerId, slug} is unique, so a clash is a duplicate-key error rather than
  // an overwrite. Walk suffixes until one sticks.
  let slug = base
  let skillId: ObjectId | null = null

  for (let attempt = 1; attempt <= 20 && !skillId; attempt++) {
    slug = attempt === 1 ? base : `${base}-${attempt}`
    try {
      const result = await skills.insertOne({
        ownerId,
        slug,
        name,
        description,
        content,
        tags,
        visibility,
        currentVersion: 1,
        createdAt: now,
        updatedAt: now,
      })
      skillId = result.insertedId
    } catch (error) {
      if (!isDuplicateKey(error)) throw error
    }
  }

  if (!skillId) {
    return { message: "Could not find a free URL for that name. Try another." }
  }

  await versions.insertOne({
    skillId,
    version: 1,
    name,
    description,
    content,
    authorId: ownerId,
    message: "Created",
    createdAt: now,
  })

  refreshSkillViews()
  redirect(`/user/skills/${slug}`)
}

export async function updateSkill(
  skillId: string,
  _state: SkillFormState,
  formData: FormData
): Promise<SkillFormState> {
  const validated = parse(formData)
  if (!validated.success) {
    return { errors: z.flattenError(validated.error).fieldErrors }
  }

  const session = await verifySession()
  const { name, description, content, tags, visibility } = validated.data
  const ownerId = new ObjectId(session.userId)
  const skills = await getSkills()
  const versions = await getSkillVersions()

  // $inc claims the next version number atomically, so two tabs saving at once
  // get 4 and 5 rather than both trying for 4.
  const updated = await skills.findOneAndUpdate(
    { _id: new ObjectId(skillId), ownerId },
    {
      $set: {
        name,
        description,
        content,
        tags,
        visibility,
        updatedAt: new Date(),
      },
      $inc: { currentVersion: 1 },
    },
    { returnDocument: "after" }
  )

  if (!updated) {
    return { message: "That skill no longer exists." }
  }

  await versions.insertOne({
    skillId: updated._id,
    version: updated.currentVersion,
    name,
    description,
    content,
    authorId: ownerId,
    createdAt: updated.updatedAt,
  })

  refreshSkillViews()
  redirect(`/user/skills/${updated.slug}`)
}

/**
 * Restoring writes a new version holding the old text. Nothing is deleted, so
 * the restore itself can be undone.
 */
export async function restoreSkillVersion(skillId: string, version: number) {
  const session = await verifySession()
  const ownerId = new ObjectId(session.userId)
  const skills = await getSkills()
  const versions = await getSkillVersions()

  const snapshot = await versions.findOne({
    skillId: new ObjectId(skillId),
    version,
  })
  if (!snapshot) return

  const updated = await skills.findOneAndUpdate(
    { _id: new ObjectId(skillId), ownerId },
    {
      $set: {
        name: snapshot.name,
        description: snapshot.description,
        content: snapshot.content,
        updatedAt: new Date(),
      },
      $inc: { currentVersion: 1 },
    },
    { returnDocument: "after" }
  )
  if (!updated) return

  await versions.insertOne({
    skillId: updated._id,
    version: updated.currentVersion,
    name: snapshot.name,
    description: snapshot.description,
    content: snapshot.content,
    authorId: ownerId,
    message: `Restored v${version}`,
    createdAt: updated.updatedAt,
  })

  refreshSkillViews()
  redirect(`/user/skills/${updated.slug}`)
}

export async function deleteSkill(skillId: string) {
  const session = await verifySession()
  const ownerId = new ObjectId(session.userId)
  const skills = await getSkills()
  const versions = await getSkillVersions()

  const deleted = await skills.findOneAndDelete({
    _id: new ObjectId(skillId),
    ownerId,
  })
  if (!deleted) return

  // The history has no owner of its own, so it goes with the skill.
  await versions.deleteMany({ skillId: deleted._id })

  refreshSkillViews()
  redirect("/user")
}

function isDuplicateKey(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: number }).code === 11000
  )
}
