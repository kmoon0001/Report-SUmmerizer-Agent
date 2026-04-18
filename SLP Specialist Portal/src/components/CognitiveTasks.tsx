import { useState } from 'react';
import { Brain, RefreshCw, Layers, Zap, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { COGNITIVE_TASKS_DATA, getRandomTask, getAllTasks } from '../utils/cognitive-data';

export function CognitiveTasks({ searchQuery = '' }: { searchQuery?: string }) {
  const [domain, setDomain] = useState<keyof typeof COGNITIVE_TASKS_DATA>('Memory');
  const [currentTask, setCurrentTask] = useState(COGNITIVE_TASKS_DATA['Memory'][0]);
  const [isAnimating, setIsAnimating] = useState(false);

  const generateTask = () => {
    setIsAnimating(true);
    setTimeout(() => {
      const randomTask = getRandomTask(domain);
      setCurrentTask(randomTask);
      setIsAnimating(false);
    }, 400);
  };

  const allTasks = getAllTasks();

  const filteredTasks = allTasks.filter(t => 
    t.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.level.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (searchQuery) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-900">Search Results</h3>
        {filteredTasks.length > 0 ? (
          <div className="grid gap-4">
            {filteredTasks.map((t, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider bg-violet-100 text-violet-800 px-2 py-1 rounded-md">{t.domain}</span>
                  <span className="text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-1 rounded-md">{t.level}</span>
                </div>
                <p className="text-slate-900 font-medium text-lg">{t.task}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-center py-8">No tasks found matching "{searchQuery}"</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(Object.keys(COGNITIVE_TASKS_DATA) as Array<keyof typeof COGNITIVE_TASKS_DATA>).map((d) => (
          <button
            key={d}
            onClick={() => setDomain(d)}
            className={`p-4 rounded-xl border text-left transition-all ${
              domain === d 
                ? 'bg-violet-600 text-white border-violet-600 shadow-md' 
                : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Brain className={`w-4 h-4 ${domain === d ? 'text-violet-200' : 'text-violet-500'}`} />
              <span className="font-bold">{d}</span>
            </div>
            <p className={`text-xs ${domain === d ? 'text-violet-200' : 'text-slate-400'}`}>
              {COGNITIVE_TASKS_DATA[d].length} activities available
            </p>
          </button>
        ))}
      </div>

      <div className="relative">
        <motion.div
          key={currentTask.task}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-500 to-fuchsia-500" />
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider mb-6">
            <Layers className="w-3 h-3" />
            {currentTask.level} Complexity
          </div>
          
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 leading-tight">
            {currentTask.task}
          </h3>

          <div className="flex justify-center gap-4">
            <button
              onClick={generateTask}
              disabled={isAnimating}
              className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-3 shadow-lg shadow-slate-900/20"
            >
              <RefreshCw className={`w-5 h-5 ${isAnimating ? 'animate-spin' : ''}`} />
              Spin New Task
            </button>
            <button
              onClick={() => alert(`Handout for "${currentTask.task}":\n\n${currentTask.handout}`)}
              className="px-8 py-4 bg-violet-100 text-violet-900 rounded-2xl font-bold hover:bg-violet-200 transition-all active:scale-95 flex items-center gap-3"
            >
              <FileText className="w-5 h-5" />
              Generate Handout
            </button>
          </div>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute -z-10 top-10 -left-4 w-24 h-24 bg-violet-200 rounded-full blur-2xl opacity-50" />
        <div className="absolute -z-10 bottom-10 -right-4 w-32 h-32 bg-fuchsia-200 rounded-full blur-2xl opacity-50" />
      </div>

      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
        <Zap className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-blue-900 text-sm">Therapist Tip</h4>
          <p className="text-sm text-blue-800">
            Always adapt the complexity based on patient response. If they achieve 90%+ accuracy, increase complexity or add a dual-task component (e.g., walking while talking).
          </p>
        </div>
      </div>
    </div>
  );
}
