import React, { useState, useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html, MeshDistortMaterial, Center, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Info, ArrowRight, Activity, BookOpen, Stethoscope, AlertTriangle, Play, X, Droplet, MonitorOff } from 'lucide-react';
import { useAI } from '../context/AIContext';
import { aiService } from '../services/ai-service';
import { isWebGLSupported } from '../lib/webgl-check';
import { WebGLFallback } from './WebGLFallback';

const STROKE_MECHANISMS = {
  ISCHEMIC: {
    id: 'ischemic',
    name: 'Ischemic Stroke',
    icon: <Activity className="w-6 h-6 text-slate-700" />,
    description: 'A clot blocks blood flow to an area of the brain, depriving tissue of oxygen.',
  },
  HEMORRHAGIC: {
    id: 'hemorrhagic',
    name: 'Hemorrhagic Stroke',
    icon: <Droplet className="w-6 h-6 text-rose-500" />,
    description: 'A weakened blood vessel ruptures and bleeds into the surrounding brain tissue, causing pressure and damage.',
  }
};

const STROKE_TERRITORIES = {
  ACA: {
    id: 'aca',
    name: 'ACA Stroke',
    color: '#ff4757',
    presentation: ['Contralateral leg weakness > arm', 'Abulia or flat affect', 'Personality changes'],
    pathologies: ['Transcortical Motor Aphasia', 'Apraxia (limb)', 'Mutism (in severe bilateral cases)'],
  },
  MCA: {
    id: 'mca',
    name: 'MCA Stroke',
    color: '#1e90ff',
    presentation: ['Contralateral face and arm weakness > leg', 'Contralateral sensory loss', 'Visual field deficits'],
    pathologies: ['Broca\'s Aphasia', 'Wernicke\'s Aphasia', 'Global Aphasia', 'Apraxia of Speech'],
  },
  PCA: {
    id: 'pca',
    name: 'PCA Stroke',
    color: '#ffa502',
    presentation: ['Contralateral homonymous hemianopia', 'Cortical blindness', 'Memory deficits'],
    pathologies: ['Alexia without Agraphia', 'Visual Agnosia', 'Prosopagnosia', 'Cognitive-communication deficits'],
  }
};

// Define the anatomical regions (Lobes)
const LOBES = {
  FRONTAL: {
    id: 'frontal',
    name: 'Frontal Lobe',
    color: '#45B7D1', // Bright Cyan
    highlightColor: '#22a6b3',
    position: [0, 0.4, 0.5],
    scale: [0.8, 0.7, 0.7],
    description: 'Executive function, motor control, and Broca\'s area.',
    sequelae: ['Executive dysfunction', 'Contralateral weakness', 'Broca\'s Aphasia'],
  },
  PARIETAL: {
    id: 'parietal',
    name: 'Parietal Lobe',
    color: '#4ECDC4', // Mint Green
    highlightColor: '#10ac84',
    position: [0, 0.6, -0.2],
    scale: [0.8, 0.6, 0.6],
    description: 'Somatosensory processing and spatial integration.',
    sequelae: ['Sensory loss', 'Hemispatial neglect', 'Apraxia'],
  },
  TEMPORAL: {
    id: 'temporal',
    name: 'Temporal Lobe',
    color: '#F9CA24', // Bright Yellow
    highlightColor: '#f0932b',
    position: [0.7, -0.1, 0.1],
    scale: [0.4, 0.5, 0.7],
    description: 'Auditory processing, memory, and Wernicke\'s area.',
    sequelae: ['Wernicke\'s Aphasia', 'Memory impairment', 'Auditory agnosia'],
  },
  OCCIPITAL: {
    id: 'occipital',
    name: 'Occipital Lobe',
    color: '#FF6B6B', // Coral Red
    highlightColor: '#eb4d4b',
    position: [0, 0.1, -0.7],
    scale: [0.7, 0.6, 0.5],
    description: 'Primary visual processing center.',
    sequelae: ['Visual field cuts', 'Cortical blindness', 'Visual agnosia'],
  },
  CEREBELLUM: {
    id: 'cerebellum',
    name: 'Cerebellum',
    color: '#9B59B6', // Purple
    highlightColor: '#be2edd',
    position: [0, -0.6, -0.6],
    scale: [0.7, 0.3, 0.4],
    description: 'Motor coordination and balance.',
    sequelae: ['Ataxia', 'Dysmetria', 'Ataxic Dysarthria'],
  },
  BRAINSTEM: {
    id: 'brainstem',
    name: 'Brainstem',
    color: '#A5B1C2', // Light Gray
    highlightColor: '#4b6584',
    position: [0, -0.8, -0.1],
    scale: [0.2, 0.6, 0.2],
    description: 'Autonomic functions and cranial nerve nuclei.',
    sequelae: ['Dysphagia', 'Dysarthria', 'Cranial nerve palsies'],
  }
};

