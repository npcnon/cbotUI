// components/chatbot/ChatMessage.tsx
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import ReactMarkdown from 'react-markdown'

interface Message {
  role: "user" | "assistant" | "system"
  content: string
  timestamp?: Date
}

interface ChatMessageProps {
  message: Message
  avatar: string
}

export default function ChatMessage({ message, avatar }: ChatMessageProps) {
  const isUser = message.role === "user"
  
  return (
    <div className={cn(
      "flex items-start gap-3",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <div className="h-8 w-8 flex items-center justify-center rounded-full bg-muted text-center">
          {avatar}
        </div>
      )}
      
      <Card className={cn(
        "max-w-[85%]",
        isUser ? "bg-primary text-primary-foreground" : ""
      )}>
        <CardContent className="p-3">
          <div className="prose prose-sm dark:prose-invert">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
          {message.timestamp && (
            <div className={cn(
              "text-xs mt-1",
              isUser ? "text-primary-foreground/80" : "text-muted-foreground"
            )}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </CardContent>
      </Card>
      
      {isUser && (
        <div className="h-8 w-8 flex items-center justify-center rounded-full bg-muted text-center">
          {avatar}
        </div>
      )}
    </div>
  )
}