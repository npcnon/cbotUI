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
  CardDescription,
  CardFooter
} from "@/components/ui/card"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { AlertCircle, Plus, Trash2, Edit, Send, PenLine, BookOpen, Loader2 } from "lucide-react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import ChatMessage from "@/components/chatbot/ChatMessage"
import { Sidebar } from "@/components/chatbot/SideBar"
import apiClient from "@/lib/api-client"
import { toast } from "sonner"

interface Message {
  role: "user" | "assistant" | "system"
  content: string
  timestamp?: Date
}

interface KnowledgeItem {
  id: string
  content: string
  source?: string
  custom_ai_id: string
  update_version: number
  created_at: string
  updated_at: string
}

interface Personality {
  id?: string
  content: string
  custom_ai_id?: string
  created_at?: string
  updated_at?: string
}

export default function ChatPage() {
  // Chat state
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello, there! How can I help you today?", timestamp: new Date() }
  ])
  const [userInput, setUserInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(true)
  // AI customization state
  const [personality, setPersonality] = useState<Personality | null>(null)
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([])
  const [editingPersonality, setEditingPersonality] = useState("")
  const [newKnowledgeContent, setNewKnowledgeContent] = useState("")
  const [newKnowledgeSource, setNewKnowledgeSource] = useState("")
  const [editingKnowledgeId, setEditingKnowledgeId] = useState<string | null>(null)
  const [editingKnowledgeContent, setEditingKnowledgeContent] = useState("")
  const [editingKnowledgeSource, setEditingKnowledgeSource] = useState("")
  const [isPersonalityDialogOpen, setIsPersonalityDialogOpen] = useState(false)
  const [isKnowledgeDialogOpen, setIsKnowledgeDialogOpen] = useState(false)
  const [isEditKnowledgeDialogOpen, setIsEditKnowledgeDialogOpen] = useState(false)
  const [customAIId, setCustomAIId] = useState<string>("00874615-f1e1-4200-8e8c-0e5ec4625996") // Default AI ID
  
  // UI state
  const [activeTab, setActiveTab] = useState("chat")
  const [avatars, setAvatars] = useState({
    user: "👤",
    assistant: "🤖"
  })

  // AI Model options
  const aiModels = [
    { value: "mistralai/Mistral-7B-Instruct-v0.3", label: "Mistral 7B" },
    { value: "coming soon!", label: "Coming soon!" },
  ]
  
    
  // Fetch personality and knowledge data on mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsDataLoading(true)
    try {
      // Fetch personality
      const personalityResponse = await apiClient.get('/personality/by-user')
      setPersonality(personalityResponse.data)
      setEditingPersonality(personalityResponse.data?.content || "")
      
      // Fetch knowledge items
      const knowledgeResponse = await apiClient.get('/knowledge-base/by-user')
      setKnowledgeItems(knowledgeResponse.data || [])
      
      if (personalityResponse.data) {
        setCustomAIId(personalityResponse.data.custom_ai_id)
      }
    } catch (error) {
      console.error("Error loading data:", error)
      // Load example data if API fails
      loadExampleData()
      toast.error("Couldn't connect to server", {
        description: "Using example data instead. Connect to the API for full functionality."
      })
    } finally {
      setIsDataLoading(false)
    }
  }
  
  // Load example data if API fails or for demo purposes
  const loadExampleData = () => {
    const examplePersonality = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      content: "You are a helpful AI assistant who specializes in explaining complex topics in simple terms.",
      custom_ai_id: "00874615-f1e1-4200-8e8c-0e5ec4625996",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    const exampleKnowledge = [
      {
        id: "89ef7751-5e0d-458e-936f-35d0b0baac12",
        content: "You work in Benedicto College as an instructor for information technology",
        source: "Work information",
        custom_ai_id: "00874615-f1e1-4200-8e8c-0e5ec4625996",
        update_version: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "55301b4f-4201-4da8-9d5f-488d83fb0b17",
        content: "You're bald (no hair) and students laugh at you",
        source: "Personal information",
        custom_ai_id: "00874615-f1e1-4200-8e8c-0e5ec4625996",
        update_version: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
    
    setPersonality(examplePersonality)
    setEditingPersonality(examplePersonality.content)
    setKnowledgeItems(exampleKnowledge)
  }

  // Chat functionality
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userInput.trim()) return
    
    // Add user message
    const newUserMessage: Message = { 
      role: "user", 
      content: userInput,
      timestamp: new Date()
    }
    const updatedMessages: Message[] = [...messages, newUserMessage]
    
    setMessages(updatedMessages)
    setUserInput("")
    
    setIsLoading(true)
    
    try {
      // Create chat history in the format required by the API
      const chatHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Add the new user message to the chat history
      chatHistory.push({
        role: "user",
        content: userInput
      });
      
      // Call the chat API endpoint
      const response = await apiClient.post('/chat', {
        ai_id: customAIId, // Use the AI ID from personality
        user_text: userInput,
        // Only include chat_history if you need it for your API
        // chat_history: chatHistory 
      });
      
      console.log("API response:", response.data);
      
      // Extract the assistant's response from the API response
      const assistantResponseContent = response.data.response || response.data.message || "I'm not sure how to respond to that.";
      
      // Add assistant response to the messages
      const assistantMessage: Message = { 
        role: "assistant", 
        content: assistantResponseContent,
        timestamp: new Date()
      }
      
      setMessages([...updatedMessages, assistantMessage])
    } catch (error) {
      console.error("Error generating response:", error)
      toast.error("Failed to generate AI response. Please try again.")
      
      // Add a fallback message in case of error
      const errorMessage: Message = { 
        role: "assistant", 
        content: "Sorry, I encountered an error while processing your request. Please try again later.",
        timestamp: new Date()
      }
      setMessages([...updatedMessages, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Personality management
  const handleUpdatePersonality = async () => {
    if (!editingPersonality.trim()) return
    
    try {
      setIsLoading(true)
      
      if (personality?.id) {
        // Update existing personality
        const response = await apiClient.put(`/personality/${personality.id}`, {
          content: editingPersonality
        })
        
        setPersonality(response.data)
        toast.success("Personality updated successfully")
      } else {
        // Create new personality
        const response = await apiClient.post('/personality', {
          content: editingPersonality,
          custom_ai_id: customAIId
        })
        
        setPersonality(response.data)
        toast.success("Personality created successfully")
      }
    } catch (error) {
      console.error("Error updating personality:", error)
      toast.error("Failed to update personality. Please try again.")
      
      // Update UI anyway for demo
      setPersonality(prev => {
        if (!prev) return null
        return {
          ...prev,
          content: editingPersonality,
          updated_at: new Date().toISOString()
        }
      })
    } finally {
      setIsLoading(false)
      setIsPersonalityDialogOpen(false)
    }
  }

  // Knowledge management
  const handleAddKnowledge = async () => {
    if (!newKnowledgeContent.trim()) return
    
    try {
      setIsLoading(true)
      
      const response = await apiClient.post('/knowledge-base', {
        content: newKnowledgeContent,
        source: newKnowledgeSource || undefined,
        custom_ai_id: customAIId
      })
      
      setKnowledgeItems([...knowledgeItems, response.data])
      toast.success("Knowledge item added successfully")
    } catch (error) {
      console.error("Error adding knowledge:", error)
      toast.error("Failed to add knowledge item. Please try again.")
      
      // Add to UI anyway for demo
      const newItem: KnowledgeItem = {
        id: `temp-${Date.now()}`,
        content: newKnowledgeContent,
        source: newKnowledgeSource || undefined,
        custom_ai_id: customAIId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        update_version: 1
      }
      
      setKnowledgeItems([...knowledgeItems, newItem])
    } finally {
      setIsLoading(false)
      setNewKnowledgeContent("")
      setNewKnowledgeSource("")
      setIsKnowledgeDialogOpen(false)
    }
  }
  
  const handleEditKnowledge = async () => {
    if (!editingKnowledgeId || !editingKnowledgeContent.trim()) return
    
    try {
      setIsLoading(true)
      
      const response = await apiClient.put(`/knowledge-base/${editingKnowledgeId}`, {
        content: editingKnowledgeContent,
        source: editingKnowledgeSource || undefined
      })
      
      setKnowledgeItems(items => items.map(item => {
        if (item.id === editingKnowledgeId) {
          return response.data
        }
        return item
      }))
      
      toast.success("Knowledge item updated successfully")
    } catch (error) {
      console.error("Error updating knowledge:", error)
      toast.error("Failed to update knowledge item. Please try again.")
      
      // Update UI anyway for demo
      setKnowledgeItems(items => items.map(item => {
        if (item.id === editingKnowledgeId) {
          return {
            ...item,
            content: editingKnowledgeContent,
            source: editingKnowledgeSource || item.source,
            updated_at: new Date().toISOString(),
            update_version: (item.update_version || 0) + 1
          }
        }
        return item
      }))
    } finally {
      setIsLoading(false)
      setIsEditKnowledgeDialogOpen(false)
      resetKnowledgeEditState()
    }
  }
  
  const handleDeleteKnowledge = async (id: string) => {
    try {
      setIsLoading(true)
      
      await apiClient.delete(`/knowledge-base/${id}`)
      
      setKnowledgeItems(items => items.filter(item => item.id !== id))
      toast.success("Knowledge item deleted successfully")
    } catch (error) {
      console.error("Error deleting knowledge:", error)
      toast.error("Failed to delete knowledge item. Please try again.")
      
      // Remove from UI anyway for demo
      setKnowledgeItems(items => items.filter(item => item.id !== id))
    } finally {
      setIsLoading(false)
    }
  }
  
  const openEditKnowledgeDialog = (item: KnowledgeItem) => {
    setEditingKnowledgeId(item.id)
    setEditingKnowledgeContent(item.content)
    setEditingKnowledgeSource(item.source || "")
    setIsEditKnowledgeDialogOpen(true)
  }
  
  const resetKnowledgeEditState = () => {
    setEditingKnowledgeId(null)
    setEditingKnowledgeContent("")
    setEditingKnowledgeSource("")
  }
  
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString()
    } catch (e) {
      return "Unknown date"
    }
  }

  return (
    <div className="flex h-screen">
      {/* Main content area */}
      <div className="flex-1 flex flex-col max-h-screen">
        <header className="p-4 border-b">
          <h1 className="text-2xl font-bold">Custom AI Assistant</h1>
          <p className="text-sm text-muted-foreground">
            Chat with your personalized AI assistant with custom knowledge
          </p>
        </header>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b px-4">
            <TabsList>
              <TabsTrigger value="chat">Test AI(Chat)</TabsTrigger>
              <TabsTrigger value="personality">Personality</TabsTrigger>
              <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
            </TabsList>
          </div>
          
          {/* Chat Tab */}
          <TabsContent value="chat" className="flex-1 flex flex-col">
            {isDataLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="mt-2 text-sm text-muted-foreground">Loading AI assistant...</p>
                </div>
              </div>
            ) : (
              <>
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
                          <div className="flex items-center">
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            <div className="text-sm">Thinking...</div>
                          </div>
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
                    placeholder="Ask your AI assistant..."
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Send className="h-4 w-4 mr-1" />} 
                    Send
                  </Button>
                </form>
              </>
            )}
          </TabsContent>
          
          {/* Personality Tab */}
          <TabsContent value="personality" className="flex-1 overflow-y-auto p-4">
            {isDataLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <div>AI Personality</div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsPersonalityDialogOpen(true)}
                        disabled={isLoading}
                      >
                        {personality?.id ? 
                          <><PenLine className="h-4 w-4 mr-1" /> Edit Personality</> : 
                          <><Plus className="h-4 w-4 mr-1" /> Create Personality</>
                        }
                      </Button>
                    </CardTitle>
                    <CardDescription>
                      Define how your AI assistant behaves and responds
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {personality ? (
                      <div>
                        <div className="font-medium mb-2">Current Personality:</div>
                        <div className="whitespace-pre-wrap rounded-md bg-muted p-4 text-sm">
                          {personality.content}
                        </div>
                        {personality.updated_at && (
                          <div className="mt-2 text-sm text-muted-foreground">
                            Last updated: {formatDate(personality.updated_at)}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          No personality defined yet. Please create one.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
                
                <div className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>AI Model</CardTitle>
                      <CardDescription>
                        Select which AI model to use for your assistant
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Select defaultValue="mistralai/Mistral-7B-Instruct-v0.3">
                        <SelectTrigger>
                          <SelectValue placeholder="Select an AI model" />
                        </SelectTrigger>
                        <SelectContent>
                          {aiModels.map(model => (
                            <SelectItem key={model.value} value={model.value}>
                              {model.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>
          
          {/* Knowledge Tab */}
          <TabsContent value="knowledge" className="flex-1 overflow-y-auto p-4">
            {isDataLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">AI Knowledge Base</h2>
                  <Button 
                    onClick={() => setIsKnowledgeDialogOpen(true)}
                    disabled={isLoading}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Knowledge
                  </Button>
                </div>
                
                {knowledgeItems.length === 0 ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No knowledge items defined yet. Add some knowledge to enhance your AI.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-4">
                    {knowledgeItems.map(item => (
                      <Card key={item.id} className="transition-all hover:shadow-md">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex justify-between">
                            <span>{item.source || 'Knowledge Item'}</span>
                            <span className="text-xs text-muted-foreground">v{item.update_version}</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="whitespace-pre-wrap text-sm">{item.content}</p>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-0">
                          <div className="text-xs text-muted-foreground">
                            Last updated: {formatDate(item.updated_at)}
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openEditKnowledgeDialog(item)}
                              disabled={isLoading}
                            >
                              <Edit className="h-3 w-3 mr-1" /> Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteKnowledge(item.id)}
                              disabled={isLoading}
                            >
                              <Trash2 className="h-3 w-3 mr-1" /> Delete
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
      

      
      {/* Personality Dialog */}
      <Dialog open={isPersonalityDialogOpen} onOpenChange={setIsPersonalityDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{personality?.id ? "Edit" : "Create"} AI Personality</DialogTitle>
            <DialogDescription>
              Define how your AI assistant should behave and respond
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <Textarea 
              value={editingPersonality} 
              onChange={(e) => setEditingPersonality(e.target.value)}
              placeholder="Define the personality of your AI assistant..."
              className="min-h-[200px]"
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsPersonalityDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={handleUpdatePersonality}
              disabled={isLoading}
            >
              {isLoading ? 
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</> : 
                <>Save Changes</>
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Knowledge Dialog */}
      <Dialog open={isKnowledgeDialogOpen} onOpenChange={setIsKnowledgeDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Knowledge</DialogTitle>
            <DialogDescription>
              Add information that your AI assistant should know about
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <Input 
                value={newKnowledgeSource} 
                onChange={(e) => setNewKnowledgeSource(e.target.value)}
                placeholder="Knowledge source or title (optional)"
              />
            </div>
            <div>
              <Textarea 
                value={newKnowledgeContent} 
                onChange={(e) => setNewKnowledgeContent(e.target.value)}
                placeholder="Enter knowledge content..."
                className="min-h-[200px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsKnowledgeDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={handleAddKnowledge}
              disabled={isLoading || !newKnowledgeContent.trim()}
            >
              {isLoading ? 
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Adding...</> : 
                <>Add Knowledge</>
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Knowledge Dialog */}
      <Dialog open={isEditKnowledgeDialogOpen} onOpenChange={setIsEditKnowledgeDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Knowledge</DialogTitle>
            <DialogDescription>
              Update this knowledge item
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <Input 
                value={editingKnowledgeSource} 
                onChange={(e) => setEditingKnowledgeSource(e.target.value)}
                placeholder="Knowledge source or title (optional)"
              />
            </div>
            <div>
              <Textarea 
                value={editingKnowledgeContent} 
                onChange={(e) => setEditingKnowledgeContent(e.target.value)}
                placeholder="Enter knowledge content..."
                className="min-h-[200px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => {
              setIsEditKnowledgeDialogOpen(false)
              resetKnowledgeEditState()
            }}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={handleEditKnowledge}
              disabled={isLoading || !editingKnowledgeContent.trim()}
            >
              {isLoading ? 
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</> : 
                <>Save Changes</>
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}