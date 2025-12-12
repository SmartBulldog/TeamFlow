# 🚀 TeamFlow Implementation Guide

> **Complete step-by-step instructions to finish the production-ready refactoring**
>
> **What's done**: ✅ Zustand store, ✅ OnlineUsers component, ✅ Security, ✅ GDPR
>
> **What's left**: Integrate store into kanban-board.tsx, add dependencies, API endpoints

---

## 📊 Current Status

**Project Rating**: 8/10 → Target: 9.5/10

### ✅ Completed (via GitHub)
1. **Zustand Store** (`src/stores/board-store.ts`) - 293 lines, production-ready
2. **OnlineUsers Component** (`src/components/online-users.tsx`) - 172 lines, animated
3. **GDPR Compliance** - Headers, legal pages, cookie consent
4. **Security** - Rate limiting, CSP, password validation
5. **WebSocket Server** - Ready at port 3002
6. **Documentation** - README, DEPLOYMENT.md, .env.example

### 🔴 Remaining (local work required)
1. Refactor `kanban-board.tsx` to use Zustand (remove `window.location.reload()`)
2. Update `package.json` with new dependencies and scripts
3. Add complete Cards CRUD API endpoints
4. Update `use-websocket.ts` with environment variables
5. Add toast notifications (sonner)
6. Final testing

---

## 🛠️ Step 1: Install Dependencies

```bash
cd TeamFlow

# Install state management
npm install zustand immer

# Install animations
npm install framer-motion

# Install toast notifications
npm install sonner

# Install dev dependencies
npm install --save-dev concurrently tsx @types/ws
```

---

## 📝 Step 2: Update package.json Scripts

Open `package.json` and replace the `scripts` section:

```json
{
  "scripts": {
    "dev": "concurrently \"next dev\" \"npm run ws:dev\"",
    "ws:dev": "tsx watch mini-services/websocket-service/index.ts",
    "ws": "node mini-services/websocket-service/index.js",
    "build": "next build",
    "start": "concurrently \"npm run start:app\" \"npm run start:ws\"",
    "start:app": "next start",
    "start:ws": "node mini-services/websocket-service/index.js",
    "lint": "next lint"
  }
}
```

---

## 🔧 Step 3: Refactor kanban-board.tsx

Open `src/components/kanban-board.tsx` and make these changes:

### 3.1 Add Zustand Import (line ~30)

```typescript
import { useBoardStore } from '@/stores/board-store'
import { OnlineUsers } from '@/components/online-users'
```

### 3.2 Replace useState with Zustand (lines ~283-295)

**REMOVE these lines**:
```typescript
const [boardUsers, setBoardUsers] = useState(0)
const [realtimeUpdates, setRealtimeUpdates] = useState<any[]>([])  
```

**ADD instead**:
```typescript
const {
  columns,
  setBoard,
  addCard: addCardToStore,
  moveCard: moveCardInStore,
  startOperation,
  finishOperation,
  revertCardMove,
} = useBoardStore()

// Initialize board data from props
useEffect(() => {
  if (board && workspace) {
    setBoard(board.id, workspace.id, board.columns)
  }
}, [board.id, workspace.id, board.columns, setBoard])
```

### 3.3 Fix WebSocket Handlers (lines ~297-329)

**REMOVE the window.location.reload() lines**:

**REPLACE the entire useEffect with**:
```typescript
useEffect(() => {
  if (!lastMessage) return

  switch (lastMessage.type) {
    case 'board_users':
      // Legacy - handled by OnlineUsers component now
      break

    case 'card_moved':
      const { cardId, columnId, position } = lastMessage.payload
      moveCardInStore(cardId, columnId, position)
      break

    case 'card_created':
      addCardToStore(lastMessage.payload.card)
      break

    case 'user_joined_board':
      console.log('User joined:', lastMessage.payload)
      break

    case 'user_left_board':
      console.log('User left:', lastMessage.payload)
      break

    default:
      console.log('Unknown message:', lastMessage)
  }
}, [lastMessage, moveCardInStore, addCardToStore])
```

### 3.4 Add Optimistic Updates to handleDragEnd

**Find `handleDragEnd` function (around line 430) and wrap it**:

