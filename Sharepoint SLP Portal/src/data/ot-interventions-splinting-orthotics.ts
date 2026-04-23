/**
 * OT Interventions: Splinting & Orthotics
 *
 * Evidence-based splinting, casting, and orthotic interventions for OT practice.
 * Source: AOTA Guidelines, ASHT (Hand Therapy) standards
 */

import { auditService } from "../core/audit/AuditService";

export interface OTIntervention {
  id: string;
  name: string;
  category: string;
  description: string;
  indications: string[];
  contraindications: string[];
  precautions: string[];
  parameters: string[];
  evidenceLevel: number;
  source: string;
  citation: string;
}

const splintingOrthoticsInterventions: OTIntervention[] = [
  {
    id: "ot-iso-001",
    name: "Resting Hand Splint (Static, Volar/Dorsal)",
    category: "static-splints",
    description:
      "Immobilization orthosis that positions the wrist and digits in a functional or anti-deformity position.",
    indications: [
      "Rheumatoid Arthritis (acute flare)",
      "Crush injury",
      "Flaccid hand (post-stroke)",
      "Burns (anti-deformity position)",
    ],
    contraindications: [
      "Need for early active motion (e.g., extensor tendon repair, unapproved timing)",
    ],
    precautions: [
      "Edema fluctuations",
      "Skin integrity over bony prominences (ulnar styloid)",
      "Loss of ROM if worn continuously over 72hrs",
    ],
    parameters: [
      "Functional Position: Wrist 20-30° Ext, MCP 30-45° Flex, IP slight flex, Thumb abducted",
      "Anti-deformity (Intrinsic Plus): Wrist 15-30° Ext, MCP 70-90° Flex, IPs fully extended, Thumb palmar abducted",
      "Wearing schedule: Nighttime primarily; removing 2-3x/day for gentle ROM",
    ],
    evidenceLevel: 1,
    source: "ASHT",
    citation:
      "Coppard BM, Lohman H. Introduction to Splinting: A Clinical Reasoning and Problem-Solving Approach.",
  },
  {
    id: "ot-iso-002",
    name: "Wrist Cock-Up Splint / Wrist Extension Orthosis",
    category: "static-splints",
    description:
      "Immobilizes the wrist while allowing full MCP and thumb mobility.",
    indications: [
      "Carpal Tunnel Syndrome (CTS)",
      "Lateral epicondylitis (Tennis elbow)",
      "Colles fracture (post-cast)",
      "Radial nerve palsy (flaccid wrist)",
    ],
    contraindications: [
      "Complex Regional Pain Syndrome (if rigid splint exacerbates symptoms)",
      "Lesions directly over volar crease",
    ],
    precautions: [
      "Monitor median nerve compression if fitted too tightly over carpal tunnel",
      "Ensure distal palmar crease is clear for full finger flexion",
    ],
    parameters: [
      "Wrist positioned in 10-20° extension (neutral for CTS)",
      "Check clearance of thenar eminence and distal palmar crease",
      "Wearing schedule: Night for CTS; prn during aggravating activities",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "American Society of Hand Therapists. Clinical Guidelines.",
  },
  {
    id: "ot-iso-003",
    name: "Thumb Spica Splint (Short or Long Opponens)",
    category: "static-splints",
    description:
      "Immobilizes the thumb CMC and/or MCP joint while preserving IP and other finger motion.",
    indications: [
      "De Quervain's tenosynovitis (long - includes wrist)",
      "Thumb CMC osteoarthritis",
      "UCL injury (Skier's/Gamekeeper's thumb)",
      "Scaphoid fracture (post-cast)",
    ],
    contraindications: ["None specific, aside from skin compromise"],
    precautions: [
      "Web space friction",
      "Over-abduction causing CMC joint stretch",
    ],
    parameters: [
      "Position thumb in palmar abduction (functional opposition)",
      "Determine if IP joint needs to be included (usually free for CMC OA, included for severe tendonitis)",
      "Wearing schedule: Wear during pinching/grasping activities",
    ],
    evidenceLevel: 1,
    source: "ASHT",
    citation: "Coppard BM, Lohman H. Introduction to Splinting.",
  },
  {
    id: "ot-iso-004",
    name: "Dynamic Flexion/Extension Splint (Outrigger)",
    category: "dynamic-splints",
    description:
      "Applies continuous, gentle force via rubber bands or springs to stretch contractures or substitute for absent muscle power.",
    indications: [
      "Post-extensor/flexor tendon repair (e.g., Kleinert protocol)",
      "Radial nerve palsy (dynamic wrist/finger extension)",
      "Joint contracture (PIP/DIP)",
    ],
    contraindications: [
      "Acute inflammatory stage",
      "Unstable fractures",
      "Fixed, long-standing contracture >1 year (may need serial casting instead)",
    ],
    precautions: [
      "Requires high patient compliance and cognition",
      "Watch for red pressure marks from slings",
      "Angle of pull must remain at 90° to the bone being moved",
    ],
    parameters: [
      "Line of pull MUST be 90 degrees to rotational axis (prevent joint distraction/compression)",
      "Force should be low-load, long duration (patient should feel gentle stretch, not pain)",
      "Wear schedule varies tightly with surgical protocol (e.g., 24/7 minus hygiene vs specific stretching hours)",
    ],
    evidenceLevel: 2,
    source: "ASHT",
    citation:
      "Fess EE, et al. Hand and Upper Extremity Splinting: Principles and Methods.",
  },
  {
    id: "ot-iso-005",
    name: "Serial Casting (Upper Extremity)",
    category: "orthotics",
    description:
      "Sequential application of fiberglass/plaster casts to progressively stretch out severe spasticity or joint contracture.",
    indications: [
      "Severe spasticity (e.g., TBI, stroke, CP) leading to contracture",
      "Biceps contracture",
      "Wrist/finger severe flexion contracture",
    ],
    contraindications: [
      "Open wounds/skin grafts under cast area",
      "Deep vein thrombosis",
      "Uncontrolled hypertension/ICP spikes",
      "Severe fluctuating edema",
    ],
    precautions: [
      "Requires specialized training",
      "Monitor cap refill and temperature of digits daily",
      "Evaluate for compartment syndrome",
    ],
    parameters: [
      "Assess range, apply cast at submaximal stretch (do not force to absolute end-range)",
      "Leave on for 3-7 days",
      "Remove, re-assess, stretch, cast in new range",
      "Typically 3-6 casts until plateau is reached",
    ],
    evidenceLevel: 1,
    source: "Neuro-Rehab / AOTA",
    citation:
      "Singer BJ, et al. Serial casting to prevent or manage contractures: a systematic review.",
  },
];

export const getAllOTSplintingOrthoticsInterventions = (): OTIntervention[] => {
  auditService.log({
    action: "read",
    resourceType: "interventions",
    discipline: "ot",
    metadata: {
      count: splintingOrthoticsInterventions.length,
      category: "splinting_orthotics",
    },
  });
  return splintingOrthoticsInterventions;
};

export const getOTSplintingOrthoticsInterventionsByCategory = (
  category: string,
): OTIntervention[] => {
  return splintingOrthoticsInterventions.filter((i) => i.category === category);
};

export const getOTSplintingOrthoticsInterventionById = (
  id: string,
): OTIntervention | undefined => {
  return splintingOrthoticsInterventions.find((i) => i.id === id);
};

export const searchOTSplintingOrthoticsInterventions = (
  query: string,
): OTIntervention[] => {
  const q = query.toLowerCase();
  return splintingOrthoticsInterventions.filter(
    (i) =>
      i.name.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      i.indications.some((ind) => ind.toLowerCase().includes(q)),
  );
};
