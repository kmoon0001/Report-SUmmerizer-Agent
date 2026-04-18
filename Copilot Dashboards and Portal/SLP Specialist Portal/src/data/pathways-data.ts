
export interface PathwayOption {
  id: string;
  title: string;
  description: string;
  type: 'assessment' | 'treatment' | 'strategy';
  evidenceLevel?: 'High' | 'Moderate' | 'Emerging';
  media?: {
    type: 'image' | 'video';
    url: string; // Placeholder or real URL
    caption: string;
  };
  link?: string; // Added link field
}

export interface ClinicalSymptom {
  id: string;
  label: string;
  category: 'Dysphagia' | 'Cognition' | 'Aphasia' | 'Dysarthria/Voice' | 'Tracheostomy';
  description: string;
  causes: string[];
  commonObservations: string[];
  labs: string[];
  imaging: string[];
  meds: string[];
  redFlags: string[];
  pathways: {
    assessments: PathwayOption[];
    treatments: PathwayOption[];
    strategies: PathwayOption[];
  };
}

export const CLINICAL_PATHWAYS: ClinicalSymptom[] = [
  {
    id: 'dysphagia-cough-liquids',
    label: 'Coughing with Thin Liquids',
    category: 'Dysphagia',
    description: 'Patient exhibits immediate or delayed coughing/throat clearing when consuming thin liquids.',
    causes: ['Reduced laryngeal elevation', 'Delayed swallow trigger', 'Reduced vocal fold closure'],
    commonObservations: ['Wet vocal quality', 'Throat clearing', 'Increased respiratory rate'],
    labs: ['Albumin/Prealbumin (nutritional status)', 'WBC (infection risk)'],
    imaging: ['MBSS (Modified Barium Swallow Study)', 'FEES (Fiberoptic Endoscopic Evaluation of Swallow)'],
    meds: ['Antipsychotics (may cause sedation)', 'Anticholinergics (dry mouth)'],
    redFlags: ['Temperature spikes', 'Wet vocal quality after swallow', 'Recurrent pneumonia history'],
    pathways: {
      assessments: [
        { id: 'a1', title: 'Yale Swallow Protocol', description: '3oz water challenge to screen for aspiration risk.', type: 'assessment', evidenceLevel: 'High', link: 'https://www.yaleswallowprotocol.com/' },
        { id: 'a2', title: 'Clinical Bedside Swallow Exam', description: 'Comprehensive oral mech and PO trials.', type: 'assessment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/practice-portal/clinical-topics/adult-dysphagia/' },
        { id: 'a3', title: 'Instrumental (MBSS/FEES)', description: 'Referral if bedside is inconclusive or silent aspiration suspected.', type: 'assessment', evidenceLevel: 'High', link: 'https://www.asha.org/practice-portal/clinical-topics/adult-dysphagia/instrumental-swallow-assessment/' },
        { id: 'a4', title: 'Mann Assessment of Swallowing Ability (MASA)', description: 'Standardized clinical assessment tool.', type: 'assessment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/practice-portal/clinical-topics/adult-dysphagia/assessment/' }
      ],
      treatments: [
        { 
          id: 't1', 
          title: 'Chin Tuck Maneuver', 
          description: 'Widens valleculae, narrows airway entrance. (Verify with imaging)', 
          type: 'treatment', 
          evidenceLevel: 'Moderate',
          media: {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&q=80&w=800',
            caption: 'Esophageal and laryngeal anatomy'
          },
          link: 'https://www.dysphagiacafe.com/2012/03/15/the-chin-tuck-maneuver/'
        },
        { 
          id: 't2', 
          title: 'Supraglottic Swallow', 
          description: 'Voluntary airway protection technique. Hold breath, swallow, cough.', 
          type: 'treatment', 
          evidenceLevel: 'Moderate',
          media: {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3e56?auto=format&fit=crop&q=80&w=800',
            caption: 'Laryngeal closure visualization'
          },
          link: 'https://www.asha.org/practice-portal/clinical-topics/adult-dysphagia/treatment-of-dysphagia/'
        },
        { id: 't3', title: 'Expiratory Muscle Strength Training (EMST)', description: 'Improves cough strength and hyolaryngeal excursion.', type: 'treatment', evidenceLevel: 'High', link: 'https://emst150.com/' },
        { id: 't4', title: 'Mendelsohn Maneuver', description: 'Prolonging hyolaryngeal elevation.', type: 'treatment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/practice-portal/clinical-topics/adult-dysphagia/treatment-of-dysphagia/' }
      ],
      strategies: [
        { id: 's1', title: 'Small Sips / Straw Control', description: 'Limit bolus size to prevent premature spillage.', type: 'strategy', link: 'https://iddsi.org/' },
        { 
          id: 's2', 
          title: 'Liquid Thickening (Last Resort)', 
          description: 'Consider IDDSI Level 1 (Slightly) or 2 (Mildly) if strategies fail.', 
          type: 'strategy',
          media: {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=800',
            caption: 'Thickened liquid consistency'
          },
          link: 'https://iddsi.org/'
        },
        { id: 's3', title: 'Postural Adjustments', description: 'Upright positioning at 90 degrees.', type: 'strategy', link: 'https://www.asha.org/practice-portal/clinical-topics/adult-dysphagia/treatment-of-dysphagia/' }
      ]
    }
  },
  {
    id: 'dysphagia-delayed-ap-transfer',
    label: 'Delayed Anterior-Posterior (AP) Transfer',
    category: 'Dysphagia',
    description: 'Difficulty initiating the swallow; bolus sits in the oral cavity for an extended period.',
    causes: ['Reduced lingual control', 'Sensory deficits', 'Apraxia of swallow'],
    commonObservations: ['Bolus retention in oral cavity', 'Multiple swallow attempts', 'Increased meal time'],
    labs: ['None specific'],
    imaging: ['MBSS (Modified Barium Swallow Study)'],
    meds: ['None specific'],
    redFlags: ['Nutritional decline', 'Fatigue during meals'],
    pathways: {
      assessments: [
        { id: 'ap1', title: 'Oral Mechanism Exam', description: 'Assess lingual strength and range of motion.', type: 'assessment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/practice-portal/clinical-topics/adult-dysphagia/assessment/' },
        { id: 'ap2', title: 'Bedside Swallow Trials', description: 'Observe bolus manipulation and initiation.', type: 'assessment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/practice-portal/clinical-topics/adult-dysphagia/' }
      ],
      treatments: [
        { id: 'apt1', title: 'Thermal-Tactile Stimulation', description: 'Increasing sensory awareness to trigger swallow.', type: 'treatment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/practice-portal/clinical-topics/adult-dysphagia/treatment-of-dysphagia/' },
        { id: 'apt2', title: 'Lingual Strengthening Exercises', description: 'Targeting tongue base and tip strength.', type: 'treatment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/practice-portal/clinical-topics/adult-dysphagia/treatment-of-dysphagia/' }
      ],
      strategies: [
        { id: 'aps1', title: 'Bolus Placement', description: 'Placing bolus on stronger side of oral cavity.', type: 'strategy', link: 'https://www.asha.org/practice-portal/clinical-topics/adult-dysphagia/treatment-of-dysphagia/' },
        { id: 'aps2', title: 'Small Bolus Size', description: 'Reducing volume to facilitate easier transfer.', type: 'strategy', link: 'https://www.asha.org/practice-portal/clinical-topics/adult-dysphagia/treatment-of-dysphagia/' }
      ]
    }
  },
  {
    id: 'dysphagia-reduced-pharyngeal-constriction',
    label: 'Reduced Pharyngeal Constriction',
    category: 'Dysphagia',
    description: 'Residue in the pharynx after the swallow due to weakened pharyngeal walls.',
    causes: ['Pharyngeal muscle weakness', 'Base of tongue weakness', 'Neurological impairment'],
    commonObservations: ['Post-swallow throat clearing', 'Wet vocal quality', 'Feeling of food stuck in throat'],
    labs: ['None specific'],
    imaging: ['MBSS (Modified Barium Swallow Study)', 'FEES (Fiberoptic Endoscopic Evaluation of Swallow)'],
    meds: ['None specific'],
    redFlags: ['Aspiration risk post-swallow', 'Nutritional decline'],
    pathways: {
      assessments: [
        { id: 'rp1', title: 'MBSS (Modified Barium Swallow Study)', description: 'Visualize pharyngeal residue and clearance.', type: 'assessment', evidenceLevel: 'High', link: 'https://www.asha.org/practice-portal/clinical-topics/adult-dysphagia/instrumental-swallow-assessment/' },
        { id: 'rp2', title: 'FEES', description: 'Direct visualization of pharyngeal residue.', type: 'assessment', evidenceLevel: 'High', link: 'https://www.asha.org/practice-portal/clinical-topics/adult-dysphagia/instrumental-swallow-assessment/' }
      ],
      treatments: [
        { id: 'rpt1', title: 'Effortful Swallow', description: 'Swallowing hard to increase pharyngeal pressure.', type: 'treatment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/practice-portal/clinical-topics/adult-dysphagia/treatment-of-dysphagia/' },
        { id: 'rpt2', title: 'Masako Maneuver', description: 'Tongue-hold swallow to strengthen pharyngeal wall.', type: 'treatment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/practice-portal/clinical-topics/adult-dysphagia/treatment-of-dysphagia/' }
      ],
      strategies: [
        { id: 'rps1', title: 'Multiple Swallows', description: 'Clearing residue with extra swallows per bolus.', type: 'strategy', link: 'https://www.asha.org/practice-portal/clinical-topics/adult-dysphagia/treatment-of-dysphagia/' },
        { id: 'rps2', title: 'Liquid Wash', description: 'Using liquid to clear solid residue.', type: 'strategy', link: 'https://www.asha.org/practice-portal/clinical-topics/adult-dysphagia/treatment-of-dysphagia/' }
      ]
    }
  },
  {
    id: 'cog-memory-short',
    label: 'Short-Term Memory Deficits',
    category: 'Cognition',
    description: 'Difficulty recalling recent events (minutes to hours) or learning new information.',
    causes: ['Hippocampal damage', 'Frontal lobe dysfunction', 'Medication side effects'],
    commonObservations: ['Repetitive questioning', 'Inability to follow multi-step directions', 'Disorientation to time'],
    labs: ['B12/Folate levels', 'Thyroid panel (TSH)', 'Electrolytes'],
    imaging: ['Brain MRI/CT (rule out structural pathology)'],
    meds: ['Benzodiazepines (memory impairment)', 'Anticholinergics'],
    redFlags: ['Safety awareness deficits', 'Medication mismanagement', 'Getting lost in facility'],
    pathways: {
      assessments: [
        { id: 'ca1', title: 'MoCA', description: 'Assess delayed recall and orientation sections.', type: 'assessment', evidenceLevel: 'High', link: 'https://mocacognition.com/' },
        { id: 'ca2', title: 'RBANS', description: 'In-depth immediate and delayed memory index.', type: 'assessment', evidenceLevel: 'High', link: 'https://www.pearsonassessments.com/store/usassessments/en/Store/Professional-Assessments/Cognition-%26-Neuro/Repeatable-Battery-for-the-Assessment-of-Neuropsychological-Status/p/100000300.html' },
        { id: 'ca3', title: 'Contextual Memory Test', description: 'Assess awareness of memory capacity and strategy use.', type: 'assessment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/practice-portal/clinical-topics/dementia/' },
        { id: 'ca4', title: 'SLUMS Examination', description: 'St. Louis University Mental Status Exam.', type: 'assessment', evidenceLevel: 'Moderate', link: 'https://www.slu.edu/medicine/internal-medicine/geriatric-medicine/successful-aging/mental-status-exam.php' }
      ],
      treatments: [
        { 
          id: 'ct1', 
          title: 'Spaced Retrieval Training', 
          description: 'Recall information at expanding time intervals.', 
          type: 'treatment', 
          evidenceLevel: 'High',
          media: {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1581092160607-ee2253139328?auto=format&fit=crop&q=80&w=800',
            caption: 'Neural network visualization'
          },
          link: 'https://www.asha.org/practice-portal/clinical-topics/dementia/treatment-of-dementia/'
        },
        { id: 'ct2', title: 'Visual Association', description: 'Linking new info to mental images.', type: 'treatment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/practice-portal/clinical-topics/dementia/treatment-of-dementia/' },
        { id: 'ct3', title: 'Errorless Learning', description: 'Preventing errors during skill acquisition.', type: 'treatment', evidenceLevel: 'High', link: 'https://www.asha.org/practice-portal/clinical-topics/dementia/treatment-of-dementia/' }
      ],
      strategies: [
        { 
          id: 'cs1', 
          title: 'Memory Notebook / External Aids', 
          description: 'Centralized location for schedule and key info.', 
          type: 'strategy',
          media: {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=800',
            caption: 'Memory notebook example'
          },
          link: 'https://www.asha.org/practice-portal/clinical-topics/dementia/treatment-of-dementia/'
        },
        { id: 'cs2', title: 'Environmental Cues', description: 'Labeling drawers, doors, and pathways.', type: 'strategy', link: 'https://www.asha.org/practice-portal/clinical-topics/dementia/treatment-of-dementia/' },
        { id: 'cs3', title: 'Routine Modification', description: 'Simplifying daily tasks to reduce cognitive load.', type: 'strategy', link: 'https://www.asha.org/practice-portal/clinical-topics/dementia/treatment-of-dementia/' }
      ]
    }
  },
  {
    id: 'aphasia-anomia',
    label: 'Word Finding (Anomia)',
    category: 'Aphasia',
    description: 'Difficulty retrieving specific words, "tip of the tongue" phenomenon, circumlocution.',
    causes: ['Left hemisphere stroke', 'Primary Progressive Aphasia', 'Traumatic Brain Injury'],
    commonObservations: ['Frequent pauses', 'Nonspecific word usage', 'Frustration'],
    labs: ['None specific (rule out metabolic/infectious)'],
    imaging: ['Brain MRI/CT (localize lesion)'],
    meds: ['None specific (focus on underlying etiology)'],
    redFlags: ['Frustration/Withdrawal', 'Depression'],
    pathways: {
      assessments: [
        { id: 'aa1', title: 'Boston Naming Test', description: 'Confrontation naming of line drawings.', type: 'assessment', evidenceLevel: 'High', link: 'https://www.asha.org/practice-portal/clinical-topics/aphasia/assessment/' },
        { id: 'aa2', title: 'Verbal Fluency Tasks', description: 'Category and letter fluency (FAS).', type: 'assessment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/practice-portal/clinical-topics/aphasia/assessment/' },
        { id: 'aa3', title: 'Western Aphasia Battery (WAB)', description: 'Comprehensive assessment of language function.', type: 'assessment', evidenceLevel: 'High', link: 'https://www.asha.org/practice-portal/clinical-topics/aphasia/assessment/' }
      ],
      treatments: [
        { 
          id: 'at1', 
          title: 'Semantic Feature Analysis (SFA)', 
          description: 'Describe group, use, action, properties to trigger retrieval.', 
          type: 'treatment', 
          evidenceLevel: 'High',
          media: {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3e56?auto=format&fit=crop&q=80&w=800',
            caption: 'Brain scan visualization'
          },
          link: 'https://www.asha.org/practice-portal/clinical-topics/aphasia/treatment-of-aphasia/'
        },
        { id: 'at2', title: 'VNeST', description: 'Verb Network Strengthening Treatment.', type: 'treatment', evidenceLevel: 'High', link: 'https://www.asha.org/practice-portal/clinical-topics/aphasia/treatment-of-aphasia/' },
        { id: 'at3', title: 'Constraint-Induced Language Therapy (CILT)', description: 'Forcing verbal output.', type: 'treatment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/practice-portal/clinical-topics/aphasia/treatment-of-aphasia/' }
      ],
      strategies: [
        { id: 'as1', title: 'Circumlocution', description: 'Talking around the word (function, description).', type: 'strategy', link: 'https://www.asha.org/practice-portal/clinical-topics/aphasia/treatment-of-aphasia/' },
        { 
          id: 'as2', 
          title: 'Gesture / Drawing', 
          description: 'Using multimodal communication.', 
          type: 'strategy',
          media: {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1615826932727-39b322163346?auto=format&fit=crop&q=80&w=800',
            caption: 'Multimodal communication'
          },
          link: 'https://www.asha.org/practice-portal/clinical-topics/aphasia/treatment-of-aphasia/'
        },
        { id: 'as3', title: 'Phonemic Cues', description: 'Providing the first sound of the target word.', type: 'strategy', link: 'https://www.asha.org/practice-portal/clinical-topics/aphasia/treatment-of-aphasia/' }
      ]
    }
  },
  {
    id: 'dysarthria-slurred',
    label: 'Slurred Speech / Low Intelligibility',
    category: 'Dysarthria/Voice',
    description: 'Reduced articulatory precision resulting in difficult-to-understand speech.',
    causes: ['Neurological damage (e.g., CVA, ALS)', 'Muscle weakness', 'Poor coordination'],
    commonObservations: ['Slurred speech', 'Slowed rate', 'Reduced volume'],
    labs: ['None specific (rule out metabolic/infectious)'],
    imaging: ['Brain MRI/CT (localize lesion)'],
    meds: ['Muscle relaxants (if spasticity present)'],
    redFlags: ['Social isolation', 'Misinterpretation of needs'],
    pathways: {
      assessments: [
        { id: 'da1', title: 'Frenchay Dysarthria Assessment', description: 'Differential diagnosis of dysarthria type.', type: 'assessment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/practice-portal/clinical-topics/dysarthria-in-adults/assessment/' },
        { id: 'da2', title: 'Intelligibility Rating', description: 'Sentence and word level intelligibility %.', type: 'assessment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/practice-portal/clinical-topics/dysarthria-in-adults/assessment/' },
        { id: 'da3', title: 'Assessment of Intelligibility of Dysarthric Speech (AIDS)', description: 'Standardized assessment of intelligibility.', type: 'assessment', evidenceLevel: 'High', link: 'https://www.asha.org/practice-portal/clinical-topics/dysarthria-in-adults/assessment/' }
      ],
      treatments: [
        { id: 'dt1', title: 'Overarticulation', description: 'Exaggerated mouth movements.', type: 'treatment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/practice-portal/clinical-topics/dysarthria-in-adults/treatment-of-dysarthria/' },
        { 
          id: 'dt2', 
          title: 'Pacing Boards', 
          description: 'Slowing rate of speech to improve precision.', 
          type: 'treatment', 
          evidenceLevel: 'Moderate',
          media: {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1599839619766-51d019121696?auto=format&fit=crop&q=80&w=800',
            caption: 'Larynx visualization'
          },
          link: 'https://www.asha.org/practice-portal/clinical-topics/dysarthria-in-adults/treatment-of-dysarthria/'
        },
        { id: 'dt3', title: 'LSVT LOUD (if Parkinson\'s)', description: 'Increasing vocal loudness.', type: 'treatment', evidenceLevel: 'High', link: 'https://www.lsvtglobal.com/' },
        { id: 'dt4', title: 'Respiratory Support Training', description: 'Improving breath support for speech.', type: 'treatment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/practice-portal/clinical-topics/dysarthria-in-adults/treatment-of-dysarthria/' }
      ],
      strategies: [
        { id: 'ds1', title: 'Topic Introduction', description: 'Stating the topic before speaking.', type: 'strategy', link: 'https://www.asha.org/practice-portal/clinical-topics/dysarthria-in-adults/treatment-of-dysarthria/' },
        { 
          id: 'ds2', 
          title: 'Alphabet Board', 
          description: 'Pointing to first letter of word.', 
          type: 'strategy',
          media: {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1596496050844-461ac7322b52?auto=format&fit=crop&q=80&w=800',
            caption: 'Alphabet board'
          },
          link: 'https://www.asha.org/practice-portal/clinical-topics/dysarthria-in-adults/treatment-of-dysarthria/'
        },
        { id: 'ds3', title: 'Amplification Devices', description: 'Using portable voice amplifiers.', type: 'strategy', link: 'https://www.asha.org/practice-portal/clinical-topics/dysarthria-in-adults/treatment-of-dysarthria/' }
      ]
    }
  },
  {
    id: 'cog-attention-deficits',
    label: 'Attention Deficits',
    category: 'Cognition',
    description: 'Difficulty focusing, sustaining attention, or shifting attention between tasks.',
    causes: ['TBI', 'Right Hemisphere Stroke', 'Dementia'],
    commonObservations: ['Distractibility', 'Inability to complete tasks', 'Impulsivity'],
    labs: ['None specific'],
    imaging: ['Brain MRI/CT'],
    meds: ['Stimulants (if indicated)'],
    redFlags: ['Safety risks due to inattention', 'Inability to follow complex instructions'],
    pathways: {
      assessments: [
        { id: 'ca1', title: 'Test of Everyday Attention', description: 'Assesses sustained, selective, and alternating attention.', type: 'assessment', evidenceLevel: 'High', link: 'https://www.pearsonassessments.com/' },
        { id: 'ca2', title: 'Trail Making Test (A & B)', description: 'Assesses visual scanning and set shifting.', type: 'assessment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' }
      ],
      treatments: [
        { id: 'ct1', title: 'Attention Process Training (APT)', description: 'Hierarchical exercises to improve attention.', type: 'treatment', evidenceLevel: 'High', link: 'https://www.asha.org/' },
        { id: 'ct2', title: 'Metacognitive Strategy Training', description: 'Teaching self-monitoring and strategy use.', type: 'treatment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' }
      ],
      strategies: [
        { id: 'cs1', title: 'Environmental Modification', description: 'Reducing distractions in the environment.', type: 'strategy', link: 'https://www.asha.org/' },
        { id: 'cs2', title: 'Task Chunking', description: 'Breaking complex tasks into smaller, manageable steps.', type: 'strategy', link: 'https://www.asha.org/' }
      ]
    }
  },
  {
    id: 'aphasia-primary-progressive',
    label: 'Primary Progressive Aphasia (PPA)',
    category: 'Aphasia',
    description: 'Gradual loss of language function due to neurodegenerative disease.',
    causes: ['Neurodegenerative disease (e.g., FTD, Alzheimer\'s)'],
    commonObservations: ['Progressive word-finding difficulties', 'Grammatical errors', 'Reduced comprehension'],
    labs: ['Lumbar puncture (if indicated)'],
    imaging: ['Brain MRI/PET (localize atrophy)'],
    meds: ['None specific (focus on symptomatic management)'],
    redFlags: ['Rapid decline in communication', 'Behavioral changes'],
    pathways: {
      assessments: [
        { id: 'aa1', title: 'PPA Severity Rating Scale', description: 'Assessing progression of language deficits.', type: 'assessment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' },
        { id: 'aa2', title: 'Comprehensive Language Battery', description: 'Tracking language decline over time.', type: 'assessment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' }
      ],
      treatments: [
        { id: 'at1', title: 'Communication Partner Training', description: 'Educating family/caregivers on communication strategies.', type: 'treatment', evidenceLevel: 'High', link: 'https://www.asha.org/' },
        { id: 'at2', title: 'AAC Implementation', description: 'Introducing low/high-tech AAC for communication.', type: 'treatment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' }
      ],
      strategies: [
        { id: 'as1', title: 'Communication Notebook', description: 'Using visual aids for daily communication.', type: 'strategy', link: 'https://www.asha.org/' },
        { id: 'as2', title: 'Simplified Language', description: 'Using short, clear sentences.', type: 'strategy', link: 'https://www.asha.org/' }
      ]
    }
  },
  {
    id: 'motor-speech-apraxia',
    label: 'Apraxia of Speech (AOS)',
    category: 'Dysarthria/Voice',
    description: 'Impairment in motor planning for speech, resulting in inconsistent errors.',
    causes: ['Left hemisphere stroke', 'TBI', 'Tumor'],
    commonObservations: ['Inconsistent errors', 'Groping for articulatory placement', 'Difficulty initiating speech'],
    labs: ['None specific'],
    imaging: ['Brain MRI/CT'],
    meds: ['None specific'],
    redFlags: ['Severe frustration', 'Inability to produce speech on command'],
    pathways: {
      assessments: [
        { id: 'ma1', title: 'Apraxia Battery for Adults (ABA-2)', description: 'Assessing motor planning for speech.', type: 'assessment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' },
        { id: 'ma2', title: 'Motor Speech Examination', description: 'Assessing articulatory precision and consistency.', type: 'assessment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' }
      ],
      treatments: [
        { id: 'mt1', title: 'Integral Stimulation', description: 'Watch, listen, and imitate.', type: 'treatment', evidenceLevel: 'High', link: 'https://www.asha.org/' },
        { id: 'mt2', title: 'Melodic Intonation Therapy (MIT)', description: 'Using melody to facilitate speech production.', type: 'treatment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' }
      ],
      strategies: [
        { id: 'ms1', title: 'Visual/Tactile Cues', description: 'Using cues to facilitate articulatory placement.', type: 'strategy', link: 'https://www.asha.org/' },
        { id: 'ms2', title: 'Slowed Rate', description: 'Reducing rate to improve planning.', type: 'strategy', link: 'https://www.asha.org/' }
      ]
    }
  },
  {
    id: 'dysphagia-reduced-hyolaryngeal-excursion',
    label: 'Reduced Hyolaryngeal Excursion',
    category: 'Dysphagia',
    description: 'Incomplete elevation of the larynx during the swallow, leading to residue in the pyriform sinuses.',
    causes: ['Weakness of suprahyoid muscles', 'Neurological impairment'],
    commonObservations: ['Post-swallow residue', 'Coughing after swallow', 'Feeling of food stuck'],
    labs: ['None specific'],
    imaging: ['MBSS (Modified Barium Swallow Study)'],
    meds: ['None specific'],
    redFlags: ['Aspiration risk', 'Nutritional decline'],
    pathways: {
      assessments: [
        { id: 'rh1', title: 'MBSS', description: 'Visualize hyolaryngeal elevation and residue.', type: 'assessment', evidenceLevel: 'High', link: 'https://www.asha.org/' }
      ],
      treatments: [
        { id: 'rht1', title: 'Shaker Exercise', description: 'Head-lift exercise to strengthen suprahyoid muscles.', type: 'treatment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' },
        { id: 'rht2', title: 'Mendelsohn Maneuver', description: 'Prolonging hyolaryngeal elevation.', type: 'treatment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' }
      ],
      strategies: [
        { id: 'rhs1', title: 'Multiple Swallows', description: 'Clearing residue with extra swallows.', type: 'strategy', link: 'https://www.asha.org/' }
      ]
    }
  },
  {
    id: 'cog-executive-function',
    label: 'Executive Function Deficits',
    category: 'Cognition',
    description: 'Difficulty with planning, organizing, problem-solving, and self-monitoring.',
    causes: ['Frontal lobe damage', 'TBI', 'Dementia'],
    commonObservations: ['Poor task initiation', 'Difficulty with complex tasks', 'Impulsivity'],
    labs: ['None specific'],
    imaging: ['Brain MRI/CT'],
    meds: ['None specific'],
    redFlags: ['Safety risks', 'Inability to manage daily activities'],
    pathways: {
      assessments: [
        { id: 'ef1', title: 'Executive Function Performance Test (EFPT)', description: 'Assesses executive function in real-world tasks.', type: 'assessment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' },
        { id: 'ef2', title: 'Behavioral Assessment of the Dysexecutive Syndrome (BADS)', description: 'Assesses executive function.', type: 'assessment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' }
      ],
      treatments: [
        { id: 'eft1', title: 'Goal Management Training (GMT)', description: 'Teaching goal-directed behavior.', type: 'treatment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' },
        { id: 'eft2', title: 'Problem-Solving Therapy', description: 'Systematic approach to problem-solving.', type: 'treatment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' }
      ],
      strategies: [
        { id: 'efs1', title: 'Checklists / Planners', description: 'Using external aids for task management.', type: 'strategy', link: 'https://www.asha.org/' },
        { id: 'efs2', title: 'Self-Monitoring', description: 'Reflecting on task performance.', type: 'strategy', link: 'https://www.asha.org/' }
      ]
    }
  },
  {
    id: 'aphasia-global',
    label: 'Global Aphasia',
    category: 'Aphasia',
    description: 'Severe impairment in all language modalities (expression, comprehension, reading, writing).',
    causes: ['Large left hemisphere stroke'],
    commonObservations: ['Limited verbal output', 'Poor comprehension', 'Difficulty with reading/writing'],
    labs: ['None specific'],
    imaging: ['Brain MRI/CT'],
    meds: ['None specific'],
    redFlags: ['Severe communication barrier', 'Frustration'],
    pathways: {
      assessments: [
        { id: 'ga1', title: 'Western Aphasia Battery (WAB)', description: 'Comprehensive assessment of language function.', type: 'assessment', evidenceLevel: 'High', link: 'https://www.asha.org/' }
      ],
      treatments: [
        { id: 'gt1', title: 'AAC Implementation', description: 'Introducing low/high-tech AAC for communication.', type: 'treatment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' },
        { id: 'gt2', title: 'Communication Partner Training', description: 'Educating family/caregivers.', type: 'treatment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' }
      ],
      strategies: [
        { id: 'gs1', title: 'Total Communication', description: 'Using all available communication modalities.', type: 'strategy', link: 'https://www.asha.org/' },
        { id: 'gs2', title: 'Visual Aids', description: 'Using pictures/symbols for communication.', type: 'strategy', link: 'https://www.asha.org/' }
      ]
    }
  },
  {
    id: 'dysarthria-flaccid',
    label: 'Flaccid Dysarthria',
    category: 'Dysarthria/Voice',
    description: 'Speech impairment due to lower motor neuron damage, causing muscle weakness and hypotonia.',
    causes: ['Brainstem stroke', 'Cranial nerve damage', 'ALS'],
    commonObservations: ['Hypernasality', 'Breathy voice', 'Imprecise articulation'],
    labs: ['None specific'],
    imaging: ['Brain MRI/CT'],
    meds: ['None specific'],
    redFlags: ['Respiratory compromise', 'Severe intelligibility deficits'],
    pathways: {
      assessments: [
        { id: 'fd1', title: 'Frenchay Dysarthria Assessment', description: 'Differential diagnosis.', type: 'assessment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' }
      ],
      treatments: [
        { id: 'ft1', title: 'Palatal Lift Prosthesis', description: 'Addressing hypernasality.', type: 'treatment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' },
        { id: 'ft2', title: 'Articulation Therapy', description: 'Improving articulatory precision.', type: 'treatment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' }
      ],
      strategies: [
        { id: 'fs1', title: 'Amplification', description: 'Using voice amplifiers.', type: 'strategy', link: 'https://www.asha.org/' },
        { id: 'fs2', title: 'Slowed Rate', description: 'Improving intelligibility.', type: 'strategy', link: 'https://www.asha.org/' }
      ]
    }
  },
  {
    id: 'dysphagia-silent-aspiration',
    label: 'Silent Aspiration',
    category: 'Dysphagia',
    description: 'Aspiration of material without overt signs such as coughing or throat clearing.',
    causes: ['Reduced sensory awareness', 'Neurological impairment'],
    commonObservations: ['Increased respiratory rate', 'Oxygen desaturation', 'Fever of unknown origin'],
    labs: ['WBC (infection risk)'],
    imaging: ['MBSS', 'FEES'],
    meds: ['None specific'],
    redFlags: ['Recurrent pneumonia', 'Unexplained weight loss'],
    pathways: {
      assessments: [
        { id: 'sa1', title: 'Instrumental Assessment (MBSS/FEES)', description: 'Gold standard for detecting silent aspiration.', type: 'assessment', evidenceLevel: 'High', link: 'https://www.asha.org/' }
      ],
      treatments: [
        { id: 'sat1', title: 'Compensatory Strategies', description: 'Postural changes, bolus modification.', type: 'treatment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' }
      ],
      strategies: [
        { id: 'sas1', title: 'Frequent Oral Care', description: 'Reducing bacterial load in oral cavity.', type: 'strategy', link: 'https://www.asha.org/' }
      ]
    }
  },
  {
    id: 'cog-pragmatics-deficits',
    label: 'Social Communication (Pragmatics) Deficits',
    category: 'Cognition',
    description: 'Difficulty with social use of language, including turn-taking, topic maintenance, and interpreting non-literal language.',
    causes: ['Right Hemisphere Stroke', 'TBI', 'Autism Spectrum Disorder'],
    commonObservations: ['Interrupting', 'Inappropriate topic choice', 'Difficulty interpreting sarcasm/humor'],
    labs: ['None specific'],
    imaging: ['Brain MRI/CT'],
    meds: ['None specific'],
    redFlags: ['Social isolation', 'Conflict in relationships'],
    pathways: {
      assessments: [
        { id: 'pd1', title: 'Social Language Assessment', description: 'Observational assessment of social communication.', type: 'assessment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' }
      ],
      treatments: [
        { id: 'pdt1', title: 'Social Skills Training', description: 'Group or individual therapy for social interaction.', type: 'treatment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' }
      ],
      strategies: [
        { id: 'pds1', title: 'Role-Playing', description: 'Practicing social scenarios.', type: 'strategy', link: 'https://www.asha.org/' }
      ]
    }
  },
  {
    id: 'aphasia-brocas',
    label: 'Broca\'s Aphasia',
    category: 'Aphasia',
    description: 'Non-fluent, effortful speech with relatively preserved comprehension.',
    causes: ['Left frontal lobe stroke'],
    commonObservations: ['Telegraphic speech', 'Frustration', 'Relatively preserved comprehension'],
    labs: ['None specific'],
    imaging: ['Brain MRI/CT'],
    meds: ['None specific'],
    redFlags: ['Severe frustration', 'Depression'],
    pathways: {
      assessments: [
        { id: 'ba1', title: 'Western Aphasia Battery (WAB)', description: 'Assessing fluency and comprehension.', type: 'assessment', evidenceLevel: 'High', link: 'https://www.asha.org/' }
      ],
      treatments: [
        { id: 'bt1', title: 'Melodic Intonation Therapy (MIT)', description: 'Using melody to facilitate speech production.', type: 'treatment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' },
        { id: 'bt2', title: 'Constraint-Induced Language Therapy (CILT)', description: 'Forcing verbal output.', type: 'treatment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' }
      ],
      strategies: [
        { id: 'bs1', title: 'Communication Partner Training', description: 'Educating family/caregivers.', type: 'strategy', link: 'https://www.asha.org/' }
      ]
    }
  },
  {
    id: 'voice-vocal-fold-paralysis',
    label: 'Vocal Fold Paralysis/Paresis',
    category: 'Dysarthria/Voice',
    description: 'Impairment of vocal fold movement, leading to breathy voice and swallowing difficulties.',
    causes: ['Post-surgical (e.g., thyroidectomy)', 'Neurological damage', 'Tumor'],
    commonObservations: ['Breathy voice', 'Reduced loudness', 'Coughing with liquids'],
    labs: ['None specific'],
    imaging: ['Laryngoscopy'],
    meds: ['None specific'],
    redFlags: ['Respiratory compromise', 'Aspiration risk'],
    pathways: {
      assessments: [
        { id: 'vp1', title: 'Laryngoscopy', description: 'Direct visualization of vocal fold movement.', type: 'assessment', evidenceLevel: 'High', link: 'https://www.asha.org/' }
      ],
      treatments: [
        { id: 'vt1', title: 'Vocal Function Exercises', description: 'Strengthening vocal folds.', type: 'treatment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' },
        { id: 'vt2', title: 'Surgical Referral (e.g., Medialization)', description: 'Surgical intervention for vocal fold closure.', type: 'treatment', evidenceLevel: 'High', link: 'https://www.asha.org/' }
      ],
      strategies: [
        { id: 'vs1', title: 'Vocal Hygiene', description: 'Hydration, reducing vocal strain.', type: 'strategy', link: 'https://www.asha.org/' }
      ]
    }
  },
  {
    id: 'dysphagia-reduced-mastication',
    label: 'Reduced Mastication',
    category: 'Dysphagia',
    description: 'Difficulty chewing food effectively, leading to poor bolus formation.',
    causes: ['Dental issues', 'Lingual weakness', 'Reduced jaw strength'],
    commonObservations: ['Food pocketing', 'Prolonged meal times', 'Spitting out food'],
    labs: ['None specific'],
    imaging: ['Clinical Swallow Exam'],
    meds: ['None specific'],
    redFlags: ['Nutritional decline', 'Choking risk'],
    pathways: {
      assessments: [
        { id: 'rm1', title: 'Oral Mechanism Exam', description: 'Assess jaw, lingual, and labial strength.', type: 'assessment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' }
      ],
      treatments: [
        { id: 'rmt1', title: 'Jaw/Lingual Strengthening', description: 'Exercises to improve masticatory musculature.', type: 'treatment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' }
      ],
      strategies: [
        { id: 'rms1', title: 'Diet Modification', description: 'Softening food textures.', type: 'strategy', link: 'https://iddsi.org/' }
      ]
    }
  },
  {
    id: 'cog-orientation-deficits',
    label: 'Orientation Deficits',
    category: 'Cognition',
    description: 'Difficulty with orientation to person, place, time, or situation.',
    causes: ['Dementia', 'TBI', 'Delirium'],
    commonObservations: ['Disorientation to time/place', 'Confusion', 'Agitation'],
    labs: ['Metabolic panel', 'B12'],
    imaging: ['Brain MRI/CT'],
    meds: ['None specific'],
    redFlags: ['Safety risks', 'Inability to follow rules'],
    pathways: {
      assessments: [
        { id: 'od1', title: 'Orientation Screening', description: 'Standardized questions for orientation.', type: 'assessment', evidenceLevel: 'High', link: 'https://www.asha.org/' }
      ],
      treatments: [
        { id: 'odt1', title: 'Reality Orientation Therapy', description: 'Consistent reinforcement of orientation.', type: 'treatment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' }
      ],
      strategies: [
        { id: 'ods1', title: 'Environmental Cues', description: 'Clocks, calendars, visual aids.', type: 'strategy', link: 'https://www.asha.org/' }
      ]
    }
  },
  {
    id: 'aphasia-wernickes',
    label: 'Wernicke\'s Aphasia',
    category: 'Aphasia',
    description: 'Fluent, effortless speech with impaired comprehension and jargon.',
    causes: ['Left temporal lobe stroke'],
    commonObservations: ['Fluent jargon', 'Impaired comprehension', 'Anosognosia'],
    labs: ['None specific'],
    imaging: ['Brain MRI/CT'],
    meds: ['None specific'],
    redFlags: ['Communication breakdown', 'Safety risks due to poor comprehension'],
    pathways: {
      assessments: [
        { id: 'wa1', title: 'Western Aphasia Battery (WAB)', description: 'Assessing fluency and comprehension.', type: 'assessment', evidenceLevel: 'High', link: 'https://www.asha.org/' }
      ],
      treatments: [
        { id: 'wt1', title: 'Comprehension Therapy', description: 'Targeting auditory comprehension.', type: 'treatment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' }
      ],
      strategies: [
        { id: 'ws1', title: 'Communication Partner Training', description: 'Educating family/caregivers.', type: 'strategy', link: 'https://www.asha.org/' }
      ]
    }
  },
  {
    id: 'dysarthria-hypokinetic',
    label: 'Hypokinetic Dysarthria',
    category: 'Dysarthria/Voice',
    description: 'Speech impairment characterized by reduced volume, rate, and articulatory precision, often seen in Parkinson\'s disease.',
    causes: ['Parkinson\'s disease'],
    commonObservations: ['Reduced volume', 'Monotone', 'Rapid rate'],
    labs: ['None specific'],
    imaging: ['None specific'],
    meds: ['Dopaminergic medications'],
    redFlags: ['Social isolation', 'Intelligibility deficits'],
    pathways: {
      assessments: [
        { id: 'hd1', title: 'Speech Intelligibility Assessment', description: 'Assessing volume and rate.', type: 'assessment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' }
      ],
      treatments: [
        { id: 'ht1', title: 'LSVT LOUD', description: 'Intensive treatment to increase vocal loudness.', type: 'treatment', evidenceLevel: 'High', link: 'https://www.lsvtglobal.com/' }
      ],
      strategies: [
        { id: 'hs1', title: 'Voice Amplification', description: 'Using portable voice amplifiers.', type: 'strategy', link: 'https://www.asha.org/' }
      ]
    }
  },
  {
    id: 'dysphagia-premature-spillage',
    label: 'Premature Bolus Spillage',
    category: 'Dysphagia',
    description: 'Bolus enters the pharynx before the swallow trigger.',
    causes: ['Reduced lingual control', 'Delayed swallow trigger'],
    commonObservations: ['Coughing before swallow', 'Throat clearing'],
    labs: ['None specific'],
    imaging: ['MBSS', 'FEES'],
    meds: ['None specific'],
    redFlags: ['Aspiration risk'],
    pathways: {
      assessments: [
        { id: 'ps1', title: 'MBSS', description: 'Visualize spillage.', type: 'assessment', evidenceLevel: 'High', link: 'https://www.asha.org/' }
      ],
      treatments: [
        { id: 'pst1', title: 'Chin Tuck', description: 'Narrows airway.', type: 'treatment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' }
      ],
      strategies: [
        { id: 'pss1', title: 'Small Bolus Size', description: 'Control volume.', type: 'strategy', link: 'https://www.asha.org/' }
      ]
    }
  },
  {
    id: 'dysphagia-nasal-regurgitation',
    label: 'Nasal Regurgitation',
    category: 'Dysphagia',
    description: 'Food or liquid entering the nasal cavity during swallowing.',
    causes: ['Velopharyngeal insufficiency', 'Palatal weakness'],
    commonObservations: ['Nasal discharge', 'Nasal voice quality'],
    labs: ['None specific'],
    imaging: ['FEES', 'MBSS'],
    meds: ['None specific'],
    redFlags: ['Aspiration risk'],
    pathways: {
      assessments: [
        { id: 'nr1', title: 'FEES', description: 'Visualize velopharyngeal closure.', type: 'assessment', evidenceLevel: 'High', link: 'https://www.asha.org/' }
      ],
      treatments: [
        { id: 'nrt1', title: 'Palatal Lift', description: 'Prosthetic support.', type: 'treatment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' }
      ],
      strategies: [
        { id: 'nrs1', title: 'Small Bolus Size', description: 'Control volume.', type: 'strategy', link: 'https://www.asha.org/' }
      ]
    }
  },
  {
    id: 'dysphagia-esophageal-dysphagia',
    label: 'Esophageal Dysphagia',
    category: 'Dysphagia',
    description: 'Difficulty with bolus transport through the esophagus.',
    causes: ['Strictures', 'GERD', 'Motility disorders'],
    commonObservations: ['Feeling of food stuck in chest', 'Regurgitation'],
    labs: ['None specific'],
    imaging: ['Esophagram', 'Manometry'],
    meds: ['PPIs'],
    redFlags: ['Weight loss', 'Pain'],
    pathways: {
      assessments: [
        { id: 'ed1', title: 'Esophagram', description: 'Visualize esophageal transport.', type: 'assessment', evidenceLevel: 'High', link: 'https://www.asha.org/' }
      ],
      treatments: [
        { id: 'edt1', title: 'Medical Management', description: 'PPIs, dilation.', type: 'treatment', evidenceLevel: 'High', link: 'https://www.asha.org/' }
      ],
      strategies: [
        { id: 'eds1', title: 'Small Bites', description: 'Slow intake.', type: 'strategy', link: 'https://www.asha.org/' }
      ]
    }
  },
  {
    id: 'cog-attention-sustained',
    label: 'Sustained Attention Deficits',
    category: 'Cognition',
    description: 'Difficulty maintaining focus on a task over time.',
    causes: ['TBI', 'Stroke', 'Dementia'],
    commonObservations: ['Task abandonment', 'Fatigue', 'Inconsistent performance'],
    labs: ['None specific'],
    imaging: ['Brain MRI/CT'],
    meds: ['Stimulants'],
    redFlags: ['Safety risks', 'Inability to complete tasks'],
    pathways: {
      assessments: [
        { id: 'sa1', title: 'Continuous Performance Test', description: 'Assesses sustained attention.', type: 'assessment', evidenceLevel: 'High', link: 'https://www.asha.org/' }
      ],
      treatments: [
        { id: 'sat1', title: 'Attention Training', description: 'Graded attention tasks.', type: 'treatment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' }
      ],
      strategies: [
        { id: 'sas1', title: 'Pacing', description: 'Taking breaks.', type: 'strategy', link: 'https://www.asha.org/' }
      ]
    }
  },
  {
    id: 'cog-problem-solving',
    label: 'Problem-Solving Deficits',
    category: 'Cognition',
    description: 'Difficulty identifying problems and generating solutions.',
    causes: ['Frontal lobe damage', 'TBI'],
    commonObservations: ['Impulsivity', 'Poor planning', 'Difficulty with novel tasks'],
    labs: ['None specific'],
    imaging: ['Brain MRI/CT'],
    meds: ['None specific'],
    redFlags: ['Safety risks', 'Inability to manage daily activities'],
    pathways: {
      assessments: [
        { id: 'ps1', title: 'Problem Solving Assessment', description: 'Assesses problem-solving skills.', type: 'assessment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' }
      ],
      treatments: [
        { id: 'pst1', title: 'Problem-Solving Therapy', description: 'Systematic approach.', type: 'treatment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' }
      ],
      strategies: [
        { id: 'pss1', title: 'External Aids', description: 'Using checklists.', type: 'strategy', link: 'https://www.asha.org/' }
      ]
    }
  },
  {
    id: 'cog-metacognition',
    label: 'Metacognitive Deficits',
    category: 'Cognition',
    description: 'Difficulty with self-awareness and monitoring of one\'s own cognitive processes.',
    causes: ['TBI', 'Frontal lobe damage'],
    commonObservations: ['Poor self-awareness', 'Difficulty predicting performance', 'Inability to use strategies'],
    labs: ['None specific'],
    imaging: ['Brain MRI/CT'],
    meds: ['None specific'],
    redFlags: ['Safety risks', 'Inability to learn from mistakes'],
    pathways: {
      assessments: [
        { id: 'md1', title: 'Self-Awareness Assessment', description: 'Assesses self-awareness.', type: 'assessment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' }
      ],
      treatments: [
        { id: 'mdt1', title: 'Metacognitive Strategy Training', description: 'Teaching self-monitoring.', type: 'treatment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' }
      ],
      strategies: [
        { id: 'mds1', title: 'Self-Reflection', description: 'Reflecting on performance.', type: 'strategy', link: 'https://www.asha.org/' }
      ]
    }
  },
  {
    id: 'aphasia-conduction',
    label: 'Conduction Aphasia',
    category: 'Aphasia',
    description: 'Impaired repetition with relatively preserved comprehension and fluency.',
    causes: ['Left parietal lobe stroke'],
    commonObservations: ['Impaired repetition', 'Phonemic paraphasias', 'Good comprehension'],
    labs: ['None specific'],
    imaging: ['Brain MRI/CT'],
    meds: ['None specific'],
    redFlags: ['Communication breakdown'],
    pathways: {
      assessments: [
        { id: 'ca1', title: 'Western Aphasia Battery (WAB)', description: 'Assessing repetition and fluency.', type: 'assessment', evidenceLevel: 'High', link: 'https://www.asha.org/' }
      ],
      treatments: [
        { id: 'ct1', title: 'Repetition Therapy', description: 'Targeting repetition.', type: 'treatment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' }
      ],
      strategies: [
        { id: 'cs1', title: 'Self-Correction', description: 'Monitoring speech output.', type: 'strategy', link: 'https://www.asha.org/' }
      ]
    }
  },
  {
    id: 'aphasia-transcortical-motor',
    label: 'Transcortical Motor Aphasia',
    category: 'Aphasia',
    description: 'Non-fluent speech with preserved repetition and comprehension.',
    causes: ['Left frontal lobe stroke'],
    commonObservations: ['Non-fluent speech', 'Preserved repetition', 'Good comprehension'],
    labs: ['None specific'],
    imaging: ['Brain MRI/CT'],
    meds: ['None specific'],
    redFlags: ['Communication breakdown'],
    pathways: {
      assessments: [
        { id: 'tma1', title: 'Western Aphasia Battery (WAB)', description: 'Assessing fluency and repetition.', type: 'assessment', evidenceLevel: 'High', link: 'https://www.asha.org/' }
      ],
      treatments: [
        { id: 'tmt1', title: 'Fluency Therapy', description: 'Targeting verbal output.', type: 'treatment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' }
      ],
      strategies: [
        { id: 'tms1', title: 'Communication Partner Training', description: 'Educating family/caregivers.', type: 'strategy', link: 'https://www.asha.org/' }
      ]
    }
  },
  {
    id: 'aphasia-transcortical-sensory',
    label: 'Transcortical Sensory Aphasia',
    category: 'Aphasia',
    description: 'Fluent speech with impaired comprehension and preserved repetition.',
    causes: ['Left temporal/parietal stroke'],
    commonObservations: ['Fluent speech', 'Impaired comprehension', 'Preserved repetition'],
    labs: ['None specific'],
    imaging: ['Brain MRI/CT'],
    meds: ['None specific'],
    redFlags: ['Communication breakdown', 'Safety risks'],
    pathways: {
      assessments: [
        { id: 'tsa1', title: 'Western Aphasia Battery (WAB)', description: 'Assessing fluency and comprehension.', type: 'assessment', evidenceLevel: 'High', link: 'https://www.asha.org/' }
      ],
      treatments: [
        { id: 'tst1', title: 'Comprehension Therapy', description: 'Targeting auditory comprehension.', type: 'treatment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' }
      ],
      strategies: [
        { id: 'tss1', title: 'Communication Partner Training', description: 'Educating family/caregivers.', type: 'strategy', link: 'https://www.asha.org/' }
      ]
    }
  },
  {
    id: 'dysarthria-spastic',
    label: 'Spastic Dysarthria',
    category: 'Dysarthria/Voice',
    description: 'Speech impairment due to upper motor neuron damage, causing muscle spasticity and weakness.',
    causes: ['Stroke', 'TBI', 'ALS'],
    commonObservations: ['Strained-strangled voice', 'Slow rate', 'Hypernasality'],
    labs: ['None specific'],
    imaging: ['Brain MRI/CT'],
    meds: ['Muscle relaxants'],
    redFlags: ['Swallowing difficulties', 'Respiratory compromise'],
    pathways: {
      assessments: [
        { id: 'sd1', title: 'Frenchay Dysarthria Assessment', description: 'Differential diagnosis.', type: 'assessment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' }
      ],
      treatments: [
        { id: 'st1', title: 'Relaxation Techniques', description: 'Reducing muscle tension.', type: 'treatment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' }
      ],
      strategies: [
        { id: 'ss1', title: 'Slowed Rate', description: 'Improving intelligibility.', type: 'strategy', link: 'https://www.asha.org/' }
      ]
    }
  },
  {
    id: 'dysarthria-ataxic',
    label: 'Ataxic Dysarthria',
    category: 'Dysarthria/Voice',
    description: 'Speech impairment due to cerebellar damage, causing incoordination.',
    causes: ['Cerebellar stroke', 'Multiple Sclerosis'],
    commonObservations: ['Scanning speech', 'Irregular articulatory breakdowns', 'Excess and equal stress'],
    labs: ['None specific'],
    imaging: ['Brain MRI/CT'],
    meds: ['None specific'],
    redFlags: ['Ataxia', 'Safety risks'],
    pathways: {
      assessments: [
        { id: 'ad1', title: 'Frenchay Dysarthria Assessment', description: 'Differential diagnosis.', type: 'assessment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' }
      ],
      treatments: [
        { id: 'at1', title: 'Rate Control', description: 'Improving articulatory precision.', type: 'treatment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' }
      ],
      strategies: [
        { id: 'as1', title: 'Pacing', description: 'Slowing rate.', type: 'strategy', link: 'https://www.asha.org/' }
      ]
    }
  },
  {
    id: 'dysarthria-mixed',
    label: 'Mixed Dysarthria',
    category: 'Dysarthria/Voice',
    description: 'Speech impairment due to damage to multiple motor systems.',
    causes: ['ALS', 'Multiple Sclerosis'],
    commonObservations: ['Variable speech characteristics', 'Reduced intelligibility'],
    labs: ['None specific'],
    imaging: ['Brain MRI/CT'],
    meds: ['None specific'],
    redFlags: ['Progressive decline', 'Swallowing difficulties'],
    pathways: {
      assessments: [
        { id: 'md1', title: 'Frenchay Dysarthria Assessment', description: 'Differential diagnosis.', type: 'assessment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' }
      ],
      treatments: [
        { id: 'mt1', title: 'Compensatory Strategies', description: 'Improving intelligibility.', type: 'treatment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' }
      ],
      strategies: [
        { id: 'ms1', title: 'AAC Implementation', description: 'Using AAC for communication.', type: 'strategy', link: 'https://www.asha.org/' }
      ]
    }
  },
  {
    id: 'dysarthria-hyperkinetic',
    label: 'Hyperkinetic Dysarthria',
    category: 'Dysarthria/Voice',
    description: 'Speech impairment due to basal ganglia damage, characterized by involuntary movements.',
    causes: ['Huntington\'s disease', 'Tardive dyskinesia'],
    commonObservations: ['Involuntary movements', 'Variable rate', 'Articulatory breakdowns'],
    labs: ['None specific'],
    imaging: ['Brain MRI/CT'],
    meds: ['Dopamine-depleting agents'],
    redFlags: ['Involuntary movements during speech', 'Safety risks'],
    pathways: {
      assessments: [
        { id: 'hd1', title: 'Motor Speech Examination', description: 'Assessing involuntary movements.', type: 'assessment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' }
      ],
      treatments: [
        { id: 'ht1', title: 'Behavioral Strategies', description: 'Reducing involuntary movements.', type: 'treatment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' }
      ],
      strategies: [
        { id: 'hs1', title: 'Rate Control', description: 'Slowing rate.', type: 'strategy', link: 'https://www.asha.org/' }
      ]
    }
  },
  {
    id: 'cog-safety-awareness',
    label: 'Safety Awareness Deficits',
    category: 'Cognition',
    description: 'Difficulty recognizing and responding to safety hazards in the environment.',
    causes: ['TBI', 'Dementia', 'Right Hemisphere Stroke'],
    commonObservations: ['Impulsivity', 'Poor judgment', 'Inability to follow safety protocols'],
    labs: ['None specific'],
    imaging: ['Brain MRI/CT'],
    meds: ['None specific'],
    redFlags: ['Falls', 'Safety incidents'],
    pathways: {
      assessments: [
        { id: 'sa1', title: 'Safety Assessment', description: 'Assessing safety awareness.', type: 'assessment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' }
      ],
      treatments: [
        { id: 'sat1', title: 'Safety Training', description: 'Teaching safety protocols.', type: 'treatment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/' }
      ],
      strategies: [
        { id: 'sas1', title: 'Environmental Modification', description: 'Reducing hazards.', type: 'strategy', link: 'https://www.asha.org/' }
      ]
    }
  },
  {
    id: 'trach-decannulation',
    label: 'Tracheostomy Decannulation Protocol',
    category: 'Tracheostomy',
    description: 'Assessment and management of patient readiness for tracheostomy tube removal.',
    causes: ['Respiratory failure', 'Prolonged ventilation', 'Airway obstruction'],
    commonObservations: ['Secretions', 'Cuff deflation tolerance', 'Vocal quality with valve'],
    labs: ['ABGs (Arterial Blood Gases)', 'CXR (Chest X-ray)'],
    imaging: ['CXR (check tube placement)'],
    meds: ['Bronchodilators', 'Mucolytics'],
    redFlags: ['Inability to tolerate capping', 'Copious secretions', 'Unstable respiratory status'],
    pathways: {
      assessments: [
        { id: 'tr1', title: 'Cuff Deflation Tolerance', description: 'Ability to breathe with cuff deflated.', type: 'assessment', evidenceLevel: 'High', link: 'https://www.asha.org/practice-portal/clinical-topics/tracheostomy-and-ventilator-dependence/assessment/' },
        { id: 'tr2', title: 'Passy-Muir Valve Trial', description: 'Assessing vocalization and airway protection with valve.', type: 'assessment', evidenceLevel: 'High', link: 'https://www.passy-muir.com/' },
        { id: 'tr3', title: 'Fiberoptic Endoscopic Evaluation of Swallowing (FEES)', description: 'Assessing airway protection.', type: 'assessment', evidenceLevel: 'High', link: 'https://www.asha.org/practice-portal/clinical-topics/tracheostomy-and-ventilator-dependence/assessment/' }
      ],
      treatments: [
        { 
          id: 'tr4', 
          title: 'Capping Trials', 
          description: 'Progressive increase in time with capped trach.', 
          type: 'treatment', 
          evidenceLevel: 'High',
          media: {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
            caption: 'Tracheostomy tube visualization'
          },
          link: 'https://www.asha.org/practice-portal/clinical-topics/tracheostomy-and-ventilator-dependence/treatment-of-tracheostomy/'
        },
        { id: 'tr5', title: 'Secretions Management', description: 'Suctioning and cough training.', type: 'treatment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/practice-portal/clinical-topics/tracheostomy-and-ventilator-dependence/treatment-of-tracheostomy/' },
        { id: 'tr6', title: 'Weaning Protocols', description: 'Systematic reduction of tube size.', type: 'treatment', evidenceLevel: 'Moderate', link: 'https://www.asha.org/practice-portal/clinical-topics/tracheostomy-and-ventilator-dependence/treatment-of-tracheostomy/' }
      ],
      strategies: [
        { id: 'tr7', title: 'Communication Optimization', description: 'Ensuring reliable communication during trials.', type: 'strategy', link: 'https://www.asha.org/practice-portal/clinical-topics/tracheostomy-and-ventilator-dependence/treatment-of-tracheostomy/' },
        { id: 'tr8', title: 'Patient Education', description: 'Educating patient on decannulation process.', type: 'strategy', link: 'https://www.asha.org/practice-portal/clinical-topics/tracheostomy-and-ventilator-dependence/treatment-of-tracheostomy/' }
      ]
    }
  }
];