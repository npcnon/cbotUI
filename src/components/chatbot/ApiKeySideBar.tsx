"use client"

import { useState, useEffect } from "react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  AlertCircle, 
  Key,
  Loader2,
  Lock
} from "lucide-react"
import { ApiKey, ApiKeyFormData, ApiKeyResponse } from "@/lib/types/types"
import { createApiKey, deleteApiKey, fetchApiKeys } from "@/lib/apikey-client"
import { ApiKeyCreatedModal } from '@/components/chatbot/ApiKeyCreatedModal'
import { ApiKeyForm } from '@/components/chatbot/ApiKeyForm'
import { ApiKeysList } from '@/components/chatbot/ApiKeyList'

interface ApiKeysSidebarProps {
  isExpanded: boolean;
  isChatLocked?: boolean; // New prop to hide the component when chat is locked
}

export const ApiKeysSidebar = ({ isExpanded, isChatLocked = false }: ApiKeysSidebarProps) => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newApiKey, setNewApiKey] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const loadApiKeys = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const keys = await fetchApiKeys()
      setApiKeys(keys)
    } catch (err) {
      setError('Failed to load API keys. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!isChatLocked) {
      loadApiKeys()
    }
  }, [isChatLocked])

  const handleCreateApiKey = async (formData: ApiKeyFormData) => {
    try {
      const response: ApiKeyResponse = await createApiKey(formData)
      setNewApiKey(response.key)
      await loadApiKeys()
      setShowForm(false)
    } catch (err) {
      setError('Failed to create API key. Please try again.')
      console.error(err)
    }
  }

  const handleDeleteApiKey = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      try {
        await deleteApiKey(id)
        await loadApiKeys()
      } catch (err) {
        setError('Failed to delete API key. Please try again.')
        console.error(err)
      }
    }
  }

  // If chat is locked, show a simple locked message instead
  if (isChatLocked) {
    return (
      <div className="w-64 border-l border-gray-800 bg-gray-900/80 backdrop-blur-sm text-gray-400 flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-medium text-gray-500 flex items-center">
              <Lock className="h-4 w-4 mr-2" />
              API Access
            </h3>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-4 text-center">
          <div>
            <Lock className="h-12 w-12 mx-auto mb-4 text-gray-600" />
            <p className="text-sm">
              API access is locked until you set up your AI assistant.
            </p>
            <p className="text-xs mt-2 text-gray-600">
              Complete the personality and knowledge setup to unlock.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!isExpanded) {
    // Render compact view
    return (
      <div className="p-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-indigo-300 hover:text-white hover:bg-gray-800"
          title="API Keys"
          onClick={() => loadApiKeys()}
        >
          <Key className="h-5 w-5" />
        </Button>
      </div>
    )
  }
  
  return (
    <div className="w-64 border-l border-gray-800 bg-gray-900/80 backdrop-blur-sm flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-gray-800">
        <div className="flex justify-between items-center">
          <h3 className="text-md font-medium text-indigo-300 flex items-center">
            <Key className="h-4 w-4 mr-2" />
            API Keys
          </h3>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-indigo-300 hover:text-white hover:bg-gray-800"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "New Key"}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {error && (
          <Card className="border-red-500/30 bg-red-900/20 backdrop-blur-sm">
            <CardContent className="p-3 flex items-center text-sm">
              <AlertCircle className="h-4 w-4 text-red-400 mr-2" />
              <p className="text-red-200">{error}</p>
            </CardContent>
          </Card>
        )}

        {showForm && (
          <Card className="border border-indigo-900/30 shadow-lg bg-gray-900/80 backdrop-blur-md text-white overflow-hidden">
            <CardHeader className="p-3">
              <CardTitle className="text-sm flex items-center">
                <Key className="h-4 w-4 mr-2 text-indigo-400" />
                Create API Key
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <ApiKeyForm onSubmit={handleCreateApiKey} />
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-20">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
          </div>
        ) : (
          <Card className="border border-indigo-900/30 shadow-lg bg-gray-900/80 backdrop-blur-md text-white overflow-hidden">
            <CardContent className="p-3">
              <ApiKeysList apiKeys={apiKeys} onDelete={handleDeleteApiKey} />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal for new API key */}
      {newApiKey && (
        <ApiKeyCreatedModal apiKey={newApiKey} onClose={() => setNewApiKey(null)} />
      )}
    </div>
  )
}