const ARTERIES = {
  ACA: {
    id: 'aca',
    name: 'Anterior Cerebral Artery (ACA)',
    color: '#ff4757', // Bright Red
    path: [
      new THREE.Vector3(0.05, -0.2, 0.2),
      new THREE.Vector3(0.1, 0.3, 0.5),
      new THREE.Vector3(0.1, 0.7, 0.2),
      new THREE.Vector3(0.05, 0.6, -0.3),
    ],
    description: 'Supplies the medial surface of the frontal and parietal lobes.',
  },
  MCA: {
    id: 'mca',
    name: 'Middle Cerebral Artery (MCA)',
    color: '#1e90ff', // Bright Blue
    path: [
      new THREE.Vector3(0.1, -0.2, 0.1),
      new THREE.Vector3(0.5, 0, 0.3),
      new THREE.Vector3(0.9, 0.2, 0.2),
      new THREE.Vector3(0.8, 0.5, -0.2),
    ],
    description: 'Supplies the lateral surface of the hemispheres (Language/Motor).',
  },
  PCA: {
    id: 'pca',
    name: 'Posterior Cerebral Artery (PCA)',
    color: '#ffa502', // Bright Orange
    path: [
      new THREE.Vector3(0.1, -0.2, -0.1),
      new THREE.Vector3(0.3, -0.1, -0.5),
      new THREE.Vector3(0.5, 0.1, -0.8),
    ],
    description: 'Supplies the occipital lobe and inferior temporal lobe.',
  }
};

interface ArteryData {
  id: string;
  name: string;
  color: string;
  path: THREE.Vector3[];
  description: string;
}

interface LobeData {
  id: string;
  name: string;
  color: string;
  highlightColor: string;
  position: number[];
  scale: number[];
  description: string;
  sequelae: string[];
}

const ArteryLine = ({ data, isSelected, onClick }: { data: ArteryData, isSelected: boolean, onClick: (data: ArteryData) => void }) => {
  const curve = new THREE.CatmullRomCurve3(data.path);
  const active = isSelected;
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current && active) {
      const t = state.clock.getElapsedTime();
      groupRef.current.scale.setScalar(1 + Math.sin(t * 10) * 0.05);
    } else if (groupRef.current) {
      groupRef.current.scale.setScalar(1);
    }
  });

  const radius = active ? 0.07 : 0.04;
  const outlineRadius = radius + 0.015;

  return (
    <group ref={groupRef} onClick={(e) => { e.stopPropagation(); onClick(data); }}>
      {/* Left Side Artery */}
      <group scale={[-1, 1, 1]}>
        {/* Outline */}
        <mesh>
          <tubeGeometry args={[curve, 32, outlineRadius, 8, false]} />
          <meshBasicMaterial color="#0f172a" side={THREE.BackSide} />
        </mesh>
        {/* Inner Artery */}
        <mesh>
          <tubeGeometry args={[curve, 32, radius, 8, false]} />
          <meshToonMaterial color={active ? '#ffffff' : data.color} />
        </mesh>
      </group>
      
      {/* Right Side Artery */}
      <group>
        {/* Outline */}
        <mesh>
          <tubeGeometry args={[curve, 32, outlineRadius, 8, false]} />
          <meshBasicMaterial color="#0f172a" side={THREE.BackSide} />
        </mesh>
        {/* Inner Artery */}
        <mesh>
          <tubeGeometry args={[curve, 32, radius, 8, false]} />
          <meshToonMaterial color={active ? '#ffffff' : data.color} />
        </mesh>
      </group>

      {active && (
        <Html position={[data.path[2].x, data.path[2].y + 0.3, data.path[2].z]} center zIndexRange={[100, 0]}>
          <div className="bg-white border-4 border-slate-900 px-3 py-1 rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)] text-[12px] font-black uppercase tracking-tighter text-slate-900 pointer-events-none whitespace-nowrap transform rotate-2">
            {data.name}
          </div>
        </Html>
      )}
    </group>
  );
};

