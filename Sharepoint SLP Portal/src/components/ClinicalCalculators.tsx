import React, { useState } from 'react';
import { 
  Calculator, 
  ChevronRight, 
  BookOpen, 
  RefreshCcw,
  ClipboardList,
  Eye
} from 'lucide-react';
import { 
  calculateTotalScore, 
  calculateWabScore, 
  calculateAidsScore,
  getMocaInterpretation,
  getMasaInterpretation,
  getEat10Interpretation,
  getGussInterpretation,
  getFlciInterpretation,
  getRipaG2Interpretation,
  getWabrInterpretation,
  getAidsInterpretation,
  getFda2Interpretation
} from '../utils/clinical-calculators';
import { PatientViewWrapper } from './layout/PatientViewWrapper';

const CALCULATORS = [
  {
    id: 'moca',
    title: 'MoCA Scoring',
    description: 'Montreal Cognitive Assessment (MoCA) interpretation guide.',
    sections: [
      { name: 'Visuospatial/Executive', max: 5 },
      { name: 'Naming', max: 3 },
      { name: 'Attention', max: 6 },
      { name: 'Language', max: 3 },
      { name: 'Abstraction', max: 2 },
      { name: 'Delayed Recall', max: 5 },
      { name: 'Orientation', max: 6 }
    ]
  },
  {
    id: 'gds',
    title: 'GDS (Global Deterioration Scale)',
    description: 'Staging dementia severity from Stage 1 to Stage 7.',
    stages: [
      { id: 1, label: 'No Cognitive Decline', description: 'Normal function.' },
      { id: 2, label: 'Very Mild Decline', description: 'Forgetfulness, normal aging.' },
      { id: 3, label: 'Mild Decline', description: 'Early confusion, subtle deficits.' },
      { id: 4, label: 'Moderate Decline', description: 'Late confusion, clinical diagnosis.' },
      { id: 5, label: 'Moderately Severe Decline', description: 'Early dementia, needs assistance.' },
      { id: 6, label: 'Severe Decline', description: 'Middle dementia, personality changes.' },
      { id: 7, label: 'Very Severe Decline', description: 'Late dementia, loss of speech/motor.' }
    ]
  },
  {
    id: 'wab-r',
    title: 'WAB-R (Western Aphasia Battery)',
    description: 'Aphasia Quotient (AQ) calculation and classification.',
    sections: [
      { name: 'Spontaneous Speech', max: 20 },
      { name: 'Auditory Comprehension', max: 10 },
      { name: 'Repetition', max: 10 },
      { name: 'Naming', max: 10 }
    ],
    formula: '(Sum of scores) * 2 = AQ'
  },
  {
    id: 'resp-swallow',
    title: 'Resp-Swallow Phase Timing',
    description: 'Calculate respiratory-swallow phase timing (Inspiration/Expiration).',
    sections: [
      { name: 'Inspiratory Phase (ms)', max: 5000 },
      { name: 'Expiratory Phase (ms)', max: 5000 }
    ]
  },
  {
    id: 'masa',
    title: 'MASA',
    description: 'Mann Assessment of Swallowing Ability.',
    sections: [
      { name: 'Alertness', max: 10 },
      { name: 'Cooperation', max: 10 },
      { name: 'Auditory Comprehension', max: 10 },
      { name: 'Respiration', max: 10 },
      { name: 'Dysphasia', max: 10 },
      { name: 'Apraxia', max: 10 },
      { name: 'Dysarthria', max: 10 },
      { name: 'Saliva', max: 10 },
      { name: 'Lip Seal', max: 10 },
      { name: 'Tongue Movement', max: 10 },
      { name: 'Tongue Strength', max: 10 },
      { name: 'Tongue Coordination', max: 10 },
      { name: 'Oral Preparation', max: 10 },
      { name: 'Gag', max: 10 },
      { name: 'Palate', max: 10 },
      { name: 'Bolus Clearance', max: 10 },
      { name: 'Oral Transit', max: 10 },
      { name: 'Cough Reflex', max: 10 },
      { name: 'Voluntary Cough', max: 10 },
      { name: 'Voice', max: 10 },
      { name: 'Tracheostomy', max: 10 },
      { name: 'Pharyngeal Phase', max: 10 },
      { name: 'Pharyngeal Response', max: 10 },
      { name: 'Clearance', max: 10 }
    ]
  },
  {
    id: 'eat-10',
    title: 'EAT-10',
    description: 'Eating Assessment Tool (0-4 scale per item).',
    sections: [
      { name: 'Weight loss', max: 4 },
      { name: 'Interferes with going out', max: 4 },
      { name: 'Swallowing liquids takes effort', max: 4 },
      { name: 'Swallowing solids takes effort', max: 4 },
      { name: 'Swallowing pills takes effort', max: 4 },
      { name: 'Swallowing is painful', max: 4 },
      { name: 'Pleasure of eating is affected', max: 4 },
      { name: 'Food sticks in throat', max: 4 },
      { name: 'Cough when eating', max: 4 },
      { name: 'Swallowing is stressful', max: 4 }
    ]
  },
  {
    id: 'guss',
    title: 'GUSS',
    description: 'Gugging Swallowing Screen.',
    sections: [
      { name: 'Vigilance', max: 1 },
      { name: 'Coughing/Throat Clearing', max: 1 },
      { name: 'Saliva Swallowing', max: 1 },
      { name: 'Drooling', max: 1 },
      { name: 'Voice Change', max: 1 },
      { name: 'Semisolid Swallowing', max: 5 },
      { name: 'Liquid Swallowing', max: 5 },
      { name: 'Solid Swallowing', max: 5 }
    ]
  },
  {
    id: 'aids',
    title: 'AIDS',
    description: 'Assessment of Intelligibility of Dysarthric Speech.',
    sections: [
      { name: 'Words Understood', max: 1000 },
      { name: 'Total Words', max: 1000 }
    ],
    formula: '(Words Understood / Total Words) * 100 = Intelligibility %'
  },
  {
    id: 'fda-2',
    title: 'FDA-2',
    description: 'Frenchay Dysarthria Assessment (9-point scale per section).',
    sections: [
      { name: 'Reflexes', max: 9 },
      { name: 'Respiration', max: 9 },
      { name: 'Lips', max: 9 },
      { name: 'Palate', max: 9 },
      { name: 'Laryngeal', max: 9 },
      { name: 'Tongue', max: 9 },
      { name: 'Intelligibility', max: 9 }
    ]
  },
  {
    id: 'flci',
    title: 'FLCI',
    description: 'Functional Linguistic Communication Inventory.',
    sections: [
      { name: 'Greeting & Naming', max: 10 },
      { name: 'Answering Questions', max: 10 },
      { name: 'Writing', max: 10 },
      { name: 'Sign Comprehension', max: 10 },
      { name: 'Object-to-Picture Matching', max: 10 },
      { name: 'Word Reading & Comprehension', max: 10 },
      { name: 'Following Commands', max: 10 },
      { name: 'Pantomime, Gesture & Conversation', max: 18 }
    ]
  },
  {
    id: 'ripa-g2',
    title: 'RIPA-G:2',
    description: 'Ross Information Processing Assessment-Geriatric: Second Edition.',
    sections: [
      { name: 'Immediate Memory', max: 10 },
      { name: 'Recent Memory', max: 10 },
      { name: 'Temporal Orientation', max: 10 },
      { name: 'Spatial Orientation', max: 10 },
      { name: 'Orientation to Environment', max: 10 },
      { name: 'Recall of General Information', max: 10 },
      { name: 'Problem Solving & Abstract Reasoning', max: 10 },
      { name: 'Organization of Information', max: 10 },
      { name: 'Auditory Processing & Retention', max: 10 },
      { name: 'Problem Solving & Abstract Reasoning (II)', max: 10 }
    ]
  }
];

