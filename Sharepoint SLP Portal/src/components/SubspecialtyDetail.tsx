import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardList, 
  Activity, 
  BookOpen, 
  Search, 
  Clock, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  X,
  Printer,
  ExternalLink,
  Stethoscope,
  FileText,
  LayoutDashboard,
  Wrench,
  Target,
  Eye
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { SUBSPECIALTY_DATA, Assessment, Treatment, Visual } from '../data/subspecialty-data';
import { SLP_DATA } from '../data/slp-data';
import { cn } from '../lib/utils';
import { Video, Image as ImageIcon, Play, FileText as FileIcon } from 'lucide-react';
import { DysphagiaHub } from './DysphagiaHub';
import { PatientViewWrapper } from './layout/PatientViewWrapper';

interface SubspecialtyDetailProps {
  id: string;
  onNavigate: (view: any, params?: any) => void;
}

type SubTopic = 'overview' | 'assessments' | 'treatments' | 'visuals' | 'resources' | 'deep-dive';

export function SubspecialtyDetail({ id, onNavigate }: SubspecialtyDetailProps) {
  const data = SUBSPECIALTY_DATA[id];
  const category = SLP_DATA.find(c => c.id === id);
  const [selectedSubTopic, setSelectedSubTopic] = useState<SubTopic | null>(null);
  const [selectedItem, setSelectedItem] = useState<Assessment | Treatment | Visual | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPatientView, setIsPatientView] = useState(false);

  if (!data) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-400">
        <Activity className="w-10 h-10" />
      </div>
      <h3 className="text-2xl font-black text-slate-950 mb-2">Module Under Construction</h3>
      <p className="text-slate-600 max-w-md">
        We are currently curating the gold-standard resources for this subspecialty. 
        Check back soon for evidence-based assessments and treatments.
      </p>
    </div>
  );

  const allResearchArchives = category?.content.flatMap(sub => sub.researchArchives || []) || [];
  const filteredResearchArchives = allResearchArchives.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAssessments = data.assessments.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.acronym && a.acronym.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredTreatments = data.treatments.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderContent = () => (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-zinc-950 relative">
      {/* Patient View Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => setIsPatientView(true)}
          className="p-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg rounded-full hover:bg-white dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
          title="Patient View"
        >
          <Eye className="w-6 h-6 text-slate-600 dark:text-slate-300" />
        </button>
      </div>
      {/* Header Section */}
      <div className="bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {selectedSubTopic && (
              <button onClick={() => setSelectedSubTopic(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                <ArrowRight className="w-5 h-5 text-slate-600 dark:text-zinc-400 rotate-180" />
              </button>
            )}
            <div>
              <h2 className="text-2xl font-bold text-slate-950 dark:text-white">{data.title}</h2>
              <p className="text-slate-600 dark:text-zinc-400">{selectedSubTopic ? selectedSubTopic.charAt(0).toUpperCase() + selectedSubTopic.slice(1) : 'Evidence-based clinical resources'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-zinc-500" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-zinc-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 w-64 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="flex-1 overflow-y-auto p-8">
        {!selectedSubTopic ? (
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Related Tools Section */}
            {category?.relatedTools && category.relatedTools.length > 0 && (
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-200 dark:border-zinc-800 shadow-sm">
                <h3 className="text-sm font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Wrench className="w-4 h-4" />
                  Related Clinical Tools
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {category.relatedTools.map((tool) => {
                    const ToolIcon = (LucideIcons as any)[tool.icon || 'Wrench'] || Wrench;
                    return (
                      <button
                        key={tool.id}
                        onClick={() => {
                          if (tool.id === 'treatment-ideas') {
                            onNavigate(tool.id, { categoryId: id });
                          } else {
                            onNavigate(tool.id);
                          }
                        }}
                        className="flex items-center gap-3 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 hover:border-blue-200 dark:hover:border-blue-900 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-left group"
                      >
                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-zinc-800 group-hover:bg-white dark:group-hover:bg-zinc-700 transition-colors">
                          <ToolIcon className="w-5 h-5 text-slate-600 dark:text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                        </div>
                        <span className="font-semibold text-slate-700 dark:text-zinc-300 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                          {tool.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SubTopicCard title="Overview" icon={BookOpen} onClick={() => setSelectedSubTopic('overview')} />
            <SubTopicCard title="Assessments" icon={ClipboardList} onClick={() => setSelectedSubTopic('assessments')} />
            <SubTopicCard title="Treatments" icon={Activity} onClick={() => setSelectedSubTopic('treatments')} />
            <SubTopicCard title="Visuals" icon={Video} onClick={() => setSelectedSubTopic('visuals')} />
            <SubTopicCard title="Resources" icon={FileText} onClick={() => setSelectedSubTopic('resources')} />
            {id === 'dysphagia' && <SubTopicCard title="Deep Dive" icon={LayoutDashboard} onClick={() => setSelectedSubTopic('deep-dive')} />}
            </div>
          </div>
        ) : selectedSubTopic === 'overview' ? (
          <div className="max-w-4xl mx-auto space-y-10">
            <section className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 border border-slate-100 dark:border-zinc-800 shadow-sm">
              <h3 className="text-sm font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4">What it is</h3>
              <p className="text-lg text-slate-700 dark:text-zinc-300 leading-relaxed font-medium">{data.overview.whatItIs}</p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 border border-slate-100 dark:border-zinc-800 shadow-sm">
                <h3 className="text-sm font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Common Deficits
                </h3>
                <ul className="space-y-3">
                  {data.overview.deficits.map((d, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-zinc-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                      <span className="text-sm">{d}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 border border-slate-100 dark:border-zinc-800 shadow-sm">
                <h3 className="text-sm font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-indigo-500" />
                  Symptoms
                </h3>
                <ul className="space-y-3">
                  {data.overview.symptoms.map((s, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-zinc-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                      <span className="text-sm">{s}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <section className="bg-indigo-900 dark:bg-indigo-950 rounded-[2.5rem] p-10 text-white shadow-xl shadow-indigo-200/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              <div className="relative z-10">
                <h3 className="text-xs font-black text-indigo-300 uppercase tracking-[0.2em] mb-4">Clinical Pearl</h3>
                <p className="text-xl font-bold leading-relaxed italic">"{data.overview.clinicalPearl}"</p>
              </div>
            </section>

            <section className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 border border-slate-100 dark:border-zinc-800 shadow-sm">
              <h3 className="text-sm font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Best Practices
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.overview.bestPractices.map((bp, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-emerald-50/50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100/50 dark:border-emerald-800/50">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-xs text-slate-700 dark:text-zinc-300 font-medium leading-relaxed">{bp}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : selectedSubTopic === 'visuals' ? (
          <div className="space-y-12">
            {category?.image && (
              <section>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Clinical Anatomy & Physiology
                </h3>
                <div className="relative aspect-video rounded-3xl overflow-hidden border border-slate-200 shadow-lg group">
                  <img 
                    src={category.image} 
                    alt={category.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex flex-col justify-end p-8">
                    <h4 className="text-white font-bold text-xl">{category.title} Overview</h4>
                    <p className="text-white/80 text-sm mt-1">Reference visualization for clinical education.</p>
                  </div>
                </div>
              </section>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.visuals && data.visuals.length > 0 ? (
                data.visuals.map((visual, idx) => (
                  <VisualCard 
                    key={idx}
                    title={visual.title} 
                    type={visual.type} 
                    thumbnail={visual.thumbnail}
                    description={visual.description}
                    onClick={() => setSelectedItem(visual)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-20 text-slate-400">
                  <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No specific visuals available for this section yet.</p>
                </div>
              )}
            </div>
          </div>
        ) : selectedSubTopic === 'resources' ? (
          <div className="space-y-12">
            {filteredResearchArchives.length > 0 && (
              <section>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  Research Paper Archives
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {filteredResearchArchives.map((article, i) => (
                    <ResearchArchiveItem key={i} article={article} />
                  ))}
                </div>
              </section>
            )}

            <section>
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <FileIcon className="w-4 h-4 text-indigo-600" />
                Clinical Resources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.resources && data.resources.length > 0 ? (
                  data.resources.map((res, idx) => (
                    <ResourceCard key={idx} item={res} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-20 text-slate-400">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No additional resources available yet.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        ) : selectedSubTopic === 'deep-dive' ? (
          <DysphagiaHub />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {selectedSubTopic === 'assessments' ? (
                filteredAssessments.map((item) => (
                  <AssessmentCard 
                    key={item.name} 
                    item={item} 
                    onClick={() => setSelectedItem(item)} 
                  />
                ))
              ) : (
                filteredTreatments.map((item) => (
                  <TreatmentCard 
                    key={item.name} 
                    item={item} 
                    onClick={() => setSelectedItem(item)} 
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <DetailModal 
            item={selectedItem} 
            type={selectedSubTopic || 'overview'} 
            onClose={() => setSelectedItem(null)}
            onNavigate={onNavigate}
            id={id}
          />
        )}
      </AnimatePresence>
    </div>
  );

  return (
    isPatientView ? (
      <PatientViewWrapper title={category?.title || "Subspecialty"} onExit={() => setIsPatientView(false)}>
        {renderContent()}
      </PatientViewWrapper>
    ) : renderContent()
  );
}

function SubTopicCard({ title, icon: Icon, onClick }: { title: string, icon: React.ComponentType<any>, onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-4 group"
    >
      <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
    </motion.button>
  );
}

function VisualCard({ title, type, thumbnail, description, onClick }: { title: string, type: 'video' | 'image', thumbnail: string, description: string, onClick?: () => void }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group cursor-pointer"
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={thumbnail} 
          alt={title} 
          className="w-full h-full object-cover transition-transform group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/40 transition-colors flex items-center justify-center">
          {type === 'video' ? (
            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play className="w-5 h-5 text-indigo-600 fill-current" />
            </div>
          ) : (
            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <ImageIcon className="w-5 h-5 text-indigo-600" />
            </div>
          )}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className={cn(
            "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest",
            type === 'video' ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
          )}>
            {type}
          </span>
        </div>
        <h4 className="font-bold text-slate-900 mb-1">{title}</h4>
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

const AssessmentCard: React.FC<{ item: Assessment, onClick: () => void }> = ({ item, onClick }) => {
  if (item.isPlaceholder) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -4 }}
        className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-zinc-700 shadow-sm hover:shadow-md cursor-pointer group flex flex-col items-center justify-center text-center"
      >
        <div className="p-3 bg-slate-100 dark:bg-zinc-800 text-slate-400 rounded-xl mb-4">
          <ClipboardList className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-slate-900 dark:text-white mb-1">{item.name}</h3>
        <p className="text-slate-500 dark:text-zinc-400 text-sm mb-4">Click to add a resource link</p>
      </motion.div>
    );
  }
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm hover:shadow-md cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
          <ClipboardList className="w-6 h-6" />
        </div>
        {item.cost === 'Free' ? (
          <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium rounded-full">Free</span>
        ) : (
          <span className="px-2 py-1 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 text-xs font-medium rounded-full">{item.cost}</span>
        )}
      </div>
      
      <h3 className="font-bold text-slate-900 dark:text-white mb-1">
        {item.name}
        {item.acronym && <span className="text-slate-400 dark:text-zinc-500 font-normal ml-2">({item.acronym})</span>}
      </h3>
      
      <p className="text-slate-500 dark:text-zinc-400 text-sm line-clamp-2 mb-4">{item.description}</p>
      
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-zinc-500">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {item.time}
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {item.population}
          </div>
        </div>
        
        {item.link && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(item.link, '_blank');
            }}
            className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
            title="Open Resource"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

const TreatmentCard: React.FC<{ item: Treatment, onClick: () => void }> = ({ item, onClick }) => {
  if (item.isPlaceholder) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -4 }}
        className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-zinc-700 shadow-sm hover:shadow-md cursor-pointer group flex flex-col items-center justify-center text-center"
      >
        <div className="p-3 bg-slate-100 dark:bg-zinc-800 text-slate-400 rounded-xl mb-4">
          <Activity className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-slate-900 dark:text-white mb-1">{item.name}</h3>
        <p className="text-slate-500 dark:text-zinc-400 text-sm mb-4">Click to add a resource link</p>
      </motion.div>
    );
  }
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm hover:shadow-md cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
          <Activity className="w-6 h-6" />
        </div>
        <span className={cn(
          "px-2 py-1 text-xs font-medium rounded-full",
          item.evidenceLevel === 'High' ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
        )}>
          {item.evidenceLevel} Evidence
        </span>
      </div>
      
      <h3 className="font-bold text-slate-900 dark:text-white mb-2">{item.name}</h3>
      <p className="text-slate-500 dark:text-zinc-400 text-sm line-clamp-2 mb-4">{item.description}</p>
      
      <div className="flex items-center justify-between mt-auto">
        <div className="flex flex-wrap gap-2">
          {item.tags.slice(0, 2).map((tag, i) => (
            <span key={i} className="px-2 py-1 bg-slate-50 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 text-xs rounded-md border border-slate-100 dark:border-zinc-700">
              {tag}
            </span>
          ))}
        </div>

        {item.link && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(item.link, '_blank');
            }}
            className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
            title="Open Resource"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

const ResourceCard: React.FC<{ item: { title: string, description?: string, type: string, url?: string } }> = ({ item }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={() => window.open(item.url, '_blank')}
      className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md cursor-pointer group flex items-start gap-4"
    >
      <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
        <BookOpen className="w-6 h-6" />
      </div>
      <div>
        <h3 className="font-bold text-slate-900 mb-1 group-hover:text-purple-600 transition-colors">{item.title}</h3>
        <p className="text-slate-500 text-sm mb-2">{item.description}</p>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
          {item.type} <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </motion.div>
  );
};

function DetailModal({ item, type, onClose, onNavigate, id }: { item: Assessment | Treatment | any, type: SubTopic, onClose: () => void, onNavigate: (view: any, params?: any) => void, id: string }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[80vh] flex flex-col"
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              {item.name || item.title}
              {item.acronym && <span className="text-slate-400 font-normal">({item.acronym})</span>}
            </h3>
            {item.tags && (
              <div className="flex gap-2 mt-2">
                {item.tags.map((tag: string, i: number) => (
                  <span key={i} className="px-2 py-0.5 bg-white border border-slate-200 text-slate-500 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto space-y-8">
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" />
              Description
            </h4>
            <p className="text-slate-600 leading-relaxed">{item.description}</p>
          </div>

          {item.whatItIs && (
            <div>
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                What It Is
              </h4>
              <p className="text-slate-600 leading-relaxed">{item.whatItIs}</p>
            </div>
          )}

          {item.whatItContains && (
            <div>
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-emerald-500" />
                What It Contains
              </h4>
              <p className="text-slate-600 leading-relaxed">{item.whatItContains}</p>
            </div>
          )}

          {item.videoUrl && (
            <div>
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Video className="w-4 h-4 text-red-500" />
                Demonstration
              </h4>
              <div className="aspect-video rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-slate-100 flex items-center justify-center">
                <button 
                  onClick={() => window.open(item.videoUrl, '_blank')}
                  className="flex flex-col items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors"
                >
                  <Video className="w-12 h-12" />
                  <span className="font-bold">Watch in New Tab</span>
                </button>
              </div>
            </div>
          )}

          {(item.population || item.candidates || item.time || item.evidenceLevel) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(item.population || item.candidates) && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-500" />
                    Target Population
                  </h4>
                  <p className="text-slate-600 text-sm">{item.population || item.candidates}</p>
                </div>
              )}

              {type === 'assessments' && item.time ? (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-500" />
                    Administration Time
                  </h4>
                  <p className="text-slate-600 text-sm">{item.time}</p>
                </div>
              ) : item.evidenceLevel ? (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                   <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Evidence Level
                  </h4>
                  <p className="text-slate-600 text-sm">{item.evidenceLevel}</p>
                </div>
              ) : null}
            </div>
          )}

          {item.instructions && (
            <div>
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-amber-500" />
                Instructions
              </h4>
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-xl p-4 text-amber-900 dark:text-amber-100 text-sm">
                {item.instructions}
              </div>
            </div>
          )}

          {item.contraindications && (
            <div>
              <h4 className="text-sm font-bold text-red-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Contraindications
              </h4>
              <p className="text-slate-600 text-sm">{item.contraindications}</p>
            </div>
          )}

          {item.limitations && item.limitations.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-rose-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Limitations
              </h4>
              <ul className="space-y-2">
                {item.limitations.map((limitation: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-slate-600 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                    <span>{limitation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {item.tips && item.tips.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Clinical Tips
              </h4>
              <ul className="space-y-2">
                {item.tips.map((tip: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-slate-600 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {item.references && item.references.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                References
              </h4>
              <ul className="space-y-2">
                {item.references.map((ref: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-slate-500 text-xs italic">
                    <div className="w-1 h-1 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                    <span>{ref}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div className="flex gap-3">
            {item.link && (
              <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm"
              >
                <ExternalLink className="w-4 h-4" />
                Open Resource
              </a>
            )}
            {type === 'treatments' && (
              <button
                onClick={() => {
                  const domainMap: Record<string, string> = {
                    'dysphagia': 'Swallowing',
                    'aphasia': 'Expressive Language',
                    'cog-comm': 'Memory',
                    'voice': 'Voice',
                    'motor-speech': 'Motor Speech'
                  };
                  onNavigate('goal-generator', { 
                    task: item.name, 
                    domain: domainMap[id] || 'Swallowing' 
                  });
                }}
                className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm"
              >
                <Target className="w-4 h-4" />
                Generate Goals
              </button>
            )}
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}

const ResearchArchiveItem: React.FC<{ article: { title: string, pdfUrl: string, summary: string, testing: string, results: string, indications: string, limitations: string } }> = ({ article }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      layout
      className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden hover:shadow-md transition-all"
    >
      <div className="p-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight mb-1">{article.title}</h4>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest">Research Archive</span>
              <div className="w-1 h-1 bg-slate-300 dark:bg-zinc-700 rounded-full" />
              <span className="text-xs text-slate-500 dark:text-zinc-400">{article.indications}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {article.pdfUrl && article.pdfUrl !== '#' && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                window.open(article.pdfUrl, '_blank');
              }}
              className="p-2 text-slate-400 dark:text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              title="View PDF"
            >
              <FileIcon className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-5 pb-5 border-t border-slate-50 dark:border-zinc-800 pt-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h5 className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Summary</h5>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">{article.summary}</p>
                </div>
                <div>
                  <h5 className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Testing</h5>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">{article.testing}</p>
                </div>
                <div>
                  <h5 className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Results</h5>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">{article.results}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h5 className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1 text-emerald-600 dark:text-emerald-400">Indications</h5>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">{article.indications}</p>
                </div>
                <div>
                  <h5 className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1 text-rose-600 dark:text-rose-400">Limitations</h5>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">{article.limitations}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
