/**
 * OT Assessment Tools & Outcome Measures
 *
 * Comprehensive OT assessment tools based on AOTA standards
 * Requirements: 3.2, 3.3
 */

import type {
  OTAssessmentTool,
  OTOutcomeMeasure,
} from "../types/ot-assessment";

// ============================================================================
// OT Assessment Tools
// ============================================================================

export const otAssessmentTools: OTAssessmentTool[] = [
  {
    id: "copm",
    name: "Canadian Occupational Performance Measure",
    acronym: "COPM",
    domain: [
      "adl-training",
      "cognitive-rehab",
      "work-conditioning",
      "mental-health",
      "community-reintegration",
    ],
    description:
      "Client-centered assessment identifying occupational performance issues in self-care, productivity, and leisure",
    scoringRange: { min: 1, max: 10 },
    mcid: 2,
    interpretation: (score: number) => {
      if (score >= 8) return "Excellent performance and satisfaction";
      if (score >= 6) return "Good performance and satisfaction";
      if (score >= 4) return "Moderate performance and satisfaction";
      return "Poor performance and satisfaction";
    },
    evidenceLevel: 1,
    citation:
      "Law M, et al. The Canadian Occupational Performance Measure: A research and clinical tool. Can J Occup Ther. 1990;57(2):82-87.",
    adminTime: 30,
    costPerAdmin: 0,
  },
  {
    id: "fim",
    name: "Functional Independence Measure",
    acronym: "FIM",
    domain: ["adl-training", "cognitive-rehab", "community-reintegration"],
    description:
      "Assesses independence in ADLs, IADLs, communication, and social cognition",
    scoringRange: { min: 18, max: 126 },
    mcid: 13,
    interpretation: (score: number) => {
      if (score >= 100) return "Minimal assistance needed";
      if (score >= 80) return "Moderate assistance needed";
      if (score >= 60) return "Substantial assistance needed";
      return "Maximal assistance needed";
    },
    evidenceLevel: 1,
    citation:
      "Uniform Data System for Medical Rehabilitation. Guide for the Uniform Data Set for Medical Rehabilitation. Buffalo, NY: UDSMR; 1997.",
    adminTime: 45,
    costPerAdmin: 0,
  },
  {
    id: "amps",
    name: "Assessment of Motor and Process Skills",
    acronym: "AMPS",
    domain: ["adl-training", "hand-therapy", "cognitive-rehab"],
    description:
      "Observational assessment of motor and process skills during functional tasks",
    scoringRange: { min: 0, max: 4 },
    mcid: 0.5,
    interpretation: (score: number) => {
      if (score >= 3) return "Adequate skill level";
      if (score >= 2) return "Mild skill deficit";
      if (score >= 1) return "Moderate skill deficit";
      return "Severe skill deficit";
    },
    evidenceLevel: 1,
    citation:
      "Fisher AG. Assessment of Motor and Process Skills. 3rd ed. Fort Collins, CO: Three Star Press; 1999.",
    adminTime: 60,
    costPerAdmin: 50,
  },
  {
    id: "kels",
    name: "Kohlman Evaluation of Living Skills",
    acronym: "KELS",
    domain: ["adl-training", "cognitive-rehab", "community-reintegration"],
    description:
      "Assesses functional living skills in self-care, safety, money management, work, and leisure",
    scoringRange: { min: 0, max: 17 },
    mcid: 2,
    interpretation: (score: number) => {
      if (score >= 15) return "Independent living skills";
      if (score >= 12) return "Minimal assistance needed";
      if (score >= 8) return "Moderate assistance needed";
      return "Substantial assistance needed";
    },
    evidenceLevel: 2,
    citation:
      "Kohlman Thomson L. The Kohlman Evaluation of Living Skills (KELS). 3rd ed. Bethesda, MD: AOTA Press; 1992.",
    adminTime: 45,
    costPerAdmin: 0,
  },
  {
    id: "kta",
    name: "Kitchen Task Assessment",
    acronym: "KTA",
    domain: ["adl-training", "cognitive-rehab"],
    description: "Assesses cognitive and functional abilities in kitchen tasks",
    scoringRange: { min: 0, max: 16 },
    mcid: 2,
    interpretation: (score: number) => {
      if (score >= 14) return "Independent kitchen skills";
      if (score >= 10) return "Minimal assistance needed";
      if (score >= 6) return "Moderate assistance needed";
      return "Substantial assistance needed";
    },
    evidenceLevel: 2,
    citation:
      "Baum CM, Edwards DF. Cognitive Performance Test. St. Louis, MO: Washington University School of Medicine; 1993.",
    adminTime: 30,
    costPerAdmin: 0,
  },
  {
    id: "sensory-profile",
    name: "Sensory Profile",
    acronym: "SP",
    domain: ["sensory-integration", "pediatric-dev"],
    description:
      "Assesses sensory processing patterns and their impact on function",
    scoringRange: { min: 125, max: 625 },
    mcid: 50,
    interpretation: (score: number) => {
      if (score >= 500) return "Typical sensory processing";
      if (score >= 400) return "Probable sensory processing disorder";
      return "Definite sensory processing disorder";
    },
    evidenceLevel: 1,
    citation:
      "Dunn W. Sensory Profile. San Antonio, TX: The Psychological Corporation; 1999.",
    adminTime: 30,
    costPerAdmin: 0,
  },
  {
    id: "grip-strength",
    name: "Grip Strength Test",
    acronym: "GST",
    domain: ["hand-therapy", "work-conditioning"],
    description: "Measures grip strength using dynamometer",
    scoringRange: { min: 0, max: 100 },
    mcid: 5,
    interpretation: (score: number) => {
      if (score >= 80) return "Normal grip strength";
      if (score >= 60) return "Mild weakness";
      if (score >= 40) return "Moderate weakness";
      return "Severe weakness";
    },
    evidenceLevel: 2,
    citation:
      "Mathiowetz V, et al. Grip and pinch strength: Normative data for adults. Arch Phys Med Rehabil. 1985;66(2):69-74.",
    adminTime: 10,
    costPerAdmin: 0,
  },
  {
    id: "pinch-strength",
    name: "Pinch Strength Test",
    acronym: "PST",
    domain: ["hand-therapy", "work-conditioning"],
    description: "Measures pinch strength using pinch gauge",
    scoringRange: { min: 0, max: 50 },
    mcid: 2,
    interpretation: (score: number) => {
      if (score >= 40) return "Normal pinch strength";
      if (score >= 30) return "Mild weakness";
      if (score >= 20) return "Moderate weakness";
      return "Severe weakness";
    },
    evidenceLevel: 2,
    citation:
      "Mathiowetz V, et al. Grip and pinch strength: Normative data for adults. Arch Phys Med Rehabil. 1985;66(2):69-74.",
    adminTime: 10,
    costPerAdmin: 0,
  },
  {
    id: "purdue-pegboard",
    name: "Purdue Pegboard Test",
    acronym: "PPT",
    domain: ["hand-therapy", "work-conditioning", "pediatric-dev"],
    description: "Assesses fine motor dexterity and hand-eye coordination",
    scoringRange: { min: 0, max: 100 },
    mcid: 5,
    interpretation: (score: number) => {
      if (score >= 80) return "Normal dexterity";
      if (score >= 60) return "Mild dexterity deficit";
      if (score >= 40) return "Moderate dexterity deficit";
      return "Severe dexterity deficit";
    },
    evidenceLevel: 2,
    citation:
      "Tiffin J. Purdue Pegboard Test. Chicago, IL: Stoelting Co; 1968.",
    adminTime: 15,
    costPerAdmin: 0,
  },
  {
    id: "moca",
    name: "Montreal Cognitive Assessment",
    acronym: "MoCA",
    domain: ["cognitive-rehab", "community-reintegration"],
    description: "Screens for mild cognitive impairment",
    scoringRange: { min: 0, max: 30 },
    mcid: 2,
    interpretation: (score: number) => {
      if (score >= 26) return "Normal cognition";
      if (score >= 18) return "Mild cognitive impairment";
      return "Moderate to severe cognitive impairment";
    },
    evidenceLevel: 1,
    citation:
      "Nasreddine ZS, et al. The Montreal Cognitive Assessment (MoCA): A brief screening tool for mild cognitive impairment. J Am Geriatr Soc. 2005;53(4):695-699.",
    adminTime: 10,
    costPerAdmin: 0,
  },
];

