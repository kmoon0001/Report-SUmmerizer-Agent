import { 
  ClipboardList, 
  Activity, 
  BookOpen, 
  Brain, 
  MessageSquare, 
  Mic, 
  Users, 
  Stethoscope 
} from 'lucide-react';
import { SLP_ADVANCED_REHAB_DATA } from './slp-advanced-rehab-data';
import { PT_SUBSPECIALTY_DATA } from './pt-subspecialty-data';
import { OT_SUBSPECIALTY_DATA } from './ot-subspecialty-data';

export interface Assessment {
  name: string;
  acronym?: string;
  description: string;
  population: string;
  time: string;
  cost: 'Free' | 'Paid' | 'Subscription';
  link?: string;
  isPlaceholder?: boolean;
  instructions?: string;
  tags: string[];
  whatItIs?: string;
  whatItContains?: string;
  tips?: string[];
  limitations?: string[];
}

export interface Treatment {
  name: string;
  acronym?: string;
  description: string;
  evidenceLevel: 'High' | 'Moderate' | 'Emerging';
  candidates: string;
  contraindications?: string;
  instructions?: string;
  videoUrl?: string;
  link?: string;
  isPlaceholder?: boolean;
  tags: string[];
  whatItIs?: string;
  whatItContains?: string;
  tips?: string[];
  limitations?: string[];
  documentationTips?: string;
  references?: string[];
}

export interface ClinicalOverview {
  whatItIs: string;
  whyItHappens: string;
  deficits: string[];
  symptoms: string[];
  clinicalPearl: string;
  bestPractices: string[];
}

export interface Visual {
  title: string;
  type: 'video' | 'image';
  thumbnail: string;
  description: string;
  videoUrl?: string; // Optional for video types
  link?: string;
  isPlaceholder?: boolean;
  whatItIs?: string;
  whatItContains?: string;
  tips?: string[];
  limitations?: string[];
}

export interface SubspecialtyData {
  id: string;
  title: string;
  overview: ClinicalOverview;
  types?: { name: string; description: string }[];
  assessments: Assessment[];
  treatments: Treatment[];
  visuals: Visual[];
  resources: any[];
}

