"use client"

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
  defaultDropAnimationSideEffects
} from "@dnd-kit/core"
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  horizontalListSortingStrategy 
} from "@dnd-kit/sortable"
import { useState } from "react"
import { Board, List, Card as CardType } from "@/store/use-board-store"
import {ListColumn} from "./list-column"
import {CardItem} from "./card-item"
import { useBoardStore } from "@/store/use-board-store"

interface BoardCanvasProps {
  board: Board
}

export function BoardCanvas({ board }: BoardCanvasProps) {
  const { reorderLists, reorderCards, moveCard } = useBoardStore()
  const [activeList, setActiveList] = useState<List | null>(null)
  const [activeCard, setActiveCard] = useState<CardType | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "List") {
      setActiveList(event.active.data.current.list)
      return
    }

    if (event.active.data.current?.type === "Card") {
      setActiveCard(event.active.data.current.card)
      return
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const isActiveACard = active.data.current?.type === "Card"
    const isOverACard = over.data.current?.type === "Card"

    if (!isActiveACard) return

    // Dropping a card over another card
    if (isActiveACard && isOverACard) {
      const activeListId = active.data.current?.card.list_id
      const overListId = over.data.current?.card.list_id

      if (activeListId !== overListId) {
        // Move card to new list
        moveCard(activeListId, overListId, activeId as string, 0) // Simplified index for now
      }
    }

    // Dropping a card over a list
    const isOverAList = over.data.current?.type === "List"
    if (isActiveACard && isOverAList) {
      const activeListId = active.data.current?.card.list_id
      const overListId = over.id as string

      if (activeListId !== overListId) {
        moveCard(activeListId, overListId, activeId as string, 0)
      }
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveList(null)
    setActiveCard(null)

    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    if (active.data.current?.type === "List") {
      const oldIndex = board.lists.findIndex(l => l.id === activeId)
      const newIndex = board.lists.findIndex(l => l.id === overId)
      reorderLists(board.id, oldIndex, newIndex)
    }

    if (active.data.current?.type === "Card") {
      const activeListId = active.data.current?.card.list_id
      const overListId = over.data.current?.card.list_id || (over.data.current?.type === "List" ? overId : null)
      
      if (activeListId === overListId) {
        const list = board.lists.find(l => l.id === activeListId)
        if (list) {
          const oldIndex = list.cards.findIndex(c => c.id === activeId)
          const newIndex = list.cards.findIndex(c => c.id === overId)
          reorderCards(activeListId, oldIndex, newIndex)
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
      <div className="flex gap-4 h-full">
        <SortableContext items={board.lists.map(l => l.id)} strategy={horizontalListSortingStrategy}>
          {board.lists.map((list) => (
            <ListColumn key={list.id} list={list} />
          ))}
        </SortableContext>
      </div>

      <DragOverlay dropAnimation={{
        sideEffects: defaultDropAnimationSideEffects({
          styles: {
            active: {
              opacity: "0.5",
            },
          },
        }),
      }}>
        {activeList && <ListColumn list={activeList} isOverlay />}
        {activeCard && <CardItem card={activeCard} isOverlay />}
      </DragOverlay>
    </DndContext>
  )
}
