"use client";

import { useEffect, useState, useRef } from "react";
import { useBoardStore } from "@/store/use-board-store";
import { Button } from "@/components/ui/button";
import { Palette, Sparkles, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ColorPicker } from "@/components/ui/color-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BoardCanvas } from "@/components/board/board-canvas";
import { TutorialDialog } from "@/components/tutorial-dialog";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const {
    activeBoard,
    fetchOrCreateBoard,
    updateBoard,
    updateBoardColor,
    loading,
  } = useBoardStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);

    // Check authentication
    const checkAuth = async () => {
      if (!supabase) {
        router.push("/login");
        return;
      }
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
        return;
      }
      setIsAuthenticated(true);
      fetchOrCreateBoard();
    };

    checkAuth();
  }, [fetchOrCreateBoard, router, supabase]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleStartEditTitle = () => {
    if (activeBoard) {
      setEditTitle(activeBoard.title);
      setIsEditingTitle(true);
    }
  };

  const handleSaveTitle = () => {
    if (activeBoard && editTitle.trim() && editTitle !== activeBoard.title) {
      updateBoard(activeBoard.id, editTitle.trim(), activeBoard.color);
    }
    setIsEditingTitle(false);
  };

  const handleCancelEditTitle = () => {
    setIsEditingTitle(false);
    setEditTitle("");
  };

  // Loading state
  if (!isMounted || loading || isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-purple-500" />
          </div>
          <p className="text-muted-foreground text-lg font-medium">
            กำลังโหลดข้อมูล...
          </p>
        </div>
      </div>
    );
  }

  if (!activeBoard) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-purple-500" />
          </div>
          <p className="text-muted-foreground text-lg font-medium">
            กำลังสร้างกระดานของคุณ...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "h-full w-full flex flex-col min-h-[calc(100vh-3.5rem)] transition-all duration-300",
        !activeBoard.color &&
          "bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 dark:from-slate-950 dark:via-purple-950/20 dark:to-pink-950/20"
      )}
      style={{ background: activeBoard.color || undefined }}
    >
      {/* Header */}
      <div
        className={cn(
          "backdrop-blur-md border-b px-6 py-4 flex items-center justify-between",
          activeBoard.color
            ? "bg-white/40 dark:bg-black/20 border-white/30"
            : "bg-white/70 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800"
        )}
      >
        <div className="flex items-center gap-4">
          <div>
            {isEditingTitle ? (
              <Input
                ref={titleInputRef}
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveTitle();
                  if (e.key === "Escape") handleCancelEditTitle();
                }}
                className={cn(
                  "text-2xl font-bold h-10 px-2 -ml-2",
                  activeBoard.color
                    ? "bg-white/50 border-white/50"
                    : "bg-white dark:bg-slate-900"
                )}
              />
            ) : (
              <h2
                onClick={handleStartEditTitle}
                className={cn(
                  "text-2xl font-bold cursor-pointer hover:opacity-70 transition-opacity group flex items-center gap-2",
                  activeBoard.color
                    ? "text-slate-800 dark:text-white drop-shadow-sm"
                    : ""
                )}
                title="คลิกเพื่อแก้ไขชื่อ"
              >
                {activeBoard.title}
                <Pencil className="h-4 w-4 opacity-0 group-hover:opacity-50 transition-opacity" />
              </h2>
            )}
            <p
              className={cn(
                "text-sm",
                activeBoard.color
                  ? "text-slate-600 dark:text-slate-300"
                  : "text-muted-foreground"
              )}
            >
              {activeBoard.lists.length} รายการ ·{" "}
              {activeBoard.lists.reduce((acc, l) => acc + l.cards.length, 0)}{" "}
              การ์ด
            </p>
          </div>
        </div>

        {/* Help & Color Picker */}
        <div className="flex items-center gap-2">
          <TutorialDialog />

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "rounded-full",
                  activeBoard.color
                    ? "bg-white/50 hover:bg-white/70 border-white/50 dark:bg-black/30 dark:hover:bg-black/40 dark:border-white/20"
                    : ""
                )}
              >
                <Palette className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto" align="end">
              <div className="space-y-3">
                <h4 className="font-medium text-sm">เปลี่ยนสีพื้นหลัง</h4>
                <ColorPicker
                  value={activeBoard.color}
                  onChange={(color) => updateBoardColor(activeBoard.id, color)}
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Board Canvas */}
      <div className="p-6 flex-1 overflow-x-auto">
        <BoardCanvas board={activeBoard} />
      </div>
    </div>
  );
}
