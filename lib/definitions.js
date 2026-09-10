import * as z from "zod";

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(1, { error: "Name must be at least 2 characters long." })
    .trim(),
  email: z.email({ error: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(5, { error: "Be at least 8 characters long." })
    .regex(/[a-zA-Z]/, { error: "Contain at least one letter." })
    .regex(/[0-9]/, { error: "Contain at least one number." })
    .trim(),
});

export const LoginFormSchema = z.object({
  email: z.email({ error: "Please enter a valid email." }).trim(),
  password: z.string().min(1, { error: "Password is required." }),
});

export const SKILL_VISIBILITIES = ["private", "unlisted", "public"];

export const SkillFormSchema = z.object({
  name: z
    .string()
    .min(1, { error: "Give the skill a name." })
    .max(100, { error: "Keep the name under 100 characters." })
    .trim(),
  description: z
    .string()
    .min(1, { error: "Describe when this skill should be used." })
    .max(300, { error: "Keep the description under 300 characters." })
    .trim(),
  content: z
    .string()
    .min(1, { error: "A skill needs some Markdown to be useful." })
    // Browsers CRLF-normalise a <textarea> on submit; store plain \n so the
    // Markdown reads cleanly wherever it is copied out to.
    .transform((value) => value.replace(/\r\n/g, "\n")),
  // Comma-separated in the form, an array in the database.
  tags: z
    .string()
    .trim()
    .transform((value) => [
      // Deduplicated: tags are lowercased, so "Git, git" is one tag.
      ...new Set(
        value
          .split(",")
          .map((tag) => tag.trim().toLowerCase())
          .filter(Boolean)
      ),
    ])
    .pipe(z.array(z.string()).max(10, { error: "Ten tags is plenty." })),
  visibility: z.enum(SKILL_VISIBILITIES),
});

/*
 * The collection shapes the app writes and reads. Documented here rather than
 * enforced — MongoDB is schemaless, so this is the reference.
 *
 * users
 *   name       string
 *   email      string, unique
 *   password   string, a bcrypt hash — never the plain text
 *   handle     string, optional. Public URL identity (/u/<handle>/<slug>).
 *              Not collected at signup yet, so the unique index on it only
 *              covers documents that actually have one.
 *   createdAt  Date
 *   updatedAt  Date, optional
 *
 * skills
 *   ownerId         ObjectId of the user
 *   slug            string, unique per owner — not globally. Two people may
 *                   both have "git-commits".
 *   name            string
 *   description     string
 *   content         string. Raw Markdown, rendered at display time. Embedded
 *                   rather than split out: every read of a skill wants it, and
 *                   it is kilobytes against a 16MB cap.
 *   tags            string[]
 *   visibility      one of SKILL_VISIBILITIES
 *   currentVersion  number, mirrors the highest `version` in skill_versions
 *   createdAt       Date
 *   updatedAt       Date
 *
 * skill_versions
 *   Append-only: every save writes one, and restoring an old version writes a
 *   new one holding the old text rather than deleting anything. That keeps
 *   undo itself undoable, and keeps `version` a genuine monotonic counter.
 *   Snapshots, not diffs — these documents are small, so restoring is a single
 *   read with no replay logic.
 *
 *   skillId      ObjectId of the skill
 *   version      number
 *   name         string
 *   description  string
 *   content      string
 *   authorId     ObjectId of the user
 *   message      string, optional. What changed, shown in the history list.
 *   createdAt    Date
 */
