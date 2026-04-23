export interface ClinicalQuestion {
  id: string;
  category: 'Dysphagia' | 'Aphasia' | 'Cognition' | 'Voice' | 'Motor Speech';
  question: string;
  answer: string;
  source: string;
}

export const CLINICAL_QUESTIONS: ClinicalQuestion[] = [
  {
    id: 'q1',
    category: 'Dysphagia',
    question: 'What is the "3-ounce water swallow test" sensitivity for predicting aspiration?',
    answer: 'The Yale Swallow Protocol (3oz water test) has a sensitivity of ~96.5% for identifying aspiration risk when failed, making it an excellent screening tool.',
    source: 'Suiter & Leder (2008)'
  },
  {
    id: 'q2',
    category: 'Aphasia',
    question: 'Does Semantic Feature Analysis (SFA) generalize to untreated words?',
    answer: 'Evidence suggests SFA improves retrieval of treated words, but generalization to untreated items is variable and often limited. It is best used to strengthen semantic networks.',
    source: 'Boyle (2010)'
  },
  {
    id: 'q3',
    category: 'Cognition',
    question: 'What is the primary cognitive deficit in Right Hemisphere Damage (RHD)?',
    answer: 'RHD often manifests as deficits in attention (neglect), anosognosia (lack of awareness), and pragmatic communication (prosody, inference), rather than pure linguistic deficits.',
    source: 'ASHA Practice Portal'
  },
  {
    id: 'q4',
    category: 'Voice',
    question: 'What is the physiological target of LSVT LOUD?',
    answer: 'LSVT LOUD targets increased vocal loudness through increased respiratory effort and vocal fold adduction, which can "recalibrate" sensorimotor perception of loudness.',
    source: 'Ramig et al.'
  },
  {
    id: 'q5',
    category: 'Dysphagia',
    question: 'Is the "chin tuck" maneuver effective for all patients with aspiration?',
    answer: 'No. While it widens the valleculae and narrows the airway entrance, it can actually INCREASE aspiration risk in patients with significant pharyngeal residue or delayed trigger if not verified instrumentally.',
    source: 'Logemann (1993)'
  },
  {
    id: 'q6',
    category: 'Motor Speech',
    question: 'Differentiation between Apraxia of Speech (AOS) and Dysarthria?',
    answer: 'AOS is a motor PLANNING deficit (inconsistent errors, groping, islands of clear speech), while Dysarthria is a motor EXECUTION deficit (consistent errors, muscle weakness/spasticity).',
    source: 'Duffy (2013)'
  },
  {
    id: 'q7',
    category: 'Cognition',
    question: 'What is Spaced Retrieval Training (SRT) best used for?',
    answer: 'SRT is an errorless learning technique effective for teaching specific facts or procedures (e.g., "call for help," "lock wheelchair") to patients with memory impairments like dementia.',
    source: 'Camp (1989)'
  },
  {
    id: 'q8',
    category: 'Dysphagia',
    question: 'Does thickening liquids prevent pneumonia?',
    answer: 'Not necessarily. The Frazier Water Protocol suggests that aspiration of water is generally benign in patients with clean oral hygiene. Thickened liquids can increase risk of dehydration and UTI.',
    source: 'Robbins et al. (2008)'
  }
];
