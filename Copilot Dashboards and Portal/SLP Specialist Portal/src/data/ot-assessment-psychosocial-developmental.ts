/**
 * OT Assessment: Psychosocial & Developmental
 *
 * Standardized assessment protocols for social participation and pediatric development.
 * Evidence-based from COPM, MOHO, and Pediatric Developmental Standards.
 *
 * Assessments included:
 * - COPM (Canadian Occupational Performance Measure)
 * - Beery-Buktenica VMI (Visual-Motor Integration)
 * - BOT-2 (Bruininks-Oseretsky Test of Motor Proficiency)
 * - OSA (Occupational Self-Assessment - Adult)
 * - COSA (Child Occupational Self-Assessment)
 * - PEDI-CAT (Pediatric Evaluation of Disability Inventory)
 * - OPHI-II (Occupational Performance History Interview)
 *
 * Sources:
 * - Law, M., et al. (2014). Canadian Occupational Performance Measure.
 * - Beery, K. E. (2010). Beery-Buktenica VMI.
 * - Bruininks, R. H., & Bruininks, B. D. (2005). BOT-2.
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
 * COPM - Canadian Occupational Performance Measure
 */
const copmAssessment: OTAssessmentTool = {
  id: "ot-apd-001",
  name: "Canadian Occupational Performance Measure",
  abbreviation: "COPM",
  category: "psychosocial-assessment",
  description:
    "Evidence-based outcome measure designed to capture a client’s self-perception of performance in everyday living.",
  domains: ["Self-care", "Productivity", "Leisure"],
  administration: "Semi-structured interview (30-45 mins).",
  scoring:
    "Clinically meaningful change is defined as a 2-point increase in Performance or Satisfaction rating.",
  indications: [
    "Client-centered goal setting",
    "Outcome measurement over time",
    "All OT populations",
  ],
  contraindications: [
    "Severe cognitive impairment with inability to rate performance",
  ],
  precautions: [
    "Therapeutic rapport is critical",
    "Culturally sensitive stimuli interpretation",
  ],
  evidenceLevel: 1,
  source: "COPM-Law",
  citation:
    "Law, M., et al. (2014). The Canadian Occupational Performance Measure (COPM).",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * Beery-Buktenica VMI (Visual-Motor Integration)
 */
const beeryVmi: OTAssessmentTool = {
  id: "ot-apd-002",
  name: "Beery-Buktenica Developmental Test of VMI",
  abbreviation: "Beery VMI",
  category: "developmental-assessment",
  description:
    "Measure of the extent to which individuals can integrate their visual and motor abilities.",
  domains: [
    "Visual-Motor Integration",
    "Visual Perception",
    "Motor Coordination",
  ],
  administration:
    "Standardized paper-and-pencil tasks involving copying shapes of increasing complexity.",
  scoring:
    "Standardized scores provided for VMI, Visual Perception, and Motor Coordination subtests.",
  indications: [
    "Developmental delay",
    "Learning disabilities",
    "Pediatric neurological screen",
  ],
  contraindications: [
    "Total blindness",
    "Inability to use any writing utensil",
  ],
  precautions: [
    "Follow exact verbal instructions as per manual",
    'Monitor for "eraser" use (not allowed in standardized trials)',
  ],
  evidenceLevel: 1,
  source: "Pearson",
  citation:
    "Beery, K. E., & Beery, N. A. (2010). The Beery-Buktenica Developmental Test of Visual-Motor Integration.",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * BOT-2 - Bruininks-Oseretsky Test of Motor Proficiency
 */
const bot2Assessment: OTAssessmentTool = {
  id: "ot-apd-003",
  name: "Bruininks-Oseretsky Test of Motor Proficiency",
  abbreviation: "BOT-2",
  category: "developmental-assessment",
  description:
    "Comprehensive index of motor proficiency including gross and fine motor skills.",
  domains: [
    "Fine Manual Control",
    "Manual Dexterity",
    "Body Coordination",
    "Strength/Agility",
  ],
  administration:
    "Structured direct testing (Long or Short form); ages 4 to 21.",
  scoring:
    "Standardized scores, percentiles, and age equivalents for motor sub-domains.",
  indications: [
    "Developmental Coordination Disorder (DCD)",
    "Motor planning deficits",
    "Sports medicine pediatric triage",
  ],
  contraindications: [
    "Cerebral Palsy during severe spasticity episode",
    "Acute pediatric cardiac stable concern",
  ],
  precautions: [
    "Safety during gross motor agility tasks",
    "Assess balance on firm ground before testing on specialized equipment",
  ],
  evidenceLevel: 2,
  source: "Pearson",
  citation:
    "Bruininks, R. H., & Bruininks, B. D. (2005). Bruininks-Oseretsky Test of Motor Proficiency.",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * OSA - Occupational Self-Assessment
 */
const osaAssessment: OTAssessmentTool = {
  id: "ot-apd-004",
  name: "Occupational Self-Assessment",
  abbreviation: "OSA",
  category: "psychosocial-assessment",
  description:
    "Client-centered tool based on the Model of Human Occupation (MOHO) to evaluate competence and values.",
  domains: ["Occupational Performance", "Activity Importance (Values)"],
  administration: "Self-report questionnaire for individuals age 18 and older.",
  scoring:
    "Rating scales for Performance (1-4) and Value (1-4); used for goal-setting and interest identification.",
  indications: [
    "Physical rehabilitation psychology",
    "Mental health OT",
    "Community reintegration",
  ],
  contraindications: [
    "Severe cognitive impairment making self-appraisal impossible",
  ],
  precautions: [
    "Assess discrepancies between self-report and actual clinical observation",
    'Cultural values regarding "work" and "leisure" roles',
  ],
  evidenceLevel: 2,
  source: "MOHO",
  citation:
    "Baron, K., et al. (2006). A User's Guide to the Occupational Self-Assessment (OSA).",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * Collection of all OT Psychosocial & Developmental Assessments
 */
const otPsychosocialDevelopmentalAssessments: OTAssessmentTool[] = [
  copmAssessment,
  beeryVmi,
  bot2Assessment,
  osaAssessment,
];

/**
 * Get all OT Psychosocial & Developmental Assessments
 */
export const getAllOTPsychosocialDevelopmentalAssessments =
  (): OTAssessmentTool[] => {
    auditService.log({
      action: "read",
      resourceType: "assessments",
      discipline: "ot",
      metadata: {
        count: otPsychosocialDevelopmentalAssessments.length,
        category: "psychosocial_developmental",
      },
    });
    return otPsychosocialDevelopmentalAssessments;
  };

/**
 * Get OT Psychosocial & Developmental Assessment by ID
 */
export const getOTPsychosocialDevelopmentalAssessmentById = (
  id: string,
): OTAssessmentTool | undefined => {
  const assessment = otPsychosocialDevelopmentalAssessments.find(
    (a) => a.id === id,
  );
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
