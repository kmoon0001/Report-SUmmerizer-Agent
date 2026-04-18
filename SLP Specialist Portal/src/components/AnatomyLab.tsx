import React, { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { VideoLibrary } from './VideoLibrary';
import { 
  Brain, 
  Activity, 
  Info, 
  ChevronRight, 
  Play, 
  Image as ImageIcon,
  Volume2,
  Utensils,
  AlertCircle,
  Box,
  Layers,
  RotateCw,
  ZoomIn,
  PlayCircle,
  Wand2,
  Loader2,
  Check,
  Eye
} from 'lucide-react';
import { aiService } from '../services/ai-service';
import { persistenceService } from '../services/persistence-service';
import { useDashboard } from '../context/DashboardContext';
import { PatientViewWrapper } from './layout/PatientViewWrapper';
import { cn } from '../lib/utils';
import { isWebGLSupported } from '../lib/webgl-check';
import { WebGLFallback } from './WebGLFallback';

// Simple 3D Model Placeholder
const AnatomyModel = () => (
  <Suspense fallback={null}>
    <Sphere args={[1, 64, 64]} scale={2}>
      <MeshDistortMaterial
        color="#fb7185"
        attach="material"
        distort={0.4}
        speed={2}
        roughness={0.2}
      />
    </Sphere>
  </Suspense>
);

const ANATOMY_DATA = [
  {
    id: 'larynx',
    title: 'The Larynx',
    description: 'The "voice box" responsible for sound production and airway protection.',
    image: 'https://image.pollinations.ai/prompt/Medical%20illustration%20of%20human%20larynx%20anatomy%20white%20background?nologo=true',
    keyStructures: ['Epiglottis', 'True Vocal Folds', 'False Vocal Folds', 'Arytenoids', 'Cricoid Cartilage'],
    clinicalNotes: 'The primary valve for airway protection during swallowing. Dysfunction leads to aspiration risk and dysphonia.',
    pathologies: ['Vocal Fold Paralysis', 'Laryngeal Web', 'Nodules/Polyps', 'Presbylarynx'],
    fallbackImage: 'https://picsum.photos/seed/larynx/800/600',
    interactiveContent: [
      {
        id: 'vocal-fold-vibration',
        title: 'Vocal Fold Vibration',
        type: 'animation',
        description: 'High-speed visualization of the mucosal wave during phonation, showing the periodic opening and closing of the vocal folds.',
        thumbnail: 'https://img.youtube.com/vi/iYhACrAeot0/0.jpg',
        fallbackImage: 'https://image.pollinations.ai/prompt/Medical%20illustration%20of%20human%20larynx%20anatomy%20white%20background?nologo=true'
      },
      {
        id: 'vocal-nodules',
        title: 'Vocal Fold Nodules',
        type: 'model',
        description: 'Bilateral, symmetric, callous-like growths on the anterior 1/3 of the vocal folds, typically caused by chronic vocal abuse.',
        thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Vocal_cord_nodules.jpg/800px-Vocal_cord_nodules.jpg',
        fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Vocal_cord_nodules.jpg/800px-Vocal_cord_nodules.jpg'
      }
    ]
  },
  {
    id: 'pharynx',
    title: 'The Pharynx',
    description: 'The muscular tube connecting the oral cavity to the esophagus and larynx.',
    image: 'https://image.pollinations.ai/prompt/Medical%20illustration%20of%20human%20pharynx%20anatomy%20sagittal%20section%20white%20background?nologo=true',
    keyStructures: ['Nasopharynx', 'Oropharynx', 'Hypopharynx', 'UES (Upper Esophageal Sphincter)', 'Valleculae', 'Pyriform Sinuses'],
    clinicalNotes: 'The site of the pharyngeal swallow reflex. Residue in valleculae or pyriforms indicates pharyngeal phase deficits.',
    pathologies: ['Zenker\'s Diverticulum', 'Pharyngeal Weakness', 'UES Dysfunction'],
    fallbackImage: 'https://image.pollinations.ai/prompt/Medical%20illustration%20of%20human%20pharynx%20anatomy%20sagittal%20section%20white%20background?nologo=true',
    interactiveContent: [
      {
        id: 'normal-swallow',
        title: 'Normal Swallow Process',
        type: 'animation',
        description: '3D visualization of the bolus transit through the pharynx with coordinated hyolaryngeal excursion.',
        thumbnail: 'https://img.youtube.com/vi/example_swallow/0.jpg',
        fallbackImage: 'https://image.pollinations.ai/prompt/Medical%20illustration%20of%20human%20pharynx%20anatomy%20sagittal%20section%20white%20background?nologo=true'
      },
      {
        id: 'zenkers',
        title: 'Zenker\'s Diverticulum',
        type: 'model',
        description: 'Posterior herniation of the pharyngeal mucosa through Killian\'s dehiscence.',
        thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Zenker_diverticulum.jpg/800px-Zenker_diverticulum.jpg',
        fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Zenker_diverticulum.jpg/800px-Zenker_diverticulum.jpg'
      },
      {
        id: 'residue',
        title: 'Pharyngeal Residue',
        type: 'model',
        description: 'Pooling of bolus material in the valleculae and pyriform sinuses due to pharyngeal weakness.',
        thumbnail: 'https://image.pollinations.ai/prompt/Medical%20illustration%20of%20human%20pharynx%20anatomy%20sagittal%20section%20white%20background?nologo=true',
        fallbackImage: 'https://image.pollinations.ai/prompt/Medical%20illustration%20of%20human%20pharynx%20anatomy%20sagittal%20section%20white%20background?nologo=true'
      }
    ]
  },
  {
    id: 'brain',
    title: 'Brain & Cranial Nerves',
    description: 'The control center for all communication and swallowing functions.',
    image: 'https://image.pollinations.ai/prompt/Medical%20illustration%20of%20human%20brain%20sagittal%20section%20white%20background?nologo=true',
    keyStructures: ['Broca\'s Area', 'Wernicke\'s Area', 'Motor Cortex', 'Brainstem (Swallow Center)', 'CN V, VII, IX, X, XII'],
    clinicalNotes: 'Lesion location determines the deficit (e.g., Left MCA -> Aphasia; Brainstem -> Severe Dysphagia).',
    pathologies: ['Stroke (CVA)', 'TBI', 'Neurodegenerative Diseases (PD, ALS, Dementia)'],
    fallbackImage: 'https://image.pollinations.ai/prompt/Medical%20illustration%20of%20human%20brain%20sagittal%20section%20white%20background?nologo=true',
    interactiveContent: [
      {
        id: 'brain-regions',
        title: 'Functional Brain Regions',
        type: 'model',
        description: 'Interactive map of Broca\'s, Wernicke\'s, and the motor strip.',
        thumbnail: 'https://image.pollinations.ai/prompt/Medical%20illustration%20of%20human%20brain%20sagittal%20section%20white%20background?nologo=true',
        fallbackImage: 'https://image.pollinations.ai/prompt/Medical%20illustration%20of%20human%20brain%20sagittal%20section%20white%20background?nologo=true'
      },
      {
        id: 'cranial-nerves',
        title: 'Cranial Nerve Pathways',
        type: 'model',
        description: 'Visualization of CN V, VII, IX, X, XII and their clinical relevance.',
        thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Cranial_nerves.svg/800px-Cranial_nerves.svg.png',
        fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Cranial_nerves.svg/800px-Cranial_nerves.svg.png'
      }
    ]
  },
  {
    id: 'oral-cavity',
    title: 'Oral Cavity & Physiology',
    description: 'The structures involved in mastication, bolus formation, and the oral phase of swallowing.',
    image: 'https://image.pollinations.ai/prompt/Medical%20illustration%20of%20human%20oral%20cavity%20mouth%20anatomy%20white%20background?nologo=true',
    keyStructures: ['Lips', 'Teeth', 'Hard Palate', 'Soft Palate (Velum)', 'Tongue', 'Salivary Glands'],
    clinicalNotes: 'Crucial for bolus preparation and containment. Deficits lead to anterior spillage, poor mastication, and premature spillage.',
    pathologies: ['Labial Weakness', 'Lingual Weakness/Fasciculations', 'Xerostomia', 'Cleft Palate'],
    fallbackImage: 'https://image.pollinations.ai/prompt/Medical%20illustration%20of%20human%20oral%20cavity%20mouth%20anatomy%20white%20background?nologo=true',
    interactiveContent: [
      {
        id: 'mastication',
        title: 'Mastication Process',
        type: 'animation',
        description: 'Rotary chew and bolus formation.',
        thumbnail: 'https://image.pollinations.ai/prompt/Medical%20illustration%20of%20human%20oral%20cavity%20mouth%20anatomy%20white%20background?nologo=true',
        fallbackImage: 'https://image.pollinations.ai/prompt/Medical%20illustration%20of%20human%20oral%20cavity%20mouth%20anatomy%20white%20background?nologo=true'
      }
    ]
  }
];

export function AnatomyLab() {
  const { autoSaveAssets, setActiveView } = useDashboard();
  const [isPatientView, setIsPatientView] = useState(false);
  const [selectedId, setSelectedId] = useState<string>(ANATOMY_DATA[0].id);
  const [viewMode, setViewMode] = useState<'atlas' | 'interactive' | 'custom'>('atlas');
  const [activeInteractiveId, setActiveInteractiveId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVideoLibrary, setShowVideoLibrary] = useState(false);
  const [isInteractiveLoading, setIsInteractiveLoading] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  React.useEffect(() => {
    setWebglSupported(isWebGLSupported());
  }, []);
  
  // Simulate 3D loading
  React.useEffect(() => {
    if (activeInteractiveId) {
      setIsInteractiveLoading(true);
      const timer = setTimeout(() => setIsInteractiveLoading(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [activeInteractiveId]);
  // Custom Generation State
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  
  const selected = ANATOMY_DATA.find(a => a.id === selectedId) || ANATOMY_DATA[0];

  const handleGenerateDiagram = async () => {
    if (!customPrompt) return;
    setIsGenerating(true);
    setIsSaved(false);
    try {
      const imageUrl = await aiService.generateProImage(
        `Medical illustration of ${customPrompt}. High quality, anatomical accuracy, clean white background.`, 
        '1K'
      );
      setGeneratedImage(imageUrl);

      // Auto-save to Asset Gallery if enabled
      if (autoSaveAssets && imageUrl && imageUrl.startsWith('data:')) {
        await persistenceService.saveGeneratedAsset({
          id: `anatomy-${Date.now()}`,
          type: 'image',
          data: imageUrl,
          date: new Date().toISOString(),
          prompt: customPrompt,
          metadata: {
            category: 'Anatomy Lab'
          }
        });
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Failed to generate diagram", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToLibrary = async () => {
    if (!generatedImage || isSaved) return;
    
    try {
      await persistenceService.saveGeneratedAsset({
        id: `anatomy-${Date.now()}`,
        type: 'image',
        data: generatedImage,
        date: new Date().toISOString(),
        prompt: customPrompt,
        metadata: {
          category: 'Anatomy Lab'
        }
      });
      setIsSaved(true);
    } catch (error) {
      console.error("Failed to save asset", error);
    }
  };

  // Reset view mode when changing modules
  React.useEffect(() => {
    setViewMode('atlas');
    setActiveInteractiveId(null);
  }, [selectedId]);

  const renderContent = () => (
    <div className="h-full flex flex-col lg:flex-row gap-8">
      {/* Sidebar List */}
      <div className="lg:w-80 space-y-4 shrink-0">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2">Anatomy Modules</h3>
        <div className="space-y-2">
          {ANATOMY_DATA.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center justify-between group ${
                selectedId === item.id 
                ? 'bg-rose-50 border-rose-200 shadow-sm text-rose-900' 
                : 'bg-white border-slate-100 text-slate-600 hover:border-rose-100 hover:bg-rose-50/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${selectedId === item.id ? 'bg-rose-200 text-rose-700' : 'bg-slate-100 text-slate-400 group-hover:bg-rose-100 group-hover:text-rose-600'}`}>
                  {item.id === 'brain' ? <Brain className="w-4 h-4" /> : item.id === 'larynx' ? <Volume2 className="w-4 h-4" /> : <Utensils className="w-4 h-4" />}
                </div>
                <span className="font-bold">{item.title}</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${selectedId === item.id ? 'translate-x-1' : 'opacity-0'}`} />
            </button>
          ))}
        </div>

        <div className="p-6 bg-slate-900 rounded-[2rem] text-white mt-8 relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              Video Library
            </h4>
            <p className="text-xs text-slate-400 mb-4">Watch high-speed videoendoscopy and MBSS clips for clinical review.</p>
            <button 
              onClick={() => setShowVideoLibrary(true)}
              className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-colors"
            >
              Browse Videos
            </button>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/20 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />
        </div>
      </div>

      {/* Detail View */}
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          
          {/* View Toggle */}
          <div className="absolute top-6 right-6 z-20 flex gap-2">
            <button 
              onClick={() => setViewMode('atlas')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                viewMode === 'atlas' 
                ? 'bg-white text-slate-900 shadow-md' 
                : 'bg-slate-200/50 text-slate-900 backdrop-blur-md hover:bg-slate-300/50'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              Atlas View
            </button>
            {selected.interactiveContent && selected.interactiveContent.length > 0 && (
              <button 
                onClick={() => {
                  setViewMode('interactive');
                  if (!activeInteractiveId && selected.interactiveContent) {
                    setActiveInteractiveId(selected.interactiveContent[0].id);
                  }
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  viewMode === 'interactive' 
                  ? 'bg-white text-rose-600 shadow-md' 
                  : 'bg-slate-200/50 text-slate-900 backdrop-blur-md hover:bg-slate-300/50'
                }`}
              >
                <Box className="w-4 h-4" />
                Interactive 3D
              </button>
            )}
            <button 
              onClick={() => setViewMode('custom')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                viewMode === 'custom' 
                ? 'bg-white text-purple-600 shadow-md' 
                : 'bg-slate-200/50 text-slate-900 backdrop-blur-md hover:bg-slate-300/50'
              }`}
            >
              <Wand2 className="w-4 h-4" />
              AI Diagram
            </button>
          </div>

          <div className="aspect-video relative overflow-hidden bg-slate-900">
            {viewMode === 'custom' ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-slate-900 relative">
                <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]" />
                <div className="relative z-10 w-full max-w-2xl space-y-6 text-center">
                  {!generatedImage ? (
                    <>
                      <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Wand2 className="w-10 h-10 text-purple-400" />
                      </div>
                      <h2 className="text-3xl font-black text-white mb-2">AI Medical Illustrator</h2>
                      <p className="text-slate-400 mb-8">Describe any anatomical structure or pathology to generate a custom diagram.</p>
                      
                      <div className="flex gap-2 bg-white/10 p-2 rounded-2xl backdrop-blur-sm border border-white/20">
                        <input 
                          type="text"
                          value={customPrompt}
                          onChange={(e) => setCustomPrompt(e.target.value)}
                          placeholder="e.g., Cross-section of vocal fold polyp..."
                          className="flex-1 bg-transparent border-none text-white placeholder-slate-400 focus:ring-0 px-4"
                          onKeyDown={(e) => e.key === 'Enter' && handleGenerateDiagram()}
                        />
                        <button 
                          onClick={handleGenerateDiagram}
                          disabled={!customPrompt || isGenerating}
                          className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                          Generate
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="relative w-full h-full flex flex-col items-center">
                      <img src={generatedImage} alt="Generated Diagram" className="max-h-[400px] rounded-xl shadow-2xl border border-white/10" />
                      <div className="mt-6 flex gap-4">
                        <button 
                          onClick={() => {
                            setGeneratedImage(null);
                            setIsSaved(false);
                          }}
                          className="px-6 py-2 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-colors"
                        >
                          New Diagram
                        </button>
                        <button 
                          onClick={handleSaveToLibrary}
                          disabled={isSaved}
                          className={cn(
                            "px-6 py-2 rounded-xl font-bold transition-all flex items-center gap-2",
                            isSaved 
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default" 
                              : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20"
                          )}
                        >
                          {isSaved ? (
                            <>
                              <Check className="w-4 h-4" />
                              Saved to Library
                            </>
                          ) : (
                            <>
                              <ImageIcon className="w-4 h-4" />
                              Save to Library
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : viewMode === 'atlas' ? (
              <>
                <img 
                  src={selected.image} 
                  alt={selected.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    console.error('Image failed to load:', (e.target as HTMLImageElement).src);
                    (e.target as HTMLImageElement).src = (selected as any).fallbackImage || 'https://picsum.photos/seed/medical-atlas/800/600';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
                  <h2 className="text-4xl font-black text-white tracking-tight mb-2">{selected.title}</h2>
                  <p className="text-slate-200 text-lg font-medium max-w-2xl">{selected.description}</p>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex">
                <div className="flex-1 relative bg-slate-900 flex items-center justify-center overflow-hidden">
                  {!webglSupported ? (
                    <WebGLFallback className="rounded-none border-none" />
                  ) : (
                    <>
                      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[10, 10, 5]} intensity={1} />
                        <AnatomyModel />
                        <OrbitControls enableZoom={false} autoRotate />
                      </Canvas>
                      
                      <div className="absolute top-10 left-10 text-left pointer-events-none">
                        <div className="text-emerald-400 font-black text-xl tracking-tighter uppercase mb-1">Interactive 3D</div>
                        <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">Anatomical Model</div>
                      </div>
                    </>
                  )}
                </div>

                {/* Interactive Menu */}
                <div className="w-64 bg-slate-800 border-l border-slate-700 p-4 overflow-y-auto">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Select View</h4>
                  <div className="space-y-3">
                    {selected.interactiveContent?.map((content) => (
                      <button
                        key={content.id}
                        onClick={() => setActiveInteractiveId(content.id)}
                        className={`w-full p-3 rounded-xl text-left transition-all ${
                          activeInteractiveId === content.id
                          ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                          : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        <div className="font-bold text-sm mb-1">{content.title}</div>
                        <div className="text-[10px] opacity-70 flex items-center gap-1">
                          {content.type === 'animation' ? <PlayCircle className="w-3 h-3" /> : <Box className="w-3 h-3" />}
                          {content.type === 'animation' ? 'Animation' : '3D Model'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <section>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Info className="w-3 h-3" />
                  Key Structures
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selected.keyStructures.map((s, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200">
                      {s}
                    </span>
                  ))}
                </div>
              </section>

              <section className="bg-rose-50 p-6 rounded-[2rem] border border-rose-100">
                <h4 className="font-bold text-rose-900 mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Clinical Implications
                </h4>
                <p className="text-sm text-rose-800 leading-relaxed font-medium">
                  {selected.clinicalNotes}
                </p>
              </section>
            </div>

            <div className="space-y-6">
              <section>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <AlertCircle className="w-3 h-3" />
                  Common Pathologies
                </h4>
                <div className="space-y-2">
                  {selected.pathologies.map((p, idx) => (
                    <div key={idx} className="p-3 bg-white border border-slate-100 rounded-xl flex items-center gap-3 shadow-sm">
                      <div className="w-2 h-2 rounded-full bg-rose-400" />
                      <span className="text-sm font-bold text-slate-700">{p}</span>
                    </div>
                  ))}
                </div>
              </section>

              <button 
                onClick={() => {
                  setActiveView('handout-maker');
                }}
                className="w-full p-6 bg-slate-50 border border-slate-200 rounded-[2rem] flex items-center justify-between group hover:bg-white hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-rose-600 transition-colors shadow-sm">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-slate-900">Clinician/Patient Handout</div>
                    <div className="text-xs text-slate-500">Generate a simplified version for education.</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-rose-600 transition-all" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {showVideoLibrary && <VideoLibrary onClose={() => setShowVideoLibrary(false)} />}
    </div>
  );

  return (
    <>
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => setIsPatientView(true)}
          className="p-3 bg-white/90 backdrop-blur-sm shadow-lg rounded-full hover:bg-white transition-colors"
          title="Patient View"
        >
          <Eye className="w-6 h-6 text-slate-600" />
        </button>
      </div>
      {isPatientView ? (
        <PatientViewWrapper title="Anatomy Lab" onExit={() => setIsPatientView(false)}>
          {renderContent()}
        </PatientViewWrapper>
      ) : (
        renderContent()
      )}
    </>
  );
}
