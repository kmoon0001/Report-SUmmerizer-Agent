import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PatientViewWrapper } from './layout/PatientViewWrapper';
import { NotificationToast } from './layout/NotificationToast';
import { 
  Gamepad2, 
  Play, 
  Edit3, 
  Type, 
  LayoutGrid, 
  ListOrdered, 
  CheckCircle2,
  RefreshCw,
  Plus,
  Trash2,
  ArrowRight,
  Sparkles,
  Loader2,
  Mic,
  MicOff,
  MessageSquare,
  User,
  Bot,
  Wand2,
  Volume2,
  Clock
} from 'lucide-react';
import { CounterCard } from './CounterCard';
import { cn } from '../lib/utils';
import { aiService } from '../services/ai-service';
import { persistenceService } from '../services/persistence-service';
import { useDashboard } from '../context/DashboardContext';
import { APRAXIA_PHONEMIC_GROUPS } from '../data/apraxia-data';
import { APHASIA_TASKS, COGNITIVE_TASKS } from '../data/aphasia-cognitive-data';
import { DocumentationModule } from './DocumentationModule';
import { 
  getInstructions, 
  getInitialGameState, 
  GameType, 
  GameItem, 
  GameConfig 
} from '../utils/therapy-utils';
import { logger } from '../utils/logger';

const AphasiaModule = () => (
  <div className="p-8 bg-indigo-900 rounded-3xl text-white">
    <h3 className="text-2xl font-black mb-4">Aphasia Treatment</h3>
    <div className="space-y-4">
      <h4 className="font-bold text-indigo-200">VNeST Protocol</h4>
      <p className="text-sm">Select a verb to begin network strengthening.</p>
      {APHASIA_TASKS.vnest.verbs.map((item, i) => (
        <button key={i} className="block w-full p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all font-medium">
          {item.verb}
        </button>
      ))}
    </div>
  </div>
);

const CognitiveModule = () => (
  <div className="p-8 bg-purple-900 rounded-3xl text-white">
    <h3 className="text-2xl font-black mb-4">Cognitive-Communication</h3>
    <div className="space-y-4">
      <h4 className="font-bold text-purple-200">Attention & Memory</h4>
      {COGNITIVE_TASKS.attention.tasks.map((task, i) => (
        <button key={i} className="block w-full p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all font-medium">
          {task}
        </button>
      ))}
    </div>
  </div>
);

const ApraxiaDrill = () => {
  const [selectedGroup, setSelectedGroup] = useState(APRAXIA_PHONEMIC_GROUPS[0]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-black text-slate-900">Apraxia Phonemic Drill</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {APRAXIA_PHONEMIC_GROUPS.map(group => (
          <button
            key={group.id}
            onClick={() => { setSelectedGroup(group); setCurrentWordIndex(0); }}
            className={cn("p-4 rounded-xl border font-bold text-sm", selectedGroup.id === group.id ? "bg-blue-600 text-white" : "bg-white border-slate-200")}
          >
            {group.title}
          </button>
        ))}
      </div>
      <div className="p-12 bg-slate-900 rounded-3xl text-center text-white">
        <div className="text-6xl font-black mb-8">{selectedGroup.words[currentWordIndex]}</div>
        <div className="flex justify-center gap-4">
          <button onClick={() => setCurrentWordIndex(prev => Math.max(0, prev - 1))} className="px-6 py-3 bg-white/10 rounded-xl font-bold">Previous</button>
          <button onClick={() => setCurrentWordIndex(prev => Math.min(selectedGroup.words.length - 1, prev + 1))} className="px-6 py-3 bg-blue-600 rounded-xl font-bold">Next</button>
        </div>
      </div>
    </div>
  );
};

// ... Components ...

// Removed NotificationToast definition

