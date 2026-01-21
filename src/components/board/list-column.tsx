"use client"

import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { List, useBoardStore } from "@/store/use-board-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, GripVertical, MoreHorizontal, Edit2, Trash2 } from "lucide-react"
import { CardItem } from "./card-item"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface ListColumnProps {
  list: List
  isOverlay?: boolean
}

export function ListColumn({ list, isOverlay }: ListColumnProps) {
  const { addCard, deleteList, updateList } = useBoardStore()
  const [newCardContent, setNewCardContent] = useState("")
  const [open, setOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(list.title)

  const handleUpdateList = () => {
    if (editTitle.trim() && editTitle !== list.title) {
        updateList(list.id, editTitle.trim())
    }
    setIsEditing(false)
  }

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: list.id,
    data: {
      type: "List",
      list,
    },
  })

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  }

  const handleAddCard = () => {
    if (newCardContent.trim()) {
      addCard(list.id, newCardContent.trim())
      setNewCardContent("")
      setOpen(false)
    }
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-muted/10 w-80 h-full min-h-[500px] border-2 border-dashed rounded-xl"
      />
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-white/50 dark:bg-slate-900/50 backdrop-blur-md w-80 flex flex-col rounded-xl border border-slate-200 dark:border-slate-800",
        isOverlay && "opacity-90 shadow-2xl"
      )}
    >
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <div {...attributes} {...listeners} className="cursor-grab p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
            <GripVertical className="h-4 w-4 text-slate-400" />
          </div>
          {isEditing ? (
             <Input 
                autoFocus
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleUpdateList}
                onKeyDown={(e) => e.key === 'Enter' && handleUpdateList()}
                className="h-7 text-sm font-semibold"
             />
          ) : (
            <h3 className="font-semibold text-slate-700 dark:text-slate-200 truncate cursor-pointer" onClick={() => setIsEditing(true)}>
               {list.title}
            </h3>
          )}
        </div>
        <div className="flex items-center gap-1">
            <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-500">
            {list.cards.length}
            </span>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreHorizontal className="h-4 w-4 text-slate-400" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                         <Edit2 className="h-3 w-3 mr-2" />
                         แก้ไขชื่อ
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={() => deleteList(list.id)}>
                         <Trash2 className="h-3 w-3 mr-2" />
                         ลบรายการ
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 px-3 py-2 space-y-3 overflow-y-auto">
        <SortableContext items={list.cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {list.cards.map((card) => (
            <CardItem key={card.id} card={card} />
          ))}
        </SortableContext>
      </div>

      <div className="p-3">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 text-base py-6">
              <Plus className="h-5 w-5" />
              เพิ่มเทมเพลต
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl">เพิ่มการ์ดเทมเพลตใหม่</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="content" className="text-lg">ข้อความเทมเพลต</Label>
                <p className="text-sm text-muted-foreground">ใช้ {"{{ชื่อตัวแปร}}"} เพื่อระบุคำที่ต้องการเปลี่ยน</p>
                <Textarea
                  id="content"
                  placeholder="สวัสดีคุณ {{ชื่อ}}, ยินดีต้อนรับสู่ {{เมือง}}!"
                  className="h-32 text-lg p-4"
                  value={newCardContent}
                  onChange={(e) => setNewCardContent(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" size="lg" onClick={() => setOpen(false)}>ยกเลิก</Button>
              <Button size="lg" onClick={handleAddCard}>เพิ่มเทมเพลต</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>  
  )
}
