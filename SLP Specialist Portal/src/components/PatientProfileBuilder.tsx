import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Plus, 
  Search, 
  Trash2, 
  ChevronRight, 
  ClipboardList, 
  Target, 
  History,
  ShieldAlert,
  Save,
  X,
  UserCheck,
  Activity,
  Microscope,
  Pill,
  Scan,
  Download,
  Upload,
  Eye
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useClinicalSafety } from '../context/ClinicalSafetyContext';
import { PatientViewWrapper } from './layout/PatientViewWrapper';
import { useNotifications } from '../context/NotificationContext';

interface PatientGoal {
  id: string;
  text: string;
  status: 'active' | 'met' | 'discontinued';
  progress: number;
}

interface SessionLog {
  id: string;
  date: string;
  note: string;
  performance: number; // 0-100
}

interface PatientProfile {
  id: string;
  codename: string;
  diagnosis: string;
  onsetDate: string;
  goals: PatientGoal[];
  sessions: SessionLog[];
  createdAt: string;
}

const CODENAME_ADJECTIVES = ['Swift', 'Calm', 'Bright', 'Steady', 'Wise', 'Brave', 'Quiet', 'Active'];
const CODENAME_NOUNS = ['Heron', 'Fox', 'Oak', 'River', 'Mountain', 'Star', 'Eagle', 'Willow'];

