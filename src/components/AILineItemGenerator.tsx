import React, { useState } from 'react';
import Anthropic from '@anthropic-ai/sdk';
import { v4 as uuidv4 } from 'uuid';
import { Sparkles, Loader2 } from 'lucide-react';
import type { LineItem } from '../types';

interface AILineItemGeneratorProps {
  onGenerate: (items: LineItem[]) => void;
}

export default function AILineItemGenerator({ onGenerate }: AILineItemGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);

    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
      if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
        throw new Error('Please add a valid VITE_ANTHROPIC_API_KEY in the .env file');
      }

      const anthropic = new Anthropic({
        apiKey,
        dangerouslyAllowBrowser: true,
      });

      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-6', // Using exactly the model requested by user
        max_tokens: 1024,
        system: "You are an assistant that extracts invoice line items from text. Return a raw JSON array of objects. Each object must have 'description' (string), 'quantity' (number), and 'unitPrice' (number). Do not return any markdown formatting, just the raw JSON array.",
        messages: [{ role: 'user', content: prompt }]
      });

      const text = response.content[0].type === 'text' ? response.content[0].text : '';
      
      const jsonStr = text.replace(/```json\n?|\n?```/g, '').trim();
      const parsed = JSON.parse(jsonStr);

      if (!Array.isArray(parsed)) {
        throw new Error('Invalid format returned by AI');
      }

      const newItems: LineItem[] = parsed.map(item => ({
        id: uuidv4(),
        description: item.description || 'Item',
        quantity: Number(item.quantity) || 1,
        unitPrice: Number(item.unitPrice) || 0,
      }));

      onGenerate(newItems);
      setPrompt('');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate line items. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100 mb-6">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-blue-100 rounded-lg text-blue-600 mt-1">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="flex-1 space-y-2">
          <label className="block text-sm font-semibold text-blue-900">
            AI Auto-Fill Line Items
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder='e.g., "Built a landing page, 3 pages, took 5 hours at $25/hr"'
              className="flex-1 px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate'
              )}
            </button>
          </div>
          {error && (
            <p className="text-sm text-red-600 font-medium">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
