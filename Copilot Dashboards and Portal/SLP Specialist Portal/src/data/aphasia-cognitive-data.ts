export const APHASIA_TASKS = {
  vnest: {
    title: 'Verb Network Strengthening Treatment (VNeST)',
    verbs: [
      { verb: 'Measure', agents: ['Carpenter', 'Chef', 'Body mechanic'], patients: ['Lumber', 'Sugar', 'Room'] },
      { verb: 'Weigh', agents: ['Nurse', 'Butcher', 'Cashier'], patients: ['Baby', 'Meat', 'Produce'] },
      { verb: 'Cook', agents: ['Chef', 'Parent', 'Student'], patients: ['Dinner', 'Pasta', 'Soup'] },
      { verb: 'Drive', agents: ['Driver', 'Commuter', 'Trucker'], patients: ['Car', 'Truck', 'Bus'] },
      { verb: 'Write', agents: ['Author', 'Student', 'Secretary'], patients: ['Letter', 'Report', 'Email'] }
    ]
  },
  pace: {
    title: 'Promoting Aphasics\' Communicative Effectiveness (PACE)',
    topics: ['Hobbies', 'Family', 'Daily Routine', 'Safety', 'Personal Care', 'Current Events', 'Health', 'Travel', 'Local News', 'Weather']
  }
};

export const COGNITIVE_TASKS = {
  attention: {
    title: 'Attention & Memory',
    tasks: ['N-back task', 'Spaced Retrieval Training', 'Categorization', 'Visual scanning', 'Auditory memory', 'Errorless learning', 'Sustained attention drills', 'Selective attention tasks']
  },
  executive: {
    title: 'Executive Function',
    tasks: ['Problem solving', 'ADL sequencing', 'Planning', 'Budgeting', 'Medication management', 'Goal Management Training', 'Time management', 'Organization']
  }
};
