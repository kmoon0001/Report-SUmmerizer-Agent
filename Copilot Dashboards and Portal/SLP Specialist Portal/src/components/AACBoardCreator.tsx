import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutGrid, 
  Plus, 
  Printer, 
  Download, 
  Trash2, 
  Type, 
  Image as ImageIcon,
  Settings,
  Smile,
  Utensils,
  Activity,
  AlertCircle,
  MessageSquare,
  Eye
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAI } from '../context/AIContext';
import { aiService } from '../services/ai-service';
import { PrintHeader } from './PrintHeader';
import { PatientViewWrapper } from './layout/PatientViewWrapper';

interface AACCell {
  id: string;
  text: string;
  icon?: string; // URL or icon name
  color: string;
  type: 'noun' | 'verb' | 'adjective' | 'social' | 'other';
}

const PRESET_CATEGORIES = [
  { id: 'basics', label: 'Basics', icon: MessageSquare, color: 'bg-blue-100 border-blue-200 text-blue-800' },
  { id: 'food', label: 'Food & Drink', icon: Utensils, color: 'bg-emerald-100 border-emerald-200 text-emerald-800' },
  { id: 'feelings', label: 'Feelings', icon: Smile, color: 'bg-amber-100 border-amber-200 text-amber-800' },
  { id: 'activities', label: 'Activities', icon: Activity, color: 'bg-purple-100 border-purple-200 text-purple-800' },
  { id: 'pain', label: 'Pain/Medical', icon: AlertCircle, color: 'bg-rose-100 border-rose-200 text-rose-800' },
];

