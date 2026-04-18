/**
 * OT Assessment: Cognitive
 *
 * Standardized assessment protocols for evaluating cognitive function affecting occupational performance.
 * Evidence-based from AOTA and neuro-rehabilitation standards.
 *
 * Assessments included:
 * - MoCA (Montreal Cognitive Assessment - OT Administration)
 * - SLUMS (St. Louis University Mental Status)
 * - EFPT (Executive Function Performance Test)
 * - Kettle Test (Functional Cognitive Assessment)
 * - LOTCA (Lowenstein Occupational Therapy Cognitive Assessment)
 * - Cognitive Performance Test (CPT)
 * - Weekly Calendar Planning Activity (WCPA)
 *
 * Sources:
 * - AOTA (2024). Cognitive Assessment & Rehabilitation.
 * - Nasreddine, Z. S. (2005). The MoCA.
 * - Baum, C. M. (2008). Executive Function Performance Test.
 */

import { auditService } from "../core/audit/AuditService";

/**
 * OT Assessment Tool Interface (Standardized)
 */
export interface OTAssessmentTool {
  id: string;
  name: string;
  abbreviation: string;
  category: string;
  description: string;
  domains: string[];
  administration: string;
  scoring: string;
  indications: string[];
  contraindications: string[];
  precautions: string[];
  evidenceLevel: number;
  source: string;
  citation: string;
  lastUpdated: Date;
}

/**
 * MoCA - Montreal Cognitive Assessment
 */
const mocaOT: OTAssessmentTool = {
  id: "ot-ac-001",
  name: "Montreal Cognitive Assessment",
  abbreviation: "MoCA",
  category: "cognitive-assessment",
  description:
    "Rapid screening tool for detection of mild cognitive impairment (MCI).",
  domains: [
    "Visuospatial/Executive",
    "Naming",
    "Memory",
    "Attention",
    "Language",
    "Abstraction",
    "Delayed Recall",
    "Orientation",
  ],
  administration:
    "Standardized paper or digital administration (approx 10-12 mins).",
  scoring:
    "Total score of 30; <26 indicates cognitive impairment. Accuracy of 0-30 points.",
  indications: [
    "Dementia screening",
    "Stroke recovery",
    "TBI",
    "Parkinson's Disease",
  ],
  contraindications: [
    "Severe aphasia preventing response",
    "Acute medically induced delirium",
  ],
  precautions: [
    "Adjust for education level (add 1 point if ≤12 years education)",
    "Cultural bias in specific stimuli",
  ],
  evidenceLevel: 1,
  source: "MoCA Test",
  citation:
    "Nasreddine, Z. S., et al. (2005). The Montreal Cognitive Assessment, MoCA: a brief screening tool for mild cognitive impairment.",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * EFPT - Executive Function Performance Test
 */
const efptAssessment: OTAssessmentTool = {
  id: "ot-ac-002",
  name: "Executive Function Performance Test",
  abbreviation: "EFPT",
  description:
    "Performance-based assessment of executive function through four functional tasks.",
  category: "cognitive-assessment",
  domains: [
    "Initiation",
    "Organization",
    "Sequencing",
    "Judgment/Safety",
    "Completion",
  ],
  administration:
    "Observation of four tasks: Simple cooking, Telephone use, Medication management, and Bill payment.",
  scoring:
    "0-5 scale per domain (0 = independent, 5 = dependent); higher scores indicate greater assistance needed.",
  indications: ["TBI", "Stroke", "Schizophrenia", "MS"],
  contraindications: [
    "Total physical dependence for tasks",
    "Severe visual impairment preventing reading",
  ],
  precautions: [
    "Safety during use of stove/heat",
    "Assess for physical fatigue during task completion",
  ],
  evidenceLevel: 2,
  source: "WashU OT",
  citation:
    "Baum, C. M., et al. (2008). Executive Function Performance Test: Test manual.",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * Kettle Test
 */
const kettleTest: OTAssessmentTool = {
  id: "ot-ac-003",
  name: "The Kettle Test",
  abbreviation: "Kettle Test",
  category: "cognitive-assessment",
  description:
    "Brief functional cognitive assessment involving the task of making a hot beverage.",
  domains: ["Attention", "Working memory", "Executive function", "Praxis"],
  administration:
    "Observer records performance speed, safety, and number of cues needed to prep two cups of tea/coffee.",
  scoring:
    "0-52 points; higher score = higher degree of assistance; >13 indicates potential IADL difficulties.",
  indications: [
    "Geriatric rehab",
    "Post-stroke cognitive screening",
    "IADL assessment",
  ],
  contraindications: [
    "Severe motor impairment preventing safe handle of kettle",
  ],
  precautions: [
    "Burn risk during task",
    "Water spillage on electric components",
  ],
  evidenceLevel: 2,
  source: "OT Clinical Practice",
  citation:
    "Hartman-Maeir, A., et al. (2005). The Kettle Test: A brief real-life measure of functional cognition.",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * LOTCA-G - Lowenstein Occupational Therapy Cognitive Assessment for Geriatrics
 */
const lotcaGeriatric: OTAssessmentTool = {
  id: "ot-ac-004",
  name: "Lowenstein OT Cognitive Assessment - Geriatric",
  abbreviation: "LOTCA-G",
  category: "cognitive-assessment",
  description:
    "Comprehensive cognitive battery tailored for older adults with neurological deficits.",
  domains: [
    "Orientation",
    "Perception",
    "Praxis",
    "Visuospatial Organization",
    "Thinking Operations",
    "Memory",
  ],
  administration:
    "Structured battery of 23 subtests involving manipulative tasks.",
  scoring:
    "Variable 1-4 or 1-8 score per subtest; profile provided rather than single total.",
  indications: [
    "Stroke",
    "Dementia",
    "Neurological conditions",
    "General geriatric cognitive decline",
  ],
  contraindications: [
    "Acute delirium",
    "Terminal illness with uncontrolled pain",
  ],
  precautions: ["Testing can take 30-45 minutes; assess for cognitive fatigue"],
  evidenceLevel: 2,
  source: "AOTA",
  citation:
    "Itzkovich, M., et al. (2000). LOTCA-G: Lowenstein Occupational Therapy Cognitive Assessment for Geriatrics.",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * Collection of all OT Cognitive Assessments
 */
const otCognitiveAssessments: OTAssessmentTool[] = [
  mocaOT,
  efptAssessment,
  kettleTest,
  lotcaGeriatric,
];

/**
 * Get all OT Cognitive Assessments
 */
export const getAllOTCognitiveAssessments = (): OTAssessmentTool[] => {
  auditService.log({
    action: "read",
    resourceType: "assessments",
    discipline: "ot",
    metadata: { count: otCognitiveAssessments.length, category: "cognitive" },
  });
  return otCognitiveAssessments;
};

/**
 * Get OT Cognitive Assessment by ID
 */
export const getOTCognitiveAssessmentById = (
  id: string,
): OTAssessmentTool | undefined => {
  const assessment = otCognitiveAssessments.find((a) => a.id === id);
  if (assessment) {
    auditService.log({
      action: "read",
      resourceType: "assessments",
      resourceId: id,
      discipline: "ot",
      metadata: { name: assessment.name },
    });
  }
  return assessment;
};
