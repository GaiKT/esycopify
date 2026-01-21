"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card as CardType } from "@/store/use-board-store"
import { cn } from "@/lib/utils"
import { useState, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Check, ExternalLink } from "lucide-react"

interface CardItemProps {
  card: CardType
  isOverlay?: boolean
}

export function CardItem({ card, isOverlay }: CardItemProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  
  const variables = useMemo(() => {
    const matches = card.content.match(/\{\{([^}]+)\}\}/g) || []
    return Array.from(new Set(matches.map(m => m.replace(/\{\{|\}\}/g, ''))))
  }, [card.content])

  const [values, setValues] = useState<Record<string, string>>({})

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: "Card",
      card,
    },
  })

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  }

  const finalContent = useMemo(() => {
    let text = card.content
    Object.entries(values).forEach(([key, val]) => {
      if (val) {
        text = text.replaceAll(`{{${key}}}`, val)
      }
    })
    return text
  }, [card.content, values])

  const handleCopy = () => {
    navigator.clipboard.writeText(finalContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-muted/20 h-24 border-2 border-dashed rounded-lg"
      />
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={cn(
          "bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow group relative cursor-pointer",
          isOverlay && "opacity-90 ring-2 ring-primary"
        )}
        onClick={() => setOpen(true)}
      >
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <ExternalLink className="h-3 w-3 text-slate-400" />
        </div>
        <p className="text-sm line-clamp-3 text-slate-600 dark:text-slate-300 pointer-events-none">
          {card.content.split('\n')[0]}
          {card.content.includes('\n') && '...'}
        </p>
        <div className="mt-2 flex flex-wrap gap-1 pointer-events-none">
          {variables.map(v => (
            <span key={v} className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono">
              {v}
            </span>
          ))}
        </div>
      </div>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Use Template</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Variables</h4>
            {variables.length === 0 && (
              <p className="text-sm text-muted-foreground italic">No variables found in this template.</p>
            )}
            <div className="space-y-3">
              {variables.map(v => (
                <div key={v} className="grid gap-1.5">
                  <Label htmlFor={`var-${v}`}>{v}</Label>
                  <Input
                    id={`var-${v}`}
                    placeholder={`Enter ${v}...`}
                    value={values[v] || ""}
                    onChange={(e) => setValues(prev => ({ ...prev, [v]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Preview</h4>
              <Button size="sm" variant="outline" className="h-8 gap-2" onClick={handleCopy}>
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border text-sm font-mono whitespace-pre-wrap min-h-[200px] max-h-[400px] overflow-y-auto">
              {finalContent}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
