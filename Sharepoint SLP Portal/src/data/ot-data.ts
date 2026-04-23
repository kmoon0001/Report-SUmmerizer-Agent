/**
 * OT Portal navigation data with nested content/subspecialties
 * Mirrors SLP_DATA and PT_DATA structure for consistent UI rendering
 */
import {
  Brain,
  FileText,
  Heart,
  Library,
  Microscope,
  Shield,
  Sparkles,
  Target,
  Baby,
  Clipboard,
  Calculator,
  GraduationCap,
  Hand,
  Home,
  Briefcase,
} from "lucide-react";

export interface OTSubCategory {
  title: string;
  items?: Array<{
    title: string;
    description?: string;
    type: "external" | "internal" | "tool";
    url?: string;
    confidenceScore?: number;
  }>;
  overview?: {
    definition: string;
    presentation: string;
    causes: string;
    lookOutFor: string;
  };
}

export interface OTCategoryWithContent {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  content?: OTSubCategory[];
  shortName?: string;
}

export const OT_DATA: OTCategoryWithContent[] = [
  // ── Assessment & Evaluation ──────────────────────────────────────────────
  {
    id: "hand-therapy-hub",
    title: "Hand & Upper Extremity",
    description: "Splinting, ROM, grip strength, dexterity",
    icon: Hand,
    color: "bg-emerald-100 text-emerald-700",
    shortName: "Hand Therapy",
    content: [
      {
        title: "Wrist & Hand Assessment",
        items: [
          {
            title: "Grip Strength Norms (Jamar)",
            type: "internal",
            confidenceScore: 5,
          },
          {
            title: "Pinch Strength Testing",
            type: "internal",
            confidenceScore: 5,
          },
          {
            title: "ROM Measurement Protocols",
            type: "internal",
            confidenceScore: 5,
          },
        ],
      },
      {
        title: "Splinting Protocols",
        items: [
          {
            title: "Resting Hand Splint",
            type: "internal",
            confidenceScore: 5,
          },
          { title: "Thumb Spica Splint", type: "internal", confidenceScore: 5 },
          {
            title: "Ulnar/Radial Gutter Splints",
            type: "internal",
            confidenceScore: 5,
          },
        ],
      },
      {
        title: "Common Conditions",
        items: [
          {
            title: "Carpal Tunnel Syndrome",
            type: "internal",
            confidenceScore: 5,
          },
          {
            title: "De Quervain's Tenosynovitis",
            type: "internal",
            confidenceScore: 5,
          },
          { title: "Trigger Finger", type: "internal", confidenceScore: 5 },
        ],
      },
    ],
  },
  {
    id: "adl-training-hub",
    title: "ADL Training",
    description: "Self-care, dressing, hygiene, adaptive equipment",
    icon: Home,
    color: "bg-blue-100 text-blue-700",
    shortName: "ADL Training",
    content: [
      {
        title: "Self-Care Activities",
        items: [
          {
            title: "Dressing Techniques",
            type: "internal",
            confidenceScore: 5,
          },
          { title: "Bathing & Hygiene", type: "internal", confidenceScore: 5 },
          {
            title: "Grooming Adaptations",
            type: "internal",
            confidenceScore: 5,
          },
        ],
      },
      {
        title: "Adaptive Equipment",
        items: [
          { title: "Dressing Aids", type: "internal", confidenceScore: 5 },
          {
            title: "Bathroom Safety Equipment",
            type: "internal",
            confidenceScore: 5,
          },
          {
            title: "Kitchen Modifications",
            type: "internal",
            confidenceScore: 5,
          },
        ],
      },
    ],
  },
  {
    id: "cognitive-rehab-hub",
    title: "Cognitive Rehabilitation",
    description: "Memory, executive function, vision, perception",
    icon: Brain,
    color: "bg-violet-100 text-violet-700",
    shortName: "Cognitive Rehab",
    content: [
      {
        title: "Cognitive Assessment",
        items: [
          { title: "MoCA Screening", type: "internal", confidenceScore: 5 },
          {
            title: "Executive Function Tests",
            type: "internal",
            confidenceScore: 5,
          },
          {
            title: "Visual Perception Assessment",
            type: "internal",
            confidenceScore: 5,
          },
        ],
      },
      {
        title: "Intervention Strategies",
        items: [
          {
            title: "Memory Compensation Techniques",
            type: "internal",
            confidenceScore: 5,
          },
          { title: "Attention Training", type: "internal", confidenceScore: 4 },
          {
            title: "Problem-Solving Strategies",
            type: "internal",
            confidenceScore: 5,
          },
        ],
      },
    ],
  },
  {
    id: "work-conditioning-hub",
    title: "Work & Ergonomics",
    description: "Functional capacity, ergonomic assessment, work tasks",
    icon: Briefcase,
    color: "bg-slate-100 text-slate-700",
    shortName: "Work Rehab",
    content: [
      {
        title: "Functional Capacity Evaluation",
        items: [
          { title: "Lifting Assessment", type: "internal", confidenceScore: 5 },
          {
            title: "Carrying & Pushing/Pulling",
            type: "internal",
            confidenceScore: 5,
          },
          { title: "Sustained Postures", type: "internal", confidenceScore: 5 },
        ],
      },
      {
        title: "Ergonomic Interventions",
        items: [
          { title: "Workstation Setup", type: "internal", confidenceScore: 5 },
          {
            title: "Body Mechanics Training",
            type: "internal",
            confidenceScore: 5,
          },
          {
            title: "Job Modification Strategies",
            type: "internal",
            confidenceScore: 4,
          },
        ],
      },
    ],
  },
  {
    id: "mental-health-hub",
    title: "Mental Health",
    description: "Coping strategies, sensory regulation, community integration",
    icon: Heart,
    color: "bg-rose-100 text-rose-700",
    shortName: "Mental Health",
    content: [
      {
        title: "Sensory Regulation",
        items: [
          {
            title: "Sensory Modulation Techniques",
            type: "internal",
            confidenceScore: 4,
          },
          {
            title: "Sensory Diet Development",
            type: "internal",
            confidenceScore: 4,
          },
          {
            title: "Environmental Modifications",
            type: "internal",
            confidenceScore: 5,
          },
        ],
      },
      {
        title: "Coping & Participation",
        items: [
          { title: "Stress Management", type: "internal", confidenceScore: 5 },
          {
            title: "Social Skills Training",
            type: "internal",
            confidenceScore: 4,
          },
          {
            title: "Community Integration",
            type: "internal",
            confidenceScore: 5,
          },
        ],
      },
    ],
  },
  {
    id: "pediatric-dev-hub",
    title: "Pediatric Development",
    description: "Milestones, fine motor, sensory integration, play",
    icon: Baby,
    color: "bg-pink-100 text-pink-700",
    shortName: "Pediatric OT",
    content: [
      {
        title: "Developmental Milestones",
        items: [
          {
            title: "Fine Motor Development",
            type: "internal",
            confidenceScore: 5,
          },
          {
            title: "Visual Motor Integration",
            type: "internal",
            confidenceScore: 5,
          },
          { title: "Self-Care Skills", type: "internal", confidenceScore: 5 },
        ],
      },
      {
        title: "Sensory Integration",
        items: [
          {
            title: "Sensory Processing Assessment",
            type: "internal",
            confidenceScore: 5,
          },
          {
            title: "SI Intervention Strategies",
            type: "internal",
            confidenceScore: 4,
          },
          { title: "Play-Based Therapy", type: "internal", confidenceScore: 5 },
        ],
      },
    ],
  },

  // ── OT Tools ─────────────────────────────────────────────────────────────
  {
    id: "clinical-calculators",
    title: "Clinical Calculators",
    description: "FIM/GG scores, grip norms, MoCA, vision screens",
    icon: Calculator,
    color: "bg-cyan-100 text-cyan-700",
  },
  {
    id: "goal-generator",
    title: "SMART Goal Generator",
    description: "AI-assisted functional goal writing with evidence",
    icon: Target,
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    id: "anatomy-lab",
    title: "Anatomy Lab",
    description: "Upper extremity anatomy, neuroanatomy, biomechanics",
    icon: Microscope,
    color: "bg-teal-100 text-teal-700",
  },
  {
    id: "case-brainstorm",
    title: "Case Brainstormer",
    description: "AI-powered differential diagnosis and treatment planning",
    icon: Sparkles,
    color: "bg-purple-100 text-purple-700",
  },

  // ── Documentation & Compliance ────────────────────────────────────────────
  {
    id: "documentation-studio",
    title: "Documentation Studio",
    description: "Occupational profile, ADL notes, Medicare compliance",
    icon: FileText,
    color: "bg-slate-100 text-slate-700",
  },
  {
    id: "compliance-center",
    title: "Compliance Center",
    description: "Skilled need, functional maintenance, documentation flags",
    icon: Shield,
    color: "bg-amber-100 text-amber-700",
  },
  {
    id: "handout-maker",
    title: "Handout Maker",
    description: "Adaptive equipment guides, home safety printouts",
    icon: Clipboard,
    color: "bg-rose-100 text-rose-700",
  },

  // ── Resources ─────────────────────────────────────────────────────────────
  {
    id: "pdf-library",
    title: "PDF Library",
    description: "AOTA guidelines, outcome measures, adaptive protocols",
    icon: Library,
    color: "bg-slate-100 text-slate-700",
  },
  {
    id: "ot-corner",
    title: "OT Corner",
    description: "CEUs, professional news, AOTA updates",
    icon: GraduationCap,
    color: "bg-emerald-100 text-emerald-700",
  },
];

export const OT_CORNER_CONTENT = {
  ceus: [
    {
      title: "Advanced Splinting Techniques",
      provider: "AOTA",
      credits: 2.0,
      format: "Hands-on",
      url: "https://www.aota.org",
    },
    {
      title: "Sensory Integration in Adults",
      provider: "MedBridge",
      credits: 1.5,
      format: "Video",
      url: "https://www.medbridge.com",
    },
  ],
  events: [
    {
      title: "AOTA INSPIRE 2026",
      date: "April 2026",
      location: "New Orleans, LA",
      type: "Conference",
      url: "https://inspire.aota.org",
    },
  ],
  blogs: [
    {
      title: "The Role of OT in Oncology Rehab",
      source: "OT Practice",
      date: "Feb 2026",
      url: "https://www.aota.org",
    },
  ],
  podcasts: [
    {
      title: "OT Potential Podcast",
      host: "Sarah Lyon",
      description: "Evidence-based practice insights",
      url: "https://otpotential.com",
    },
  ],
};
