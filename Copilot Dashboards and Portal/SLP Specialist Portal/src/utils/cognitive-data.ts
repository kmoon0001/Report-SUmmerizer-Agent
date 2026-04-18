export interface CognitiveTask {
  level: string;
  task: string;
  handout: string;
}

export const COGNITIVE_TASKS_DATA: Record<string, CognitiveTask[]> = {
  Memory: [
    { level: 'Simple', task: 'Spaced Retrieval: Recall room number after 30s, 1m, 2m intervals.', handout: 'Practice recalling the room number at increasing intervals.' },
    { level: 'Moderate', task: 'Recall 3 items (Cup, Key, Book) after 5 minutes of distraction.', handout: 'Practice recalling 3 items after performing a different task.' },
    { level: 'Complex', task: 'Listen to a voicemail message and recall 4 key details (Who, What, When, Number).', handout: 'Listen to a message and write down: Who called, What they want, When to call back, and the Phone number.' },
    { level: 'Functional', task: 'Review a medication list and identify which pills are taken in the morning.', handout: 'Identify morning medications and place them in a pill organizer.' },
    { level: 'Functional', task: 'Manage a weekly calendar: Add 3 appointments and check for conflicts.', handout: 'Practice adding appointments to a calendar and checking for conflicts.' }
  ],
  Attention: [
    { level: 'Simple', task: 'Sustained Attention: Sort deck of cards by color (Red/Black) for 3 minutes.', handout: 'Sort the deck of cards by color for 3 minutes without stopping.' },
    { level: 'Moderate', task: 'Alternating Attention: Switch between sorting coins by value and by year every minute.', handout: 'Sort coins by value for 1 minute, then by year for 1 minute. Repeat.' },
    { level: 'Complex', task: 'Selective Attention: Locate specific items in a busy grocery ad while listening to talk radio.', handout: 'Find 5 specific items in a grocery ad while listening to the radio.' },
    { level: 'Functional', task: 'Calculate total cost of 5 items from a menu while background noise is present.', handout: 'Add up the cost of 5 menu items while the TV is on.' },
    { level: 'Functional', task: 'Follow a multi-step recipe while maintaining conversation with a partner.', handout: 'Practice following a 3-step recipe while talking to someone.' }
  ],
  'Problem Solving': [
    { level: 'Simple', task: 'Sequence 3 steps for making toast.', handout: 'Practice the steps for making toast: 1. Put bread in toaster, 2. Push lever down, 3. Take toast out.' },
    { level: 'Moderate', task: 'Identify safety hazards in a picture of a messy kitchen.', handout: 'Circle 3 safety hazards in the kitchen picture.' },
    { level: 'Complex', task: 'Plan a weekly bus schedule to get to 3 different appointments on time.', handout: 'Create a bus schedule for 3 appointments.' },
    { level: 'Functional', task: 'Organize a pill box for one week based on 3 dummy prescription labels.', handout: 'Organize the pill box for one week using the provided labels.' },
    { level: 'Functional', task: 'Solve a budget problem: Determine if you have enough money for 3 planned purchases.', handout: 'Calculate if your budget covers 3 planned purchases.' }
  ]
};

export function getRandomTask(domain: keyof typeof COGNITIVE_TASKS_DATA): CognitiveTask {
  const tasks = COGNITIVE_TASKS_DATA[domain];
  return tasks[Math.floor(Math.random() * tasks.length)];
}

export function getAllTasks() {
  return Object.entries(COGNITIVE_TASKS_DATA).flatMap(([d, tasks]) => 
    tasks.map(t => ({ ...t, domain: d }))
  );
}
