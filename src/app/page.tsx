"use client"

import { useEffect, useState } from "react"
import { useBoardStore } from "@/store/use-board-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Layout } from "lucide-react"
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

export default function DashboardPage() {
  const { boards, addBoard, fetchBoards, loading } = useBoardStore()
  const [newBoardTitle, setNewBoardTitle] = useState("")
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetchBoards()
  }, [fetchBoards])

  const handleCreateBoard = () => {
    if (newBoardTitle.trim()) {
      addBoard(newBoardTitle.trim())
      setNewBoardTitle("")
      setOpen(false)
    }
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Your Boards</h2>
          <p className="text-muted-foreground">Manage your text templates and snippets.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Board
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Board</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Board Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Daily Templates"
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateBoard()}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateBoard}>Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {boards.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-background/50">
            <Layout className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-xl font-medium">No boards yet</p>
            <p className="text-muted-foreground mb-6">Create your first board to start organizing templates.</p>
            <Button variant="outline" onClick={() => setOpen(true)}>Create Board</Button>
          </div>
        ) : (
          boards.map((board) => (
            <Link key={board.id} href={`/board/${board.id}`}>
              <Card className="hover:border-primary transition-colors cursor-pointer group">
                <CardHeader className="pb-4">
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {board.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {board.lists.length} lists
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
