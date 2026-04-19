import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ChevronRight, 
  ExternalLink,
  ArrowLeft,
  Download,
  Printer,
  Share2,
  AlertCircle,
  ShieldCheck,
  FileText,
  GraduationCap,
  Eye
} from 'lucide-react';
import { ENSIGN_SLP_CORNER_DATA, Postette } from '../data/ensign-slp-data';
import { ENSIGN_PROGRAMS_DATA } from '../data/ensign-programs-data';
import { cn } from '../lib/utils';
import { PrintHeader } from './PrintHeader';
import { PatientViewWrapper } from './layout/PatientViewWrapper';
import { ModuleLayout } from './layout/ModuleLayout';
import { generatePostettePDF } from '../utils/pdf-generator';

const ALL_POSTETTES = [...ENSIGN_SLP_CORNER_DATA, ...ENSIGN_PROGRAMS_DATA];

const AUTHORITATIVE_SOURCES = [
  { name: "Medicare Benefit Policy Manual", url: "https://www.cms.gov/regulations-and-guidance/guidance/manuals/internet-only-manuals-ioms" },
  { name: "ASHA Practice Portal", url: "https://www.asha.org/practice-portal/" },
  { name: "Ensign Services Compliance", url: "https://ensignservices.net/" } // Placeholder for internal link if applicable
];

const menuStructure = {
  'Assessment Guides': ['Evaluation'],
  'Treatment Materials': ['Clinical'],
  'Program Development': ['Program Development'],
  'Infographics': ['Infographics'],
  'Company Policies': ['Compliance', 'Billing', 'Documentation']
};

