export type GameType = 'matching' | 'sequencing' | 'naming' | 'roleplay' | 'apraxia' | 'aphasia' | 'cognitive' | 'documentation' | 'puzzle';

export interface GameItem {
  id: string;
  content: string; // Text or Image URL
  type: 'text' | 'image';
  matchId?: string; // For matching games
  order?: number; // For sequencing
}

export interface GameConfig {
  id: string;
  title: string;
  type: GameType;
  items: GameItem[];
  instructions: string;
  persona?: string; // For roleplay
  clinicalGoal?: string; // For roleplay
}

export function getInstructions(type: GameType, persona?: string, clinicalGoal?: string): string {
  switch(type) {
    case 'matching': return "Find the matching pairs.";
    case 'sequencing': return "Drag the items into the correct order.";
    case 'naming': return "Name the item shown.";
    case 'roleplay': return `Chat with the ${persona || 'persona'}. Goal: ${clinicalGoal || 'Practice communication'}`;
    case 'puzzle': return "Arrange the tiles to complete the picture.";
    default: return "";
  }
}

export interface InitialGameState {
  gameState: any;
  chatHistory: { role: 'user' | 'model', text: string, feedback?: string }[] | null;
}

export function getInitialGameState(game: GameConfig): InitialGameState {
  let gameState = {};
  let chatHistory = null;

  if (game.type === 'matching') {
    gameState = {
      shuffledItems: [...game.items].sort(() => Math.random() - 0.5),
      selected: [],
      matched: []
    };
  } else if (game.type === 'sequencing') {
    gameState = {
      shuffledItems: [...game.items].sort(() => Math.random() - 0.5),
      ordered: []
    };
  } else if (game.type === 'roleplay') {
    chatHistory = [{ role: 'model' as const, text: `Hello! I'm your ${game.persona || 'assistant'}. How can I help you today?` }];
  } else if (game.type === 'naming') {
    gameState = {
        shuffledItems: [...game.items].sort(() => Math.random() - 0.5),
    };
  } else if (game.type === 'puzzle') {
    // For puzzle, we take all items. The last item is the "original" one that gets hidden.
    const items = [...game.items];
    const originalTile = items[items.length - 1];
    const puzzleTiles = items.slice(0, -1);
    
    gameState = {
      tiles: [...puzzleTiles].sort(() => Math.random() - 0.5),
      originalTile: originalTile,
      isComplete: false,
      correctOrder: puzzleTiles.map(item => item.id)
    };
  }

  return { gameState, chatHistory };
}
