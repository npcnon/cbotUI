"use client"

import React from 'react';
import { ApiKey } from '@/lib/types/types';
import { Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ApiKeysListProps {
  apiKeys: ApiKey[];
  onDelete: (id: string) => void;
}

export const ApiKeysList: React.FC<ApiKeysListProps> = ({ apiKeys, onDelete }) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (apiKeys.length === 0) {
    return (
      <div className="text-center py-4 text-gray-400 text-sm">
        No API keys found. Create one to get started.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {apiKeys.map((key) => (
        <div key={key.id} className="border border-gray-800 rounded-md p-3 bg-gray-800/50">
          <div className="flex justify-between">
            <div className="font-medium text-indigo-200">{key.name}</div>
            <div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-red-400 hover:text-red-200 hover:bg-red-900/20"
                onClick={() => onDelete(key.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {key.description && (
            <div className="text-sm text-gray-400 mt-1">{key.description}</div>
          )}
          
          <div className="flex flex-wrap gap-2 mt-2 text-xs">
            <Badge variant="outline" className="text-gray-400 border-gray-700">
              Created: {formatDate(key.created_at)}
            </Badge>
            
            {key.expires_at && (
              <Badge variant="outline" className="text-yellow-400 border-yellow-900/50">
                Expires: {formatDate(key.expires_at)}
              </Badge>
            )}
            
            <Badge variant="outline" className="text-blue-400 border-blue-900/50">
              Usage: {key.usage_count}
            </Badge>
            
            {key.is_active ? (
              <Badge className="bg-green-900/30 text-green-400 border-green-900 hover:bg-green-900/40">
                Active
              </Badge>
            ) : (
              <Badge className="bg-red-900/30 text-red-400 border-red-900 hover:bg-red-900/40">
                Inactive
              </Badge>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};