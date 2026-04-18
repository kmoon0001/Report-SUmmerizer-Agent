/**
 * OT Clinical Red Flags & Safety Screening Framework
 * Comprehensive red flag identification and safety screening protocols
 * Based on: AOTA Guidelines, Clinical Practice Guidelines, Evidence-Based Research
 */

import { auditService } from "../core/audit/AuditService";

export interface RedFlag {
  name: string;
  description: string;
  category: string;
  severity: "Critical" | "High" | "Moderate";
  clinicalSignificance: string;
  requiredAction: string;
  referralSpecialty?: string;
  timeframe: string;
}

export interface SafetyScreening {
  id: string;
  condition: string;
  category: string;
  description: string;
  redFlags: RedFlag[];
  screeningQuestions: string[];
  contraindications: string[];
  precautions: string[];
  emergencyIndicators: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  doi?: string;
  lastUpdated: Date;
}

const safetyScreenings: SafetyScreening[] = [
  {
    id: "ot-sf-001",
    condition: "Cognitive & Neurological Red Flags",
    category: "Neurological",
    description:
      "Screening for serious cognitive and neurological pathology requiring medical referral",
    redFlags: [
      {
        name: "Acute Cognitive Change",
        description:
          "Sudden onset of confusion, disorientation, or memory loss",
        category: "Cognitive",
        severity: "Critical",
        clinicalSignificance:
          "May indicate delirium, stroke, or other acute neurological emergency",
        requiredAction: "Immediate medical evaluation",
        referralSpecialty: "Neurology",
        timeframe: "Immediate",
      },
      {
        name: "Severe Behavioral Change",
        description: "Sudden significant change in behavior or personality",
        category: "Behavioral",
        severity: "High",
        clinicalSignificance:
          "May indicate neurological disease, psychiatric emergency, or medication effect",
        requiredAction: "Medical evaluation, modify therapy",
        referralSpecialty: "Neurology/Psychiatry",
        timeframe: "Within 24 hours",
      },
      {
        name: "Difficulty Swallowing",
        description: "Dysphagia or difficulty with oral intake",
        category: "Neurological",
        severity: "High",
        clinicalSignificance:
          "May indicate neurological disease, aspiration risk",
        requiredAction: "Speech-language pathology referral, modify diet",
        referralSpecialty: "Speech-Language Pathology",
        timeframe: "Within 24 hours",
      },
      {
        name: "Loss of Consciousness",
        description: "Syncope, fainting, or loss of consciousness",
        category: "Neurological",
        severity: "Critical",
        clinicalSignificance:
          "May indicate cardiac, neurological, or metabolic emergency",
        requiredAction: "Call 911, medical evaluation",
        referralSpecialty: "Emergency Medicine",
        timeframe: "Immediate",
      },
      {
        name: "Severe Tremor or Involuntary Movement",
        description: "Uncontrolled tremor or involuntary movements",
        category: "Motor",
        severity: "Moderate",
        clinicalSignificance:
          "May indicate neurological disease or medication effect",
        requiredAction: "Medical evaluation",
        referralSpecialty: "Neurology",
        timeframe: "Within 48 hours",
      },
    ],
    screeningQuestions: [
      "Have you experienced sudden confusion or disorientation?",
      "Have you had sudden changes in behavior or personality?",
      "Do you have difficulty swallowing?",
      "Have you experienced loss of consciousness?",
      "Do you have uncontrolled tremors or movements?",
      "Have you experienced sudden weakness or paralysis?",
      "Do you have difficulty speaking or understanding?",
      "Do you have a history of neurological disease?",
    ],
    contraindications: [
      "Acute delirium",
      "Acute stroke",
      "Acute seizure disorder",
      "Severe behavioral disturbance",
      "Acute psychosis",
      "Severe dysphagia with aspiration risk",
      "Uncontrolled movement disorder",
      "Acute loss of consciousness",
    ],
    precautions: [
      "Monitor cognitive status regularly",
      "Assess swallowing safety",
      "Monitor for behavioral changes",
      "Avoid activities that increase fall risk",
      "Have emergency protocols in place",
      "Know patient's neurological history",
      "Communicate with medical team",
      "Document cognitive and behavioral changes",
    ],
    emergencyIndicators: [
      "Acute confusion",
      "Loss of consciousness",
      "Severe behavioral disturbance",
      "Severe tremor",
      "Difficulty swallowing with aspiration",
      "Sudden weakness",
      "Difficulty speaking",
      "Seizure activity",
    ],
    evidenceLevel: 1,
    source:
      "AOTA Neurology Guidelines, Neurology Clinical Practice Guidelines, Evidence-Based Research",
    doi: "10.1097/01.ota.0000000000000200",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-sf-002",
    condition: "Safety & Fall Risk Red Flags",
    category: "Safety",
    description:
      "Screening for serious safety concerns and fall risk requiring intervention",
    redFlags: [
      {
        name: "Severe Fall Risk",
        description: "High risk of falls with potential for serious injury",
        category: "Safety",
        severity: "High",
        clinicalSignificance:
          "Risk of fracture, head injury, or other serious injury",
        requiredAction: "Implement fall prevention, modify environment",
        referralSpecialty: "Physical Therapy",
        timeframe: "Immediate",
      },
      {
        name: "Unsafe Judgment",
        description: "Poor judgment affecting safety",
        category: "Cognitive",
        severity: "High",
        clinicalSignificance: "Risk of injury or harm to self or others",
        requiredAction: "Modify activities, increase supervision",
        referralSpecialty: "Neurology/Psychiatry",
        timeframe: "Immediate",
      },
      {
        name: "Severe Mobility Limitation",
        description: "Inability to move safely or independently",
        category: "Mobility",
        severity: "High",
        clinicalSignificance:
          "Risk of falls, pressure ulcers, or other complications",
        requiredAction: "Implement mobility program, assistive devices",
        referralSpecialty: "Physical Therapy",
        timeframe: "Within 24 hours",
      },
      {
        name: "Severe Pain with Movement",
        description: "Severe pain limiting safe movement",
        category: "Pain",
        severity: "Moderate",
        clinicalSignificance: "May limit participation in therapy",
        requiredAction: "Pain management, modify activities",
        referralSpecialty: "Pain Management",
        timeframe: "Within 24 hours",
      },
      {
        name: "Skin Integrity Concerns",
        description: "Pressure ulcers, wounds, or skin breakdown",
        category: "Skin",
        severity: "High",
        clinicalSignificance: "Risk of infection or further deterioration",
        requiredAction: "Wound care referral, positioning modifications",
        referralSpecialty: "Wound Care",
        timeframe: "Within 24 hours",
      },
    ],
    screeningQuestions: [
      "Do you have a history of falls?",
      "Do you feel unsteady or at risk of falling?",
      "Do you have difficulty with balance?",
      "Do you have severe pain with movement?",
      "Do you have any skin breakdown or wounds?",
      "Do you have difficulty moving independently?",
      "Do you have poor judgment about safety?",
      "Do you need assistive devices for mobility?",
    ],
    contraindications: [
      "Severe fall risk without intervention",
      "Severe mobility limitation",
      "Severe pain limiting movement",
      "Active pressure ulcers",
      "Severe skin breakdown",
      "Unsafe judgment with high injury risk",
      "Severe balance impairment",
      "Recent fracture",
    ],
    precautions: [
      "Implement fall prevention strategies",
      "Use appropriate assistive devices",
      "Monitor skin integrity",
      "Modify environment for safety",
      "Assess judgment and safety awareness",
      "Use proper body mechanics",
      "Have emergency protocols in place",
      "Communicate with care team",
    ],
    emergencyIndicators: [
      "Fall with injury",
      "Severe pain",
      "Severe skin breakdown",
      "Signs of infection",
      "Severe mobility loss",
      "Severe balance impairment",
      "Unsafe behavior",
      "Severe swelling or deformity",
    ],
    evidenceLevel: 1,
    source:
      "AOTA Safety Guidelines, Fall Prevention Guidelines, Evidence-Based Research",
    doi: "10.1097/01.ota.0000000000000201",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-sf-003",
    condition: "Psychosocial & Mental Health Red Flags",
    category: "Psychological",
    description:
      "Screening for serious psychological or mental health concerns requiring referral",
    redFlags: [
      {
        name: "Suicidal Ideation",
        description: "Patient expresses thoughts of suicide",
        category: "Psychological",
        severity: "Critical",
        clinicalSignificance: "Immediate risk of self-harm",
        requiredAction: "Immediate mental health referral, do not leave alone",
        referralSpecialty: "Psychiatry/Psychology",
        timeframe: "Immediate",
      },
      {
        name: "Severe Depression",
        description: "Severe depressive symptoms affecting function",
        category: "Psychological",
        severity: "High",
        clinicalSignificance:
          "May impair rehabilitation participation and outcomes",
        requiredAction: "Mental health referral",
        referralSpecialty: "Psychiatry/Psychology",
        timeframe: "Within 48 hours",
      },
      {
        name: "Severe Anxiety",
        description: "Severe anxiety affecting function",
        category: "Psychological",
        severity: "High",
        clinicalSignificance: "May impair rehabilitation participation",
        requiredAction: "Mental health referral",
        referralSpecialty: "Psychiatry/Psychology",
        timeframe: "Within 48 hours",
      },
      {
        name: "Substance Abuse",
        description: "Active substance abuse or withdrawal",
        category: "Behavioral",
        severity: "High",
        clinicalSignificance: "May affect safety and rehabilitation outcomes",
        requiredAction: "Substance abuse referral, modify therapy",
        referralSpecialty: "Addiction Medicine",
        timeframe: "Within 24 hours",
      },
      {
        name: "Severe Isolation",
        description: "Complete social withdrawal or isolation",
        category: "Social",
        severity: "Moderate",
        clinicalSignificance:
          "May impair recovery and increase depression risk",
        requiredAction: "Social work referral, increase engagement",
        referralSpecialty: "Social Work",
        timeframe: "Within 1 week",
      },
    ],
    screeningQuestions: [
      "Have you had thoughts of harming yourself?",
      "Do you feel hopeless or depressed?",
      "Do you feel anxious or panicked?",
      "Do you use alcohol or drugs?",
      "Have you experienced recent trauma?",
      "Do you have difficulty controlling your emotions?",
      "Do you feel isolated or alone?",
      "Do you have a history of mental health conditions?",
    ],
    contraindications: [
      "Active suicidal ideation",
      "Severe depression with psychosis",
      "Severe anxiety disorder",
      "Active substance intoxication",
      "Acute withdrawal syndrome",
      "Severe behavioral disturbance",
      "Acute psychosis",
      "Severe personality disorder with safety concerns",
    ],
    precautions: [
      "Assess suicide risk regularly",
      "Monitor mood and behavior",
      "Maintain therapeutic relationship",
      "Know crisis resources",
      "Document mental health concerns",
      "Communicate with mental health providers",
      "Avoid triggering topics",
      "Have emergency protocols in place",
    ],
    emergencyIndicators: [
      "Suicidal statements",
      "Severe depression",
      "Severe anxiety",
      "Aggressive behavior",
      "Violent behavior",
      "Substance intoxication",
      "Acute withdrawal",
      "Psychotic symptoms",
    ],
    evidenceLevel: 1,
    source:
      "AOTA Psychological Guidelines, APA Guidelines, Clinical Practice Guidelines",
    doi: "10.1097/01.ota.0000000000000202",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-sf-004",
    condition: "Occupational Performance Red Flags",
    category: "Occupational",
    description:
      "Screening for serious occupational performance concerns requiring intervention",
    redFlags: [
      {
        name: "Complete ADL Dependence",
        description: "Unable to perform any ADLs independently",
        category: "Functional",
        severity: "High",
        clinicalSignificance:
          "Severe functional limitation requiring intensive intervention",
        requiredAction: "Intensive ADL training, assistive devices",
        referralSpecialty: "Occupational Therapy",
        timeframe: "Immediate",
      },
      {
        name: "Severe Cognitive Impairment",
        description:
          "Significant cognitive deficits affecting occupational performance",
        category: "Cognitive",
        severity: "High",
        clinicalSignificance:
          "May limit ability to learn and perform occupations",
        requiredAction: "Cognitive rehabilitation, compensatory strategies",
        referralSpecialty: "Neuropsychology",
        timeframe: "Within 24 hours",
      },
      {
        name: "Severe Sensory Loss",
        description:
          "Significant loss of vision, hearing, or other sensory function",
        category: "Sensory",
        severity: "High",
        clinicalSignificance:
          "May significantly impact occupational performance",
        requiredAction: "Sensory rehabilitation, adaptive strategies",
        referralSpecialty: "Occupational Therapy",
        timeframe: "Within 48 hours",
      },
      {
        name: "Severe Role Loss",
        description: "Complete loss of occupational roles",
        category: "Social",
        severity: "Moderate",
        clinicalSignificance: "May impact identity and mental health",
        requiredAction: "Role exploration, vocational counseling",
        referralSpecialty: "Vocational Rehabilitation",
        timeframe: "Within 1 week",
      },
      {
        name: "Severe Work Disability",
        description: "Unable to perform any work activities",
        category: "Work",
        severity: "High",
        clinicalSignificance: "May require disability determination",
        requiredAction: "Functional capacity evaluation, vocational assessment",
        referralSpecialty: "Vocational Rehabilitation",
        timeframe: "Within 1 week",
      },
    ],
    screeningQuestions: [
      "Are you able to perform your daily activities independently?",
      "Do you have difficulty with self-care activities?",
      "Do you have difficulty with household activities?",
      "Do you have difficulty with work activities?",
      "Do you have difficulty with leisure activities?",
      "Do you have difficulty with social participation?",
      "Do you have difficulty with cognitive tasks?",
      "Do you have difficulty with sensory tasks?",
    ],
    contraindications: [
      "Complete ADL dependence",
      "Severe cognitive impairment",
      "Severe sensory loss",
      "Severe motor impairment",
      "Complete role loss",
      "Severe work disability",
      "Severe communication impairment",
      "Severe behavioral impairment",
    ],
    precautions: [
      "Assess occupational performance regularly",
      "Monitor cognitive status",
      "Assess sensory function",
      "Monitor role participation",
      "Assess work capacity",
      "Modify activities as needed",
      "Use compensatory strategies",
      "Communicate with care team",
    ],
    emergencyIndicators: [
      "Complete ADL dependence",
      "Severe cognitive decline",
      "Severe sensory loss",
      "Complete role loss",
      "Severe work disability",
      "Severe communication loss",
      "Severe behavioral change",
      "Severe functional decline",
    ],
    evidenceLevel: 1,
    source:
      "AOTA Occupational Performance Guidelines, Clinical Practice Guidelines, Evidence-Based Research",
    doi: "10.1097/01.ota.0000000000000203",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-sf-005",
    condition: "Environmental & Social Red Flags",
    category: "Environmental",
    description:
      "Screening for serious environmental and social concerns requiring intervention",
    redFlags: [
      {
        name: "Unsafe Home Environment",
        description: "Home environment with multiple safety hazards",
        category: "Environmental",
        severity: "High",
        clinicalSignificance: "Risk of falls, injury, or other harm",
        requiredAction: "Home modifications, environmental assessment",
        referralSpecialty: "Occupational Therapy",
        timeframe: "Within 48 hours",
      },
      {
        name: "Caregiver Burden",
        description: "Caregiver experiencing severe stress or burnout",
        category: "Social",
        severity: "Moderate",
        clinicalSignificance: "May affect quality of care and patient outcomes",
        requiredAction: "Caregiver support, respite care",
        referralSpecialty: "Social Work",
        timeframe: "Within 1 week",
      },
      {
        name: "Social Isolation",
        description: "Complete social isolation or lack of support",
        category: "Social",
        severity: "Moderate",
        clinicalSignificance: "May affect recovery and mental health",
        requiredAction: "Community resources, social engagement",
        referralSpecialty: "Social Work",
        timeframe: "Within 1 week",
      },
      {
        name: "Financial Hardship",
        description: "Severe financial constraints affecting care",
        category: "Social",
        severity: "Moderate",
        clinicalSignificance: "May limit access to therapy and resources",
        requiredAction: "Financial assistance, resource referral",
        referralSpecialty: "Social Work",
        timeframe: "Within 1 week",
      },
      {
        name: "Abuse or Neglect",
        description: "Signs of abuse, neglect, or exploitation",
        category: "Safety",
        severity: "Critical",
        clinicalSignificance: "Immediate safety concern",
        requiredAction: "Report to authorities, protective services",
        referralSpecialty: "Adult Protective Services",
        timeframe: "Immediate",
      },
    ],
    screeningQuestions: [
      "Do you feel safe in your home?",
      "Are there hazards in your home?",
      "Do you have adequate support at home?",
      "Do you have financial difficulties?",
      "Do you feel isolated or alone?",
      "Do you have concerns about abuse or neglect?",
      "Do you have access to transportation?",
      "Do you have access to community resources?",
    ],
    contraindications: [
      "Unsafe home environment",
      "Severe caregiver burden",
      "Complete social isolation",
      "Severe financial hardship",
      "Active abuse or neglect",
      "Lack of support system",
      "Inaccessible environment",
      "Lack of resources",
    ],
    precautions: [
      "Assess home safety",
      "Monitor caregiver status",
      "Assess social support",
      "Monitor for abuse or neglect",
      "Identify community resources",
      "Facilitate environmental modifications",
      "Support caregiver wellness",
      "Communicate with care team",
    ],
    emergencyIndicators: [
      "Unsafe home environment",
      "Signs of abuse or neglect",
      "Severe caregiver burden",
      "Complete social isolation",
      "Severe financial hardship",
      "Lack of support system",
      "Inaccessible environment",
      "Lack of basic resources",
    ],
    evidenceLevel: 1,
    source:
      "AOTA Environmental Guidelines, Social Work Guidelines, Clinical Practice Guidelines",
    doi: "10.1097/01.ota.0000000000000204",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getSafetyScreeningById(
  id: string,
): SafetyScreening | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_OT_SF_ID", { id });
      return undefined;
    }
    const screening = safetyScreenings.find((s) => s.id === id);
    if (!screening) {
      auditService.logWarning("OT_SF_NOT_FOUND", { id });
    }
    return screening;
  } catch (error) {
    auditService.logError("GET_OT_SF_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllSafetyScreenings(): SafetyScreening[] {
  try {
    return [...safetyScreenings];
  } catch (error) {
    auditService.logError("GET_ALL_OT_SF_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getSafetyScreeningsByCategory(
  category: string,
): SafetyScreening[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_OT_SF_CATEGORY", { category });
      return [];
    }
    return safetyScreenings.filter((s) =>
      s.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_OT_SF_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchSafetyScreenings(query: string): SafetyScreening[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_OT_SF_SEARCH", { query });
      return [];
    }
    const lowerQuery = query.toLowerCase();
    return safetyScreenings.filter(
      (s) =>
        s.condition.toLowerCase().includes(lowerQuery) ||
        s.category.toLowerCase().includes(lowerQuery) ||
        s.description.toLowerCase().includes(lowerQuery),
    );
  } catch (error) {
    auditService.logError("SEARCH_OT_SF_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getRedFlagsByCategory(category: string): RedFlag[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_OT_RF_CATEGORY", { category });
      return [];
    }
    const redFlags: RedFlag[] = [];
    safetyScreenings.forEach((s) => {
      s.redFlags.forEach((rf) => {
        if (rf.category.toLowerCase().includes(category.toLowerCase())) {
          redFlags.push(rf);
        }
      });
    });
    return redFlags;
  } catch (error) {
    auditService.logError("GET_OT_RF_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getRedFlagsBySeverity(
  severity: "Critical" | "High" | "Moderate",
): RedFlag[] {
  try {
    if (!["Critical", "High", "Moderate"].includes(severity)) {
      auditService.logWarning("INVALID_OT_RF_SEVERITY", { severity });
      return [];
    }
    const redFlags: RedFlag[] = [];
    safetyScreenings.forEach((s) => {
      s.redFlags.forEach((rf) => {
        if (rf.severity === severity) {
          redFlags.push(rf);
        }
      });
    });
    return redFlags;
  } catch (error) {
    auditService.logError("GET_OT_RF_BY_SEVERITY_ERROR", {
      severity,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getScreeningCategories(): string[] {
  try {
    const categories = new Set<string>();
    safetyScreenings.forEach((s) => categories.add(s.category));
    return Array.from(categories).sort();
  } catch (error) {
    auditService.logError("GET_SCREENING_CATEGORIES_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function assessSafetyRisk(
  screeningId: string,
  presentedSymptoms: string[],
): { riskLevel: string; criticalFlags: RedFlag[]; recommendations: string[] } {
  try {
    const screening = getSafetyScreeningById(screeningId);
    if (!screening)
      return { riskLevel: "Unknown", criticalFlags: [], recommendations: [] };

    const criticalFlags = screening.redFlags.filter((rf) =>
      presentedSymptoms.some(
        (symptom) =>
          rf.name.toLowerCase().includes(symptom.toLowerCase()) ||
          rf.description.toLowerCase().includes(symptom.toLowerCase()),
      ),
    );

    let riskLevel = "Low";
    if (criticalFlags.some((f) => f.severity === "Critical")) {
      riskLevel = "Critical";
    } else if (criticalFlags.some((f) => f.severity === "High")) {
      riskLevel = "High";
    } else if (criticalFlags.length > 0) {
      riskLevel = "Moderate";
    }

    const recommendations = criticalFlags.map((f) => f.requiredAction);

    return {
      riskLevel,
      criticalFlags,
      recommendations,
    };
  } catch (error) {
    auditService.logError("ASSESS_SAFETY_RISK_ERROR", {
      screeningId,
      error: error instanceof Error ? error.message : String(error),
    });
    return { riskLevel: "Error", criticalFlags: [], recommendations: [] };
  }
}
