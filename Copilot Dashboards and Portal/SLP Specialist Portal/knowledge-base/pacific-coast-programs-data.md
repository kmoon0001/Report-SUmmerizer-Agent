CONTENT FROM pacific coast-programs-data.ts

import { Postette } from './pacific coast-slp-data';
import { 
  TrendingUp, 
  Utensils, 
  Brain, 
  Wind,
  Users,
  Heart
} from 'lucide-react';

export const ENSIGN_PROGRAMS_DATA: Postette[] = [
  {
    id: 'prog-dev-caplico',
    title: 'The SLP Leader: Driving Success with CAPLICO',
    category: 'Program Development',
    icon: TrendingUp,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800',
    sections: [
      {
        title: 'Overview',
        type: 'text',
        content: 'As an SLP in a Skilled Nursing Facility, you are uniquely positioned to lead programs that transform patient care. By aligning your clinical initiatives with Pacific Coast\'s missionâ€”to dignify and transform post-acute careâ€”you can elevate the entire facility.'
      },
      {
        title: 'The CAPLICO Approach to Program Building',
        type: 'bullets',
        content: [
          'Customer Second: Empower your therapy and nursing teams with the training they need. When staff feel confident, patients thrive.',
          'Accountability: Track your program\'s outcomes (e.g., reduced pneumonias, improved weights) and share the data.',
          'Passion for Learning: Stay evidence-based. Bring the latest research in dysphagia and cognition to your facility.',
          'Love One Another: Foster interdisciplinary collaboration. A successful program requires nursing, dietary, and therapy working together.',
          'Intelligent Risk Taking: Don\'t be afraid to pilot a new protocol, like a Free Water Program or EMST, even if it\'s new to the building.',
          'Celebration: Highlight patient wins and staff champions in morning stand-up.',
          'Ownership: Take the lead. Be the champion for safe swallowing and cognitive wellness.'
        ]
      },
      {
        title: 'Why SLPs Should Lead',
        type: 'text',
        content: 'SLPs bridge the gap between medical complexity and daily quality of life. Whether it\'s safely liberalizing a diet or setting up a cognitive maintenance program, your expertise directly impacts the facility\'s quality measures and the patient\'s dignity.'
      }
    ]
  },
  {
    id: 'prog-dev-hydration',
    title: 'Hydration & Weight Loss: The Dining Room Revolution',
    category: 'Program Development',
    icon: Utensils,
    image: 'https://images.unsplash.com/photo-1498837167922-41c53b4f0f4b?auto=format&fit=crop&q=80&w=800',
    sections: [
      {
        title: 'The Clinical Need',
        type: 'text',
        content: 'Dehydration and unintended weight loss are critical risks in the SNF setting, leading to UTIs, falls, and functional decline. SLPs can spearhead programs that make eating and drinking safe, appealing, and dignified.'
      },
      {
        title: 'Program Ideas to Implement',
        type: 'bullets',
        content: [
          'Frazier Free Water Protocol: Pilot a program allowing patients on thickened liquids to have regular water between meals with strict oral care.',
          'Dining Room Enhancement: Train CNAs on optimal feeding techniques, positioning, and sensory stimulation during meals.',
          'Flavor Enhancement & Hydration Stations: Work with dietary to create visually appealing hydration carts (e.g., infused waters) for patients with safe swallows.',
          'Texture Liberalization: Regularly screen patients on altered diets to upgrade textures whenever safely possible, improving intake and quality of life.'
        ]
      },
      {
        title: 'Step-by-Step Implementation Guide',
        type: 'bullets',
        content: [
          'Step 1: Identify a Champion - Find a CNA or nurse who is passionate about patient care to help pilot the program.',
          'Step 2: Gather Baseline Data - Track current hydration levels, UTI rates, or weight loss flags for 2-4 weeks.',
          'Step 3: In-Service Training - Conduct a 15-minute hands-on training during shift change. Focus on the "why" and "how".',
          'Step 4: Launch Pilot - Start the program on a single hallway or with 5-10 specific patients.',
          'Step 5: Review & Expand - After 30 days, review the data. Celebrate successes publicly and expand to the next unit.'
        ]
      },
      {
        title: 'Benefits to Patients & Facility',
        type: 'bullets',
        content: [
          'Patients: Improved hydration, fewer UTIs, increased meal satisfaction, and a restored sense of dignity.',
          'Facility: Better quality measures (reduced weight loss flags), lower hospital readmission rates, and higher family satisfaction.'
        ]
      },
      {
        title: 'Your Action Plan',
        type: 'alert',
        content: 'Start small. Choose one unit to pilot a hydration cart or train a core group of "Dining Champions" among the nursing staff.'
      }
    ]
  },
  {
    id: 'prog-dev-cognitive',
    title: 'Cognitive Wellness: Beyond the Memory Unit',
    category: 'Program Development',
    icon: Brain,
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800',
    sections: [
      {
        title: 'The Clinical Need',
        type: 'text',
        content: 'Cognitive decline impacts every aspect of a patient\'s rehab potential and daily life. SLPs can create facility-wide programs that focus on what patients can do, rather than what they\'ve lost.'
      },
      {
        title: 'Program Ideas to Implement',
        type: 'bullets',
        content: [
          'Montessori-Based Dementia Programming: Create purposeful, failure-free activities (e.g., sorting, folding) that match the patient\'s cognitive stage.',
          'Spaced Retrieval Training (SRT) Stations: Train staff to use SRT for essential safety information, like using the call light or locking wheelchair brakes.',
          'Environmental Modifications: Lead an initiative to improve facility signage, lighting, and wayfinding to reduce confusion and wandering.',
          'Cognitive Maintenance Groups: Develop structured group activities focusing on reminiscence, music, and sensory stimulation.'
        ]
      },
      {
        title: 'Step-by-Step Implementation Guide',
        type: 'bullets',
        content: [
          'Step 1: Environmental Audit - Walk the facility with a "dementia lens". Identify confusing areas, poor lighting, or lack of engagement stations.',
          'Step 2: Collaborate with Activities - Meet with the Life Enrichment Director to align goals and share resources.',
          'Step 3: Create "Busy Boxes" - Assemble kits with sorting tasks, tactile objects, and simple puzzles. Place them at nursing stations.',
          'Step 4: Staff Education - Teach staff the "Positive Approach to Care" (e.g., hand-under-hand technique, validating emotions).',
          'Step 5: Measure Impact - Track reductions in PRN anxiety medications and behavioral incident reports.'
        ]
      },
      {
        title: 'Benefits to Patients & Facility',
        type: 'bullets',
        content: [
          'Patients: Reduced anxiety and agitation, increased engagement, and preservation of remaining cognitive skills.',
          'Facility: Decreased behavioral incidents, reduced use of psychotropic medications, and a more peaceful, dignified environment.'
        ]
      },
      {
        title: 'Your Action Plan',
        type: 'alert',
        content: 'Partner with Activities/Life Enrichment. Your clinical knowledge combined with their resources can create powerful, daily cognitive stimulation.'
      }
    ]
  },
  {
    id: 'prog-dev-respiratory',
    title: 'Respiratory Support: Breathing Life into Rehab',
    category: 'Program Development',
    icon: Wind,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
    sections: [
      {
        title: 'The Clinical Need',
        type: 'text',
        content: 'Respiratory weakness exacerbates dysphagia, limits vocal intensity, and reduces overall endurance. SLPs are uniquely trained to rehabilitate the upper airway and respiratory system.'
      },
      {
        title: 'Program Ideas to Implement',
        type: 'bullets',
        content: [
          'EMST/IMST Programs: Introduce Expiratory/Inpiratory Muscle Strength Training to improve cough strength, swallow safety, and decannulation success.',
          'Trach/Vent Weaning Team: Form an interdisciplinary team (SLP, RT, Nursing) to standardize speaking valve trials and weaning protocols.',
          'Post-Extubation Screening: Create a protocol where SLPs automatically screen patients post-extubation for dysphagia and vocal fold pathology.',
          'Breath Support for Phonation: Group or individual programs focusing on respiratory control for patients with Parkinson\'s or dysarthria.'
        ]
      },
      {
        title: 'Step-by-Step Implementation Guide',
        type: 'bullets',
        content: [
          'Step 1: Interdisciplinary Meeting - Schedule a sit-down with the Respiratory Therapist (RT) and Director of Nursing (DON).',
          'Step 2: Standardize Protocols - Develop a clear, written protocol for speaking valve trials and decannulation readiness.',
          'Step 3: Equipment Audit - Ensure the facility has the necessary supplies (e.g., EMST devices, speaking valves, pulse oximeters).',
          'Step 4: Joint Evaluations - Co-treat with the RT for the first 5 complex respiratory patients to establish a workflow.',
          'Step 5: Track Outcomes - Monitor days to decannulation, pneumonia rates, and patient satisfaction scores.'
        ]
      },
      {
        title: 'Benefits to Patients & Facility',
        type: 'bullets',
        content: [
          'Patients: Stronger coughs to clear airway, ability to speak and communicate with family, and safer swallowing.',
          'Facility: Faster decannulation rates, reduced pneumonia risk, and positioning the facility as a leader in complex respiratory care.'
        ]
      },
      {
        title: 'Your Action Plan',
        type: 'alert',
        content: 'Connect with your Respiratory Therapist (RT). A strong SLP-RT partnership is the foundation of any successful respiratory or trach program.'
      }
    ]
  }
];


