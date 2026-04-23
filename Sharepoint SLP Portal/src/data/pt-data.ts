/**
 * PT Portal navigation data — replaces SLP_DATA
 * All categories map to ViewManager routes
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

export interface PTCategory {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  content?: {
    id: string;
    title: string;
    researchArchives?: { title: string; summary: string; url: string }[];
  }[];
  relatedTools?: { id: string; title: string; icon?: string }[];
  image?: string;
}

export const PT_DATA: PTCategory[] = [
  // ── Assessment & Evaluation ──────────────────────────────────────────────
  {
    id: "orthopedic-hub",
    title: "Orthopedic Rehab",
    description: "ROM, MMT, special tests, joint-specific protocols",
    icon: Activity,
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: "neurological-hub",
    title: "Neurological Rehab",
    description: "Stroke, TBI, Parkinson's — Fugl-Meyer, Berg Balance",
    icon: Brain,
    color: "bg-violet-100 text-violet-700",
  },
  {
    id: "geriatric-hub",
    title: "Geriatric Rehab",
    description: "Fall prevention, STEADI, TUG, functional mobility",
    icon: Users,
    color: "bg-amber-100 text-amber-700",
  },
  {
    id: "cardiopulmonary-vestibular",
    title: "Cardiopulmonary & Vestibular",
    description: "Cardiac rehab phases, 6MWT, BPPV maneuvers, DHI",
    icon: Heart,
    color: "bg-rose-100 text-rose-700",
  },
  {
    id: "sports-pelvic-health",
    title: "Sports & Pelvic Health",
    description: "FMS, return-to-sport, pelvic floor, PFMT",
    icon: Dumbbell,
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "wound-care-hub",
    title: "Wound Care",
    description: "Pressure injury staging, Braden Scale, UltraMIST",
    icon: Shield,
    color: "bg-orange-100 text-orange-700",
  },
  {
    id: "pediatric-pt",
    title: "Pediatric PT",
    description: "Developmental milestones, PDMS-2, GMFM, CP protocols",
    icon: Baby,
    color: "bg-pink-100 text-pink-700",
  },

  // ── PT Tools ─────────────────────────────────────────────────────────────
  {
    id: "clinical-calculators",
    title: "Clinical Calculators",
    description: "TUG, Berg, gait speed, Karvonen, 6MWT norms",
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
    id: "exercise-library",
    title: "Exercise Library",
    description: "HEP builder, exercise prescription, progressions",
    icon: Dumbbell,
    color: "bg-lime-100 text-lime-700",
  },
  {
    id: "anatomy-lab",
    title: "Anatomy Lab",
    description: "3D joint models, muscle origins/insertions, biomechanics",
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
  {
    id: "quality-measures",
    title: "Quality Measures Hub",
    description: "MIPS tracker, SNF QRP, falls/pressure injury programs",
    icon: BarChart2,
    color: "bg-blue-100 text-blue-700",
  },

  // ── Documentation & Compliance ────────────────────────────────────────────
  {
    id: "documentation-studio",
    title: "Documentation Studio",
    description: "SOAP notes, Medicare compliance, CPT coding",
    icon: FileText,
    color: "bg-slate-100 text-slate-700",
  },
  {
    id: "compliance-center",
    title: "Compliance Center",
    description: "Medicare documentation, skilled need language, flags",
    icon: Shield,
    color: "bg-amber-100 text-amber-700",
  },
  {
    id: "clinical-pathways",
    title: "Clinical Pathways",
    description: "Post-TKA, THA, low back pain, stroke rehab protocols",
    icon: Route,
    color: "bg-green-100 text-green-700",
  },
  {
    id: "handout-maker",
    title: "Handout Maker",
    description: "Patient education materials, HEP printouts",
    icon: Clipboard,
    color: "bg-rose-100 text-rose-700",
  },
  {
    id: "medicare-helper",
    title: "Medicare Helper",
    description: "Part B billing, LCD policies, documentation requirements",
    icon: Stethoscope,
    color: "bg-blue-100 text-blue-700",
  },

  // ── SNF Clinical Modules ──────────────────────────────────────────────────
  {
    id: "pt-balance-fall-prevention",
    title: "Balance & Fall Prevention",
    description: "Otago, STEADI, Tai Chi, multifactorial interventions",
    icon: AlertTriangle,
    color: "bg-red-100 text-red-700",
  },
  {
    id: "pt-post-op-rehab",
    title: "Post-Op Rehab",
    description: "TKA, THA, spine surgery protocols and progressions",
    icon: Activity,
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: "pt-mobility-gait",
    title: "Mobility & Gait",
    description: "Bed mobility, transfers, gait training progressions",
    icon: Footprints,
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "pt-transfer-training",
    title: "Transfer Training",
    description: "Sit-to-stand, bed-to-chair, toilet transfers",
    icon: Users,
    color: "bg-violet-100 text-violet-700",
  },
  {
    id: "pt-pain-management",
    title: "Pain Management",
    description: "Modalities, manual therapy, pain neuroscience education",
    icon: Zap,
    color: "bg-orange-100 text-orange-700",
  },
  {
    id: "pt-respiratory-pt",
    title: "Respiratory PT",
    description: "Breathing exercises, secretion clearance, COPD",
    icon: Wind,
    color: "bg-sky-100 text-sky-700",
  },
  {
    id: "pt-positioning-pressure-relief",
    title: "Positioning & Pressure Relief",
    description: "Repositioning schedules, seating assessment, Braden",
    icon: Shield,
    color: "bg-amber-100 text-amber-700",
  },
  {
    id: "ultramist-protocol",
    title: "UltraMIST Protocol",
    description: "CPT 97610, low-frequency ultrasound wound care",
    icon: Waves,
    color: "bg-blue-100 text-blue-700",
  },

  // ── Resources ─────────────────────────────────────────────────────────────
  {
    id: "pt-resource-center",
    title: "PT Resource Center",
    description: "APTA guidelines, research, professional development",
    icon: BookOpen,
    color: "bg-teal-100 text-teal-700",
  },
  {
    id: "pdf-library",
    title: "PDF Library",
    description: "Clinical references, outcome measure forms, protocols",
    icon: Library,
    color: "bg-slate-100 text-slate-700",
  },
  {
    id: "pt-corner",
    title: "PT Corner",
    description: "CEUs, events, blogs, podcasts, APTA news",
    icon: GraduationCap,
    color: "bg-indigo-100 text-indigo-700",
  },
];

// ── PT Corner content (CEUs, events, blogs, podcasts) ─────────────────────────
export const PT_CORNER_CONTENT = {
  ceus: [
    {
      title: "Manual Therapy Techniques for the Lumbar Spine",
      provider: "APTA Learning Center",
      credits: 2.0,
      format: "Online",
      url: "https://learningcenter.apta.org",
    },
    {
      title: "Evidence-Based Fall Prevention in Older Adults",
      provider: "MedBridge",
      credits: 1.5,
      format: "Video",
      url: "https://www.medbridge.com",
    },
    {
      title: "Pelvic Floor Rehabilitation: Assessment & Treatment",
      provider: "Herman & Wallace",
      credits: 3.0,
      format: "Live Course",
      url: "https://hermanwallace.com",
    },
    {
      title: "Dry Needling for Musculoskeletal Pain",
      provider: "Evidence in Motion",
      credits: 2.5,
      format: "Hybrid",
      url: "https://www.evidenceinmotion.com",
    },
    {
      title: "MIPS Quality Measures for PT 2026",
      provider: "APTA",
      credits: 1.0,
      format: "Webinar",
      url: "https://www.apta.org/your-practice/payment/medicare-payment/mips",
    },
    {
      title: "Vestibular Rehabilitation: BPPV and Beyond",
      provider: "Emory University",
      credits: 2.0,
      format: "Online",
      url: "https://www.apta.org",
    },
  ],
  events: [
    {
      title: "APTA Combined Sections Meeting 2026",
      date: "Feb 4–7, 2026",
      location: "Houston, TX",
      type: "Conference",
      url: "https://www.apta.org/csm",
    },
    {
      title: "APTA National Student Conclave",
      date: "Oct 2026",
      location: "TBD",
      type: "Conference",
      url: "https://www.apta.org",
    },
    {
      title: "APTA Orthopedic Section Annual Meeting",
      date: "Jun 2026",
      location: "TBD",
      type: "Specialty",
      url: "https://www.orthopt.org",
    },
    {
      title: "World Confederation for Physical Therapy Congress",
      date: "Jun 2026",
      location: "Dubai, UAE",
      type: "International",
      url: "https://www.wcpt.org",
    },
    {
      title: "APTA Neurology Section Annual Conference",
      date: "Sep 2026",
      location: "TBD",
      type: "Specialty",
      url: "https://www.neuropt.org",
    },
  ],
  blogs: [
    {
      title: "The Science Behind Blood Flow Restriction Training",
      source: "JOSPT Insights",
      date: "Mar 2026",
      url: "https://www.jospt.org",
    },
    {
      title: "Graded Motor Imagery for Chronic Pain: A Practical Guide",
      source: "APTA Magazine",
      date: "Feb 2026",
      url: "https://www.apta.org/apta-magazine",
    },
    {
      title: "Section GG Documentation: Maximizing PDPM Accuracy",
      source: "APTA Geriatrics",
      date: "Mar 2026",
      url: "https://geriatricspt.org",
    },
    {
      title: "Telehealth PT: Best Practices for Remote Assessment",
      source: "PTJ",
      date: "Jan 2026",
      url: "https://academic.oup.com/ptj",
    },
    {
      title: "Dry Needling vs. Acupuncture: What the Evidence Says",
      source: "JOSPT",
      date: "Feb 2026",
      url: "https://www.jospt.org",
    },
  ],
  podcasts: [
    {
      title: "The PT Pintcast",
      host: "Jimmy McKay",
      description: "Stories and insights from PT leaders worldwide",
      url: "https://ptpintcast.com",
    },
    {
      title: "PT Inquest",
      host: "Eric Purves & JF Esculier",
      description: "Critical appraisal of PT research",
      url: "https://ptinquest.com",
    },
    {
      title: "The Sports PT Podcast",
      host: "Mike Reinold",
      description: "Sports rehab, return-to-sport, performance",
      url: "https://mikereinold.com/podcast",
    },
    {
      title: "Healthy Wealthy & Smart",
      host: "Karen Litzy",
      description: "Business, clinical, and life skills for PTs",
      url: "https://healthywealthysmart.com",
    },
    {
      title: "APTA Podcast",
      host: "APTA",
      description: "Official APTA podcast — policy, practice, profession",
      url: "https://www.apta.org/news/podcasts",
    },
  ],
};

// ── PT Quiz questions ─────────────────────────────────────────────────────────
export const PT_QUIZ_QUESTIONS = [
  {
    q: "What TUG score indicates HIGH fall risk per CDC STEADI?",
    a: ">12 seconds",
    detail:
      "TUG >12s = high fall risk; >20s = very high. Refer for PT balance intervention.",
  },
  {
    q: "What Berg Balance Scale score indicates HIGH fall risk?",
    a: "<45/56",
    detail:
      "BBS <45 = high fall risk; <36 = very high. Multifactorial intervention recommended.",
  },
  {
    q: "What CPT code is used for therapeutic exercise?",
    a: "97110",
    detail:
      "97110 = Therapeutic exercise. Billed per 15-minute unit. Requires skilled PT supervision.",
  },
  {
    q: "What is the Modified Oxford Scale used to assess?",
    a: "Pelvic floor muscle strength",
    detail:
      "0 = no contraction; 5 = strong contraction. Used pre/post pelvic floor PT.",
  },
  {
    q: "What does PDPM Section GG document?",
    a: "Functional status at admission and discharge",
    detail:
      "Section GG drives PDPM payment classification. Accurate baseline documentation is critical.",
  },
  {
    q: "What is the Otago Exercise Programme's evidence level for fall reduction?",
    a: "Level I — 35% fall reduction (Cochrane)",
    detail:
      "Campbell et al. NEJM 1997; Cochrane 2019. Individualized home-based strength + balance.",
  },
  {
    q: "What frequency does UltraMIST (CPT 97610) use?",
    a: "40 kHz (non-contact, non-thermal)",
    detail:
      "Acoustic cavitation disrupts biofilm, stimulates fibroblast proliferation. CMS-reimbursed since 2014.",
  },
  {
    q: "What is the GMFCS used to classify?",
    a: "Gross motor function in children with cerebral palsy",
    detail:
      "Levels I–V. Level I = walks without limitations; Level V = transported in wheelchair.",
  },
];
