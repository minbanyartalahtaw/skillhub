import "server-only"

import { cache } from "react"
import { ObjectId } from "mongodb"

import { getSkills, getSkillVersions } from "@/lib/collections"
import { verifySession } from "@/lib/dal"

export function slugify(name) {
  const slug = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)

  // A name of nothing but punctuation still needs a URL.
  return slug || "skill"
}

/**
 * The owner's skills, newest edit first. Skips `content`, which is the bulk of
 * a document and is never shown in a list — everything else a list row needs
 * comes back.
 */
export const listSkills = cache(async (limit) => {
  const session = await verifySession()
  const skills = await getSkills()

  const cursor = skills
    .find(
      { ownerId: new ObjectId(session.userId) },
      { projection: { content: 0 } }
    )
    .sort({ updatedAt: -1 })

  if (limit) cursor.limit(limit)

  return (await cursor.toArray()).map((doc) => ({
    id: doc._id.toString(),
    slug: doc.slug,
    name: doc.name,
    description: doc.description,
    tags: doc.tags,
    visibility: doc.visibility,
    currentVersion: doc.currentVersion,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }))
})

/** One skill as the UI sees it: plain values, no ObjectIds. */
export const getSkillBySlug = cache(async (slug) => {
  const session = await verifySession()
  const skills = await getSkills()

  const doc = await skills.findOne({
    ownerId: new ObjectId(session.userId),
    slug,
  })

  if (!doc) return null

  return {
    id: doc._id.toString(),
    slug: doc.slug,
    name: doc.name,
    description: doc.description,
    content: doc.content,
    tags: doc.tags,
    visibility: doc.visibility,
    currentVersion: doc.currentVersion,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
})

/** History for a skill, newest first. The bodies stay in the database. */
export async function listSkillVersions(skillId) {
  const session = await verifySession()
  const skills = await getSkills()

  // Confirm the caller owns the skill before handing back its history.
  const owns = await skills.findOne(
    { _id: new ObjectId(skillId), ownerId: new ObjectId(session.userId) },
    { projection: { _id: 1 } }
  )
  if (!owns) return []

  const versions = await getSkillVersions()

  return (
    await versions
      .find({ skillId: new ObjectId(skillId) }, { projection: { content: 0 } })
      .sort({ version: -1 })
      .toArray()
  ).map((doc) => ({
    id: doc._id.toString(),
    version: doc.version,
    name: doc.name,
    description: doc.description,
    message: doc.message,
    createdAt: doc.createdAt,
  }))
}
