import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "cn"

/**
 * Skills are stored as raw Markdown, so rendering happens here at display time.
 * Tailwind's preflight strips heading and list styling, so the elements get
 * their look back explicitly rather than through a typography plugin.
 *
 * Each override merges the incoming className rather than replacing it —
 * remark-gfm labels task lists with one, and dropping it would take these
 * styles with it.
 */
export function SkillMarkdown({ content }: { content: string }) {
  return (
    <div className="text-sm leading-relaxed">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ className, ...props }) => (
            <h1
              className={cn("mt-6 mb-3 text-xl font-semibold first:mt-0", className)}
              {...props}
            />
          ),
          h2: ({ className, ...props }) => (
            <h2
              className={cn("mt-6 mb-2 text-lg font-semibold first:mt-0", className)}
              {...props}
            />
          ),
          h3: ({ className, ...props }) => (
            <h3
              className={cn("mt-5 mb-2 font-semibold first:mt-0", className)}
              {...props}
            />
          ),
          p: ({ className, ...props }) => (
            <p className={cn("my-3", className)} {...props} />
          ),
          ul: ({ className, ...props }) => (
            <ul
              className={cn(
                "my-3 list-disc space-y-1 pl-5",
                // A task list carries its own checkboxes; bullets as well would
                // be one marker too many.
                "[&:has(>li>input)]:list-none [&:has(>li>input)]:pl-0.5",
                className
              )}
              {...props}
            />
          ),
          ol: ({ className, ...props }) => (
            <ol
              className={cn("my-3 list-decimal space-y-1 pl-5", className)}
              {...props}
            />
          ),
          li: ({ className, ...props }) => (
            <li
              className={cn("[&>input]:mr-1.5 [&>input]:align-[-0.1em]", className)}
              {...props}
            />
          ),
          a: ({ className, ...props }) => (
            <a
              className={cn(
                "text-green-600 underline underline-offset-2 dark:text-green-500",
                className
              )}
              {...props}
            />
          ),
          blockquote: ({ className, ...props }) => (
            <blockquote
              className={cn("my-3 border-l-2 pl-4 text-muted-foreground", className)}
              {...props}
            />
          ),
          code: ({ className, ...props }) =>
            // Fenced blocks arrive wrapped in <pre>; inline code does not.
            className?.includes("language-") ? (
              <code className={className} {...props} />
            ) : (
              <code
                className={cn(
                  "rounded bg-muted px-1 py-0.5 font-mono text-[0.85em]",
                  className
                )}
                {...props}
              />
            ),
          pre: ({ className, ...props }) => (
            <pre
              className={cn(
                "my-3 overflow-x-auto rounded-md bg-muted p-3 font-mono text-xs",
                className
              )}
              {...props}
            />
          ),
          table: ({ className, ...props }) => (
            <div className="my-3 overflow-x-auto">
              <table className={cn("w-full text-left", className)} {...props} />
            </div>
          ),
          th: ({ className, ...props }) => (
            <th
              className={cn("border-b px-2 py-1.5 font-medium", className)}
              {...props}
            />
          ),
          td: ({ className, ...props }) => (
            <td className={cn("border-b px-2 py-1.5", className)} {...props} />
          ),
          hr: ({ className, ...props }) => (
            <hr className={cn("my-6", className)} {...props} />
          ),
        }}
      >
        {content}
      </Markdown>
    </div>
  )
}
