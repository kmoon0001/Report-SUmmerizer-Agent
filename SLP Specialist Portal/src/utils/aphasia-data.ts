export const VNEST_DATA = {
  'Measure': {
    agents: ['Carpenter', 'Chef', 'Tailor', 'Scientist'],
    patients: ['Wood', 'Flour', 'Fabric', 'Chemicals'],
    locations: ['Workshop', 'Kitchen', 'Studio', 'Lab']
  },
  'Drive': {
    agents: ['Chauffeur', 'Golfer', 'Trucker', 'Commuter'],
    patients: ['Limo', 'Ball', 'Rig', 'Sedan'],
    locations: ['City', 'Course', 'Highway', 'Suburbs']
  },
  'Write': {
    agents: ['Author', 'Student', 'Secretary', 'Journalist'],
    patients: ['Novel', 'Essay', 'Memo', 'Article'],
    locations: ['Office', 'School', 'Desk', 'Press Room']
  },
  'Clean': {
    agents: ['Janitor', 'Dentist', 'Maid', 'Gardener'],
    patients: ['Floor', 'Teeth', 'Room', 'Tools'],
    locations: ['Building', 'Clinic', 'House', 'Shed']
  },
  'Teach': {
    agents: ['Professor', 'Coach', 'Mentor', 'Tutor'],
    patients: ['Lesson', 'Skills', 'Advice', 'Subject'],
    locations: ['University', 'Field', 'Office', 'Library']
  }
};

export const SFA_FEATURES = [
  { id: 'group', label: 'Group', prompt: 'What is it? (Category)' },
  { id: 'use', label: 'Use', prompt: 'What is it used for?' },
  { id: 'action', label: 'Action', prompt: 'What does it do?' },
  { id: 'properties', label: 'Properties', prompt: 'What does it look like? (Color, shape, size)' },
  { id: 'location', label: 'Location', prompt: 'Where do you find it?' },
  { id: 'association', label: 'Association', prompt: 'What does it remind you of?' }
];

export const PACE_SCORING = [
  { score: 5, label: 'Independent', description: 'Message conveyed on first attempt, independently.' },
  { score: 4, label: 'Prompted', description: 'Message conveyed after a general prompt.' },
  { score: 3, label: 'Multiple Attempts', description: 'Message conveyed after multiple attempts or specific cues.' },
  { score: 2, label: 'Partial Success', description: 'Message partially conveyed.' },
  { score: 1, label: 'Minimal Success', description: 'Message not conveyed, but attempt was made.' },
  { score: 0, label: 'No Attempt', description: 'No attempt to convey message.' }
];

export const APHASIA_TYPES = [
  {
    type: 'Broca\'s',
    fluency: 'Non-fluent',
    comprehension: 'Relatively Intact',
    repetition: 'Impaired',
    lesion: 'Posterior inferior frontal lobe (Left)'
  },
  {
    type: 'Wernicke\'s',
    fluency: 'Fluent (Jargon)',
    comprehension: 'Impaired',
    repetition: 'Impaired',
    lesion: 'Posterior superior temporal gyrus (Left)'
  },
  {
    type: 'Global',
    fluency: 'Non-fluent',
    comprehension: 'Impaired',
    repetition: 'Impaired',
    lesion: 'Large perisylvian area'
  },
  {
    type: 'Anomic',
    fluency: 'Fluent',
    comprehension: 'Intact',
    repetition: 'Intact',
    lesion: 'Variable, often temporal-parietal'
  },
  {
    type: 'Conduction',
    fluency: 'Fluent',
    comprehension: 'Intact',
    repetition: 'Severely Impaired',
    lesion: 'Arcuate fasciculus'
  }
];