const PRESET_DATA: Record<string, AACCell[]> = {
  basics: [
    { id: 'yes', text: 'Yes', type: 'social', color: 'bg-green-100 border-green-200', icon: 'https://images.unsplash.com/photo-1542596594-649edbc13630?auto=format&fit=crop&q=80&w=200' },
    { id: 'no', text: 'No', type: 'social', color: 'bg-red-100 border-red-200', icon: 'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?auto=format&fit=crop&q=80&w=200' },
    { id: 'help', text: 'Help', type: 'social', color: 'bg-yellow-100 border-yellow-200', icon: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=200' },
    { id: 'toilet', text: 'Toilet', type: 'noun', color: 'bg-blue-100 border-blue-200', icon: 'https://images.unsplash.com/photo-1584622050111-993a426fbf0a?auto=format&fit=crop&q=80&w=200' },
    { id: 'stop', text: 'Stop', type: 'verb', color: 'bg-red-100 border-red-200', icon: 'https://images.unsplash.com/photo-1573511860302-28c524319697?auto=format&fit=crop&q=80&w=200' },
    { id: 'go', text: 'Go', type: 'verb', color: 'bg-green-100 border-green-200', icon: 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?auto=format&fit=crop&q=80&w=200' },
    { id: 'more', text: 'More', type: 'adjective', color: 'bg-blue-100 border-blue-200', icon: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&q=80&w=200' },
    { id: 'finished', text: 'Finished', type: 'adjective', color: 'bg-blue-100 border-blue-200', icon: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=200' },
  ],
  food: [
    { id: 'water', text: 'Water', type: 'noun', color: 'bg-blue-100 border-blue-200', icon: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=200' },
    { id: 'coffee', text: 'Coffee', type: 'noun', color: 'bg-amber-100 border-amber-200', icon: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=200' },
    { id: 'tea', text: 'Tea', type: 'noun', color: 'bg-amber-100 border-amber-200', icon: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&q=80&w=200' },
    { id: 'juice', text: 'Juice', type: 'noun', color: 'bg-orange-100 border-orange-200', icon: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=200' },
    { id: 'breakfast', text: 'Breakfast', type: 'noun', color: 'bg-yellow-100 border-yellow-200', icon: 'https://images.unsplash.com/photo-1533089862017-5614ec95e214?auto=format&fit=crop&q=80&w=200' },
    { id: 'lunch', text: 'Lunch', type: 'noun', color: 'bg-green-100 border-green-200', icon: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=200' },
    { id: 'dinner', text: 'Dinner', type: 'noun', color: 'bg-red-100 border-red-200', icon: 'https://images.unsplash.com/photo-1544025162-d76690b67f61?auto=format&fit=crop&q=80&w=200' },
    { id: 'snack', text: 'Snack', type: 'noun', color: 'bg-purple-100 border-purple-200', icon: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&q=80&w=200' },
    { id: 'hungry', text: 'Hungry', type: 'adjective', color: 'bg-blue-100 border-blue-200', icon: 'https://images.unsplash.com/photo-1584776296944-ab6fb4f25e6e?auto=format&fit=crop&q=80&w=200' },
    { id: 'thirsty', text: 'Thirsty', type: 'adjective', color: 'bg-blue-100 border-blue-200', icon: 'https://images.unsplash.com/photo-1543599538-a6c4f6cc5c05?auto=format&fit=crop&q=80&w=200' },
  ],
  feelings: [
    { id: 'happy', text: 'Happy', type: 'adjective', color: 'bg-yellow-100 border-yellow-200', icon: 'https://images.unsplash.com/photo-1545342952-df5d862338d1?auto=format&fit=crop&q=80&w=200' },
    { id: 'sad', text: 'Sad', type: 'adjective', color: 'bg-blue-100 border-blue-200', icon: 'https://images.unsplash.com/photo-1504151932400-72d4384f04b3?auto=format&fit=crop&q=80&w=200' },
    { id: 'angry', text: 'Angry', type: 'adjective', color: 'bg-red-100 border-red-200', icon: 'https://images.unsplash.com/photo-1564564244660-5d73c057f2d2?auto=format&fit=crop&q=80&w=200' },
    { id: 'scared', text: 'Scared', type: 'adjective', color: 'bg-purple-100 border-purple-200', icon: 'https://images.unsplash.com/photo-1628148854254-7e25089947f1?auto=format&fit=crop&q=80&w=200' },
    { id: 'tired', text: 'Tired', type: 'adjective', color: 'bg-gray-100 border-gray-200', icon: 'https://images.unsplash.com/photo-1541781777631-faaf82218386?auto=format&fit=crop&q=80&w=200' },
    { id: 'bored', text: 'Bored', type: 'adjective', color: 'bg-gray-100 border-gray-200', icon: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&q=80&w=200' },
    { id: 'confused', text: 'Confused', type: 'adjective', color: 'bg-orange-100 border-orange-200', icon: 'https://images.unsplash.com/photo-1576858574144-936301cb6fe2?auto=format&fit=crop&q=80&w=200' },
    { id: 'sick', text: 'Sick', type: 'adjective', color: 'bg-green-100 border-green-200', icon: 'https://images.unsplash.com/photo-1584515933487-9bdb2f2a693f?auto=format&fit=crop&q=80&w=200' },
  ],
  activities: [
    { id: 'tv', text: 'Watch TV', type: 'verb', color: 'bg-green-100 border-green-200', icon: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=200' },
    { id: 'music', text: 'Listen to Music', type: 'verb', color: 'bg-green-100 border-green-200', icon: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=200' },
    { id: 'walk', text: 'Go for Walk', type: 'verb', color: 'bg-green-100 border-green-200', icon: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=200' },
    { id: 'read', text: 'Read', type: 'verb', color: 'bg-green-100 border-green-200', icon: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=200' },
    { id: 'sleep', text: 'Sleep', type: 'verb', color: 'bg-green-100 border-green-200', icon: 'https://images.unsplash.com/photo-1520206183501-b80df610434f?auto=format&fit=crop&q=80&w=200' },
    { id: 'visit', text: 'Visit Family', type: 'verb', color: 'bg-green-100 border-green-200', icon: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=200' },
    { id: 'phone', text: 'Phone Call', type: 'verb', color: 'bg-green-100 border-green-200', icon: 'https://images.unsplash.com/photo-1520923642038-b4259acecbd7?auto=format&fit=crop&q=80&w=200' },
    { id: 'game', text: 'Play Game', type: 'verb', color: 'bg-green-100 border-green-200', icon: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&q=80&w=200' },
  ],
  pain: [
    { id: 'head', text: 'Head', type: 'noun', color: 'bg-amber-100 border-amber-200', icon: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=200' },
    { id: 'chest', text: 'Chest', type: 'noun', color: 'bg-amber-100 border-amber-200', icon: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=200' },
    { id: 'stomach', text: 'Stomach', type: 'noun', color: 'bg-amber-100 border-amber-200', icon: 'https://images.unsplash.com/photo-1513224502586-d254a5245c50?auto=format&fit=crop&q=80&w=200' },
    { id: 'back', text: 'Back', type: 'noun', color: 'bg-amber-100 border-amber-200', icon: 'https://images.unsplash.com/photo-1544367563-12123d832d34?auto=format&fit=crop&q=80&w=200' },
    { id: 'arm', text: 'Arm', type: 'noun', color: 'bg-amber-100 border-amber-200', icon: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=200' },
    { id: 'leg', text: 'Leg', type: 'noun', color: 'bg-amber-100 border-amber-200', icon: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=200' },
    { id: 'sharp', text: 'Sharp Pain', type: 'adjective', color: 'bg-red-100 border-red-200', icon: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&q=80&w=200' },
    { id: 'dull', text: 'Dull Pain', type: 'adjective', color: 'bg-blue-100 border-blue-200', icon: 'https://images.unsplash.com/photo-1618932260643-2d87d945190a?auto=format&fit=crop&q=80&w=200' },
    { id: 'nurse', text: 'Nurse', type: 'noun', color: 'bg-blue-100 border-blue-200', icon: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=200' },
    { id: 'doctor', text: 'Doctor', type: 'noun', color: 'bg-blue-100 border-blue-200', icon: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200' },
  ],
};

const DEFAULT_GRID_SIZE = 12; // 3x4

export function AACBoardCreator() {
  const { features } = useAI();
  const [cells, setCells] = useState<AACCell[]>([]);
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState('');
  const [isPatientView, setIsPatientView] = useState(false);
  
  const boardRef = useRef<HTMLDivElement>(null);

  const loadPreset = (categoryId: string) => {
    const presetCells = PRESET_DATA[categoryId];
    if (presetCells) {
      setCells(presetCells.map(c => ({ ...c, id: `cell-${Date.now()}-${c.id}` })));
    }
  };

  const getColorForType = (type: string) => {
    switch (type) {
      case 'noun': return 'bg-amber-100 border-amber-200'; // Fitzgerald Key: Yellow
      case 'verb': return 'bg-green-100 border-green-200'; // Fitzgerald Key: Green
      case 'adjective': return 'bg-blue-100 border-blue-200'; // Fitzgerald Key: Blue
      case 'social': return 'bg-pink-100 border-pink-200'; // Fitzgerald Key: Pink/Purple
      default: return 'bg-white border-slate-200';
    }
  };

  const handleGenerate = async () => {
    if (!topic || !features.advancedAI) return;
    setIsGenerating(true);
    try {
      const words = await aiService.generateAACBoard(topic, DEFAULT_GRID_SIZE);
      
      const newCells: AACCell[] = words.map((w, i) => ({
        id: `cell-${Date.now()}-${i}`,
        text: w.text,
        type: w.type as any,
        color: getColorForType(w.type)
      }));
      
      setCells(newCells);
    } catch (error) {
      console.error("Failed to generate AAC board", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const addCell = () => {
    if (cells.length >= DEFAULT_GRID_SIZE) return;
    const newCell: AACCell = {
      id: `cell-${Date.now()}`,
      text: 'New Button',
      type: 'other',
      color: 'bg-white border-slate-200'
    };
    setCells([...cells, newCell]);
  };

  const updateCell = (id: string, updates: Partial<AACCell>) => {
    setCells(cells.map(c => c.id === id ? { ...c, ...updates, color: updates.type ? getColorForType(updates.type) : c.color } : c));
  };

  const deleteCell = (id: string) => {
    setCells(cells.filter(c => c.id !== id));
    setSelectedCell(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const renderContent = () => (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <LayoutGrid className="w-6 h-6 text-indigo-600" />
            AAC Board Creator
          </h2>
          <p className="text-slate-500 text-sm font-medium">Design custom communication boards with Fitzgerald Key color coding.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsPatientView(true)}
            className="flex items-center gap-3 px-6 py-4 bg-emerald-100 text-emerald-700 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-emerald-200 transition-all shadow-lg shadow-emerald-100 min-h-[44px]"
          >
            <Eye className="w-5 h-5" />
            Patient View
          </button>
          <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
            <Download className="w-4 h-4" /> Save
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Sidebar Controls */}
        <div className="w-80 bg-white border-r border-slate-200 p-6 overflow-y-auto z-10 print:hidden">
          <div className="space-y-8">
            {/* AI Generator */}
            <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
              <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Settings className="w-3 h-3" />
                AI Quick Build
              </h3>
              <div className="space-y-3">
                <input 
                  type="text" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Topic (e.g., 'Hospital', 'Breakfast')"
                  className="w-full p-3 rounded-xl border border-indigo-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !topic}
                  className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {isGenerating ? 'Generating...' : 'Auto-Populate'}
                </button>
              </div>
            </div>

            {/* Cell Editor */}
            {selectedCell ? (
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Edit Selected Cell</h3>
                {(() => {
                  const cell = cells.find(c => c.id === selectedCell);
                  if (!cell) return null;
                  return (
                    <>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500">Label Text</label>
                        <input 
                          type="text" 
                          value={cell.text}
                          onChange={(e) => updateCell(cell.id, { text: e.target.value })}
                          className="w-full p-3 rounded-xl border border-slate-200 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500">Word Type (Color Code)</label>
                        <select 
                          value={cell.type}
                          onChange={(e) => updateCell(cell.id, { type: e.target.value as any })}
                          className="w-full p-3 rounded-xl border border-slate-200 text-sm"
                        >
                          <option value="noun">Noun (Yellow)</option>
                          <option value="verb">Verb (Green)</option>
                          <option value="adjective">Adjective (Blue)</option>
                          <option value="social">Social (Pink)</option>
                          <option value="other">Other (White)</option>
                        </select>
                      </div>
                      <button 
                        onClick={() => deleteCell(cell.id)}
                        className="w-full py-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-rose-100 transition-colors flex items-center justify-center gap-2 mt-4"
                      >
                        <Trash2 className="w-4 h-4" /> Delete Cell
                      </button>
                    </>
                  );
                })()}
              </div>
            ) : (
              <div className="text-center py-10 text-slate-400">
                <p className="text-sm">Select a cell to edit its properties.</p>
              </div>
            )}
            
            <div className="pt-6 border-t border-slate-100">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Templates</h3>
               <div className="grid grid-cols-2 gap-2">
                 {PRESET_CATEGORIES.map(cat => (
                   <button 
                     key={cat.id} 
                     onClick={() => loadPreset(cat.id)}
                     className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-2 ${cat.color} hover:opacity-80 transition-opacity`}
                   >
                     <cat.icon className="w-5 h-5" />
                     {cat.label}
                   </button>
                 ))}
               </div>
            </div>
          </div>
        </div>

        {/* Board Canvas */}
        <div className="flex-1 p-8 overflow-y-auto bg-slate-100/50 flex flex-col items-center justify-start pt-12">
          <div className="w-full max-w-4xl mb-8 hidden print:block">
             <PrintHeader title="Communication Board" subtitle={topic || "Custom Board"} />
          </div>
          <div 
            ref={boardRef}
            className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-200 w-full max-w-4xl aspect-[4/3] relative print:shadow-none print:border-none print:aspect-auto"
          >
            <div className="grid grid-cols-4 gap-4 h-full">
              {Array.isArray(cells) && cells.map((cell) => (
                <motion.div
                  key={cell.id}
                  layoutId={cell.id}
                  onClick={() => setSelectedCell(cell.id)}
                  className={cn(
                    "rounded-2xl border-2 flex flex-col items-center justify-center p-4 cursor-pointer transition-all relative group",
                    cell.color,
                    selectedCell === cell.id ? "ring-4 ring-indigo-500/20 scale-105 z-10 shadow-lg" : "hover:shadow-md"
                  )}
                >
                  {/* Icon/Image Logic */}
                  <div className="w-16 h-16 mb-2 bg-white rounded-xl flex items-center justify-center overflow-hidden border border-slate-100/50 shadow-sm">
                    {cell.icon && cell.icon.startsWith('http') ? (
                      <img 
                        src={cell.icon} 
                        alt={cell.text} 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="opacity-40 text-slate-900">
                        {cell.type === 'noun' ? <ImageIcon className="w-8 h-8" /> :
                         cell.type === 'verb' ? <Activity className="w-8 h-8" /> :
                         cell.type === 'social' ? <MessageSquare className="w-8 h-8" /> :
                         <Type className="w-8 h-8" />}
                      </div>
                    )}
                  </div>
                  <span className="text-center font-bold text-slate-900 leading-tight">{cell.text}</span>
                </motion.div>
              ))}
              
              {Array.isArray(cells) && cells.length < DEFAULT_GRID_SIZE && (
                <button 
                  onClick={addCell}
                  className="rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-4 text-slate-300 hover:text-indigo-500 hover:border-indigo-200 hover:bg-indigo-50 transition-all"
                >
                  <Plus className="w-8 h-8 mb-2" />
                  <span className="font-bold text-xs uppercase tracking-widest">Add Button</span>
                </button>
              )}
            </div>
            
            {/* Branding Footer for Print */}
            <div className="absolute bottom-4 right-8 text-[10px] font-black text-slate-300 uppercase tracking-widest hidden print:block">
              Created with SLP Nexus
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .bg-white.border-b { display: none; }
          .w-80 { display: none; }
          .flex-1.p-8 { background: white; padding: 0; overflow: visible; }
          .max-w-4xl { max-width: 100%; width: 100%; box-shadow: none; border: none; }
          .aspect-\\[4\\/3\\] { aspect-ratio: auto; height: 100vh; }
          .grid { height: auto; }
          .print\\:block { display: block !important; visibility: visible; }
          .print\\:block * { visibility: visible; }
          /* Target the board specifically */
          .bg-white.p-8.rounded-\\[2rem\\] { visibility: visible; position: absolute; left: 0; top: 0; width: 100%; height: 100%; }
          .bg-white.p-8.rounded-\\[2rem\\] * { visibility: visible; }
        }
      `}</style>
    </div>
  );

  return (
    <>
      {isPatientView ? (
        <PatientViewWrapper title="AAC Board Creator" onExit={() => setIsPatientView(false)}>
          {renderContent()}
        </PatientViewWrapper>
      ) : (
        renderContent()
      )}
    </>
  );
}
