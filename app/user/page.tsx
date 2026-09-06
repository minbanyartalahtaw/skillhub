import { redirect } from "next/navigation"

// The signed-in home moved to /dashboard; kept so existing links keep working.
export default function UserPage() {
  redirect("/dashboard")
}
