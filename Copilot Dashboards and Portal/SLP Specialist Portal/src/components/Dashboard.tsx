import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SLPCheatSheet } from './SLPCheatSheet';
import { 
  Sparkles, 
  FileText, 
  Plus,
  ArrowRight,
  Brain,
  Stethoscope,
  Library,
  Shield,
  MessageCircle,
  Pin,
  PinOff,
  ChevronLeft,
  Info
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { cn } from '../lib/utils';
import { SLP_DATA } from '../data/slp-data';
import { newsService } from '../services/news-service';
import { WhatsAppFeed } from './WhatsAppFeed';
import { NetworkingEvents } from './NetworkingEvents';
import { NewsItem } from '../types';

import { useAI } from '../context/AIContext';

export const Dashboard: React.FC = () => {
  const { setActiveView, favorites, toggleFavorite } = useDashboard();
  const { toggleAI } = useAI();
  const [latestNews, setLatestNews] = useState<NewsItem | null>(null);
  const [newsError, setNewsError] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isQuizFlipped, setIsQuizFlipped] = useState(false);
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      const news = await newsService.getLatestNews();
      if (news.length > 0) {
        setLatestNews(news[0]);
        setNewsError(false);
      } else {
        setNewsError(true);
      }
    };
    fetchNews();
  }, []);

  const quickActions = [
    { id: 'copilot', title: 'Clinical Copilot', description: 'Real-time AI assistance', icon: Sparkles, color: 'bg-amber-600', action: toggleAI },
    { id: 'documentation-assistant', title: 'New Evaluation', description: 'AI-assisted eval drafting', icon: FileText, color: 'bg-blue-600' },
    { id: 'handout-maker', title: 'Create Handout', description: 'Evidence-based materials', icon: Plus, color: 'bg-indigo-600' },
  ];

  const DASHBOARD_SECTIONS = [
    {
      id: 'clinical-topics',
      title: 'Clinical Topics',
      description: 'Core clinical domains and specialized management',
      icon: Brain,
      color: 'bg-blue-900/30 text-blue-400 border-blue-500/20',
      categoryIds: [
        'dysphagia', 'aphasia', 'motor-speech', 'voice', 'fluency', 'cog-comm', 
        'hnc', 'palliative', 'trach-vent', 'dysarthria-eval'
      ]
    },
    {
      id: 'slp-tools',
      title: 'SLP Tools',
      description: 'Specialized evaluation and tracking instruments',
      icon: Stethoscope,
      color: 'bg-emerald-900/30 text-emerald-400 border-emerald-500/20',
      categoryIds: [
        'three-way-eval', 'clinical-calculators', 'progress-tracker', 
        'aac-hub', 'case-brainstorm', 'anatomy-lab', 'medical-diagnostics',
        'predictive-analytics', 'multimodal-analysis'
      ]
    },
    {
      id: 'slp-studios',
      title: 'SLP Studios',
      description: 'AI-powered creative and documentation workspaces',
      icon: Sparkles,
      color: 'bg-violet-900/30 text-violet-400 border-violet-500/20',
      categoryIds: ['documentation-studio', 'goal-generator', 'handout-maker', 'therapy-studio', 'treatment-ideas', 'asset-gallery']
    },
    {
      id: 'compliance-documentation',
      title: 'Compliance and documentation',
      description: 'Regulatory guides and institutional pathways',
      icon: Shield,
      color: 'bg-amber-900/30 text-amber-400 border-amber-500/20',
      categoryIds: ['regulatory-navigator', 'part-b-checker', 'nethealth-help', 'clinical-pathways']
    },
    {
      id: 'documentation-builder-guide',
      title: 'Latest SLP News & Clinical Resources',
      description: 'Clinical libraries and professional resources',
      icon: Library,
      color: 'bg-rose-900/30 text-rose-400 border-rose-500/20',
      categoryIds: ['clinical-library', 'pdf-library', 'ensign-slp-corner', 'slp-corner']
    }
  ];

  const currentSection = DASHBOARD_SECTIONS.find(s => s.id === activeSection);

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {isCheatSheetOpen && <SLPCheatSheet onClose={() => setIsCheatSheetOpen(false)} />}
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[3rem] bg-slate-900 px-10 py-7 md:px-16 md:py-12 text-white shadow-2xl shadow-slate-900/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -ml-20 -mb-20" />
        
        <div className="relative z-10 max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-white/10"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            Clinical Intelligence Active
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black tracking-tighter leading-none mb-4 flex items-center gap-4"
          >
            Welcome back, <span className="text-blue-400">Kevin.</span>
            <div className="flex gap-2">
              <a 
                href="https://chat.whatsapp.com/HR8gVzfzF1S4SNcAGZ58kd" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 transition-colors rounded-2xl text-xs font-bold text-white shadow-lg shadow-emerald-500/20"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
              <button 
                onClick={() => setIsCheatSheetOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 transition-colors rounded-2xl text-xs font-bold text-white shadow-lg shadow-blue-500/20"
              >
                <Info className="w-4 h-4" />
                Cheat Sheet
              </button>
            </div>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed"
          >
            Your clinical workspace is synchronized. You have 4 evaluations pending and 12 therapy sessions scheduled for today.
          </motion.p>
        </div>

        <div className="relative z-10 mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative w-full h-full perspective-1000">
            <motion.div
              className="w-full h-full relative preserve-3d cursor-pointer"
              animate={{ rotateY: isQuizFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
              onClick={() => setIsQuizFlipped(!isQuizFlipped)}
            >
              {/* Front */}
              <div className="absolute inset-0 backface-hidden bento-card p-6 rounded-3xl flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-amber-500/20 rounded-lg border border-amber-500/30">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </div>
                  <h4 className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em]">Quiz Question of the Day</h4>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <p className="text-white font-medium text-lg leading-tight mb-4">What is the primary function of the epiglottis during swallowing?</p>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Tap to reveal answer</p>
                </div>
              </div>

              {/* Back */}
              <div className="absolute inset-0 backface-hidden bg-emerald-600 p-6 rounded-3xl border border-emerald-500 flex flex-col rotate-y-180">
                <h4 className="text-[10px] font-black text-emerald-100 uppercase tracking-[0.2em] mb-4">Answer</h4>
                <p className="text-white font-bold text-xl leading-tight">B) To protect the airway</p>
                <p className="text-emerald-100 text-sm mt-2">The epiglottis folds down to cover the larynx, preventing food and liquid from entering the trachea.</p>
              </div>
            </motion.div>
          </div>

          <div className="bento-card p-6 rounded-3xl flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
                <Library className="w-4 h-4 text-blue-400" />
              </div>
              <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">News and Recent Events</h4>
            </div>
            <div className="flex-1 space-y-4">
              {latestNews ? (
                <div className="group cursor-pointer">
                  <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-1 block">Latest Update</span>
                  <a href={latestNews.link} target="_blank" rel="noopener noreferrer" className="text-white font-medium hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                    {latestNews.title}
                  </a>
                  <p className="text-[10px] text-slate-400 mt-2 line-clamp-2">{latestNews.contentSnippet}</p>
                </div>
              ) : newsError ? (
                <p className="text-white font-medium text-sm opacity-80 italic">ASHA news feed currently unavailable. Check back soon.</p>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-4">
                  <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-2" />
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Fetching News...</p>
                </div>
              )}
              <button 
                onClick={() => setActiveView('rag-library')}
                className="w-full mt-2 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-xl text-[10px] font-black text-blue-400 uppercase tracking-widest transition-all"
              >
                View News Library
              </button>
            </div>
          </div>
          <WhatsAppFeed />
        </div>
        
        <div className="mt-8">
          <NetworkingEvents />
        </div>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Actions - Left Column */}
        <div className="lg:col-span-4 space-y-6">
          <h3 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] pl-2">Quick Actions</h3>
          <div className="space-y-4">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => action.action ? action.action() : setActiveView(action.id)}
                className="w-full flex items-center gap-4 p-4 bento-card rounded-3xl transition-all text-left group"
              >
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:rotate-6", action.color)}>
                  <action.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-white">{action.title}</div>
                  <div className="text-xs text-slate-400">{action.description}</div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>

          {/* Favorites Section */}
          <div className="bento-card rounded-[2.5rem] p-8 text-white shadow-xl shadow-slate-950/50 border border-white/5">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Favorite Modules</h3>
            <div className="space-y-4">
              {Array.isArray(favorites) && favorites.length > 0 ? (
                favorites.map(favId => {
                  const cat = SLP_DATA.find(c => c.id === favId);
                  if (!cat) return null;
                  return (
                    <button 
                      key={favId}
                      onClick={() => setActiveView(favId)}
                      className="w-full flex items-center gap-3 p-3 bg-slate-800/50 hover:bg-slate-800 rounded-2xl transition-colors text-left border border-white/5"
                    >
                      <cat.icon className="w-5 h-5 text-indigo-400" />
                      <span className="font-bold text-sm text-slate-200">{cat.title}</span>
                    </button>
                  );
                })
              ) : (
                <p className="text-xs text-slate-500 italic">No favorites yet. Pin modules from the library to see them here.</p>
              )}
            </div>
          </div>
        </div>

        {/* Library - Right Column */}
        <div className="lg:col-span-8 space-y-12">
          <AnimatePresence mode="wait">
            {!activeSection ? (
              <motion.div 
                key="sections"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Clinical Library</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {DASHBOARD_SECTIONS.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className="group relative overflow-hidden bento-card p-8 rounded-[2.5rem] text-left"
                    >
                      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3", section.color)}>
                        <section.icon className="w-7 h-7" />
                      </div>
                      <h4 className="text-2xl font-black text-white mb-2 group-hover:text-emerald-400 transition-colors">{section.title}</h4>
                      <p className="text-sm text-slate-400 leading-relaxed mb-6">{section.description}</p>
                      
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 uppercase tracking-widest">
                        Explore {section.categoryIds.length} Modules
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="sub-cards"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between px-2">
                  <button 
                    onClick={() => setActiveSection(null)}
                    className="flex items-center gap-2 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] hover:text-blue-600 transition-colors group"
                  >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Library
                  </button>
                  <h3 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em]">{currentSection?.title}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.isArray(currentSection?.categoryIds) && currentSection.categoryIds.map((catId, idx) => {
                    const cat = SLP_DATA.find(c => c.id === catId);
                    if (!cat) return null;
                    const isFav = favorites.includes(cat.id);
                    return (
                      <motion.div
                        key={cat.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => setActiveView(cat.id)}
                        className="group relative overflow-hidden bento-card p-6 rounded-[2rem] text-left w-full cursor-pointer"
                        role="button"
                        tabIndex={0}
                      >
                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3", cat.color, "bg-opacity-20")}>
                          <cat.icon className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-black text-white mb-1 group-hover:text-blue-400 transition-colors">{cat.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{cat.description}</p>

                        <div className="absolute top-4 right-4 flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(cat.id);
                            }}
                            className={cn(
                              "p-2 rounded-xl transition-all",
                              isFav 
                                ? "bg-amber-900/40 text-amber-500 shadow-sm" 
                                : "bg-[#252525] text-slate-400 opacity-0 group-hover:opacity-100"
                            )}
                            title={isFav ? "Unpin from favorites" : "Pin to favorites"}
                          >
                            {isFav ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                          </button>
                          <button 
                            onClick={() => setActiveView(cat.id)}
                            className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                            title="Open module"
                            aria-label={`Open ${cat.title} module`}
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Clinical Copilot Card */}
          <div className="bento-card rounded-[2.5rem] p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-900/20 rounded-2xl border border-amber-500/20">
                  <Sparkles className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-xl font-black text-white tracking-tight">Clinical Copilot</h3>
              </div>
              <button 
                onClick={toggleAI}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all border border-white/5"
              >
                Open Full Chat
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                <p className="text-sm text-slate-400 italic mb-3">"How do I code for a cognitive evaluation in a SNF?"</p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-blue-900/30 text-blue-400 rounded text-[10px] font-bold border border-blue-500/20">92523</span>
                  <span className="px-2 py-1 bg-emerald-900/30 text-emerald-400 rounded text-[10px] font-bold border border-emerald-500/20">CMS Manual</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => toggleAI()}
                  className="p-3 bg-slate-800/50 hover:bg-slate-800 text-left rounded-xl border border-white/5 transition-all group"
                >
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Drafting</p>
                  <p className="text-xs text-white font-medium group-hover:text-amber-400">Eval Summary</p>
                </button>
                <button 
                  onClick={() => toggleAI()}
                  className="p-3 bg-slate-800/50 hover:bg-slate-800 text-left rounded-xl border border-white/5 transition-all group"
                >
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Compliance</p>
                  <p className="text-xs text-white font-medium group-hover:text-amber-400">Jimmo Standards</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / System Status */}
      <div className="flex flex-col md:flex-row items-center justify-between pt-10 border-t border-slate-200 dark:border-zinc-800 gap-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">System Online</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-500" />
            <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">HIPAA Compliant</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">Documentation</button>
          <button className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">Support</button>
          <button className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">Privacy Policy</button>
        </div>
      </div>
    </div>
  );
};
