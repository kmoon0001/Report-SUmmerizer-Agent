export interface TreatmentActivity {
  id: string;
  title: string;
  category: 'Dysphagia' | 'Aphasia' | 'Cognition' | 'Voice' | 'AAC' | 'Pediatric';
  description: string;
  goals: string[];
  materials: string[];
  instructions: string[];
  image?: string;
  color: string;
}

export const TREATMENT_ACTIVITIES: TreatmentActivity[] = [
  {
    id: '1',
    title: 'Semantic Feature Analysis',
    category: 'Aphasia',
    description: 'A therapy technique used to improve naming abilities by focusing on the semantic features of a target word.',
    goals: [
      'Improve word retrieval for common nouns',
      'Increase use of circumlocution strategies',
      'Strengthen semantic networks'
    ],
    materials: [
      'SFA Chart (Group, Use, Action, Properties, Location, Association)',
      'Picture cards of common objects',
      'Whiteboard or paper'
    ],
    instructions: [
      'Place a picture of a target object in the center of the SFA chart.',
      'Ask the patient to name the object. If they cannot, proceed to features.',
      'Guide the patient through each semantic feature (e.g., "What do you use it for?", "Where do you find it?").',
      'Have the patient try to name the object again after identifying all features.',
      'Review the features and the name together.'
    ],
    color: 'bg-blue-500'
  },
  {
    id: '2',
    title: 'Effortful Swallow',
    category: 'Dysphagia',
    description: 'A compensatory strategy designed to increase posterior motion of the tongue base and improve bolus clearance from the pharynx.',
    goals: [
      'Reduce pharyngeal residue after the swallow',
      'Increase tongue base retraction force',
      'Improve overall swallow safety'
    ],
    materials: [
      'Cup of water or appropriate food consistency',
      'Mirror (optional for visual feedback)'
    ],
    instructions: [
      'Ask the patient to take a sip of water or a bite of food.',
      'Instruct the patient to "swallow as hard as you can, like you are trying to swallow a whole grape."',
      'Encourage the patient to squeeze all of their throat muscles during the swallow.',
      'Provide verbal feedback on the effort observed.',
      'Repeat for a specified number of trials.'
    ],
    color: 'bg-emerald-500'
  },
  {
    id: '3',
    title: 'Spaced Retrieval Training',
    category: 'Cognition',
    description: 'An evidence-based memory intervention that involves recalling information at increasingly longer intervals.',
    goals: [
      'Improve recall of functional information (e.g., room number, therapist name)',
      'Increase independence with daily routines',
      'Reduce anxiety related to memory loss'
    ],
    materials: [
      'Timer or stopwatch',
      'Information to be remembered (written or verbal)'
    ],
    instructions: [
      'Identify a specific piece of functional information the patient needs to remember.',
      'Ask the patient the target question and provide the answer immediately.',
      'Ask the question again. If they answer correctly, wait 15 seconds and ask again.',
      'If correct, double the interval (30s, 1m, 2m, 4m, etc.).',
      'If incorrect, provide the answer and revert to the last successful interval.'
    ],
    color: 'bg-purple-500'
  },
  {
    id: '4',
    title: 'LSVT LOUD (Simplified)',
    category: 'Voice',
    description: 'A treatment program focused on increasing vocal loudness in patients with Parkinson\'s disease and other neurological conditions.',
    goals: [
      'Increase vocal intensity (loudness)',
      'Improve speech intelligibility',
      'Increase sensory awareness of vocal effort'
    ],
    materials: [
      'Sound level meter (or app)',
      'Water for hydration',
      'Reading material'
    ],
    instructions: [
      'Instruct the patient to take a deep breath and say "ah" as loudly and clearly as possible for as long as they can.',
      'Encourage "High Effort" and "Think Loud."',
      'Practice high and low pitch glides while maintaining loudness.',
      'Transition to functional phrases and sentences using the same loud voice.',
      'Provide visual feedback using the sound level meter.'
    ],
    color: 'bg-orange-500'
  },
  {
    id: '5',
    title: 'AAC Modeling (Aided Language Stimulation)',
    category: 'AAC',
    description: 'A strategy where the communication partner points to symbols on the AAC system while speaking to the user.',
    goals: [
      'Increase user\'s understanding of symbol meanings',
      'Demonstrate how the AAC system can be used for various functions',
      'Encourage spontaneous use of the AAC device'
    ],
    materials: [
      'User\'s AAC system (low-tech or high-tech)',
      'Engaging activity (e.g., bubbles, blocks, snack)'
    ],
    instructions: [
      'Identify 2-3 core words to target during the activity (e.g., "more", "go", "stop").',
      'While speaking, point to the corresponding symbols on the user\'s device.',
      'Keep your verbal output slightly above the user\'s current level.',
      'Model without requiring the user to respond or imitate immediately.',
      'Provide multiple opportunities for the user to see the words modeled in context.'
    ],
    color: 'bg-rose-500'
  },
  {
    id: '6',
    title: 'Barrier Games',
    category: 'Pediatric',
    description: 'Interactive games where two players are separated by a barrier and must communicate clearly to achieve a matching result.',
    goals: [
      'Improve expressive language and descriptive skills',
      'Enhance listening comprehension and following directions',
      'Develop perspective-taking and repair strategies'
    ],
    materials: [
      'Physical barrier (e.g., large folder, box)',
      'Two identical sets of materials (e.g., Lego sets, coloring pages, stickers)'
    ],
    instructions: [
      'Set up the barrier between the therapist and the child.',
      'The "Director" creates a scene or structure and gives verbal instructions to the "Matcher."',
      'The Matcher follows the instructions without looking at the Director\'s side.',
      'Encourage the Matcher to ask clarifying questions if the instructions are unclear.',
      'Remove the barrier at the end to compare results and discuss any differences.'
    ],
    color: 'bg-amber-500'
  }
];
