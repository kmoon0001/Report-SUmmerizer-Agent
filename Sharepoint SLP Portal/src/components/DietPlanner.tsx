import React, { useState } from 'react';
import { 
  Utensils, 
  ChefHat, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Printer, 
  Download,
  Coffee
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAI } from '../context/AIContext';
import { aiService } from '../services/ai-service';
import { IDDSI_LEVELS } from '../utils/iddsi-data';
import { PrintHeader } from './PrintHeader';

export function DietPlanner() {
  const { features } = useAI();
  const [selectedFoodLevel, setSelectedFoodLevel] = useState('7');
  const [selectedDrinkLevel, setSelectedDrinkLevel] = useState('0');
  const [restrictions, setRestrictions] = useState('');
  const [preferences, setPreferences] = useState('');
  const [generatedMenu, setGeneratedMenu] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateMenu = async () => {
    if (!features.advancedAI) return;
    setIsGenerating(true);
    try {
      const foodLevel = IDDSI_LEVELS.find(l => l.level.toString() === selectedFoodLevel);
      const drinkLevel = IDDSI_LEVELS.find(l => l.level.toString() === selectedDrinkLevel);
      
      const prompt = `Generate a 1-day sample menu (Breakfast, Lunch, Dinner, Snack) for a patient on:
      - Food Level: IDDSI ${selectedFoodLevel} (${foodLevel?.name})
      - Drink Level: IDDSI ${selectedDrinkLevel} (${drinkLevel?.name})
      
      Dietary Restrictions: ${restrictions || 'None'}
      Preferences: ${preferences || 'None'}
      
      Format as a clean, easy-to-read list. Include a brief "Why this works" note for each meal explaining safety.
      Include citations for any specific nutritional guidelines referenced (e.g., [1] IDDSI Framework).`;

      const response = await aiService.generateContent(prompt);
      setGeneratedMenu(response);
    } catch (error) {
      console.error("Menu generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Print Header */}
      <PrintHeader title="Dysphagia Diet Plan" subtitle={`IDDSI Level ${selectedFoodLevel} / ${selectedDrinkLevel}`} />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 print:hidden">
        <div>
          <div className="flex items-center gap-2 mb-3">
             <div className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded">Clinical Tool</div>
             <div className="w-1 h-1 bg-slate-300 rounded-full" />
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">IDDSI Compliant</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Dysphagia <span className="text-emerald-600">Diet Planner</span></h1>
          <p className="text-slate-500 text-lg mt-4 max-w-xl font-medium">Create safe, personalized menus aligned with IDDSI standards.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Configuration Panel */}
        <div className="lg:col-span-4 space-y-8 print:hidden">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-emerald-600" />
              Diet Configuration
            </h3>

            <div className="space-y-8">
              {/* Food Level */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Food Consistency</label>
                <div className="grid grid-cols-1 gap-2">
                  {IDDSI_LEVELS.filter(l => l.type === 'food' || l.type === 'both')
                    .sort((a, b) => b.level - a.level) // Sort descending like original
                    .map(level => (
                    <button
                      key={level.level}
                      onClick={() => setSelectedFoodLevel(level.level.toString())}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-xl border transition-all text-left group",
                        selectedFoodLevel === level.level.toString()
                          ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50" 
                          : "border-slate-100 bg-white hover:border-emerald-200"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shadow-sm", level.color)}>
                          {level.level}
                        </div>
                        <span className="text-sm font-bold text-slate-700">{level.name}</span>
                      </div>
                      {selectedFoodLevel === level.level.toString() && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drink Level */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Drink Thickness</label>
                <div className="grid grid-cols-1 gap-2">
                  {IDDSI_LEVELS.filter(l => l.type === 'drink' || l.type === 'both')
                    .sort((a, b) => b.level - a.level) // Sort descending like original
                    .map(level => (
                    <button
                      key={level.level}
                      onClick={() => setSelectedDrinkLevel(level.level.toString())}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-xl border transition-all text-left group",
                        selectedDrinkLevel === level.level.toString()
                          ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50" 
                          : "border-slate-100 bg-white hover:border-blue-200"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shadow-sm", level.color)}>
                          {level.level}
                        </div>
                        <span className="text-sm font-bold text-slate-700">{level.name}</span>
                      </div>
                      {selectedDrinkLevel === level.level.toString() && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Restrictions</label>
                  <input 
                    type="text" 
                    value={restrictions}
                    onChange={(e) => setRestrictions(e.target.value)}
                    placeholder="e.g., No dairy, low sodium"
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Preferences</label>
                  <input 
                    type="text" 
                    value={preferences}
                    onChange={(e) => setPreferences(e.target.value)}
                    placeholder="e.g., Likes spicy food, vegetarian"
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <button 
                onClick={handleGenerateMenu}
                disabled={isGenerating || !features.advancedAI}
                className="w-full py-4 bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Utensils className="w-4 h-4" />}
                {isGenerating ? 'Planning Menu...' : 'Generate 1-Day Menu'}
              </button>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8 print:col-span-12 print:w-full">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 min-h-[600px] border border-slate-100 shadow-sm relative overflow-hidden print:shadow-none print:border-none print:rounded-none print:p-0 print:min-h-0 print:overflow-visible">
            {generatedMenu ? (
              <div className="prose prose-slate max-w-none">
                <div className="flex justify-between items-start mb-8 border-b border-slate-100 pb-6">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Sample Menu Plan</h2>
                    <div className="flex gap-4 text-sm font-medium text-slate-500">
                      <span className="flex items-center gap-1"><Utensils className="w-4 h-4" /> Level {selectedFoodLevel}</span>
                      <span className="flex items-center gap-1"><Coffee className="w-4 h-4" /> Level {selectedDrinkLevel}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 print:hidden">
                    <button onClick={() => window.print()} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                      <Printer className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="whitespace-pre-wrap font-medium text-slate-700 leading-relaxed">
                  {generatedMenu}
                </div>

                <div className="mt-12 p-6 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
                  <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                  <div className="text-xs text-amber-800 leading-relaxed">
                    <strong>Clinical Safety Note:</strong> This menu is a sample generated by AI. Always verify food textures and liquid consistencies manually before serving to patients. Ensure all items meet strict IDDSI testing methods (Fork Drip Test, Spoon Tilt Test, etc.).
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-20 opacity-40">
                <Utensils className="w-24 h-24 text-slate-200 mb-6" />
                <h4 className="text-2xl font-black text-slate-900 mb-2">Menu Planner</h4>
                <p className="text-slate-500 font-medium max-w-xs mx-auto">Select IDDSI levels and preferences to generate a safe, customized meal plan.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
