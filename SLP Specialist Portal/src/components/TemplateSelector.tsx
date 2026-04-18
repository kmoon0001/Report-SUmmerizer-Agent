import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Search, ChevronRight } from 'lucide-react';
import { SLP_TEMPLATES, DocumentationTemplate } from '../constants/templates';
import { cn } from '../lib/utils';

interface TemplateSelectorProps {
  selectedTemplate: string;
  onSelect: (templateName: string) => void;
}

const CATEGORIES = ['Evaluation', 'Treatment', 'Progress', 'Recertification', 'Plan of Care', 'Discharge'] as const;

export function TemplateSelector({ selectedTemplate, onSelect }: TemplateSelectorProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Evaluation');

  const filteredTemplates = SLP_TEMPLATES.filter(t => 
    (activeCategory === 'All' || t.category === activeCategory) &&
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 rounded-lg text-sm border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      <div className="flex border-b border-slate-100 dark:border-slate-800 overflow-x-auto">
        {['All', ...CATEGORIES].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-4 py-3 text-xs font-bold whitespace-nowrap transition-colors border-b-2",
              activeCategory === cat 
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400" 
                : "border-transparent text-slate-500 hover:text-slate-900"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="max-h-[400px] overflow-y-auto p-2">
        {filteredTemplates.map(t => (
          <button
            key={t.id}
            onClick={() => onSelect(t.name)}
            className={cn(
              "w-full p-3 rounded-xl text-left flex items-center justify-between transition-all group",
              selectedTemplate === t.name
                ? "bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800"
                : "hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center",
                selectedTemplate === t.name ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500"
              )}>
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-slate-100">{t.name}</div>
                <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{t.category}</div>
              </div>
            </div>
            <ChevronRight className={cn("w-4 h-4 transition-transform", selectedTemplate === t.name ? "text-indigo-600 translate-x-1" : "text-slate-300")} />
          </button>
        ))}
      </div>
    </div>
  );
}
