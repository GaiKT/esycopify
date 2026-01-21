"use client"

import { useParams } from "next/navigation"
import { useBoardStore } from "@/store/use-board-store"
import { useEffect, useState } from "react"
import { BoardCanvas } from "@/components/board/board-canvas"
import { Button } from "@/components/ui/button"
import { Plus, ChevronLeft } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function BoardPage() {
  const { id } = useParams()
  const { boards, addList, setActiveBoard, activeBoard, fetchBoards, loading } = useBoardStore()
  const [newListTitle, setNewListTitle] = useState("")
  const [open, setOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    if (boards.length === 0) {
      fetchBoards()
    }
  }, [boards.length, fetchBoards])

  useEffect(() => {
    if (boards.length > 0) {
      const board = boards.find(b => b.id === id)
      if (board) {
        setActiveBoard(board)
      }
    }
  }, [id, boards, setActiveBoard])

  const handleAddList = () => {
    if (newListTitle.trim() && id) {
      addList(id as string, newListTitle.trim())
      setNewListTitle("")
      setOpen(false)
    }
  }

  if (!isMounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading board...</p>
        </div>
      </div>
    )
  }

  if (!activeBoard) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <p className="text-xl font-semibold">Board not found</p>
          <Link href="/">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-background/50 backdrop-blur-sm border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h2 className="text-2xl font-bold">{activeBoard.title}</h2>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" className="gap-2">
              <Plus className="h-4 w-4" />
              Add List
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New List</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="list-title">List Title</Label>
                <Input
                  id="list-title"
                  placeholder="e.g. Work Emails"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddList()}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleAddList}>Add</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 overflow-x-auto p-6">
        <BoardCanvas board={activeBoard} />
      </div>
    </div>
  )
}
