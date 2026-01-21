"use client";

import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState, useRef, useEffect } from "react";
import { Board, List, Card as CardType } from "@/store/use-board-store";
import { ListColumn } from "./list-column";
import { CardItem } from "./card-item";
import { useBoardStore } from "@/store/use-board-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BoardCanvasProps {
  board: Board;
}

export function BoardCanvas({ board }: BoardCanvasProps) {
  const { reorderLists, reorderCards, moveCard, addList } = useBoardStore();
  const [activeList, setActiveList] = useState<List | null>(null);
  const [activeCard, setActiveCard] = useState<CardType | null>(null);
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAddingList && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAddingList]);

  const handleAddList = () => {
    if (newListTitle.trim()) {
      addList(board.id, newListTitle.trim());
      setNewListTitle("");
      // Keep open for adding more lists
    }
  };

  const handleCancelAddList = () => {
    setNewListTitle("");
    setIsAddingList(false);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "List") {
      setActiveList(event.active.data.current.list);
      return;
    }

    if (event.active.data.current?.type === "Card") {
      setActiveCard(event.active.data.current.card);
      return;
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveACard = active.data.current?.type === "Card";
    const isOverACard = over.data.current?.type === "Card";

    if (!isActiveACard) return;

    // Dropping a card over another card
    if (isActiveACard && isOverACard) {
      const activeListId = active.data.current?.card.list_id;
      const overListId = over.data.current?.card.list_id;

      if (activeListId !== overListId) {
        // Move card to new list
        moveCard(activeListId, overListId, activeId as string, 0); // Simplified index for now
      }
    }

    // Dropping a card over a list
    const isOverAList = over.data.current?.type === "List";
    if (isActiveACard && isOverAList) {
      const activeListId = active.data.current?.card.list_id;
      const overListId = over.id as string;

      if (activeListId !== overListId) {
        moveCard(activeListId, overListId, activeId as string, 0);
      }
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveList(null);
    setActiveCard(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    if (active.data.current?.type === "List") {
      const oldIndex = board.lists.findIndex((l) => l.id === activeId);
      const newIndex = board.lists.findIndex((l) => l.id === overId);
      reorderLists(board.id, oldIndex, newIndex);
    }

    if (active.data.current?.type === "Card") {
      const activeListId = active.data.current?.card.list_id;
      const overListId =
        over.data.current?.card.list_id ||
        (over.data.current?.type === "List" ? overId : null);

      if (activeListId === overListId) {
        const list = board.lists.find((l) => l.id === activeListId);
        if (list) {
          const oldIndex = list.cards.findIndex((c) => c.id === activeId);
          const newIndex = list.cards.findIndex((c) => c.id === overId);
          reorderCards(activeListId, oldIndex, newIndex);
        }
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className="flex gap-4 items-start w-full">
        <SortableContext
          items={board.lists.map((l) => l.id)}
          strategy={horizontalListSortingStrategy}
        >
          {board.lists.map((list) => (
            <ListColumn key={list.id} list={list} />
          ))}
        </SortableContext>

        {/* Add List Button */}
        <div className="flex-shrink-0 w-72">
          {isAddingList ? (
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border-2 border-slate-200/80 dark:border-slate-700/80 p-3 space-y-3">
              <Input
                ref={inputRef}
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddList();
                  if (e.key === "Escape") handleCancelAddList();
                }}
                placeholder="ชื่อรายการ..."
                className="text-sm border-purple-200 focus-visible:ring-purple-400"
              />
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleAddList}
                  disabled={!newListTitle.trim()}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  เพิ่มรายการ
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={handleCancelAddList}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="ghost"
              onClick={() => setIsAddingList(true)}
              className={cn(
                "w-full h-12 justify-start gap-2 rounded-2xl text-base font-medium transition-all",
                "bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm",
                "hover:bg-white/80 dark:hover:bg-slate-900/80",
                "border-2 border-dashed border-slate-300 dark:border-slate-700",
                "text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400",
                "hover:border-purple-300 dark:hover:border-purple-700",
              )}
            >
              <Plus className="h-5 w-5" />
              เพิ่มรายการ
            </Button>
          )}
        </div>
      </div>

      <DragOverlay
        dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({
            styles: {
              active: {
                opacity: "0.5",
              },
            },
          }),
        }}
      >
        {activeList && <ListColumn list={activeList} isOverlay />}
        {activeCard && <CardItem card={activeCard} isOverlay />}
      </DragOverlay>
    </DndContext>
  );
}
