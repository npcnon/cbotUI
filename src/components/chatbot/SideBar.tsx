// components/chatbot/SideBar.tsx
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  PlusCircle, 
  MessageSquare, 
  Settings, 
  Save, 
  MoreVertical,
  Trash2
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface ChatSession {
  id: string
  name: string
  date: Date
  selected?: boolean
}

export function Sidebar() {
  const [sessions, setSessions] = useState<ChatSession[]>([
    { id: "1", name: "New Chat", date: new Date(), selected: true },
  ])
  
  const [isRenaming, setIsRenaming] = useState<string | null>(null)
  const [newName, setNewName] = useState("")
  
  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: `chat-${Date.now()}`,
      name: "New Chat",
      date: new Date(),
      selected: true
    }
    
    // Set all other sessions to not selected
    setSessions(prev => 
      [newSession, ...prev.map(s => ({ ...s, selected: false }))]
    )
  }
  
  const selectChat = (id: string) => {
    setSessions(prev => 
      prev.map(s => ({ ...s, selected: s.id === id }))
    )
  }
  
  const startRename = (id: string, currentName: string) => {
    setIsRenaming(id)
    setNewName(currentName)
  }
  
  const completeRename = () => {
    if (isRenaming) {
      setSessions(prev => 
        prev.map(s => s.id === isRenaming ? { ...s, name: newName || "Unnamed Chat" } : s)
      )
      setIsRenaming(null)
      setNewName("")
    }
  }
  
  const deleteChat = (id: string) => {
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== id)
      // If we deleted the selected chat, select the first one
      if (prev.find(s => s.id === id)?.selected && filtered.length > 0) {
        filtered[0].selected = true
      }
      return filtered
    })
  }
  
  return (
    <div className="w-64 border-r bg-muted/40 h-full flex flex-col">
      <div className="p-4">
        <Button onClick={handleNewChat} className="w-full justify-start">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto px-3 py-2">
        <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight">
          Recent Chats
        </h2>
        
        <div className="space-y-2">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={cn(
                "flex items-center justify-between rounded-lg p-2",
                session.selected ? "bg-accent text-accent-foreground" : "hover:bg-accent/50 cursor-pointer"
              )}
              onClick={() => isRenaming !== session.id && selectChat(session.id)}
            >
              {isRenaming === session.id ? (
                <div className="flex-1 mr-2">
                  <Input 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        completeRename()
                      }
                    }}
                    onBlur={completeRename}
                    placeholder="Chat name..."
                    autoFocus
                    size={1}
                  />
                </div>
              ) : (
                <div className="flex items-center flex-1 min-w-0">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <div className="truncate text-sm">{session.name}</div>
                </div>
              )}
              
              {!isRenaming && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation()
                      startRename(session.id, session.name)
                    }}>
                      <Save className="mr-2 h-4 w-4" />
                      <span>Rename</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation()
                      deleteChat(session.id)
                    }}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          ))}
          
          {sessions.length === 0 && (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              No chat sessions yet
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 border-t">
        <Button variant="outline" className="w-full justify-start">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  )
}