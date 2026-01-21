"use client";

import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { List, useBoardStore } from "@/store/use-board-store";
import { Button } from "@/components/ui/button";
import {
  Plus,
  GripVertical,
  MoreHorizontal,
  Edit2,
  Trash2,
  Sparkles,
  Variable,
  X,
} from "lucide-react";
import { CardItem } from "./card-item";
import { useState, useRef, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Pre-defined common variable names
const COMMON_VARIABLES = [
  "ชื่อ",
  "นามสกุล",
  "บริษัท",
  "วันที่",
  "เวลา",
  "ราคา",
  "จำนวน",
  "เบอร์โทร",
  "อีเมล",
  "ที่อยู่",
];

interface ListColumnProps {
  list: List;
  isOverlay?: boolean;
}

export function ListColumn({ list, isOverlay }: ListColumnProps) {
  const { addCard, deleteList, updateList } = useBoardStore();
  const [newCardContent, setNewCardContent] = useState("");
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(list.title);
  const [customVarName, setCustomVarName] = useState("");
  const [isVarPopoverOpen, setIsVarPopoverOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isAddingCard && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isAddingCard]);

  const handleUpdateList = () => {
    if (editTitle.trim() && editTitle !== list.title) {
      updateList(list.id, editTitle.trim());
    }
    setIsEditing(false);
  };

  // Insert variable at cursor position
  const insertVariable = (varName: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = newCardContent;
    const varText = `{{${varName}}}`;

    const newContent = text.substring(0, start) + varText + text.substring(end);
    setNewCardContent(newContent);

    // Set cursor position after the inserted variable
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + varText.length;
    }, 0);

    setIsVarPopoverOpen(false);
    setCustomVarName("");
  };

  const handleAddCustomVariable = () => {
    if (customVarName.trim()) {
      insertVariable(customVarName.trim());
    }
  };

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
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const handleAddCard = () => {
    if (newCardContent.trim()) {
      addCard(list.id, newCardContent.trim());
      setNewCardContent("");
      setIsAddingCard(false);
    }
  };

  const handleCancelAddCard = () => {
    setNewCardContent("");
    setIsAddingCard(false);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-gradient-to-b from-purple-100/50 to-pink-100/50 dark:from-purple-900/20 dark:to-pink-900/20 w-80 min-h-[200px] border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-2xl"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl w-80 rounded-2xl border-2 shadow-lg flex-shrink-0",
        "border-slate-200/80 dark:border-slate-700/80",
        "hover:shadow-xl transition-all duration-200",
        isOverlay && "opacity-95 shadow-2xl ring-2 ring-purple-400",
      )}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <GripVertical className="h-4 w-4 text-slate-400" />
          </div>
          {isEditing ? (
            <Input
              autoFocus
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleUpdateList}
              onKeyDown={(e) => e.key === "Enter" && handleUpdateList()}
              className="h-8 text-base font-semibold border-purple-300 focus-visible:ring-purple-400"
            />
          ) : (
            <h3
              className="font-semibold text-slate-700 dark:text-slate-200 truncate cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              onClick={() => setIsEditing(true)}
            >
              {list.title}
            </h3>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 px-2.5 py-1 rounded-full text-purple-600 dark:text-purple-300 font-medium">
            {list.cards.length}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <MoreHorizontal className="h-4 w-4 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Edit2 className="h-3.5 w-3.5 mr-2" />
                แก้ไขชื่อ
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950/50"
                onClick={() => deleteList(list.id)}
              >
                <Trash2 className="h-3.5 w-3.5 mr-2" />
                ลบรายการ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Cards Container */}
      <div className="px-3 py-3 space-y-3 overflow-y-auto max-h-[50vh] scrollbar-thin">
        <SortableContext
          items={list.cards.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {list.cards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center mb-3">
                <Sparkles className="h-5 w-5 text-purple-400" />
              </div>
              <p className="text-sm text-muted-foreground">ยังไม่มีเทมเพลต</p>
              <p className="text-xs text-muted-foreground/70">
                คลิกปุ่มด้านล่างเพื่อเพิ่ม
              </p>
            </div>
          ) : (
            list.cards.map((card) => <CardItem key={card.id} card={card} />)
          )}
        </SortableContext>
      </div>

      {/* Add Card Section */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800">
        {isAddingCard ? (
          <div className="space-y-3">
            <Textarea
              ref={textareaRef}
              value={newCardContent}
              onChange={(e) => setNewCardContent(e.target.value)}
              placeholder="พิมพ์ข้อความเทมเพลต..."
              className="min-h-[100px] text-sm resize-none border-purple-200 focus-visible:ring-purple-400"
              onKeyDown={(e) => {
                if (e.key === "Escape") handleCancelAddCard();
              }}
            />
            <div className="flex items-center gap-2">
              <Popover
                open={isVarPopoverOpen}
                onOpenChange={setIsVarPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-purple-600 border-purple-200 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  >
                    <Variable className="h-3.5 w-3.5" />+ ตัวแปร
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3" align="start">
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground">
                      เลือกตัวแปรที่ต้องการเพิ่ม
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {COMMON_VARIABLES.map((varName) => (
                        <Button
                          key={varName}
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs px-2 hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-900/20"
                          onClick={() => insertVariable(varName)}
                        >
                          {varName}
                        </Button>
                      ))}
                    </div>
                    <div className="flex gap-2 pt-2 border-t">
                      <Input
                        value={customVarName}
                        onChange={(e) => setCustomVarName(e.target.value)}
                        placeholder="ชื่อตัวแปรใหม่..."
                        className="h-8 text-xs"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddCustomVariable();
                        }}
                      />
                      <Button
                        size="sm"
                        className="h-8 text-xs px-2.5"
                        onClick={handleAddCustomVariable}
                        disabled={!customVarName.trim()}
                      >
                        เพิ่ม
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <div className="flex-1" />
              <Button
                size="sm"
                variant="ghost"
                className="text-slate-500"
                onClick={handleCancelAddCard}
              >
                ยกเลิก
              </Button>
              <Button
                size="sm"
                onClick={handleAddCard}
                disabled={!newCardContent.trim()}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                เพิ่ม
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            onClick={() => setIsAddingCard(true)}
            className="w-full justify-center gap-2 text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-base py-5 rounded-xl transition-all"
          >
            <Plus className="h-5 w-5" />
            เพิ่มเทมเพลต
          </Button>
        )}
      </div>
    </div>
  );
}
