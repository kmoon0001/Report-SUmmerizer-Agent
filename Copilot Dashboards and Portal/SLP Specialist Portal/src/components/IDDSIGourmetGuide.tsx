import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Utensils, 
  Info, 
  ChevronRight, 
  Search, 
  Filter, 
  ChefHat, 
  Scale, 
  Droplets,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  BookOpen
} from 'lucide-react';
import { cn } from '../lib/utils';

interface IDDSILevel {
  level: number;
  name: string;
  color: string;
  description: string;
  testingMethods: string[];
  examples: string[];
}

const IDDSI_LEVELS: IDDSILevel[] = [
  { 
    level: 0, 
    name: 'Thin', 
    color: 'bg-slate-200 text-slate-700', 
    description: 'Flows like water. Fast flow.', 
    testingMethods: ['IDDSI Flow Test: < 1mL remaining in syringe after 10s'],
    examples: ['Water', 'Tea', 'Coffee', 'Juice']
  },
  { 
    level: 1, 
    name: 'Slightly Thick', 
    color: 'bg-gray-400 text-white', 
    description: 'Thicker than water. Flows through a straw.', 
    testingMethods: ['IDDSI Flow Test: 1-4mL remaining in syringe after 10s'],
    examples: ['Anti-regurgitation infant formula', 'Nectar']
  },
  { 
    level: 2, 
    name: 'Mildly Thick', 
    color: 'bg-pink-500 text-white', 
    description: 'Flows off a spoon. Sippable from a cup but requires effort through a straw.', 
    testingMethods: ['IDDSI Flow Test: 4-8mL remaining in syringe after 10s'],
    examples: ['Gravy', 'Yogurt drinks']
  },
  { 
    level: 3, 
    name: 'Moderately Thick / Liquidised', 
    color: 'bg-yellow-500 text-white', 
    description: 'Can be drunk from a cup. Cannot be eaten with a fork.', 
    testingMethods: ['IDDSI Flow Test: > 8mL remaining', 'Fork Drip Test: Drips slowly in dollops'],
    examples: ['Honey', 'Thick soup', 'Liquidised fruit']
  },
  { 
    level: 4, 
    name: 'Extremely Thick / Pureed', 
    color: 'bg-emerald-500 text-white', 
    description: 'Usually eaten with a spoon. Cannot be drunk from a cup.', 
    testingMethods: ['Fork Pressure Test: Smooth surface, no lumps', 'Spoon Tilt Test: Holds shape on spoon'],
    examples: ['Pureed meat', 'Thick Greek yogurt']
  },
  { 
    level: 5, 
    name: 'Minced & Moist', 
    color: 'bg-orange-500 text-white', 
    description: 'Soft and moist. Small lumps (4mm for adults).', 
    testingMethods: ['Fork Pressure Test: Lumps squash and do not return to shape', '4mm Particle Size'],
    examples: ['Minced meat with gravy', 'Mashed vegetables']
  },
  { 
    level: 6, 
    name: 'Soft & Bite-Sized', 
    color: 'bg-blue-500 text-white', 
    description: 'Bite-sized pieces (15mm for adults). Requires chewing.', 
    testingMethods: ['Fork Pressure Test: Piece squashes and does not return to shape'],
    examples: ['Cooked tender meat', 'Soft fruit']
  },
  { 
    level: 7, 
    name: 'Regular / Easy to Chew', 
    color: 'bg-slate-700 text-white', 
    description: 'Normal everyday foods. May include hard, crunchy, or stringy textures.', 
    testingMethods: ['No specific IDDSI test required'],
    examples: ['Bread', 'Steak', 'Apple']
  },
];

export const IDDSIGourmetGuide: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<IDDSILevel | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLevels = IDDSI_LEVELS.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">
            <ChefHat className="w-3 h-3" />
            Clinical Nutrition Standard
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">IDDSI Gourmet Guide</h1>
          <p className="text-slate-500 font-medium mt-1">Evidence-based texture modification and testing protocols.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <BookOpen className="w-5 h-5 text-slate-600" />
          </button>
          <button className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <Info className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search IDDSI levels or textures..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Levels List */}
        <div className="lg:col-span-5 space-y-3">
          {filteredLevels.map((level) => (
            <button
              key={level.level}
              onClick={() => setSelectedLevel(level)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group",
                selectedLevel?.level === level.level 
                  ? "bg-white border-blue-200 shadow-lg shadow-blue-100 ring-2 ring-blue-500/10" 
                  : "bg-white border-slate-100 hover:border-blue-100 hover:shadow-md"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black shrink-0",
                level.color
              )}>
                {level.level}
              </div>
              <div className="flex-1">
                <div className="font-black text-slate-900">{level.name}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Level {level.level}</div>
              </div>
              <ChevronRight className={cn(
                "w-5 h-5 transition-all",
                selectedLevel?.level === level.level ? "text-blue-600 translate-x-1" : "text-slate-300"
              )} />
            </button>
          ))}
        </div>

        {/* Level Details */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {selectedLevel ? (
              <motion.div
                key={selectedLevel.level}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-10"
              >
                <div className="flex items-center gap-6 mb-10">
                  <div className={cn(
                    "w-20 h-20 rounded-3xl flex items-center justify-center text-3xl font-black shadow-xl",
                    selectedLevel.color
                  )}>
                    {selectedLevel.level}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">{selectedLevel.name}</h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1">IDDSI Framework Standard</p>
                  </div>
                </div>

                <div className="space-y-10">
                  <section>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      Description
                    </h3>
                    <p className="text-slate-600 leading-relaxed font-medium">
                      {selectedLevel.description}
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      <Scale className="w-4 h-4" />
                      Testing Methods
                    </h3>
                    <div className="space-y-3">
                      {selectedLevel.testingMethods.map((method, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="text-sm font-bold text-slate-700">{method}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      <Utensils className="w-4 h-4" />
                      Common Examples
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedLevel.examples.map((ex, i) => (
                        <span key={i} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest">
                          {ex}
                        </span>
                      ))}
                    </div>
                  </section>

                  <div className="pt-6 border-t border-slate-100">
                    <button className="w-full flex items-center justify-center gap-3 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                      Generate Patient Handout
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 text-center">
                <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6">
                  <Utensils className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Select an IDDSI Level</h3>
                <p className="text-slate-400 max-w-xs font-medium">Choose a level from the list to view detailed clinical testing protocols and examples.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
