// components/Sidebar.tsx
import { useState } from "react"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

export function Sidebar() {
  const [systemMessage, setSystemMessage] = useState("You are a friendly AI conversing with a human user.")
  const [starterMessage, setStarterMessage] = useState("Hello, there! How can I help you today?")
  const [customContext, setCustomContext] = useState("")
  const [maxResponseLength, setMaxResponseLength] = useState(128)

  return (
    <div className="w-80 border-l bg-muted/10 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">System Settings</h2>

      <div className="space-y-6">
        {/* AI Settings */}
        <div>
          <h3 className="text-md font-medium mb-2">AI Settings</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm" htmlFor="system-message">System Message</label>
              <Textarea
                id="system-message"
                value={systemMessage}
                onChange={(e) => setSystemMessage(e.target.value)}
                className="h-24"
              />
            </div>
            
            <div>
              <label className="text-sm" htmlFor="starter-message">First AI Message</label>
              <Textarea
                id="starter-message"
                value={starterMessage}
                onChange={(e) => setStarterMessage(e.target.value)}
                className="h-24"
              />
            </div>
          </div>
        </div>

        {/* Context Injection */}
        <div>
          <h3 className="text-md font-medium mb-2">Context Injection</h3>
          <Textarea
            value={customContext}
            onChange={(e) => setCustomContext(e.target.value)}
            placeholder="Custom Knowledge or Instructions"
            className="h-24 mb-2"
          />
          <Button className="w-full">Apply Context</Button>
        </div>

        {/* Model Settings */}
        <div>
          <h3 className="text-md font-medium mb-2">Model Settings</h3>
          <div className="flex items-center gap-2">
            <label className="text-sm">Max Response Length:</label>
            <Input
              type="number"
              value={maxResponseLength}
              onChange={(e) => setMaxResponseLength(Number(e.target.value))}
              className="w-24"
            />
          </div>
        </div>

        {/* Avatar Selection */}
        <div>
          <h3 className="text-md font-medium mb-2">Select Avatars</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm block mb-1">AI Avatar</label>
              <Select defaultValue="🤗">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="🤗">🤗</SelectItem>
                  <SelectItem value="💬">💬</SelectItem>
                  <SelectItem value="🤖">🤖</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm block mb-1">User Avatar</label>
              <Select defaultValue="👤">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="👤">👤</SelectItem>
                  <SelectItem value="👱‍♂️">👱‍♂️</SelectItem>
                  <SelectItem value="👨🏾">👨🏾</SelectItem>
                  <SelectItem value="👩">👩</SelectItem>
                  <SelectItem value="👧🏾">👧🏾</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <Button variant="outline" className="w-full">Reset Chat History</Button>
      </div>
    </div>
  )
}