export function PatientProfileBuilder() {
  const [profiles, setProfiles] = useState<PatientProfile[]>(() => {
    try {
      const saved = localStorage.getItem('slp_patient_profiles');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Failed to load patient profiles from local storage", e);
      return [];
    }
  });
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPatientView, setIsPatientView] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const { notify, confirm, prompt } = useNotifications();

  // New Profile Form State
  const [newDiagnosis, setNewDiagnosis] = useState('');
  const [newOnsetDate, setNewOnsetDate] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('slp_patient_profiles', JSON.stringify(profiles));
    } catch (e) {
      console.error("Failed to save patient profiles to local storage", e);
    }
  }, [profiles]);

  const generateCodename = () => {
    const adj = CODENAME_ADJECTIVES[Math.floor(Math.random() * CODENAME_ADJECTIVES.length)];
    const noun = CODENAME_NOUNS[Math.floor(Math.random() * CODENAME_NOUNS.length)];
    const num = Math.floor(Math.random() * 1000);
    return `${adj} ${noun} ${num}`;
  };

  const createProfile = () => {
    const newProfile: PatientProfile = {
      id: crypto.randomUUID(),
      codename: generateCodename(),
      diagnosis: newDiagnosis || 'Unspecified',
      onsetDate: newOnsetDate || new Date().toISOString().split('T')[0],
      goals: [],
      sessions: [],
      createdAt: new Date().toISOString()
    };
    setProfiles([newProfile, ...profiles]);
    setIsCreating(false);
    setNewDiagnosis('');
    setNewOnsetDate('');
    setActiveProfileId(newProfile.id);
  };

  const deleteProfile = (id: string) => {
    setProfiles(profiles.filter(p => p.id !== id));
    if (activeProfileId === id) setActiveProfileId(null);
    setShowDeleteConfirm(null);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(profiles, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `slp-profiles-backup-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const importedProfiles = JSON.parse(content) as PatientProfile[];
        
        if (Array.isArray(importedProfiles) && importedProfiles.every(p => p.id && p.codename)) {
          const shouldMerge = await confirm({
            title: 'Merge Profiles?',
            message: `Found ${importedProfiles.length} profiles. Do you want to merge them with your existing profiles or replace them entirely?`,
            confirmText: 'Merge',
            cancelText: 'Replace'
          });

          if (shouldMerge) {
             // Merge logic: avoid duplicates by ID
             const existingIds = new Set(profiles.map(p => p.id));
             const newProfiles = importedProfiles.filter(p => !existingIds.has(p.id));
             setProfiles([...profiles, ...newProfiles]);
             notify('success', `Imported ${newProfiles.length} new profiles.`);
          } else {
             // Replace logic
             const confirmed = await confirm({
               title: 'Overwrite Profiles?',
               message: 'This will permanently delete all current profiles and replace them with the imported ones. Are you sure?',
               confirmText: 'Overwrite',
               type: 'danger'
             });
             if (confirmed) {
               setProfiles(importedProfiles);
               notify('success', 'Profiles replaced successfully.');
             }
          }
        } else {
          notify('error', 'Invalid file format.');
        }
      } catch (err) {
        console.error('Import failed', err);
        notify('error', 'Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
    // Reset input
    event.target.value = '';
  };

  const activeProfile = profiles.find(p => p.id === activeProfileId);

  const { addIssue, removeIssue } = useClinicalSafety();

  // Safety check logic
  useEffect(() => {
    if (!activeProfile) return;

    const isNPO = activeProfile.diagnosis.toLowerCase().includes('npo');
    const hasThinLiquidGoal = activeProfile.goals.some(g => 
      g.text.toLowerCase().includes('thin liquid') || 
      g.text.toLowerCase().includes('water')
    );

    if (isNPO && hasThinLiquidGoal) {
      addIssue({
        id: `safety-npo-${activeProfile.id}`,
        severity: 'critical',
        message: `Safety Alert: Patient ${activeProfile.codename} is NPO but has thin liquid goals.`
      });
    } else {
      removeIssue(`safety-npo-${activeProfile.id}`);
    }
  }, [activeProfile, addIssue, removeIssue]);

  const handleAddGoal = async () => {
    const text = await prompt({
      title: 'New Goal',
      message: 'Enter the clinical goal for this patient:',
      placeholder: 'e.g. Improve vocal fold adduction for cough'
    });
    if (text && activeProfileId) {
      const newGoal: PatientGoal = {
        id: crypto.randomUUID(),
        text,
        status: 'active',
        progress: 0
      };
      setProfiles(profiles.map(p => 
        p.id === activeProfileId ? { ...p, goals: [...p.goals, newGoal] } : p
      ));
      notify('success', 'Goal added successfully');
    }
  };

  const handleUpdateGoalProgress = async (goalId: string, currentProgress: number) => {
    const val = await prompt({
      title: 'Update Progress',
      message: 'Enter new progress percentage (0-100):',
      initialValue: currentProgress.toString(),
      placeholder: '0-100'
    });
    
    if (val !== null && activeProfileId) {
      const progress = parseInt(val);
      if (isNaN(progress) || progress < 0 || progress > 100) {
        notify('error', 'Please enter a valid number between 0 and 100');
        return;
      }
      setProfiles(profiles.map(p => 
        p.id === activeProfileId ? {
          ...p,
          goals: p.goals.map(g => g.id === goalId ? { ...g, progress } : g)
        } : p
      ));
    }
  };

  const addSession = (note: string, performance: number) => {
    if (!activeProfileId) return;
    const newSession: SessionLog = {
      id: crypto.randomUUID(),
      date: new Date().toLocaleDateString(),
      note,
      performance
    };
    setProfiles(profiles.map(p => 
      p.id === activeProfileId ? { ...p, sessions: [newSession, ...p.sessions] } : p
    ));
    notify('success', 'Session logged successfully');
  };

  const handleAddSessionClick = async () => {
    const note = await prompt({
      title: 'Log Session',
      message: 'Enter session summary and observations:',
      placeholder: 'e.g. Patient showed improved breath support...'
    });
    if (note) addSession(note, 80);
  };

  const filteredProfiles = profiles.filter(p => 
    p.codename.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderContent = () => (
    <div className="flex h-full bg-slate-50 dark:bg-slate-900 overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative">
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
      {/* Sidebar: Profile List */}
      <div className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">Case Profiles</h2>
            <div className="flex gap-1">
              <button 
                onClick={handleExport}
                className="p-2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-colors"
                title="Export Profiles"
              >
                <Download className="w-4 h-4" />
              </button>
              <label className="p-2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-colors cursor-pointer" title="Import Profiles">
                <Upload className="w-4 h-4" />
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              </label>
              <button 
                onClick={() => setIsCreating(true)}
                className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
                title="Create New Profile"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input 
              type="text"
              placeholder="Search codenames..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {Array.isArray(filteredProfiles) && filteredProfiles.map(profile => (
            <button
              key={profile.id}
              onClick={() => setActiveProfileId(profile.id)}
              className={cn(
                "w-full p-4 rounded-2xl text-left transition-all border flex items-center justify-between group",
                activeProfileId === profile.id 
                  ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-500/30 shadow-sm" 
                  : "bg-white dark:bg-slate-900 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
            >
              <div>
                <div className="text-sm font-black text-slate-900 dark:text-slate-100">{profile.codename}</div>
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">{profile.diagnosis}</div>
              </div>
              <ChevronRight className={cn("w-4 h-4 transition-all", activeProfileId === profile.id ? "text-indigo-600 dark:text-indigo-400 translate-x-1" : "text-slate-300 dark:text-slate-600")} />
            </button>
          ))}
          {filteredProfiles.length === 0 && (
            <div className="text-center py-10">
              <User className="w-10 h-10 text-slate-200 dark:text-slate-700 mx-auto mb-3" />
              <p className="text-xs text-slate-400 dark:text-slate-500">No profiles found</p>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-900 dark:bg-slate-950 text-white">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-1">
            <ShieldAlert className="w-3 h-3" />
            HIPAA Safe Mode
          </div>
          <p className="text-[9px] text-slate-400 leading-tight">
            Real names and PHI are never stored. Only codenames and clinical data are persisted locally.
          </p>
        </div>
      </div>

      {/* Main Content: Profile Detail */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
        {activeProfile ? (
          <div className="flex-1 overflow-y-auto">
            {/* Header */}
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">{activeProfile.codename}</h1>
                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full">Active Case</span>
                </div>
                <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-500" />
                    <span className="font-bold">{activeProfile.diagnosis}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-indigo-500" />
                    <span>Onset: {activeProfile.onsetDate}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowDeleteConfirm(activeProfile.id)}
                className="p-3 text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                title="Delete Profile"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 grid grid-cols-12 gap-8">
              {/* Goals Section */}
              <div className="col-span-12 lg:col-span-7 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-500" />
                    Clinical Goals
                  </h3>
                  <button 
                    onClick={handleAddGoal}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    + Add Goal
                  </button>
                </div>
                <div className="space-y-3">
                  {Array.isArray(activeProfile.goals) && activeProfile.goals.map(goal => (
                    <div key={goal.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-between group">
                      <div className="flex-1">
                        <p className="text-sm text-slate-700 dark:text-slate-200 font-medium">{goal.text}</p>
                        <div className="mt-3 h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${goal.progress}%` }}
                            className="h-full bg-indigo-600 dark:bg-indigo-500"
                          />
                        </div>
                      </div>
                      <div className="ml-6 flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase">{goal.progress}%</span>
                        <button 
                          onClick={() => handleUpdateGoalProgress(goal.id, goal.progress)}
                          className="p-2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {(!Array.isArray(activeProfile.goals) || activeProfile.goals.length === 0) && (
                    <div className="text-center py-12 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                      <p className="text-xs text-slate-400 dark:text-slate-500">No goals defined for this profile</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Session Logs Section */}
              <div className="col-span-12 lg:col-span-5 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-indigo-600 dark:text-indigo-500" />
                    Session Logs
                  </h3>
                  <button 
                    onClick={handleAddSessionClick}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    + Log Session
                  </button>
                </div>
                <div className="space-y-4">
                  {Array.isArray(activeProfile.sessions) && activeProfile.sessions.map(session => (
                    <div key={session.id} className="relative pl-6 border-l-2 border-slate-100 dark:border-slate-800 pb-4">
                      <div className="absolute left-[-9px] top-0 w-4 h-4 bg-white dark:bg-slate-900 border-2 border-indigo-600 dark:border-indigo-500 rounded-full" />
                      <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{session.date}</div>
                      <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{session.note}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">Performance: {session.performance}%</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(i => (
                              <div key={i} className={cn("w-1.5 h-1.5 rounded-full", i <= (session.performance / 20) ? "bg-indigo-600 dark:bg-indigo-500" : "bg-slate-200 dark:bg-slate-600")} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!Array.isArray(activeProfile.sessions) || activeProfile.sessions.length === 0) && (
                    <div className="text-center py-12 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                      <p className="text-xs text-slate-400 dark:text-slate-500">No sessions logged yet</p>
                    </div>
                  )}
                </div>

                {/* Educational Tidbits */}
                <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700">
                  <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
                    <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-500" />
                    Clinical Context & Education
                  </h3>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                        <Microscope className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Labs to Monitor</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                          <strong>WBC Count:</strong> Elevated levels may indicate aspiration pneumonia. 
                          <strong>BUN/Creatinine:</strong> High ratio suggests dehydration, common in dysphagia.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                        <Pill className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Medication Impacts</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                          <strong>Anticholinergics:</strong> Cause xerostomia (dry mouth), impairing bolus formation. 
                          <strong>Antipsychotics:</strong> Can cause tardive dyskinesia or delayed swallow reflex.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                        <Scan className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Imaging Correlations</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                          <strong>CT/MRI:</strong> Brainstem infarcts (e.g., Wallenberg syndrome) often result in severe dysphagia and absent pharyngeal swallow. Left MCA infarcts typically correlate with aphasia.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
              <UserCheck className="w-12 h-12 text-slate-300 dark:text-slate-600" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mb-2">Select a Case Profile</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-sm">
              Manage clinical goals and session logs securely. All data is stored locally on your device using de-identified codenames.
            </p>
            <button 
              onClick={() => setIsCreating(true)}
              className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 hover:bg-indigo-700 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Create New Profile
            </button>
          </div>
        )}
      </div>

      {/* Create Profile Modal */}
      <AnimatePresence>
        {isCreating && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreating(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">New Case Profile</h2>
                  <button onClick={() => setIsCreating(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <X className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Diagnosis / Focus Area</label>
                    <input 
                      type="text"
                      placeholder="e.g. Broca's Aphasia, Oropharyngeal Dysphagia"
                      value={newDiagnosis}
                      onChange={(e) => setNewDiagnosis(e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Onset Date (Optional)</label>
                    <input 
                      type="date"
                      value={newOnsetDate}
                      onChange={(e) => setNewOnsetDate(e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>

                  <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl border border-indigo-100 dark:border-indigo-800">
                    <div className="flex items-center gap-3 mb-3">
                      <ShieldAlert className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      <span className="text-sm font-black text-indigo-900 dark:text-indigo-100">Privacy Assurance</span>
                    </div>
                    <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed">
                      A unique codename will be generated automatically. Do not enter any identifiable patient information in the diagnosis field.
                    </p>
                  </div>

                  <button 
                    onClick={createProfile}
                    className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-200 dark:shadow-indigo-900/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                  >
                    Generate Secure Profile
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden p-8"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-2">Delete Profile?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                  This action cannot be undone. All goals and session history for this patient will be permanently removed.
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => deleteProfile(showDeleteConfirm)}
                    className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200 dark:shadow-red-900/20"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      {isPatientView ? (
        <PatientViewWrapper title="Patient Profile Builder" onExit={() => setIsPatientView(false)}>
          {renderContent()}
        </PatientViewWrapper>
      ) : (
        renderContent()
      )}
    </>
  );
}