export function TherapyStudio() {
  const [mode, setMode] = useState<'create' | 'play'>('create');
  const [isPatientView, setIsPatientView] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);
  const [activeGame, setActiveGame] = useState<GameConfig | null>(null);
  const { autoSaveAssets, setAutoSaveAssets } = useDashboard();
  
  // Creator State
  const [gameTitle, setGameTitle] = useState('');
  const [gameType, setGameType] = useState<GameType>('matching');
  const [items, setItems] = useState<GameItem[]>([]);
  const [newItemContent, setNewItemContent] = useState('');
  const [newItemType, setNewItemType] = useState<'text' | 'image'>('text');
  const [magicPrompt, setMagicPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingStep, setGeneratingStep] = useState<string>('');
  const [persona, setPersona] = useState('Friendly Barista');
  const [clinicalGoal, setClinicalGoal] = useState('Ordering a coffee with clear speech');

  // Player State
  const [gameState, setGameState] = useState<Record<string, any>>({});
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model', text: string, feedback?: string }[]>([]);
  const [isChatThinking, setIsChatThinking] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  
  const recognitionRef = useRef<any>(null);

  const onEndRef = useRef<() => void>(undefined);
  onEndRef.current = () => {
    setIsListening(false);
    if (activeGame?.type === 'naming' && transcript) {
       checkNamingAnswer(transcript);
    } else if (activeGame?.type === 'roleplay' && transcript) {
       handleRoleplaySend(transcript);
    }
  };

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);
      };

      recognitionRef.current.onend = () => {
        onEndRef.current?.();
      };
    }
  }, []);

  // Reset transient status messages when context changes
  useEffect(() => {
    setNotification(null);
  }, [mode, gameType, magicPrompt, persona, clinicalGoal]);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
  };

  // ... (keep existing useEffect)

  const playTTS = async (text: string) => {
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);
    try {
      const audioData = await aiService.generateTTS(text);
      if (audioData) {
        const audio = new Audio(audioData);
        audio.onended = () => setIsPlayingAudio(false);
        await audio.play();
      } else {
        // Fallback to Web Speech API
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.onend = () => setIsPlayingAudio(false);
          window.speechSynthesis.speak(utterance);
        } else {
          setIsPlayingAudio(false);
          showNotification("Text-to-speech not supported in this browser.", 'error');
        }
      }
    } catch (error) {
      logger.error("TTS Error", error);
      setIsPlayingAudio(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!newItemContent) return;
    setIsGenerating(true);
    setGeneratingStep('Generating image...');
    try {
      const imageUrl = await aiService.generateProImage(newItemContent, '512px');
      if (imageUrl) {
        setNewItemContent(imageUrl);
        setNewItemType('image');
        
        // Auto-save if enabled
        if (autoSaveAssets && imageUrl.startsWith('data:')) {
          await persistenceService.saveGeneratedAsset({
            id: `therapy-${Date.now()}`,
            type: 'image',
            data: imageUrl,
            date: new Date().toISOString(),
            prompt: newItemContent,
            metadata: {
              category: 'Therapy Studio',
              type: 'manual-generation'
            }
          });
          showNotification("Image generated and auto-saved.", 'success');
        } else {
          showNotification("Image generated.", 'success');
        }
      } else {
        showNotification("Failed to generate image.", 'error');
      }
    } catch (error) {
      console.error("Image Gen Error", error);
      showNotification("Error generating image.", 'error');
    } finally {
      setIsGenerating(false);
      setGeneratingStep('');
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const checkNamingAnswer = (spokenText: string) => {
    const target = gameState.shuffledItems?.[0]?.content;
    if (!target) return;
    
    // Simple fuzzy match
    if (spokenText.toLowerCase().includes(target.toLowerCase())) {
        // Correct!
        showNotification(`Correct! You said: "${spokenText}"`, 'success');
        playTTS("Correct!");
        
        // Move to next item logic
        setTimeout(() => {
            setGameState((prev: Record<string, any>) => {
                const newItems = prev.shuffledItems.slice(1);
                if (newItems.length === 0) {
                    showNotification("Activity Complete!", 'success');
                    // Optional: Reset or show completion screen
                    return { ...prev, shuffledItems: [] };
                }
                return { ...prev, shuffledItems: newItems };
            });
            setTranscript('');
        }, 1500);
    } else {
        // Incorrect
        showNotification(`Not quite. You said: "${spokenText}"`, 'info');
    }
  };

  const handleRoleplaySend = async (message: string) => {
    if (!message.trim()) return;
    
    const newHistory = [...chatHistory, { role: 'user' as const, text: message }];
    setChatHistory(newHistory);
    setTranscript('');
    setIsChatThinking(true);

    try {
      const response = await aiService.chatWithPersona(
        activeGame?.persona || 'Friend',
        newHistory,
        message,
        activeGame?.clinicalGoal
      );

      setChatHistory(prev => [...prev, { 
        role: 'model', 
        text: response.text, 
        feedback: response.feedback 
      }]);
    } catch (error) {
      console.error("Chat error", error);
      showNotification("Failed to get response from persona.", 'error');
    } finally {
      setIsChatThinking(false);
    }
  };

  const handleMagicBuild = async () => {
    if (!magicPrompt) return;
    setIsGenerating(true);
    setGeneratingStep('Designing activity structure...');
    
    try {
      const generatedGame = await aiService.generateTherapyActivity(magicPrompt);
      
      // Check for images and generate them if needed
      const imageItems = generatedGame.items.filter((item: GameItem) => item.type === 'image');
      if (imageItems.length > 0) {
        setGeneratingStep(`Generating ${imageItems.length} custom images...`);
        
        // Process images in parallel batches of 3
        const batchSize = 3;
        for (let i = 0; i < imageItems.length; i += batchSize) {
          const batch = imageItems.slice(i, i + batchSize);
          await Promise.all(batch.map(async (item: GameItem) => {
            try {
              let prompt = item.content;
              if (prompt.includes('pollinations.ai')) {
                prompt = prompt.split('/prompt/')[1]?.split('?')[0] || prompt;
                prompt = decodeURIComponent(prompt);
              }
              
              const imageUrl = await aiService.generateProImage(prompt, '512px');
              if (imageUrl) {
                item.content = imageUrl;
                
                // Auto-save if enabled
                if (autoSaveAssets && imageUrl.startsWith('data:')) {
                  await persistenceService.saveGeneratedAsset({
                    id: `therapy-magic-${Date.now()}-${item.id}`,
                    type: 'image',
                    data: imageUrl,
                    date: new Date().toISOString(),
                    prompt: prompt,
                    metadata: {
                      category: 'Therapy Studio',
                      type: 'magic-builder',
                      activityTitle: generatedGame.title
                    }
                  });
                }
              }
            } catch (err) {
              console.error("Failed to generate image for item", item.id, err);
            }
          }));
        }
      }

      setGameTitle(generatedGame.title);
      setGameType(generatedGame.type as GameType);
      setItems(generatedGame.items);
      setMagicPrompt('');
    } catch (error) {
      console.error("Failed to generate game", error);
    } finally {
      setIsGenerating(false);
      setGeneratingStep('');
    }
  };

  const handleMatchingClick = (item: GameItem) => {
    if (gameState.matched?.includes(item.id)) return;
    if (gameState.selected?.find((s: GameItem) => s.id === item.id)) return;

    const newSelected = [...(gameState.selected || []), item];
    
    if (newSelected.length === 2) {
      const [first, second] = newSelected;
      if (first.content === second.content || (first.matchId && first.matchId === second.matchId)) {
        setGameState((prev: Record<string, any>) => ({
          ...prev,
          selected: [],
          matched: [...(prev.matched || []), first.id, second.id]
        }));
        showNotification("Match found!", "success");
        if (gameState.matched?.length + 2 === activeGame?.items.length) {
          showNotification("Activity Complete!", "success");
        }
      } else {
        setGameState((prev: Record<string, any>) => ({ ...prev, selected: newSelected }));
        setTimeout(() => {
          setGameState((prev: Record<string, any>) => ({ ...prev, selected: [] }));
        }, 1000);
      }
    } else {
      setGameState((prev: Record<string, any>) => ({ ...prev, selected: newSelected }));
    }
  };

  const handleSequencingSwap = (idx1: number, idx2: number) => {
    setGameState((prev: Record<string, any>) => {
      const newItems = [...prev.shuffledItems];
      [newItems[idx1], newItems[idx2]] = [newItems[idx2], newItems[idx1]];
      
      // Check if correct
      const isCorrect = newItems.every((item, idx) => item.id === activeGame?.items[idx].id);
      if (isCorrect) {
        showNotification("Perfect Order!", "success");
      }
      
      return { ...prev, shuffledItems: newItems };
    });
  };

  const handlePuzzleClick = (idx: number) => {
    if (gameState.isComplete) return;

    setGameState((prev: Record<string, any>) => {
      const newTiles = [...prev.tiles];
      const selectedIdx = prev.selectedIdx;

      if (selectedIdx === undefined) {
        return { ...prev, selectedIdx: idx };
      }

      // Swap tiles
      [newTiles[idx], newTiles[selectedIdx]] = [newTiles[selectedIdx], newTiles[idx]];
      
      // Check if all tiles are correctly placed
      const allCorrect = newTiles.every((tile, i) => tile.id === activeGame?.items[i].id);
      
      if (allCorrect) {
        showNotification("Puzzle Solved!", "success");
        // Restore the original tile
        return { 
          ...prev, 
          tiles: newTiles, 
          selectedIdx: undefined, 
          isComplete: true 
        };
      }

      return { ...prev, tiles: newTiles, selectedIdx: undefined };
    });
  };

  const handleCreateGame = () => {
    const newGame: GameConfig = {
      id: Date.now().toString(),
      title: gameTitle || 'Untitled Activity',
      type: gameType,
      items: items,
      instructions: getInstructions(gameType, persona, clinicalGoal),
      persona: gameType === 'roleplay' ? persona : undefined,
      clinicalGoal: gameType === 'roleplay' ? clinicalGoal : undefined
    };
    setActiveGame(newGame);
    setMode('play');
    initializeGame(newGame);
  };

  const initializeGame = (game: GameConfig) => {
    const { gameState, chatHistory } = getInitialGameState(game);
    if (gameState) setGameState(gameState);
    if (chatHistory) setChatHistory(chatHistory);
  };

  const addItem = () => {
    if (!newItemContent) return;
    const newItem: GameItem = {
      id: Date.now().toString(),
      content: newItemContent,
      type: newItemType,
      order: items.length + 1
    };
    setItems([...items, newItem]);
    setNewItemContent('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {isPatientView && activeGame && (
        <PatientViewWrapper title={activeGame.title} onExit={() => setIsPatientView(false)}>
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-6xl font-black text-slate-900 mb-8">
              {activeGame.type === 'naming' && gameState.shuffledItems?.[0]?.content}
            </div>
            <button
              onClick={toggleListening}
              className={cn(
                "w-32 h-32 rounded-full flex items-center justify-center shadow-2xl transition-all",
                isListening ? "bg-rose-500 text-white animate-pulse" : "bg-indigo-600 text-white hover:bg-indigo-700"
              )}
            >
              {isListening ? <MicOff className="w-12 h-12" /> : <Mic className="w-12 h-12" />}
            </button>
          </div>
        </PatientViewWrapper>
      )}

      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <CounterCard label="Therapy Minutes" value="1.2k" icon={Clock} color="text-emerald-600" bg="bg-emerald-50" />
          <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Therapy Studio</h2>
            <p className="text-slate-500 font-medium">Build and play interactive cognitive & speech activities.</p>
          </div>
        </div>
        <div className="flex gap-2">
          {mode === 'play' && (
            <button
              onClick={() => setIsPatientView(true)}
              className="px-6 py-3 bg-emerald-100 text-emerald-700 rounded-xl font-bold text-sm hover:bg-emerald-200 transition-all"
            >
              Enter Patient View
            </button>
          )}
          <button
            onClick={() => setMode('create')}
            className={cn(
              "px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2",
              mode === 'create' ? "bg-indigo-600 text-white shadow-lg" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
            )}
          >
            <Edit3 className="w-4 h-4" />
            Builder
          </button>
          <button
            onClick={() => activeGame && setMode('play')}
            disabled={!activeGame}
            className={cn(
              "px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2",
              mode === 'play' ? "bg-emerald-500 text-white shadow-lg" : "bg-slate-50 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
            )}
          >
            <Play className="w-4 h-4" />
            Player
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar / Config */}
        <div className="lg:col-span-1 space-y-6">
          {mode === 'create' ? (
            <div className="space-y-6">
              {/* Auto-Save Toggle */}
              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <span className="text-sm font-bold text-slate-700">Auto-Save Assets</span>
                <button
                  onClick={() => setAutoSaveAssets(!autoSaveAssets)}
                  className={cn(
                    "w-12 h-6 rounded-full transition-colors relative",
                    autoSaveAssets ? "bg-indigo-600" : "bg-slate-200"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 rounded-full bg-white absolute top-1 transition-transform",
                    autoSaveAssets ? "left-7" : "left-1"
                  )} />
                </button>
              </div>

              {/* Magic Builder */}
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-[2rem] shadow-lg text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Sparkles className="w-5 h-5 text-yellow-300" />
                    </div>
                    <div>
                      <h4 className="font-black text-lg tracking-tight">Magic Builder</h4>
                      <p className="text-indigo-100 text-xs font-medium">Describe an activity to auto-generate it.</p>
                    </div>
                  </div>
                  <div className="relative">
                    <textarea
                      value={magicPrompt}
                      onChange={(e) => setMagicPrompt(e.target.value)}
                      placeholder="e.g., Create a matching game for kitchen safety items with images..."
                      className="w-full p-4 pr-12 rounded-xl bg-white/10 border border-white/20 placeholder-indigo-200 text-sm focus:outline-none focus:bg-white/20 transition-all min-h-[80px] text-white resize-none"
                    />
                    <button
                      onClick={handleMagicBuild}
                      disabled={!magicPrompt || isGenerating}
                      className="absolute bottom-3 right-3 p-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center gap-2"
                    >
                      {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                      {isGenerating && <span className="text-xs font-bold">{generatingStep || 'Building...'}</span>}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
                <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Activity Title</label>
                <input
                  value={gameTitle}
                  onChange={(e) => setGameTitle(e.target.value)}
                  placeholder="e.g., Kitchen Safety Sequencing"
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Activity Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'matching', icon: LayoutGrid, label: 'Match' },
                    { id: 'sequencing', icon: ListOrdered, label: 'Order' },
                    { id: 'naming', icon: Type, label: 'Name' },
                    { id: 'roleplay', icon: MessageSquare, label: 'Roleplay' },
                    { id: 'puzzle', icon: Sparkles, label: 'Puzzle' }
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setGameType(type.id as GameType)}
                      className={cn(
                        "flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all",
                        gameType === type.id 
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700" 
                          : "border-slate-100 bg-white text-slate-400 hover:border-slate-200"
                      )}
                    >
                      <type.icon className="w-5 h-5 mb-1" />
                      <span className="text-[10px] font-bold uppercase">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {gameType === 'roleplay' ? (
                <div className="space-y-4 border-t border-slate-100 pt-6">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Persona</label>
                    <input
                      value={persona}
                      onChange={(e) => setPersona(e.target.value)}
                      placeholder="e.g. Grumpy Barista"
                      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Clinical Goal</label>
                    <input
                      value={clinicalGoal}
                      onChange={(e) => setClinicalGoal(e.target.value)}
                      placeholder="e.g. Use polite requests"
                      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm"
                    />
                  </div>
                </div>
              ) : (
                <div className="border-t border-slate-100 pt-6 space-y-4">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Add Content</label>
                  <div className="flex gap-2">
                    <select
                      value={newItemType}
                      onChange={(e) => setNewItemType(e.target.value as 'text' | 'image')}
                      className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold"
                    >
                      <option value="text">Text</option>
                      <option value="image">Image URL</option>
                    </select>
                    <input
                      value={newItemContent}
                      onChange={(e) => setNewItemContent(e.target.value)}
                      placeholder={newItemType === 'text' ? "Enter text..." : "Describe image to generate..."}
                      className="flex-1 p-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none"
                      onKeyDown={(e) => e.key === 'Enter' && addItem()}
                    />
                    {newItemType === 'image' && (
                      <button
                        onClick={handleGenerateImage}
                        disabled={!newItemContent || isGenerating}
                        className="p-2 bg-purple-100 text-purple-600 rounded-xl hover:bg-purple-200 disabled:opacity-50"
                        title="Generate with AI"
                      >
                        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                      </button>
                    )}
                    <button
                      onClick={addItem}
                      className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {Array.isArray(items) && items.map((item, idx) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                            {idx + 1}
                          </div>
                          {item.type === 'image' ? (
                            <img src={item.content} alt="item" className="w-8 h-8 rounded-lg object-cover" />
                          ) : (
                            <span className="text-sm font-medium text-slate-700">{item.content}</span>
                          )}
                        </div>
                        <button
                          onClick={() => setItems(items.filter(i => i.id !== item.id))}
                          className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {items.length === 0 && (
                      <div className="text-center p-8 text-slate-400 text-xs italic border-2 border-dashed border-slate-100 rounded-xl">
                        No items added yet.
                      </div>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={handleCreateGame}
                disabled={items.length === 0 && gameType !== 'roleplay'}
                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                Build & Play
              </button>
            </div>
          </div>
          ) : (
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
              <h3 className="font-black text-slate-900 mb-2">{activeGame?.title}</h3>
              <p className="text-sm text-slate-500 mb-6">{activeGame?.instructions}</p>
              <button
                onClick={() => setMode('create')}
                className="w-full py-3 border-2 border-slate-100 text-slate-500 rounded-xl font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Edit Activity
              </button>
            </div>
          )}
        </div>

        {/* Game Area */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 min-h-[600px] flex flex-col relative overflow-hidden shadow-2xl">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

            {mode === 'play' && activeGame ? (
              <div className="relative z-10 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-8">
                  <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-bold uppercase tracking-widest border border-white/10">
                    {activeGame.type} Mode
                  </div>
                  <button 
                    onClick={() => initializeGame(activeGame)}
                    className="p-2 bg-white/10 rounded-full hover:bg-white/20 text-white transition-colors"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>

                {/* Game Board */}
                <div className="flex-1 flex items-center justify-center w-full">
                  {activeGame.type === 'apraxia' && (
                    <ApraxiaDrill />
                  )}
                  {activeGame.type === 'aphasia' && (
                    <AphasiaModule />
                  )}
                  {activeGame.type === 'cognitive' && (
                    <CognitiveModule />
                  )}
                  {activeGame.type === 'documentation' && (
                    <DocumentationModule />
                  )}
                  
                  {activeGame.type === 'matching' && (
                    <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
                      {Array.isArray(gameState.shuffledItems) && gameState.shuffledItems.map((item: GameItem) => (
                        <motion.button
                          key={item.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={cn(
                            "aspect-square rounded-2xl flex flex-col items-center justify-center p-4 shadow-lg transition-all relative group",
                            gameState.matched?.includes(item.id) 
                              ? "bg-emerald-500 text-white" 
                              : gameState.selected?.find((s: GameItem) => s.id === item.id)
                                ? "bg-indigo-600 text-white"
                                : "bg-white text-slate-800 hover:bg-slate-50"
                          )}
                          onClick={() => handleMatchingClick(item)}
                        >
                          {item.type === 'image' ? (
                            <img 
                              src={item.content} 
                              alt="game item" 
                              className="w-full h-full object-contain rounded-xl" 
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/item-fallback/200/200';
                              }}
                            />
                          ) : (
                            <span className="text-xl font-black">{item.content}</span>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {activeGame.type === 'sequencing' && (
                    <div className="flex flex-col gap-4 w-full max-w-md">
                      {Array.isArray(gameState.shuffledItems) && gameState.shuffledItems.map((item: GameItem, idx: number) => (
                        <motion.div
                          key={item.id}
                          layoutId={item.id}
                          onClick={() => {
                            const selectedIdx = gameState.selectedIdx;
                            if (selectedIdx === undefined) {
                              setGameState((prev: any) => ({ ...prev, selectedIdx: idx }));
                            } else {
                              handleSequencingSwap(selectedIdx, idx);
                              setGameState((prev: any) => ({ ...prev, selectedIdx: undefined }));
                            }
                          }}
                          className={cn(
                            "p-6 rounded-2xl shadow-lg flex items-center gap-4 cursor-pointer transition-all",
                            gameState.selectedIdx === idx ? "bg-indigo-600 text-white scale-105" : "bg-white text-slate-800 hover:bg-slate-50"
                          )}
                        >
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center font-bold",
                            gameState.selectedIdx === idx ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400"
                          )}>
                            {idx + 1}
                          </div>
                          {item.type === 'image' ? (
                            <img 
                              src={item.content} 
                              alt="game item" 
                              className="w-12 h-12 object-cover rounded-lg" 
                            />
                          ) : (
                            <span className="text-lg font-bold">{item.content}</span>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {activeGame.type === 'puzzle' && (
                    <div className="grid grid-cols-3 gap-2 w-full max-w-md aspect-square">
                      {Array.isArray(gameState.tiles) && gameState.tiles.map((tile: GameItem, idx: number) => (
                        <motion.button
                          key={tile.id}
                          layout
                          onClick={() => handlePuzzleClick(idx)}
                          className={cn(
                            "relative aspect-square rounded-xl overflow-hidden border-2 transition-all",
                            gameState.selectedIdx === idx ? "border-yellow-400 scale-95 z-10" : "border-transparent"
                          )}
                        >
                          <img 
                            src={tile.content} 
                            alt="puzzle tile" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors" />
                        </motion.button>
                      ))}
                      {gameState.isComplete && gameState.originalTile && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="aspect-square rounded-xl overflow-hidden border-4 border-emerald-500 shadow-2xl shadow-emerald-500/50"
                        >
                          <img 
                            src={gameState.originalTile.content} 
                            alt="original tile" 
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                      )}
                      {!gameState.isComplete && (
                        <div className="aspect-square bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-700 flex items-center justify-center">
                          <Sparkles className="w-8 h-8 text-slate-600 animate-pulse" />
                        </div>
                      )}
                    </div>
                  )}
                  
                  {activeGame.type === 'naming' && (
                    <div className="text-center space-y-8 w-full max-w-lg">
                      <div className="bg-white p-12 rounded-[3rem] shadow-2xl inline-block w-full relative group">
                        {gameState.shuffledItems?.[0]?.type === 'image' ? (
                          <img 
                            src={gameState.shuffledItems[0].content} 
                            alt="naming target" 
                            className="w-64 h-64 object-contain mx-auto" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/naming-fallback/400/400';
                            }}
                          />
                        ) : (
                          <span className="text-6xl font-black text-slate-900">{gameState.shuffledItems?.[0]?.content}</span>
                        )}
                        <button 
                          onClick={() => {
                            const content = gameState.shuffledItems?.[0]?.content;
                            if (content) playTTS(content); // Read content regardless of type if possible, or just text
                          }}
                          className="absolute top-6 right-6 p-3 bg-slate-100 rounded-full hover:bg-indigo-100 hover:text-indigo-600 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Volume2 className="w-6 h-6" />
                        </button>
                      </div>
                      
                      <div className="flex flex-col items-center gap-4">
                        <button 
                          onClick={toggleListening}
                          className={cn(
                            "w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all",
                            isListening ? "bg-rose-500 text-white animate-pulse" : "bg-indigo-600 text-white hover:bg-indigo-700"
                          )}
                        >
                          {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                        </button>
                        <p className="text-white/60 text-sm font-medium">
                          {isListening ? (transcript || "Listening...") : "Tap mic and say the word"}
                        </p>
                      </div>
                    </div>
                  )}

                  {activeGame.type === 'roleplay' && (
                    <div className="w-full h-full flex flex-col max-w-2xl bg-slate-800/50 rounded-3xl border border-white/10 overflow-hidden">
                      <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {Array.isArray(chatHistory) && chatHistory.map((msg, idx) => (
                          <div key={idx} className={cn("flex gap-4", msg.role === 'user' ? "flex-row-reverse" : "")}>
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                              msg.role === 'user' ? "bg-indigo-500 text-white" : "bg-emerald-500 text-white"
                            )}>
                              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                            </div>
                            <div className="space-y-2 max-w-[80%]">
                              <div className={cn(
                                "p-4 rounded-2xl text-sm leading-relaxed relative group",
                                msg.role === 'user' ? "bg-indigo-600 text-white rounded-tr-none" : "bg-white text-slate-800 rounded-tl-none"
                              )}>
                                {msg.text}
                                {msg.role === 'model' && (
                                  <button 
                                    onClick={() => playTTS(msg.text)}
                                    className="absolute -right-8 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                  >
                                    <Volume2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                              {msg.feedback && (
                                <div className="text-xs text-yellow-300 font-medium bg-yellow-500/10 p-2 rounded-lg border border-yellow-500/20">
                                  💡 {msg.feedback}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        {isChatThinking && (
                          <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                              <Bot className="w-4 h-4" />
                            </div>
                            <div className="bg-white/10 p-4 rounded-2xl rounded-tl-none">
                              <Loader2 className="w-4 h-4 text-white animate-spin" />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4 bg-slate-900 border-t border-white/10 flex gap-2">
                        <input
                          value={transcript}
                          onChange={(e) => setTranscript(e.target.value)}
                          placeholder="Type or speak..."
                          className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 text-white placeholder-white/30 focus:outline-none focus:bg-white/20"
                          onKeyDown={(e) => e.key === 'Enter' && handleRoleplaySend(transcript)}
                        />
                        <button 
                          onClick={toggleListening}
                          className={cn(
                            "p-3 rounded-xl transition-all",
                            isListening ? "bg-rose-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
                          )}
                        >
                          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                        </button>
                        <button 
                          onClick={() => handleRoleplaySend(transcript)}
                          className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                        >
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-white/50">
                <Gamepad2 className="w-24 h-24 mb-6 opacity-20" />
                <h3 className="text-2xl font-bold text-white mb-2">Ready to Create</h3>
                <p className="max-w-xs mx-auto">Use the builder on the left to design your interactive therapy activity.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {notification && (
          <NotificationToast
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