// ============================================================================
// OT Outcome Measures
// ============================================================================

export const otOutcomeMeasures: OTOutcomeMeasure[] = [
  {
    id: "copm-outcome",
    name: "Canadian Occupational Performance Measure",
    acronym: "COPM",
    domain: [
      "adl-training",
      "cognitive-rehab",
      "work-conditioning",
      "mental-health",
      "community-reintegration",
    ],
    description: "Measures change in occupational performance and satisfaction",
    scoringRange: { min: 1, max: 10 },
    mcid: 2,
    interpretation: (score: number) => {
      if (score >= 8) return "Excellent outcome";
      if (score >= 6) return "Good outcome";
      if (score >= 4) return "Moderate outcome";
      return "Poor outcome";
    },
    evidenceLevel: 1,
    citation:
      "Law M, et al. The Canadian Occupational Performance Measure: A research and clinical tool. Can J Occup Ther. 1990;57(2):82-87.",
  },
  {
    id: "fim-outcome",
    name: "Functional Independence Measure",
    acronym: "FIM",
    domain: ["adl-training", "cognitive-rehab", "community-reintegration"],
    description: "Measures change in functional independence",
    scoringRange: { min: 18, max: 126 },
    mcid: 13,
    interpretation: (score: number) => {
      if (score >= 100) return "Excellent functional independence";
      if (score >= 80) return "Good functional independence";
      if (score >= 60) return "Moderate functional independence";
      return "Poor functional independence";
    },
    evidenceLevel: 1,
    citation:
      "Uniform Data System for Medical Rehabilitation. Guide for the Uniform Data Set for Medical Rehabilitation. Buffalo, NY: UDSMR; 1997.",
  },
  {
    id: "amps-outcome",
    name: "Assessment of Motor and Process Skills",
    acronym: "AMPS",
    domain: ["adl-training", "hand-therapy", "cognitive-rehab"],
    description: "Measures change in motor and process skills",
    scoringRange: { min: 0, max: 4 },
    mcid: 0.5,
    interpretation: (score: number) => {
      if (score >= 3) return "Excellent skill improvement";
      if (score >= 2) return "Good skill improvement";
      if (score >= 1) return "Moderate skill improvement";
      return "Minimal skill improvement";
    },
    evidenceLevel: 1,
    citation:
      "Fisher AG. Assessment of Motor and Process Skills. 3rd ed. Fort Collins, CO: Three Star Press; 1999.",
  },
  {
    id: "occupational-self-assessment",
    name: "Occupational Self Assessment",
    acronym: "OSA",
    domain: [
      "adl-training",
      "work-conditioning",
      "mental-health",
      "community-reintegration",
    ],
    description:
      "Client-centered measure of occupational competence and values",
    scoringRange: { min: 21, max: 126 },
    mcid: 10,
    interpretation: (score: number) => {
      if (score >= 100) return "High occupational competence";
      if (score >= 80) return "Good occupational competence";
      if (score >= 60) return "Moderate occupational competence";
      return "Low occupational competence";
    },
    evidenceLevel: 2,
    citation:
      "Baron K, et al. Occupational Self Assessment (OSA). Chicago, IL: AOTA Press; 2006.",
  },
  {
    id: "role-checklist",
    name: "Role Checklist",
    acronym: "RC",
    domain: ["work-conditioning", "mental-health", "community-reintegration"],
    description: "Assesses occupational roles and role satisfaction",
    scoringRange: { min: 0, max: 10 },
    mcid: 1,
    interpretation: (score: number) => {
      if (score >= 8) return "High role satisfaction";
      if (score >= 6) return "Good role satisfaction";
      if (score >= 4) return "Moderate role satisfaction";
      return "Low role satisfaction";
    },
    evidenceLevel: 3,
    citation:
      "Oakley F, et al. The Role Checklist: Development and empirical assessment of reliability. Occup Ther J Res. 1986;6(3):157-170.",
  },
  {
    id: "interest-checklist",
    name: "Interest Checklist",
    acronym: "IC",
    domain: ["mental-health", "community-reintegration", "leisure"],
    description: "Identifies leisure interests and activities",
    scoringRange: { min: 0, max: 80 },
    mcid: 5,
    interpretation: (score: number) => {
      if (score >= 60) return "High leisure engagement";
      if (score >= 40) return "Good leisure engagement";
      if (score >= 20) return "Moderate leisure engagement";
      return "Low leisure engagement";
    },
    evidenceLevel: 3,
    citation:
      "Matsutsuyu JS. The Interest Checklist. Am J Occup Ther. 1969;23(4):323-328.",
  },
];

// ============================================================================
// Assessment Tool Lookup Functions
// ============================================================================

export function getAssessmentTool(
  toolId: string,
): OTAssessmentTool | undefined {
  return otAssessmentTools.find((tool) => tool.id === toolId);
}

export function getOutcomeMeasure(
  measureId: string,
): OTOutcomeMeasure | undefined {
  return otOutcomeMeasures.find((measure) => measure.id === measureId);
}

export function getAssessmentToolsByDomain(domain: string): OTAssessmentTool[] {
  return otAssessmentTools.filter((tool) =>
    tool.domain.includes(domain as any),
  );
}

export function getOutcomeMeasuresByDomain(domain: string): OTOutcomeMeasure[] {
  return otOutcomeMeasures.filter((measure) =>
    measure.domain.includes(domain as any),
  );
}
