import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

// Types
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface Card {
  id: string
  title: string
  description?: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  dueDate?: string
  columnId: string
  position: number
  creator: User
  assignee?: User
  createdAt: string
  updatedAt: string
  labels?: string[]
  comments?: number
}

export interface Column {
  id: string
  name: string
  position: number
  cards: Card[]
  color?: string
}

export interface OnlineUser {
  id: string
  name: string
  avatar?: string
  cursor?: { x: number; y: number }
  lastActivity: number
}

interface BoardState {
  // Core State
  boardId: string | null
  workspaceId: string | null
  columns: Column[]
  onlineUsers: Map<string, OnlineUser>
  isLoading: boolean
  error: string | null
  lastSync: number | null
  
  // Optimistic Updates Tracking
  pendingOperations: Set<string>
  
  // Actions - Board
  setBoard: (boardId: string, workspaceId: string, columns: Column[]) => void
  reset: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Actions - Online Users
  setOnlineUsers: (count: number) => void
  addOnlineUser: (user: OnlineUser) => void
  removeOnlineUser: (userId: string) => void
  updateUserCursor: (userId: string, x: number, y: number) => void
  
  // Actions - Cards (with optimistic updates)
  addCard: (card: Card) => void
  moveCard: (cardId: string, targetColumnId: string, position: number) => void
  updateCard: (cardId: string, updates: Partial<Card>) => void
  deleteCard: (cardId: string) => void
  
  // Optimistic Operations
  startOperation: (operationId: string) => void
  finishOperation: (operationId: string) => void
  revertCardMove: (cardId: string, originalColumnId: string, originalPosition: number) => void
  
  // Actions - Columns
  addColumn: (column: Column) => void
  updateColumn: (columnId: string, updates: Partial<Column>) => void
  deleteColumn: (columnId: string) => void
  reorderColumns: (columnIds: string[]) => void
  
  // Utility
  getCard: (cardId: string) => Card | undefined
  getColumn: (columnId: string) => Column | undefined
  getCardCount: () => number
}

const initialState = {
  boardId: null,
  workspaceId: null,
  columns: [],
  onlineUsers: new Map<string, OnlineUser>(),
  isLoading: false,
  error: null,
  lastSync: null,
  pendingOperations: new Set<string>(),
}

export const useBoardStore = create<BoardState>()(  
  devtools(
    immer((set, get) => ({
      ...initialState,
      
      // Board Actions
      setBoard: (boardId, workspaceId, columns) => {
        set((state) => {
          state.boardId = boardId
          state.workspaceId = workspaceId
          state.columns = columns.map(col => ({
            ...col,
            cards: col.cards.sort((a, b) => a.position - b.position)
          }))
          state.isLoading = false
          state.lastSync = Date.now()
        })
      },
      
      reset: () => {
        set(initialState)
      },
      
      setLoading: (loading) => {
        set({ isLoading: loading })
      },
      
      setError: (error) => {
        set({ error, isLoading: false })
      },
      
      // Online Users
      setOnlineUsers: (count) => {
        // Legacy support - converts count to Map if needed
        console.log(`${count} users online`)
      },
      
      addOnlineUser: (user) => {
        set((state) => {
          state.onlineUsers.set(user.id, { ...user, lastActivity: Date.now() })
        })
      },
      
      removeOnlineUser: (userId) => {
        set((state) => {
          state.onlineUsers.delete(userId)
        })
      },
      
      updateUserCursor: (userId, x, y) => {
        set((state) => {
          const user = state.onlineUsers.get(userId)
          if (user) {
            user.cursor = { x, y }
            user.lastActivity = Date.now()
          }
        })
      },
      
      // Card Operations
      addCard: (card) => {
        set((state) => {
          const column = state.columns.find(col => col.id === card.columnId)
          if (column) {
            column.cards.push(card)
            column.cards.sort((a, b) => a.position - b.position)
          }
        })
      },
      
      moveCard: (cardId, targetColumnId, position) => {
        set((state) => {
          let movedCard: Card | null = null
          
          // Remove from source column
          for (const col of state.columns) {
            const cardIndex = col.cards.findIndex(c => c.id === cardId)
            if (cardIndex !== -1) {
              movedCard = { ...col.cards[cardIndex] }
              col.cards.splice(cardIndex, 1)
              break
            }
          }
          
          if (!movedCard) return
          
          // Add to target column
          const targetCol = state.columns.find(col => col.id === targetColumnId)
          if (targetCol) {
            movedCard.columnId = targetColumnId
            movedCard.position = position
            targetCol.cards.push(movedCard)
            targetCol.cards.sort((a, b) => a.position - b.position)
          }
        })
      },
      
      updateCard: (cardId, updates) => {
        set((state) => {
          for (const col of state.columns) {
            const card = col.cards.find(c => c.id === cardId)
            if (card) {
              Object.assign(card, updates)
              break
            }
          }
        })
      },
      
      deleteCard: (cardId) => {
        set((state) => {
          for (const col of state.columns) {
            const index = col.cards.findIndex(c => c.id === cardId)
            if (index !== -1) {
              col.cards.splice(index, 1)
              break
            }
          }
        })
      },
      
      // Optimistic Operations
      startOperation: (operationId) => {
        set((state) => {
          state.pendingOperations.add(operationId)
        })
      },
      
      finishOperation: (operationId) => {
        set((state) => {
          state.pendingOperations.delete(operationId)
        })
      },
      
      revertCardMove: (cardId, originalColumnId, originalPosition) => {
        get().moveCard(cardId, originalColumnId, originalPosition)
      },
      
      // Column Operations
      addColumn: (column) => {
        set((state) => {
          state.columns.push(column)
          state.columns.sort((a, b) => a.position - b.position)
        })
      },
      
      updateColumn: (columnId, updates) => {
        set((state) => {
          const column = state.columns.find(col => col.id === columnId)
          if (column) {
            Object.assign(column, updates)
          }
        })
      },
      
      deleteColumn: (columnId) => {
        set((state) => {
          state.columns = state.columns.filter(col => col.id !== columnId)
        })
      },
      
      reorderColumns: (columnIds) => {
        set((state) => {
          const reordered = columnIds.map((id, index) => {
            const col = state.columns.find(c => c.id === id)
            return col ? { ...col, position: index } : null
          }).filter(Boolean) as Column[]
          state.columns = reordered
        })
      },
      
      // Utility
      getCard: (cardId) => {
        for (const col of get().columns) {
          const card = col.cards.find(c => c.id === cardId)
          if (card) return card
        }
        return undefined
      },
      
      getColumn: (columnId) => {
        return get().columns.find(col => col.id === columnId)
      },
      
      getCardCount: () => {
        return get().columns.reduce((sum, col) => sum + col.cards.length, 0)
      },
    })),
    { name: 'BoardStore' }
  )
)
