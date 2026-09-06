import { getUser } from "@/lib/dal"
import { logout } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"

export default async function UserPage() {
  const user = await getUser()

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">{user?.name}</h1>
        <p className="text-muted-foreground">{user?.email}</p>
      </div>

      <form action={logout}>
        <Button type="submit" variant="outline">
          Sign out
        </Button>
      </form>
    </div>
  )
}