export function EnsignSLPCorner({ initialPostetteId }: { initialPostetteId?: string | null }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPostette, setSelectedPostette] = useState<Postette | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sIdx: number) => {
    setExpandedSections(prev => ({
      ...prev,
      [sIdx]: !prev[sIdx]
    }));
  };
  const [isPatientView, setIsPatientView] = useState(false);

  React.useEffect(() => {
    if (initialPostetteId) {
      const postette = ALL_POSTETTES.find(p => p.id === initialPostetteId);
      if (postette) {
        setSelectedPostette(postette);
      }
    }
  }, [initialPostetteId]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);

  const filteredPostettes = useMemo(() => {
    return ALL_POSTETTES.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.sections.some(s => 
                            typeof s.content === 'string' && s.content.toLowerCase().includes(searchQuery.toLowerCase())
                          );
      
      let matchesCategory = true;
      if (selectedCategory) {
        const subCategories = menuStructure[selectedCategory as keyof typeof menuStructure];
        if (selectedSubCategory) {
          matchesCategory = p.category === selectedSubCategory;
        } else {
          matchesCategory = subCategories.includes(p.category);
        }
      }
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, selectedSubCategory]);

  const handlePrint = () => {
    window.print();
  };

  const renderContent = () => (
    <AnimatePresence mode="wait">
        {!selectedPostette ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col h-full"
          >
            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search clinical protocols, billing codes, or tips..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm font-medium"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                <div className="relative group">
                  <button 
                    onClick={() => { setSelectedCategory(null); setSelectedSubCategory(null); }}
                    className={cn(
                      "px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border",
                      !selectedCategory 
                        ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                    )}
                  >
                    All
                  </button>
                </div>
                {Object.entries(menuStructure).map(([category, subCategories]) => (
                  <div key={category} className="relative group">
                    <button 
                      onClick={() => { setSelectedCategory(category); setSelectedSubCategory(null); }}
                      className={cn(
                        "px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1",
                        selectedCategory === category 
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-md" 
                          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                      )}
                    >
                      {category}
                      <ChevronRight className="w-3 h-3 rotate-90" />
                    </button>
                    <div className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl p-2 hidden group-hover:block z-50">
                      {subCategories.map(subCat => (
                        <button
                          key={subCat}
                          onClick={() => { setSelectedCategory(category); setSelectedSubCategory(subCat); }}
                          className={cn(
                            "block w-full text-left px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap hover:bg-slate-50",
                            selectedSubCategory === subCat ? "text-indigo-600" : "text-slate-600"
                          )}
                        >
                          {subCat}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPostettes.map((postette, idx) => (
                  <motion.button
                    key={postette.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setSelectedPostette(postette)}
                    className="group bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all text-left flex flex-col h-full relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-indigo-100 transition-colors" />
                    
                    {postette.image && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
                        <img 
                          src={postette.image} 
                          alt="" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="relative z-10 flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all group-hover:rotate-6 shadow-sm">
                          <postette.icon className="w-6 h-6" />
                        </div>
                        <span className={cn(
                          "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg",
                          postette.category === 'Compliance' ? "bg-rose-50 text-rose-600" :
                          postette.category === 'Billing' ? "bg-emerald-50 text-emerald-600" :
                          postette.category === 'Program Development' ? "bg-amber-50 text-amber-600" :
                          "bg-indigo-50 text-indigo-600"
                        )}>
                          {postette.category}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-black text-slate-900 tracking-tight mb-3 group-hover:text-indigo-600 transition-colors">
                        {postette.title}
                      </h3>
                      <p className="text-slate-500 text-sm line-clamp-2 font-medium leading-relaxed">
                        {typeof postette.sections[0].content === 'string' 
                          ? postette.sections[0].content 
                          : Array.isArray(postette.sections[0].content) 
                            ? postette.sections[0].content[0]
                            : 'Clinical summary and guidelines.'}
                      </p>
                    </div>

                    <div className="relative z-10 mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3 h-3 text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {postette.sections.length} Sections
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {filteredPostettes.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    <Search className="w-10 h-10" />
                  </div>
                  <p className="text-lg font-bold">No resources found</p>
                  <p className="text-sm">Try adjusting your search or filters.</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col h-full bg-white"
          >
            {/* Detail Header */}
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-xl z-20 print:hidden">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setSelectedPostette(null)}
                  className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
                      {selectedPostette.category}
                    </span>
                    {selectedPostette.reference && (
                      <>
                        <div className="w-1 h-1 bg-slate-200 rounded-full" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ref: {selectedPostette.id}</span>
                      </>
                    )}
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">{selectedPostette.title}</h2>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handlePrint} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                  <Printer className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => generatePostettePDF(selectedPostette)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
                  title="Download PDF"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share Resource
                </button>
              </div>
            </div>

            {/* Detail Content */}
            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar print:overflow-visible">
              <div className="max-w-4xl mx-auto space-y-12">
                <PrintHeader title={selectedPostette.title} subtitle={selectedPostette.category} />
                
                {selectedPostette.image && (
                  <div className="w-full h-64 rounded-3xl overflow-hidden shadow-lg relative group">
                    <img 
                      src={selectedPostette.image} 
                      alt="" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                )}

                {selectedPostette.reference && (
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                      <GraduationCap className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Source Reference</p>
                      <p className="text-sm text-slate-700 font-bold leading-relaxed">{selectedPostette.reference}</p>
                      <p className="text-xs text-slate-500 mt-1">Always verify with current facility policies and CMS guidelines.</p>
                    </div>
                  </div>
                )}

                {selectedPostette.sections.map((section, sIdx) => {
                  const isExpanded = expandedSections[sIdx] !== false; // Default to true
                  return (
                    <div key={sIdx} className="space-y-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                      <button 
                        onClick={() => toggleSection(sIdx)}
                        className="w-full flex items-center justify-between gap-4 group text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            {sIdx + 1}
                          </div>
                          <h3 className="text-2xl font-black text-slate-900 tracking-tight">{section.title}</h3>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                          <ChevronRight className={cn("w-5 h-5 transition-transform duration-300", isExpanded ? "rotate-90" : "")} />
                        </div>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-14 pt-4">
                              {section.type === 'alert' ? (
                                <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100 flex gap-4">
                                  <AlertCircle className="w-6 h-6 text-rose-500 shrink-0" />
                                  <p className="text-rose-900 font-bold leading-relaxed">{section.content as string}</p>
                                </div>
                              ) : section.type === 'bullets' ? (
                                <ul className="grid grid-cols-1 gap-4">
                                  {Array.isArray(section.content) && section.content.map((bullet, bIdx) => (
                                    <li key={bIdx} className="flex gap-4 group/bullet">
                                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0 group-hover/bullet:bg-indigo-600 group-hover/bullet:text-white transition-all">
                                        <div className="w-1.5 h-1.5 bg-current rounded-full" />
                                      </div>
                                      <p className="text-slate-700 font-medium leading-relaxed">{bullet}</p>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-lg text-slate-700 font-medium leading-relaxed">
                                  {section.content as string}
                                </p>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                {/* Footer Disclaimer */}
                <div className="pt-12 border-t border-slate-100 text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                    Clinical Resource Disclaimer
                  </p>
                  <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
                    This resource is for educational purposes and summarized from Ensign Services policies. 
                    Always refer to official company policies and Medicare manuals as primary source documents.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
  );

  return (
    <ModuleLayout
      title="Ensign SLP Corner"
      subtitle="Clinical protocols, compliance guidelines, and educational resources."
      isPatientView={isPatientView}
      setIsPatientView={setIsPatientView}
      headerContent={
        <div className="flex flex-col items-end gap-3">
          <div className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-200">
            {ALL_POSTETTES.length} Resources
          </div>
          <div className="flex gap-2">
              {AUTHORITATIVE_SOURCES.map((source, i) => (
              <a 
                key={i} 
                href={source.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
              >
                {source.name}
                <ExternalLink className="w-2 h-2 opacity-50" />
              </a>
            ))}
          </div>
        </div>
      }
    >
      {renderContent()}
    </ModuleLayout>
  );
}