const LobeRegion = ({ data, isSelected, isHovered, onClick, onHover, onUnhover }: { data: LobeData, isSelected: boolean, isHovered: boolean, onClick: (data: LobeData) => void, onHover: (data: LobeData) => void, onUnhover: () => void }) => {
  const groupRef = useRef<THREE.Group>(null);
  const active = isSelected || isHovered;

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      // Cartoony bouncy animation
      groupRef.current.position.y = Math.sin(t * 3 + data.position[0] * 5) * 0.05;
      const pulse = active ? 1.1 + Math.sin(t * 8) * 0.02 : 1;
      groupRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Left Hemisphere Lobe */}
      <mesh 
        position={[-(data.position[0] || 0.25), data.position[1], data.position[2]]}
        scale={data.scale as [number, number, number]}
        onClick={(e) => { e.stopPropagation(); onClick(data); }}
        onPointerOver={(e) => { e.stopPropagation(); onHover(data); }}
        onPointerOut={(e) => { e.stopPropagation(); onUnhover(); }}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshToonMaterial 
          color={active ? data.highlightColor : data.color} 
          transparent={true}
          opacity={0.65}
        />
      </mesh>
      {/* Right Hemisphere Lobe */}
      <mesh 
        position={[data.position[0] || 0.25, data.position[1], data.position[2]]}
        scale={data.scale as [number, number, number]}
        onClick={(e) => { e.stopPropagation(); onClick(data); }}
        onPointerOver={(e) => { e.stopPropagation(); onHover(data); }}
        onPointerOut={(e) => { e.stopPropagation(); onUnhover(); }}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshToonMaterial 
          color={active ? data.highlightColor : data.color} 
          transparent={true}
          opacity={0.65}
        />
      </mesh>
      
      {/* Label */}
      {active && (
        <Html position={[0, data.position[1] + 0.6, data.position[2]]} center zIndexRange={[100, 0]}>
          <div className="bg-white border-4 border-slate-900 px-3 py-1 rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)] text-[12px] font-black uppercase tracking-tighter text-slate-900 pointer-events-none whitespace-nowrap transform -rotate-2">
            {data.name}
          </div>
        </Html>
      )}
    </group>
  );
};

const StrokeEffect = ({ mechanism, territory }: { mechanism: 'ischemic' | 'hemorrhagic' | null, territory: 'aca' | 'mca' | 'pca' | null }) => {
  const groupRef = useRef<THREE.Group>(null);
  const clotRef = useRef<THREE.Mesh>(null);
  const bleedRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    if (mechanism === 'ischemic' && clotRef.current) {
      // Clot pulses slightly
      clotRef.current.scale.setScalar(1 + Math.sin(t * 5) * 0.1);
    }
    
    if (mechanism === 'hemorrhagic' && bleedRef.current) {
      // Bleed expands and pulses
      const expand = Math.min(1.5, t * 0.5); // Grow over time
      bleedRef.current.scale.setScalar(expand + Math.sin(t * 8) * 0.1);
    }
  });

  if (!mechanism || !territory) return null;

  let position = new THREE.Vector3(0, 0, 0);
  if (territory === 'aca') position.set(0.1, 0.5, 0.4);
  if (territory === 'mca') position.set(-0.5, 0.1, 0.2); // Left MCA
  if (territory === 'pca') position.set(0.3, -0.1, -0.6);

  return (
    <group ref={groupRef} position={position}>
      {mechanism === 'ischemic' && (
        <mesh ref={clotRef}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} metalness={0.1} />
          <Html position={[0, 0.2, 0]} center zIndexRange={[100, 0]}>
            <div className="bg-slate-900 text-white px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap animate-pulse">
              Clot (Ischemia)
            </div>
          </Html>
        </mesh>
      )}

      {mechanism === 'hemorrhagic' && (
        <mesh ref={bleedRef}>
          <sphereGeometry args={[0.15, 32, 32]} />
          <MeshDistortMaterial color="#ef4444" distort={0.6} speed={3} roughness={0.2} metalness={0.8} />
          <Html position={[0, 0.3, 0]} center zIndexRange={[100, 0]}>
            <div className="bg-rose-600 text-white px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap animate-pulse">
              Hemorrhage (Bleed)
            </div>
          </Html>
        </mesh>
      )}
    </group>
  );
};

