import React, { useState } from 'react';
import { BookOpen, Stethoscope, Brain, Activity, Search, ChevronRight, ChevronDown, MessageSquare } from 'lucide-react';
import { aiService } from '../services/ai-service';
import { useNotifications } from '../context/NotificationContext';
import ReactMarkdown from 'react-markdown';

export function ClinicalReference() {
  const [activeTab, setActiveTab] = useState<'norms' | 'peds-norms' | 'diff-dx' | 'treatment-plan'>('norms');
  const [expandedSection, setExpandedSection] = useState<string | null>('cranial-nerves');
  
  // Differential Diagnosis State
  const [symptoms, setSymptoms] = useState('');
  const [dxContext, setDxContext] = useState('');
  const [dxResult, setDxResult] = useState('');
  const [isGeneratingDx, setIsGeneratingDx] = useState(false);
  
  // Treatment Plan State
  const [diagnosis, setDiagnosis] = useState('');
  const [assessmentData, setAssessmentData] = useState('');
  const [txResult, setTxResult] = useState('');
  const [isGeneratingTx, setIsGeneratingTx] = useState(false);

  const { notify } = useNotifications();

  const handleGenerateDx = async () => {
    if (!symptoms) {
      notify('error', 'Please enter symptoms/findings.');
      return;
    }
    setIsGeneratingDx(true);
    try {
      const symptomList = symptoms.split(',').map(s => s.trim());
      const result = await aiService.generateDifferentialDiagnosis(symptomList, dxContext);
      setDxResult(result);
    } catch (error) {
      notify('error', 'Failed to generate differential diagnosis.');
    } finally {
      setIsGeneratingDx(false);
    }
  };

  const handleGenerateTx = async () => {
    if (!diagnosis || !assessmentData) {
      notify('error', 'Please enter both diagnosis and assessment data.');
      return;
    }
    setIsGeneratingTx(true);
    try {
      const result = await aiService.generateTreatmentPlan(diagnosis, assessmentData);
      setTxResult(result);
    } catch (error) {
      notify('error', 'Failed to generate treatment plan.');
    } finally {
      setIsGeneratingTx(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-600" />
              Clinical Reference & Tools
            </h1>
            <p className="text-gray-500 mt-1">Evidence-based guidelines, norms, and AI-assisted clinical reasoning.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-gray-100">
          <button
            onClick={() => setActiveTab('norms')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'norms' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Activity className="w-4 h-4" />
            Adult Quick Ref
          </button>
          <button
            onClick={() => setActiveTab('peds-norms')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'peds-norms' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Activity className="w-4 h-4" />
            Peds Quick Ref
          </button>
          <button
            onClick={() => setActiveTab('diff-dx')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'diff-dx' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            Differential Diagnosis Assistant
          </button>
          <button
            onClick={() => setActiveTab('treatment-plan')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'treatment-plan' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Brain className="w-4 h-4" />
            Treatment Plan Generator
          </button>
        </div>

        {/* Tab Content: Norms */}
        {activeTab === 'norms' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Adult Clinical Quick Reference</h2>
            </div>
            
            <div className="divide-y divide-gray-100">
              {/* Cranial Nerves */}
              <div className="p-4">
                <button 
                  onClick={() => toggleSection('cranial-nerves')}
                  className="w-full flex items-center justify-between text-left font-medium text-gray-900 hover:text-indigo-600 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-gray-400" />
                    Cranial Nerves for Speech & Swallowing
                  </span>
                  {expandedSection === 'cranial-nerves' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                
                {expandedSection === 'cranial-nerves' && (
                  <div className="mt-4 pl-6 text-sm text-gray-600 space-y-3">
                    <div className="grid grid-cols-12 gap-4 font-medium text-gray-900 border-b pb-2">
                      <div className="col-span-2">CN</div>
                      <div className="col-span-3">Name</div>
                      <div className="col-span-3">Motor Function</div>
                      <div className="col-span-4">Sensory Function</div>
                    </div>
                    <div className="grid grid-cols-12 gap-4 border-b pb-2">
                      <div className="col-span-2 font-medium">V</div>
                      <div className="col-span-3">Trigeminal</div>
                      <div className="col-span-3">Muscles of mastication (jaw movement)</div>
                      <div className="col-span-4">Face, mouth, anterior 2/3 of tongue (general sensation)</div>
                    </div>
                    <div className="grid grid-cols-12 gap-4 border-b pb-2">
                      <div className="col-span-2 font-medium">VII</div>
                      <div className="col-span-3">Facial</div>
                      <div className="col-span-3">Muscles of facial expression, lip seal</div>
                      <div className="col-span-4">Anterior 2/3 of tongue (taste)</div>
                    </div>
                    <div className="grid grid-cols-12 gap-4 border-b pb-2">
                      <div className="col-span-2 font-medium">IX</div>
                      <div className="col-span-3">Glossopharyngeal</div>
                      <div className="col-span-3">Stylopharyngeus (pharyngeal elevation)</div>
                      <div className="col-span-4">Posterior 1/3 of tongue (taste/sensation), pharynx</div>
                    </div>
                    <div className="grid grid-cols-12 gap-4 border-b pb-2">
                      <div className="col-span-2 font-medium">X</div>
                      <div className="col-span-3">Vagus</div>
                      <div className="col-span-3">Pharyngeal constrictors, intrinsic laryngeal muscles, velum</div>
                      <div className="col-span-4">Pharynx, larynx, epiglottis</div>
                    </div>
                    <div className="grid grid-cols-12 gap-4 border-b pb-2">
                      <div className="col-span-2 font-medium">XI</div>
                      <div className="col-span-3">Spinal Accessory</div>
                      <div className="col-span-3">Sternocleidomastoid, trapezius (head/shoulder movement)</div>
                      <div className="col-span-4">-</div>
                    </div>
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-2 font-medium">XII</div>
                      <div className="col-span-3">Hypoglossal</div>
                      <div className="col-span-3">Intrinsic and extrinsic tongue muscles (except palatoglossus)</div>
                      <div className="col-span-4">-</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Dysphagia Diets */}
              <div className="p-4">
                <button 
                  onClick={() => toggleSection('iddsi')}
                  className="w-full flex items-center justify-between text-left font-medium text-gray-900 hover:text-indigo-600 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-gray-400" />
                    IDDSI Framework (International Dysphagia Diet Standardisation Initiative)
                  </span>
                  {expandedSection === 'iddsi' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                
                {expandedSection === 'iddsi' && (
                  <div className="mt-4 pl-6 text-sm text-gray-600 space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">Drinks (Levels 0-4)</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li><span className="font-medium text-gray-900">0 Thin:</span> Flows like water.</li>
                        <li><span className="font-medium text-gray-900">1 Slightly Thick:</span> Thicker than water but flows through a straw.</li>
                        <li><span className="font-medium text-gray-900">2 Mildly Thick:</span> Nectar-thick. Pours quickly from a spoon but leaves a coating.</li>
                        <li><span className="font-medium text-gray-900">3 Moderately Thick:</span> Honey-thick. Pours slowly from a spoon.</li>
                        <li><span className="font-medium text-gray-900">4 Extremely Thick:</span> Pudding-thick. Holds shape on a spoon.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Foods (Levels 3-7)</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li><span className="font-medium text-gray-900">3 Liquidised:</span> Cannot be eaten with a fork. Smooth, no lumps.</li>
                        <li><span className="font-medium text-gray-900">4 Puréed:</span> Does not require chewing. Smooth, no lumps.</li>
                        <li><span className="font-medium text-gray-900">5 Minced & Moist:</span> Minimal chewing required. Lumps 4mm (adults).</li>
                        <li><span className="font-medium text-gray-900">6 Soft & Bite-Sized:</span> Chewing required. Pieces 1.5cm x 1.5cm (adults).</li>
                        <li><span className="font-medium text-gray-900">7 Regular:</span> Normal everyday foods.</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Aphasia Treatment Strategies */}
              <div className="p-4">
                <button 
                  onClick={() => toggleSection('aphasia-strategies')}
                  className="w-full flex items-center justify-between text-left font-medium text-gray-900 hover:text-indigo-600 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-gray-400" />
                    Aphasia Treatment Strategies
                  </span>
                  {expandedSection === 'aphasia-strategies' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                
                {expandedSection === 'aphasia-strategies' && (
                  <div className="mt-4 pl-6 text-sm text-gray-600 space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">Restorative Approaches</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-2">
                        <li><span className="font-medium text-gray-900">Semantic Feature Analysis (SFA):</span> Focuses on the meaning-based properties of nouns. Patients describe features (group, use, action, properties, location, association) to retrieve the target word.</li>
                        <li><span className="font-medium text-gray-900">Phonological Components Analysis (PCA):</span> Similar to SFA, but focuses on the phonological properties of words (rhymes with, first sound, first sound associate, ends with, syllables).</li>
                        <li><span className="font-medium text-gray-900">Verb Network Strengthening Treatment (VNeST):</span> Targets verbs and their related thematic roles (agent and patient) to improve sentence production and word retrieval.</li>
                        <li><span className="font-medium text-gray-900">Melodic Intonation Therapy (MIT):</span> Uses the musical elements of speech (melody, rhythm, and stress) to improve expressive language in severe non-fluent aphasia.</li>
                        <li><span className="font-medium text-gray-900">Constraint-Induced Language Therapy (CILT):</span> Forces the use of spoken language by restricting the use of compensatory communication strategies (e.g., gesturing, writing).</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Compensatory Approaches</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-2">
                        <li><span className="font-medium text-gray-900">Promoting Aphasic's Communicative Effectiveness (PACE):</span> Simulates natural conversation where the clinician and patient take turns sending and receiving messages using any modality.</li>
                        <li><span className="font-medium text-gray-900">Supported Conversation for Adults with Aphasia (SCA):</span> Trains communication partners to use strategies (spoken, written, gestural) to facilitate communication and ensure the person with aphasia understands and is understood.</li>
                        <li><span className="font-medium text-gray-900">Augmentative and Alternative Communication (AAC):</span> Utilizing low-tech (communication boards, books) or high-tech (speech-generating devices, apps) to supplement or replace spoken language.</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Dysarthria Treatment Strategies */}
              <div className="p-4">
                <button 
                  onClick={() => toggleSection('dysarthria-strategies')}
                  className="w-full flex items-center justify-between text-left font-medium text-gray-900 hover:text-indigo-600 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-gray-400" />
                    Dysarthria Treatment Strategies
                  </span>
                  {expandedSection === 'dysarthria-strategies' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                
                {expandedSection === 'dysarthria-strategies' && (
                  <div className="mt-4 pl-6 text-sm text-gray-600 space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">Respiration</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-2">
                        <li><span className="font-medium text-gray-900">Postural Adjustments:</span> Optimizing seating and positioning to support respiratory effort.</li>
                        <li><span className="font-medium text-gray-900">Inspiratory Muscle Training (IMT):</span> Using devices to increase inspiratory muscle strength.</li>
                        <li><span className="font-medium text-gray-900">Expiratory Muscle Strength Training (EMST):</span> Using devices to increase expiratory muscle strength, beneficial for cough and speech.</li>
                        <li><span className="font-medium text-gray-900">Maximum Vowel Prolongation:</span> Practicing sustaining vowels to improve respiratory control and capacity.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Phonation</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-2">
                        <li><span className="font-medium text-gray-900">Lee Silverman Voice Treatment (LSVT LOUD):</span> Intensive program focusing on increasing vocal loudness (primarily for Parkinson's disease).</li>
                        <li><span className="font-medium text-gray-900">Effortful Closure Techniques:</span> Pushing, pulling, or hard glottal attack to improve vocal fold adduction (for hypoadduction).</li>
                        <li><span className="font-medium text-gray-900">Relaxation Techniques:</span> Yawn-sigh, easy onset to reduce laryngeal tension (for hyperadduction).</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Articulation & Prosody</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-2">
                        <li><span className="font-medium text-gray-900">Clear Speech/Overarticulation:</span> Instructing the patient to speak as if talking to someone hard of hearing.</li>
                        <li><span className="font-medium text-gray-900">Rate Control:</span> Pacing boards, metronomes, or rhythmic cueing to slow speech rate and improve intelligibility.</li>
                        <li><span className="font-medium text-gray-900">Contrastive Stress Drills:</span> Practicing emphasizing different words in a sentence to improve prosody and naturalness.</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Dysphagia Treatment Strategies */}
              <div className="p-4">
                <button 
                  onClick={() => toggleSection('dysphagia-strategies')}
                  className="w-full flex items-center justify-between text-left font-medium text-gray-900 hover:text-indigo-600 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-gray-400" />
                    Dysphagia Treatment Strategies
                  </span>
                  {expandedSection === 'dysphagia-strategies' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                
                {expandedSection === 'dysphagia-strategies' && (
                  <div className="mt-4 pl-6 text-sm text-gray-600 space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">Compensatory Strategies</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-2">
                        <li><span className="font-medium text-gray-900">Chin Tuck:</span> Narrows the airway entrance, widens the valleculae, and pushes the epiglottis posteriorly. Useful for delayed pharyngeal swallow or premature spillage.</li>
                        <li><span className="font-medium text-gray-900">Head Turn (to weaker side):</span> Closes the weaker side of the pharynx, directing the bolus down the stronger side. Useful for unilateral pharyngeal weakness.</li>
                        <li><span className="font-medium text-gray-900">Head Tilt (to stronger side):</span> Directs the bolus down the stronger side of the oral cavity and pharynx using gravity. Useful for unilateral oral and pharyngeal weakness.</li>
                        <li><span className="font-medium text-gray-900">Supraglottic Swallow:</span> Closes the vocal folds before and during the swallow. (Inhale, hold breath, swallow, cough, swallow again).</li>
                        <li><span className="font-medium text-gray-900">Super-Supraglottic Swallow:</span> Closes the airway entrance voluntarily by tilting the arytenoids anteriorly to the base of the epiglottis. (Inhale, bear down and hold breath, swallow, cough, swallow again).</li>
                        <li><span className="font-medium text-gray-900">Mendelsohn Maneuver:</span> Prolongs laryngeal elevation and UES opening. (Swallow and hold the larynx up at its highest point for a few seconds).</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Rehabilitative Exercises</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-2">
                        <li><span className="font-medium text-gray-900">Shaker Exercise:</span> Head-lifting exercise to increase UES opening and decrease hypopharyngeal intrabolus pressure.</li>
                        <li><span className="font-medium text-gray-900">Masako Maneuver (Tongue Hold):</span> Swallowing while holding the tongue between the teeth. Increases posterior pharyngeal wall movement. (Do not use with food/liquid).</li>
                        <li><span className="font-medium text-gray-900">Effortful Swallow:</span> Swallowing hard to increase posterior tongue base movement and pharyngeal pressure.</li>
                        <li><span className="font-medium text-gray-900">Expiratory Muscle Strength Training (EMST):</span> Improves cough strength and hyolaryngeal elevation.</li>
                        <li><span className="font-medium text-gray-900">McNeill Dysphagia Therapy Program (MDTP):</span> A systematic, exercise-based therapy framework for severe dysphagia.</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Cognitive-Communication Treatment Strategies */}
              <div className="p-4">
                <button 
                  onClick={() => toggleSection('cog-comm-strategies')}
                  className="w-full flex items-center justify-between text-left font-medium text-gray-900 hover:text-indigo-600 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-gray-400" />
                    Cognitive-Communication Treatment Strategies
                  </span>
                  {expandedSection === 'cog-comm-strategies' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                
                {expandedSection === 'cog-comm-strategies' && (
                  <div className="mt-4 pl-6 text-sm text-gray-600 space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">Attention</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-2">
                        <li><span className="font-medium text-gray-900">Direct Attention Training (DAT):</span> Repeated practice on specific attention tasks (sustained, selective, alternating, divided) to improve underlying attentional capacity.</li>
                        <li><span className="font-medium text-gray-900">Environmental Modifications:</span> Reducing distractions, organizing the workspace, using earplugs or noise-canceling headphones.</li>
                        <li><span className="font-medium text-gray-900">Self-Management Strategies:</span> Pacing, taking breaks, using self-talk to maintain focus.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Memory</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-2">
                        <li><span className="font-medium text-gray-900">Spaced Retrieval Training (SRT):</span> Recalling information over increasingly longer intervals of time. Highly effective for individuals with dementia or severe memory impairment.</li>
                        <li><span className="font-medium text-gray-900">Errorless Learning:</span> Preventing the patient from making mistakes during the learning process to ensure only correct information is encoded.</li>
                        <li><span className="font-medium text-gray-900">Internal Strategies:</span> Visual imagery, association, chunking, mnemonics, semantic elaboration.</li>
                        <li><span className="font-medium text-gray-900">External Compensatory Aids:</span> Memory notebooks, calendars, alarms, smartphones, smart speakers, pill organizers.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Executive Function</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-2">
                        <li><span className="font-medium text-gray-900">Goal Management Training (GMT):</span> A structured approach to problem-solving: Stop, Define the Goal, List the Steps, Learn the Steps, Check.</li>
                        <li><span className="font-medium text-gray-900">Metacognitive Strategy Training:</span> Teaching patients to monitor and regulate their own thinking and behavior (e.g., self-instruction, self-monitoring).</li>
                        <li><span className="font-medium text-gray-900">Time Management Training:</span> Estimating time required for tasks, creating schedules, using timers.</li>
                        <li><span className="font-medium text-gray-900">Environmental Supports:</span> Checklists, step-by-step instructions, visual schedules, organizing the physical environment.</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Voice Treatment Strategies */}
              <div className="p-4">
                <button 
                  onClick={() => toggleSection('voice-strategies')}
                  className="w-full flex items-center justify-between text-left font-medium text-gray-900 hover:text-indigo-600 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-gray-400" />
                    Voice Treatment Strategies
                  </span>
                  {expandedSection === 'voice-strategies' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                
                {expandedSection === 'voice-strategies' && (
                  <div className="mt-4 pl-6 text-sm text-gray-600 space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">Direct Voice Therapies</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-2">
                        <li><span className="font-medium text-gray-900">Vocal Function Exercises (VFE):</span> A series of systematic voice manipulations designed to strengthen and coordinate the laryngeal musculature. Includes warm-up, stretching, contracting, and adductory power exercises.</li>
                        <li><span className="font-medium text-gray-900">Resonant Voice Therapy (RVT):</span> Focuses on producing voice with forward focus (vibratory sensations in the facial bones/lips) to maximize vocal output while minimizing vocal fold impact stress.</li>
                        <li><span className="font-medium text-gray-900">Semi-Occluded Vocal Tract (SOVT) Exercises:</span> Using a straw, lip trills, or tongue trills to create back pressure in the vocal tract, which helps to square up the vocal folds and reduce collision forces.</li>
                        <li><span className="font-medium text-gray-900">Lee Silverman Voice Treatment (LSVT LOUD):</span> Intensive program focusing on increasing vocal loudness (primarily for Parkinson's disease).</li>
                        <li><span className="font-medium text-gray-900">Laryngeal Massage/Manual Circumferential Laryngeal Tension Reduction:</span> Gentle manipulation of the perilaryngeal musculature to reduce tension and lower the larynx.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Indirect Voice Therapies</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-2">
                        <li><span className="font-medium text-gray-900">Vocal Hygiene Education:</span> Teaching the patient about vocal anatomy, physiology, and behaviors that can damage the voice (e.g., yelling, throat clearing, inadequate hydration).</li>
                        <li><span className="font-medium text-gray-900">Hydration Management:</span> Increasing systemic and topical hydration to reduce vocal fold viscosity and phonation threshold pressure.</li>
                        <li><span className="font-medium text-gray-900">Reflux Management:</span> Dietary and lifestyle modifications to reduce laryngopharyngeal reflux (LPR), often in conjunction with medical management.</li>
                        <li><span className="font-medium text-gray-900">Voice Rest:</span> Complete or modified voice rest, typically used only for a short period following vocal fold surgery or acute injury.</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Tracheostomy & Ventilator Management */}
              <div className="p-4">
                <button 
                  onClick={() => toggleSection('trach-vent')}
                  className="w-full flex items-center justify-between text-left font-medium text-gray-900 hover:text-indigo-600 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-gray-400" />
                    Tracheostomy & Ventilator Management
                  </span>
                  {expandedSection === 'trach-vent' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                
                {expandedSection === 'trach-vent' && (
                  <div className="mt-4 pl-6 text-sm text-gray-600 space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">Speaking Valves (e.g., Passy Muir Valve)</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-2">
                        <li><span className="font-medium text-gray-900">Function:</span> One-way valve that allows air in through the tracheostomy tube but closes on exhalation, forcing air up through the vocal folds for phonation.</li>
                        <li><span className="font-medium text-gray-900">Prerequisites:</span> Cuff MUST be completely deflated (or cuffless tube). Patient must be able to tolerate cuff deflation and manage secretions.</li>
                        <li><span className="font-medium text-gray-900">Benefits:</span> Restores voice, improves swallowing (restores subglottic pressure), improves olfaction, assists with secretion management, facilitates decannulation.</li>
                        <li><span className="font-medium text-gray-900">Contraindications:</span> Severe airway obstruction above the tube, severe aspiration risk, inability to tolerate cuff deflation, thick/copious secretions.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Ventilator Settings (Basic Overview)</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-2">
                        <li><span className="font-medium text-gray-900">Mode:</span> How the ventilator delivers breaths (e.g., Assist-Control (AC), Synchronized Intermittent Mandatory Ventilation (SIMV), Pressure Support Ventilation (PSV)).</li>
                        <li><span className="font-medium text-gray-900">Tidal Volume (Vt):</span> The volume of air delivered with each breath.</li>
                        <li><span className="font-medium text-gray-900">Respiratory Rate (RR):</span> The number of breaths delivered per minute.</li>
                        <li><span className="font-medium text-gray-900">Fraction of Inspired Oxygen (FiO2):</span> The percentage of oxygen in the delivered air (room air is 21%).</li>
                        <li><span className="font-medium text-gray-900">Positive End-Expiratory Pressure (PEEP):</span> Pressure maintained in the airways at the end of exhalation to keep alveoli open.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Swallowing with a Tracheostomy</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-2">
                        <li><span className="font-medium text-gray-900">Impact of Tracheostomy:</span> Can tether the larynx (reducing elevation), decrease subglottic pressure, and desensitize the larynx.</li>
                        <li><span className="font-medium text-gray-900">Cuff Status:</span> An inflated cuff does NOT prevent aspiration (material can pool above it and eventually leak down). It is generally recommended to evaluate swallowing with the cuff deflated (if medically appropriate) to assess true laryngeal function and allow for speaking valve use.</li>
                        <li><span className="font-medium text-gray-900">Evan's Blue Dye Test (MEBDT):</span> A screening tool where food/liquid is dyed blue/green, and tracheal secretions are monitored for dye. High false-negative rate; instrumental assessment (FEES/MBSS) is preferred.</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* AAC (Augmentative and Alternative Communication) */}
              <div className="p-4">
                <button 
                  onClick={() => toggleSection('aac')}
                  className="w-full flex items-center justify-between text-left font-medium text-gray-900 hover:text-indigo-600 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    AAC (Augmentative and Alternative Communication)
                  </span>
                  {expandedSection === 'aac' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                
                {expandedSection === 'aac' && (
                  <div className="mt-4 pl-6 text-sm text-gray-600 space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">Types of AAC</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-2">
                        <li><span className="font-medium text-gray-900">Unaided:</span> No external equipment (e.g., gestures, manual signs, facial expressions, vocalizations).</li>
                        <li><span className="font-medium text-gray-900">Aided - Low-Tech:</span> Non-electronic or simple electronic (e.g., communication boards, PECS, single-message switches).</li>
                        <li><span className="font-medium text-gray-900">Aided - High-Tech:</span> Electronic devices with dynamic displays and speech-generating capabilities (SGDs), often accessed via direct selection, eye tracking, or switch scanning.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Assessment Considerations (SETT Framework)</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-2">
                        <li><span className="font-medium text-gray-900">Student/Self:</span> Physical abilities, cognitive skills, sensory needs (vision/hearing), current communication methods.</li>
                        <li><span className="font-medium text-gray-900">Environment:</span> Settings where communication occurs, communication partners, physical layout.</li>
                        <li><span className="font-medium text-gray-900">Tasks:</span> What the person needs to communicate (e.g., requesting, social interaction, academic participation).</li>
                        <li><span className="font-medium text-gray-900">Tools:</span> Devices, software, access methods, and support strategies needed.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Core vs. Fringe Vocabulary</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-2">
                        <li><span className="font-medium text-gray-900">Core Vocabulary:</span> Small number of high-frequency words (mostly pronouns, verbs, prepositions) that make up ~80% of daily communication (e.g., "I", "want", "more", "go", "stop").</li>
                        <li><span className="font-medium text-gray-900">Fringe Vocabulary:</span> Large number of specific, lower-frequency words (mostly nouns) that are specific to an individual's interests or activities (e.g., "pizza", "dinosaur", "iPad").</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Rancho Los Amigos Scale */}
              <div className="p-4">
                <button 
                  onClick={() => toggleSection('rancho')}
                  className="w-full flex items-center justify-between text-left font-medium text-gray-900 hover:text-indigo-600 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-gray-400" />
                    Rancho Los Amigos Scale (TBI)
                  </span>
                  {expandedSection === 'rancho' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                
                {expandedSection === 'rancho' && (
                  <div className="mt-4 pl-6 text-sm text-gray-600 space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">Levels I - III (Decreased Response)</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-2">
                        <li><span className="font-medium text-gray-900">Level I (No Response):</span> Patient appears to be in a deep sleep and is completely unresponsive to any stimuli.</li>
                        <li><span className="font-medium text-gray-900">Level II (Generalized Response):</span> Patient reacts inconsistently and non-purposefully to stimuli in a nonspecific manner. Responses are limited and often the same regardless of stimulus presented.</li>
                        <li><span className="font-medium text-gray-900">Level III (Localized Response):</span> Patient reacts specifically but inconsistently to stimuli. Responses are directly related to the type of stimulus presented. May follow simple commands such as closing eyes or squeezing hand in an inconsistent, delayed manner.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Levels IV - VI (Confused Response)</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-2">
                        <li><span className="font-medium text-gray-900">Level IV (Confused-Agitated):</span> Patient is in a heightened state of activity. Behavior is bizarre and non-purposeful relative to immediate environment. Does not discriminate among persons or objects; is unable to cooperate directly with treatment efforts.</li>
                        <li><span className="font-medium text-gray-900">Level V (Confused-Inappropriate):</span> Patient is able to respond to simple commands fairly consistently. However, with increased complexity of commands or lack of any external structure, responses are non-purposeful, random, or fragmented. Highly distractible.</li>
                        <li><span className="font-medium text-gray-900">Level VI (Confused-Appropriate):</span> Patient shows goal-directed behavior but is dependent on external input or direction. Follows simple directions consistently and shows carryover for relearned tasks such as self-care.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Levels VII - VIII (Appropriate Response)</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-2">
                        <li><span className="font-medium text-gray-900">Level VII (Automatic-Appropriate):</span> Patient appears appropriate and oriented within the hospital and home settings. Goes through daily routine automatically, but frequently robot-like. Shows minimal to no confusion and has shallow recall of activities.</li>
                        <li><span className="font-medium text-gray-900">Level VIII (Purposeful-Appropriate):</span> Patient is able to recall and integrate past and recent events and is aware of and responsive to environment. Shows carryover for new learning and needs no supervision once activities are learned.</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Aphasia Classification */}
              <div className="p-4">
                <button 
                  onClick={() => toggleSection('aphasia-class')}
                  className="w-full flex items-center justify-between text-left font-medium text-gray-900 hover:text-indigo-600 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-gray-400" />
                    Aphasia Classification (Boston Model)
                  </span>
                  {expandedSection === 'aphasia-class' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                
                {expandedSection === 'aphasia-class' && (
                  <div className="mt-4 pl-6 text-sm text-gray-600 space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">Non-Fluent Aphasias</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-2">
                        <li><span className="font-medium text-gray-900">Broca's:</span> Non-fluent, good comprehension, poor repetition. Effortful, agrammatic speech. Lesion: Posterior inferior frontal gyrus.</li>
                        <li><span className="font-medium text-gray-900">Transcortical Motor:</span> Non-fluent, good comprehension, GOOD repetition. Similar to Broca's but can repeat. Lesion: Anterior/superior to Broca's area.</li>
                        <li><span className="font-medium text-gray-900">Global:</span> Non-fluent, poor comprehension, poor repetition. Severe impairment across all language modalities. Lesion: Large perisylvian area.</li>
                        <li><span className="font-medium text-gray-900">Mixed Transcortical:</span> Non-fluent, poor comprehension, GOOD repetition. Similar to Global but can repeat (often echolalia). Lesion: Watershed areas.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Fluent Aphasias</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-2">
                        <li><span className="font-medium text-gray-900">Wernicke's:</span> Fluent, poor comprehension, poor repetition. "Word salad", jargon, neologisms, lack of awareness. Lesion: Posterior superior temporal gyrus.</li>
                        <li><span className="font-medium text-gray-900">Transcortical Sensory:</span> Fluent, poor comprehension, GOOD repetition. Similar to Wernicke's but can repeat. Lesion: Posterior to Wernicke's area.</li>
                        <li><span className="font-medium text-gray-900">Conduction:</span> Fluent, good comprehension, POOR repetition. Phonemic paraphasias, aware of errors. Lesion: Arcuate fasciculus / supramarginal gyrus.</li>
                        <li><span className="font-medium text-gray-900">Anomic:</span> Fluent, good comprehension, good repetition. Primary deficit is word-finding (naming). Lesion: Variable, often angular gyrus or temporal lobe.</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* Tab Content: Peds Norms */}
        {activeTab === 'peds-norms' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Pediatric Clinical Quick Reference</h2>
            </div>
            
            <div className="divide-y divide-gray-100">
              {/* Speech Sound Development */}
              <div className="p-4">
                <button 
                  onClick={() => toggleSection('speech-sounds')}
                  className="w-full flex items-center justify-between text-left font-medium text-gray-900 hover:text-indigo-600 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-gray-400" />
                    Speech Sound Development (Crowe & McLeod, 2020)
                  </span>
                  {expandedSection === 'speech-sounds' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                
                {expandedSection === 'speech-sounds' && (
                  <div className="mt-4 pl-6 text-sm text-gray-600 space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">Early 8 (Age 1-3)</h4>
                      <p className="mt-1">m, b, j, n, w, d, p, h</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Middle 8 (Age 3-4)</h4>
                      <p className="mt-1">t, ŋ, k, g, f, v, tʃ, dʒ</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Late 8 (Age 5-7)</h4>
                      <p className="mt-1">ʃ, θ, s, z, ð, l, r, ʒ</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mt-2">
                      <p className="text-blue-800 text-xs font-medium">Note: This is a general guide. Intelligibility is also a key factor (e.g., 50% by 2 years, 75% by 3 years, 100% by 4 years to unfamiliar listeners).</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Language Milestones */}
              <div className="p-4">
                <button 
                  onClick={() => toggleSection('language-milestones')}
                  className="w-full flex items-center justify-between text-left font-medium text-gray-900 hover:text-indigo-600 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-gray-400" />
                    Language Milestones (Brown's Stages)
                  </span>
                  {expandedSection === 'language-milestones' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                
                {expandedSection === 'language-milestones' && (
                  <div className="mt-4 pl-6 text-sm text-gray-600 space-y-4">
                    <div className="grid grid-cols-12 gap-4 font-medium text-gray-900 border-b pb-2">
                      <div className="col-span-2">Stage</div>
                      <div className="col-span-3">Age (Months)</div>
                      <div className="col-span-2">MLU</div>
                      <div className="col-span-5">Key Features</div>
                    </div>
                    <div className="grid grid-cols-12 gap-4 border-b pb-2">
                      <div className="col-span-2 font-medium">I</div>
                      <div className="col-span-3">12-26</div>
                      <div className="col-span-2">1.0 - 2.0</div>
                      <div className="col-span-5">Single words, semantic roles and syntactic relations (e.g., "More juice", "Mommy go").</div>
                    </div>
                    <div className="grid grid-cols-12 gap-4 border-b pb-2">
                      <div className="col-span-2 font-medium">II</div>
                      <div className="col-span-3">27-30</div>
                      <div className="col-span-2">2.0 - 2.5</div>
                      <div className="col-span-5">Present progressive (-ing), in, on, regular plural (-s).</div>
                    </div>
                    <div className="grid grid-cols-12 gap-4 border-b pb-2">
                      <div className="col-span-2 font-medium">III</div>
                      <div className="col-span-3">31-34</div>
                      <div className="col-span-2">2.5 - 3.0</div>
                      <div className="col-span-5">Irregular past tense, possessive ('s), uncontractible copula.</div>
                    </div>
                    <div className="grid grid-cols-12 gap-4 border-b pb-2">
                      <div className="col-span-2 font-medium">IV</div>
                      <div className="col-span-3">35-40</div>
                      <div className="col-span-2">3.0 - 3.75</div>
                      <div className="col-span-5">Articles (a, the), regular past tense (-ed), regular third person singular (-s).</div>
                    </div>
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-2 font-medium">V</div>
                      <div className="col-span-3">41-46+</div>
                      <div className="col-span-2">3.75 - 4.5+</div>
                      <div className="col-span-5">Irregular third person, uncontractible auxiliary, contractible copula, contractible auxiliary.</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Pediatric Feeding & Swallowing */}
              <div className="p-4">
                <button 
                  onClick={() => toggleSection('peds-feeding')}
                  className="w-full flex items-center justify-between text-left font-medium text-gray-900 hover:text-indigo-600 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-gray-400" />
                    Pediatric Feeding & Swallowing
                  </span>
                  {expandedSection === 'peds-feeding' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                
                {expandedSection === 'peds-feeding' && (
                  <div className="mt-4 pl-6 text-sm text-gray-600 space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">Developmental Progression</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-2">
                        <li><span className="font-medium text-gray-900">0-4 Months:</span> Breast/bottle feeding. Suck-swallow-breathe coordination. Rooting and suckling reflexes active.</li>
                        <li><span className="font-medium text-gray-900">4-6 Months:</span> Introduction of smooth purees (spoon feeding). Phasic bite reflex diminishes. Gag reflex moves posteriorly.</li>
                        <li><span className="font-medium text-gray-900">6-9 Months:</span> Introduction of thicker purees and meltable solids. Munching pattern emerges. Cup drinking begins (with assistance).</li>
                        <li><span className="font-medium text-gray-900">9-12 Months:</span> Introduction of soft, mashed table foods. Rotary chewing begins to emerge. Finger feeding.</li>
                        <li><span className="font-medium text-gray-900">12-18 Months:</span> Coarsely chopped table foods. Rotary chewing established. Independent cup drinking.</li>
                        <li><span className="font-medium text-gray-900">18-24 Months:</span> Most table foods. Efficient chewing. Straw drinking.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Red Flags for Referral</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-1 text-red-700">
                        <li>Coughing, choking, or color changes during feeding.</li>
                        <li>Frequent respiratory illnesses or pneumonia.</li>
                        <li>Poor weight gain or failure to thrive.</li>
                        <li>Arching, crying, or refusing to eat.</li>
                        <li>Lengthy feeding times (&gt;30 minutes).</li>
                        <li>Gurgly/wet vocal quality during or after meals.</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Pediatric Treatment Strategies */}
              <div className="p-4">
                <button 
                  onClick={() => toggleSection('peds-strategies')}
                  className="w-full flex items-center justify-between text-left font-medium text-gray-900 hover:text-indigo-600 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-gray-400" />
                    Pediatric Treatment Strategies
                  </span>
                  {expandedSection === 'peds-strategies' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                
                {expandedSection === 'peds-strategies' && (
                  <div className="mt-4 pl-6 text-sm text-gray-600 space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">Speech Sound Disorders</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-2">
                        <li><span className="font-medium text-gray-900">Articulation Approaches:</span> Traditional motor approach (Van Riper) focusing on auditory discrimination, phonetic placement, and isolation to conversational speech.</li>
                        <li><span className="font-medium text-gray-900">Phonological Approaches:</span> Cycles approach (Hodson & Paden) for highly unintelligible children, targeting phonological patterns rather than individual sounds. Minimal pairs (contrasting words differing by one phoneme).</li>
                        <li><span className="font-medium text-gray-900">Core Vocabulary Approach:</span> For children with inconsistent speech sound errors, focusing on establishing consistent production of functional, high-frequency words.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Childhood Apraxia of Speech (CAS)</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-2">
                        <li><span className="font-medium text-gray-900">Dynamic Temporal and Tactile Cueing (DTTC):</span> Focuses on movement sequences rather than individual sounds. Uses a hierarchy of temporal delay and tactile/visual cues.</li>
                        <li><span className="font-medium text-gray-900">Prompts for Restructuring Oral Muscular Phonetic Targets (PROMPT):</span> Uses tactile-kinesthetic cues to the articulators to guide movement.</li>
                        <li><span className="font-medium text-gray-900">Rapid Syllable Transition Treatment (ReST):</span> Focuses on improving speech motor planning and programming using non-words to target prosody and transitions.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Language Disorders</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-2">
                        <li><span className="font-medium text-gray-900">Clinician-Directed:</span> Drill, drill play, and modeling. Highly structured, clinician controls all aspects.</li>
                        <li><span className="font-medium text-gray-900">Child-Centered:</span> Daily activities and facilitated play. Clinician follows the child's lead, using techniques like self-talk, parallel talk, expansions, and extensions.</li>
                        <li><span className="font-medium text-gray-900">Hybrid Approaches:</span> Focused stimulation (high density of target forms in meaningful context), milieu teaching (incorporating language teaching into natural routines), script therapy.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Autism Spectrum Disorder (ASD)</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-2">
                        <li><span className="font-medium text-gray-900">Applied Behavior Analysis (ABA):</span> Discrete Trial Training (DTT), Natural Environment Training (NET). Focuses on reinforcing desired behaviors.</li>
                        <li><span className="font-medium text-gray-900">Developmental, Individual Difference, Relationship-Based (DIR/Floortime):</span> Focuses on emotional and relational development through child-led play.</li>
                        <li><span className="font-medium text-gray-900">Social Communication Interventions:</span> Social stories, comic strip conversations, video modeling, peer-mediated instruction to improve pragmatics and social interaction.</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Cognitive-Communication Milestones */}
              <div className="p-4">
                <button 
                  onClick={() => toggleSection('peds-cog')}
                  className="w-full flex items-center justify-between text-left font-medium text-gray-900 hover:text-indigo-600 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-gray-400" />
                    Cognitive-Communication Milestones
                  </span>
                  {expandedSection === 'peds-cog' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                
                {expandedSection === 'peds-cog' && (
                  <div className="mt-4 pl-6 text-sm text-gray-600 space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">Piaget's Stages of Cognitive Development</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-2">
                        <li><span className="font-medium text-gray-900">Sensorimotor (0-2 years):</span> Learns about the world through senses and actions. Develops object permanence (knowing an object exists even when hidden) and early cause-and-effect understanding.</li>
                        <li><span className="font-medium text-gray-900">Preoperational (2-7 years):</span> Begins to think symbolically and use words/pictures to represent objects. Egocentric thinking (struggles to see others' perspectives). Language development is rapid.</li>
                        <li><span className="font-medium text-gray-900">Concrete Operational (7-11 years):</span> Begins to think logically about concrete events. Understands concept of conservation (amount stays the same despite changes in appearance). Thinking becomes less egocentric.</li>
                        <li><span className="font-medium text-gray-900">Formal Operational (12+ years):</span> Develops abstract reasoning and can think hypothetically. Can plan for the future and reason systematically.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Play Development (Parten's Stages)</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-2">
                        <li><span className="font-medium text-gray-900">Unoccupied Play (0-3 months):</span> Random movements, observing surroundings.</li>
                        <li><span className="font-medium text-gray-900">Solitary Play (0-2 years):</span> Plays alone, focused on own activity, not interested in others playing nearby.</li>
                        <li><span className="font-medium text-gray-900">Onlooker Play (2 years):</span> Watches others play but does not join in. May ask questions.</li>
                        <li><span className="font-medium text-gray-900">Parallel Play (2-3 years):</span> Plays alongside others with similar toys, but does not interact or share goals.</li>
                        <li><span className="font-medium text-gray-900">Associative Play (3-4 years):</span> Interacts with others, shares toys, but play is not highly organized or goal-directed.</li>
                        <li><span className="font-medium text-gray-900">Cooperative Play (4+ years):</span> Plays together with shared goals, rules, and organized roles (e.g., playing house, board games).</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* Tab Content: Differential Diagnosis */}
        {activeTab === 'diff-dx' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Differential Diagnosis Assistant</h2>
            <p className="text-sm text-gray-500 mb-6">
              Enter patient symptoms and clinical context to generate a differential diagnosis analysis based on ASHA guidelines.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms / Findings (comma separated)</label>
                <input 
                  type="text" 
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g., imprecise consonants, hypernasality, harsh voice quality, slow rate"
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Clinical Context (Optional)</label>
                <textarea 
                  value={dxContext}
                  onChange={(e) => setDxContext(e.target.value)}
                  placeholder="e.g., 65yo male, recent left MCA CVA, hx of HTN."
                  rows={3}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
              <button 
                onClick={handleGenerateDx}
                disabled={isGeneratingDx}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isGeneratingDx ? 'Analyzing...' : 'Generate Differential Diagnosis'}
              </button>
            </div>

            {dxResult && (
              <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-md font-semibold text-gray-900 mb-4">Analysis Result</h3>
                <div className="prose prose-sm max-w-none text-gray-700">
                  <ReactMarkdown>{dxResult}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Treatment Plan */}
        {activeTab === 'treatment-plan' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Evidence-Based Treatment Plan Generator</h2>
            <p className="text-sm text-gray-500 mb-6">
              Generate a comprehensive, CMS-compliant treatment plan based on the WHO ICF framework.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Diagnosis</label>
                <input 
                  type="text" 
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="e.g., Severe Oropharyngeal Dysphagia, Flaccid Dysarthria"
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assessment Data / Baseline</label>
                <textarea 
                  value={assessmentData}
                  onChange={(e) => setAssessmentData(e.target.value)}
                  placeholder="e.g., Penetration on thin liquids, delayed pharyngeal swallow, reduced laryngeal elevation. Intelligibility 60% at sentence level."
                  rows={4}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
              <button 
                onClick={handleGenerateTx}
                disabled={isGeneratingTx}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isGeneratingTx ? 'Generating Plan...' : 'Generate Treatment Plan'}
              </button>
            </div>

            {txResult && (
              <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-md font-semibold text-gray-900 mb-4">Proposed Treatment Plan</h3>
                <div className="prose prose-sm max-w-none text-gray-700">
                  <ReactMarkdown>{txResult}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
