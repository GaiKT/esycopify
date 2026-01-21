"use client";

import { useEffect, useState } from "react";
import { useBoardStore } from "@/store/use-board-store";
import { Button } from "@/components/ui/button";
import { Palette, Sparkles } from "lucide-react";
import { ColorPicker } from "@/components/ui/color-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BoardCanvas } from "@/components/board/board-canvas";
import { cn } from "@/lib/utils";

export default function MainPage() {
  const { activeBoard, fetchOrCreateBoard, updateBoardColor, loading } =
    useBoardStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchOrCreateBoard();
  }, [fetchOrCreateBoard]);

  // Loading state
  if (!isMounted || loading) {
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
          "bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 dark:from-slate-950 dark:via-purple-950/20 dark:to-pink-950/20",
      )}
      style={{ background: activeBoard.color || undefined }}
    >
      {/* Header */}
      <div
        className={cn(
          "backdrop-blur-md border-b px-6 py-4 flex items-center justify-between",
          activeBoard.color
            ? "bg-white/40 dark:bg-black/20 border-white/30"
            : "bg-white/70 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800",
        )}
      >
        <div className="flex items-center gap-4">
          <div>
            <h2
              className={cn(
                "text-2xl font-bold",
                activeBoard.color
                  ? "text-slate-800 dark:text-white drop-shadow-sm"
                  : "",
              )}
            >
              {activeBoard.title}
            </h2>
            <p
              className={cn(
                "text-sm",
                activeBoard.color
                  ? "text-slate-600 dark:text-slate-300"
                  : "text-muted-foreground",
              )}
            >
              {activeBoard.lists.length} รายการ ·{" "}
              {activeBoard.lists.reduce((acc, l) => acc + l.cards.length, 0)}{" "}
              การ์ด
            </p>
          </div>
        </div>

        {/* Color Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "rounded-full",
                activeBoard.color
                  ? "bg-white/50 hover:bg-white/70 border-white/50 dark:bg-black/30 dark:hover:bg-black/40 dark:border-white/20"
                  : "",
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

      {/* Board Canvas */}
      <div className="p-6 flex-1 overflow-x-auto">
        <BoardCanvas board={activeBoard} />
      </div>
    </div>
  );
}
