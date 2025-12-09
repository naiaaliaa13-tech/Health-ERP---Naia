import React, { useState } from 'react';
import { Sparkles, Bot, Loader2 } from 'lucide-react';

interface AIPanelProps {
  title: string;
  placeholder?: string;
  onAnalyze: (input: string) => Promise<any>;
  resultRenderer: (data: any) => React.ReactNode;
  contextData?: any;
}

export const AIPanel: React.FC<AIPanelProps> = ({ title, placeholder, onAnalyze, resultRenderer, contextData }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!input && !contextData) return;
    setLoading(true);
    // If we have context data but no input (e.g., clicking a button to analyze a record), pass a signal
    const dataToAnalyze = input || JSON.stringify(contextData);
    const res = await onAnalyze(dataToAnalyze);
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-primary-50 to-white rounded-xl border border-primary-100 shadow-lg p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4 text-primary-900">
        <div className="p-2 bg-white rounded-lg shadow-sm">
          <Sparkles size={20} className="text-accent-gold" />
        </div>
        <h3 className="font-serif font-bold text-lg">{title}</h3>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        {placeholder && (
          <textarea
            className="w-full h-32 p-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none bg-white/50"
            placeholder={placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        )}
        
        {contextData && (
          <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-500 font-mono">
            {JSON.stringify(contextData).slice(0, 100)}...
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary-900 text-white rounded-lg hover:bg-primary-800 transition-all disabled:opacity-50 shadow-md"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Bot size={18} />}
          {loading ? 'Processing on Vertex AI...' : 'Run Analysis'}
        </button>

        {result && (
          <div className="mt-4 p-4 bg-white rounded-lg border border-slate-200 shadow-inner overflow-y-auto max-h-64 animate-in fade-in slide-in-from-bottom-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Gemini Output</h4>
            {resultRenderer(result)}
          </div>
        )}
      </div>
    </div>
  );
};