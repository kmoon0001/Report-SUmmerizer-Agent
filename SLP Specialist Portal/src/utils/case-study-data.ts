export interface CaseStudy {
  id: string;
  title: string;
  topic: 'Dysphagia' | 'Aphasia' | 'Cognition' | 'Voice' | 'Trach/Vent' | 'Head & Neck Cancer' | 'Neurodegenerative';
  scenario: string;
  clinicalQuestion: string;
  keyLearningPoints: string[];
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'cs-1',
    title: 'Wallenberg Syndrome Dysphagia',
    topic: 'Dysphagia',
    scenario: '82yo M, 3 weeks post-lateral medullary stroke. Absent pharyngeal swallow reflex on FEES, severe residue in pyriforms. Currently NPO with PEG.',
    clinicalQuestion: 'What are the most evidence-based strategies for initiating pharyngeal trigger in a patient with Wallenberg syndrome?',
    keyLearningPoints: [
      'Thermal-Tactile Stimulation is often used, though evidence is mixed.',
      'Effortful swallows can increase pharyngeal pressure.',
      'Consider the Mendelsohn maneuver to extend UES opening duration.',
      'Focus on sensory-motor integration tasks.'
    ]
  },
  {
    id: 'cs-2',
    title: 'FTD Executive Function Challenges',
    topic: 'Cognition',
    scenario: '64yo F, recently diagnosed with FTD. High-level executive function deficits impacting medication management and safety at home.',
    clinicalQuestion: 'How can you assess safety awareness in a patient who is resistant to standard cognitive testing?',
    keyLearningPoints: [
      'Use functional, real-world tasks (e.g., medication sorting simulation).',
      'Involve family/caregivers in the assessment process.',
      'Focus on errorless learning techniques for safety-critical tasks.',
      'Prioritize ecological validity over standardized scores.'
    ]
  },
  {
    id: 'cs-3',
    title: 'Non-Fluent Aphasia Treatment',
    topic: 'Aphasia',
    scenario: '70yo M, 6 months post-L MCA CVA. Moderate Broca\'s aphasia, severe word-finding deficits. Patient is highly motivated but frustrated.',
    clinicalQuestion: 'Compare VNeST and SFA for moderate non-fluent aphasia in a SNF setting.',
    keyLearningPoints: [
      'VNeST focuses on verb retrieval and sentence production.',
      'SFA (Semantic Feature Analysis) targets semantic network strengthening.',
      'Both are evidence-based; choice depends on patient-specific deficits.',
      'Consider patient preference and functional goals for carryover.'
    ]
  },
  {
    id: 'cs-4',
    title: 'Parkinson\'s Voice & Swallow',
    topic: 'Voice',
    scenario: '75yo M with 10-year history of PD. Complaints of "quiet voice" and occasional coughing on thin liquids. Family reports he is withdrawing socially.',
    clinicalQuestion: 'How would you structure a dual-focus treatment plan for hypophonia and dysphagia in PD?',
    keyLearningPoints: [
      'LSVT LOUD or SPEAK OUT! can improve both vocal intensity and swallow function (cross-system effect).',
      'Expiratory Muscle Strength Training (EMST) targets both cough strength and swallow safety.',
      'Timing of medication (Levodopa) is critical for therapy sessions.',
      'Cognitive loading may impact dual-task performance during eating.'
    ]
  },
  {
    id: 'cs-5',
    title: 'Trach/Vent Weaning & PMV',
    topic: 'Trach/Vent',
    scenario: '55yo F, s/p respiratory failure, now on trach collar trials. Cuff is deflated. Patient tolerates PMV for 15 mins but desaturates to 88%.',
    clinicalQuestion: 'What are the key troubleshooting steps for a patient desaturating with a Passy-Muir Valve?',
    keyLearningPoints: [
      'Check for upper airway patency (e.g., secretions, stenosis, granulation tissue).',
      'Ensure the patient is not air-trapping (back pressure).',
      'Assess for anxiety/hyperventilation vs. physiological respiratory fatigue.',
      'Coordinate with Respiratory Therapy for downsizing or cuff management.'
    ]
  },
  {
    id: 'cs-6',
    title: 'RHD with Left Neglect & Dysphagia',
    topic: 'Dysphagia',
    scenario: '68yo F, R CVA. Severe left neglect. pockets food in left cheek, impulsive eating rate, poor insight into deficits.',
    clinicalQuestion: 'How do you manage dysphagia safety when cognitive deficits (neglect/impulsivity) are the primary barrier?',
    keyLearningPoints: [
      'Environmental modifications (e.g., red tape on left side, tray positioning).',
      'Verbal and tactile cues for "sweep and swallow".',
      'Spaced Retrieval Training for safe swallow strategies.',
      'Diet modification may be temporary until cognitive awareness improves.'
    ]
  },
  {
    id: 'cs-7',
    title: 'Total Laryngectomy TEP Troubleshooting',
    topic: 'Head & Neck Cancer',
    scenario: '62yo M, 6 months post-total laryngectomy with primary TEP placement. Reports sudden onset of leakage through the prosthesis when drinking thin liquids.',
    clinicalQuestion: 'What is the differential diagnosis for central vs. peripheral leakage in a tracheoesophageal prosthesis?',
    keyLearningPoints: [
      'Central leakage indicates valve failure (e.g., Candida colonization, structural degradation) requiring replacement.',
      'Peripheral leakage suggests tissue changes (e.g., fistula dilation, tumor recurrence, weight loss) requiring resizing or tissue management.',
      'Immediate mitigation includes using a plug to prevent aspiration while awaiting replacement.',
      'Anti-fungal protocols (e.g., Nystatin) can extend prosthesis lifespan.'
    ]
  },
  {
    id: 'cs-8',
    title: 'Advanced ALS Bulbar Onset',
    topic: 'Neurodegenerative',
    scenario: '58yo F with bulbar-onset ALS. Profound dysarthria (AAC dependent) and progressive dysphagia. Currently tolerating purees but experiencing prolonged meal times and weight loss.',
    clinicalQuestion: 'When is the optimal time to discuss proactive PEG placement in ALS, and how does bulbar onset affect this timeline?',
    keyLearningPoints: [
      'Proactive PEG discussion should occur before FVC (Forced Vital Capacity) drops below 50% to minimize surgical risk.',
      'Bulbar-onset patients often require PEG earlier due to rapid decline in swallow safety and efficiency.',
      'Focus shifts from rehabilitation to compensation, energy conservation, and quality of life.',
      'Involve the interdisciplinary team (Dietitian, Pulmonology, Neurology) early.'
    ]
  },
  {
    id: 'cs-9',
    title: 'Post-Extubation Dysphagia in ICU',
    topic: 'Dysphagia',
    scenario: '45yo M, prolonged intubation (14 days) due to ARDS. Extubated 24 hours ago. Coughing on ice chips. Voice is severely hoarse.',
    clinicalQuestion: 'What are the physiological mechanisms of post-extubation dysphagia, and when is instrumental assessment indicated?',
    keyLearningPoints: [
      'Mechanisms include laryngeal trauma, mucosal inflammation, vocal fold immobility, and disuse atrophy.',
      'Silent aspiration is highly prevalent in this population (up to 50%).',
      'Delay instrumental assessment for 24-48 hours post-extubation to allow for spontaneous recovery of acute edema, unless clinically urgent.',
      'Screening protocols (e.g., Yale Swallow Protocol) are critical before initiating PO intake.'
    ]
  }
];
