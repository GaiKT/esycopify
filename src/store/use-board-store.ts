import { create } from 'zustand'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

export interface Card {
    id: string
    list_id: string
    content: string
    position: number
    variables?: Record<string, string>
}

export interface List {
    id: string
    board_id: string
    title: string
    position: number
    cards: Card[]
}

export interface Board {
    id: string
    title: string
    lists: List[]
}

interface BoardState {
    boards: Board[]
    activeBoard: Board | null
    loading: boolean
    setBoards: (boards: Board[]) => void
    setActiveBoard: (board: Board | null) => void
    fetchBoards: () => Promise<void>
    addBoard: (title: string) => Promise<void>
    addList: (boardId: string, title: string) => Promise<void>
    addCard: (listId: string, content: string) => Promise<void>
    reorderLists: (boardId: string, startIndex: number, endIndex: number) => Promise<void>
    reorderCards: (listId: string, startIndex: number, endIndex: number) => Promise<void>
    moveCard: (sourceListId: string, destListId: string, cardId: string, index: number) => Promise<void>
}

export const useBoardStore = create<BoardState>((set, get) => ({
    boards: [],
    activeBoard: null,
    loading: false,
    setBoards: (boards) => set({ boards }),
    setActiveBoard: (board) => set({ activeBoard: board }),

    fetchBoards: async () => {
        if (!supabase) return
        set({ loading: true })

        // Fetch boards
        const { data: boardsData, error: boardsError } = await supabase
            .from('boards')
            .select('*, lists(*, cards(*))')
            .order('created_at', { ascending: false })

        if (boardsError) {
            console.error('Error fetching boards:', boardsError)
        } else {
            // Sort lists and cards by position locally if needed, 
            // though Supabase might return them in order if we add .order() to sub-queries
            const formattedBoards = boardsData?.map((board: any) => ({
                ...board,
                lists: (board.lists || []).sort((a: any, b: any) => a.position - b.position).map((list: any) => ({
                    ...list,
                    cards: (list.cards || []).sort((a: any, b: any) => a.position - b.position)
                }))
            }))
            set({ boards: formattedBoards })
        }
        set({ loading: false })
    },

    addBoard: async (title) => {
        if (!supabase) return
        const { data: userData } = await supabase.auth.getUser()
        if (!userData.user) return

        const { data, error } = await supabase
            .from('boards')
            .insert({ title, user_id: userData.user.id })
            .select()
            .single()

        if (!error && data) {
            set((state) => ({ boards: [{ ...data, lists: [] }, ...state.boards] }))
        }
    },

    addList: async (boardId, title) => {
        if (!supabase) return
        const board = get().boards.find(b => b.id === boardId)
        const position = board?.lists.length || 0

        const { data, error } = await supabase
            .from('lists')
            .insert({ board_id: boardId, title, position })
            .select()
            .single()

        if (!error && data) {
            set((state) => {
                const updatedBoards = state.boards.map(b =>
                    b.id === boardId ? { ...b, lists: [...b.lists, { ...data, cards: [] }] } : b
                )
                return {
                    boards: updatedBoards,
                    activeBoard: state.activeBoard?.id === boardId ? updatedBoards.find(b => b.id === boardId) || null : state.activeBoard
                }
            })
        }
    },

    addCard: async (listId, content) => {
        if (!supabase) return

        // Find current max position in this list
        let position = 0
        get().boards.forEach(b => {
            const list = b.lists.find(l => l.id === listId)
            if (list) position = list.cards.length
        })

        const { data, error } = await supabase
            .from('cards')
            .insert({ list_id: listId, content, position })
            .select()
            .single()

        if (!error && data) {
            set((state) => {
                const updatedBoards = state.boards.map(b => ({
                    ...b,
                    lists: b.lists.map(l =>
                        l.id === listId ? { ...l, cards: [...l.cards, data] } : l
                    )
                }))
                return {
                    boards: updatedBoards,
                    activeBoard: state.activeBoard ? updatedBoards.find(b => b.id === state.activeBoard?.id) || null : null
                }
            })
        }
    },

    reorderLists: async (boardId, startIndex, endIndex) => {
        if (!supabase) return
        const board = get().boards.find(b => b.id === boardId)
        if (!board) return

        const newLists = Array.from(board.lists)
        const [removed] = newLists.splice(startIndex, 1)
        newLists.splice(endIndex, 0, removed)

        // Optimistic update
        set((state) => ({
            boards: state.boards.map(b => b.id === boardId ? { ...b, lists: newLists } : b),
            activeBoard: state.activeBoard?.id === boardId ? { ...state.activeBoard, lists: newLists } : state.activeBoard
        }))

        // Sync to Supabase (update positions)
        const updates = newLists.map((list, index) => ({
            id: list.id,
            position: index,
            board_id: boardId,
            title: list.title
        }))

        await supabase.from('lists').upsert(updates)
    },

    reorderCards: async (listId, startIndex, endIndex) => {
        if (!supabase) return
        const board = get().boards.find(b => b.lists.some(l => l.id === listId))
        if (!board) return

        const list = board.lists.find(l => l.id === listId)
        if (!list) return

        const newCards = Array.from(list.cards)
        const [removed] = newCards.splice(startIndex, 1)
        newCards.splice(endIndex, 0, removed)

        // Optimistic update
        const updatedBoards = get().boards.map(b => ({
            ...b,
            lists: b.lists.map(l => l.id === listId ? { ...l, cards: newCards } : l)
        }))

        set({
            boards: updatedBoards,
            activeBoard: get().activeBoard?.id === board.id ? updatedBoards.find(b => b.id === board.id) || null : get().activeBoard
        })

        // Sync
        const updates = newCards.map((card, index) => ({
            id: card.id,
            position: index,
            list_id: listId,
            content: card.content
        }))

        await supabase.from('cards').upsert(updates)
    },

    moveCard: async (sourceListId, destListId, cardId, index) => {
        if (!supabase) return

        // Optimistic update (complex one)
        let cardToMove: Card | undefined
        const updatedBoards = get().boards.map(b => ({
            ...b,
            lists: b.lists.map(l => {
                if (l.id === sourceListId) {
                    cardToMove = l.cards.find(c => c.id === cardId)
                    return { ...l, cards: l.cards.filter(c => c.id !== cardId) }
                }
                return l
            })
        })).map(b => ({
            ...b,
            lists: b.lists.map(l => {
                if (l.id === destListId && cardToMove) {
                    const newCards = Array.from(l.cards)
                    newCards.splice(index, 0, { ...cardToMove, list_id: destListId })
                    return { ...l, cards: newCards }
                }
                return l
            })
        }))

        set({
            boards: updatedBoards,
            activeBoard: get().activeBoard ? updatedBoards.find(b => b.id === get().activeBoard?.id) || null : null
        })

        // Sync to Supabase
        await supabase.from('cards').update({ list_id: destListId, position: index }).eq('id', cardId)

        // We should probably re-order the destination list too to be safe, 
        // but the update above handles the primary change.
    }
}))
