import "server-only"

import { getDb } from "@/lib/mongodb"

export async function getUsers() {
  return (await getDb()).collection("users")
}

export async function getSkills() {
  return (await getDb()).collection("skills")
}

export async function getSkillVersions() {
  return (await getDb()).collection("skill_versions")
}

/**
 * createIndex is idempotent — an index that already exists is a no-op — so
 * these are safe to call on a hot path.
 */

export async function ensureUserIndexes() {
  const users = await getUsers()

  await Promise.all([
    users.createIndex({ email: 1 }, { unique: true }),
    // Partial, because documents without a handle would otherwise all collide
    // on a null value.
    users.createIndex(
      { handle: 1 },
      { unique: true, partialFilterExpression: { handle: { $type: "string" } } }
    ),
  ])
}

export async function ensureSkillIndexes() {
  const skills = await getSkills()
  const versions = await getSkillVersions()

  await Promise.all([
    // The natural key, and what keeps slugs unique per owner.
    skills.createIndex({ ownerId: 1, slug: 1 }, { unique: true }),
    // The dashboard list — the hottest query in the app.
    skills.createIndex({ ownerId: 1, updatedAt: -1 }),
    // Browsing what other people have published.
    skills.createIndex({ visibility: 1, updatedAt: -1 }),
    skills.createIndex(
      { name: "text", description: "text", tags: "text" },
      { name: "skill_search" }
    ),
    // Version history, newest first. Unique so two concurrent saves racing for
    // the same number fail loudly instead of quietly losing one of them.
    versions.createIndex({ skillId: 1, version: -1 }, { unique: true }),
  ])
}

/** Every index the app relies on. */
export async function ensureIndexes() {
  await Promise.all([ensureUserIndexes(), ensureSkillIndexes()])
}
