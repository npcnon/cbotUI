"use client"

import React from 'react';

interface ApiKeyCreatedModalProps {
  apiKey: string;
  onClose: () => void;
}

export const ApiKeyCreatedModal: React.FC<ApiKeyCreatedModalProps> = ({ apiKey, onClose }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-indigo-900/30 p-6 rounded-lg shadow-lg max-w-md w-full text-white">
        <h3 className="text-lg font-semibold mb-4 text-indigo-200">API Key Created</h3>
        <p className="mb-2 text-red-400 font-medium">
          This key will only be shown once. Please save it somewhere safe.
        </p>
        <div className="bg-gray-800 p-3 rounded-md mb-4 break-all font-mono text-sm text-indigo-100">
          {apiKey}
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={copyToClipboard}
            className="bg-gray-800 text-gray-200 py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Copy to Clipboard
          </button>
          <button
            onClick={onClose}
            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};