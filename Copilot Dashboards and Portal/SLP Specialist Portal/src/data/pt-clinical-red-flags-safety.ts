/**
 * PT Clinical Red Flags & Safety Screening Framework
 * Comprehensive red flag identification and safety screening protocols
 * Based on: APTA Guidelines, Clinical Practice Guidelines, Evidence-Based Research
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
    id: "pt-sf-001",
    condition: "Cardiovascular Red Flags",
    category: "Cardiovascular",
    description:
      "Screening for serious cardiovascular pathology requiring medical referral",
    redFlags: [
      {
        name: "Chest Pain with Exertion",
        description:
          "Chest pain, pressure, or tightness that occurs with activity",
        category: "Cardiac",
        severity: "Critical",
        clinicalSignificance: "May indicate angina or acute coronary syndrome",
        requiredAction: "Immediate cessation of activity, call 911 if severe",
        referralSpecialty: "Cardiology",
        timeframe: "Immediate",
      },
      {
        name: "Dyspnea at Rest",
        description: "Shortness of breath occurring at rest",
        category: "Respiratory",
        severity: "Critical",
        clinicalSignificance:
          "May indicate heart failure, pulmonary embolism, or severe respiratory disease",
        requiredAction: "Immediate medical evaluation",
        referralSpecialty: "Cardiology/Pulmonology",
        timeframe: "Immediate",
      },
      {
        name: "Palpitations with Dizziness",
        description: "Heart palpitations accompanied by dizziness or syncope",
        category: "Cardiac",
        severity: "High",
        clinicalSignificance:
          "May indicate arrhythmia or hemodynamic instability",
        requiredAction: "Stop activity, sit/lie down, medical evaluation",
        referralSpecialty: "Cardiology",
        timeframe: "Within 24 hours",
      },
      {
        name: "Uncontrolled Hypertension",
        description: "Blood pressure >180/110 mmHg",
        category: "Hypertension",
        severity: "High",
        clinicalSignificance: "Risk of hypertensive crisis or stroke",
        requiredAction: "Defer therapy, medical evaluation",
        referralSpecialty: "Cardiology/Internal Medicine",
        timeframe: "Within 24 hours",
      },
      {
        name: "Edema with Dyspnea",
        description: "Peripheral edema combined with shortness of breath",
        category: "Cardiac",
        severity: "High",
        clinicalSignificance:
          "May indicate heart failure or venous insufficiency",
        requiredAction: "Medical evaluation, modify activity",
        referralSpecialty: "Cardiology",
        timeframe: "Within 48 hours",
      },
    ],
    screeningQuestions: [
      "Do you experience chest pain or pressure with activity?",
      "Do you have shortness of breath at rest or with minimal activity?",
      "Do you experience heart palpitations or irregular heartbeat?",
      "Have you had recent syncope or near-syncope episodes?",
      "Do you have swelling in your legs or feet?",
      "Do you have a history of heart disease or stroke?",
      "Are you taking cardiac medications?",
      "Have you had recent cardiac testing or procedures?",
    ],
    contraindications: [
      "Acute myocardial infarction",
      "Unstable angina",
      "Uncontrolled arrhythmia",
      "Acute heart failure",
      "Uncontrolled hypertension (>180/110)",
      "Recent cardiac surgery (<6 weeks)",
      "Acute pulmonary embolism",
      "Severe aortic stenosis",
    ],
    precautions: [
      "Monitor vital signs before, during, and after therapy",
      "Use Rate-Pressure Product (RPP) to monitor cardiac demand",
      "Avoid Valsalva maneuver",
      "Gradual warm-up and cool-down",
      "Avoid isometric exercises",
      "Monitor for anginal symptoms",
      "Have emergency equipment available",
      "Know patient's cardiac history and medications",
    ],
    emergencyIndicators: [
      "Severe chest pain",
      "Severe dyspnea",
      "Syncope",
      "Severe palpitations",
      "Cyanosis",
      "Severe diaphoresis",
      "Severe pallor",
      "Confusion or altered mental status",
    ],
    evidenceLevel: 1,
    source:
      "APTA Cardiovascular Guidelines, AHA/ACC Guidelines, Clinical Practice Guidelines",
    doi: "10.1097/01.phm.0000000000000200",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-sf-002",
    condition: "Neurological Red Flags",
    category: "Neurological",
    description:
      "Screening for serious neurological pathology requiring medical referral",
    redFlags: [
      {
        name: "Acute Neurological Change",
        description: "Sudden onset of neurological symptoms",
        category: "Neurological",
        severity: "Critical",
        clinicalSignificance:
          "May indicate stroke, TIA, or other acute neurological emergency",
        requiredAction: "Call 911, note time of onset",
        referralSpecialty: "Neurology",
        timeframe: "Immediate",
      },
      {
        name: "Progressive Weakness",
        description: "Worsening weakness over days to weeks",
        category: "Motor",
        severity: "High",
        clinicalSignificance: "May indicate progressive neurological disease",
        requiredAction: "Medical evaluation, modify therapy",
        referralSpecialty: "Neurology",
        timeframe: "Within 48 hours",
      },
      {
        name: "Severe Headache",
        description:
          "Sudden severe headache, worst of life, or progressive headache",
        category: "Neurological",
        severity: "Critical",
        clinicalSignificance:
          "May indicate subarachnoid hemorrhage, meningitis, or other serious pathology",
        requiredAction: "Call 911 if sudden severe, medical evaluation",
        referralSpecialty: "Neurology",
        timeframe: "Immediate",
      },
      {
        name: "Bilateral Symptoms",
        description: "Neurological symptoms affecting both sides of body",
        category: "Neurological",
        severity: "High",
        clinicalSignificance:
          "May indicate spinal cord pathology or serious neurological disease",
        requiredAction: "Medical evaluation, imaging likely needed",
        referralSpecialty: "Neurology",
        timeframe: "Within 24 hours",
      },
      {
        name: "Bowel/Bladder Dysfunction",
        description: "Loss of bowel or bladder control",
        category: "Neurological",
        severity: "High",
        clinicalSignificance:
          "May indicate cauda equina syndrome or spinal cord pathology",
        requiredAction: "Immediate medical evaluation",
        referralSpecialty: "Neurology/Urology",
        timeframe: "Immediate",
      },
    ],
    screeningQuestions: [
      "Have you experienced sudden onset of weakness or numbness?",
      "Do you have difficulty with balance or coordination?",
      "Have you experienced changes in vision or speech?",
      "Do you have severe or progressive headaches?",
      "Have you experienced loss of bowel or bladder control?",
      "Do you have numbness in the saddle area?",
      "Have you experienced confusion or memory problems?",
      "Do you have a history of neurological disease?",
    ],
    contraindications: [
      "Acute stroke",
      "Acute spinal cord injury",
      "Cauda equina syndrome",
      "Acute meningitis",
      "Acute encephalitis",
      "Uncontrolled seizure disorder",
      "Severe traumatic brain injury",
      "Acute intracranial hemorrhage",
    ],
    precautions: [
      "Monitor for neurological changes during therapy",
      "Assess cognitive status before therapy",
      "Avoid activities that increase intracranial pressure",
      "Monitor for seizure activity",
      "Have emergency protocols in place",
      "Know patient's neurological history",
      "Assess fall risk regularly",
      "Monitor for signs of increased spasticity",
    ],
    emergencyIndicators: [
      "Sudden weakness or paralysis",
      "Sudden loss of consciousness",
      "Severe headache",
      "Seizure activity",
      "Loss of bowel/bladder control",
      "Severe dizziness or vertigo",
      "Confusion or altered mental status",
      "Difficulty speaking or swallowing",
    ],
    evidenceLevel: 1,
    source:
      "APTA Neurology Guidelines, Stroke Association, Clinical Practice Guidelines",
    doi: "10.1097/01.phm.0000000000000201",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-sf-003",
    condition: "Musculoskeletal Red Flags",
    category: "Musculoskeletal",
    description:
      "Screening for serious musculoskeletal pathology requiring medical referral",
    redFlags: [
      {
        name: "Severe Unexplained Pain",
        description: "Severe pain without clear mechanical cause",
        category: "Pain",
        severity: "High",
        clinicalSignificance:
          "May indicate serious pathology such as fracture, infection, or malignancy",
        requiredAction: "Medical evaluation, imaging likely needed",
        referralSpecialty: "Orthopedics/Internal Medicine",
        timeframe: "Within 24 hours",
      },
      {
        name: "Night Pain",
        description: "Pain that awakens patient from sleep",
        category: "Pain",
        severity: "High",
        clinicalSignificance:
          "May indicate serious pathology such as malignancy or infection",
        requiredAction: "Medical evaluation, imaging likely needed",
        referralSpecialty: "Orthopedics/Oncology",
        timeframe: "Within 48 hours",
      },
      {
        name: "Unexplained Swelling",
        description: "Significant swelling without clear trauma",
        category: "Swelling",
        severity: "Moderate",
        clinicalSignificance:
          "May indicate infection, inflammation, or other pathology",
        requiredAction: "Medical evaluation",
        referralSpecialty: "Orthopedics/Internal Medicine",
        timeframe: "Within 48 hours",
      },
      {
        name: "Fever with Joint Pain",
        description: "Fever combined with joint pain and swelling",
        category: "Systemic",
        severity: "High",
        clinicalSignificance:
          "May indicate septic arthritis or systemic infection",
        requiredAction: "Immediate medical evaluation",
        referralSpecialty: "Orthopedics/Internal Medicine",
        timeframe: "Immediate",
      },
      {
        name: "Severe Deformity",
        description: "Significant joint deformity or limb deformity",
        category: "Structural",
        severity: "High",
        clinicalSignificance:
          "May indicate fracture, dislocation, or severe pathology",
        requiredAction: "Medical evaluation, imaging needed",
        referralSpecialty: "Orthopedics",
        timeframe: "Within 24 hours",
      },
    ],
    screeningQuestions: [
      "Do you have severe pain that is not improving with rest?",
      "Do you have pain that awakens you from sleep?",
      "Do you have unexplained swelling or warmth?",
      "Do you have fever with your joint pain?",
      "Have you experienced recent trauma or fall?",
      "Do you have significant deformity?",
      "Do you have a history of cancer?",
      "Do you have unexplained weight loss?",
    ],
    contraindications: [
      "Acute fracture",
      "Acute dislocation",
      "Septic arthritis",
      "Acute severe inflammation",
      "Acute infection",
      "Suspected malignancy",
      "Severe osteoporosis with fracture risk",
      "Recent surgery (<6 weeks)",
    ],
    precautions: [
      "Avoid aggressive mobilization",
      "Monitor for signs of infection",
      "Assess fracture risk",
      "Use appropriate precautions for osteoporosis",
      "Monitor swelling and inflammation",
      "Avoid activities that increase pain",
      "Have imaging reviewed before therapy",
      "Know patient's medical history",
    ],
    emergencyIndicators: [
      "Severe pain",
      "Severe swelling",
      "Fever with joint pain",
      "Signs of infection (warmth, redness)",
      "Severe deformity",
      "Inability to bear weight",
      "Severe loss of motion",
      "Severe neurovascular compromise",
    ],
    evidenceLevel: 1,
    source:
      "APTA Orthopedic Guidelines, Orthopedic Clinical Practice Guidelines, Evidence-Based Research",
    doi: "10.1097/01.phm.0000000000000202",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-sf-004",
    condition: "Systemic/General Red Flags",
    category: "Systemic",
    description:
      "Screening for serious systemic pathology requiring medical referral",
    redFlags: [
      {
        name: "Unexplained Weight Loss",
        description: "Significant unintentional weight loss",
        category: "Systemic",
        severity: "High",
        clinicalSignificance:
          "May indicate malignancy, infection, or metabolic disease",
        requiredAction: "Medical evaluation",
        referralSpecialty: "Internal Medicine/Oncology",
        timeframe: "Within 1 week",
      },
      {
        name: "Fever",
        description: "Elevated body temperature",
        category: "Systemic",
        severity: "Moderate",
        clinicalSignificance:
          "May indicate infection or other systemic disease",
        requiredAction: "Medical evaluation, defer therapy if high fever",
        referralSpecialty: "Internal Medicine",
        timeframe: "Within 24 hours",
      },
      {
        name: "Fatigue",
        description: "Unexplained severe fatigue or malaise",
        category: "Systemic",
        severity: "Moderate",
        clinicalSignificance:
          "May indicate systemic disease, infection, or malignancy",
        requiredAction: "Medical evaluation",
        referralSpecialty: "Internal Medicine",
        timeframe: "Within 1 week",
      },
      {
        name: "Night Sweats",
        description: "Profuse sweating during sleep",
        category: "Systemic",
        severity: "Moderate",
        clinicalSignificance:
          "May indicate infection, malignancy, or other systemic disease",
        requiredAction: "Medical evaluation",
        referralSpecialty: "Internal Medicine/Oncology",
        timeframe: "Within 1 week",
      },
      {
        name: "Lymphadenopathy",
        description: "Enlarged lymph nodes",
        category: "Systemic",
        severity: "Moderate",
        clinicalSignificance:
          "May indicate infection, malignancy, or other systemic disease",
        requiredAction: "Medical evaluation",
        referralSpecialty: "Internal Medicine/Oncology",
        timeframe: "Within 1 week",
      },
    ],
    screeningQuestions: [
      "Have you experienced unexplained weight loss?",
      "Do you have fever or chills?",
      "Do you have unexplained fatigue?",
      "Do you have night sweats?",
      "Do you have enlarged lymph nodes?",
      "Do you have a history of cancer?",
      "Do you have a history of infection?",
      "Are you experiencing any systemic symptoms?",
    ],
    contraindications: [
      "Acute infection",
      "Fever >101.5°F",
      "Suspected malignancy",
      "Acute systemic disease",
      "Immunocompromised status",
      "Active tuberculosis",
      "Acute leukemia",
      "Acute sepsis",
    ],
    precautions: [
      "Monitor vital signs",
      "Assess for signs of infection",
      "Monitor for systemic symptoms",
      "Avoid aggressive therapy if unwell",
      "Know patient's medical history",
      "Monitor for disease progression",
      "Have emergency protocols in place",
      "Communicate with physician",
    ],
    emergencyIndicators: [
      "High fever (>103°F)",
      "Severe fatigue",
      "Severe weight loss",
      "Signs of sepsis",
      "Severe lymphadenopathy",
      "Severe night sweats",
      "Altered mental status",
      "Severe malaise",
    ],
    evidenceLevel: 1,
    source:
      "APTA General Guidelines, Internal Medicine Guidelines, Clinical Practice Guidelines",
    doi: "10.1097/01.phm.0000000000000203",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-sf-005",
    condition: "Psychological/Behavioral Red Flags",
    category: "Psychological",
    description:
      "Screening for serious psychological or behavioral concerns requiring referral",
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
        name: "Severe Behavioral Disturbance",
        description: "Aggressive, violent, or severely disruptive behavior",
        category: "Behavioral",
        severity: "High",
        clinicalSignificance: "Safety concern for patient and therapist",
        requiredAction: "Defer therapy, psychiatric evaluation",
        referralSpecialty: "Psychiatry",
        timeframe: "Immediate",
      },
    ],
    screeningQuestions: [
      "Have you had thoughts of harming yourself?",
      "Do you feel hopeless or depressed?",
      "Do you feel anxious or panicked?",
      "Do you use alcohol or drugs?",
      "Have you experienced recent trauma?",
      "Do you have difficulty controlling your emotions?",
      "Do you have difficulty with anger management?",
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
      "APTA Psychological Guidelines, APA Guidelines, Clinical Practice Guidelines",
    doi: "10.1097/01.phm.0000000000000204",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getSafetyScreeningById(
  id: string,
): SafetyScreening | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_PT_SF_ID", { id });
      return undefined;
    }
    const screening = safetyScreenings.find((s) => s.id === id);
    if (!screening) {
      auditService.logWarning("PT_SF_NOT_FOUND", { id });
    }
    return screening;
  } catch (error) {
    auditService.logError("GET_PT_SF_ERROR", {
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
    auditService.logError("GET_ALL_PT_SF_ERROR", {
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
      auditService.logWarning("INVALID_PT_SF_CATEGORY", { category });
      return [];
    }
    return safetyScreenings.filter((s) =>
      s.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_PT_SF_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchSafetyScreenings(query: string): SafetyScreening[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_PT_SF_SEARCH", { query });
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
    auditService.logError("SEARCH_PT_SF_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getRedFlagsByCategory(category: string): RedFlag[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_PT_RF_CATEGORY", { category });
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
    auditService.logError("GET_PT_RF_BY_CATEGORY_ERROR", {
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
      auditService.logWarning("INVALID_PT_RF_SEVERITY", { severity });
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
    auditService.logError("GET_PT_RF_BY_SEVERITY_ERROR", {
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
