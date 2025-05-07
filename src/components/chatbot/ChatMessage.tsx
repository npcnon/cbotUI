// components/ChatMessage.tsx
import { Card, CardContent } from "@/components/ui/card"

interface ChatMessageProps {
  message: {
    role: "user" | "assistant" | "system"
    content: string
  }
  avatar: string
}

export default function ChatMessage({ message, avatar }: ChatMessageProps) {
  return (
    <div className="flex items-start gap-2">
      <div className="h-8 w-8 flex items-center justify-center rounded-full bg-muted">
        {avatar}
      </div>
      <Card className="w-fit max-w-[80%]">
        <CardContent className="p-3">
          <div className="text-sm">{message.content}</div>
        </CardContent>
      </Card>
    </div>
  )
}