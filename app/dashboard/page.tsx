import { IconFileText } from "@tabler/icons-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUser } from "@/lib/dal"

export default async function DashboardPage() {
  const user = await getUser()

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold">Welcome back, {user?.name}</h1>
        <p className="text-muted-foreground text-sm">
          Write and save reusable instruction documents.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your skills</CardTitle>
          <CardDescription>Everything you have written so far.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-10 text-center">
            <IconFileText className="size-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No skills yet.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
