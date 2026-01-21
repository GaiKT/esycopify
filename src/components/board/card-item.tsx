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
import { Copy, Check, ExternalLink, Edit2, Trash2 } from "lucide-react"
import { useBoardStore } from "@/store/use-board-store"
import { Textarea } from "@/components/ui/textarea"

interface CardItemProps {
  card: CardType
  isOverlay?: boolean
}

export function CardItem({ card, isOverlay }: CardItemProps) {
  const { deleteCard, updateCard } = useBoardStore()
  const [open, setOpen] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [copied, setCopied] = useState(false)
  const [editContent, setEditContent] = useState(card.content)

  const handleUpdateCard = () => {
       updateCard(card.id, editContent)
       setOpenEdit(false)
  }
  
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
    <>
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
        onClick={() => {
            if (variables.length === 0) {
                handleCopy()
            } else {
                setOpen(true)
            }
        }}
      >
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white dark:bg-slate-800 p-1 rounded shadow-sm">
           <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-blue-500" onClick={(e) => {
               e.stopPropagation()
               setOpenEdit(true)
           }}>
             <Edit2 className="h-3 w-3" />
           </Button>
           <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-red-500" onClick={(e) => {
               e.stopPropagation()
               deleteCard(card.id)
           }}>
             <Trash2 className="h-3 w-3" />
           </Button>
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
          {variables.length === 0 && copied && (
              <span className="text-[10px] bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0.5 rounded font-medium animate-in fade-in zoom-in">
                  คัดลอกแล้ว!
              </span>
          )}
        </div>
      </div>

      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">ใช้งานเทมเพลต</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
          <div className="space-y-4">
            <h4 className="text-lg font-medium">ตัวแปรที่ต้องกรอก</h4>
            {variables.length === 0 && (
              <p className="text-base text-muted-foreground italic">ไม่พบตัวแปรในเทมเพลตนี้</p>
            )}
            <div className="space-y-4">
              {variables.map(v => (
                <div key={v} className="grid gap-2">
                  <Label htmlFor={`var-${v}`} className="text-base">{v}</Label>
                  <Input
                    id={`var-${v}`}
                    placeholder={`ระบุ ${v}...`}
                    className="h-11 text-base"
                    value={values[v] || ""}
                    onChange={(e) => setValues(prev => ({ ...prev, [v]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium">ตัวอย่างข้อความ</h4>
              <Button size="sm" variant="outline" className="h-9 gap-2 text-base px-4" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "คัดลอกแล้ว" : "คัดลอก"}
              </Button>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border text-base font-mono whitespace-pre-wrap min-h-[240px] max-h-[400px] overflow-y-auto shadow-inner">
              {finalContent}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>แก้ไขเทมเพลต</DialogTitle>
            </DialogHeader>
            <div className="py-4">
                <div className="grid gap-2">
                    <Label htmlFor="edit-content">ข้อความ</Label>
                    <Textarea
                        id="edit-content"
                        className="h-32 text-lg"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpenEdit(false)}>ยกเลิก</Button>
                <Button onClick={handleUpdateCard}>บันทึก</Button>
            </div>
        </DialogContent>
    </Dialog>
    </>
  )
}
