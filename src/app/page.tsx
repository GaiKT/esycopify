"use client"

import { useEffect, useState } from "react"
import { useBoardStore } from "@/store/use-board-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Layout, MoreHorizontal, Edit2, Trash2 } from "lucide-react"
import Link from "next/link"
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
import { Board } from "@/store/use-board-store"

export default function DashboardPage() {
  const { boards, addBoard, fetchBoards, deleteBoard, updateBoard, loading } = useBoardStore()
  const [newBoardTitle, setNewBoardTitle] = useState("")
  const [open, setOpen] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [boardToEdit, setBoardToEdit] = useState<Board | null>(null)
  const [editTitle, setEditTitle] = useState("")

  const handleUpdateBoard = () => {
      if (boardToEdit && editTitle.trim()) {
          updateBoard(boardToEdit.id, editTitle.trim())
          setOpenEdit(false)
          setBoardToEdit(null)
      }
  }

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
          <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">กระดานของคุณ</h2>
          <p className="text-lg text-muted-foreground mt-2">จัดการข้อความเทมเพลตและจัดระเบียบงานของคุณได้ง่ายๆ</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2 text-lg shadow-lg hover:shadow-primary/25 transition-all">
              <Plus className="h-5 w-5" />
              สร้างกระดานใหม่
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl">ตั้งชื่อกระดานใหม่</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title" className="text-lg">ชื่อกระดาน</Label>
                <Input
                  id="title"
                  placeholder="เช่น: ตอบแชทลูกค้า, รหัสส่วนลด"
                  className="text-lg h-12"
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateBoard()}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" size="lg" onClick={() => setOpen(false)}>ยกเลิก</Button>
              <Button size="lg" onClick={handleCreateBoard}>ยืนยันการสร้าง</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={openEdit} onOpenChange={setOpenEdit}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl">แก้ไขชื่อกระดาน</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="edit-title" className="text-lg">ชื่อกระดาน</Label>
                        <Input
                            id="edit-title"
                            className="text-lg h-12"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleUpdateBoard()}
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-3">
                    <Button variant="outline" size="lg" onClick={() => setOpenEdit(false)}>ยกเลิก</Button>
                    <Button size="lg" onClick={handleUpdateBoard}>บันทึก</Button>
                </div>
            </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {boards.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center p-16 border-2 border-dashed rounded-2xl bg-background/50 backdrop-blur-sm">
            <Layout className="h-16 w-16 text-muted-foreground mb-6 opacity-50" />
            <p className="text-2xl font-medium mb-2">ยังไม่มีกระดาน</p>
            <p className="text-lg text-muted-foreground mb-8">เริ่มสร้างกระดานแรกของคุณเพื่อจัดระเบียบข้อความเทมเพลต</p>
            <Button variant="outline" size="lg" className="text-lg" onClick={() => setOpen(true)}>สร้างกระดานเลย</Button>
          </div>
        ) : (
          boards.map((board) => (
            <Link key={board.id} href={`/board/${board.id}`}>
              <Card className="hover:border-primary transition-colors cursor-pointer group relative">
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background" onClick={(e) => e.preventDefault()}>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                             <DropdownMenuItem onClick={(e) => {
                                 e.preventDefault()
                                 setBoardToEdit(board)
                                 setEditTitle(board.title)
                                 setOpenEdit(true)
                             }}>
                                <Edit2 className="h-4 w-4 mr-2" />
                                แก้ไขชื่อ
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={(e) => {
                                e.preventDefault()
                                deleteBoard(board.id)
                            }}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                ลบกระดาน
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <CardHeader className="pb-4">
                  <CardTitle className="group-hover:text-primary transition-colors truncate pr-8">
                    {board.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {board.lists.length} รายการ
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
