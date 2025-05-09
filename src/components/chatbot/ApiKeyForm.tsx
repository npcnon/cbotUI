"use client"

import { ApiKeyFormData } from '@/lib/types/types';
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface ApiKeyFormProps {
  onSubmit: (data: ApiKeyFormData) => Promise<void>;
}

export const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<ApiKeyFormData>({
    name: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(formData);
      setFormData({ name: '', description: '' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="name" className="block text-xs font-medium text-gray-300 mb-1">
          Name *
        </label>
        <Input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
          placeholder="Enter a name for your API key"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-xs font-medium text-gray-300 mb-1">
          Description (optional)
        </label>
        <Textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          rows={2}
          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
          placeholder="Enter a description..."
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading || !formData.name}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-indigo-300 hover:text-indigo-200"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
          </>
        ) : (
          'Create API Key'
        )}
      </Button>
    </form>
  );
};