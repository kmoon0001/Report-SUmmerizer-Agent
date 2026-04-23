export interface CodeItem {
  code: string;
  desc: string;
  category: string;
  notes?: string;
  tooltip?: string;
}

export const CPT_CODES: CodeItem[] = [
  // Evaluation
  { code: '92521', desc: 'Evaluation of speech fluency (e.g., stuttering, cluttering)', category: 'Evaluation', notes: 'Includes history, measurement of severity, and analysis of fluency patterns.' },
  { code: '92522', desc: 'Evaluation of speech sound production (e.g., articulation, phonological process, apraxia, dysarthria)', category: 'Evaluation', notes: 'Assessment of speech sound production.' },
  { code: '92523', desc: 'Evaluation of speech sound production; with evaluation of language comprehension and expression', category: 'Evaluation', notes: 'Comprehensive evaluation of both speech and language.' },
  { code: '92524', desc: 'Behavioral and qualitative analysis of voice and resonance', category: 'Evaluation', notes: 'Assessment of vocal quality, pitch, loudness, and resonance.' },
  { code: '92610', desc: 'Evaluation of oral and pharyngeal swallowing function', category: 'Evaluation', notes: 'Clinical bedside swallow exam (CSE).' },
  { code: '92611', desc: 'Motion fluoroscopic evaluation of swallowing function by cine or video recording', category: 'Evaluation', notes: 'Modified Barium Swallow Study (MBSS).' },
  { code: '92612', desc: 'Flexible fiberoptic endoscopic evaluation of swallowing by cine or video recording', category: 'Evaluation', notes: 'FEES procedure.' },
  
  // Treatment
  { code: '92507', desc: 'Treatment of speech, language, voice, communication, and/or auditory processing disorder', category: 'Treatment', notes: 'Individual treatment session.' },
  { code: '92508', desc: 'Treatment of speech, language, voice, communication, and/or auditory processing disorder; group, 2 or more individuals', category: 'Treatment', notes: 'Group therapy session.' },
  { code: '92526', desc: 'Treatment of swallowing dysfunction and/or oral function for feeding', category: 'Treatment', notes: 'Dysphagia therapy.' },
  { code: '92607', desc: 'Evaluation for prescription for speech-generating augmentative and alternative communication device, face-to-face with the patient; first hour', category: 'AAC', notes: 'AAC Evaluation (1st hour).' },
  { code: '92608', desc: 'Evaluation for prescription for speech-generating augmentative and alternative communication device, face-to-face with the patient; each additional 30 minutes', category: 'AAC', notes: 'AAC Evaluation (add-on).' },
  { code: '92609', desc: 'Therapeutic services for the use of speech-generating device, including programming and modification', category: 'AAC', notes: 'AAC Treatment/Programming.' },
  { code: '97129', desc: 'Therapeutic interventions that focus on cognitive function (e.g., attention, memory, reasoning, executive function, problem solving, and/or pragmatic functioning) and compensatory strategies to manage the performance of an activity (direct (one-on-one) patient contact); initial 15 minutes', category: 'Cognition', notes: 'Cognitive therapy (1st 15 mins).' },
  { code: '97130', desc: 'Therapeutic interventions that focus on cognitive function...; each additional 15 minutes', category: 'Cognition', notes: 'Cognitive therapy (add-on).' },
];

