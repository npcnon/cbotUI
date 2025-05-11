"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { keyframes } from "@emotion/react";
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
import { AlertCircle, Plus, Trash2, Edit, Send, PenLine, BookOpen, Loader2, Key, LogOut } from "lucide-react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import ChatMessage from "@/components/chatbot/ChatMessage"
import apiClient from "@/lib/api-client"
import { toast } from "sonner"
import { ApiKeysSidebar } from "@/components/chatbot/ApiKeySideBar"
import { stringify } from "querystring"
import { useRouter } from "next/navigation"
import HowToUseDialog from "@/components/instructions/HowToUseDialog"

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

const pulseKeyframe = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(245, 158, 11, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(245, 158, 11, 0);
  }
`;

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
  const [customAIId, setCustomAIId] = useState<string>("") // Default AI ID
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true) //TODO: fix this expansion later
  const [currentAIModel, setCurrentAIModel] = useState("mistralai/Mistral-7B-Instruct-v0.3");
  // UI state
  const [activeTab, setActiveTab] = useState("chat")
  const [avatars, setAvatars] = useState({
    user: "👤",
    assistant: "🤖"
  })

  // AI Model options
  const aiModels = [
    { value: "mistralai/Mistral-7B-Instruct-v0.3", label: "Mistral 7B(Temporarily not available)", disabled: true },
    { value: "deepseek-ai/DeepSeek-V3", label: "DeepSeek V3", disabled: false },
    { value: "Qwen3-235B-A22B", label: "Qwen3 (Coming Soon)", disabled: true },
    { value: "meta-llama/Llama-3.3-70B-Instruct", label: "Llama-3.3-70B-Instruct (Coming Soon)", disabled: true },
    { value: "more-coming-soon", label: "More models coming soon...", disabled: true },
  ]
    
  const router = useRouter()
  // Fetch personality and knowledge data on mount
  useEffect(() => {
    const init = async () => {
      const authorized = await checkAuth();
      if (authorized) {
        await loadData();
      }
    };

    init();
  }, [router])


  const checkAuth = async () => {
    try {
      await apiClient.get('/user/me')
      const customAIResponse = await apiClient.get('/custom-ai/me')
      if (customAIResponse.data) {
        setCustomAIId(customAIResponse.data.id)
        setCurrentAIModel(customAIResponse.data.ai_model || "mistralai/Mistral-7B-Instruct-v0.3")
      }
      return true
    } catch (error) {
      console.error("Authentication error:", error)
      // User is not authenticated, immediately redirect to login page
      router.replace('/auth/login')
      return // Stop further execution
    }
  }

  const handleLogout = async () => {
    try {
      await apiClient.post('/user/logout')
      toast.success("Logged out successfully")
      router.replace('/auth/login')
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Failed to logout. Please try again.")
    }
  }

  const loadData = async () => {
    setIsDataLoading(true)
    try {
      // Fetch personality
      try {
        const personalityResponse = await apiClient.get('/personality/by-user')
        setPersonality(personalityResponse.data)
        setEditingPersonality(personalityResponse.data?.content || "")
        
        if (personalityResponse.data) {
          setCustomAIId(personalityResponse.data.custom_ai_id)
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          // User has no personality set yet
          setPersonality(null)
          setEditingPersonality("")
        } else {
          throw error // Rethrow other errors
        }
      }
      
      // Fetch knowledge items
      try {
        const knowledgeResponse = await apiClient.get('/knowledge-base/by-user')
        setKnowledgeItems(knowledgeResponse.data || [])
      } catch (error) {
        console.error("Error fetching knowledge base:", error)
        setKnowledgeItems([])
      }
    } 
    catch (error: any) {
      console.error("Error loading data:", error)

      const detail = error.response?.data?.detail;

      if (detail === "Personality not found for this user") {
        setPersonality(null)
        setEditingPersonality("")

        toast.info("No AI setup found", {
          description: "Please set up your AI to begin customizing.",
        })
      } else {
        toast.error("Couldn't connect to server", {
          description: `Please try again later. ${stringify(error)}`,
        })
      }
    }
  finally {
      setIsDataLoading(false)
    }
  }

  const isChatLocked = () => {
    return !personality || knowledgeItems.length === 0
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
    
    // Call the chat API endpoint with chat history
    const response = await apiClient.post('/chat', {
      ai_id: customAIId,
      user_text: userInput,
      chat_history: chatHistory // Send the chat history to the API
    });
    
    console.log("API response:", response.data);
    
    // Extract the assistant's response from the API response
    const assistantResponseContent = response.data.response || "I'm not sure how to respond to that.";
    
    // Add assistant response to the messages
    const assistantMessage: Message = { 
      role: "assistant", 
      content: assistantResponseContent,
      timestamp: new Date()
    }
    
    // setMessages([...updatedMessages, assistantMessage])
    

    const apiChatHistory = response.data.chat_history;
    if (apiChatHistory && Array.isArray(apiChatHistory)) {
      const formattedMessages = apiChatHistory.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: new Date()
      }));
      setMessages(formattedMessages);
    }
    
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
        <header className="p-4 border-b flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Custom AI Assistant(DEMO VERSION)</h1>
            <p className="text-sm text-muted-foreground">
              Chat with your personalized AI assistant with custom knowledge
            </p>
          </div>
          <div className="flex items-center gap-2">
            <HowToUseDialog />
            <Button 
              variant="outline" 
              onClick={handleLogout} 
              className="flex items-center gap-1"
            >
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </header>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} 
        className="flex-1 flex flex-col bg-gray-900/80 backdrop-blur-sm">
          <div className="border-b border-gray-800 px-4">
            <TabsList className="bg-gray-800/50">
              <TabsTrigger 
                value="chat"
                className="data-[state=active]:bg-gray-700/50 data-[state=active]:text-indigo-300"
              >
                Test AI(Chat)
              </TabsTrigger>
              <TabsTrigger 
                value="personality"
                className="data-[state=active]:bg-gray-700/50 data-[state=active]:text-indigo-300"
              >
                Personality
              </TabsTrigger>
              <TabsTrigger 
                value="knowledge"
                className="data-[state=active]:bg-gray-700/50 data-[state=active]:text-indigo-300"
              >
                Knowledge
              </TabsTrigger>
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
            ) : isChatLocked() ? (
              <div className="flex-1 flex items-center justify-center p-4">
                <Card className="max-w-md border-2 border-red-500">
                  <CardHeader>
                    <CardTitle className="text-red-700 flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      Chat Locked
                    </CardTitle>
                    <CardDescription>
                      You need to complete the following steps before you can chat with your AI assistant:
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {!personality && (
                        <div className="flex items-start space-x-2">
                          <div className="bg-red-100 text-red-700 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">1</div>
                          <div>
                            <p className="font-medium">Create a personality</p>
                            <p className="text-sm text-muted-foreground">Define how your AI assistant behaves and responds</p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-2 text-red-700 border-red-500"
                              onClick={() => setActiveTab("personality")}
                            >
                              Go to Personality Tab
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {knowledgeItems.length === 0 && (
                        <div className="flex items-start space-x-2">
                          <div className="bg-red-100 text-red-700 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">{!personality ? "2" : "1"}</div>
                          <div>
                            <p className="font-medium">Add knowledge items</p>
                            <p className="text-sm text-muted-foreground">Teach your AI assistant what it needs to know</p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-2 text-red-700 border-red-500"
                              onClick={() => setActiveTab("knowledge")}
                            >
                              Go to Knowledge Tab
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <>
                {/* Chat messages - this is original code */}
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
                
                {/* Input area - original code */}
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
                <Card className={!personality ? "border-2 border-red-500 shadow-lg" : ""}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <div>AI Personality</div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsPersonalityDialogOpen(true)}
                        disabled={isLoading}
                        className={!personality ? "bg-red-100 hover:bg-red-200 text-red-700 border-red-500" : ""}
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
                      <div>
                        <Alert className="border-red-500 bg-red-50">
                          <AlertCircle className="h-4 w-4 text-red-500" />
                          <AlertDescription className="text-red-700">
                            <strong>No personality defined!</strong> You must create a personality before your AI can function.
                          </AlertDescription>
                        </Alert>
                        <div className="mt-4 text-center">
                          <Button 
                            onClick={() => setIsPersonalityDialogOpen(true)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            <Plus className="h-4 w-4 mr-1" /> Create Personality Now
                          </Button>
                        </div>
                      </div>
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
                      <Select 
                        value={currentAIModel}
                        onValueChange={(value) => {
                          setCurrentAIModel(value); // Update local state immediately
                          
                          // Add the API call to update the model
                          apiClient.put(`/custom-ai/${customAIId}`, {
                            ai_model: value
                          })
                          .then(response => {
                            toast.success("AI model updated successfully");
                          })
                          .catch(error => {
                            console.error("Error updating AI model:", error);
                            toast.error("Failed to update AI model. Please try again.");
                            setCurrentAIModel(currentAIModel);
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select an AI model" />
                        </SelectTrigger>
                        <SelectContent>
                          {aiModels.map(model => (
                            <SelectItem 
                              key={model.value} 
                              value={model.value} 
                              disabled={model.disabled}
                            >
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
                    className={knowledgeItems.length === 0 ? "bg-red-600 hover:bg-red-700 text-white" : ""}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Knowledge
                  </Button>
                </div>
                
                {knowledgeItems.length === 0 ? (
                  <Card className="border-2 border-red-500 shadow-lg">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
                        <h3 className="text-lg font-bold text-red-700">Knowledge Base Required</h3>
                        <p className="text-sm mt-2 mb-4">
                          Your AI assistant needs knowledge to function. Add knowledge items that it should know about.
                        </p>
                        <Button 
                          onClick={() => setIsKnowledgeDialogOpen(true)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          <Plus className="h-4 w-4 mr-1" /> Add Your First Knowledge Item
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
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
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
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
              placeholder="Example: You are a helpful AI assistant with expertise in technical topics. You respond in a friendly and concise manner, providing clear explanations with examples when needed."
              className={`min-h-[200px] ${!personality ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            />
            {!personality && (
              <Alert className="bg-red-50 border-red-500 text-red-700">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Required:</strong> Your AI needs a personality to function properly. 
                  Be descriptive about how it should respond to users.
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsPersonalityDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={handleUpdatePersonality}
              disabled={isLoading || !editingPersonality.trim()}
              className={!personality ? "bg-red-600 hover:bg-red-700" : ""}
            >
              {isLoading ? 
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</> : 
                <>{personality?.id ? 'Save Changes' : 'Create Personality'}</>
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Knowledge Dialog */}
      <Dialog open={isKnowledgeDialogOpen} onOpenChange={setIsKnowledgeDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
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
                className={`min-h-[200px] ${knowledgeItems.length === 0 ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
            </div>
            {knowledgeItems.length === 0 && (
              <Alert className="bg-red-50 border-red-500 text-red-700">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Required:</strong> Your AI needs at least one knowledge item to function properly.
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsKnowledgeDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={handleAddKnowledge}
              disabled={isLoading || !newKnowledgeContent.trim()}
              className={knowledgeItems.length === 0 ? "bg-red-600 hover:bg-red-700" : ""}
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
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
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
      <ApiKeysSidebar 
        isExpanded={isSidebarExpanded} 
        isChatLocked={isChatLocked()} 
      />
    </div>
  )
}

const styles = {
  pulseAnimation: {
    animation: `${pulseKeyframe} 2s infinite`,
  }
};