export const BrainAnatomyExplorer: React.FC<{ onNavigate?: (view: string) => void }> = ({ onNavigate }) => {
  const [selectedItem, setSelectedItem] = useState<ArteryData | LobeData | null>(null);
  const [hoveredItem, setHoveredItem] = useState<ArteryData | LobeData | null>(null);
  const [aiInsight, setAiInsight] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showStrokeModal, setShowStrokeModal] = useState(false);
  const [activeStrokeMechanism, setActiveStrokeMechanism] = useState<'ischemic' | 'hemorrhagic' | null>(null);
  const [activeStrokeTerritory, setActiveStrokeTerritory] = useState<'aca' | 'mca' | 'pca' | null>(null);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    setWebglSupported(isWebGLSupported());
  }, []);

  const handleGenerateInsight = async (item: ArteryData | LobeData) => {
    setIsGenerating(true);
    try {
      const prompt = `Provide a concise, expert-level clinical insight for a Speech-Language Pathologist regarding ${item.name}. Focus on assessment and treatment considerations. Keep it under 3 sentences.`;
      const response = await aiService.generateContent(prompt, {
        systemInstruction: "You are an expert neurogenic SLP mentor.",
        temperature: 0.3
      });
      setAiInsight(response);
    } catch (error) {
      console.error("Failed to generate insight", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const activeData = selectedItem || hoveredItem;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Brain className="w-8 h-8 text-indigo-600" />
            Interactive Neuroanatomy Explorer
          </h2>
          <p className="text-slate-500 font-medium max-w-2xl mt-2">
            Explore the lobes and vascular territories of the brain. Click on regions or arteries to view clinical details.
          </p>
        </div>
        <button
          onClick={() => setShowStrokeModal(true)}
          className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-rose-500/20"
        >
          <Play className="w-4 h-4" />
          Simulate Stroke
        </button>
      </div>

      {/* Stroke Simulator Modal */}
      <AnimatePresence>
        {showStrokeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Stroke Simulator</h3>
                  <p className="text-slate-500 text-sm font-medium mt-1">Select a stroke type to visualize its mechanism and SLP impacts.</p>
                </div>
                <button 
                  onClick={() => { setShowStrokeModal(false); setActiveStrokeMechanism(null); setActiveStrokeTerritory(null); }}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-slate-500" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-8">
                {/* Mechanism Selection */}
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">1. Select Stroke Mechanism</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.values(STROKE_MECHANISMS).map((mech) => (
                      <div 
                        key={mech.id}
                        onClick={() => setActiveStrokeMechanism(mech.id as any)}
                        className={`cursor-pointer rounded-2xl border-2 transition-all p-4 flex items-start gap-4 ${
                          activeStrokeMechanism === mech.id 
                            ? 'border-indigo-500 bg-indigo-50/50 shadow-md' 
                            : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`p-3 rounded-xl shrink-0 ${mech.id === 'ischemic' ? 'bg-slate-200' : 'bg-rose-100'}`}>
                          {mech.icon}
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-slate-900">{mech.name}</h4>
                          <p className="text-slate-600 text-sm leading-relaxed mt-1">{mech.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Territory Selection */}
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">2. Select Vascular Territory</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.values(STROKE_TERRITORIES).map((terr) => (
                      <div 
                        key={terr.id}
                        onClick={() => setActiveStrokeTerritory(terr.id as any)}
                        className={`cursor-pointer rounded-2xl border-2 transition-all p-4 ${
                          activeStrokeTerritory === terr.id 
                            ? 'border-indigo-500 bg-indigo-50/50 shadow-md' 
                            : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <h4 className="text-lg font-black text-slate-900 mb-2" style={{ color: activeStrokeTerritory === terr.id ? terr.color : '' }}>{terr.name}</h4>
                        
                        <div className="space-y-4">
                          <div>
                            <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Clinical Presentation</h5>
                            <ul className="space-y-1">
                              {terr.presentation.map((item, i) => (
                                <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                                  <div className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h5 className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 mb-1.5">SLP Pathologies</h5>
                            <ul className="space-y-1">
                              {terr.pathologies.map((item, i) => (
                                <li key={i} className="text-xs text-indigo-900 font-medium flex items-start gap-1.5">
                                  <div className="w-1 h-1 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
                <button
                  onClick={() => setShowStrokeModal(false)}
                  disabled={!activeStrokeMechanism || !activeStrokeTerritory}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  View 3D Animation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[650px]">
        {/* 3D Canvas Area */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl overflow-hidden relative shadow-2xl border border-slate-800 h-full w-full">
          {!webglSupported ? (
            <WebGLFallback />
          ) : (
            <>
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-3 text-white/80 text-xs flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Drag to Rotate | Scroll to Zoom
                </div>
                <div className="flex gap-2">
                  <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg px-2 py-1 text-[10px] text-emerald-400 font-bold uppercase">Lobes</div>
                  <div className="bg-rose-500/20 border border-rose-500/30 rounded-lg px-2 py-1 text-[10px] text-rose-400 font-bold uppercase">Arteries</div>
                </div>
              </div>
              
              <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <Suspense fallback={null}>
                  <ambientLight intensity={0.6} />
                  <directionalLight position={[10, 10, 10]} intensity={1.5} />
                  <directionalLight position={[-10, -10, -10]} intensity={0.5} />
                  <Environment preset="night" />
                  
                  <Center>
                    <group>
                      {/* Render Lobes */}
                      {Object.values(LOBES).map((lobe) => (
                        <LobeRegion 
                          key={lobe.id} 
                          data={lobe} 
                          isSelected={selectedItem?.id === lobe.id}
                          isHovered={hoveredItem?.id === lobe.id}
                          onClick={(data: LobeData) => { setSelectedItem(data); setAiInsight(''); }}
                          onHover={setHoveredItem}
                          onUnhover={() => setHoveredItem(null)}
                        />
                      ))}
                      
                      {/* Render Arteries */}
                      {Object.values(ARTERIES).map((artery) => (
                        <ArteryLine 
                          key={artery.id} 
                          data={artery} 
                          isSelected={selectedItem?.id === artery.id}
                          onClick={(data: ArteryData) => { setSelectedItem(data); setAiInsight(''); }}
                        />
                      ))}

                      {/* Stroke Animation Effect */}
                      <StrokeEffect mechanism={activeStrokeMechanism} territory={activeStrokeTerritory} />
                    </group>
                  </Center>
                  
                  <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
                  <OrbitControls enablePan={false} minDistance={3} maxDistance={10} />
                </Suspense>
              </Canvas>
            </>
          )}
        </div>

        {/* Information Panel */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeData ? (
              <motion.div 
                key={activeData.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <div 
                    className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 text-white"
                    style={{ backgroundColor: activeData.color }}
                  >
                    {'path' in activeData ? 'Vascular Territory' : 'Anatomical Lobe'}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 leading-tight">
                    {activeData.name}
                  </h3>
                  <p className="text-slate-600 mt-2 text-sm leading-relaxed">
                    {activeData.description}
                  </p>
                </div>

                {'sequelae' in activeData && activeData.sequelae && (
                  <div className="space-y-4">
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-3 text-sm">
                        <AlertTriangle className="w-4 h-4 text-rose-500" />
                        Clinical Implications
                      </h4>
                      <ul className="space-y-2">
                        {activeData.sequelae.map((item: string, i: number) => (
                          <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleGenerateInsight(activeData)}
                    disabled={isGenerating}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl text-sm font-bold transition-all active:scale-95 disabled:opacity-70"
                  >
                    {isGenerating ? <Activity className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                    {isGenerating ? 'Analyzing...' : 'Get Clinical Pearl'}
                  </button>
                  
                  {aiInsight && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-sm text-indigo-900 italic"
                    >
                      "{aiInsight}"
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-slate-400">
                <Brain className="w-12 h-12 opacity-20" />
                <p className="text-sm font-medium">Select a region or artery to begin analysis</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
