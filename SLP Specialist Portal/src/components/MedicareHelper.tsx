import { useState } from 'react';
import { Search, Info, FileText, Activity, ShieldCheck, Hash, Eye, ClipboardCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CPT_CODES, ICD10_CODES, SECTION_K_ITEMS, CodeItem } from '../data/coding-data';
import { PatientViewWrapper } from './layout/PatientViewWrapper';
import { MedicarePartBTracker } from './medicare/MedicarePartBTracker';

type Tab = 'cpt' | 'icd10' | 'section-k' | 'compliance' | 'tracker';

export function MedicareHelper({ searchQuery = '' }: { searchQuery?: string }) {
  const [activeTab, setActiveTab] = useState<Tab>('tracker');
  const [localSearch, setLocalSearch] = useState('');
  const [isPatientView, setIsPatientView] = useState(false);

  // Combine prop search with local search
  const effectiveSearch = searchQuery || localSearch;

  const filterCodes = (codes: CodeItem[]) => {
    if (!effectiveSearch) return codes;
    const lower = effectiveSearch.toLowerCase();
    return codes.filter(c => 
      c.code.toLowerCase().includes(lower) || 
      c.desc.toLowerCase().includes(lower) ||
      c.category.toLowerCase().includes(lower) ||
      (c.notes && c.notes.toLowerCase().includes(lower))
    );
  };

  const renderCodeList = (codes: CodeItem[], type: 'cpt' | 'icd10' | 'section-k') => {
    const filtered = filterCodes(codes);
    
    if (filtered.length === 0) {
      return (
        <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No codes found matching "{effectiveSearch}"</p>
        </div>
      );
    }

    return (
      <div className="grid gap-3">
        {filtered.map((code) => (
          <div 
            key={code.code} 
            className="group relative p-4 bg-white border border-slate-100 rounded-xl hover:border-blue-200 hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <span className={`font-mono font-bold px-2.5 py-1 rounded-lg text-sm ${
                  type === 'cpt' ? 'bg-blue-50 text-blue-700' :
                  type === 'icd10' ? 'bg-emerald-50 text-emerald-700' :
                  'bg-orange-50 text-orange-700'
                }`}>
                  {code.code}
                </span>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider border border-slate-100 px-2 py-0.5 rounded-full">
                  {code.category}
                </span>
              </div>
              
              {/* Tooltip Icon */}
              {(code.tooltip || code.notes) && (
                <div className="relative group/tooltip">
                  <Info className="w-4 h-4 text-slate-300 hover:text-blue-500 cursor-help transition-colors" />
                  
                  {/* Tooltip Content */}
                  <div className="absolute right-0 top-6 w-64 p-3 bg-slate-900 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-20 pointer-events-none">
                    <div className="font-semibold mb-1 text-slate-200">Clinical Note:</div>
                    {code.tooltip || code.notes}
                    <div className="absolute -top-1 right-1 w-2 h-2 bg-slate-900 rotate-45"></div>
                  </div>
                </div>
              )}
            </div>
            
            <p className="font-medium text-slate-800 text-sm leading-relaxed">
              {code.desc}
            </p>
            
            {/* Show notes inline if no tooltip, or as secondary info */}
            {!code.tooltip && code.notes && (
              <p className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-50 italic">
                {code.notes}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => (
    <div className="space-y-6">
      {/* Search Bar (if not provided by parent) */}
      {!searchQuery && (
        <div className="relative flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search codes, descriptions, or categories..." 
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium text-slate-700 shadow-sm"
            />
          </div>
          {!isPatientView && (
            <button
              onClick={() => setIsPatientView(true)}
              className="flex items-center gap-2 px-4 py-3 bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200 transition-colors font-bold text-sm whitespace-nowrap"
            >
              <Eye className="w-4 h-4" />
              Patient View
            </button>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex p-1 bg-slate-100 rounded-xl overflow-x-auto scrollbar-hide">
        {[
          { id: 'tracker', label: 'Part B Tracker', icon: ClipboardCheck },
          { id: 'cpt', label: 'CPT Codes', icon: Hash },
          { id: 'icd10', label: 'ICD-10', icon: Activity },
          { id: 'section-k', label: 'Section K', icon: FileText },
          { id: 'compliance', label: 'Compliance', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                isActive 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === 'tracker' && (
            <motion.div 
              key="tracker"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <MedicarePartBTracker />
            </motion.div>
          )}

          {activeTab === 'cpt' && (
            <motion.div 
              key="cpt"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {renderCodeList(CPT_CODES, 'cpt')}
            </motion.div>
          )}

          {activeTab === 'icd10' && (
            <motion.div 
              key="icd10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {renderCodeList(ICD10_CODES, 'icd10')}
            </motion.div>
          )}

          {activeTab === 'section-k' && (
            <motion.div 
              key="section-k"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="mb-4 p-4 bg-orange-50 border border-orange-100 rounded-xl text-sm text-orange-800">
                <h4 className="font-bold mb-1 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  MDS 3.0 Section K: Swallowing/Nutritional Status
                </h4>
                <p>Accurate coding in Section K is critical for PDPM reimbursement and identifying patients at risk for malnutrition and dehydration.</p>
              </div>
              {renderCodeList(SECTION_K_ITEMS, 'section-k')}
            </motion.div>
          )}

          {activeTab === 'compliance' && (
            <motion.div 
              key="compliance"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Sources of Truth */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  Sources of Truth for Medicare Part B
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Consult these authoritative sources for skilled maintenance and restorative therapy documentation:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a href="https://www.cms.gov/Regulations-and-Guidance/Guidance/Manuals/Downloads/bp102c15.pdf" target="_blank" rel="noopener noreferrer" className="p-3 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all group">
                    <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-600">Medicare Benefit Policy Manual, Ch. 15</h4>
                    <p className="text-xs text-slate-500 mt-1">Primary guide for covered medical services.</p>
                  </a>
                  <a href="https://www.cms.gov/medicare/medicare-fee-for-service-payment/snfpps/jimmo_settlement" target="_blank" rel="noopener noreferrer" className="p-3 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all group">
                    <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-600">Jimmo v. Sebelius Settlement</h4>
                    <p className="text-xs text-slate-500 mt-1">Defines skilled maintenance vs. restorative care.</p>
                  </a>
                  <a href="https://medicare.noridianmedicare.com/" target="_blank" rel="noopener noreferrer" className="p-3 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all group">
                    <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-600">CMS & MAC Guidelines (Noridian)</h4>
                    <p className="text-xs text-slate-500 mt-1">Local billing and coverage determinations.</p>
                  </a>
                  <a href="https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-483" target="_blank" rel="noopener noreferrer" className="p-3 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all group">
                    <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-600">Code of Federal Regulations (CFRs)</h4>
                    <p className="text-xs text-slate-500 mt-1">Legal framework for SNFs (42 CFR Part 483).</p>
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-white border border-slate-200 rounded-xl">
                  <h4 className="font-bold text-slate-900 mb-2">Documentation Tips</h4>
                  <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
                    <li>Document specific skilled interventions.</li>
                    <li>Link goals to functional outcomes.</li>
                    <li>Update progress every 10 visits (Medicare Part B).</li>
                    <li>Ensure recertification is timely.</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    isPatientView ? (
      <PatientViewWrapper title="Medicare Helper" onExit={() => setIsPatientView(false)}>
        {renderContent()}
      </PatientViewWrapper>
    ) : renderContent()
  );
}
