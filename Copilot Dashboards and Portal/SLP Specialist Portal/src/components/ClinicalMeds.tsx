import { useState } from 'react';
import { Pill, FlaskConical, AlertCircle, Camera, Eye, Info, ArrowLeft, HeartPulse } from 'lucide-react';
import { MED_DB, LAB_DB, IMAGING_DB, VITAL_DB } from '../utils/clinical-data';
import { PatientViewWrapper } from './layout/PatientViewWrapper';

export function ClinicalMeds({ searchQuery = '', onBack }: { searchQuery?: string; onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'meds' | 'labs' | 'imaging' | 'vitals'>('meds');
  const [isPatientView, setIsPatientView] = useState(false);

  const filteredMeds = MED_DB.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredLabs = LAB_DB.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredImaging = IMAGING_DB.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()) || i.altName.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredVitals = VITAL_DB.filter(v => v.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const renderContent = () => (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
          )}
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit overflow-x-auto max-w-full">
            <button 
              onClick={() => setActiveTab('meds')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'meds' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Meds & Impact
            </button>
            <button 
              onClick={() => setActiveTab('labs')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'labs' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Labs & Values
            </button>
            <button 
              onClick={() => setActiveTab('imaging')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'imaging' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Imaging & Diagnostics
            </button>
            <button 
              onClick={() => setActiveTab('vitals')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'vitals' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Vitals
            </button>
          </div>
        </div>
        <button 
          onClick={() => setIsPatientView(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-200 transition-all"
        >
          <Eye className="w-4 h-4" />
          Patient View
        </button>
      </div>

      <div className="space-y-4 overflow-y-auto pr-2 flex-1">
        {activeTab === 'meds' ? (
          filteredMeds.length > 0 ? (
            filteredMeds.map(med => (
              <div key={med.name} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <Pill className="w-4 h-4 text-rose-500" />
                    {med.name}
                  </h4>
                  <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded-md text-slate-500">{med.category}</span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-600"><span className="font-semibold text-slate-700">Side Effects:</span> {med.sideEffects.join(', ')}</p>
                  <div className="bg-rose-50 p-3 rounded-lg mt-2">
                    <p className="text-sm text-rose-900 flex gap-2 items-start">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span className="font-medium">SLP Impact: {med.impact}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-500 text-center py-8">No medications found matching "{searchQuery}"</p>
          )
        ) : activeTab === 'labs' ? (
          filteredLabs.length > 0 ? (
            filteredLabs.map(lab => (
              <div key={lab.name} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-teal-500" />
                    {lab.name}
                  </h4>
                  <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">{lab.range}</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{lab.impact}</p>
              </div>
            ))
          ) : (
            <p className="text-slate-500 text-center py-8">No lab values found matching "{searchQuery}"</p>
          )
        ) : activeTab === 'vitals' ? (
          filteredVitals.length > 0 ? (
            filteredVitals.map(vital => (
              <div key={vital.name} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <HeartPulse className="w-4 h-4 text-rose-500" />
                    {vital.name}
                  </h4>
                  <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">{vital.range}</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  <span className="font-semibold text-slate-700">Interpretation:</span> {vital.interpretation}
                </p>
                <div className="mt-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">{vital.category}</div>
              </div>
            ))
          ) : (
            <p className="text-slate-500 text-center py-8">No vitals found matching "{searchQuery}"</p>
          )
        ) : (
          filteredImaging.length > 0 ? (
            filteredImaging.map(img => (
              <div key={img.name} className="bg-white overflow-hidden rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <img 
                  src={img.image} 
                  alt={img.name} 
                  className="w-full h-40 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        <Camera className="w-4 h-4 text-blue-500" />
                        {img.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">{img.altName}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed italic">
                    {img.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                      <h5 className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        Indications
                      </h5>
                      <ul className="text-xs text-slate-700 space-y-1">
                        {img.indications.map((ind, idx) => (
                          <li key={idx} className="flex gap-2">
                            <span className="text-blue-400">•</span>
                            {ind}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <h5 className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        SLP Practice
                      </h5>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {img.slpRole}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-500 text-center py-8">No imaging modalities found matching "{searchQuery}"</p>
          )
        )}
      </div>
    </div>
  );

  return (
    <>
      {isPatientView ? (
        <PatientViewWrapper title="Clinical Meds & Diagnostics" onExit={() => setIsPatientView(false)}>
          {renderContent()}
        </PatientViewWrapper>
      ) : (
        renderContent()
      )}
    </>
  );
}
