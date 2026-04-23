import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Plus, 
  Search, 
  User, 
  Calendar, 
  FileText, 
  Target, 
  ChevronRight, 
  MoreVertical,
  Trash2,
  Edit2,
  Save,
  X,
  Shield,
  Clock,
  Activity,
  Eye,
  AlertCircle,
  Wand2,
  RefreshCw
} from 'lucide-react';
import { CounterCard } from './CounterCard';
import { cn } from '../lib/utils';
import { PatientViewWrapper } from './layout/PatientViewWrapper';
import { persistenceService, Patient } from '../services/persistence-service';
import { documentationTrackerService, TrackerStatus } from '../services/documentation-tracker-service';

export const PatientProfiles: React.FC = () => {
  const [profiles, setProfiles] = useState<Patient[]>([]);
  const [trackerStatuses, setTrackerStatuses] = useState<Record<string, TrackerStatus | null>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isPatientView, setIsPatientView] = useState(false);
  const [generatingNoteId, setGeneratingNoteId] = useState<string | null>(null);

  const fetchProfiles = () => {
    try {
      const data = persistenceService.getPatients();
      setProfiles(data);
      
      const statuses: Record<string, TrackerStatus | null> = {};
      data.forEach(p => {
        statuses[p.id] = documentationTrackerService.getTrackerStatus(p.id);
      });
      setTrackerStatuses(statuses);
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newProfile, setNewProfile] = useState<Partial<Patient>>({
    name: '',
    dob: '',
    diagnosis: '',
    goals: [],
    status: 'Active'
  });

  const handleAddProfile = () => {
    if (newProfile.name && newProfile.diagnosis) {
      const profile: Patient = {
        id: crypto.randomUUID(),
        name: newProfile.name,
        dob: newProfile.dob || new Date().toISOString().split('T')[0],
        startOfCare: new Date().toISOString(),
        diagnosis: newProfile.diagnosis,
        goals: newProfile.goals || [],
        status: newProfile.status as 'Active' | 'Discharged' || 'Active'
      };
      
      try {
        persistenceService.savePatient(profile);
        setProfiles([profile, ...profiles]);
        setTrackerStatuses({
          ...trackerStatuses,
          [profile.id]: documentationTrackerService.getTrackerStatus(profile.id)
        });
        setIsAdding(false);
        setNewProfile({ name: '', dob: '', diagnosis: '', goals: [], status: 'Active' });
      } catch (error) {
        console.error('Failed to save patient:', error);
      }
    }
  };

  const handleGenerateNote = async (patientId: string, type: 'progress' | 'recertification' | 'discharge') => {
    setGeneratingNoteId(patientId);
    try {
      if (type === 'progress') {
        await documentationTrackerService.generateProgressNote(patientId);
        alert('Progress Note generated successfully!');
      } else if (type === 'recertification') {
        await documentationTrackerService.generateRecertificationNote(patientId);
        alert('Recertification Note generated successfully!');
      } else if (type === 'discharge') {
        await documentationTrackerService.generateDischargeNote(patientId);
        alert('Discharge Note generated successfully!');
      }
      fetchProfiles(); // Refresh statuses
    } catch (error: any) {
      console.error(`Failed to generate ${type} note:`, error);
      alert(`Failed to generate note: ${error.message}`);
    } finally {
      setGeneratingNoteId(null);
    }
  };

  const filteredProfiles = profiles.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderContent = () => (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 relative">
      {/* Patient View Toggle */}
      <div className="absolute top-0 right-0 z-50">
        <button
          onClick={() => setIsPatientView(true)}
          className="p-3 bg-white/90 backdrop-blur-sm shadow-lg rounded-full hover:bg-white transition-colors border border-slate-200"
          title="Patient View"
        >
          <Eye className="w-6 h-6 text-slate-600" />
        </button>
      </div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <CounterCard label="Active Profiles" value={profiles.filter(p => p.status === 'Active').length.toString()} icon={Users} color="text-violet-600" bg="bg-violet-50" />
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Patient Profiles</h1>
            <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
              <Shield className="w-4 h-4 text-emerald-500" />
              Anonymized for HIPAA Compliance
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
        >
          <Plus className="w-5 h-5" />
          Add Profile
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name or diagnosis..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {Array.isArray(filteredProfiles) && filteredProfiles.map((profile) => {
            const status = trackerStatuses[profile.id];
            const isGenerating = generatingNoteId === profile.id;
            return (
            <motion.div
              key={profile.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all p-6 group flex flex-col"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <User className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                    profile.status === 'Active' ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"
                  )}>
                    {profile.status}
                  </span>
                  <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                    <MoreVertical className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-1">{profile.name}</h3>
              <p className="text-sm font-bold text-blue-600 mb-4">{profile.diagnosis}</p>

              <div className="space-y-3 mb-6 flex-1">
                <div className="flex items-center gap-3 text-slate-500">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-medium">Start of Care: {new Date(profile.startOfCare).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <FileText className="w-4 h-4" />
                  <span className="text-xs font-medium">{status?.totalDailyNotes || 0} Total Notes</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <Target className="w-4 h-4" />
                  <span className="text-xs font-medium">{profile.goals.length} active goals</span>
                </div>
                
                {/* Tracker Alerts */}
                {status?.isProgressNoteDue && profile.status === 'Active' && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex flex-col gap-2 text-amber-800">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span className="text-xs font-bold">Progress Note Due ({status.dailyNotesSinceLastProgress} notes)</span>
                    </div>
                    <button 
                      onClick={() => handleGenerateNote(profile.id, 'progress')}
                      disabled={isGenerating}
                      className="w-full py-2 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isGenerating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                      Auto-Generate
                    </button>
                  </div>
                )}
                {status?.isRecertificationDue && profile.status === 'Active' && (
                  <div className="mt-2 p-3 bg-rose-50 border border-rose-200 rounded-xl flex flex-col gap-2 text-rose-800">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span className="text-xs font-bold">Recertification Due (30+ days)</span>
                    </div>
                    <button 
                      onClick={() => handleGenerateNote(profile.id, 'recertification')}
                      disabled={isGenerating}
                      className="w-full py-2 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isGenerating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                      Auto-Generate
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 rounded-xl font-bold text-slate-600 transition-all group-hover:bg-blue-600 group-hover:text-white">
                  View Record
                  <ChevronRight className="w-4 h-4" />
                </button>
                {profile.status === 'Active' && (
                  <button 
                    onClick={() => handleGenerateNote(profile.id, 'discharge')}
                    disabled={isGenerating}
                    className="px-4 py-3 bg-slate-50 hover:bg-slate-200 rounded-xl font-bold text-slate-600 transition-all disabled:opacity-50"
                    title="Generate Discharge Note"
                  >
                    D/C
                  </button>
                )}
              </div>
            </motion.div>
          )})}
        </AnimatePresence>
      </div>

      {/* Add Profile Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">New Patient Profile</h2>
                <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Anonymized Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Patient A.M."
                    value={newProfile.name}
                    onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">DOB</label>
                    <input
                      type="date"
                      value={newProfile.dob}
                      onChange={(e) => setNewProfile({ ...newProfile, dob: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
                    <select
                      value={newProfile.status}
                      onChange={(e) => setNewProfile({ ...newProfile, status: e.target.value as any })}
                      className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    >
                      <option value="Active">Active</option>
                      <option value="Discharged">Discharged</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Diagnosis</label>
                  <input
                    type="text"
                    placeholder="e.g., Dysphagia, Aphasia..."
                    value={newProfile.diagnosis}
                    onChange={(e) => setNewProfile({ ...newProfile, diagnosis: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="p-8 bg-slate-50 flex items-center gap-4">
                <button
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProfile}
                  className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                >
                  Create Profile
                </button>
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
        <PatientViewWrapper title="Patient Profiles" onExit={() => setIsPatientView(false)}>
          {renderContent()}
        </PatientViewWrapper>
      ) : (
        renderContent()
      )}
    </>
  );
};