export const ICD10_CODES: CodeItem[] = [
  // Dysphagia
  { code: 'R13.10', desc: 'Dysphagia, unspecified', category: 'Dysphagia', notes: 'Difficulty swallowing, unspecified phase.' },
  { code: 'R13.11', desc: 'Dysphagia, oral phase', category: 'Dysphagia', notes: 'Difficulty in the oral preparatory or oral transit phase.' },
  { code: 'R13.12', desc: 'Dysphagia, oropharyngeal phase', category: 'Dysphagia', notes: 'Difficulty transferring bolus from mouth to pharynx.' },
  { code: 'R13.13', desc: 'Dysphagia, pharyngeal phase', category: 'Dysphagia', notes: 'Difficulty in the pharyngeal phase (e.g., aspiration risk).' },
  { code: 'R13.14', desc: 'Dysphagia, pharyngoesophageal phase', category: 'Dysphagia', notes: 'Difficulty at the UES or esophageal inlet.' },
  { code: 'R13.19', desc: 'Other dysphagia', category: 'Dysphagia', notes: 'Specific dysphagia not otherwise classified.' },
  
  // Speech & Language
  { code: 'R47.01', desc: 'Aphasia', category: 'Language', notes: 'Acquired language disorder (expressive, receptive, global).' },
  { code: 'I69.320', desc: 'Aphasia following cerebral infarction', category: 'Language', notes: 'Aphasia due to stroke.' },
  { code: 'R47.1', desc: 'Dysarthria and anarthria', category: 'Speech', notes: 'Motor speech disorder.' },
  { code: 'I69.322', desc: 'Dysarthria following cerebral infarction', category: 'Speech', notes: 'Dysarthria due to stroke.' },
  { code: 'R47.81', desc: 'Slurred speech', category: 'Speech', notes: 'Often used for acute onset before formal diagnosis.' },
  { code: 'R47.82', desc: 'Fluency disorder in conditions classified elsewhere', category: 'Speech', notes: 'Stuttering/cluttering related to medical condition.' },
  { code: 'R48.2', desc: 'Apraxia', category: 'Speech', notes: 'Motor planning disorder.' },
  
  // Cognition
  { code: 'R41.840', desc: 'Attention and concentration deficit', category: 'Cognition', notes: 'Difficulty focusing or sustaining attention.' },
  { code: 'R41.841', desc: 'Cognitive communication deficit', category: 'Cognition', notes: 'Deficits in communication due to cognitive impairment.' },
  { code: 'R41.842', desc: 'Visuospatial deficit', category: 'Cognition', notes: 'Difficulty with spatial awareness/processing.' },
  { code: 'R41.843', desc: 'Psychomotor deficit', category: 'Cognition', notes: 'Slowing of thought and physical movement.' },
  { code: 'R41.844', desc: 'Frontal lobe and executive function deficit', category: 'Cognition', notes: 'Difficulty with planning, organizing, sequencing.' },
  { code: 'F06.7', desc: 'Mild cognitive disorder due to known physiological condition', category: 'Cognition', notes: 'Mild Neurocognitive Disorder.' },
  
  // Voice
  { code: 'R49.0', desc: 'Dysphonia', category: 'Voice', notes: 'Hoarseness or difficulty producing voice.' },
  { code: 'R49.1', desc: 'Aphonia', category: 'Voice', notes: 'Loss of voice.' },
  { code: 'R49.21', desc: 'Hypernasality', category: 'Voice', notes: 'Excessive nasal resonance.' },
  { code: 'R49.22', desc: 'Hyponasality', category: 'Voice', notes: 'Reduced nasal resonance.' },
  { code: 'J38.0', desc: 'Paralysis of vocal cords and larynx', category: 'Voice', notes: 'Vocal fold paralysis.' },
];

export const SECTION_K_ITEMS: CodeItem[] = [
  { 
    code: 'K0100', 
    desc: 'Swallowing Disorder', 
    category: 'Swallowing', 
    notes: 'Signs and symptoms of possible swallowing disorder.',
    tooltip: 'Check all that apply: A. Loss of liquids/solids from mouth when eating or drinking. B. Holding food in mouth/cheeks or residual food in mouth after meals. C. Coughing or choking during meals or when swallowing medications. D. Complaints of difficulty or pain with swallowing. Z. None of the above.'
  },
  { 
    code: 'K0200', 
    desc: 'Height and Weight', 
    category: 'Nutritional Status', 
    notes: 'Current height and weight.',
    tooltip: 'Height in inches and weight in pounds. Base weight on most recent measure in last 30 days.'
  },
  { 
    code: 'K0300', 
    desc: 'Weight Loss', 
    category: 'Nutritional Status', 
    notes: 'Loss of 5% or more in last month or 10% or more in last 6 months.',
    tooltip: '0. No or unknown. 1. Yes, not physician prescribed. 2. Yes, physician prescribed.'
  },
  { 
    code: 'K0310', 
    desc: 'Weight Gain', 
    category: 'Nutritional Status', 
    notes: 'Gain of 5% or more in last month or 10% or more in last 6 months.',
    tooltip: '0. No or unknown. 1. Yes, not physician prescribed. 2. Yes, physician prescribed.'
  },
  { 
    code: 'K0510', 
    desc: 'Nutritional Approaches', 
    category: 'Nutritional Status', 
    notes: 'Check all that apply in last 7 days.',
    tooltip: 'A. Parenteral/IV feeding. B. Feeding tube. C. Mechanically altered diet. D. Therapeutic diet. Z. None of the above.'
  },
  { 
    code: 'K0710', 
    desc: 'Percent Intake by Artificial Route', 
    category: 'Nutritional Status', 
    notes: 'Proportion of total calories/fluid received via tube/IV.',
    tooltip: 'A. Proportion of total calories (1. 25% or less, 2. 26-50%, 3. 51% or more). B. Average fluid intake per day (1. 500cc or less, 2. 501cc or more).'
  },
];

export const CODING_DATA = {
  CPT_CODES,
  ICD10_CODES,
  SECTION_K_ITEMS
};
