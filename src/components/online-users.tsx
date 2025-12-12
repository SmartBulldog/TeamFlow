'use client'

import { useMemo } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { Users } from 'lucide-react'
import { useBoardStore, type OnlineUser } from '@/stores/board-store'
import { motion, AnimatePresence } from 'framer-motion'

interface OnlineUsersProps {
  maxVisible?: number
  className?: string
}

export function OnlineUsers({ maxVisible = 5, className = '' }: OnlineUsersProps) {
  const { onlineUsers } = useBoardStore()
  
  // Convert Map to Array and sort by activity
  const users = useMemo(() => {
    if (onlineUsers instanceof Map) {
      return Array.from(onlineUsers.values()).sort(
        (a, b) => b.lastActivity - a.lastActivity
      )
    }
    return []
  }, [onlineUsers])

  const visibleUsers = users.slice(0, maxVisible)
  const remainingCount = Math.max(0, users.length - maxVisible)

  if (users.length === 0) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Users className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">No users online</span>
      </div>
    )
  }

  return (
    <div className={`flex items-center ${className}`}>
      <TooltipProvider delayDuration={100}>
        {/* Avatars Stack */}
        <div className="flex items-center -space-x-2">
          <AnimatePresence mode="popLayout">
            {visibleUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  transition: { 
                    delay: index * 0.05,
                    type: 'spring',
                    stiffness: 300,
                    damping: 20
                  }
                }}
                exit={{ 
                  scale: 0, 
                  opacity: 0,
                  transition: { duration: 0.15 }
                }}
                whileHover={{ 
                  scale: 1.1, 
                  zIndex: 10,
                  transition: { duration: 0.2 }
                }}
                style={{ zIndex: visibleUsers.length - index }}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative">
                      <Avatar className="h-8 w-8 border-2 border-background cursor-pointer ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-xs font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {/* Active indicator */}
                      <motion.div
                        className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-background rounded-full"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [1, 0.8, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-popover border shadow-lg">
                    <div className="flex flex-col items-start space-y-1">
                      <p className="font-semibold text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Active {getRelativeTime(user.lastActivity)}
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Remaining count badge */}
          {remainingCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="relative"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant="secondary"
                    className="h-8 w-8 rounded-full flex items-center justify-center border-2 border-background cursor-pointer hover:bg-secondary/80 transition-colors"
                  >
                    +{remainingCount}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-xs">{remainingCount} more user{remainingCount > 1 ? 's' : ''} online</p>
                </TooltipContent>
              </Tooltip>
            </motion.div>
          )}
        </div>

        {/* User count */}
        <div className="ml-3 flex items-center space-x-2">
          <motion.div
            key={users.length}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-muted/50 border"
          >
            <Users className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-foreground">
              {users.length}
            </span>
          </motion.div>
        </div>
      </TooltipProvider>
    </div>
  )
}

// Utility function for relative time
function getRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  if (seconds < 10) return 'just now'
  if (seconds < 60) return `${seconds}s ago`
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return 'recently'
}
