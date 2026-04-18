/**
 * OT Interventions: Compensatory & Environmental Strategies
 *
 * Evidence-based strategies for energy conservation, joint protection, and task modification.
 * Source: AOTA Guidelines, MOHO environmental integration
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

const compensatoryInterventions: OTIntervention[] = [
  {
    id: "ot-ice-001",
    name: "Energy Conservation / Work Simplification (4 P's)",
    category: "compensatory",
    description:
      "Strategies to reduce metabolic demand and fatigue during daily activities (Prioritize, Plan, Pacing, Position).",
    indications: [
      "Multiple Sclerosis (MS)",
      "COPD / CHF",
      "Post-COVID conditions",
      "Oncology rehabilitation",
      "Rheumatoid Arthritis",
    ],
    contraindications: ["None"],
    precautions: [
      "Monitor for depression/apathy avoiding tasks completely",
      "Ensure changes don't lead to severe deconditioning (balance with activity tolerance)",
    ],
    parameters: [
      "Prioritize: Eliminate unnecessary tasks",
      "Plan: Gather all materials before starting task",
      "Pacing: Take breaks BEFORE fatigue sets in (e.g., 10 mins work, 5 mins rest)",
      "Position: Sit instead of stand, avoid bending/reaching",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "Matuska K. Interventions for sleep and rest.",
  },
  {
    id: "ot-ice-002",
    name: "Joint Protection Principles",
    category: "compensatory",
    description:
      "Techniques to reduce mechanical stress on hypermobile or inflamed joints, preventing deformity.",
    indications: [
      "Rheumatoid Arthritis (RA)",
      "Osteoarthritis (OA)",
      "Ehlers-Danlos Syndrome (EDS)",
      "Lupus (SLE)",
    ],
    contraindications: ["None"],
    precautions: ["Must be paired with gentle ROM to prevent contractures"],
    parameters: [
      "Respect Pain (stop activity if pain lasts >2 hours post-task)",
      "Use the largest/strongest joints available (e.g., carry grocery bag on forearm, not fingers)",
      "Avoid positions of deformity (e.g., avoid tight lateral pinch preventing Ulnar Drift in RA)",
      "Use adaptive equipment to increase lever arms (e.g., built-up handles)",
    ],
    evidenceLevel: 1,
    source: "ACR / AOTA",
    citation:
      "American College of Rheumatology. Guidelines for the management of rheumatoid arthritis.",
  },
  {
    id: "ot-ice-003",
    name: "Home Environmental Modification (Fall Prevention)",
    category: "environmental",
    description:
      "Altering the physical layout, lighting, and objects in the home to reduce environmental press and increase safety.",
    indications: [
      "High fall risk (TUG >12s)",
      "Low vision / Macular degeneration",
      "Dementia (wandering/confusion)",
      "Post-hip fracture",
    ],
    contraindications: [
      "Tenant/Landlord restrictions without approval for structural changes",
    ],
    precautions: [
      "Family dynamics and resistance to changing the home aesthetic",
      "Cost of implementation",
    ],
    parameters: [
      "Lighting: Increase wattage, reduce glare, use motion-sensor nightlights",
      "Flooring: Remove throw rugs, secure carpet edges, contrast tape on stairs",
      "Bathroom: Install grab bars (must go into studs), shower chair, raised toilet seat",
      "Kitchen: Keep frequently used items between waist and shoulder height",
    ],
    evidenceLevel: 1,
    source: "Clemson (Stepping On)",
    citation:
      "Clemson L, et al. Environmental interventions for preventing falls in older people living in the community.",
  },
  {
    id: "ot-ice-004",
    name: "Visual Compensatory Strategies (Low Vision / Hemianopsia)",
    category: "compensatory",
    description:
      "Techniques to maximize remaining vision or compensate for visual field deficits (e.g., Left Hemianopsia post-stroke).",
    indications: [
      "Homonymous Hemianopsia",
      "Unilateral Spatial Neglect",
      "Macular Degeneration",
      "Diabetic Retinopathy",
      "Glaucoma",
    ],
    contraindications: [
      "Total anopsia (blindness - requires orientation and mobility specialist)",
    ],
    precautions: [
      "Safety during mobility (high fall risk on affected side)",
      "Ensure adequate lighting without glare",
    ],
    parameters: [
      "Visual Scanning Training: Structured tracking (e.g., Lighthouse technique, anchoring with a bright line on the affected side)",
      "Contrast Enhancement: White plate on black placemat, colored tape on step edges",
      "Magnification: Use of prescribed optical devices, large print, CCTV",
      "Organization: Exact placement of items (e.g., always keep phone in same spot)",
    ],
    evidenceLevel: 1,
    source: "AOTA Low Vision",
    citation:
      "Warren M. Evaluation and Treatment of Visual Deficits following Brain Injury.",
  },
  {
    id: "ot-ice-005",
    name: "Cognitive Compensatory Strategies",
    category: "compensatory",
    description:
      "Use of external aids and environment restructuring to bypass cognitive deficits.",
    indications: [
      "TBI",
      "Dementia (mild to moderate)",
      "Amnesia",
      "Executive function deficits",
    ],
    contraindications: [
      "Severe dementia (stage 7) where patient cannot recognize or use the external aid",
    ],
    precautions: [
      "Frustration if the compensatory tool is too complex",
      "Over-reliance on cues vs neuroplastic recovery (if applicable)",
    ],
    parameters: [
      "External Memory Aids: Smartphones, calendars, pill organizers with alarms",
      "Errorless Learning: Prevent the patient from making an error during task acquisition to build strong procedural memory",
      "Environmental simplification: Label drawers, reduce clutter to minimize distraction",
    ],
    evidenceLevel: 1,
    source: "Toglia / Neuro-Rehab",
    citation:
      "Toglia J. The Dynamic Interactional Approach to Cognitive Rehabilitation.",
  },
];

export const getAllOTCompensatoryInterventions = (): OTIntervention[] => {
  auditService.log({
    action: "read",
    resourceType: "interventions",
    discipline: "ot",
    metadata: {
      count: compensatoryInterventions.length,
      category: "compensatory_environmental",
    },
  });
  return compensatoryInterventions;
};

export const getOTCompensatoryInterventionsByCategory = (
  category: string,
): OTIntervention[] => {
  return compensatoryInterventions.filter((i) => i.category === category);
};

export const getOTCompensatoryInterventionById = (
  id: string,
): OTIntervention | undefined => {
  return compensatoryInterventions.find((i) => i.id === id);
};

export const searchOTCompensatoryInterventions = (
  query: string,
): OTIntervention[] => {
  const q = query.toLowerCase();
  return compensatoryInterventions.filter(
    (i) =>
      i.name.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      i.indications.some((ind) => ind.toLowerCase().includes(q)),
  );
};
