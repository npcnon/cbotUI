// app/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ChatMessage from "@/components/chatbot/ChatMessage"
import { Sidebar } from "@/components/chatbot/SideBar"

interface Message {
  role: "user" | "assistant" | "system"
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello, there! How can I help you today?" }
  ])
  const [userInput, setUserInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [avatars, setAvatars] = useState({
    user: "👤",
    assistant: "🤗"
  })
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userInput.trim()) return
    
    // Add user message - explicitly typing as Message
    const newUserMessage: Message = { role: "user", content: userInput }
    const updatedMessages: Message[] = [...messages, newUserMessage]
    
    setMessages(updatedMessages)
    setUserInput("")
    
    // In a real app, you'd call your API here
    setIsLoading(true)
    
    // Simulating API response - replace with actual API call
    setTimeout(() => {
      const assistantMessage: Message = { 
        role: "assistant", 
        content: "This is a placeholder response. In a real application, this would be the AI's response."
      }
      
      setMessages([...updatedMessages, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="flex h-screen">
      {/* Main chat area */}
      <div className="flex-1 flex flex-col max-h-screen">
        <header className="p-4 border-b">
          <h1 className="text-2xl font-bold">Personal Chat Assistant</h1>
          <p className="text-sm text-muted-foreground">
            This is a simple chatbot that uses a language model to generate responses.
          </p>
        </header>
        
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <ChatMessage 
              key={index}
              message={message}
              avatar={message.role === "user" ? avatars.user : avatars.assistant}
            />
          ))}
          {isLoading && (
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 flex items-center justify-center rounded-full bg-muted">
                {avatars.assistant}
              </div>
              <Card className="w-fit">
                <CardContent className="p-3">
                  <div className="text-sm">Thinking...</div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        
        {/* Input area */}
        <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
          <Input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter your text here."
            className="flex-1"
          />
          <Button type="submit">Send</Button>
        </form>
      </div>
      
      {/* Sidebar */}
      <Sidebar />
    </div>
  )
}