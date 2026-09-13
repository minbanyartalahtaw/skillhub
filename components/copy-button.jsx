"use client"

import { useEffect, useRef, useState } from "react"
import { IconCheck, IconCopy } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"

export function CopyButton({ value, label = "Copy" }) {
  const [status, setStatus] = useState("idle")
  const timer = useRef(null)

  // A click while the "Copied" label is still showing would otherwise leave a
  // stale timer to clear the new one early.
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  async function copy() {
    if (timer.current) clearTimeout(timer.current)
    try {
      // Needs a secure context — https, or localhost in development.
      await navigator.clipboard.writeText(value)
      setStatus("copied")
    } catch {
      setStatus("failed")
    }
    timer.current = setTimeout(() => setStatus("idle"), 2000)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={copy}
      aria-label={label}
      className="text-muted-foreground"
    >
      {status === "copied" ? <IconCheck /> : <IconCopy />}
      {status === "copied" ? "Copied" : status === "failed" ? "Failed" : label}
    </Button>
  )
}
