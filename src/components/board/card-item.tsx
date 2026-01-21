"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card as CardType } from "@/store/use-board-store";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, Edit2, Trash2, Palette, Sparkles } from "lucide-react";
import { useBoardStore } from "@/store/use-board-store";
import { Textarea } from "@/components/ui/textarea";
import { MiniColorPicker } from "@/components/ui/color-picker";

interface CardItemProps {
  card: CardType;
  isOverlay?: boolean;
}

export function CardItem({ card, isOverlay }: CardItemProps) {
  const { deleteCard, updateCard, updateCardColor } = useBoardStore();
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [copied, setCopied] = useState(false);
  const [quickCopied, setQuickCopied] = useState(false);
  const [editContent, setEditContent] = useState(card.content);
  const [editColor, setEditColor] = useState(card.color || "");

  const handleUpdateCard = () => {
    updateCard(card.id, editContent, editColor);
    setOpenEdit(false);
  };

  const variables = useMemo(() => {
    const matches = card.content.match(/\{\{([^}]+)\}\}/g) || [];
    return Array.from(new Set(matches.map((m) => m.replace(/\{\{|\}\}/g, ""))));
  }, [card.content]);

  const [values, setValues] = useState<Record<string, string>>({});

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
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const finalContent = useMemo(() => {
    let text = card.content;
    Object.entries(values).forEach(([key, val]) => {
      if (val) {
        text = text.replaceAll(`{{${key}}}`, val);
      }
    });
    return text;
  }, [card.content, values]);

  const handleCopy = () => {
    navigator.clipboard.writeText(finalContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQuickCopy = () => {
    navigator.clipboard.writeText(card.content);
    setQuickCopied(true);
    setTimeout(() => setQuickCopied(false), 2000);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-gradient-to-r from-pink-200/50 to-purple-200/50 dark:from-pink-900/30 dark:to-purple-900/30 h-24 border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-xl"
      />
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <div
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          className={cn(
            "p-4 rounded-xl border-2 shadow-sm hover:shadow-lg transition-all duration-200 group relative cursor-pointer",
            "hover:scale-[1.02] hover:-translate-y-0.5",
            isOverlay && "opacity-90 ring-2 ring-purple-400 shadow-2xl",
            card.color
              ? "border-white/50 dark:border-white/20"
              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600",
          )}
          style={{
            ...style,
            background: card.color || undefined,
          }}
          onClick={() => {
            if (variables.length === 0) {
              handleQuickCopy();
            } else {
              setOpen(true);
            }
          }}
        >
          {/* Quick Actions */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all flex gap-1 z-10">
            {/* Color picker */}
            <div onClick={(e) => e.stopPropagation()}>
              <MiniColorPicker
                value={card.color}
                onChange={(color) => updateCardColor(card.id, color)}
              />
            </div>
            <Button
              variant="secondary"
              size="icon"
              className="h-6 w-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-sm hover:bg-blue-50 dark:hover:bg-blue-900/30"
              onClick={(e) => {
                e.stopPropagation();
                setEditContent(card.content);
                setEditColor(card.color || "");
                setOpenEdit(true);
              }}
            >
              <Edit2 className="h-3 w-3 text-blue-500" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-6 w-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-sm hover:bg-red-50 dark:hover:bg-red-900/30"
              onClick={(e) => {
                e.stopPropagation();
                deleteCard(card.id);
              }}
            >
              <Trash2 className="h-3 w-3 text-red-500" />
            </Button>
          </div>

          {/* Content */}
          <p
            className={cn(
              "text-sm line-clamp-3 pointer-events-none leading-relaxed",
              card.color
                ? "text-slate-800 dark:text-slate-100 drop-shadow-sm"
                : "text-slate-600 dark:text-slate-300",
            )}
          >
            {card.content.split("\n")[0]}
            {card.content.includes("\n") && "..."}
          </p>

          {/* Variable Tags & Copy Status */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 pointer-events-none">
            {variables.map((v) => (
              <span
                key={v}
                className={cn(
                  "text-[10px] px-2 py-0.5 rounded-full font-medium",
                  card.color
                    ? "bg-white/70 dark:bg-black/30 text-slate-700 dark:text-slate-200"
                    : "bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/40 dark:to-purple-900/40 text-purple-700 dark:text-purple-300",
                )}
              >
                <Sparkles className="h-2.5 w-2.5 inline mr-1" />
                {v}
              </span>
            ))}
            {variables.length === 0 && quickCopied && (
              <span className="text-[11px] bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-full font-medium animate-in fade-in zoom-in flex items-center gap-1">
                <Check className="h-3 w-3" />
                คัดลอกแล้ว!
              </span>
            )}
            {variables.length === 0 && !quickCopied && (
              <span
                className={cn(
                  "text-[10px] px-2 py-0.5 rounded-full",
                  card.color
                    ? "bg-white/50 dark:bg-black/20 text-slate-600 dark:text-slate-300"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400",
                )}
              >
                คลิกเพื่อคัดลอก
              </span>
            )}
          </div>
        </div>

        {/* Use Template Dialog */}
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-purple-500" />
              ใช้งานเทมเพลต
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 text-sm">
                  1
                </span>
                กรอกตัวแปร
              </h4>
              {variables.length === 0 && (
                <p className="text-base text-muted-foreground italic">
                  ไม่พบตัวแปรในเทมเพลตนี้
                </p>
              )}
              <div className="space-y-4">
                {variables.map((v) => (
                  <div key={v} className="grid gap-2">
                    <Label
                      htmlFor={`var-${v}`}
                      className="text-base font-medium flex items-center gap-2"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-purple-500" />
                      {v}
                    </Label>
                    <Input
                      id={`var-${v}`}
                      placeholder={`ระบุ ${v}...`}
                      className="h-11 text-base"
                      value={values[v] || ""}
                      onChange={(e) =>
                        setValues((prev) => ({ ...prev, [v]: e.target.value }))
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 text-sm">
                    2
                  </span>
                  ตัวอย่างข้อความ
                </h4>
                <Button
                  size="sm"
                  className={cn(
                    "h-9 gap-2 text-base px-4 transition-all",
                    copied
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700",
                  )}
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copied ? "คัดลอกแล้ว!" : "คัดลอก"}
                </Button>
              </div>
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6 rounded-2xl border-2 border-dashed text-base font-mono whitespace-pre-wrap min-h-[240px] max-h-[400px] overflow-y-auto shadow-inner">
                {finalContent}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Edit2 className="h-5 w-5 text-blue-500" />
              แก้ไขเทมเพลต
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-content" className="text-base font-medium">
                ข้อความ
              </Label>
              <Textarea
                id="edit-content"
                className="min-h-[150px] text-base"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                💡 ใช้ {"{{ชื่อตัวแปร}}"} เพื่อระบุคำที่ต้องการเปลี่ยน
              </p>
            </div>
            <div className="grid gap-2">
              <Label className="text-base font-medium flex items-center gap-2">
                <Palette className="h-4 w-4" />
                สีพื้นหลัง
              </Label>
              <div className="flex items-center gap-3">
                <MiniColorPicker value={editColor} onChange={setEditColor} />
                <span className="text-sm text-muted-foreground">
                  {editColor ? "กำหนดสีแล้ว" : "ไม่มีสี"}
                </span>
                {editColor && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditColor("")}
                  >
                    ล้างสี
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setOpenEdit(false)}
            >
              ยกเลิก
            </Button>
            <Button
              size="lg"
              onClick={handleUpdateCard}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            >
              บันทึก
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
