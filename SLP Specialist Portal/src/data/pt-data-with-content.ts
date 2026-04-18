/**
 * PT Portal navigation data with nested content/subspecialties
 * Mirrors SLP_DATA structure for consistent UI rendering
 */
import {
  Activity,
  AlertTriangle,
  BarChart2,
  BookOpen,
  Brain,
  Dumbbell,
  FileText,
  Footprints,
  Heart,
  Library,
  Microscope,
  Shield,
  Sparkles,
  Stethoscope,
  Target,
  Users,
  Wind,
  Zap,
  Baby,
  Waves,
  Clipboard,
  Calculator,
  Route,
  GraduationCap,
} from "lucide-react";

export interface PTSubCategory {
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

export interface PTCategoryWithContent {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  content?: PTSubCategory[];
  shortName?: string;
}

export const PT_DATA_WITH_CONTENT: PTCategoryWithContent[] = [
  // ── Assessment & Evaluation ──────────────────────────────────────────────
  {
    id: "orthopedic-hub",
    title: "Orthopedic Rehab",
    description: "ROM, MMT, special tests, joint-specific protocols",
    icon: Activity,
    color: "bg-blue-100 text-blue-700",
    shortName: "Orthopedic",
    content: [
      {
        title: "Shoulder Assessment",
        items: [
          {
            title: "Rotator Cuff Strength Testing",
            type: "internal",
            confidenceScore: 5,
          },
          {
            title: "Subacromial Impingement Tests",
            type: "internal",
            confidenceScore: 5,
          },
          { title: "Shoulder ROM Norms", type: "internal", confidenceScore: 5 },
        ],
      },
      {
        title: "Knee Assessment",
        items: [
          {
            title: "ACL/MCL Ligament Tests",
            type: "internal",
            confidenceScore: 5,
          },
          {
            title: "Meniscal Tests (McMurray, Lachman)",
            type: "internal",
            confidenceScore: 5,
          },
          { title: "Post-TKA Protocols", type: "internal", confidenceScore: 5 },
        ],
      },
      {
        title: "Hip Assessment",
        items: [
          { title: "FABER/FADIR Tests", type: "internal", confidenceScore: 5 },
          {
            title: "Post-THA Precautions",
            type: "internal",
            confidenceScore: 5,
          },
          { title: "Hip ROM Norms", type: "internal", confidenceScore: 5 },
        ],
      },
      {
        title: "Spine Assessment",
        items: [
          {
            title: "Lumbar Spine Special Tests",
            type: "internal",
            confidenceScore: 5,
          },
          {
            title: "Cervical Radiculopathy Screening",
            type: "internal",
            confidenceScore: 5,
          },
          {
            title: "Post-Spine Surgery Protocols",
            type: "internal",
            confidenceScore: 5,
          },
        ],
      },
    ],
  },
  {
    id: "neurological-hub",
    title: "Neurological Rehab",
    description: "Stroke, TBI, Parkinson's — Fugl-Meyer, Berg Balance",
    icon: Brain,
    color: "bg-violet-100 text-violet-700",
    shortName: "Neurological",
    content: [
      {
        title: "Stroke Rehabilitation",
        items: [
          {
            title: "Fugl-Meyer Assessment",
            type: "internal",
            confidenceScore: 5,
          },
          { title: "NIH Stroke Scale", type: "internal", confidenceScore: 5 },
          {
            title: "Post-Stroke Recovery Protocols",
            type: "internal",
            confidenceScore: 5,
          },
        ],
      },
      {
        title: "Parkinson's Disease",
        items: [
          {
            title: "Unified Parkinson's Disease Rating Scale",
            type: "internal",
            confidenceScore: 5,
          },
          {
            title: "Freezing of Gait Interventions",
            type: "internal",
            confidenceScore: 4,
          },
          {
            title: "Postural Stability Training",
            type: "internal",
            confidenceScore: 5,
          },
        ],
      },
      {
        title: "TBI Management",
        items: [
          {
            title: "Cognitive-Motor Integration",
            type: "internal",
            confidenceScore: 4,
          },
          {
            title: "Balance & Vestibular Training",
            type: "internal",
            confidenceScore: 5,
          },
          {
            title: "Return-to-Work Protocols",
            type: "internal",
            confidenceScore: 4,
          },
        ],
      },
    ],
  },
  {
    id: "geriatric-hub",
    title: "Geriatric Rehab",
    description: "Fall prevention, STEADI, TUG, functional mobility",
    icon: Users,
    color: "bg-amber-100 text-amber-700",
    shortName: "Geriatric",
    content: [
      {
        title: "Fall Prevention",
        items: [
          {
            title: "STEADI Screening Tool",
            type: "internal",
            confidenceScore: 5,
          },
          {
            title: "Otago Exercise Program",
            type: "internal",
            confidenceScore: 5,
          },
          {
            title: "Home Safety Assessment",
            type: "internal",
            confidenceScore: 5,
          },
        ],
      },
      {
        title: "Functional Mobility",
        items: [
          {
            title: "Timed Up and Go (TUG)",
            type: "internal",
            confidenceScore: 5,
          },
          { title: "Berg Balance Scale", type: "internal", confidenceScore: 5 },
          {
            title: "Gait Training Progressions",
            type: "internal",
            confidenceScore: 5,
          },
        ],
      },
      {
        title: "Frailty Management",
        items: [
          {
            title: "Sarcopenia Screening",
            type: "internal",
            confidenceScore: 4,
          },
          {
            title: "Resistance Training Protocols",
            type: "internal",
            confidenceScore: 5,
          },
          {
            title: "Deconditioning Reversal",
            type: "internal",
            confidenceScore: 5,
          },
        ],
      },
    ],
  },
  {
    id: "cardiopulmonary-vestibular",
    title: "Cardiopulmonary & Vestibular",
    description: "Cardiac rehab phases, 6MWT, BPPV maneuvers, DHI",
    icon: Heart,
    color: "bg-rose-100 text-rose-700",
    shortName: "Cardiopulmonary",
    content: [
      {
        title: "Cardiac Rehabilitation",
        items: [
          {
            title: "Cardiac Rehab Phases (I-IV)",
            type: "internal",
            confidenceScore: 5,
          },
          {
            title: "6-Minute Walk Test (6MWT)",
            type: "internal",
            confidenceScore: 5,
          },
          {
            title: "Exercise Prescription Post-MI",
            type: "internal",
            confidenceScore: 5,
          },
        ],
      },
      {
        title: "Pulmonary Rehabilitation",
        items: [
          { title: "COPD Management", type: "internal", confidenceScore: 5 },
          {
            title: "Breathing Exercises",
            type: "internal",
            confidenceScore: 5,
          },
          {
            title: "Oxygen Saturation Monitoring",
            type: "internal",
            confidenceScore: 5,
          },
        ],
      },
      {
        title: "Vestibular Disorders",
        items: [
          {
            title: "BPPV Maneuvers (Epley, Semont)",
            type: "internal",
            confidenceScore: 5,
          },
          {
            title: "Dizziness Handicap Index (DHI)",
            type: "internal",
            confidenceScore: 5,
          },
          {
            title: "Vestibular Rehabilitation Exercises",
            type: "internal",
            confidenceScore: 5,
          },
        ],
      },
    ],
  },
  {
    id: "sports-pelvic-health",
    title: "Sports & Pelvic Health",
    description: "FMS, return-to-sport, pelvic floor, PFMT",
    icon: Dumbbell,
    color: "bg-emerald-100 text-emerald-700",
    shortName: "Sports",
    content: [
      {
        title: "Sports Rehabilitation",
        items: [
          {
            title: "Functional Movement Screen (FMS)",
            type: "internal",
            confidenceScore: 5,
          },
          {
            title: "Return-to-Sport Protocols",
            type: "internal",
            confidenceScore: 5,
          },
          {
            title: "ACL Injury Management",
            type: "internal",
            confidenceScore: 5,
          },
        ],
      },
      {
        title: "Pelvic Floor Dysfunction",
        items: [
          {
            title: "Pelvic Floor Muscle Training (PFMT)",
            type: "internal",
            confidenceScore: 5,
          },
          {
            title: "Urinary Incontinence Management",
            type: "internal",
            confidenceScore: 5,
          },
          {
            title: "Pelvic Pain Syndromes",
            type: "internal",
            confidenceScore: 4,
          },
        ],
      },
    ],
  },
  {
    id: "wound-care-hub",
    title: "Wound Care",
    description: "Pressure injury staging, Braden Scale, UltraMIST",
    icon: Shield,
    color: "bg-orange-100 text-orange-700",
    shortName: "Wound Care",
    content: [
      {
        title: "Pressure Injury Management",
        items: [
          {
            title: "Pressure Injury Staging (NPUAP)",
            type: "internal",
            confidenceScore: 5,
          },
          {
            title: "Braden Scale Assessment",
            type: "internal",
            confidenceScore: 5,
          },
          {
            title: "Wound Dressing Selection",
            type: "internal",
            confidenceScore: 5,
          },
        ],
      },
      {
        title: "Advanced Wound Care",
        items: [
          {
            title: "UltraMIST Protocol (CPT 97610)",
            type: "internal",
            confidenceScore: 5,
          },
          {
            title: "Negative Pressure Wound Therapy",
            type: "internal",
            confidenceScore: 4,
          },
          { title: "Biofilm Management", type: "internal", confidenceScore: 4 },
        ],
      },
    ],
  },
  {
    id: "pediatric-pt",
    title: "Pediatric PT",
    description: "Developmental milestones, PDMS-2, GMFM, CP protocols",
    icon: Baby,
    color: "bg-pink-100 text-pink-700",
    shortName: "Pediatric",
    content: [
      {
        title: "Developmental Assessment",
        items: [
          {
            title: "Peabody Developmental Motor Scales (PDMS-2)",
            type: "internal",
            confidenceScore: 5,
          },
          {
            title: "Gross Motor Function Measure (GMFM)",
            type: "internal",
            confidenceScore: 5,
          },
          {
            title: "Developmental Milestones",
            type: "internal",
            confidenceScore: 5,
          },
        ],
      },
      {
        title: "Cerebral Palsy Management",
        items: [
          {
            title: "CP Classification (GMFCS)",
            type: "internal",
            confidenceScore: 5,
          },
          {
            title: "Spasticity Management",
            type: "internal",
            confidenceScore: 5,
          },
          {
            title: "Contracture Prevention",
            type: "internal",
            confidenceScore: 5,
          },
        ],
      },
    ],
  },

  // ── PT Tools ─────────────────────────────────────────────────────────────
  {
    id: "clinical-calculators",
    title: "Clinical Calculators",
    description: "TUG, Berg, gait speed, Karvonen, 6MWT norms",
    icon: Calculator,
    color: "bg-cyan-100 text-cyan-700",
    shortName: "Calculators",
  },
  {
    id: "goal-generator",
    title: "SMART Goal Generator",
    description: "AI-assisted functional goal writing with evidence",
    icon: Target,
    color: "bg-indigo-100 text-indigo-700",
    shortName: "Goals",
  },
  {
    id: "exercise-library",
    title: "Exercise Library",
    description: "HEP builder, exercise prescription, progressions",
    icon: Dumbbell,
    color: "bg-lime-100 text-lime-700",
    shortName: "Exercises",
  },
  {
    id: "anatomy-lab",
    title: "Anatomy Lab",
    description: "3D joint models, muscle origins/insertions, biomechanics",
    icon: Microscope,
    color: "bg-teal-100 text-teal-700",
    shortName: "Anatomy",
  },
  {
    id: "case-brainstorm",
    title: "Case Brainstormer",
    description: "AI-powered differential diagnosis and treatment planning",
    icon: Sparkles,
    color: "bg-purple-100 text-purple-700",
    shortName: "Cases",
  },
  {
    id: "quality-measures",
    title: "Quality Measures Hub",
    description: "MIPS tracker, SNF QRP, falls/pressure injury programs",
    icon: BarChart2,
    color: "bg-blue-100 text-blue-700",
    shortName: "Quality",
  },

  // ── Documentation & Compliance ────────────────────────────────────────────
  {
    id: "documentation-studio",
    title: "Documentation Studio",
    description: "SOAP notes, Medicare compliance, CPT coding",
    icon: FileText,
    color: "bg-slate-100 text-slate-700",
    shortName: "Documentation",
  },
  {
    id: "compliance-center",
    title: "Compliance Center",
    description: "Medicare documentation, skilled need language, flags",
    icon: Shield,
    color: "bg-amber-100 text-amber-700",
    shortName: "Compliance",
  },
  {
    id: "clinical-pathways",
    title: "Clinical Pathways",
    description: "Post-TKA, THA, low back pain, stroke rehab protocols",
    icon: Route,
    color: "bg-green-100 text-green-700",
    shortName: "Pathways",
  },
  {
    id: "handout-maker",
    title: "Handout Maker",
    description: "Patient education materials, HEP printouts",
    icon: Clipboard,
    color: "bg-rose-100 text-rose-700",
    shortName: "Handouts",
  },
  {
    id: "medicare-helper",
    title: "Medicare Helper",
    description: "Part B billing, LCD policies, documentation requirements",
    icon: Stethoscope,
    color: "bg-blue-100 text-blue-700",
    shortName: "Medicare",
  },

  // ── SNF Clinical Modules ──────────────────────────────────────────────────
  {
    id: "pt-balance-fall-prevention",
    title: "Balance & Fall Prevention",
    description: "Otago, STEADI, Tai Chi, multifactorial interventions",
    icon: AlertTriangle,
    color: "bg-red-100 text-red-700",
    shortName: "Balance",
  },
  {
    id: "pt-post-op-rehab",
    title: "Post-Op Rehab",
    description: "TKA, THA, spine surgery protocols and progressions",
    icon: Activity,
    color: "bg-blue-100 text-blue-700",
    shortName: "Post-Op",
  },
  {
    id: "pt-deconditioning-bed-mobility",
    title: "Mobility & Gait",
    description: "Bed mobility, transfers, gait training progressions",
    icon: Footprints,
    color: "bg-emerald-100 text-emerald-700",
    shortName: "Mobility",
  },
  {
    id: "pt-transfer-training",
    title: "Transfer Training",
    description: "Sit-to-stand, bed-to-chair, toilet transfers",
    icon: Users,
    color: "bg-violet-100 text-violet-700",
    shortName: "Transfers",
  },
  {
    id: "pt-pain-management",
    title: "Pain Management",
    description: "Modalities, manual therapy, pain neuroscience education",
    icon: Zap,
    color: "bg-orange-100 text-orange-700",
    shortName: "Pain",
  },
  {
    id: "pt-respiratory-pt",
    title: "Respiratory PT",
    description: "Breathing exercises, secretion clearance, COPD",
    icon: Wind,
    color: "bg-sky-100 text-sky-700",
    shortName: "Respiratory",
  },
  {
    id: "pt-positioning-pressure-relief",
    title: "Positioning & Pressure Relief",
    description: "Repositioning schedules, seating assessment, Braden",
    icon: Shield,
    color: "bg-amber-100 text-amber-700",
    shortName: "Positioning",
  },
  {
    id: "ultramist-protocol",
    title: "UltraMIST Protocol",
    description: "CPT 97610, low-frequency ultrasound wound care",
    icon: Waves,
    color: "bg-blue-100 text-blue-700",
    shortName: "UltraMIST",
  },

  // ── Resources ─────────────────────────────────────────────────────────────
  {
    id: "pt-resource-center",
    title: "PT Resource Center",
    description: "APTA guidelines, research, professional development",
    icon: BookOpen,
    color: "bg-teal-100 text-teal-700",
    shortName: "Resources",
  },
  {
    id: "pdf-library",
    title: "PDF Library",
    description: "Clinical references, outcome measure forms, protocols",
    icon: Library,
    color: "bg-slate-100 text-slate-700",
    shortName: "PDFs",
  },
  {
    id: "pt-corner",
    title: "PT Corner",
    description: "CEUs, events, blogs, podcasts, APTA news",
    icon: GraduationCap,
    color: "bg-indigo-100 text-indigo-700",
    shortName: "PT Corner",
  },
];
