// HowToUseDialog.tsx
"use client"

import { useState } from "react"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, HelpCircle, Check, Code } from "lucide-react"

interface CopiedState {
  apiExample: boolean;
  requestBody: boolean;
}

export default function HowToUseDialog() {
  const [isCopied, setIsCopied] = useState<CopiedState>({
    apiExample: false,
    requestBody: false
  })
  
  const copyToClipboard = (text: string, type: keyof CopiedState) => {
    navigator.clipboard.writeText(text)
    setIsCopied(prev => ({ ...prev, [type]: true }))
    setTimeout(() => {
      setIsCopied(prev => ({ ...prev, [type]: false }))
    }, 2000)
  }

  const requestBodyExample = `{
  "user_text": "Do you remember my name?",
  "chat_history": [
    {
      "role": "user",
      "content": "My name is Alex. What can you help me with today?"
    },
    {
      "role": "assistant",
      "content": "Hello Alex! I'm your custom AI assistant. I'm here to help answer your questions. What would you like to know?"
    }
  ]
}`

  const apiUrlExample = `https://chatbot-o0ca.onrender.com/api/v1/chat/api`

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <HelpCircle className="h-4 w-4" />
          How to Use
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">How to Use Custom AI Chat</DialogTitle>
          <DialogDescription>
            Guide for setup and integration with your applications
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="setup" className="mt-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="setup">Setup Guide</TabsTrigger>
            <TabsTrigger value="api">API Integration</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>
          
          <TabsContent value="setup" className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Step 1: Configure Your AI</h3>
              <p className="text-muted-foreground mb-4">
                Start by setting up your AI's personality and knowledge base:
              </p>
              <ol className="list-decimal list-inside space-y-2 pl-2">
                <li><strong>Personality Tab:</strong> Define how your AI assistant should behave and respond to users</li>
                <li><strong>Knowledge Tab:</strong> Add specific information that your AI should know about</li>
                <li><strong>AI Model:</strong> Select which AI model best suits your needs</li>
              </ol>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Step 2: Test Your AI</h3>
              <p className="text-muted-foreground">
                After configuration, switch to the "Test AI (Chat)" tab to see how your AI responds in real conversations. Make adjustments to personality and knowledge as needed.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Step 3: Generate API Keys</h3>
              <p className="text-muted-foreground">
                Once you're satisfied with your AI's behavior, generate API keys to integrate your custom AI with your applications.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="api" className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">API Endpoint</h3>
              <div className="flex items-center gap-2 mb-4">
                <code className="bg-muted p-2 rounded flex-1 text-sm overflow-x-auto">
                  {apiUrlExample}
                </code>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => copyToClipboard(apiUrlExample, 'apiExample')}
                >
                  {isCopied.apiExample ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Authentication</h3>
              <p className="text-muted-foreground mb-2">
                Include your API key in the request headers:
              </p>
              <code className="bg-muted p-2 rounded block text-sm mb-4">
                <span className="text-blue-500">Authorization</span>: <span className="text-green-500">api-key YOUR_API_KEY</span>
              </code>
              <p className="text-sm text-muted-foreground">
                Note: Replace YOUR_API_KEY with the actual key generated from your dashboard.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Request Body Format</h3>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 text-sm font-medium">JSON Structure:</div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => copyToClipboard(requestBodyExample, 'requestBody')}
                >
                  {isCopied.requestBody ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <pre className="bg-muted p-2 rounded text-sm overflow-x-auto">
                {requestBodyExample}
              </pre>
            </div>
          </TabsContent>
          
          <TabsContent value="examples" className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Example: Simple Query</h3>
              <p className="text-muted-foreground mb-2">
                Basic request with just a user question:
              </p>
              <pre className="bg-muted p-2 rounded text-sm mb-4">
{`// Request body
{
  "user_text": "What can you help me with?"
}`}
              </pre>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Example: Conversation Context</h3>
              <p className="text-muted-foreground mb-2">
                Request with conversation history to maintain context:
              </p>
              <pre className="bg-muted p-2 rounded text-sm mb-4">
{`// Request body
{
  "user_text": "Can you remind me?",
  "chat_history": [
    {
      "role": "user",
      "content": "My deadline is on Friday at 3pm"
    },
    {
      "role": "assistant", 
      "content": "I'll remember that your deadline is on Friday at 3pm. Is there anything specific you'd like me to remind you about regarding this deadline?"
    }
  ]
}`}
              </pre>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Response Format</h3>
              <p className="text-muted-foreground mb-2">
                The API returns responses in this format:
              </p>
              <pre className="bg-muted p-2 rounded text-sm">
{`{
  "response": "The AI assistant's response text",
  "chat_history": [
    // Updated conversation history including the new exchange
  ]
}`}
              </pre>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}