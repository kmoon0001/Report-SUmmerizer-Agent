import { useState } from 'react';
import { Droplets, Utensils, Info, CheckCircle, ExternalLink, BookOpen, AlertTriangle, ChefHat, FlaskConical, ClipboardCheck, Printer, Save, Trash2, Beaker, Activity, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { IDDSIGourmetGuide } from './IDDSIGourmetGuide';
import { IDDSI_LEVELS, IDDSI_FAQ, filterIDDSILevels } from '../utils/iddsi-data';
import { PrintHeader } from './PrintHeader';
import { PatientViewWrapper } from './layout/PatientViewWrapper';

interface LabReport {
  id: string;
  patientName: string;
  date: string;
  foodItem: string;
  targetLevel: number;
  tests: {
    flow: boolean | null;
    forkDrip: boolean | null;
    forkPressure: boolean | null;
    spoonTilt: boolean | null;
    finger: boolean | null;
  };
  notes: string;
}

export function IDDSIGuide({ searchQuery = '' }: { searchQuery?: string }) {
  const [activeTab, setActiveTab] = useState<'reference' | 'testing' | 'lab' | 'planner'>('reference');
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [isPatientView, setIsPatientView] = useState(false);
  
  // Lab Report State
  const [report, setReport] = useState<Omit<LabReport, 'id'>>({
    patientName: '',
    date: new Date().toISOString().split('T')[0],
    foodItem: '',
    targetLevel: 4,
    tests: { flow: null, forkDrip: null, forkPressure: null, spoonTilt: null, finger: null },
    notes: ''
  });
  const [savedReports, setSavedReports] = useState<LabReport[]>([]);

  const filteredLevels = filterIDDSILevels(searchQuery);

  const handleSaveReport = () => {
    const newReport = { ...report, id: Date.now().toString() };
    setSavedReports(prev => [newReport, ...prev]);
    setReport({
      patientName: '',
      date: new Date().toISOString().split('T')[0],
      foodItem: '',
      targetLevel: 4,
      tests: { flow: null, forkDrip: null, forkPressure: null, spoonTilt: null, finger: null },
      notes: ''
    });
  };

  const toggleTest = (test: keyof LabReport['tests']) => {
    setReport(prev => ({
      ...prev,
      tests: { ...prev.tests, [test]: prev.tests[test] === true ? false : prev.tests[test] === false ? null : true }
    }));
  };

  const renderContent = () => (
    <div className="space-y-8 text-left relative">
      {/* Patient View Toggle */}
      <div className="absolute top-0 right-0 z-50 print:hidden">
        <button
          onClick={() => setIsPatientView(true)}
          className="p-3 bg-white/90 backdrop-blur-sm shadow-lg rounded-full hover:bg-white transition-colors border border-slate-200"
          title="Patient View"
        >
          <Eye className="w-6 h-6 text-slate-600" />
        </button>
      </div>
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 p-1 bg-slate-100 rounded-xl w-fit print:hidden">
        <button
          onClick={() => setActiveTab('reference')}
          className={cn(
            "px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2",
            activeTab === 'reference' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <BookOpen className="w-4 h-4" />
          Framework
        </button>
        <button
          onClick={() => setActiveTab('testing')}
          className={cn(
            "px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2",
            activeTab === 'testing' ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <FlaskConical className="w-4 h-4" />
          Testing Methods
        </button>
        <button
          onClick={() => setActiveTab('lab')}
          className={cn(
            "px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2",
            activeTab === 'lab' ? "bg-white text-purple-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <ClipboardCheck className="w-4 h-4" />
          Lab Report
        </button>
        <button
          onClick={() => setActiveTab('planner')}
          className={cn(
            "px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2",
            activeTab === 'planner' ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <ChefHat className="w-4 h-4" />
          Diet Planner
        </button>
      </div>

      {activeTab === 'planner' && <IDDSIGourmetGuide />}

      {activeTab === 'testing' && (
        <div className="space-y-8">
              <PrintHeader title="IDDSI Testing Methods" subtitle="Clinical Reference Guide" />
              <div className="bg-blue-50 p-8 rounded-[2.5rem] border border-blue-100 print:bg-white print:border-none print:p-0">
                <div className="flex justify-between items-center mb-6 print:hidden">
                  <h3 className="text-2xl font-black text-blue-900 flex items-center gap-3">
                    <FlaskConical className="w-8 h-8" />
                    IDDSI Testing Methods
                  </h3>
                  <button 
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-white text-blue-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-100 transition-colors flex items-center gap-2 shadow-sm print:hidden"
                  >
                    <Printer className="w-4 h-4" /> Print Guide
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* IDDSI Flow Test */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
                    <h4 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                      <Droplets className="w-5 h-5 text-blue-500" /> IDDSI Flow Test
                    </h4>
                    <p className="text-sm text-slate-600 mb-4">Used for Levels 0-3 (Drinks). Requires a 10mL slip tip syringe.</p>
                    
                    {/* Syringe Visual */}
                    <div className="mb-6 flex justify-center">
                      <div className="relative w-16 h-48 bg-slate-50 border-2 border-slate-300 rounded-lg mx-auto flex flex-col justify-end overflow-hidden">
                        {/* Graduations */}
                        {[...Array(10)].map((_, i) => (
                          <div key={i} className="absolute w-full border-t border-slate-300" style={{ bottom: `${(i + 1) * 10}%` }} />
                        ))}
                        {/* Liquid Levels Visual */}
                        <div className="absolute bottom-0 left-0 right-0 bg-blue-200/50 h-full flex items-end justify-center">
                           <div className="w-full bg-blue-500/20 h-[10%] border-t border-blue-500/50" title="1mL (Level 0)" />
                           <div className="w-full bg-blue-500/20 h-[30%] border-t border-blue-500/50 absolute bottom-0" title="4mL (Level 1)" />
                           <div className="w-full bg-blue-500/20 h-[70%] border-t border-blue-500/50 absolute bottom-0" title="8mL (Level 2)" />
                           <div className="w-full bg-blue-500/20 h-[90%] border-t border-blue-500/50 absolute bottom-0" title="10mL (Level 3)" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="text-[10px] font-bold text-slate-400 -rotate-90">10 mL Syringe</span>
                        </div>
                      </div>
                    </div>

                    <ul className="space-y-2 text-sm text-slate-700">
                      <li className="flex gap-2"><span className="font-bold text-blue-500">1.</span> Remove plunger and cover nozzle with finger.</li>
                      <li className="flex gap-2"><span className="font-bold text-blue-500">2.</span> Fill to 10mL line.</li>
                      <li className="flex gap-2"><span className="font-bold text-blue-500">3.</span> Release nozzle for exactly 10 seconds.</li>
                      <li className="flex gap-2"><span className="font-bold text-blue-500">4.</span> Cover nozzle and measure remaining liquid.</li>
                    </ul>
                <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs font-medium text-slate-500">
                  <div className="flex justify-between mb-1"><span>Level 0 (Thin)</span> <span>&lt;1 mL remaining</span></div>
                  <div className="flex justify-between mb-1"><span>Level 1 (Slightly)</span> <span>1-4 mL remaining</span></div>
                  <div className="flex justify-between mb-1"><span>Level 2 (Mildly)</span> <span>4-8 mL remaining</span></div>
                  <div className="flex justify-between"><span>Level 3 (Mod.)</span> <span>&gt;8 mL remaining</span></div>
                </div>
              </div>

              {/* Fork Drip Test */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
                <h4 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-orange-500" /> Fork Drip Test
                </h4>
                <p className="text-sm text-slate-600 mb-4">Used for Levels 3-5 (Foods/Thick Drinks).</p>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex gap-2"><span className="font-bold text-orange-500">Level 3:</span> Drips slowly in dollops through prongs.</li>
                  <li className="flex gap-2"><span className="font-bold text-orange-500">Level 4:</span> Sits in a mound/pile above prongs. Does not drip.</li>
                  <li className="flex gap-2"><span className="font-bold text-orange-500">Level 5:</span> Minimal liquid separates. Particles sit on fork.</li>
                </ul>
              </div>

              {/* Spoon Tilt Test */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
                <h4 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-green-500" /> Spoon Tilt Test
                </h4>
                <p className="text-sm text-slate-600 mb-4">Used for Levels 4-5 (Pureed/Minced). Determines cohesiveness and adhesiveness.</p>
                <div className="space-y-3 text-sm text-slate-700">
                  <p>Scoop sample onto spoon and tilt it.</p>
                  <div className="flex items-center gap-2 text-green-700 bg-green-50 p-2 rounded-lg">
                    <CheckCircle className="w-4 h-4" />
                    <span>Pass: Sample slides off easily with little residue.</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-700 bg-red-50 p-2 rounded-lg">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Fail: Sample is sticky or requires flicking to dislodge.</span>
                  </div>
                </div>
              </div>

              {/* Fork Pressure Test */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
                <h4 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-500" /> Fork Pressure Test
                </h4>
                <p className="text-sm text-slate-600 mb-4">Used for Levels 5-7 (Solids). Determines hardness.</p>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex gap-2"><span className="font-bold text-purple-500">Level 5:</span> Particles easily squashed with fork.</li>
                  <li className="flex gap-2"><span className="font-bold text-purple-500">Level 6:</span> Cut with side of fork. Squashes but doesn't return to shape.</li>
                  <li className="flex gap-2"><span className="font-bold text-purple-500">Level 7:</span> Normal biting/chewing required.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'lab' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Lab Report Form */}
          <div className="lg:col-span-5 space-y-6 print:hidden">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                <Beaker className="w-5 h-5 text-purple-600" />
                New Lab Report
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Patient ID / Name</label>
                  <input 
                    type="text" 
                    value={report.patientName}
                    onChange={e => setReport({...report, patientName: e.target.value})}
                    className="w-full p-3 rounded-xl border border-slate-200 mt-1"
                    placeholder="e.g., John Doe"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Food Item</label>
                    <input 
                      type="text" 
                      value={report.foodItem}
                      onChange={e => setReport({...report, foodItem: e.target.value})}
                      className="w-full p-3 rounded-xl border border-slate-200 mt-1"
                      placeholder="e.g., Mashed Potatoes"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Target Level</label>
                    <select 
                      value={report.targetLevel}
                      onChange={e => setReport({...report, targetLevel: Number(e.target.value)})}
                      className="w-full p-3 rounded-xl border border-slate-200 mt-1"
                    >
                      {IDDSI_LEVELS.map(l => (
                        <option key={l.level} value={l.level}>Level {l.level} - {l.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Test Results</label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: 'flow', label: 'IDDSI Flow Test' },
                      { id: 'forkDrip', label: 'Fork Drip Test' },
                      { id: 'forkPressure', label: 'Fork Pressure Test' },
                      { id: 'spoonTilt', label: 'Spoon Tilt Test' },
                      { id: 'finger', label: 'Finger Test' }
                    ].map((test) => (
                      <button
                        key={test.id}
                        onClick={() => toggleTest(test.id as any)}
                        className={cn(
                          "p-3 rounded-xl border text-left flex justify-between items-center transition-all",
                          report.tests[test.id as keyof typeof report.tests] === true ? "bg-green-50 border-green-200 text-green-700" :
                          report.tests[test.id as keyof typeof report.tests] === false ? "bg-red-50 border-red-200 text-red-700" :
                          "bg-slate-50 border-slate-200 text-slate-500"
                        )}
                      >
                        <span className="text-sm font-medium">{test.label}</span>
                        {report.tests[test.id as keyof typeof report.tests] === true ? <CheckCircle className="w-4 h-4" /> :
                         report.tests[test.id as keyof typeof report.tests] === false ? <AlertTriangle className="w-4 h-4" /> :
                         <span className="text-xs opacity-50">Not Tested</span>}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Clinical Notes</label>
                  <textarea 
                    value={report.notes}
                    onChange={e => setReport({...report, notes: e.target.value})}
                    className="w-full p-3 rounded-xl border border-slate-200 mt-1 h-24"
                    placeholder="Observations..."
                  />
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setReport({
                      patientName: '',
                      date: new Date().toISOString().split('T')[0],
                      foodItem: '',
                      targetLevel: 4,
                      tests: { flow: null, forkDrip: null, forkPressure: null, spoonTilt: null, finger: null },
                      notes: ''
                    })}
                    className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold uppercase tracking-widest hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Clear
                  </button>
                  <button 
                    onClick={handleSaveReport}
                    disabled={!report.patientName || !report.foodItem}
                    className="flex-[2] py-3 bg-purple-600 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" /> Save Report
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Report Preview / List */}
          <div className="lg:col-span-7 space-y-6 print:col-span-12">
            {savedReports.length > 0 ? (
              <div className="space-y-4">
                {savedReports.map((r) => (
                  <div key={r.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm print:shadow-none print:border print:border-slate-300">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <PrintHeader title="IDDSI Testing Lab Report" subtitle={r.date} />
                        <h4 className="text-xl font-black text-slate-900">{r.foodItem}</h4>
                        <p className="text-sm text-slate-500 font-medium">Patient: {r.patientName}</p>
                      </div>
                      <div className={cn(
                        "px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest",
                        IDDSI_LEVELS.find(l => l.level === r.targetLevel)?.color
                      )}>
                        Level {r.targetLevel}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {Object.entries(r.tests).map(([key, value]) => {
                        if (value === null) return null;
                        return (
                          <div key={key} className={cn(
                            "p-2 rounded-lg text-xs font-bold flex items-center gap-2",
                            value ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                          )}>
                            {value ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </div>
                        );
                      })}
                    </div>

                    {r.notes && (
                      <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-600 italic border border-slate-100">
                        "{r.notes}"
                      </div>
                    )}

                    <div className="mt-4 flex gap-2 print:hidden">
                      <button onClick={() => window.print()} className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                        <Printer className="w-4 h-4" />
                      </button>
                      <button onClick={() => setSavedReports(prev => prev.filter(item => item.id !== r.id))} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-auto">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-slate-400 font-medium bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                No reports generated yet.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'reference' && (
        <>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 print:hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-blue-600" />
                  IDDSI Framework Reference
                </h3>
                <p className="text-xs text-slate-500 mt-1">International Dysphagia Diet Standardisation Initiative</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <a 
                  href="https://iddsi.org/Resources/Patient-Handouts" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-colors flex items-center gap-1.5"
                >
                  <BookOpen className="w-3 h-3" />
                  Official Handouts
                  <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
                <a 
                  href="https://www.asha.org/practice-portal/clinical-topics/adult-dysphagia/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-colors flex items-center gap-1.5"
                >
                  <Activity className="w-3 h-3" />
                  ASHA Practice Portal
                  <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
              </div>
            </div>
            
            {filteredLevels.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {filteredLevels.map((lvl) => (
                  <motion.button
                    key={lvl.level}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedLevel(lvl.level)}
                    className={cn(
                      "p-4 rounded-xl border text-left transition-all shadow-sm relative overflow-hidden group",
                      selectedLevel === lvl.level ? "ring-2 ring-blue-500 ring-offset-2" : "hover:shadow-md",
                      lvl.color,
                      lvl.level === 7 ? "border-slate-700" : "border-slate-200"
                    )}
                  >
                    <div className="flex justify-between items-start mb-2 relative z-10">
                      <span className="text-2xl font-black opacity-40">{lvl.level}</span>
                      {lvl.type === 'drink' ? <Droplets className="w-4 h-4 opacity-50" /> : <Utensils className="w-4 h-4 opacity-50" />}
                    </div>
                    <p className="font-bold text-sm leading-tight relative z-10">{lvl.name}</p>
                    
                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                  </motion.button>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">No IDDSI levels found matching "{searchQuery}"</p>
            )}
          </div>

          <AnimatePresence mode="wait">
            {selectedLevel !== null && (
              <motion.div
                key={selectedLevel}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden relative print:shadow-none print:border-none"
              >
                {/* Image Banner */}
                <div className="-mx-8 -mt-8 mb-8 h-48 relative overflow-hidden group print:hidden">
                  <img 
                    src={IDDSI_LEVELS[selectedLevel].image} 
                    alt={IDDSI_LEVELS[selectedLevel].name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
                </div>

                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50 print:hidden" />
                
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row items-start gap-8">
                    <div className={cn(
                      "w-24 h-24 rounded-3xl flex items-center justify-center text-5xl font-black shrink-0 shadow-lg print:shadow-none print:border",
                      IDDSI_LEVELS[selectedLevel].color
                    )}>
                      {selectedLevel}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">{IDDSI_LEVELS[selectedLevel].name}</h2>
                        <a 
                          href={IDDSI_LEVELS[selectedLevel].handout}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-100 transition-colors flex items-center gap-2 w-fit print:hidden"
                        >
                          View Handout <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <p className="text-slate-600 text-lg leading-relaxed mb-8">
                        {IDDSI_LEVELS[selectedLevel].desc}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 relative overflow-hidden print:bg-white print:border-slate-200">
                          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-full blur-2xl -mr-10 -mt-10 print:hidden" />
                          <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2 relative z-10">
                            <Info className="w-5 h-5" /> Testing Method
                          </h4>
                          <p className="text-sm text-blue-800 leading-relaxed font-medium relative z-10">
                            {IDDSI_LEVELS[selectedLevel].testing}
                          </p>
                        </div>
                        
                        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 relative overflow-hidden print:bg-white print:border-slate-200">
                          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-100 rounded-full blur-2xl -mr-10 -mt-10 print:hidden" />
                          <h4 className="font-bold text-emerald-900 mb-4 flex items-center gap-2 relative z-10">
                            <CheckCircle className="w-5 h-5 text-emerald-600" /> Clinical Examples
                          </h4>
                          <p className="text-sm text-emerald-800 leading-relaxed relative z-10">
                            {IDDSI_LEVELS[selectedLevel].examples}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* FAQ Section */}
                  <div className="mt-12 pt-8 border-t border-slate-100 print:hidden">
                    <h4 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                      Clinical FAQs
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {IDDSI_FAQ.map((faq, i) => (
                        <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <p className="font-bold text-sm text-blue-600 mb-2">Q: {faq.q}</p>
                          <p className="text-xs text-slate-500 leading-relaxed">{faq.a}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );

  return (
    <>
      {isPatientView ? (
        <PatientViewWrapper title="IDDSI Guide" onExit={() => setIsPatientView(false)}>
          {renderContent()}
        </PatientViewWrapper>
      ) : (
        renderContent()
      )}
    </>
  );
}