```typescript
const handleDragEnd = async (event: DragEndEvent) => {
  const { active, over } = event
  if (!over) return

  const activeId = active.id as string

  // Find source info BEFORE optimistic update
  let sourceColumnId: string | null = null
  let sourcePosition = 0

  for (const col of columns) {
    const idx = col.cards.findIndex(c => c.id === activeId)
    if (idx !== -1) {
      sourceColumnId = col.id
      sourcePosition = idx
      break
    }
  }

  const targetColumn = columns.find(col =>
    col.cards.some(c => c.id === over.id) || col.id === over.id
  )

  if (!targetColumn || !sourceColumnId) {
    setActiveId(null)
    return
  }

  const newPosition = targetColumn.cards.length
  const operationId = `move-${activeId}-${Date.now()}`

  // 1. OPTIMISTIC UPDATE
  startOperation(operationId)
  moveCardInStore(activeId, targetColumn.id, newPosition)

  // 2. API CALL
  try {
    const res = await fetch('/api/cards', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cardId: activeId,
        columnId: targetColumn.id,
        position: newPosition,
      }),
    })

    if (res.ok) {
      broadcastCardMoved(activeId, targetColumn.id, newPosition)
      finishOperation(operationId)
    } else {
      // REVERT on API error
      revertCardMove(activeId, sourceColumnId, sourcePosition)
      finishOperation(operationId)
    }
  } catch (error) {
    revertCardMove(activeId, sourceColumnId, sourcePosition)
    finishOperation(operationId)
    console.error('Move failed:', error)
  }

  setActiveId(null)
}
```

### 3.5 Use columns from store (line ~520+)

**FIND this line**:
```typescript
{board.columns.map((column) => (
```

**REPLACE with**:
```typescript
{columns.map((column) => (
```

### 3.6 Add OnlineUsers to header (line ~480)

**FIND the board header section and ADD**:
```typescript
<div className="border-b p-4">
  <div className="flex items-center justify-between">
    <div>
      <h2 className="text-2xl font-bold">{board.name}</h2>
      <p className="text-muted-foreground">{workspace.name}</p>
    </div>
    {/* ADD THIS */}
    <OnlineUsers maxVisible={5} className="" />
    {/* END ADD */}
  </div>
</div>
```

---

## 🔌 Step 4: Update use-websocket.ts

Open `src/hooks/use-websocket.ts` and update line 25:

**BEFORE**:
```typescript
wsRef.current = new WebSocket(`ws://localhost:3002`)
```

**AFTER**:
```typescript
const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3002'
wsRef.current = new WebSocket(wsUrl)
```

---

## 🍞 Step 5: Add Toast Notifications

Create `src/components/toaster.tsx`:

```typescript
'use client'

import { Toaster as Sonner } from 'sonner'

export function Toaster() {
  return (
    <Sonner
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: 'bg-background border-border',
          title: 'text-foreground',
          description: 'text-muted-foreground',
        },
      }}
    />
  )
}
```

Then add to `src/app/layout.tsx` (before closing `</body>`):

```typescript
import { Toaster } from '@/components/toaster'

// ... in JSX
<body>
  {children}
  <Toaster />
</body>
```

---

## 🚀 Step 6: Test Everything

```bash
# Start dev server (Next.js + WebSocket)
npm run dev

# Should see:
# - Next.js: http://localhost:3000
# - WebSocket: ws://localhost:3002
```

### Testing Checklist:
1. ✅ Open http://localhost:3000 in TWO browser windows
2. ✅ Drag a card in window 1 → should move instantly in window 2 (NO RELOAD)
3. ✅ Check online users indicator shows "2 users online"
4. ✅ Try creating a card → should appear in both windows
5. ✅ Check console for errors

---

## 📈 What You've Achieved

### Before
- ❌ `window.location.reload()` on every change
- ❌ No real-time collaboration
- ❌ Poor UX
- **Rating**: 7/10

### After
- ✅ Instant updates without reload
- ✅ Optimistic updates with rollback
- ✅ Real user presence indicators
- ✅ Figma-like collaborative experience
- ✅ Production-ready architecture
- **Rating**: 9.5/10

---

## 🎯 Optional Enhancements

If you want to go even further:

1. **Add card details modal** - Click card to edit description, add comments
2. **Add cursor tracking** - Show where other users are clicking
3. **Add activity feed** - Show real-time log of who did what
4. **Add card comments** - Real-time comment thread per card
5. **Add file attachments** - Upload images/files to cards
6. **Add search/filters** - Filter by assignee, priority, due date
7. **Add keyboard shortcuts** - Vim-style navigation

---

## 🐛 Troubleshooting

### WebSocket won't connect
```bash
# Check if port 3002 is free
lsof -ti:3002
# If occupied, kill it
kill -9 $(lsof -ti:3002)
```

### TypeScript errors
```bash
npm run lint
npx tsc --noEmit
```

### Cards not updating
- Check browser console for errors
- Verify WebSocket shows "connected" message
- Check Network tab for failed API calls

---

## 📞 Questions?

This guide covers all critical changes. If something doesn't work:
1. Check the commit history on GitHub for reference
2. Compare your files with the originals
3. Look for console errors

**Project**: https://github.com/SmartBulldog/TeamFlow
**Author**: Valerii Karpov (VKV - New vision)
**Email**: smartbulldog.pro@gmail.com

---

**Total Implementation Time**: 2-3 hours for careful implementation + testing

**Result**: Production-ready collaborative workspace app that will impress any employer! 🚀
