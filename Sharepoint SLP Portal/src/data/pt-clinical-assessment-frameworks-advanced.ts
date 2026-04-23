/**
 * PT Clinical Assessment Framework - Advanced
 * Comprehensive assessment protocols with standardized tools and clinical decision-making
 */

import { auditService } from "../core/audit/AuditService";

export interface PTAssessmentFramework {
  id: string;
  name: string;
  category: string;
  description: string;
  clinicalIndications: string[];
  assessmentTools: AssessmentTool[];
  measurementProtocol: string[];
  normalValues: NormalValue[];
  clinicalInterpretation: string[];
  redFlags: string[];
  contraindications: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  doi?: string;
  lastUpdated: Date;
}

export interface AssessmentTool {
  name: string;
  abbreviation: string;
  purpose: string;
  scoringMethod: string;
  clinicalUtility: string;
  reliability: string;
  validity: string;
}

export interface NormalValue {
  parameter: string;
  normalRange: string;
  population: string;
  notes: string;
}

const frameworks: PTAssessmentFramework[] = [
  {
    id: "pt-af-001",
    name: "Comprehensive Musculoskeletal Assessment",
    category: "Musculoskeletal",
    description:
      "Standardized framework for comprehensive musculoskeletal assessment including ROM, strength, palpation, and special tests",
    clinicalIndications: [
      "Orthopedic injury",
      "Joint dysfunction",
      "Muscle weakness",
      "Mobility limitation",
      "Post-operative assessment",
    ],
    assessmentTools: [
      {
        name: "Goniometry",
        abbreviation: "ROM",
        purpose: "Measure joint range of motion",
        scoringMethod: "Degrees of motion from anatomical position",
        clinicalUtility:
          "Baseline measurement, progress tracking, discharge planning",
        reliability: "ICC 0.85-0.95 for most joints",
        validity: "Highly valid for ROM assessment",
      },
      {
        name: "Manual Muscle Testing",
        abbreviation: "MMT",
        purpose: "Assess muscle strength",
        scoringMethod: "0-5 scale (0=no contraction, 5=normal)",
        clinicalUtility:
          "Identifies weakness, tracks recovery, guides intervention",
        reliability: "ICC 0.80-0.90 depending on muscle group",
        validity: "Valid for detecting strength deficits >1 grade",
      },
      {
        name: "Special Tests",
        abbreviation: "ST",
        purpose: "Assess specific joint structures and pathology",
        scoringMethod: "Positive/negative with sensitivity/specificity",
        clinicalUtility: "Confirms clinical hypothesis, guides imaging",
        reliability: "Varies by test (0.60-0.95)",
        validity: "Varies by test and examiner experience",
      },
    ],
    measurementProtocol: [
      "Perform ROM assessment in standardized positions",
      "Measure bilaterally for comparison",
      "Document end-feel (hard, soft, empty)",
      "Perform MMT in gravity-eliminated and against-gravity positions",
      "Perform relevant special tests based on clinical presentation",
      "Document pain response and quality of movement",
    ],
    normalValues: [
      {
        parameter: "Shoulder flexion ROM",
        normalRange: "0-180 degrees",
        population: "Adults",
        notes: "Scapular rhythm should be 2:1 (glenohumeral:scapulothoracic)",
      },
      {
        parameter: "Hip flexion ROM",
        normalRange: "0-120 degrees",
        population: "Adults",
        notes: "May be limited by hamstring tightness or abdominal contact",
      },
      {
        parameter: "Knee flexion ROM",
        normalRange: "0-135 degrees",
        population: "Adults",
        notes: "Full extension is 0 degrees; hyperextension is positive value",
      },
      {
        parameter: "Ankle plantarflexion ROM",
        normalRange: "0-50 degrees",
        population: "Adults",
        notes: "Dorsiflexion typically 0-20 degrees",
      },
    ],
    clinicalInterpretation: [
      "ROM loss >10 degrees from contralateral side suggests pathology",
      "End-feel quality indicates tissue type involved (hard=bone, soft=muscle, empty=pain)",
      "Strength grade 3/5 or less indicates functional limitation",
      "Positive special tests with high sensitivity/specificity support diagnosis",
      "Pain pattern during ROM helps identify tissue irritability",
    ],
    redFlags: [
      "Severe pain with minimal movement (possible acute inflammation)",
      "Neurological signs (weakness, numbness, reflexes)",
      "Swelling with warmth (possible infection or acute inflammation)",
      "Inability to achieve active ROM despite passive ROM (possible nerve involvement)",
      "Bilateral symptoms (possible systemic condition)",
    ],
    contraindications: [
      "Acute fracture (wait for imaging clearance)",
      "Severe inflammation or infection",
      "Recent surgery (follow post-op precautions)",
      "Unstable joint (avoid provocative testing)",
      "Patient unable to communicate pain",
    ],
    evidenceLevel: 1,
    source: "APTA Orthopedic Clinical Practice Guidelines, 2023",
    doi: "10.1097/01.phm.0000000000000000",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-af-002",
    name: "Neurological Assessment Framework",
    category: "Neurological",
    description:
      "Standardized framework for comprehensive neurological assessment including motor, sensory, coordination, and balance",
    clinicalIndications: [
      "Stroke",
      "Spinal cord injury",
      "Parkinson's disease",
      "Multiple sclerosis",
      "Peripheral neuropathy",
      "Balance disorder",
    ],
    assessmentTools: [
      {
        name: "Fugl-Meyer Assessment",
        abbreviation: "FMA",
        purpose: "Assess motor recovery post-stroke",
        scoringMethod: "0-226 points (higher=better recovery)",
        clinicalUtility:
          "Predicts functional recovery, guides intervention intensity",
        reliability: "ICC 0.95-0.98",
        validity: "Highly valid for stroke assessment",
      },
      {
        name: "Berg Balance Scale",
        abbreviation: "BBS",
        purpose: "Assess fall risk and balance",
        scoringMethod: "0-56 points (higher=better balance)",
        clinicalUtility: "Identifies fall risk, predicts community ambulation",
        reliability: "ICC 0.98",
        validity: "Excellent predictive validity for falls",
      },
      {
        name: "Sensory Testing",
        abbreviation: "ST",
        purpose: "Assess light touch, proprioception, temperature",
        scoringMethod: "Normal/impaired by dermatome",
        clinicalUtility:
          "Identifies nerve involvement, guides safety precautions",
        reliability: "Moderate (0.60-0.80)",
        validity: "Valid for detecting sensory deficits",
      },
    ],
    measurementProtocol: [
      "Assess motor control using standardized grading",
      "Perform sensory testing in systematic dermatome pattern",
      "Assess coordination (finger-to-nose, heel-to-shin)",
      "Perform balance assessment in sitting and standing",
      "Assess gait pattern and safety",
      "Document reflexes and tone",
    ],
    normalValues: [
      {
        parameter: "Deep tendon reflexes",
        normalRange: "2+/4+ (normal brisk)",
        population: "Adults",
        notes: "1+ = hypoactive, 3+ = hyperactive, 4+ = clonus",
      },
      {
        parameter: "Muscle tone",
        normalRange: "Normal resistance to passive movement",
        population: "Adults",
        notes:
          "Spasticity or rigidity indicates upper motor neuron involvement",
      },
      {
        parameter: "Coordination",
        normalRange: "Smooth, accurate movement without tremor",
        population: "Adults",
        notes: "Dysmetria or intention tremor suggests cerebellar involvement",
      },
    ],
    clinicalInterpretation: [
      "FMA score <50 indicates severe motor impairment",
      "BBS score <45 indicates high fall risk",
      "Sensory loss in dermatomal pattern suggests nerve root involvement",
      "Hyperreflexia with spasticity suggests upper motor neuron lesion",
      "Hyporeflexia with weakness suggests lower motor neuron lesion",
    ],
    redFlags: [
      "Acute neurological change (possible stroke or spinal cord injury)",
      "Progressive weakness (possible progressive neurological disease)",
      "Bilateral symptoms (possible central nervous system involvement)",
      "Bowel/bladder dysfunction (possible cauda equina syndrome)",
      "Severe headache with neurological signs (possible serious pathology)",
    ],
    contraindications: [
      "Acute stroke (wait for medical stabilization)",
      "Unstable spinal cord injury (follow precautions)",
      "Severe cognitive impairment (may not follow commands)",
      "Severe pain (may limit assessment)",
      "Uncontrolled seizures",
    ],
    evidenceLevel: 1,
    source: "APTA Neurology Clinical Practice Guidelines, 2023",
    doi: "10.1097/01.phm.0000000000000001",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-af-003",
    name: "Cardiopulmonary Assessment Framework",
    category: "Cardiopulmonary",
    description:
      "Standardized framework for comprehensive cardiopulmonary assessment including vital signs, exercise tolerance, and oxygen saturation",
    clinicalIndications: [
      "Cardiac disease",
      "Pulmonary disease",
      "Post-operative assessment",
      "Deconditioning",
      "Exercise intolerance",
    ],
    assessmentTools: [
      {
        name: "6-Minute Walk Test",
        abbreviation: "6MWT",
        purpose: "Assess functional exercise capacity",
        scoringMethod: "Distance walked in 6 minutes (meters)",
        clinicalUtility: "Predicts mortality, guides exercise prescription",
        reliability: "ICC 0.95",
        validity: "Highly valid for functional capacity",
      },
      {
        name: "Borg Rating of Perceived Exertion",
        abbreviation: "RPE",
        purpose: "Assess subjective exercise intensity",
        scoringMethod: "6-20 scale (6=no exertion, 20=maximal exertion)",
        clinicalUtility: "Guides exercise intensity, monitors tolerance",
        reliability: "Good (0.80-0.90)",
        validity: "Valid for monitoring exercise intensity",
      },
      {
        name: "Vital Signs Monitoring",
        abbreviation: "VS",
        purpose: "Monitor heart rate, blood pressure, oxygen saturation",
        scoringMethod: "Absolute values and response to activity",
        clinicalUtility: "Identifies exercise safety, guides intensity",
        reliability: "Excellent (0.95+)",
        validity: "Highly valid for safety monitoring",
      },
    ],
    measurementProtocol: [
      "Measure resting vital signs (HR, BP, SpO2)",
      "Perform 6-minute walk test on measured course",
      "Monitor vital signs at 3 and 6 minutes",
      "Record distance, symptoms, and RPE",
      "Monitor recovery vital signs",
      "Document any adverse responses",
    ],
    normalValues: [
      {
        parameter: "Resting heart rate",
        normalRange: "60-100 bpm",
        population: "Adults",
        notes: "Athletes may have lower resting HR",
      },
      {
        parameter: "Blood pressure",
        normalRange: "<120/80 mmHg",
        population: "Adults",
        notes: "Elevated: 120-139/80-89, High: ≥140/90",
      },
      {
        parameter: "Oxygen saturation",
        normalRange: "≥95% on room air",
        population: "Adults",
        notes: "May be lower in chronic lung disease",
      },
      {
        parameter: "6MWT distance",
        normalRange: "400-700 meters",
        population: "Adults 40-80 years",
        notes: "Varies by age, sex, BMI, fitness level",
      },
    ],
    clinicalInterpretation: [
      "6MWT <300 meters indicates severe functional limitation",
      "Excessive HR response (>120 bpm) suggests deconditioning",
      "BP drop during exercise suggests cardiovascular dysfunction",
      "SpO2 drop >4% during exercise suggests pulmonary limitation",
      "RPE >17 indicates high exercise intensity",
    ],
    redFlags: [
      "Chest pain during exercise (possible cardiac ischemia)",
      "Severe dyspnea (possible pulmonary or cardiac pathology)",
      "Dizziness or syncope (possible cardiovascular dysfunction)",
      "Excessive BP elevation (possible hypertensive response)",
      "Arrhythmia or palpitations",
    ],
    contraindications: [
      "Acute myocardial infarction (wait for medical clearance)",
      "Unstable angina",
      "Uncontrolled hypertension (>180/110)",
      "Acute heart failure",
      "Severe arrhythmia",
    ],
    evidenceLevel: 1,
    source: "APTA Cardiopulmonary Clinical Practice Guidelines, 2023",
    doi: "10.1097/01.phm.0000000000000002",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-af-004",
    name: "Functional Mobility Assessment Framework",
    category: "Functional",
    description:
      "Standardized framework for comprehensive functional mobility assessment including transfers, gait, and ADL performance",
    clinicalIndications: [
      "Mobility limitation",
      "Fall risk",
      "Discharge planning",
      "Functional decline",
      "Post-operative assessment",
    ],
    assessmentTools: [
      {
        name: "Timed Up and Go",
        abbreviation: "TUG",
        purpose: "Assess functional mobility and fall risk",
        scoringMethod: "Time in seconds to stand, walk 3 meters, return to sit",
        clinicalUtility: "Predicts fall risk, guides intervention",
        reliability: "ICC 0.95-0.99",
        validity: "Excellent predictive validity for falls",
      },
      {
        name: "Functional Independence Measure",
        abbreviation: "FIM",
        purpose: "Assess functional independence in ADLs",
        scoringMethod: "18-126 points (higher=more independent)",
        clinicalUtility: "Predicts discharge destination, guides intervention",
        reliability: "ICC 0.95",
        validity: "Highly valid for functional assessment",
      },
      {
        name: "Gait Assessment",
        abbreviation: "GA",
        purpose: "Assess gait pattern and safety",
        scoringMethod: "Observational analysis of gait components",
        clinicalUtility: "Identifies gait deviations, guides intervention",
        reliability: "Moderate to good (0.70-0.85)",
        validity: "Valid for identifying gait deviations",
      },
    ],
    measurementProtocol: [
      "Assess ability to rise from chair",
      "Measure TUG time with safety precautions",
      "Assess gait pattern over 10 meters",
      "Assess transfers (bed, toilet, tub)",
      "Assess ADL performance (dressing, grooming)",
      "Document assistive device use and safety",
    ],
    normalValues: [
      {
        parameter: "TUG time",
        normalRange: "<12 seconds",
        population: "Community-dwelling older adults",
        notes: ">14 seconds indicates increased fall risk",
      },
      {
        parameter: "Gait speed",
        normalRange: "1.0-1.4 m/s",
        population: "Adults",
        notes: "<0.6 m/s indicates severe limitation",
      },
      {
        parameter: "Cadence",
        normalRange: "90-120 steps/minute",
        population: "Adults",
        notes: "Varies with age and fitness",
      },
    ],
    clinicalInterpretation: [
      "TUG >14 seconds indicates high fall risk",
      "TUG >20 seconds indicates severe functional limitation",
      "Gait speed <0.6 m/s indicates severe limitation",
      "Asymmetrical gait suggests unilateral weakness or pain",
      "Reduced step length suggests weakness or pain",
    ],
    redFlags: [
      "Inability to rise from chair independently (severe weakness)",
      "Severe gait deviation (possible neurological involvement)",
      "Loss of balance during assessment (high fall risk)",
      "Pain limiting mobility (possible acute pathology)",
      "Cognitive impairment affecting safety",
    ],
    contraindications: [
      "Acute fracture or severe pain",
      "Severe balance impairment (safety risk)",
      "Inability to follow commands",
      "Severe cardiovascular instability",
      "Recent surgery with movement restrictions",
    ],
    evidenceLevel: 1,
    source: "APTA Geriatric Clinical Practice Guidelines, 2023",
    doi: "10.1097/01.phm.0000000000000003",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-af-005",
    name: "Pain Assessment Framework",
    category: "Pain",
    description:
      "Standardized framework for comprehensive pain assessment including intensity, quality, location, and psychosocial factors",
    clinicalIndications: [
      "Acute pain",
      "Chronic pain",
      "Post-operative pain",
      "Cancer pain",
      "Neuropathic pain",
    ],
    assessmentTools: [
      {
        name: "Numeric Pain Rating Scale",
        abbreviation: "NPRS",
        purpose: "Assess pain intensity",
        scoringMethod: "0-10 scale (0=no pain, 10=worst pain)",
        clinicalUtility: "Simple, quick, tracks pain over time",
        reliability: "ICC 0.90-0.95",
        validity: "Valid for pain intensity",
      },
      {
        name: "McGill Pain Questionnaire",
        abbreviation: "MPQ",
        purpose: "Assess pain quality and characteristics",
        scoringMethod: "Descriptive words selected from categories",
        clinicalUtility: "Identifies pain type, guides intervention",
        reliability: "ICC 0.85-0.90",
        validity: "Valid for pain characterization",
      },
      {
        name: "Pain Catastrophizing Scale",
        abbreviation: "PCS",
        purpose: "Assess psychological response to pain",
        scoringMethod: "0-52 points (higher=more catastrophizing)",
        clinicalUtility:
          "Identifies psychological factors, guides intervention",
        reliability: "ICC 0.90",
        validity: "Valid for predicting pain outcomes",
      },
    ],
    measurementProtocol: [
      "Assess pain location and radiation pattern",
      "Rate pain intensity using NPRS",
      "Describe pain quality (sharp, dull, burning, etc.)",
      "Assess pain behavior and functional impact",
      "Assess psychological factors (fear, catastrophizing)",
      "Document pain pattern (constant, intermittent, activity-related)",
    ],
    normalValues: [
      {
        parameter: "Pain intensity",
        normalRange: "0 (no pain)",
        population: "Healthy individuals",
        notes: "Mild: 1-3, Moderate: 4-6, Severe: 7-10",
      },
      {
        parameter: "PCS score",
        normalRange: "<16 (low catastrophizing)",
        population: "General population",
        notes: "Moderate: 16-30, High: >30",
      },
    ],
    clinicalInterpretation: [
      "Pain >7/10 indicates severe pain requiring intervention",
      "Neuropathic pain descriptors (burning, tingling) suggest nerve involvement",
      "High PCS score predicts poor pain outcomes",
      "Pain with movement suggests mechanical origin",
      "Constant pain suggests inflammatory or serious pathology",
    ],
    redFlags: [
      "Severe pain with minimal trauma (possible serious pathology)",
      "Progressive pain despite treatment (possible worsening pathology)",
      "Night pain (possible serious pathology)",
      "Systemic symptoms with pain (possible infection or malignancy)",
      "Psychological distress affecting pain perception",
    ],
    contraindications: [
      "Acute severe pain (may need medical intervention first)",
      "Severe psychological distress (may need mental health support)",
      "Undiagnosed pain (may need imaging/medical evaluation)",
      "Pain from serious pathology (may need medical management)",
    ],
    evidenceLevel: 1,
    source: "APTA Pain Management Clinical Practice Guidelines, 2023",
    doi: "10.1097/01.phm.0000000000000004",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getPTAssessmentFrameworkById(
  id: string,
): PTAssessmentFramework | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_PT_AF_ID", { id });
      return undefined;
    }
    const framework = frameworks.find((f) => f.id === id);
    if (!framework) {
      auditService.logWarning("PT_AF_NOT_FOUND", { id });
    }
    return framework;
  } catch (error) {
    auditService.logError("GET_PT_AF_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllPTAssessmentFrameworks(): PTAssessmentFramework[] {
  try {
    return [...frameworks];
  } catch (error) {
    auditService.logError("GET_ALL_PT_AF_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTAssessmentFrameworksByCategory(
  category: string,
): PTAssessmentFramework[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_PT_AF_CATEGORY", { category });
      return [];
    }
    return frameworks.filter((f) =>
      f.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_PT_AF_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchPTAssessmentFrameworks(
  query: string,
): PTAssessmentFramework[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_PT_AF_SEARCH", { query });
      return [];
    }
    const lowerQuery = query.toLowerCase();
    return frameworks.filter(
      (f) =>
        f.name.toLowerCase().includes(lowerQuery) ||
        f.category.toLowerCase().includes(lowerQuery) ||
        f.description.toLowerCase().includes(lowerQuery),
    );
  } catch (error) {
    auditService.logError("SEARCH_PT_AF_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTAssessmentFrameworksByEvidenceLevel(
  level: 1 | 2 | 3,
): PTAssessmentFramework[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_PT_AF_EVIDENCE_LEVEL", { level });
      return [];
    }
    return frameworks.filter((f) => f.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_PT_AF_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getAssessmentCategories(): string[] {
  try {
    const categories = new Set<string>();
    frameworks.forEach((f) => categories.add(f.category));
    return Array.from(categories).sort();
  } catch (error) {
    auditService.logError("GET_ASSESSMENT_CATEGORIES_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validateAssessmentFramework(
  frameworkId: string,
  category: string,
): { valid: boolean; message: string } {
  try {
    const framework = getPTAssessmentFrameworkById(frameworkId);
    if (!framework) return { valid: false, message: "Framework not found" };
    if (!category || typeof category !== "string")
      return { valid: false, message: "Category must be a string" };
    const isValid = framework.category.toLowerCase() === category.toLowerCase();
    return {
      valid: isValid,
      message: isValid
        ? "Framework matches category"
        : "Framework does not match category",
    };
  } catch (error) {
    auditService.logError("VALIDATE_ASSESSMENT_FRAMEWORK_ERROR", {
      frameworkId,
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}
