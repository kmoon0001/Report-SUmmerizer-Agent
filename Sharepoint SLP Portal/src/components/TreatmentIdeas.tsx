import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Target, 
  Package, 
  ListChecks, 
  X, 
  ChevronRight,
  Brain,
  Stethoscope,
  MessageSquare,
  Volume2,
  Smartphone,
  Baby,
  Eye
} from 'lucide-react';
import { TREATMENT_ACTIVITIES, TreatmentActivity } from '../data/treatment-ideas';
import { cn } from '../lib/utils';
import { PatientViewWrapper } from './layout/PatientViewWrapper';

const CategoryIcon = ({ category, className }: { category: string, className?: string }) => {
  switch (category) {
    case 'Dysphagia': return <Stethoscope className={className} />;
    case 'Aphasia': return <MessageSquare className={className} />;
    case 'Cognition': return <Brain className={className} />;
    case 'Voice': return <Volume2 className={className} />;
    case 'AAC': return <Smartphone className={className} />;
    case 'Pediatric': return <Baby className={className} />;
    default: return <BookOpen className={className} />;
  }
};

export const TreatmentIdeas = ({ categoryId }: { categoryId?: string }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(categoryId || null);
  const [isPatientView, setIsPatientView] = useState(false);

  // Map categoryId to TreatmentActivity category
  const categoryMap: Record<string, string> = {
    'dysphagia': 'Dysphagia',
    'aphasia': 'Aphasia',
    'cog-comm': 'Cognition',
    'voice': 'Voice',
    'aac-hub': 'AAC',
    'pediatric': 'Pediatric'
  };

  const effectiveFilter = activeFilter ? (categoryMap[activeFilter] || activeFilter) : null;

  const filteredActivities = effectiveFilter 
    ? TREATMENT_ACTIVITIES.filter(a => a.category === effectiveFilter)
    : TREATMENT_ACTIVITIES;

  const selectedActivity = TREATMENT_ACTIVITIES.find(a => a.id === selectedId);

  const renderContent = () => (
    <div className="space-y-8 p-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">SLP Treatment Ideas</h2>
          <p className="text-slate-500 font-medium">Evidence-based activities and protocols for clinical practice.</p>
        </div>
        
        <div className="flex items-center gap-4">
          {effectiveFilter && (
            <button 
              onClick={() => setActiveFilter(null)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-colors"
            >
              <X className="w-4 h-4" />
              Showing {effectiveFilter} • Clear Filter
            </button>
          )}
          {!isPatientView && (
            <button
              onClick={() => setIsPatientView(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200 transition-colors font-bold text-sm"
            >
              <Eye className="w-4 h-4" />
              Patient View
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActivities.map((activity) => (
          <motion.div
            layoutId={`card-${activity.id}`}
            key={activity.id}
            onClick={() => setSelectedId(activity.id)}
            className={cn(
              "group relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 p-8 cursor-pointer hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500",
              selectedId === activity.id ? "opacity-0" : "opacity-100"
            )}
            whileHover={{ y: -8 }}
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <div className={cn("p-4 rounded-2xl text-white shadow-lg", activity.color)}>
                  <CategoryIcon category={activity.category} className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
                  {activity.category}
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-3 leading-tight group-hover:text-indigo-600 transition-colors">
                {activity.title}
              </h3>
              
              <p className="text-sm text-slate-500 line-clamp-2 mb-6 font-medium leading-relaxed">
                {activity.description}
              </p>

              <div className="mt-auto flex items-center text-indigo-600 font-black text-xs uppercase tracking-widest gap-2 group-hover:gap-3 transition-all">
                View Details
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Decorative background element */}
            <div className={cn(
              "absolute -right-8 -bottom-8 w-32 h-32 rounded-full opacity-5 group-hover:opacity-10 transition-opacity",
              activity.color
            )} />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedId && selectedActivity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
            />
            
            <motion.div
              layoutId={`card-${selectedId}`}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-[3rem] shadow-2xl flex flex-col"
            >
              {/* Header Section */}
              <div className={cn("p-8 md:p-12 text-white relative overflow-hidden", selectedActivity.color)}>
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                
                <button 
                  onClick={(e) => { e.stopPropagation(); setSelectedId(null); }}
                  className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 rounded-2xl backdrop-blur-md transition-colors z-10"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                      <CategoryIcon category={selectedActivity.category} className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-[0.2em] opacity-80">
                      {selectedActivity.category} Treatment Activity
                    </span>
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
                    {selectedActivity.title}
                  </h2>
                  
                  <p className="text-lg md:text-xl font-medium opacity-90 max-w-2xl leading-relaxed">
                    {selectedActivity.description}
                  </p>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-10">
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-indigo-50 rounded-xl">
                        <Target className="w-5 h-5 text-indigo-600" />
                      </div>
                      <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Target Goals</h4>
                    </div>
                    <ul className="space-y-4">
                      {Array.isArray(selectedActivity.goals) && selectedActivity.goals.map((goal, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-700 font-medium">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                          {goal}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-emerald-50 rounded-xl">
                        <Package className="w-5 h-5 text-emerald-600" />
                      </div>
                      <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Required Materials</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(selectedActivity.materials) && selectedActivity.materials.map((material, i) => (
                        <span key={i} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-600">
                          {material}
                        </span>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="space-y-10">
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-amber-50 rounded-xl">
                        <ListChecks className="w-5 h-5 text-amber-600" />
                      </div>
                      <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Step-by-Step Instructions</h4>
                    </div>
                    <div className="space-y-6">
                      {Array.isArray(selectedActivity.instructions) && selectedActivity.instructions.map((step, i) => (
                        <div key={i} className="flex gap-4 group">
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                              {i + 1}
                            </div>
                            {i < selectedActivity.instructions.length - 1 && (
                              <div className="w-0.5 h-full bg-slate-100 my-2" />
                            )}
                          </div>
                          <p className="text-slate-600 font-medium leading-relaxed pt-1">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>

              {/* Footer Action */}
              <div className="p-8 border-t border-slate-50 bg-slate-50/50 flex justify-end">
                <button 
                  onClick={() => setSelectedId(null)}
                  className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-lg"
                >
                  Close Details
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    isPatientView ? (
      <PatientViewWrapper title="Treatment Ideas" onExit={() => setIsPatientView(false)}>
        {renderContent()}
      </PatientViewWrapper>
    ) : renderContent()
  );
};