export const SUBSPECIALTY_DATA: Record<string, SubspecialtyData> = {
  'dysphagia': {
    id: 'dysphagia',
    title: 'Dysphagia Management',
    overview: {
      whatItIs: 'Dysphagia is a swallowing disorder involving the oral cavity, pharynx, esophagus, or gastroesophageal junction.',
      whyItHappens: 'Common etiologies include Stroke (CVA), Traumatic Brain Injury (TBI), Neurodegenerative diseases (Parkinson\'s, ALS, Dementia), Head and Neck Cancer (and radiation/chemoradiation), and Presbyphagia (aging swallow).',
      deficits: [
        'Reduced labial seal (anterior spillage)',
        'Reduced lingual control/propulsion',
        'Delayed pharyngeal swallow initiation',
        'Reduced hyolaryngeal excursion',
        'Reduced pharyngeal constriction (residue)',
        'Reduced UES opening',
        'Reduced laryngeal closure (aspiration risk)',
        'Impaired esophageal motility'
      ],
      symptoms: [
        'Coughing or choking during/after meals',
        'Wet/gurgly vocal quality',
        'Globus sensation ("stuck" feeling)',
        'Recurrent pneumonia',
        'Unexplained weight loss',
        'Mealtime fatigue',
        'Avoidance of specific food textures',
        'Prolonged meal times'
      ],
      clinicalPearl: 'Silent aspiration occurs in up to 40% of acute stroke patients. A bedside swallow exam (CSE) misses approximately 60% of aspirators. Instrumental assessment (MBSS or FEES) is the gold standard for defining physiology.',
      bestPractices: [
        'Aggressive oral care is the #1 prevention for aspiration pneumonia.',
        'Thickened liquids should be a last resort due to dehydration risk.',
        'Therapy should be physiology-based (e.g., strengthening, skill training) rather than just compensatory when possible.',
        'Use the IDDSI framework for diet standardization.',
        'Implement "Careful Hand Feeding" for patients with advanced dementia.',
        'Always consider the patient\'s cognitive status and ability to follow compensatory strategies.'
      ]
    },
    types: [
      { name: 'Oral Dysphagia', description: 'Difficulty with bolus preparation, mastication, and lingual propulsion within the oral cavity.' },
      { name: 'Pharyngeal Dysphagia', description: 'Difficulty with bolus transit through the pharynx, including delayed swallow initiation, reduced laryngeal closure, and reduced pharyngeal constriction.' },
      { name: 'Esophageal Dysphagia', description: 'Difficulty with bolus transit through the esophagus, often due to structural (e.g., stricture) or motility (e.g., achalasia) issues.' },
      { name: 'Oropharyngeal Dysphagia', description: 'A combination of oral and pharyngeal phase difficulties, common in neurogenic conditions.' }
    ],
    assessments: [
      {
        name: 'Yale Swallow Protocol',
        description: 'Evidence-based aspiration risk screener. 3oz water challenge + oral mech.',
        population: 'Adults (Stroke, TBI, Gen Med)',
        time: '< 5 mins',
        cost: 'Free',
        link: 'https://yaleswallowprotocol.com/',
        instructions: '1. Cognitive screen: Ensure patient is alert and can follow commands. 2. Oral mechanism exam: Check for labial closure, lingual ROM, facial symmetry. 3. 3oz water challenge: Have patient drink 3oz of water uninterrupted. 4. Observe: Monitor for coughing or choking during and for 1 minute after.',
        tags: ['Screening', 'Bedside'],
        whatItIs: 'A simple, evidence-based protocol designed to identify individuals at high risk for aspiration. It was developed to be administered by nurses or other healthcare professionals.',
        whatItContains: '1. Brief cognitive screen (orientation, following commands).\n2. Oral mechanism examination (labial closure, lingual range of motion, facial symmetry).\n3. 3-ounce (90cc) uninterrupted water challenge.',
        tips: [
          'Ensure the patient is sitting upright at 90 degrees before starting.',
          'The patient must drink the entire 3 ounces without stopping.',
          'Observe the patient for 1 minute after completion for delayed coughing.'
        ],
        limitations: [
          'Does not diagnose the pathophysiology of dysphagia.',
          'Only screens for aspiration risk with thin liquids.',
          'High false-positive rate (many who fail may not actually aspirate, but those who pass are very unlikely to aspirate).'
        ]
      },
      {
        name: 'Mann Assessment of Swallowing Ability',
        acronym: 'MASA',
        description: 'Comprehensive clinical examination scoring 24 areas.',
        population: 'Stroke (Acute/Subacute)',
        time: '15-20 mins',
        cost: 'Paid',
        link: 'https://www.asha.org/practice-portal/clinical-topics/adult-dysphagia/',
        tags: ['Standardized', 'Bedside'],
        instructions: '1. Ensure the patient is seated upright. 2. Administer the 24 items in the standardized order (Oral Prep, Pharyngeal, Laryngeal). 3. Score each item based on the standardized criteria. 4. Calculate the total score. 5. Interpret the score: 178-170 is normal, 169-139 is mild, <139 is severe.'
      },
      {
        name: 'Eating Assessment Tool',
        acronym: 'EAT-10',
        description: 'Patient-reported outcome measure for dysphagia symptom severity.',
        population: 'Adults',
        time: '2 mins',
        cost: 'Free',
        link: 'https://www.nestlehealthscience.us/brands/thickenup/thickenup-clear/eat-10',
        tags: ['PROM', 'Screening'],
        whatItIs: 'A 10-item self-administered, symptom-specific outcome instrument for dysphagia. It helps measure the patient\'s perception of their swallowing difficulties.',
        whatItContains: '10 statements rated on a scale of 0 (no problem) to 4 (severe problem). Topics include weight loss, interference with going out, effort of swallowing, and coughing.',
        tips: [
          'A score of 3 or higher is considered abnormal and suggests the need for further swallowing evaluation.',
          'Can be used to track treatment efficacy over time.',
          'Have the patient fill it out independently if cognitively intact.'
        ],
        limitations: [
          'Relies on patient self-awareness; not suitable for patients with severe cognitive deficits or anosognosia.',
          'Does not replace an instrumental evaluation.'
        ]
      },
      {
        name: 'Gugging Swallowing Screen',
        acronym: 'GUSS',
        description: 'Graded water swallow test specifically for stroke patients.',
        population: 'Acute Stroke',
        time: '10 mins',
        cost: 'Free',
        link: 'https://www.guss-scale.com/',
        tags: ['Screening', 'Stroke'],
        instructions: '1. Administer the indirect swallow test (alertness, cough reflex, throat clearing, saliva swallow). 2. If passed, administer the direct swallow test (teaspoon water, 3oz water, puree). 3. Score each item. 4. Interpret the score: 20 is normal, 15-19 is mild, 10-14 is moderate, <10 is severe.'
      },
      {
        name: 'Functional Oral Intake Scale',
        acronym: 'FOIS',
        description: '7-point scale documenting functional dietary level.',
        population: 'All',
        time: '< 1 min',
        cost: 'Free',
        link: 'https://pubmed.ncbi.nlm.nih.gov/15827496/',
        tags: ['Outcome Measure'],
        instructions: '1. Observe the patient\'s current oral intake. 2. Select the level (1-7) that best describes the patient\'s functional dietary intake. 3. Use this scale to track progress over time.'
      },
      {
        name: 'ASHA Quality of Communication Life Scale',
        acronym: 'QCL',
        description: 'Assesses the impact of communication disorders on quality of life.',
        population: 'Adults with communication/swallow disorders',
        time: '10 mins',
        cost: 'Paid',
        tags: ['QoL', 'Outcome Measure'],
        instructions: '1. Administer the 17-item questionnaire. 2. Have the patient rate each item on a 5-point scale (1: strongly disagree, 5: strongly agree). 3. Calculate the total score. 4. Use the score to assess the impact of communication/swallow disorders on the patient\'s quality of life.'
      },
      {
        name: 'Test of Masticating and Swallowing Solids',
        acronym: 'TOMASS',
        description: 'Quantitative assessment of solid food ingestion.',
        population: 'Adults',
        time: '5 mins',
        cost: 'Free',
        tags: ['Objective', 'Solids'],
        instructions: '1. Provide the patient with a standardized solid food (e.g., cracker). 2. Count the number of chews, number of swallows, and total time taken to ingest the food. 3. Compare the results to standardized norms for the patient\'s age and gender.',
        whatItIs: 'A clinical assessment tool that requires the patient to eat a single commercial cracker as quickly as comfortably possible.',
        whatItContains: 'Clinician measures the number of bites, masticatory cycles, swallows, and total time taken to consume the cracker.',
        tips: [
          'Provides normative data for comparison based on age and gender.',
          'Excellent for quantifying difficulties with the oral preparatory phase and solid food management.'
        ],
        limitations: [
          'Requires the patient to be able to safely tolerate a solid cracker (not for patients with severe dysphagia or high aspiration risk on solids).'
        ]
      },
      {
        name: 'Swallowing Quality of Life Questionnaire',
        acronym: 'SWAL-QOL',
        description: 'Comprehensive patient-reported outcome measure for dysphagia.',
        population: 'Adults with dysphagia',
        time: '15 mins',
        cost: 'Free',
        tags: ['PROM', 'QoL'],
        instructions: '1. Administer the 44-item questionnaire. 2. Have the patient rate each item on a 5-point Likert scale. 3. Calculate the total score and domain scores. 4. Use the results to establish baseline quality of life and track changes over time.',
        whatItIs: 'A 44-item questionnaire that assesses the impact of dysphagia on quality of life across 10 domains (e.g., burden, eating duration, appetite, fear, mental health).',
        whatItContains: 'Patients rate statements on a 5-point Likert scale.',
        tips: [
          'More comprehensive than the EAT-10, providing a detailed profile of the psychosocial impact of the swallowing disorder.',
          'Useful for establishing baseline quality of life and measuring changes post-treatment.'
        ],
        limitations: [
          'Lengthy and can be burdensome for patients to complete, especially those with cognitive or fatigue issues.'
        ]
      },
      {
        name: 'Add New Assessment',
        description: 'Click to add a new assessment resource.',
        population: 'N/A',
        time: 'N/A',
        cost: 'Free',
        isPlaceholder: true,
        tags: ['Placeholder']
      }
    ],
    treatments: [
      {
        name: 'Effortful Swallow',
        description: 'Volitional increase in pharyngeal pressure during swallow.',
        evidenceLevel: 'High',
        candidates: 'Reduced tongue base retraction, pharyngeal residue.',
        link: 'https://www.dysphagiacafe.com/2015/01/26/the-effortful-swallow/',
        instructions: 'Instruct the patient to swallow hard, as if swallowing a whole grape or a large bite of food. Focus on squeezing the throat muscles. Practice with saliva first, then small amounts of liquid/food.',
        tags: ['Compensatory', 'Rehabilitative'],
        whatItIs: 'A swallowing maneuver designed to increase posterior tongue base movement to facilitate bolus clearance from the valleculae.',
        tips: [
          'Can be used as both a compensatory strategy (during meals) and a rehabilitative exercise (with saliva).',
          'Use biofeedback (sEMG) if available to help the patient visualize the "effort".',
          'Cueing "squeeze your throat muscles hard" often works better than "swallow hard".'
        ],
        limitations: [
          'May cause fatigue if used for every swallow during a meal.',
          'Difficult for patients with significant cognitive impairment to understand the concept of "effort".'
        ],
        contraindications: 'None specific, but monitor for fatigue.',
        documentationTips: 'Document the specific cueing level required and the patient\'s response to the intervention.',
        references: ['ASHA Practice Portal: Dysphagia in Adults']
      },
      {
        name: 'Mendelsohn Maneuver',
        description: 'Volitional prolongation of laryngeal elevation.',
        evidenceLevel: 'High',
        candidates: 'Reduced UES opening, pyriform sinus residue.',
        link: 'https://www.dysphagiacafe.com/2015/01/26/the-mendelsohn-maneuver/',
        instructions: 'Instruct the patient to swallow and hold their voice box (larynx) in the elevated position for 3 seconds before letting it drop. Practice with saliva first, then small amounts of liquid/food.',
        tags: ['Rehabilitative', 'Difficult to Teach'],
        whatItIs: 'A maneuver designed to elevate the larynx and open the esophagus during the swallow to prevent food/liquid from falling into the airway.',
        tips: [
          'Have the patient feel their Adam\'s apple (thyroid notch) to understand laryngeal elevation.',
          'Use sEMG biofeedback to show the sustained muscle contraction.',
          'Start with saliva swallows before progressing to small boluses.'
        ],
        limitations: [
          'Very difficult to teach and learn.',
          'Requires intact cognition and good muscular control.',
          'Can be fatiguing.'
        ],
        contraindications: 'Significant cognitive impairment, poor muscular control.',
        documentationTips: 'Document the patient\'s ability to sustain laryngeal elevation and the number of successful repetitions.',
        references: ['ASHA Practice Portal: Dysphagia in Adults']
      },
      {
        name: 'Masako Maneuver',
        description: 'Tongue-hold swallow to target posterior pharyngeal wall.',
        evidenceLevel: 'Moderate',
        candidates: 'Reduced pharyngeal constriction.',
        contraindications: 'Do NOT use with food/liquid (bolus). Saliva only.',
        link: 'https://www.dysphagiacafe.com/2015/01/26/the-masako-maneuver/',
        instructions: 'Hold tongue between teeth and swallow.',
        tags: ['Rehabilitative', 'Exercise Only'],
        whatItIs: 'An exercise designed to increase the forward movement of the posterior pharyngeal wall to meet the base of the tongue.',
        tips: [
          'Ensure the patient is only swallowing saliva.',
          'The tongue should be held gently between the teeth, not bitten hard.',
          'If the patient has no teeth, they can hold their tongue between their gums or lips.'
        ],
        limitations: [
          'Should NEVER be used with a food or liquid bolus as it alters the normal swallow physiology and increases aspiration risk.',
          'May be uncomfortable or difficult for patients with dry mouth (xerostomia).'
        ],
        documentationTips: 'Document the patient\'s ability to hold the tongue position during the swallow and any signs of discomfort.',
        references: ['ASHA Practice Portal: Dysphagia in Adults']
      },
      {
        name: 'Shaker Exercise / CTAR',
        description: 'Head lift exercises to strengthen suprahyoid muscles.',
        evidenceLevel: 'High',
        candidates: 'Reduced UES opening, post-swallow residue.',
        contraindications: 'Cervical spine issues, neck pain.',
        link: 'https://www.medbridgeeducation.com/blog/2016/04/shaker-exercise-dysphagia-rehabilitation/',
        instructions: 'Instruct the patient to lie flat on their back. Have them lift their head to look at their toes while keeping their shoulders flat on the bed. Hold for 60 seconds, then rest for 60 seconds. Repeat 3 times. Do this 3 times a day.',
        tags: ['Rehabilitative', 'Muscle Training'],
        whatItIs: 'An exercise program (Shaker) or Chin Tuck Against Resistance (CTAR) designed to strengthen the suprahyoid muscle group, which pulls the larynx forward and upward, aiding in opening the upper esophageal sphincter (UES).',
        tips: [
          'The traditional Shaker exercise requires the patient to lie flat on their back, which can be difficult for elderly or medically complex patients.',
          'CTAR is a seated alternative where the patient tucks their chin against a resistive device (e.g., a small inflatable ball or specialized device).',
          'Both involve sustained holds (isometric) and repetitive movements (isokinetic).'
        ],
        limitations: [
          'Traditional Shaker is contraindicated for patients with cervical spine issues or tracheostomy tubes.',
          'Can cause neck muscle fatigue or discomfort.'
        ],
        documentationTips: 'Document patient tolerance to the head lift, number of repetitions, and any neck discomfort.',
        references: ['ASHA Practice Portal: Dysphagia in Adults']
      },
      {
        name: 'EMST (Expiratory Muscle Strength Training)',
        description: 'Resistance training for expiratory muscles.',
        evidenceLevel: 'High',
        candidates: 'Parkinsons, Stroke, weak cough, aspiration risk.',
        link: 'https://www.emst150.com/',
        instructions: '1. Place the device in the mouth. 2. Seal lips tightly around the mouthpiece. 3. Inhale deeply through the nose. 4. Exhale forcefully through the device to overcome the resistance of the valve. 5. Repeat 5 times per set, 5 sets per day, 5 days per week.',
        tags: ['Device-Driven', 'Respiratory'],
        whatItIs: 'A rehabilitative exercise that uses a calibrated, one-way spring-loaded valve to provide resistance during expiration. It strengthens the expiratory and submental muscles.',
        tips: [
          'The standard protocol is the "Rule of 5s": 5 breaths per set, 5 sets per day, 5 days per week, for 4-5 weeks.',
          'Improves voluntary cough strength, which is critical for clearing aspirated material from the airway.',
          'Also improves hyolaryngeal excursion during swallowing.'
        ],
        limitations: [
          'Requires the purchase of a device (e.g., EMST150).',
          'Contraindicated for patients with untreated hypertension, recent stroke, or certain cardiac conditions.'
        ],
        contraindications: 'Untreated hypertension, recent stroke, certain cardiac conditions.',
        documentationTips: 'Document the resistance level used, number of sets/repetitions, and patient tolerance.',
        references: ['ASHA Practice Portal: Dysphagia in Adults']
      },
      {
        name: 'Iowa Oral Performance Instrument',
        acronym: 'IOPI',
        description: 'Biofeedback device for measuring and strengthening tongue/lip pressure.',
        evidenceLevel: 'High',
        candidates: 'Oral phase dysphagia, weak tongue propulsion.',
        link: 'https://iopimedical.com/',
        instructions: 'Instruct the patient to place the air-filled bulb against the roof of the mouth (or between the lips). Have them press the bulb with their tongue (or lips) as hard as they can. Use the device to measure maximum pressure, then set a target pressure for exercise.',
        tags: ['Rehabilitative', 'Device', 'Biofeedback'],
        whatItIs: 'A device that measures the pressure exerted by the tongue or lips against an air-filled bulb. It provides objective data and visual biofeedback for strengthening exercises.',
        tips: [
          'First, measure the patient\'s maximum isometric pressure (MIP).',
          'Then, set an exercise target (e.g., 60-80% of MIP) for the patient to hit during practice.',
          'Excellent for patients who need visual feedback to understand the required effort.'
        ],
        limitations: [
          'The device and disposable bulbs are expensive.',
          'Requires the patient to be able to follow instructions and understand the visual feedback.'
        ],
        contraindications: 'None specific, but monitor for oral fatigue.',
        documentationTips: 'Document the target pressure set, number of repetitions, and patient\'s ability to maintain pressure.',
        references: ['ASHA Practice Portal: Dysphagia in Adults']
      },
      {
        name: 'Supraglottic Swallow',
        description: 'Maneuver to close the vocal folds before and during the swallow.',
        evidenceLevel: 'Moderate',
        candidates: 'Delayed pharyngeal swallow, reduced vocal fold closure.',
        instructions: 'Inhale, hold breath, swallow, cough, swallow again.',
        tags: ['Compensatory', 'Airway Protection'],
        whatItIs: 'A multi-step maneuver designed to voluntarily close the vocal folds before the swallow is initiated, protecting the airway from aspiration.',
        tips: [
          'The sequence is: 1. Take a deep breath. 2. Hold your breath tightly. 3. Swallow while holding your breath. 4. Cough immediately after the swallow. 5. Swallow again.',
          'The cough clears any residue that may have entered the laryngeal vestibule during the swallow.',
          'Requires significant cognitive capacity and coordination to execute correctly during a meal.'
        ],
        limitations: [
          'Can be fatiguing and difficult to learn.',
          'May increase cardiovascular strain; use with caution in patients with cardiac history.'
        ],
        contraindications: 'Cardiac history (use with caution).',
        documentationTips: 'Document the patient\'s ability to hold breath, swallow, and cough effectively.',
        references: ['ASHA Practice Portal: Dysphagia in Adults']
      },
      {
        name: 'McNeill Dysphagia Therapy Program',
        acronym: 'MDTP',
        description: 'Intensive, systematic exercise-based therapy framework.',
        evidenceLevel: 'High',
        candidates: 'Chronic dysphagia, motivated patients.',
        tags: ['Intensive', 'Certification Required'],
        instructions: '1. Administer the intensive, daily, systematic exercise program as outlined in the MDTP protocol. 2. Progressively increase the difficulty of the exercises based on the patient\'s performance. 3. Monitor the patient\'s swallowing function closely throughout the program.'
      },
      {
        name: 'Thermal-Tactile Stimulation',
        description: 'Application of cold/tactile stimulus to faucial pillars to trigger swallow.',
        evidenceLevel: 'Emerging',
        candidates: 'Delayed pharyngeal swallow initiation.',
        tags: ['Compensatory', 'Sensory'],
        instructions: '1. Use a cold laryngeal mirror or a cold, sour bolus to stimulate the faucial pillars. 2. Observe the patient\'s swallow response. 3. Repeat as needed to facilitate swallow initiation.'
      }
    ],
    resources: [
      {
        title: 'ASHA Practice Portal: Dysphagia in Adults',
        description: 'Comprehensive clinical guide.',
        type: 'Guide',
        url: 'https://www.asha.org/practice-portal/clinical-topics/dysphagia-in-adults/'
      },
      {
        title: 'IDDSI Framework',
        description: 'Standardized diet and liquid framework.',
        type: 'Guide',
        url: 'https://iddsi.org/'
      },
      {
        title: 'National Foundation of Swallowing Disorders',
        description: 'Patient and caregiver resources.',
        type: 'Handout',
        url: 'https://swallowingdisorderfoundation.com/'
      }
    ],
    visuals: [
      {
        title: 'FEES Procedure Overview',
        type: 'video',
        thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800',
        description: 'Endoscopic evaluation of swallowing mechanics.',
        videoUrl: 'https://www.youtube.com/embed/xyz',
        whatItIs: 'Fiberoptic Endoscopic Evaluation of Swallowing (FEES) is a procedure where a flexible endoscope is passed transnasally to view the pharynx and larynx before and after the swallow.',
        tips: [
          'Excellent for visualizing vocal fold mobility and secretion management.',
          'Can be performed at the bedside, making it ideal for medically fragile or bariatric patients.',
          'Allows for direct visualization of mucosal tissue and anatomical abnormalities.'
        ],
        limitations: [
          '"White out" period during the actual swallow obscures the view of aspiration at the exact moment it occurs.',
          'Cannot view the oral phase or the esophageal phase of swallowing.',
          'May be uncomfortable for some patients; requires cooperation.'
        ]
      },
      {
        title: 'MBSS/VFSS Lateral View',
        type: 'video',
        thumbnail: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800',
        description: 'Radiographic study of the oral and pharyngeal phases.',
        videoUrl: 'https://www.youtube.com/embed/abc',
        whatItIs: 'Modified Barium Swallow Study (MBSS) or Videofluoroscopic Swallow Study (VFSS) is a radiographic procedure that provides a dynamic view of the oral, pharyngeal, and upper esophageal phases of swallowing.',
        tips: [
          'Considered the "gold standard" for evaluating the biomechanics of swallowing.',
          'Allows for precise identification of the etiology of aspiration (e.g., delayed swallow vs. reduced laryngeal elevation).',
          'Can trial compensatory strategies and diet modifications in real-time.'
        ],
        limitations: [
          'Involves radiation exposure, limiting the duration of the study.',
          'Requires the patient to be transported to the radiology suite.',
          'Barium does not perfectly mimic the viscosity of real food/liquids.'
        ]
      },
      {
        title: 'Laryngeal Anatomy (3D)',
        type: 'image',
        thumbnail: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800',
        description: 'Detailed 3D structural view of the vocal folds and epiglottis.',
        whatItIs: 'A 3D anatomical reference image highlighting the key structures involved in airway protection during swallowing.',
        tips: [
          'Use this to educate patients and families about how the epiglottis retroflexes to cover the airway.',
          'Helpful for explaining the difference between penetration (above the vocal folds) and aspiration (below the vocal folds).'
        ]
      },
      {
        title: 'Pharyngeal Constrictors (2D)',
        type: 'image',
        thumbnail: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=800',
        description: 'Muscular anatomy involved in the pharyngeal swallow.',
        whatItIs: 'A 2D illustration showing the muscular "tube" responsible for squeezing the bolus down into the esophagus.',
        tips: [
          'Use this to explain why pharyngeal residue occurs (weakness in these muscles).',
          'Helpful when discussing the rationale for the Effortful Swallow or Masako Maneuver.'
        ]
      }
    ]
  },
  'cog-comm': {
    id: 'cog-comm',
    title: 'Cognitive-Communication',
    overview: {
      whatItIs: 'Cognitive-communication disorders encompass difficulty with any aspect of communication that is affected by disruption of cognition, including attention, memory, executive function, and social cognition.',
      whyItHappens: 'Traumatic Brain Injury (TBI), Right Hemisphere Damage (RHD), Dementia (Alzheimer\'s, Vascular, FTD), Brain Tumor, Hypoxic Brain Injury, and neurodegenerative conditions.',
      deficits: [
        'Attention (sustained, selective, alternating, divided)',
        'Memory (short-term, working, episodic, prospective)',
        'Executive Function (planning, organizing, problem solving, inhibition)',
        'Social Cognition (theory of mind, emotional regulation)',
        'Awareness/Insight (Anosognosia)',
        'Initiation and motivation'
      ],
      symptoms: [
        'Forgetfulness in daily activities',
        'Disorganization and poor task completion',
        'Impulsivity / Poor safety awareness',
        'Difficulty following complex instructions',
        'Poor topic maintenance (tangential speech)',
        'Reduced processing speed',
        'Confabulation',
        'Reduced initiation of communication'
      ],
      clinicalPearl: 'Cognitive rehabilitation is most effective when it is contextualized and relevant to the patient\'s daily life goals. "Train the task, not just the process." Always assess for co-occurring depression or anxiety which can mimic cognitive decline.',
      bestPractices: [
        'Use Errorless Learning for severe memory deficits to prevent reinforcement of incorrect responses.',
        'Implement Metacognitive Strategy Instruction (MSI) for executive dysfunction.',
        'Focus on environmental modifications and external aids (e.g., calendars, alarms) early in recovery.',
        'Involve family/caregivers in strategy training to ensure carryover.',
        'Provide structured, predictable environments to reduce cognitive load.'
      ]
    },
    assessments: [
      {
        name: 'Montreal Cognitive Assessment',
        acronym: 'MoCA',
        description: 'Screening tool for mild cognitive impairment.',
        population: 'MCI, Dementia, Stroke',
        time: '10 mins',
        cost: 'Paid',
        link: 'https://www.mocatest.org/',
        instructions: '1. Administer the tasks in the standardized order (Visuospatial, Naming, Memory, Attention, Language, Abstraction, Delayed Recall, Orientation). 2. Ensure the patient is in a quiet, well-lit environment. 3. Use the standardized scoring form. 4. Add 1 point if the patient has 12 years or fewer of formal education. 5. Interpret the score: 26-30 is normal, 18-25 is mild cognitive impairment, <18 is dementia.',
        tags: ['Screening', 'Global'],
        whatItIs: 'A rapid screening instrument for mild cognitive dysfunction. It assesses different cognitive domains: attention and concentration, executive functions, memory, language, visuoconstructional skills, conceptual thinking, calculations, and orientation.',
        whatItContains: 'Tasks include alternating trail making, drawing a clock, naming animals, repeating a list of words, subtracting by 7s, repeating sentences, verbal fluency, abstract reasoning, and delayed recall.',
        tips: [
          'Add 1 point for individuals who have 12 years or fewer of formal education.',
          'A score of 26 or above is generally considered normal.',
          'Requires certification to administer.'
        ],
        limitations: [
          'Heavily reliant on language and motor skills; may not be suitable for patients with severe aphasia or hemiparesis.',
          'Not a diagnostic tool; only indicates the need for further evaluation.'
        ]
      },
      {
        name: 'St. Louis University Mental Status',
        acronym: 'SLUMS',
        description: 'Screening tool sensitive to mild neurocognitive disorder.',
        population: 'Veterans, Geriatric',
        time: '10 mins',
        cost: 'Free',
        link: 'https://www.slu.edu/medicine/internal-medicine/geriatric-medicine/slums-exam.php',
        instructions: '1. Administer the 30-point screening questionnaire. 2. Ensure the patient is in a quiet, well-lit environment. 3. Use the standardized scoring form. 4. Adjust the total score based on the patient\'s years of formal education (high school vs. less than high school). 5. Interpret the score: 27-30 is normal (high school), 21-26 is mild cognitive impairment (high school), <21 is dementia (high school).',
        tags: ['Screening', 'Global'],
        whatItIs: 'A 30-point screening questionnaire that tests for mild cognitive impairment and dementia. It was developed as an alternative to the MMSE.',
        whatItContains: '11 items assessing orientation, memory, attention, and executive functions (e.g., naming animals, drawing a clock, recalling a story).',
        tips: [
          'Scores are adjusted based on the patient\'s education level (high school vs. less than high school).',
          'Often preferred over the MMSE because it is free and more sensitive to mild cognitive impairment.'
        ],
        limitations: [
          'Like the MoCA, it requires intact language and motor skills.',
          'May be challenging for patients with hearing or visual impairments.'
        ]
      },
      {
        name: 'Cognitive Linguistic Quick Test',
        acronym: 'CLQT+',
        description: 'Criterion-referenced battery for 5 cognitive domains.',
        population: 'Stroke, TBI, Dementia',
        time: '15-30 mins',
        cost: 'Paid',
        instructions: '1. Administer the 10 subtests in the standardized order. 2. Use the "Plus" administration path if the patient has significant aphasia. 3. Score each task based on the standardized criteria. 4. Calculate severity ratings for each of the five domains (Attention, Memory, Executive Functions, Language, Visuospatial Skills). 5. Use the results to guide treatment planning.',
        tags: ['Battery', 'Broad'],
        whatItIs: 'A quick assessment that provides a snapshot of cognitive-linguistic functioning across five domains: Attention, Memory, Executive Functions, Language, and Visuospatial Skills.',
        whatItContains: '10 tasks including personal facts, symbol cancellation, confrontation naming, clock drawing, story retelling, symbol trails, generative naming, design memory, mazes, and design generation.',
        tips: [
          'The "Plus" version includes an aphasia administration path, making it suitable for patients with severe language deficits.',
          'Provides severity ratings for each domain, helping to guide treatment planning.'
        ],
        limitations: [
          'Not sensitive to very mild cognitive deficits (e.g., high-level executive dysfunction).',
          'Can be expensive to purchase the kit and forms.'
        ]
      },
      {
        name: 'Scales of Cognitive Ability for TBI',
        acronym: 'SCATBI',
        description: 'Comprehensive assessment for TBI patients.',
        population: 'TBI (Rancho IV-VIII)',
        time: '30-120 mins',
        cost: 'Paid',
        tags: ['TBI', 'Comprehensive'],
        instructions: '1. Administer subtests across the five levels of difficulty (orientation, perception, organization, recall, reasoning). 2. Score based on standardized criteria. 3. Use the results to guide treatment planning for TBI.',
        whatItIs: 'A comprehensive assessment battery designed to evaluate cognitive-linguistic functioning in individuals with TBI across five levels of difficulty.'
      },
      {
        name: 'Functional Assessment of Verbal Reasoning',
        acronym: 'FAVRES',
        description: 'High-level reasoning in real-world contexts.',
        population: 'Mild TBI, Stroke (Return to Work)',
        time: '45-60 mins',
        cost: 'Paid',
        instructions: '1. Administer the four complex tasks: Planning an Event, Scheduling, Making a Decision, and Building a Case. 2. Provide the patient with all necessary materials (e.g., calendar, phone book). 3. Score accuracy, rationale, and time taken for each task. 4. Analyze the patient\'s reasoning strategies and executive function performance.',
        tags: ['High-Level', 'Functional'],
        whatItIs: 'A standardized assessment designed to evaluate high-level cognitive-communication skills, specifically verbal reasoning, complex comprehension, discourse, and executive functioning in real-world contexts.',
        whatItContains: 'Four complex, functional tasks: Planning an Event, Scheduling, Making a Decision, and Building a Case. It measures accuracy, rationale, and time taken.',
        tips: [
          'Excellent for patients who "ace" the MoCA or CLQT but still struggle at work or home.',
          'Provides quantitative scores and qualitative analysis of reasoning strategies.'
        ],
        limitations: [
          'Requires a high level of baseline reading and language ability.',
          'Can be frustrating for patients with moderate to severe deficits.'
        ]
      },
      {
        name: 'Repeatable Battery for the Assessment of Neuropsychological Status',
        acronym: 'RBANS',
        description: 'Brief battery for neuropsychological status.',
        population: 'Dementia, TBI, Stroke',
        time: '20-30 mins',
        cost: 'Paid',
        instructions: '1. Administer the 12 subtests in the standardized order. 2. Score each subtest according to the manual. 3. Calculate age-adjusted index scores for each domain (Immediate Memory, Visuospatial/Constructional, Language, Attention, Delayed Memory). 4. Calculate the total scale score. 5. Use alternate forms for subsequent administrations to minimize practice effects.',
        tags: ['Battery', 'Neuropsych'],
        whatItIs: 'A brief, individually administered test measuring cognitive decline or improvement across five domains: Immediate Memory, Visuospatial/Constructional, Language, Attention, and Delayed Memory.',
        whatItContains: '12 subtests including list learning, story memory, figure copy, line orientation, picture naming, semantic fluency, digit span, coding, list recall, list recognition, story recall, and figure recall.',
        tips: [
          'Has multiple alternate forms, making it ideal for tracking changes over time without practice effects.',
          'Provides age-adjusted index scores and a total scale score.'
        ],
        limitations: [
          'Less comprehensive than a full neuropsychological evaluation.',
          'May not be sensitive to very subtle executive dysfunction.'
        ]
      },
      {
        name: 'Arizona Battery for Communication Disorders of Dementia',
        acronym: 'ABCD',
        description: 'Assesses communication and cognitive deficits in dementia.',
        population: 'Dementia',
        time: '45-60 mins',
        cost: 'Paid',
        tags: ['Dementia', 'Diagnostic']
      },
      {
        name: 'Geriatric Depression Scale',
        acronym: 'GDS',
        description: 'Screening tool for depression in older adults.',
        population: 'Older adults (Dementia, TBI, Stroke)',
        time: '5-10 mins',
        cost: 'Free',
        tags: ['Screening', 'Depression'],
        instructions: '1. Administer the 15-item questionnaire (short form). 2. Score based on the number of depressive symptoms reported. 3. Use as a screening tool to identify the need for further evaluation or referral.',
        whatItIs: 'A 15-item self-report questionnaire used to screen for depression in older adults.',
        tips: [
          'Useful for identifying depression, which can significantly impact cognitive performance and therapy participation.',
          'Can be administered verbally if the patient has reading or visual deficits.'
        ],
        limitations: [
          'Not a diagnostic tool for clinical depression.',
          'May not be sensitive to all types of depression.'
        ]
      }
    ],
    treatments: [
      {
        name: 'Errorless Learning',
        description: 'Instructional strategy that minimizes or prevents errors during learning.',
        evidenceLevel: 'High',
        candidates: 'Severe memory impairment, Dementia, Amnesia.',
        tags: ['Memory', 'Instructional Strategy'],
        instructions: '1. Break tasks into small, manageable steps. 2. Provide high levels of support initially. 3. Fade prompts very gradually. 4. Prevent the patient from guessing or making errors.',
        whatItIs: 'A teaching method where the clinician provides the correct answer or prompts the patient to ensure they respond correctly every time, preventing the encoding of incorrect information.',
        tips: [
          'Break tasks down into very small, manageable steps.',
          'Provide high levels of support initially and fade prompts very gradually.',
          'Do not use "trial and error" or ask the patient to guess.'
        ],
        limitations: [
          'Can be time-consuming to implement correctly.',
          'May feel unnatural or overly restrictive to some patients or clinicians.'
        ],
        documentationTips: 'Document the task, level of support provided, and patient\'s accuracy.',
        references: ['ASHA Practice Portal: Cognitive-Communication']
      },
      {
        name: 'Spaced Retrieval Training',
        description: 'Evidence-based memory technique using increasing time intervals.',
        evidenceLevel: 'High',
        candidates: 'Dementia, TBI, Memory deficits.',
        link: 'https://www.asha.org/practice-portal/clinical-topics/cognitive-communication/',
        instructions: 'Recall target info at 15s, 30s, 1m, 2m, 4m, 8m intervals.',
        tags: ['Memory', 'Errorless Learning'],
        whatItIs: 'A method of learning and retaining information by recalling that information over increasingly longer periods of time.',
        tips: [
          'If the patient makes an error, immediately provide the correct answer and ask them to repeat it. Then, reduce the time interval by half.',
          'Best used for specific, functional goals (e.g., remembering a room number, using a walker safely, remembering a spouse\'s name).',
          'Relies on implicit (procedural) memory, which is often preserved in dementia.'
        ],
        limitations: [
          'Does not generalize well to other tasks (e.g., training them to remember their room number will not help them remember their doctor\'s appointment).',
          'Requires consistent practice and repetition.'
        ],
        documentationTips: 'Document the target information, intervals used, and patient\'s success at each interval.',
        references: ['ASHA Practice Portal: Cognitive-Communication']
      },
      {
        name: 'Metacognitive Strategy Instruction',
        description: 'Teaching "thinking about thinking" (Plan-Do-Review).',
        evidenceLevel: 'High',
        candidates: 'TBI, Executive Dysfunction.',
        tags: ['Executive Function', 'Self-Regulation'],
        whatItIs: 'A treatment approach that teaches patients to monitor and control their own cognitive processes. It involves setting goals, planning how to achieve them, executing the plan, and evaluating the outcome.',
        tips: [
          'Use the "Goal-Plan-Do-Review" framework.',
          'Start with simple, structured tasks and gradually increase complexity.',
          'Encourage the patient to identify their own errors and develop their own strategies.'
        ],
        limitations: [
          'Requires a certain level of self-awareness (anosognosia must be mild or absent).',
          'Can be frustrating for patients who are used to performing tasks automatically.'
        ],
        documentationTips: 'Document the strategy used, patient\'s ability to implement it, and impact on functional task performance.',
        references: ['ASHA Practice Portal: Cognitive-Communication']
      },
      {
        name: 'Goal Management Training',
        description: 'Stop-Define-List-Learn-Check protocol.',
        evidenceLevel: 'High',
        candidates: 'Executive dysfunction, distractibility.',
        tags: ['Executive Function', 'Protocol'],
        instructions: '1. Teach the patient to "Stop" when they encounter a problem or error. 2. Define the goal clearly. 3. List the steps required to achieve the goal. 4. Learn the steps by rehearsing them. 5. Check progress regularly against the goal. 6. Use external aids (e.g., checklists, alarms) to support the process.',
        contraindications: 'Severe cognitive impairment, lack of motivation.',
        documentationTips: 'Document the goal, steps identified, and patient\'s ability to monitor progress.',
        references: ['ASHA Practice Portal: Cognitive-Communication']
      },
      {
        name: 'Environmental Modifications',
        description: 'Modifying the environment to reduce cognitive load (e.g., reducing noise, simplifying tasks).',
        evidenceLevel: 'High',
        candidates: 'Dementia, severe TBI.',
        tags: ['Compensatory', 'Safety'],
        instructions: '1. Identify high-load environments (e.g., noisy cafeteria, cluttered desk). 2. Implement modifications: reduce background noise, simplify visual layout, use clear signage, provide structured routines. 3. Educate caregivers on how to maintain these modifications.',
        contraindications: 'None specific.',
        documentationTips: 'Document the specific modifications implemented and caregiver education provided.',
        references: ['ASHA Practice Portal: Cognitive-Communication']
      },
      {
        name: 'Attention Process Training',
        acronym: 'APT',
        description: 'Hierarchical drill-based attention exercises.',
        evidenceLevel: 'Moderate',
        candidates: 'TBI, Stroke with specific attention deficits.',
        tags: ['Attention', 'Drill-Based'],
        instructions: '1. Start with simple, repetitive tasks (e.g., sorting cards, canceling letters) to target sustained attention. 2. Gradually increase complexity by adding distractors (selective attention). 3. Introduce tasks requiring shifting focus between stimuli (alternating attention). 4. Finally, introduce tasks requiring simultaneous processing (divided attention).',
        contraindications: 'Severe agitation or acute confusion.',
        documentationTips: 'Document the attention level targeted, tasks performed, and patient\'s accuracy/endurance.',
        references: ['ASHA Practice Portal: Cognitive-Communication']
      }
    ],
    resources: [
      {
        title: 'Caregiver Guide: Managing Cognitive Changes',
        description: 'Practical guide for caregivers of patients with cognitive impairment.',
        type: 'Handout',
        url: 'https://www.alz.org/help-support/caregiving/daily-care'
      },
      {
        title: 'Cognitive-Communication Strategies for Families',
        description: 'Strategies to support communication for families of patients with cognitive-communication disorders.',
        type: 'Handout',
        url: 'https://www.asha.org/public/speech/disorders/cognitive-communication/'
      }
    ],
    visuals: [
      {
        title: 'Frontal Lobe: Executive Function (3D)',
        type: 'image',
        thumbnail: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800',
        description: 'Detailed 3D visualization of the frontal lobe, the key area for executive function, planning, and personality.'
      },
      {
        title: 'Memory Systems & Pathways (2D/3D)',
        type: 'image',
        thumbnail: 'https://images.unsplash.com/photo-1555580109-335192523994?auto=format&fit=crop&q=80&w=800',
        description: 'Comprehensive 2D/3D diagram visualizing short-term, long-term, and working memory pathways.'
      }
    ]
  },
  'aphasia': {
    id: 'aphasia',
    title: 'Aphasia Rehabilitation',
    overview: {
      whatItIs: 'Aphasia is an acquired language disorder affecting the production or comprehension of speech and the ability to read or write.',
      whyItHappens: 'Most commonly caused by Stroke (Left Middle Cerebral Artery), but also TBI, Brain Tumors, and Primary Progressive Aphasia (PPA).',
      deficits: [
        'Anomia (word retrieval)',
        'Auditory Comprehension',
        'Repetition',
        'Fluency (grammatical structure)',
        'Reading (Alexia) / Writing (Agraphia)',
        'Semantic processing',
        'Syntactic processing',
        'Pragmatic communication'
      ],
      symptoms: [
        'Word finding pauses / circumlocution',
        'Paraphasias (semantic: "spoon" for "fork"; phonemic: "pork" for "fork")',
        'Jargon / Neologisms',
        'Agrammatism (telegraphic speech)',
        'Reduced understanding of complex sentences',
        'Perseveration',
        'Stereotypical utterances',
        'Impaired reading comprehension'
      ],
      clinicalPearl: 'Aphasia is a loss of language, not intellect. Always presume competence and use supported conversation techniques. Aphasia is often accompanied by apraxia of speech or dysarthria.',
      bestPractices: [
        'Use the Life Participation Approach to Aphasia (LPAA).',
        'Train communication partners (Supported Conversation).',
        'Focus on total communication (gesture, writing, drawing) over just speech.',
        'Intensive, high-dose therapy yields better outcomes.',
        'Incorporate functional, personally relevant vocabulary.',
        'Use visual supports and external aids for communication.'
      ]
    },
    types: [
      { name: 'Broca\'s Aphasia', description: 'Non-fluent, effortful speech, relatively preserved auditory comprehension, impaired repetition.' },
      { name: 'Wernicke\'s Aphasia', description: 'Fluent but meaningless speech (jargon), impaired auditory comprehension, impaired repetition.' },
      { name: 'Conduction Aphasia', description: 'Fluent speech, relatively preserved auditory comprehension, severe impairment in repetition.' },
      { name: 'Anomic Aphasia', description: 'Fluent speech, preserved auditory comprehension and repetition, primary deficit is word-finding (anomia).' },
      { name: 'Transcortical Motor Aphasia', description: 'Non-fluent speech, preserved auditory comprehension, preserved repetition.' },
      { name: 'Transcortical Sensory Aphasia', description: 'Fluent speech, impaired auditory comprehension, preserved repetition.' }
    ],
    assessments: [
      {
        name: 'Western Aphasia Battery-Revised',
        acronym: 'WAB-R',
        description: 'Determines aphasia type and severity (Aphasia Quotient).',
        population: 'Adults with Aphasia',
        time: '30-45 mins',
        cost: 'Paid',
        tags: ['Standardized', 'Diagnostic'],
        whatItIs: 'A comprehensive assessment designed to evaluate the main clinical aspects of language function: content, fluency, auditory comprehension, repetition, and naming.',
        whatItContains: 'Spontaneous speech (conversational questions, picture description), auditory verbal comprehension (yes/no questions, auditory word recognition, sequential commands), repetition, and naming and word finding.',
        tips: [
          'Calculates an Aphasia Quotient (AQ) which provides a severity rating.',
          'Helps classify the patient into one of the classic aphasia syndromes (e.g., Broca\'s, Wernicke\'s, Global).',
          'The bedside version can be completed in about 15 minutes.'
        ],
        limitations: [
          'May not be sensitive to very mild high-level language deficits.',
          'Classification system does not capture all patients (some have "unclassifiable" aphasia).'
        ]
      },
      {
        name: 'Boston Diagnostic Aphasia Examination',
        acronym: 'BDAE-3',
        description: 'Comprehensive assessment of language and communication.',
        population: 'Adults with Aphasia',
        time: '60-90 mins',
        cost: 'Paid',
        tags: ['Standardized', 'Diagnostic'],
        instructions: '1. Administer the core subtests (conversational speech, auditory comprehension, oral expression). 2. Profile speech characteristics. 3. Classify aphasia type based on the profile.',
        whatItIs: 'A comprehensive, standardized battery that evaluates a broad range of language skills and helps diagnose the presence and type of aphasia.',
        whatItContains: 'Subtests covering conversational and expository speech, auditory comprehension, oral expression, reading, and writing.',
        tips: [
          'The "Cookie Theft" picture description task is a classic and widely used component.',
          'Provides a detailed profile of the patient\'s language strengths and weaknesses.',
          'Includes a short form for quicker administration.'
        ],
        limitations: [
          'The full version is very lengthy and can be fatiguing for patients.',
          'Scoring can be complex and time-consuming.'
        ]
      },
      {
        name: 'Boston Naming Test',
        acronym: 'BNT',
        description: 'Assesses confrontation naming.',
        population: 'Aphasia',
        time: '10-15 mins',
        cost: 'Paid',
        tags: ['Naming', 'Standardized'],
        instructions: '1. Present 60 line drawings. 2. Provide semantic/phonemic cues if needed. 3. Score based on spontaneous vs. cued naming.',
        whatItIs: 'A widely used assessment of confrontational word retrieval (naming pictures).',
        whatItContains: '60 line drawings of objects, arranged from most common (e.g., bed, tree) to least common (e.g., abacus, trellis).',
        tips: [
          'Allows for semantic and phonemic cues if the patient is unable to name the item spontaneously.',
          'Useful for tracking progress in naming over time.',
          'A 15-item short form is available.'
        ],
        limitations: [
          'Only assesses single-word naming of nouns; does not evaluate verbs or connected speech.',
          'Some items may be culturally biased or outdated.'
        ]
      },
      {
        name: 'Communication Activities of Daily Living',
        acronym: 'CADL-3',
        description: 'Assesses functional communication skills.',
        population: 'Aphasia',
        time: '30 mins',
        cost: 'Paid',
        tags: ['Functional', 'Standardized'],
        instructions: '1. Administer the 50 functional communication items. 2. Allow for non-verbal responses (e.g., pointing, gesturing) if they successfully convey the message. 3. Score based on communication success, not linguistic accuracy.',
        whatItIs: 'An assessment that evaluates the functional communication skills of adults with neurogenic communication disorders. It focuses on how well a person can communicate in everyday situations, rather than just their linguistic accuracy.',
        whatItContains: '50 items assessing reading, writing, and using numbers; social interaction; divergent communication; contextual communication; nonverbal communication; sequential relationships; and humor/metaphor/absurdity.',
        tips: [
          'Scoring allows for non-verbal responses (e.g., pointing, gesturing) to be counted as correct if they successfully convey the message.',
          'Excellent for setting functional goals and demonstrating the real-world impact of therapy.'
        ],
        limitations: [
          'Does not provide a detailed linguistic profile (e.g., won\'t tell you if the patient has a specific syntactic deficit).',
          'Some items may feel artificial in a clinical setting.'
        ]
      },
      {
        name: 'Aphasia Rapid Test',
        acronym: 'ART',
        description: 'Brief screening for acute aphasia.',
        population: 'Acute Stroke',
        time: '5 mins',
        cost: 'Free',
        tags: ['Screening', 'Acute'],
        instructions: '1. Administer the 5-minute screening tasks (naming, repetition, comprehension). 2. Score performance. 3. Use to determine the need for a comprehensive aphasia evaluation.'
      },
      {
        name: 'Mississippi Aphasia Screening Test',
        acronym: 'MAST',
        description: 'Brief, free screening tool for expressive and receptive aphasia.',
        population: 'Aphasia, Stroke',
        time: '5-15 mins',
        cost: 'Free',
        link: 'https://www.sralab.org/rehabilitation-measures/mississippi-aphasia-screening-test',
        tags: ['Screening', 'Standardized'],
        whatItIs: 'A brief screening tool designed to detect changes in language abilities over time in patients with aphasia. It is freely available online as a PDF.',
        whatItContains: 'Nine subtests evaluating expressive (naming, automatic speech, repetition, verbal fluency, writing) and receptive (yes/no questions, object recognition, following instructions, reading) language skills.',
        tips: [
          'Excellent for bedside screening in acute care or inpatient rehab.',
          'Can be administered quickly and repeated to track spontaneous recovery or early treatment effects.',
          'Freely available online, making it highly accessible.'
        ],
        limitations: [
          'It is a screening tool, not a comprehensive diagnostic battery.',
          'May not detect very mild or high-level language deficits.'
        ]
      }
    ],
    treatments: [
      {
        name: 'Semantic Feature Analysis',
        acronym: 'SFA',
        description: 'Strengthening semantic networks to improve naming.',
        evidenceLevel: 'High',
        candidates: 'Anomia (Fluent or Non-fluent).',
        instructions: 'Describe Group, Use, Action, Properties, Location, Association.',
        tags: ['Naming', 'Semantics'],
        whatItIs: 'A therapy technique that focuses on the meaning-based properties of nouns. People with aphasia describe each feature of a word in a systematic way to elicit the target word.',
        tips: [
          'Use a visual graphic organizer (the SFA chart) to help the patient map out the features.',
          'Even if the patient cannot name the target word, generating the features strengthens the semantic network.',
          'Encourage the patient to use the chart independently as a compensatory strategy.'
        ],
        limitations: [
          'Generalization to untrained words is variable.',
          'May be too complex for patients with severe cognitive or auditory comprehension deficits.'
        ],
        documentationTips: 'Document the target word, features generated, and patient\'s ability to name the target.',
        references: ['ASHA Practice Portal: Aphasia']
      },
      {
        name: 'Verb Network Strengthening',
        acronym: 'VNeST',
        description: 'Focuses on verbs to prime agents and patients.',
        evidenceLevel: 'High',
        candidates: 'Aphasia with naming/sentence deficits.',
        instructions: 'Generate agents (who) and patients (what) for target verbs.',
        tags: ['Syntax', 'Naming'],
        whatItIs: 'A treatment that aims to improve lexical retrieval of words in sentence context by targeting verbs and their thematic roles (agents and patients).',
        tips: [
          'Start with a target verb (e.g., "measure") and have the patient generate 3-4 who/what pairs (e.g., "carpenter measures wood", "chef measures flour").',
          'Read the sentences aloud to reinforce the connections.',
          'Can improve both single-word naming and sentence production.'
        ],
        limitations: [
          'Requires the ability to understand the concept of verbs, agents, and patients.',
          'May be challenging for patients with severe aphasia or cognitive deficits.'
        ],
        documentationTips: 'Document the target verb, agents/patients generated, and patient\'s ability to produce sentences.',
        references: ['ASHA Practice Portal: Aphasia']
      },
      {
        name: 'Melodic Intonation Therapy',
        acronym: 'MIT',
        description: 'Uses melody and rhythm to recruit right hemisphere.',
        evidenceLevel: 'High',
        candidates: 'Severe non-fluent aphasia, good auditory comprehension.',
        instructions: '1. Begin with humming simple, functional phrases in a melodic, rhythmic pattern. 2. Have the patient sing the phrase in unison with the clinician. 3. Gradually fade the clinician\'s voice. 4. Have the patient repeat the phrase independently. 5. Transition to speaking the phrase in a natural, prosodic manner.',
        tags: ['Non-fluent', 'Restorative'],
        whatItIs: 'A structured program that uses the musical elements of speech (melody and rhythm) to improve expressive language by capitalizing on intact right hemisphere function.',
        tips: [
          'Strictly follow the hierarchy: humming, unison singing, unison with fading, immediate repetition, response to a question.',
          'Use high-probability, functional phrases (e.g., "I love you," "I need to go to the bathroom").',
          'Tap the patient\'s left hand with each syllable to engage the right hemisphere motor cortex.'
        ],
        limitations: [
          'Only effective for a very specific patient profile (severe Broca\'s aphasia, good comprehension, motivated).',
          'Requires specialized training to administer correctly.'
        ],
        contraindications: 'Severe cognitive impairment, poor auditory comprehension.',
        documentationTips: 'Document the phrases used, level of cueing provided, and patient\'s ability to produce the melody/rhythm.',
        references: ['ASHA Practice Portal: Aphasia']
      },
      {
        name: 'Constraint-Induced Language Therapy',
        acronym: 'CILT',
        description: 'Forced use of verbal language, restricting compensatory strategies.',
        evidenceLevel: 'Moderate',
        candidates: 'Chronic aphasia.',
        tags: ['Intensive', 'Restorative'],
        instructions: '1. Deliver in an intensive format (e.g., 3 hours/day). 2. Constrain the patient to use only spoken language. 3. Use structured tasks (e.g., card games) to elicit verbal requests.',
        whatItIs: 'An intensive therapy approach modeled after Constraint-Induced Movement Therapy (CIMT) in physical therapy. It forces the use of spoken language by constraining (preventing) the use of compensatory strategies like gesturing, writing, or drawing.',
        tips: [
          'Typically delivered in an intensive format (e.g., 3 hours a day, 5 days a week for 2 weeks).',
          'Often uses a "Go Fish" style card game format where patients must verbally request specific cards from each other.',
          'Gradually increase the complexity of the required verbal response (e.g., from "Dog" to "I want the dog").'
        ],
        limitations: [
          'Can be extremely frustrating and fatiguing for patients.',
          'Requires a high level of motivation and commitment.',
          'May not be appropriate for patients with very severe apraxia or global aphasia.'
        ],
        contraindications: 'Severe apraxia, global aphasia, low motivation.',
        documentationTips: 'Document the intensive schedule, constraints used, and patient\'s verbal responses.',
        references: ['ASHA Practice Portal: Aphasia']
      },
      {
        name: 'Script Training',
        description: 'Drilling personally relevant conversational scripts.',
        evidenceLevel: 'High',
        candidates: 'Non-fluent aphasia, Apraxia.',
        tags: ['Functional', 'Social'],
        instructions: '1. Co-create personally relevant scripts. 2. Practice intensively using a hierarchy of cues (choral reading, independent reading, memory). 3. Use audio/video recordings for home practice.',
        whatItIs: 'A functional approach where the clinician and patient co-create scripts for specific, personally relevant situations (e.g., ordering coffee, talking to a grandchild on the phone, telling a joke). The scripts are then practiced intensively until they become automatic.',
        tips: [
          'Start with short, simple scripts and gradually increase length and complexity.',
          'Use a hierarchy of cues: choral reading (reading together), independent reading, and finally, speaking from memory.',
          'Incorporate audio or video recordings for the patient to practice with at home.'
        ],
        limitations: [
          'The learned scripts may not generalize to novel conversational situations.',
          'Requires the patient to have some preserved ability to repeat or read aloud.'
        ],
        documentationTips: 'Document the script topics, cueing level, and patient\'s ability to produce the script automatically.',
        references: ['ASHA Practice Portal: Aphasia']
      }
    ],
    resources: [
      {
        title: 'Aphasia Institute: What is Aphasia?',
        description: 'Patient-friendly guide to aphasia types.',
        type: 'Handout',
        url: 'https://www.aphasia.ca/what-is-aphasia/'
      },
      {
        title: 'Supported Conversation for Adults with Aphasia (SCA)',
        description: 'Training module for communication partners.',
        type: 'Training',
        url: 'https://www.aphasia.ca/community-training/supported-conversation-for-adults-with-aphasia-sca/'
      },
      {
        title: 'Stroke Association: Communication Problems',
        description: 'Comprehensive guide for families.',
        type: 'Handout',
        url: 'https://www.stroke.org.uk/effects-of-stroke/communication-problems'
      }
    ],
    visuals: [
      {
        title: 'Language Centers: Broca\'s & Wernicke\'s (3D)',
        type: 'image',
        thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80&w=800',
        description: 'Detailed 3D visualization of language centers in the left hemisphere, highlighting Broca\'s and Wernicke\'s areas.'
      },
      {
        title: 'AAC: Communication Board (2D/3D)',
        type: 'image',
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
        description: 'Example of a low-tech AAC communication board for basic needs, demonstrating 2D/3D icon layout.'
      }
    ]
  },
  'motor-speech': {
    id: 'motor-speech',
    title: 'Motor Speech Disorders',
    overview: {
      whatItIs: 'Motor speech disorders include dysarthria (impaired execution) and apraxia of speech (impaired planning/programming) of the motor movements required for speech.',
      whyItHappens: 'Stroke, TBI, Parkinson\'s Disease, ALS, MS, Cerebral Palsy, Brainstem tumors.',
      deficits: [
        'Respiration (breath support, coordination)',
        'Phonation (voice quality, pitch, loudness)',
        'Resonance (nasality)',
        'Articulation (clarity, precision)',
        'Prosody (rate, rhythm, intonation, stress)',
        'Velopharyngeal insufficiency'
      ],
      symptoms: [
        'Slurred or mumbled speech',
        'Slow rate of speech',
        'Rapid rate of speech with a "mumbling" quality',
        'Limited tongue, lip, and jaw movement',
        'Abnormal pitch and rhythm (monopitch, monoloudness)',
        'Changes in voice quality (hoarse, breathy, nasal, strained, hypernasal)',
        'Inconsistent articulatory errors (Apraxia)',
        'Groping behaviors (Apraxia)'
      ],
      clinicalPearl: 'Differential diagnosis between Dysarthria (muscle weakness/coordination) and Apraxia (motor planning) is critical as treatments differ significantly. Always assess for co-occurring aphasia or dysphagia.',
      bestPractices: [
        'Focus on maximizing intelligibility, not just "perfect" speech.',
        'Use compensatory strategies like "Clear Speech" and pacing boards.',
        'Address respiratory support first if it is the underlying impairment.',
        'Involve communication partners in strategy training.',
        'Consider AAC early for severe motor speech disorders to reduce frustration.'
      ]
    },
    types: [
      { name: 'Flaccid Dysarthria', description: 'Caused by lower motor neuron damage, characterized by weakness, hypotonia, and atrophy.' },
      { name: 'Spastic Dysarthria', description: 'Caused by bilateral upper motor neuron damage, characterized by spasticity, weakness, and limited range of motion.' },
      { name: 'Ataxic Dysarthria', description: 'Caused by cerebellar damage, characterized by incoordination, irregular articulatory breakdowns, and prosodic abnormalities.' },
      { name: 'Hypokinetic Dysarthria', description: 'Caused by basal ganglia damage (e.g., Parkinson\'s), characterized by reduced range of motion, rapid rate, and monopitch/monoloudness.' },
      { name: 'Hyperkinetic Dysarthria', description: 'Caused by basal ganglia damage (e.g., Huntington\'s), characterized by involuntary movements, variable rate, and prosodic disturbances.' },
      { name: 'Mixed Dysarthria', description: 'Caused by damage to multiple motor systems, characterized by a combination of symptoms from different dysarthria types.' },
      { name: 'Unilateral Upper Motor Neuron (UUMN) Dysarthria', description: 'Caused by unilateral upper motor neuron damage, characterized by mild weakness, often transient.' }
    ],
    assessments: [
      {
        name: 'Frenchay Dysarthria Assessment',
        acronym: 'FDA-2',
        description: 'Differentiates types of dysarthria.',
        population: 'Motor Speech Disorders',
        time: '30 mins',
        cost: 'Paid',
        tags: ['Diagnostic', 'Standardized'],
        whatItIs: 'A standardized assessment that evaluates the function of the speech mechanism (reflexes, respiration, lips, palate, laryngeal, tongue, intelligibility, and influencing factors).',
        whatItContains: 'Tasks evaluating both non-speech oral motor function and speech tasks, rated on a 9-point scale.',
        tips: [
          'The resulting profile helps differentiate between the various types of dysarthria (e.g., flaccid, spastic, ataxic).',
          'Useful for establishing a baseline and measuring changes over time.'
        ],
        limitations: [
          'Relies heavily on perceptual judgments, which can be subjective.',
          'Does not provide a detailed acoustic or physiological analysis.'
        ]
      },
      {
        name: 'Assessment of Intelligibility of Dysarthric Speech',
        acronym: 'AIDS',
        description: 'Measures single word and sentence intelligibility.',
        population: 'Dysarthria',
        time: '20 mins',
        cost: 'Paid',
        tags: ['Intelligibility', 'Standardized'],
        whatItIs: 'A tool designed to quantify speech intelligibility and speaking rate in individuals with dysarthria.',
        whatItContains: 'The patient reads or repeats single words and sentences. A naive listener then transcribes the recordings to determine the percentage of words understood.',
        tips: [
          'Provides a highly objective measure of intelligibility, which is crucial for documenting progress and justifying services.',
          'Can also be used to calculate speaking rate (words per minute) and rate of intelligible speech.'
        ],
        limitations: [
          'Requires a second, unfamiliar listener to score the test accurately, which can be logistically challenging in some clinical settings.',
          'Does not identify the underlying physiological cause of the intelligibility deficit.'
        ]
      },
      {
        name: 'Apraxia Battery for Adults',
        acronym: 'ABA-2',
        description: 'Verifies presence and severity of apraxia.',
        population: 'Apraxia',
        time: '20 mins',
        cost: 'Paid',
        tags: ['Apraxia', 'Standardized'],
        whatItIs: 'A standardized assessment designed specifically to verify the presence of apraxia of speech in adults and to estimate its severity.',
        whatItContains: 'Six subtests: Diadochokinetic Rate, Increasing Word Length, Limb Apraxia and Oral Apraxia, Latency Time and Utterance Time for Polysyllabic Words, Repeated Trials Test, and Inventory of Articulation Characteristics of Apraxia.',
        tips: [
          'The "Increasing Word Length" subtest (e.g., thick, thicken, thickening) is particularly sensitive to apraxia, as errors typically increase with word length and complexity.',
          'Helps differentiate apraxia of speech from aphasia and dysarthria.'
        ],
        limitations: [
          'Does not provide a comprehensive assessment of language (aphasia) or other motor speech disorders (dysarthria).',
          'Some tasks may be difficult for patients with severe aphasia to understand.'
        ]
      },
      {
        name: 'Motor Speech Examination',
        acronym: 'MSE',
        description: 'Comprehensive clinical examination of speech subsystems.',
        population: 'All',
        time: '15-20 mins',
        cost: 'Free',
        tags: ['Diagnostic', 'Bedside'],
        instructions: '1. Assess respiration (e.g., breath support for speech). 2. Assess phonation (e.g., sustained vowel /a/). 3. Assess resonance (e.g., nasal vs. oral sounds). 4. Assess articulation (e.g., diadochokinetic rates /pa-ta-ka/). 5. Assess prosody (e.g., stress, rate, rhythm).'
      },
    ],
    treatments: [
      {
        name: 'LSVT LOUD',
        description: 'High-effort, intensive treatment for vocal loudness.',
        evidenceLevel: 'High',
        candidates: 'Parkinsons, Hypokinetic Dysarthria.',
        tags: ['Intensive', 'Certification Required'],
        whatItIs: 'An intensive, amplitude-based exercise program for the speech motor system. The core focus is on increasing vocal loudness ("Think LOUD").',
        tips: [
          'Requires strict adherence to the protocol: 4 days a week for 4 weeks (16 sessions).',
          'Focuses on sensory recalibration (helping the patient recognize that their "loud" voice is actually normal loudness).',
          'Must be administered by an LSVT-certified clinician.'
        ],
        limitations: [
          'The intensive schedule can be difficult for some patients to maintain.',
          'Primarily targets hypokinetic dysarthria; may not be appropriate for other types (e.g., spastic or flaccid).'
        ],
        contraindications: 'Severe cognitive impairment, inability to participate in intensive protocol.',
        documentationTips: 'Document the loudness levels, session attendance, and patient\'s ability to maintain vocal effort.',
        references: ['ASHA Practice Portal: Motor Speech Disorders']
      },
      {
        name: 'Clear Speech Strategies',
        description: 'Over-articulation and reduced rate.',
        evidenceLevel: 'High',
        candidates: 'Various dysarthrias.',
        instructions: 'Speak as if talking to someone with hearing loss.',
        tags: ['Compensatory', 'Functional'],
        whatItIs: 'A compensatory approach where the speaker is instructed to deliberately over-articulate and slow their rate of speech to maximize intelligibility.',
        tips: [
          'Use analogies like "speak as if you are talking to someone who is hard of hearing" or "pronounce every single sound in the word."',
          'Often combined with pacing strategies (e.g., tapping on a board for each word).',
          'Highly functional and can be implemented immediately.'
        ],
        limitations: [
          'Requires the patient to constantly monitor their speech, which can be cognitively taxing.',
          'Speech may sound unnatural or robotic.'
        ],
        contraindications: 'Severe cognitive impairment, significant fatigue.',
        documentationTips: 'Document the strategies used, patient\'s ability to self-monitor, and impact on intelligibility.',
        references: ['ASHA Practice Portal: Motor Speech Disorders']
      },
      {
        name: 'Breath Stacking',
        description: 'Exercises to increase vital capacity for speech.',
        evidenceLevel: 'Moderate',
        candidates: 'Respiratory weakness.',
        tags: ['Respiratory', 'Physiological'],
        whatItIs: 'A technique used to increase lung volume and improve cough effectiveness in patients with severe respiratory muscle weakness (e.g., ALS, spinal cord injury).',
        whatItContains: 'The patient takes a series of consecutive, unexhaled breaths (stacking them) using a manual resuscitator bag or a one-way valve, followed by a forced exhalation or cough.',
        tips: [
          'Can be done with a manual resuscitator bag (Ambu bag) and a one-way valve.',
          'Helps maintain chest wall compliance and prevents atelectasis.',
          'Improves the volume of air available for speech production.'
        ],
        limitations: [
          'Requires specialized equipment and training to administer safely.',
          'Contraindicated for patients with certain respiratory conditions (e.g., severe COPD, pneumothorax).'
        ],
        contraindications: 'Severe COPD, pneumothorax, unstable cardiovascular status.',
        documentationTips: 'Document the volume of air stacked, cough effectiveness, and patient tolerance.',
        references: ['ASHA Practice Portal: Motor Speech Disorders']
      },
      {
        name: 'Pacing Boards',
        description: 'External aid to reduce rate of speech.',
        evidenceLevel: 'Moderate',
        candidates: 'Hypokinetic or Ataxic dysarthria with rapid rate.',
        tags: ['Compensatory', 'Device'],
        instructions: '1. Provide a pacing board with visual markers. 2. Instruct the patient to tap one marker for each word or syllable. 3. Use this to slow the rate of speech and improve intelligibility.',
        contraindications: 'Severe cognitive impairment, lack of fine motor control.',
        documentationTips: 'Document the pacing strategy used, patient\'s ability to follow the rhythm, and impact on intelligibility.',
        references: ['ASHA Practice Portal: Motor Speech Disorders']
      },
      {
        name: 'Sound Production Treatment',
        description: 'Articulatory kinematic approach for apraxia.',
        evidenceLevel: 'High',
        candidates: 'Apraxia of Speech.',
        tags: ['Apraxia', 'Restorative'],
        whatItIs: 'An articulatory-kinematic treatment for apraxia of speech that focuses on improving the spatial and temporal aspects of speech production. It uses a hierarchy of cues to elicit correct production of target sounds in words or phrases.',
        whatItContains: 'A structured 4-step hierarchy: 1. Produce target word/phrase. 2. Clinician models, patient repeats. 3. Integral stimulation (watch, listen, say it with me). 4. Articulatory placement cues and modeling.',
        tips: [
          'Focuses on minimal pairs (e.g., "pie" vs. "bye") to highlight the specific articulatory feature being targeted.',
          'Provides frequent, specific feedback on the accuracy of the movement, not just the sound.',
          'Highly individualized based on the patient\'s specific error patterns.'
        ],
        limitations: [
          'Can be intensive and require significant practice.',
          'May not be suitable for patients with severe cognitive or auditory comprehension deficits.'
        ],
        contraindications: 'Severe cognitive impairment, inability to attend to articulatory placement.',
        documentationTips: 'Document the target phonemes, cueing level, and patient\'s accuracy in production.',
        references: ['ASHA Practice Portal: Motor Speech Disorders']
      },
      {
        name: 'AAC (Augmentative and Alternative Communication)',
        description: 'Using low-tech or high-tech devices to support communication.',
        evidenceLevel: 'High',
        candidates: 'Severe dysarthria or apraxia.',
        tags: ['Compensatory', 'AAC'],
        instructions: '1. Assess the patient\'s communication needs and abilities. 2. Select an appropriate AAC system (low-tech or high-tech). 3. Train the patient and caregivers on how to use the system effectively. 4. Monitor and adjust the system as needed.',
        contraindications: 'None specific, but may be inappropriate if the patient has sufficient speech intelligibility.',
        documentationTips: 'Document the AAC system used, patient/caregiver training, and communicative effectiveness.',
        references: ['ASHA Practice Portal: Augmentative and Alternative Communication']
      },
    ],
    resources: [
      {
        title: 'Dysarthria: Patient/Caregiver Handout',
        description: 'Information on understanding and managing dysarthria.',
        type: 'Handout',
        url: 'https://www.asha.org/public/speech/disorders/dysarthria/'
      },
      {
        title: 'Apraxia of Speech: Patient/Caregiver Handout',
        description: 'Information on understanding and managing apraxia of speech.',
        type: 'Handout',
        url: 'https://www.asha.org/public/speech/disorders/apraxia-of-speech-in-adults/'
      }
    ],
    visuals: [
      {
        title: 'Respiratory System for Speech',
        type: 'image',
        thumbnail: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=800',
        description: 'Diaphragm and intercostal muscles role in phonation.'
      },
      {
        title: 'Articulators in Motion',
        type: 'video',
        thumbnail: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800',
        description: 'MRI of speech production.'
      }
    ]
  },
  'voice': {
    id: 'voice',
    title: 'Voice Disorders',
    overview: {
      whatItIs: 'Voice disorders occur when voice quality, pitch, and loudness differ or are inappropriate for an individual\'s age, gender, cultural background, or geographic location.',
      whyItHappens: 'Functional (misuse/abuse, muscle tension), Organic (structural changes like nodules, polyps, cysts, Reinke\'s edema), or Neurogenic (paralysis, spasmodic dysphonia, tremor).',
      deficits: [
        'Phonation (quality)',
        'Resonance',
        'Pitch control',
        'Loudness control',
        'Respiratory support',
        'Vocal fold atrophy',
        'Glottal insufficiency'
      ],
      symptoms: [
        'Hoarseness / Roughness',
        'Breathiness',
        'Vocal fatigue',
        'Aphonia (loss of voice)',
        'Pain/Strain while speaking',
        'Reduced pitch range',
        'Diplophonia (two pitches at once)',
        'Vocal tremor'
      ],
      clinicalPearl: 'Always refer for ENT visualization (stroboscopy) before initiating voice therapy to rule out pathology that requires medical/surgical management. Functional voice disorders often require a multidisciplinary approach (SLP, ENT, Psych).',
      bestPractices: [
        'Hygiene first: Hydration, irritant reduction (caffeine, alcohol), and vocal rest.',
        'Direct therapy: Resonant Voice, VFE, SOVT.',
        'Psychogenic: Counseling and laryngeal massage for muscle tension.',
        'Use acoustic measures (jitter/shimmer/HNR) and aerodynamic measures for baselines.',
        'Focus on vocal stamina and participation impact.'
      ]
    },
    assessments: [
      {
        name: 'CAPE-V',
        description: 'Consensus Auditory-Perceptual Evaluation of Voice.',
        population: 'Voice Disorders',
        time: '10 mins',
        cost: 'Free',
        tags: ['Perceptual', 'Standardized'],
        whatItIs: 'A standardized protocol for the perceptual evaluation of voice quality, developed by ASHA.',
        whatItContains: 'Clinicians rate six core vocal attributes (Overall Severity, Roughness, Breathiness, Strain, Pitch, and Loudness) on a 100mm visual analog scale during sustained vowels, specific sentences, and conversational speech.',
        tips: [
          'The specific sentences are designed to elicit different vocal behaviors (e.g., "We were away a year ago" is all voiced; "The blue spot is on the key" includes hard glottal attacks).',
          'Provides a common language for clinicians to describe voice quality.'
        ],
        limitations: [
          'Highly subjective; relies entirely on the clinician\'s ear.',
          'Requires training and experience to achieve reliable ratings.'
        ]
      },
      {
        name: 'Voice Handicap Index',
        acronym: 'VHI-10',
        description: 'Patient-reported impact of voice problem.',
        population: 'Voice Disorders',
        time: '5 mins',
        cost: 'Free',
        tags: ['PROM', 'QoL'],
        whatItIs: 'A 10-item patient-reported outcome measure (PROM) that quantifies the psychosocial impact of a voice disorder.',
        whatItContains: 'Statements about how the voice problem affects the patient\'s daily life (e.g., "My voice makes it difficult for people to hear me"). Rated on a 5-point scale (0=never, 4=always).',
        tips: [
          'A score > 11 is generally considered clinically significant.',
          'Crucial for documenting the functional impact of the disorder, which is often required for insurance reimbursement.',
          'Can be used to track progress and patient satisfaction over time.'
        ],
        limitations: [
          'Does not measure the physiological severity of the voice disorder, only the patient\'s perception of it.',
          'May be influenced by the patient\'s mood or psychological state.'
        ]
      },
      {
        name: 'Maximum Phonation Time',
        acronym: 'MPT',
        description: 'Sustained /a/ to assess respiratory/phonatory efficiency.',
        population: 'All',
        time: '< 1 min',
        cost: 'Free',
        tags: ['Aerodynamic', 'Bedside'],
        whatItIs: 'A simple aerodynamic measure of how long a person can sustain phonation on a single breath.',
        whatItContains: 'The patient takes a deep breath and sustains the vowel /a/ at a comfortable pitch and loudness for as long as possible. Usually, the longest of three trials is recorded.',
        tips: [
          'Normal MPT for adult females is ~15-25 seconds; for adult males, ~20-30 seconds.',
          'A significantly reduced MPT may indicate respiratory weakness or glottal insufficiency (e.g., vocal fold paralysis).',
          'Often used in conjunction with the s/z ratio.'
        ],
        limitations: [
          'Highly variable and dependent on patient effort and instruction.',
          'Does not differentiate between respiratory and laryngeal causes of reduced duration.'
        ]
      },
      {
        name: 'Vocal Fatigue Index',
        acronym: 'VFI',
        description: 'Assesses vocal fatigue symptoms.',
        population: 'Voice Disorders',
        time: '5 mins',
        cost: 'Free',
        tags: ['PROM', 'Fatigue'],
        instructions: '1. Administer the 18-item questionnaire. 2. Have the patient rate each item on a 5-point scale (0: never, 4: always). 3. Calculate the total score and domain scores. 4. Use the results to assess the severity and impact of vocal fatigue.'
      },
    ],
    treatments: [
      {
        name: 'Resonant Voice Therapy',
        acronym: 'RVT',
        description: 'Focus on oral vibratory sensations to unload laryngeal tension.',
        evidenceLevel: 'High',
        candidates: 'Muscle Tension Dysphonia, lesions.',
        instructions: '1. "Mmm" humming: Have the patient hum gently, focusing on feeling the vibration in the lips and nose. 2. "Mmm" to vowel: Transition from the hum to a vowel (e.g., "mee", "moo") while maintaining the "forward" vibration. 3. Word/Phrase level: Use nasal-heavy phrases (e.g., "Mom, may I move more?") to reinforce the sensation. 4. Conversation: Carry over the "forward focus" into conversational speech.',
        tags: ['Physiological', 'Holistic'],
        whatItIs: 'A physiologic voice therapy approach that aims to achieve the strongest, "cleanest" voice with the least amount of effort and impact stress on the vocal folds.',
        tips: [
          'Focuses on feeling vibrations in the anterior oral cavity (lips, teeth, facial bones) rather than the throat.',
          'Uses a hierarchy starting with nasal consonants (/m/, /n/) and progressing to words, phrases, and conversation.',
          'Requires the patient to be highly aware of kinesthetic feedback.'
        ],
        limitations: [
          'Can be difficult for patients with poor body awareness to grasp the concept of "forward focus."',
          'Requires consistent daily practice to establish the new motor pattern.'
        ]
      },
      {
        name: 'Vocal Function Exercises',
        acronym: 'VFE',
        description: 'Systematic exercises to strengthen and coordinate laryngeal muscles.',
        evidenceLevel: 'High',
        candidates: 'Presbyphonia, weakness, post-op.',
        tags: ['Physiological', 'Strengthening'],
        whatItIs: 'A structured, physiologic therapy program designed to strengthen and balance the laryngeal musculature, improve vocal fold closure, and enhance respiratory-phonatory coordination.',
        tips: [
          'Consists of four specific exercises: Warm-up (sustained /i/), Stretching (glides up), Contracting (glides down), and Power (sustained musical notes).',
          'Exercises should be done twice a day, two times each.',
          'Emphasize a soft, engaged, and forward-focused voice during the exercises; avoid pressing or straining.'
        ],
        limitations: [
          'The structured, repetitive nature of the exercises can be boring for some patients.',
          'Requires the patient to be able to match pitches (can be modified if they cannot).'
        ]
      },
      {
        name: 'Semi-Occluded Vocal Tract',
        acronym: 'SOVT',
        description: 'Straw phonation or lip trills to improve efficiency.',
        evidenceLevel: 'High',
        candidates: 'Various voice disorders.',
        tags: ['Aerodynamic', 'Warm-up'],
        instructions: '1. Have the patient phonate through a straw (small diameter) or perform lip trills. 2. Focus on maintaining a steady, relaxed airflow. 3. Gradually transition to vowels and words while maintaining the SOVT sensation.'
      },
      {
        name: 'Circumlaryngeal Massage',
        description: 'Manual therapy to reduce laryngeal tension.',
        evidenceLevel: 'Moderate',
        candidates: 'Muscle Tension Dysphonia.',
        tags: ['Manual', 'Relaxation'],
        instructions: '1. Gently massage the muscles around the larynx (hyoid bone, thyroid cartilage). 2. Focus on areas of tension or tenderness. 3. Encourage the patient to relax these muscles during phonation.'
      },
      {
        name: 'Vocal Hygiene Education',
        description: 'Education on hydration, irritant reduction, and vocal pacing.',
        evidenceLevel: 'High',
        candidates: 'All voice disorders.',
        tags: ['Compensatory', 'Education'],
        instructions: '1. Educate the patient on the importance of hydration (water intake). 2. Identify and reduce vocal irritants (e.g., caffeine, alcohol, smoke). 3. Teach vocal pacing and rest strategies (e.g., avoiding shouting, taking vocal naps).'
      }
    ],
    resources: [
      {
        title: 'Vocal Hygiene Handout',
        description: 'Practical tips for maintaining vocal health.',
        type: 'Handout',
        url: 'https://www.nidcd.nih.gov/health/taking-care-your-voice'
      },
      {
        title: 'Voice Therapy Exercises Guide',
        description: 'General guide to common voice therapy exercises.',
        type: 'Handout',
        url: 'https://www.asha.org/practice-portal/clinical-topics/voice-disorders/'
      }
    ],
    visuals: [
      {
        title: 'Vocal Folds Stroboscopy',
        type: 'video',
        thumbnail: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800',
        description: 'Vibration of true vocal folds.'
      }
    ]
  },
  'fluency': {
    id: 'fluency',
    title: 'Fluency Disorders (Adult)',
    overview: {
      whatItIs: 'Fluency disorders in adults primarily include Neurogenic Stuttering (acquired post-stroke/TBI) and Cluttering (rapid/irregular speech rate with reduced intelligibility).',
      whyItHappens: 'Neurogenic: CVA, TBI, neurodegenerative disease. Cluttering: complex, often comorbid with other neurodevelopmental/acquired conditions.',
      deficits: [
        'Speech continuity',
        'Rate of speech',
        'Effort/Tension',
        'Social-emotional impact',
        'Intelligibility (cluttering)'
      ],
      symptoms: [
        'Repetitions (sound, syllable, monosyllabic word)',
        'Prolongations',
        'Blocks (silent or audible)',
        'Secondary behaviors (eye blinking, tension)',
        'Rapid/irregular rate (cluttering)',
        'Avoidance of words/situations'
      ],
      clinicalPearl: 'Therapy should address both the surface behaviors (speech) and the "below the surface" feelings/attitudes (iceberg analogy).',
      bestPractices: [
        'Combine fluency shaping and stuttering modification.',
        'Address desensitization and acceptance.',
        'Focus on effective communication, not just fluent speech.',
        'Involve workplace/family for adult-focused communication strategies.'
      ]
    },
    assessments: [
      {
        name: 'Stuttering Severity Instrument',
        acronym: 'SSI-4',
        description: 'Standardized measure of frequency, duration, and physical concomitants.',
        population: 'Adults',
        time: '20-30 mins',
        cost: 'Paid',
        tags: ['Standardized', 'Severity'],
        whatItIs: 'A reliable and valid norm-referenced stuttering assessment that measures stuttering severity in adults.',
        whatItContains: 'It assesses four areas: frequency (percent syllables stuttered), duration (length of the longest stuttering events), physical concomitants (distracting sounds, facial grimaces, head movements, movements of the extremities), and naturalness of the individual\'s speech.',
        tips: [
          'Requires video or audio recording of the client in multiple speaking tasks (e.g., reading and conversation).',
          'The total score is converted to a severity equivalent (e.g., Mild, Moderate, Severe).',
          'Does not measure the emotional or cognitive impact of stuttering.'
        ],
        limitations: [
          'Can be time-consuming to transcribe and analyze the speech samples.',
          'Severity can vary significantly depending on the speaking situation and the listener.'
        ]
      },
      {
        name: 'OASES-A',
        description: 'Overall Assessment of the Speaker\'s Experience of Stuttering (Adult).',
        population: 'Adults',
        time: '20 mins',
        cost: 'Paid',
        tags: ['QoL', 'Impact'],
        whatItIs: 'A comprehensive questionnaire designed to measure the impact of stuttering on a person\'s life, based on the WHO\'s International Classification of Functioning, Disability and Health (ICF) framework.',
        whatItContains: 'Sections covering general information about stuttering, reactions to stuttering, communication in daily situations, and quality of life.',
        tips: [
          'Crucial for understanding the "hidden" aspects of stuttering (the bottom of the iceberg).',
          'Helps guide therapy goals beyond just increasing fluency (e.g., reducing avoidance behaviors, improving confidence).'
        ],
        limitations: [
          'Relies on self-reporting, which requires insight and honesty from the client.',
          'Does not provide an objective measure of stuttering frequency or duration.'
        ]
      }
    ],
    treatments: [
      {
        name: 'Fluency Shaping',
        description: 'Techniques to prevent stuttering (Easy Onset, Light Contact).',
        evidenceLevel: 'High',
        candidates: 'Adults seeking increased fluency.',
        instructions: 'Focus on gentle initiation of phonation and continuous airflow.',
        tags: ['Compensatory', 'Rehabilitative'],
        whatItIs: 'A set of techniques designed to increase fluent speech by modifying the way speech is produced.',
        tips: [
          'Use easy onset for all initial sounds.',
          'Focus on light articulatory contact.',
          'Maintain continuous phonation across word boundaries.'
        ],
        limitations: [
          'Can sound unnatural if overused.',
          'Requires significant practice to generalize to conversational speech.'
        ]
      },
      {
        name: 'Stuttering Modification',
        description: 'Techniques to manage stuttering (Cancellations, Pull-outs).',
        evidenceLevel: 'High',
        candidates: 'Adults seeking to reduce struggle and tension.',
        instructions: 'Modify the stuttering event as it occurs.',
        tags: ['Rehabilitative', 'Acceptance'],
        whatItIs: 'A set of techniques designed to reduce the struggle and tension associated with stuttering, rather than preventing it entirely.',
        tips: [
          'Use cancellations to modify a stutter after it occurs.',
          'Use pull-outs to modify a stutter while it is occurring.',
          'Use preparatory sets to modify a stutter before it occurs.'
        ],
        limitations: [
          'Requires a high level of self-awareness and willingness to confront the stuttering event.'
        ]
      }
    ],
    resources: [
      {
        title: 'National Stuttering Association (NSA)',
        type: 'Organization',
        url: 'https://westutter.org/',
        description: 'Support and resources for adults who stutter.'
      },
      {
        title: 'ASHA Practice Portal: Fluency Disorders',
        type: 'Resource',
        url: 'https://www.asha.org/practice-portal/clinical-topics/fluency-disorders/',
        description: 'Evidence-based practice guidelines for fluency disorders.'
      }
    ],
    visuals: [
      {
        title: 'The Stuttering Iceberg',
        type: 'image',
        thumbnail: 'https://images.unsplash.com/photo-1549421263-58f710f7663e?auto=format&fit=crop&q=80&w=800',
        description: 'Visual representation of surface behaviors vs. hidden feelings.',
        whatItIs: 'An illustration showing that surface stuttering behaviors are only the tip of the iceberg, with fear, avoidance, and shame beneath the surface.'
      },
      {
        title: 'Neurogenic Stuttering Overview',
        type: 'video',
        thumbnail: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800',
        description: 'Overview of neurogenic stuttering mechanisms.',
        videoUrl: 'https://www.youtube.com/embed/example',
        whatItIs: 'A brief overview of the neurological mechanisms underlying acquired stuttering.'
      }
    ]
  },
  'slp-corner': {
    id: 'slp-corner',
    title: 'The SLP Lounge',
    overview: {
      whatItIs: 'A hub for professional development, career sustainability, and community connection.',
      whyItHappens: 'Burnout is real. We need a space to recharge, learn, and connect.',
      deficits: [],
      symptoms: [],
      clinicalPearl: 'You cannot pour from an empty cup. Prioritize your own well-being to be the best clinician for your patients.',
      bestPractices: [
        'Set boundaries.',
        'Seek mentorship.',
        'Engage in continuous learning.',
        'Connect with peers.'
      ]
    },
    assessments: [],
    treatments: [],
    resources: [
      {
        title: 'ASHA Career Portal',
        description: 'Job listings and career resources.',
        type: 'Link',
        url: 'https://www.asha.org/careers/'
      },
      {
        title: 'MedSLP Collective',
        description: 'Community and resources.',
        type: 'Link',
        url: 'https://medslpcollective.com/'
      }
    ],
    visuals: []
  },
  'socials': {
    id: 'socials',
    title: 'Social Communication',
    overview: {
      whatItIs: 'Social communication disorder involves difficulties with the use of verbal and nonverbal language for social purposes.',
      whyItHappens: 'TBI (frontal lobe damage), Right Hemisphere Damage, Autism Spectrum Disorder, Dementia.',
      deficits: [
        'Pragmatics (social rules)',
        'Social interaction',
        'Social cognition',
        'Pragmatic language processing'
      ],
      symptoms: [
        'Difficulty following rules for conversation and storytelling',
        'Difficulty understanding what is not explicitly stated (inferences, sarcasm)',
        'Lack of awareness of social cues',
        'Inappropriate topics or tone of voice',
        'Difficulty making and keeping friends'
      ],
      clinicalPearl: 'Social communication deficits can be subtle but have a profound impact on relationships and vocational success. Assessment must go beyond standardized tests to include observation in naturalistic settings.',
      bestPractices: [
        'Use video modeling and role-playing.',
        'Teach specific social rules and scripts.',
        'Focus on self-monitoring and awareness.',
        'Train communication partners to provide feedback.'
      ]
    },
    assessments: [
      {
        name: 'Functional Assessment of Communication Skills',
        acronym: 'ASHA-FACS',
        description: 'Measures functional communication in daily life.',
        population: 'Adults',
        time: '20 mins',
        cost: 'Paid',
        tags: ['Functional', 'Observation'],
        whatItIs: 'An observational tool designed to measure how an individual communicates in real-life situations, focusing on functional performance rather than specific linguistic deficits.',
        whatItContains: '43 items across four domains: Social Communication, Communication of Basic Needs, Reading/Writing/Number Concepts, and Daily Planning. Rated on a 7-point scale of independence.',
        tips: [
          'Best completed by someone very familiar with the patient (e.g., a spouse, caregiver, or the SLP after extended observation).',
          'Excellent for demonstrating the real-world impact of therapy interventions.'
        ],
        limitations: [
          'Subjective rating scale; relies on the observer\'s judgment.',
          'Does not diagnose the underlying cause of the communication breakdown.'
        ]
      },
      {
        name: 'La Trobe Communication Questionnaire',
        acronym: 'LCQ',
        description: 'Perceived communication ability after TBI.',
        population: 'TBI',
        time: '10 mins',
        cost: 'Free',
        tags: ['PROM', 'TBI'],
        whatItIs: 'A questionnaire that measures perceived communication ability, specifically focusing on cognitive-communication and pragmatic deficits common after traumatic brain injury.',
        whatItContains: '30 items covering behaviors like leaving out details, losing track of conversations, and talking too fast. It has two forms: one for the patient (self-report) and one for a close other (informant report).',
        tips: [
          'Comparing the self-report and informant-report scores is highly useful for assessing the patient\'s level of insight (anosognosia).',
          'Items can be used directly to formulate functional treatment goals.'
        ],
        limitations: [
          'Patients with severe insight deficits may under-report their difficulties.',
          'Primarily validated for the TBI population, though sometimes used clinically with other acquired brain injuries.'
        ]
      }
    ],
    treatments: [
      {
        name: 'Group Communication Therapy',
        description: 'Structured social interaction in group setting.',
        evidenceLevel: 'High',
        candidates: 'Aphasia, TBI.',
        tags: ['Social', 'Generalization'],
        whatItIs: 'Therapy conducted in a group setting to provide a naturalistic environment for practicing communication skills, receiving peer feedback, and reducing social isolation.',
        tips: [
          'Groups can be structured around specific activities (e.g., a book club, a cooking group) or focused on conversation and support.',
          'The SLP acts as a facilitator, guiding the interaction and providing "in-the-moment" coaching.',
          'Highly effective for generalizing skills learned in individual therapy.'
        ],
        limitations: [
          'Requires careful group composition (matching patients by cognitive/linguistic level and personality).',
          'May be overwhelming for patients with severe attention deficits or high anxiety.'
        ]
      },
      {
        name: 'Video Modeling',
        description: 'Reviewing video of self or others to identify social behaviors.',
        evidenceLevel: 'Moderate',
        candidates: 'TBI, Right Hemisphere Damage.',
        tags: ['Awareness', 'Metacognitive'],
        whatItIs: 'A technique where the patient watches a video recording of themselves or others engaging in a social interaction, followed by a structured analysis of the communication behaviors.',
        tips: [
          'Use a specific checklist or rating scale while watching the video to focus the patient\'s attention on target behaviors (e.g., eye contact, interrupting).',
          'Start by analyzing videos of *other* people before having the patient analyze themselves, to build the skill objectively.',
          'Excellent for improving self-awareness in patients with right hemisphere damage or TBI.'
        ],
        limitations: [
          'Can be emotionally confronting for patients to watch themselves; requires a strong therapeutic alliance.',
          'Requires equipment and consent to record.'
        ]
      },
      {
        name: 'Communication Partner Training',
        description: 'Training family/staff to support interaction.',
        evidenceLevel: 'High',
        candidates: 'All severe communication disorders.',
        tags: ['Environmental', 'Support'],
        whatItIs: 'An approach where the focus of intervention shifts from the patient to the people they interact with regularly. Partners are taught specific strategies to facilitate successful communication.',
        tips: [
          'For aphasia, use Supported Conversation for Adults with Aphasia (SCA) techniques (e.g., using written keywords, drawing, verifying understanding).',
          'For dementia, focus on reducing environmental distractions, using simple sentences, and validating emotions rather than correcting facts.',
          'Crucial for long-term success and reducing caregiver burden.'
        ],
        limitations: [
          'Requires the active participation and willingness of family members or staff, who may be overwhelmed or resistant.',
          'Can be difficult to implement in high-turnover environments like SNFs.'
        ]
      }
    ],
    resources: [
      {
        title: 'ASHA Practice Portal: Cognitive-Communication',
        description: 'Comprehensive clinical guide.',
        type: 'Guide',
        url: 'https://www.asha.org/practice-portal/clinical-topics/cognitive-communication/'
      },
      {
        title: 'Brain Injury Association of America',
        description: 'Resources for TBI and cognitive support.',
        type: 'Handout',
        url: 'https://www.biausa.org/'
      },
      {
        title: 'Alzheimer\'s Association: Caregiver Center',
        description: 'Support for dementia caregiving.',
        type: 'Handout',
        url: 'https://www.alz.org/help-support/caregiving'
      }
    ],
    visuals: [
      {
        title: 'Non-Verbal Communication Cues',
        type: 'image',
        thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
        description: 'Facial expressions and body language examples.',
        whatItIs: 'A visual reference guide showing various facial expressions, body postures, and gestures that convey meaning without words.',
        tips: [
          'Use to help patients identify emotions in others (e.g., "What is this person feeling?").',
          'Use as a model for the patient to practice generating appropriate non-verbal cues.'
        ],
        limitations: [
          'Static images may not fully capture the dynamic nature of non-verbal communication in real-time interactions.'
        ]
      },
      {
        title: 'Social Interaction Setting',
        type: 'image',
        thumbnail: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800',
        description: 'Group therapy or social gathering context.',
        whatItIs: 'An image depicting a group of people interacting in a social setting (e.g., a cafe, a meeting).',
        tips: [
          'Use as a stimulus for discussing social rules (e.g., "Who is talking? Who is listening? How do you know?").',
          'Can be used to practice identifying potential social breakdowns or awkward situations.'
        ],
        limitations: [
          'May not be culturally relevant to all patients.'
        ]
      }
    ]
  },
  'hnc': {
    id: 'hnc',
    title: 'Head & Neck Cancer',
    overview: {
      whatItIs: 'Management of communication and swallowing disorders resulting from head and neck cancer and its treatment (surgery, radiation, chemotherapy).',
      whyItHappens: 'Tumor burden, surgical resection of structures, radiation-induced fibrosis, lymphedema, and mucositis.',
      deficits: [
        'Dysphagia (structural & physiological)',
        'Odynophagia (painful swallowing)',
        'Trismus (reduced jaw opening)',
        'Xerostomia (dry mouth)',
        'Dysarthria / Voice changes',
        'Lymphedema'
      ],
      symptoms: [
        'Difficulty moving food through mouth/throat',
        'Food sticking',
        'Weight loss / Malnutrition',
        'Stiff jaw / Neck tightness',
        'Thick secretions',
        'Hoarseness'
      ],
      clinicalPearl: 'Prophylactic swallowing exercises ("Pharyngocise") during radiation therapy are critical to preserve long-term muscle function and reduce fibrosis.',
      bestPractices: [
        'Initiate therapy BEFORE treatment begins (Pre-hab).',
        'Maintain oral intake as long as safe during RT.',
        'Aggressive management of trismus and lymphedema.',
        'Long-term surveillance for late-effect radiation fibrosis.'
      ]
    },
    assessments: [
      {
        name: 'M.D. Anderson Dysphagia Inventory',
        acronym: 'MDADI',
        description: 'Quality of life questionnaire specific to HNC dysphagia.',
        population: 'Head & Neck Cancer',
        time: '5 mins',
        cost: 'Free',
        tags: ['PROM', 'QoL'],
        whatItIs: 'A validated, self-administered questionnaire designed specifically to evaluate the impact of dysphagia on the quality of life of patients with head and neck cancer.',
        whatItContains: '20 questions divided into four subscales: Global, Emotional, Functional, and Physical. Patients rate statements on a 5-point Likert scale (strongly agree to strongly disagree).',
        tips: [
          'A lower score indicates a poorer quality of life related to swallowing.',
          'Crucial for capturing the patient\'s perspective, which may differ significantly from objective clinical findings.',
          'Administer at baseline (pre-treatment) and at regular intervals post-treatment.'
        ],
        limitations: [
          'Does not provide information on the physiological nature of the swallowing impairment.',
          'May be influenced by the patient\'s overall psychological distress related to their cancer diagnosis.'
        ]
      },
      {
        name: 'Mann Assessment of Swallowing Ability - Cancer',
        acronym: 'MASA-C',
        description: 'Clinical bedside swallow exam validated for HNC.',
        population: 'HNC',
        time: '15 mins',
        cost: 'Paid',
        tags: ['Bedside', 'Standardized'],
        whatItIs: 'A modified version of the original MASA, specifically adapted and validated for the head and neck cancer population to assess swallowing function at the bedside.',
        whatItContains: '24 clinical items assessing various aspects of swallowing, including oral preparation, oral transit, pharyngeal phase, and airway protection. Includes specific items relevant to HNC (e.g., mucositis, trismus, xerostomia).',
        tips: [
          'Provides a structured, quantifiable way to document the clinical swallow evaluation.',
          'Helps identify patients who are at high risk for aspiration and require instrumental assessment (VFSS/FEES).'
        ],
        limitations: [
          'Like all clinical bedside exams, it cannot definitively rule out silent aspiration.',
          'Requires training to administer and score reliably.'
        ]
      },
      {
        name: 'Trismus Measurement',
        description: 'Measuring interincisal distance (ROM). Normal is >35mm.',
        population: 'HNC, Radiation',
        time: '< 1 min',
        cost: 'Free',
        tags: ['Objective', 'Physical Exam'],
        whatItIs: 'The objective measurement of maximum jaw opening (interincisal distance) to assess for trismus, a common side effect of radiation therapy to the head and neck.',
        whatItContains: 'Using a specialized ruler (e.g., TheraBite range of motion scale) or a standard ruler to measure the distance between the upper and lower central incisors when the patient opens their mouth as wide as possible.',
        tips: [
          'Normal opening is typically 35-50mm. An opening of <35mm is generally considered trismus.',
          'Measure at every visit, as trismus can develop slowly over time following radiation.',
          'Early intervention with stretching exercises is critical to prevent permanent restriction.'
        ],
        limitations: [
          'Can be painful for the patient if they have active mucositis or recent surgery.',
          'Measurement can be affected by missing teeth or dental appliances.'
        ]
      }
    ],
    treatments: [
      {
        name: 'Pharyngocise',
        description: 'High-intensity prophylactic exercise protocol during CRT.',
        evidenceLevel: 'High',
        candidates: 'Patients undergoing Radiation/Chemo.',
        tags: ['Prophylactic', 'Preservation'],
        whatItIs: 'A preventative (prophylactic) swallowing exercise program designed to maintain muscle mass and function during chemoradiotherapy (CRT) for head and neck cancer.',
        tips: [
          'Typically includes exercises like the effortful swallow, Mendelsohn maneuver, tongue press, and jaw stretch.',
          'The goal is "use it or lose it." Maintaining muscle activity helps prevent the severe fibrosis (scarring) that radiation causes.',
          'Must be initiated *before* or at the very beginning of radiation treatment.'
        ],
        limitations: [
          'Compliance is notoriously difficult because patients feel terrible (pain, fatigue, nausea) during CRT.',
          'Requires intensive coaching and support from the SLP.'
        ]
      },
      {
        name: 'McNeill Dysphagia Therapy Program',
        acronym: 'MDTP',
        description: 'Intensive exercise-based therapy.',
        evidenceLevel: 'High',
        candidates: 'Chronic dysphagia post-treatment.',
        tags: ['Restorative', 'Intensive'],
        whatItIs: 'A systematic, exercise-based therapy framework for adults with dysphagia. It focuses on using swallowing as the exercise itself, progressively increasing the challenge.',
        tips: [
          'Involves intensive daily sessions (e.g., 3 weeks, 5 days/week).',
          'Uses a food hierarchy, starting with the most difficult consistency the patient can safely swallow and progressing upwards.',
          'Requires certification to administer.'
        ],
        limitations: [
          'Very time-intensive and physically demanding for the patient.',
          'May not be appropriate for patients with severe cognitive deficits or those who are medically unstable.'
        ]
      },
      {
        name: 'Manual Therapy / Myofascial Release',
        description: 'Hands-on techniques to address fibrosis and lymphedema.',
        evidenceLevel: 'Moderate',
        candidates: 'Fibrosis, neck tightness.',
        tags: ['Manual', 'Symptom Management'],
        whatItIs: 'Hands-on, physical manipulation of the muscles and connective tissue (fascia) of the head and neck to reduce tension, improve range of motion, and manage lymphedema.',
        tips: [
          'Can be highly effective for addressing the "wooden neck" feeling caused by radiation fibrosis.',
          'Often combined with active stretching exercises.',
          'Requires specialized training (e.g., in manual therapy or complete decongestive therapy for lymphedema).'
        ],
        limitations: [
          'Contraindicated in areas of active cancer, infection, or unhealed surgical wounds.',
          'Effects may be temporary if not paired with active exercise.'
        ]
      },
      {
        name: 'Jaw Stretching (TheraBite)',
        description: 'Passive range of motion for trismus.',
        evidenceLevel: 'High',
        candidates: 'Trismus (<35mm opening).',
        tags: ['Device', 'ROM'],
        whatItIs: 'The use of specialized devices (like the TheraBite Jaw Motion Rehabilitation System or Dynasplint) to provide passive, sustained stretching to the jaw muscles to treat or prevent trismus.',
        tips: [
          'The "7-7-7" protocol is common: 7 stretches, held for 7 seconds each, done 7 times a day.',
          'Consistency is key. It is better to do frequent, short stretches than one long, painful stretch.',
          'Stacked tongue depressors can be used as a low-cost alternative for stretching.'
        ],
        limitations: [
          'Devices can be expensive and may not be covered by all insurance plans.',
          'Requires high patient compliance and tolerance for discomfort.'
        ]
      }
    ],
    resources: [
      {
        title: 'National Foundation of Swallowing Disorders: HNC',
        description: 'Resources for HNC-related dysphagia.',
        type: 'Handout',
        url: 'https://swallowingdisorderfoundation.com/head-and-neck-cancer/'
      },
      {
        title: 'Support for People with Oral and Head and Neck Cancer (SPOHNC)',
        description: 'Patient support and resources.',
        type: 'Support',
        url: 'https://spohnc.org/'
      }
    ],
    visuals: [
      {
        title: 'Radiation Fibrosis',
        type: 'image',
        thumbnail: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800',
        description: 'Impact of radiation on tissue elasticity.',
        whatItIs: 'A visual representation of how radiation therapy changes healthy, elastic tissue into stiff, fibrotic scar tissue over time.',
        tips: [
          'Use to explain to patients *why* they feel tightness and why swallowing has become more difficult months or years after treatment.',
          'Helps justify the need for ongoing stretching and manual therapy.'
        ],
        limitations: [
          'Fibrosis is often microscopic and palpable before it is visible on standard imaging.'
        ]
      },
      {
        title: 'Laryngectomy Anatomy',
        type: 'image',
        thumbnail: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=800',
        description: 'Anatomical changes after total laryngectomy.',
        whatItIs: 'A diagram showing the separation of the airway and the digestive tract following a total laryngectomy (removal of the voice box).',
        tips: [
          'Crucial for patient and family education pre- and post-surgery.',
          'Use to explain why the patient breathes through a stoma in their neck and can no longer aspirate food/liquid (unless there is a fistula).'
        ],
        limitations: [
          'Does not show the dynamic changes in swallowing that occur post-surgery (e.g., increased reliance on tongue base retraction).'
        ]
      }
    ]
  },
  'pediatrics': {
    id: 'pediatrics',
    title: 'Pediatrics',
    overview: {
      whatItIs: 'Evaluation and treatment of communication and swallowing disorders in infants, children, and adolescents.',
      whyItHappens: 'Prematurity, Congenital syndromes (Down, DiGeorge), Cerebral Palsy, Autism, Cleft Lip/Palate, Sensory Processing Disorder.',
      deficits: [
        'Feeding/Swallowing (Dysphagia)',
        'Speech Sound Disorders',
        'Language Delay/Disorder',
        'Social Communication',
        'Fluency'
      ],
      symptoms: [
        'Failure to thrive / Poor weight gain',
        'Refusal to eat / Picky eating',
        'Choking/gagging during feeds',
        'Late talking / Limited vocabulary',
        'Unintelligible speech'
      ],
      clinicalPearl: 'Children are not just small adults. Development is dynamic. Assessment must consider the "whole child" within the family system.',
      bestPractices: [
        'Family-Centered Care is essential.',
        'Early Intervention yields best outcomes.',
        'Play-based therapy is the primary modality.',
        'Respect sensory preferences and avoid force-feeding.'
      ]
    },
    assessments: [
      {
        name: 'Preschool Language Scales',
        acronym: 'PLS-5',
        description: 'Comprehensive language assessment for birth-7:11.',
        population: 'Pediatrics',
        time: '45-60 mins',
        cost: 'Paid',
        tags: ['Standardized', 'Language'],
        whatItIs: 'A comprehensive developmental language assessment designed to identify language delays or disorders in young children.',
        whatItContains: 'Two main scales: Auditory Comprehension (receptive language) and Expressive Communication. Includes tasks involving play, picture pointing, and verbal responses.',
        tips: [
          'Highly interactive and play-based, making it suitable for young or difficult-to-test children.',
          'Allows for caregiver input on items the child may not demonstrate during the testing session.'
        ],
        limitations: [
          'Can be lengthy to administer to a very young or uncooperative child.',
          'Some clinicians argue it may over-identify language disorders in certain populations due to its scoring structure.'
        ]
      },
      {
        name: 'Goldman-Fristoe Test of Articulation',
        acronym: 'GFTA-3',
        description: 'Assess speech sound production.',
        population: '2-21 years',
        time: '15 mins',
        cost: 'Paid',
        tags: ['Standardized', 'Articulation'],
        whatItIs: 'A standardized assessment used to evaluate an individual\'s articulation of consonant sounds in Standard American English.',
        whatItContains: 'Three sections: Sounds-in-Words (picture naming), Sounds-in-Sentences (story retelling), and Stimulability (testing if the child can produce an error sound with a model).',
        tips: [
          'Quick and easy to administer.',
          'Provides standard scores and percentile ranks to determine eligibility for services.',
          'Always complete the stimulability testing, as it guides treatment target selection.'
        ],
        limitations: [
          'Only assesses articulation at the single-word and sentence level; does not assess connected, conversational speech.',
          'Does not formally assess vowels or phonological processes (though errors can be analyzed for patterns).'
        ]
      },
      {
        name: 'Oral-Motor Feeding Evaluation',
        description: 'Clinical assessment of suck-swallow-breathe and chewing.',
        population: 'Infants/Children',
        time: '30 mins',
        cost: 'Free',
        tags: ['Observation', 'Feeding'],
        whatItIs: 'A clinical, observational assessment of a child\'s oral structures, motor function, and feeding skills during a typical meal or bottle feed.',
        whatItContains: 'Evaluation of the lips, tongue, jaw, palate, and cheeks at rest and during movement. Observation of sucking, biting, chewing, and swallowing coordination. Assessment of posture, seating, and caregiver-child interaction.',
        tips: [
          'Always observe the child eating foods they typically eat, brought from home.',
          'Assess the child in their typical seating arrangement (e.g., high chair, caregiver\'s lap).',
          'Look for signs of aspiration (coughing, wet voice, color changes) and sensory aversions.'
        ],
        limitations: [
          'Cannot definitively rule out silent aspiration; instrumental assessment (VFSS/FEES) may be needed.',
          'Behavioral issues or unfamiliarity with the clinician can impact the child\'s performance.'
        ]
      }
    ],
    treatments: [
      {
        name: 'SOS Approach to Feeding',
        description: 'Sequential Oral Sensory approach for problem feeders.',
        evidenceLevel: 'High',
        candidates: 'Picky eaters, sensory aversion.',
        tags: ['Sensory', 'Feeding'],
        whatItIs: 'A transdisciplinary program for assessing and treating children with feeding difficulties and weight/growth problems. It integrates posture, sensory, motor, behavioral/learning, medical, and nutritional factors.',
        tips: [
          'Focuses on increasing a child\'s comfort level by exploring and learning about the different properties of food (color, shape, texture, smell, taste).',
          'Uses a systematic 32-step hierarchy to desensitize the child to food, starting with tolerating the food in the room and ending with eating it.',
          'Play with food is highly encouraged; "playing with your food" is how children learn to eat.'
        ],
        limitations: [
          'Requires specialized training and certification to implement correctly.',
          'Can be a slow process requiring significant patience from caregivers.'
        ]
      },
      {
        name: 'Hanen Program',
        description: 'Parent-implemented early language intervention (It Takes Two to Talk).',
        evidenceLevel: 'High',
        candidates: 'Late talkers, ASD.',
        tags: ['Parent Coaching', 'Language'],
        whatItIs: 'An evidence-based program that empowers parents to become their child\'s primary language facilitator. It teaches parents practical strategies to help their children learn language naturally during everyday routines.',
        tips: [
          'Key strategies include: OWL (Observe, Wait, Listen), Follow the Child\'s Lead, and Add Language (expanding on what the child says or does).',
          'Shifts the focus from direct therapy with the child to coaching the parents.',
          'Highly effective for generalizing language skills to the home environment.'
        ],
        limitations: [
          'Requires a significant time commitment and active participation from parents.',
          'May not be suitable for families experiencing high stress or lacking resources to implement the strategies.'
        ]
      },
      {
        name: 'PROMPT',
        description: 'Tactile-kinesthetic approach for speech production.',
        evidenceLevel: 'Moderate',
        candidates: 'Apraxia, Articulation disorders.',
        tags: ['Motor Speech', 'Tactile'],
        whatItIs: 'Prompts for Restructuring Oral Muscular Phonetic Targets. A multidimensional approach to speech production disorders that uses physical-sensory (tactile-kinesthetic) cues on the patient\'s jaw, face, and lips to guide articulation.',
        tips: [
          'The SLP uses their hands to physically manipulate the child\'s articulators to help them feel the correct movement patterns for speech sounds.',
          'Particularly effective for children with Childhood Apraxia of Speech (CAS) or severe articulation disorders who do not respond to auditory or visual models alone.',
          'Requires specialized, intensive training to become certified.'
        ],
        limitations: [
          'Requires the child to tolerate physical touch on their face, which may be difficult for children with sensory defensiveness.',
          'Certification is expensive and time-consuming for the SLP.'
        ]
      }
    ],
    resources: [
      {
        title: 'Pediatric Feeding & Swallowing Guide',
        description: 'Overview of pediatric feeding development and common disorders.',
        type: 'Handout',
        url: 'https://www.asha.org/practice-portal/clinical-topics/pediatric-feeding-and-swallowing/'
      },
      {
        title: 'Early Language Development Checklist',
        description: 'Milestones for speech and language development (0-5 years).',
        type: 'Assessment',
        url: 'https://www.asha.org/public/speech/development/chart/'
      }
    ],
    visuals: [
      {
        title: 'Pediatric Oral-Motor Anatomy',
        type: 'image',
        thumbnail: 'https://images.unsplash.com/photo-1516627145691-101037581297?auto=format&fit=crop&q=80&w=800',
        description: 'Anatomical overview of pediatric oral structures.'
      }
    ],
  },
  'trach-vent': {
    id: 'trach-vent',
    title: 'Tracheostomy & Ventilation',
    overview: {
      whatItIs: 'Management of patients with artificial airways (tracheostomy) and mechanical ventilation.',
      whyItHappens: 'Prolonged respiratory failure, airway obstruction, neurological impairment.',
      deficits: [
        'Reduced subglottic pressure for speech',
        'Impaired laryngeal sensation',
        'Reduced hyolaryngeal excursion',
        'Communication barriers'
      ],
      symptoms: [
        'Aphonia (without valve)',
        'Difficulty with oral intake',
        'Respiratory distress',
        'Increased secretions'
      ],
      clinicalPearl: 'The Passy-Muir Valve (PMV) is the gold standard for restoring subglottic pressure and communication in tracheostomized patients.',
      bestPractices: [
        'Always consult RT/MD before valve trials.',
        'Assess laryngeal sensation and swallow function.',
        'Prioritize communication early in recovery.',
        'Use objective measures for valve tolerance.'
      ]
    },
    assessments: [
      {
        name: 'Passy-Muir Valve Trial',
        description: 'Assessment of valve tolerance for speech and swallow.',
        population: 'Tracheostomized patients',
        time: '15 mins',
        cost: 'Free',
        tags: ['Bedside', 'Communication'],
        whatItIs: 'A clinical procedure to determine if a patient with a tracheostomy tube can safely tolerate a one-way speaking valve (like the Passy-Muir Valve).',
        whatItContains: 'Involves deflating the tracheostomy cuff (CRITICAL STEP), placing the valve, and monitoring vital signs (SpO2, HR, RR), work of breathing, and the patient\'s ability to exhale through their upper airway and produce voice.',
        tips: [
          'NEVER place a speaking valve on a tracheostomy tube with an inflated cuff. This will suffocate the patient.',
          'Always collaborate with Respiratory Therapy (RT) and nursing during the initial trial.',
          'Assess airway patency *before* placing the valve by having the patient exhale with finger occlusion.'
        ],
        limitations: [
          'Requires the patient to have a patent upper airway (no severe stenosis or obstruction).',
          'May not be tolerated by patients with copious, thick secretions or severe respiratory compromise.'
        ]
      }
    ],
    treatments: [
      {
        name: 'Passy-Muir Valve (PMV)',
        description: 'Speaking valve to restore subglottic pressure.',
        evidenceLevel: 'High',
        candidates: 'Tracheostomized patients.',
        tags: ['Communication', 'Swallow'],
        whatItIs: 'A one-way valve that attaches to the hub of a tracheostomy tube. It opens during inhalation (allowing air into the lungs) and closes during exhalation, forcing air up through the vocal folds and out the mouth/nose.',
        tips: [
          'Restores voice, improves swallowing (by restoring subglottic pressure), improves olfaction (smell), and helps with secretion management.',
          'Start with short wearing schedules (e.g., 15 minutes) and gradually increase as tolerated.',
          'The cuff MUST be completely deflated while the valve is in place.'
        ],
        limitations: [
          'Contraindicated for patients with severe upper airway obstruction, copious unmanageable secretions, or severe medical instability.',
          'Requires ongoing monitoring and cleaning of the valve.'
        ],
        contraindications: 'Severe upper airway obstruction, copious unmanageable secretions, severe medical instability, inability to exhale through upper airway.',
        documentationTips: 'Document the duration of valve tolerance, patient\'s ability to produce voice, and impact on swallow safety.',
        references: ['ASHA Practice Portal: Tracheostomy and Ventilator Dependence']
      }
    ],
    resources: [
      {
        title: 'Tracheostomy Care Guide',
        description: 'Essential care and safety protocols for tracheostomy.',
        type: 'Handout',
        url: 'https://www.asha.org/practice-portal/clinical-topics/tracheostomy-and-ventilator-dependence/'
      }
    ],
    visuals: [
      {
        title: 'Tracheostomy Tube Components',
        type: 'image',
        thumbnail: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
        description: 'Diagram of tracheostomy tube parts (cuff, cannula, hub).'
      }
    ],
  },
  'dementia': {
    id: 'dementia',
    title: 'Dementia Care',
    overview: {
      whatItIs: 'A clinical syndrome characterized by progressive decline in cognitive function, impacting daily living.',
      whyItHappens: 'Alzheimer\'s disease, Vascular dementia, Lewy Body dementia, Frontotemporal dementia.',
      deficits: [
        'Memory',
        'Language (aphasia, anomia)',
        'Executive function',
        'Visuospatial skills',
        'Swallowing (dysphagia in late stages)'
      ],
      symptoms: [
        'Memory loss',
        'Disorientation',
        'Difficulty with complex tasks',
        'Personality changes',
        'Communication breakdown'
      ],
      clinicalPearl: 'Focus on preserved abilities and environmental modifications rather than attempting to "fix" cognitive deficits.',
      bestPractices: [
        'Use Montessori-based activities.',
        'Implement spaced retrieval training.',
        'Focus on caregiver education and support.',
        'Prioritize safety and quality of life.'
      ]
    },
    assessments: [
      {
        name: 'Mini-Mental State Examination',
        acronym: 'MMSE',
        description: 'Standardized cognitive screening.',
        population: 'Dementia',
        time: '10 mins',
        cost: 'Paid',
        tags: ['Screening', 'Cognitive'],
        whatItIs: 'A widely used 30-point questionnaire that is used extensively in clinical and research settings to measure cognitive impairment.',
        whatItContains: 'Tests orientation, attention, memory, language, and visual-spatial skills.',
        tips: [
          'A score of 24 or higher is generally considered normal cognition. Lower scores can indicate severe (≤9 points), moderate (10–18 points), or mild (19–23 points) cognitive impairment.',
          'It is a screening tool, not a diagnostic tool. It should be used in conjunction with a comprehensive clinical assessment.'
        ],
        limitations: [
          'Scores can be influenced by age, education, and cultural background.',
          'May not be sensitive to mild cognitive impairment (MCI) or early-stage dementia.'
        ]
      }
    ],
    treatments: [
      {
        name: 'Montessori-based Activities',
        description: 'Engaging patients in meaningful, success-oriented tasks.',
        evidenceLevel: 'Moderate',
        candidates: 'Dementia.',
        tags: ['Cognitive', 'Functional'],
        whatItIs: 'An approach adapted from Montessori education that focuses on engaging individuals with dementia in meaningful, success-oriented activities that utilize their preserved skills and abilities.',
        tips: [
          'Activities should be broken down into simple, manageable steps.',
          'Use real, everyday objects (e.g., folding towels, sorting silverware) rather than abstract or childish tasks.',
          'Focus on the process of engagement, not the final product.'
        ],
        limitations: [
          'Requires careful observation and individualized activity planning.',
          'May not be suitable for individuals in the very late stages of dementia who have severe motor or sensory impairments.'
        ]
      }
    ],
    resources: [
      {
        title: 'ASHA Practice Portal: Dementia',
        description: 'Comprehensive clinical guide.',
        type: 'Guide',
        url: 'https://www.asha.org/practice-portal/clinical-topics/dementia/'
      },
      {
        title: 'Alzheimer\'s Association: Professional Training',
        description: 'Resources for professionals.',
        type: 'Guide',
        url: 'https://www.alz.org/professionals/professional-providers'
      }
    ],
    visuals: []
  },
  'palliative': {
    id: 'palliative',
    title: 'Palliative & End-of-Life Care',
    overview: {
      whatItIs: 'Specialized medical care for people living with a serious illness, focusing on relief from symptoms and stress.',
      whyItHappens: 'Terminal illness, advanced neurodegenerative disease, end-stage organ failure.',
      deficits: [
        'Communication (advanced stages)',
        'Swallowing (comfort feeding)',
        'Cognition'
      ],
      symptoms: [
        'Reduced intake',
        'Dysphagia',
        'Communication barriers',
        'Fatigue'
      ],
      clinicalPearl: 'The goal shifts from rehabilitation to comfort, dignity, and quality of life.',
      bestPractices: [
        'Focus on comfort feeding.',
        'Support advanced care planning.',
        'Facilitate communication with loved ones.',
        'Educate family on swallowing changes at end-of-life.'
      ]
    },
    assessments: [],
    treatments: [
      {
        name: 'Comfort Feeding',
        description: 'Feeding for pleasure and comfort, not nutrition/hydration.',
        evidenceLevel: 'Moderate',
        candidates: 'End-of-life patients.',
        tags: ['Swallow', 'Palliative'],
        whatItIs: 'An approach to feeding where the primary goal is the patient\'s comfort and enjoyment, rather than meeting specific nutritional or hydration needs. It involves careful, hand-feeding by a caregiver.',
        tips: [
          'Prioritize the patient\'s favorite foods and flavors, even if they are not the "safest" consistency.',
          'Feed slowly, allowing the patient to dictate the pace.',
          'Stop feeding if the patient shows signs of distress (e.g., coughing, choking, turning away).'
        ],
        limitations: [
          'Carries a risk of aspiration, which must be discussed with the patient and family.',
          'Requires careful communication and shared decision-making with the medical team and family.'
        ]
      }
    ],
    resources: [
      {
        title: 'ASHA Practice Portal: Palliative Care',
        description: 'Comprehensive clinical guide.',
        type: 'Guide',
        url: 'https://www.asha.org/practice-portal/clinical-topics/palliative-care/'
      },
      {
        title: 'Center to Advance Palliative Care (CAPC)',
        description: 'Resources for palliative care professionals.',
        type: 'Guide',
        url: 'https://www.capc.org/'
      }
    ],
    visuals: []
  },
  'head-and-neck-cancer': {
    id: 'head-and-neck-cancer',
    title: 'Head and Neck Cancer',
    overview: {
      whatItIs: 'Cancers of the oral cavity, pharynx, larynx, and salivary glands, often requiring surgical resection, radiation, and/or chemotherapy.',
      whyItHappens: 'Tobacco use, alcohol consumption, HPV infection, environmental exposures.',
      deficits: [
        'Dysphagia (swallowing impairment)',
        'Dysarthria (speech impairment)',
        'Voice changes (hoarseness, loss of voice)',
        'Trismus (reduced jaw opening)',
        'Xerostomia (dry mouth)',
        'Mucositis (painful inflammation)',
        'Fibrosis (tissue hardening)'
      ],
      symptoms: [
        'Difficulty swallowing (dysphagia)',
        'Painful swallowing (odynophagia)',
        'Voice changes',
        'Reduced jaw opening (trismus)',
        'Dry mouth (xerostomia)',
        'Weight loss due to intake issues'
      ],
      clinicalPearl: 'Early intervention (pre-habilitation) is critical. Baseline swallow and speech assessments should be completed before treatment begins to monitor changes throughout the course of care.',
      bestPractices: [
        'Pre-habilitation: Baseline assessment and education.',
        'Swallow exercises during radiation to maintain function.',
        'Trismus management: Jaw range of motion exercises.',
        'Xerostomia management: Hydration, saliva substitutes.',
        'Multidisciplinary team approach (SLP, ENT, Oncology, Dietitian).'
      ]
    },
    assessments: [
      {
        name: 'Functional Oral Intake Scale',
        acronym: 'FOIS',
        description: 'Measures functional oral intake.',
        population: 'Dysphagia',
        time: '< 1 min',
        cost: 'Free',
        tags: ['Swallow', 'Functional'],
        whatItIs: 'A 7-point scale used to document the functional oral intake of patients with dysphagia.',
        whatItContains: 'Levels range from 1 (nothing by mouth) to 7 (total oral diet with no restrictions).',
        tips: [
          'Provides a clear, functional measure of diet level.',
          'Useful for tracking progress and documenting the impact of dysphagia on nutrition/hydration.'
        ],
        limitations: [
          'Does not provide information on the safety or efficiency of swallowing.',
          'Subjective and relies on clinician judgment.'
        ]
      }
    ],
    treatments: [
      {
        name: 'Trismus Exercises',
        description: 'Exercises to maintain or improve jaw opening.',
        evidenceLevel: 'High',
        candidates: 'Post-radiation or post-surgical HNC.',
        tags: ['Physiological', 'Range of Motion'],
        whatItIs: 'A program of jaw stretching exercises to prevent or treat trismus (reduced jaw opening) caused by radiation or surgery.',
        tips: [
          'Consistency is key; exercises should be performed multiple times daily.',
          'Use a jaw-opening device if necessary for more effective stretching.',
          'Monitor jaw opening measurements (interincisal distance) over time.'
        ],
        limitations: [
          'Can be painful and require significant patient compliance.',
          'May not be effective for severe, long-standing fibrosis.'
        ],
        contraindications: 'Acute infection, severe pain, unstable jaw fracture.',
        documentationTips: 'Document the interincisal distance (mm), exercise frequency, and patient compliance.',
        references: ['ASHA Practice Portal: Head and Neck Cancer']
      }
    ],
    resources: [
      {
        title: 'Head and Neck Cancer: ASHA Resource',
        description: 'ASHA resources for head and neck cancer.',
        type: 'Webpage',
        url: 'https://www.asha.org/public/speech/disorders/head-and-neck-cancer/'
      }
    ],
    visuals: []
  },
  ...SLP_ADVANCED_REHAB_DATA,
  ...PT_SUBSPECIALTY_DATA,
  ...OT_SUBSPECIALTY_DATA,
};