export function ClinicalCalculators() {
  const [selectedId, setSelectedId] = useState<string>(CALCULATORS[0].id);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [isPatientView, setIsPatientView] = useState(false);
  const selected = CALCULATORS.find(c => c.id === selectedId) || CALCULATORS[0];

  const totalScore = calculateTotalScore(scores);
  const aqScore = selectedId === 'wab-r' ? calculateWabScore(scores) : totalScore;
  const aidsScore = selectedId === 'aids' ? calculateAidsScore({ 'Words Understood': scores['Words Understood'], 'Total Words': scores['Total Words'] }) : totalScore;

  const getRange = (score: number) => {
    if (selectedId === 'moca') return getMocaInterpretation(score);
    if (selectedId === 'masa') return getMasaInterpretation(score);
    if (selectedId === 'eat-10') return getEat10Interpretation(score);
    if (selectedId === 'guss') return getGussInterpretation(score);
    if (selectedId === 'flci') return getFlciInterpretation(score);
    if (selectedId === 'ripa-g2') return getRipaG2Interpretation(score);
    if (selectedId === 'wab-r') return getWabrInterpretation(aqScore);
    if (selectedId === 'aids') return getAidsInterpretation(aidsScore);
    if (selectedId === 'fda-2') return getFda2Interpretation(score);
    return null;
  };

  const range = getRange(totalScore);

  const renderContent = () => (
    <div className="h-full flex flex-col lg:flex-row gap-8">
      {/* Sidebar */}
      <div className="lg:w-80 space-y-4 shrink-0">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2">Calculators</h3>
        <div className="space-y-2">
          {CALCULATORS.map((calc) => (
            <button
              key={calc.id}
              onClick={() => {
                setSelectedId(calc.id);
                setScores({});
              }}
              className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center justify-between group ${
                selectedId === calc.id 
                ? 'bg-teal-50 border-teal-200 shadow-sm text-teal-900' 
                : 'bg-white border-slate-100 text-slate-600 hover:border-teal-100 hover:bg-teal-50/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${selectedId === calc.id ? 'bg-teal-200 text-teal-700' : 'bg-slate-100 text-slate-400 group-hover:bg-teal-100 group-hover:text-teal-600'}`}>
                  <Calculator className="w-4 h-4" />
                </div>
                <span className="font-bold">{calc.title}</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${selectedId === calc.id ? 'translate-x-1' : 'opacity-0'}`} />
            </button>
          ))}
        </div>

        <div className="p-6 bg-slate-900 rounded-[2rem] text-white mt-8 relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="font-bold mb-2 flex items-center gap-2 text-teal-400">
              <BookOpen className="w-4 h-4" />
              Clinical Norms
            </h4>
            <p className="text-xs text-slate-400 mb-4">Access age-adjusted norms and standard deviations for interpretation.</p>
            <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-colors">
              View Norms
            </button>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/20 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">{selected.title}</h2>
                <p className="text-slate-500 font-medium">{selected.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsPatientView(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-200 transition-all"
                >
                  <Eye className="w-4 h-4" />
                  Patient View
                </button>
                <button 
                  onClick={() => setScores({})}
                  className="p-3 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-200 transition-colors"
                  title="Reset"
                >
                  <RefreshCcw className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Result Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-slate-900 p-8 rounded-[2rem] text-white flex flex-col justify-center items-center">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Total Score</div>
                <div className="text-6xl font-black tracking-tighter text-teal-400">
                  {selectedId === 'wab-r' ? aqScore.toFixed(1) : selectedId === 'aids' ? `${aidsScore}%` : totalScore}
                </div>
                {selectedId === 'wab-r' && <div className="text-xs font-bold text-slate-500 mt-2">Aphasia Quotient (AQ)</div>}
                {selectedId === 'aids' && <div className="text-xs font-bold text-slate-500 mt-2">Intelligibility</div>}
              </div>

              {range && (
                <div className={`p-8 rounded-[2rem] flex flex-col justify-center items-center border ${range.color}`}>
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Interpretation</div>
                  <div className="text-2xl font-black text-center leading-tight">{range.label}</div>
                </div>
              )}

              {selectedId === 'gds' && (
                <div className="bg-amber-50 p-8 rounded-[2rem] border border-amber-100 flex flex-col justify-center items-center">
                  <div className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-2">Clinical Note</div>
                  <div className="text-sm font-bold text-amber-800 text-center">GDS Staging is based on clinical observation and caregiver report.</div>
                </div>
              )}
            </div>
          </div>

          <div className="p-8 space-y-8">
            {Array.isArray(selected.sections) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selected.sections.map((section) => (
                  <div key={section.name} className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center justify-between group">
                    <div>
                      <div className="font-bold text-slate-900 mb-1">{section.name}</div>
                      <div className="text-xs text-slate-400">Max Score: {section.max}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input 
                        type="number" 
                        min="0" 
                        max={section.max}
                        value={scores[section.name] || 0}
                        onChange={(e) => setScores(prev => ({ ...prev, [section.name]: Math.min(section.max, Math.max(0, parseInt(e.target.value) || 0)) }))}
                        className="w-16 h-12 bg-white border border-slate-200 rounded-xl text-center font-black text-slate-900 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {Array.isArray(selected.stages) && (
              <div className="space-y-3">
                {selected.stages.map((stage) => (
                  <button
                    key={stage.id}
                    onClick={() => setScores({ stage: stage.id })}
                    className={`w-full p-6 rounded-[2rem] border transition-all text-left flex items-center gap-6 group ${
                      scores.stage === stage.id 
                      ? 'bg-teal-50 border-teal-200 shadow-sm' 
                      : 'bg-white border-slate-100 hover:border-teal-100'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl transition-colors ${
                      scores.stage === stage.id ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-teal-100 group-hover:text-teal-600'
                    }`}>
                      {stage.id}
                    </div>
                    <div>
                      <div className={`font-bold transition-colors ${scores.stage === stage.id ? 'text-teal-900' : 'text-slate-900'}`}>{stage.label}</div>
                      <div className="text-xs text-slate-500">{stage.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-200 flex items-start gap-4">
              <div className="p-2 bg-white rounded-xl text-slate-400">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div className="text-sm text-slate-500 leading-relaxed">
                <strong>Documentation Tip:</strong> Always include the specific assessment version and date. For Medicare, document how the score impacts functional goals and safety in the SNF environment.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isPatientView ? (
        <PatientViewWrapper title="Clinical Calculators" onExit={() => setIsPatientView(false)}>
          {renderContent()}
        </PatientViewWrapper>
      ) : (
        renderContent()
      )}
    </>
  );
}
