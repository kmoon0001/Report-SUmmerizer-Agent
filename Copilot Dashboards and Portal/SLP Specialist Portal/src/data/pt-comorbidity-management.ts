/**
 * PT Comorbidity Management Module
 * Comprehensive management strategies for common PT comorbidity combinations
 * Evidence-based on APTA guidelines and clinical best practices
 */

export interface ComorbidityScenario {
  id: string;
  scenario: string;
  prevalence: string;
  clinicalPresentation: string;
  riskFactors: string[];
}

export interface InteractionPattern {
  condition1: string;
  condition2: string;
  interactionType: string;
  clinicalImpact: string;
  modificationRequired: boolean;
}

export interface AssessmentModification {
  standardAssessment: string;
  modification: string;
  rationale: string;
  priorityOrder: number;
}

export interface InterventionModification {
  standardIntervention: string;
  modification: string;
  rationale: string;
  dosageAdjustment: string;
}

export interface PrioritizationStrategy {
  priority: number;
  condition: string;
  rationale: string;
  timeframe: string;
  expectedOutcome: string;
}

export interface Contraindication {
  intervention: string;
  reason: string;
  severity: "absolute" | "relative";
  alternativeApproach: string;
}

export interface ComorbidityModule {
  id: string;
  title: string;
  conditions: [string, string];
  category: string;
  scenarios: ComorbidityScenario[];
  interactionPatterns: InteractionPattern[];
  assessmentModifications: AssessmentModification[];
  interventionModifications: InterventionModification[];
  prioritizationStrategies: PrioritizationStrategy[];
  contraindications: Contraindication[];
  precautions: string[];
  expectedOutcomes: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  lastUpdated: Date;
}

const diabetesCardiacModule: ComorbidityModule = {
  id: "pt-cm-001",
  title: "Diabetes + Cardiac Comorbidity Management",
  conditions: ["Type 2 Diabetes", "Coronary Artery Disease"],
  category: "Metabolic-Cardiovascular",
  scenarios: [
    {
      id: "dc-s-001",
      scenario: "Post-MI patient with poorly controlled diabetes",
      prevalence: "35-40% of MI patients have diabetes",
      clinicalPresentation:
        "Reduced exercise tolerance, autonomic dysfunction, delayed wound healing",
      riskFactors: [
        "HbA1c >8%",
        "Ejection fraction <40%",
        "Neuropathy present",
      ],
    },
    {
      id: "dc-s-002",
      scenario: "Diabetic with silent ischemia and cardiac arrhythmias",
      prevalence: "25% of diabetics have silent ischemia",
      clinicalPresentation:
        "Absence of chest pain during exertion, irregular heart rate, fatigue",
      riskFactors: ["Autonomic neuropathy", "Duration >10 years", "Age >60"],
    },
    {
      id: "dc-s-003",
      scenario: "Diabetic cardiomyopathy with reduced ejection fraction",
      prevalence: "5-10% of diabetics develop cardiomyopathy",
      clinicalPresentation:
        "Dyspnea on exertion, orthopnea, peripheral edema, fatigue",
      riskFactors: ["Poor glycemic control", "Hypertension", "Obesity"],
    },
    {
      id: "dc-s-004",
      scenario: "Post-cardiac event with diabetic complications",
      prevalence: "40% of cardiac patients have diabetes",
      clinicalPresentation:
        "Impaired wound healing, infection risk, delayed recovery",
      riskFactors: [
        "Elevated glucose",
        "Immunosuppression",
        "Vascular compromise",
      ],
    },
    {
      id: "dc-s-005",
      scenario: "Diabetic with heart failure and metabolic syndrome",
      prevalence: "50% of HF patients have diabetes",
      clinicalPresentation:
        "Severe deconditioning, fluid retention, exercise intolerance",
      riskFactors: [
        "BMI >30",
        "Sedentary lifestyle",
        "Medication side effects",
      ],
    },
  ],
  interactionPatterns: [
    {
      condition1: "Diabetes",
      condition2: "Cardiac Disease",
      interactionType: "Metabolic-Hemodynamic",
      clinicalImpact:
        "Reduced cardiac output impairs glucose delivery and utilization",
      modificationRequired: true,
    },
    {
      condition1: "Autonomic Neuropathy",
      condition2: "Arrhythmias",
      interactionType: "Neurological-Electrical",
      clinicalImpact:
        "Impaired heart rate response to exercise, increased arrhythmia risk",
      modificationRequired: true,
    },
    {
      condition1: "Hyperglycemia",
      condition2: "Myocardial Ischemia",
      interactionType: "Metabolic-Ischemic",
      clinicalImpact:
        "Increased oxidative stress, impaired myocardial recovery",
      modificationRequired: true,
    },
    {
      condition1: "Diabetic Neuropathy",
      condition2: "Reduced Ejection Fraction",
      interactionType: "Neurological-Cardiac",
      clinicalImpact:
        "Loss of proprioceptive feedback with reduced cardiac reserve",
      modificationRequired: true,
    },
    {
      condition1: "Insulin Resistance",
      condition2: "Hypertension",
      interactionType: "Metabolic-Vascular",
      clinicalImpact: "Increased afterload, reduced exercise tolerance",
      modificationRequired: true,
    },
  ],
  assessmentModifications: [
    {
      standardAssessment: "Graded Exercise Test",
      modification:
        "Use modified Bruce protocol with continuous glucose monitoring",
      rationale:
        "Diabetics have altered HR response; glucose monitoring prevents hypoglycemia",
      priorityOrder: 1,
    },
    {
      standardAssessment: "Functional Capacity Evaluation",
      modification:
        "Include frequent rest periods; monitor for silent ischemia signs",
      rationale:
        "Reduced exercise tolerance and absent anginal symptoms require modified approach",
      priorityOrder: 2,
    },
    {
      standardAssessment: "Cardiovascular Assessment",
      modification: "Add autonomic function testing (Valsalva, deep breathing)",
      rationale:
        "Autonomic neuropathy affects HR variability and exercise response",
      priorityOrder: 1,
    },
    {
      standardAssessment: "Wound Assessment",
      modification:
        "Assess for diabetic foot complications; check vascular status",
      rationale: "Diabetes impairs healing; cardiac disease reduces perfusion",
      priorityOrder: 2,
    },
    {
      standardAssessment: "Balance and Proprioception",
      modification: "Use seated balance tests initially; progress cautiously",
      rationale:
        "Neuropathy combined with cardiac limitations requires modified progression",
      priorityOrder: 3,
    },
  ],
  interventionModifications: [
    {
      standardIntervention: "Aerobic exercise training",
      modification: "Start at 40-50% HRR; use RPE scale instead of HR targets",
      rationale:
        "Autonomic dysfunction makes HR unreliable; RPE safer for diabetics",
      dosageAdjustment: "3x/week, 20-30 min, low intensity initially",
    },
    {
      standardIntervention: "Resistance training",
      modification: "Use lighter weights (50-60% 1RM); higher repetitions",
      rationale: "Reduces cardiac demand; improves insulin sensitivity",
      dosageAdjustment: "2x/week, 12-15 reps, 2-3 sets",
    },
    {
      standardIntervention: "Flexibility training",
      modification: "Avoid Valsalva maneuver; use gentle, sustained stretches",
      rationale: "Valsalva increases cardiac workload; gentle stretching safer",
      dosageAdjustment: "Daily, 5-10 min, hold 20-30 sec",
    },
    {
      standardIntervention: "Functional training",
      modification: "Emphasize ADL simulation with frequent monitoring",
      rationale:
        "Functional gains more meaningful; allows real-time symptom monitoring",
      dosageAdjustment: "3-4x/week, 30-45 min sessions",
    },
    {
      standardIntervention: "Gait training",
      modification:
        "Address neuropathic gait changes; use assistive device if needed",
      rationale:
        "Neuropathy alters proprioceptive feedback; fall risk increased",
      dosageAdjustment: "3-4x/week, 15-20 min",
    },
  ],
  prioritizationStrategies: [
    {
      priority: 1,
      condition: "Cardiac stability",
      rationale: "Life-threatening; must be optimized before intensive PT",
      timeframe: "Weeks 1-2",
      expectedOutcome: "Stable vital signs, no arrhythmias during activity",
    },
    {
      priority: 2,
      condition: "Glycemic control",
      rationale: "Affects healing, infection risk, and exercise response",
      timeframe: "Weeks 1-4",
      expectedOutcome:
        "HbA1c trending toward <7%; stable glucose during exercise",
    },
    {
      priority: 3,
      condition: "Functional mobility",
      rationale: "Enables ADL independence and exercise participation",
      timeframe: "Weeks 2-8",
      expectedOutcome: "Independent ambulation, stair negotiation",
    },
    {
      priority: 4,
      condition: "Cardiovascular conditioning",
      rationale: "Improves exercise tolerance and metabolic function",
      timeframe: "Weeks 4-12",
      expectedOutcome: "Increased exercise duration, improved VO2 max",
    },
    {
      priority: 5,
      condition: "Strength and endurance",
      rationale: "Supports long-term functional independence",
      timeframe: "Weeks 8-16",
      expectedOutcome: "Improved muscle strength, sustained activity tolerance",
    },
  ],
  contraindications: [
    {
      intervention: "High-intensity interval training",
      reason: "Increases cardiac demand; risk of arrhythmias and ischemia",
      severity: "absolute",
      alternativeApproach:
        "Moderate-intensity continuous training with gradual progression",
    },
    {
      intervention: "Isometric exercises",
      reason: "Increases blood pressure and cardiac workload",
      severity: "absolute",
      alternativeApproach:
        "Dynamic resistance training with controlled movements",
    },
    {
      intervention: "Valsalva maneuver",
      reason:
        "Increases intrathoracic pressure; dangerous with cardiac disease",
      severity: "absolute",
      alternativeApproach: "Continuous breathing during all exercises",
    },
    {
      intervention: "Rapid position changes",
      reason: "Autonomic dysfunction impairs orthostatic response",
      severity: "relative",
      alternativeApproach: "Slow, controlled transitions with monitoring",
    },
    {
      intervention: "Prolonged static standing",
      reason: "Reduced cardiac output; orthostatic intolerance",
      severity: "relative",
      alternativeApproach:
        "Frequent position changes; seated or recumbent exercises",
    },
  ],
  precautions: [
    "Monitor blood glucose before, during, and after exercise",
    "Watch for signs of hypoglycemia (tremor, confusion, sweating)",
    "Monitor for silent ischemia (fatigue, dyspnea without chest pain)",
    "Check for diabetic foot complications before weight-bearing activities",
    "Assess autonomic function; use RPE instead of HR targets",
    "Avoid exercise during peak insulin action",
    "Ensure adequate hydration; diabetes increases dehydration risk",
    "Monitor for arrhythmias; have emergency protocol in place",
    "Educate on medication timing relative to exercise",
    "Screen for diabetic retinopathy; avoid Valsalva and head-down positions",
  ],
  expectedOutcomes: [
    "Improved cardiovascular fitness without cardiac events",
    "Better glycemic control (HbA1c reduction of 0.5-1%)",
    "Increased functional capacity (6MWT distance +50-100m)",
    "Reduced medication requirements",
    "Improved quality of life and exercise tolerance",
    "Prevention of further cardiac events",
    "Enhanced wound healing and reduced infection risk",
    "Improved balance and reduced fall risk",
    "Better medication adherence and self-management",
    "Return to meaningful activities and work",
  ],
  evidenceLevel: 1,
  source:
    "APTA Diabetes and Cardiovascular Disease Guidelines; ADA Exercise Standards",
  lastUpdated: new Date("2024-01-15"),
};

const copdCardiacModule: ComorbidityModule = {
  id: "pt-cm-002",
  title: "COPD + Cardiac Comorbidity Management",
  conditions: ["COPD", "Heart Failure"],
  category: "Pulmonary-Cardiovascular",
  scenarios: [
    {
      id: "cc-s-001",
      scenario: "COPD patient with cor pulmonale and right heart failure",
      prevalence: "20-30% of COPD patients develop cor pulmonale",
      clinicalPresentation:
        "Severe dyspnea, peripheral edema, elevated JVP, reduced exercise tolerance",
      riskFactors: ["FEV1 <30%", "Chronic hypoxemia", "Pulmonary hypertension"],
    },
    {
      id: "cc-s-002",
      scenario: "Acute exacerbation of COPD with cardiac decompensation",
      prevalence: "40% of COPD exacerbations have cardiac component",
      clinicalPresentation:
        "Acute dyspnea, orthopnea, wheezing, chest tightness",
      riskFactors: ["Infection", "Medication non-compliance", "Fluid overload"],
    },
    {
      id: "cc-s-003",
      scenario: "COPD with left ventricular dysfunction",
      prevalence: "15-25% of COPD patients have LV dysfunction",
      clinicalPresentation:
        "Dyspnea on exertion, fatigue, reduced exercise capacity",
      riskFactors: ["Smoking history", "Hypertension", "Age >65"],
    },
    {
      id: "cc-s-004",
      scenario: "Post-hospitalization COPD and cardiac patient",
      prevalence: "50% of hospitalizations involve both conditions",
      clinicalPresentation:
        "Severe deconditioning, anxiety, reduced confidence",
      riskFactors: [
        "ICU admission",
        "Mechanical ventilation",
        "Prolonged bed rest",
      ],
    },
    {
      id: "cc-s-005",
      scenario: "COPD with atrial fibrillation and heart failure",
      prevalence: "10-15% of COPD patients develop AFib",
      clinicalPresentation:
        "Irregular heart rate, palpitations, increased dyspnea",
      riskFactors: ["Chronic hypoxemia", "Pulmonary hypertension", "Age >70"],
    },
  ],
  interactionPatterns: [
    {
      condition1: "COPD",
      condition2: "Heart Failure",
      interactionType: "Pulmonary-Cardiac",
      clinicalImpact: "Reduced oxygen delivery and increased cardiac workload",
      modificationRequired: true,
    },
    {
      condition1: "Pulmonary Hypertension",
      condition2: "Right Heart Failure",
      interactionType: "Hemodynamic",
      clinicalImpact: "Severe exercise intolerance and syncope risk",
      modificationRequired: true,
    },
    {
      condition1: "Chronic Hypoxemia",
      condition2: "Arrhythmias",
      interactionType: "Metabolic-Electrical",
      clinicalImpact: "Increased arrhythmia risk during exertion",
      modificationRequired: true,
    },
    {
      condition1: "Air Trapping",
      condition2: "Reduced Cardiac Output",
      interactionType: "Mechanical-Hemodynamic",
      clinicalImpact: "Increased intrathoracic pressure impairs venous return",
      modificationRequired: true,
    },
    {
      condition1: "Systemic Inflammation",
      condition2: "Cardiac Remodeling",
      interactionType: "Inflammatory",
      clinicalImpact: "Accelerated cardiac dysfunction and disease progression",
      modificationRequired: true,
    },
  ],
  assessmentModifications: [
    {
      standardAssessment: "Graded Exercise Test",
      modification:
        "Use modified protocol; stop at dyspnea or desaturation <88%",
      rationale:
        "Dual pathology requires conservative approach; hypoxemia is limiting factor",
      priorityOrder: 1,
    },
    {
      standardAssessment: "Pulmonary Function Testing",
      modification:
        "Include oximetry; assess desaturation pattern during activity",
      rationale: "Oxygen saturation response predicts exercise tolerance",
      priorityOrder: 1,
    },
    {
      standardAssessment: "Cardiac Assessment",
      modification: "Monitor for arrhythmias; assess for cor pulmonale signs",
      rationale: "Pulmonary hypertension affects cardiac function assessment",
      priorityOrder: 1,
    },
    {
      standardAssessment: "Functional Capacity Evaluation",
      modification: "Use 6MWT with continuous pulse oximetry",
      rationale: "Desaturation during walking predicts functional limitations",
      priorityOrder: 2,
    },
    {
      standardAssessment: "Dyspnea Assessment",
      modification: "Use modified Borg scale; assess dyspnea pattern",
      rationale:
        "Dyspnea is primary limiting factor; pattern indicates pathology",
      priorityOrder: 2,
    },
  ],
  interventionModifications: [
    {
      standardIntervention: "Aerobic exercise training",
      modification: "Use pursed-lip breathing; monitor oxygen saturation",
      rationale:
        "Pursed-lip breathing reduces air trapping; O2 monitoring prevents hypoxemia",
      dosageAdjustment:
        "3x/week, 20-30 min, low intensity with frequent breaks",
    },
    {
      standardIntervention: "Resistance training",
      modification: "Use light weights; avoid Valsalva; emphasize breathing",
      rationale: "Reduces cardiac demand; prevents air trapping",
      dosageAdjustment: "2x/week, 10-12 reps, 2 sets",
    },
    {
      standardIntervention: "Breathing exercises",
      modification: "Teach pursed-lip and diaphragmatic breathing",
      rationale: "Improves ventilation efficiency and reduces dyspnea",
      dosageAdjustment: "Daily, 10-15 min, multiple sessions",
    },
    {
      standardIntervention: "Functional training",
      modification: "Emphasize energy conservation techniques",
      rationale: "Reduces oxygen demand for ADLs",
      dosageAdjustment: "3-4x/week, 30-45 min",
    },
    {
      standardIntervention: "Positioning and postural drainage",
      modification: "Use semi-recumbent position; avoid supine if possible",
      rationale: "Improves ventilation; reduces cardiac workload",
      dosageAdjustment: "As needed, 15-20 min sessions",
    },
  ],
  prioritizationStrategies: [
    {
      priority: 1,
      condition: "Oxygen saturation stability",
      rationale: "Hypoxemia is life-threatening; must maintain SpO2 >88%",
      timeframe: "Ongoing",
      expectedOutcome: "SpO2 maintained >88% during all activities",
    },
    {
      priority: 2,
      condition: "Cardiac stability",
      rationale: "Arrhythmias and decompensation risk with exertion",
      timeframe: "Weeks 1-2",
      expectedOutcome: "Stable heart rate and rhythm during activity",
    },
    {
      priority: 3,
      condition: "Dyspnea management",
      rationale: "Primary limiting factor for function",
      timeframe: "Weeks 1-4",
      expectedOutcome:
        "Reduced dyspnea with activity; improved breathing control",
    },
    {
      priority: 4,
      condition: "Functional mobility",
      rationale: "Enables ADL independence",
      timeframe: "Weeks 2-8",
      expectedOutcome: "Independent ambulation with minimal dyspnea",
    },
    {
      priority: 5,
      condition: "Exercise tolerance",
      rationale: "Improves quality of life and prevents deconditioning",
      timeframe: "Weeks 4-12",
      expectedOutcome: "Increased 6MWT distance; improved endurance",
    },
  ],
  contraindications: [
    {
      intervention: "High-intensity exercise",
      reason:
        "Increases oxygen demand; risk of severe hypoxemia and arrhythmias",
      severity: "absolute",
      alternativeApproach: "Low-to-moderate intensity with frequent monitoring",
    },
    {
      intervention: "Supine positioning",
      reason: "Increases dyspnea; impairs ventilation",
      severity: "relative",
      alternativeApproach: "Semi-recumbent or upright positioning",
    },
    {
      intervention: "Valsalva maneuver",
      reason: "Increases intrathoracic pressure; worsens air trapping",
      severity: "absolute",
      alternativeApproach: "Continuous breathing during all exercises",
    },
    {
      intervention: "Prolonged static activity",
      reason: "Increases dyspnea and cardiac workload",
      severity: "relative",
      alternativeApproach: "Frequent position changes and activity breaks",
    },
    {
      intervention: "Exercises without oxygen monitoring",
      reason: "Cannot detect dangerous desaturation",
      severity: "absolute",
      alternativeApproach: "Continuous pulse oximetry during all exercise",
    },
  ],
  precautions: [
    "Monitor oxygen saturation continuously; stop if SpO2 <88%",
    "Watch for signs of acute exacerbation (increased sputum, color change)",
    "Monitor for arrhythmias; have emergency protocol in place",
    "Assess for cor pulmonale signs (peripheral edema, JVP elevation)",
    "Teach pursed-lip breathing before exercise",
    "Ensure adequate rest between activities",
    "Monitor for anxiety; use relaxation techniques",
    "Assess medication timing; coordinate with PT sessions",
    "Screen for depression; common in COPD-cardiac patients",
    "Educate on activity pacing and energy conservation",
  ],
  expectedOutcomes: [
    "Improved exercise tolerance without desaturation",
    "Reduced dyspnea during ADLs",
    "Improved oxygen saturation maintenance",
    "Reduced exacerbation frequency",
    "Improved functional capacity (6MWT +50-75m)",
    "Better breathing control and reduced anxiety",
    "Improved quality of life",
    "Reduced hospitalizations",
    "Enhanced independence in ADLs",
    "Better medication adherence",
  ],
  evidenceLevel: 1,
  source: "APTA Pulmonary and Cardiovascular Guidelines; GOLD COPD Standards",
  lastUpdated: new Date("2024-01-15"),
};
const strokeDiabetesModule: ComorbidityModule = {
  id: "pt-cm-003",
  title: "Stroke + Diabetes Comorbidity Management",
  conditions: ["Acute Ischemic Stroke", "Type 2 Diabetes"],
  category: "Neurological-Metabolic",
  scenarios: [
    {
      id: "sd-s-001",
      scenario: "Acute stroke with hyperglycemia and impaired recovery",
      prevalence: "30-40% of stroke patients have diabetes",
      clinicalPresentation:
        "Hemiparesis, aphasia, impaired cognition, elevated glucose",
      riskFactors: [
        "Glucose >180 mg/dL",
        "Large infarct volume",
        "Cortical involvement",
      ],
    },
    {
      id: "sd-s-002",
      scenario: "Diabetic stroke with neuropathic complications",
      prevalence: "25% of diabetic strokes have pre-existing neuropathy",
      clinicalPresentation:
        "Motor deficits, sensory loss, impaired proprioception",
      riskFactors: [
        "Duration >10 years",
        "Poor glycemic control",
        "Peripheral neuropathy",
      ],
    },
    {
      id: "sd-s-003",
      scenario: "Stroke with diabetic retinopathy limiting visual feedback",
      prevalence: "15-20% of diabetic stroke patients have retinopathy",
      clinicalPresentation:
        "Visual field defects, impaired balance, reduced spatial awareness",
      riskFactors: ["Proliferative retinopathy", "Macular edema", "Age >60"],
    },
    {
      id: "sd-s-004",
      scenario: "Post-stroke with diabetic foot complications",
      prevalence: "20% of diabetic stroke patients have foot ulcers",
      clinicalPresentation:
        "Hemiparesis with impaired weight-bearing, foot ulcer risk",
      riskFactors: ["Neuropathy", "Vascular disease", "Poor hygiene"],
    },
    {
      id: "sd-s-005",
      scenario: "Recurrent stroke risk in poorly controlled diabetic",
      prevalence: "30% of diabetics have recurrent stroke within 5 years",
      clinicalPresentation:
        "Multiple infarcts, progressive disability, cognitive decline",
      riskFactors: ["HbA1c >8%", "Hypertension", "Atrial fibrillation"],
    },
  ],
  interactionPatterns: [
    {
      condition1: "Hyperglycemia",
      condition2: "Cerebral Ischemia",
      interactionType: "Metabolic-Neurological",
      clinicalImpact:
        "Worsens ischemic injury; impairs neuroplasticity and recovery",
      modificationRequired: true,
    },
    {
      condition1: "Diabetic Neuropathy",
      condition2: "Hemiparesis",
      interactionType: "Neurological",
      clinicalImpact: "Compounded sensory loss; increased fall and injury risk",
      modificationRequired: true,
    },
    {
      condition1: "Diabetic Retinopathy",
      condition2: "Hemianopia",
      interactionType: "Visual",
      clinicalImpact:
        "Severe visual impairment; impairs balance and spatial awareness",
      modificationRequired: true,
    },
    {
      condition1: "Vascular Disease",
      condition2: "Stroke",
      interactionType: "Vascular",
      clinicalImpact:
        "Increased recurrent stroke risk; impaired collateral circulation",
      modificationRequired: true,
    },
    {
      condition1: "Autonomic Dysfunction",
      condition2: "Orthostatic Intolerance",
      interactionType: "Neurological-Hemodynamic",
      clinicalImpact:
        "Syncope risk during rehabilitation; limits exercise intensity",
      modificationRequired: true,
    },
  ],
  assessmentModifications: [
    {
      standardAssessment: "Neurological Examination",
      modification: "Include glucose monitoring; assess for silent ischemia",
      rationale:
        "Hyperglycemia worsens outcomes; autonomic dysfunction masks symptoms",
      priorityOrder: 1,
    },
    {
      standardAssessment: "Balance and Gait Assessment",
      modification: "Use seated tests initially; assess proprioceptive loss",
      rationale: "Neuropathy compounds stroke-related balance deficits",
      priorityOrder: 1,
    },
    {
      standardAssessment: "Visual Assessment",
      modification: "Screen for retinopathy and hemianopia; modify environment",
      rationale: "Combined visual deficits severely impair spatial awareness",
      priorityOrder: 2,
    },
    {
      standardAssessment: "Functional Mobility",
      modification:
        "Assess weight-bearing tolerance; check for foot complications",
      rationale: "Diabetic foot disease limits weight-bearing rehabilitation",
      priorityOrder: 2,
    },
    {
      standardAssessment: "Cognitive Assessment",
      modification: "Include glucose and medication effects on cognition",
      rationale: "Hyperglycemia and medications impair cognitive recovery",
      priorityOrder: 2,
    },
  ],
  interventionModifications: [
    {
      standardIntervention: "Motor recovery training",
      modification: "Use task-specific training; frequent glucose monitoring",
      rationale:
        "Hyperglycemia impairs neuroplasticity; frequent breaks prevent hypoglycemia",
      dosageAdjustment: "5-6x/week, 45-60 min, with 10-min breaks",
    },
    {
      standardIntervention: "Balance training",
      modification:
        "Start seated; progress cautiously; address proprioceptive loss",
      rationale: "Neuropathy compounds balance deficits; fall risk high",
      dosageAdjustment: "4-5x/week, 20-30 min",
    },
    {
      standardIntervention: "Gait training",
      modification:
        "Address neuropathic gait; use assistive device; check feet",
      rationale:
        "Neuropathy alters gait mechanics; foot complications limit weight-bearing",
      dosageAdjustment: "4-5x/week, 20-30 min",
    },
    {
      standardIntervention: "Strength training",
      modification: "Use light resistance; emphasize affected side",
      rationale: "Improves motor recovery; reduces secondary complications",
      dosageAdjustment: "3-4x/week, 20-30 min",
    },
    {
      standardIntervention: "Functional training",
      modification: "Emphasize ADL retraining; address visual deficits",
      rationale:
        "Functional gains most meaningful; visual modifications essential",
      dosageAdjustment: "4-5x/week, 30-45 min",
    },
  ],
  prioritizationStrategies: [
    {
      priority: 1,
      condition: "Glycemic control",
      rationale: "Hyperglycemia worsens ischemic injury and impairs recovery",
      timeframe: "Weeks 1-2",
      expectedOutcome: "Glucose <180 mg/dL; stable glucose during therapy",
    },
    {
      priority: 2,
      condition: "Neurological stability",
      rationale: "Prevent further deterioration; optimize recovery environment",
      timeframe: "Weeks 1-4",
      expectedOutcome: "Stable neurological status; no further deficits",
    },
    {
      priority: 3,
      condition: "Motor recovery",
      rationale:
        "Critical window for neuroplasticity; intensive therapy needed",
      timeframe: "Weeks 2-12",
      expectedOutcome: "Improved motor control; reduced impairment",
    },
    {
      priority: 4,
      condition: "Functional independence",
      rationale: "Enables ADL participation and community reintegration",
      timeframe: "Weeks 4-16",
      expectedOutcome: "Independent ADLs; safe community ambulation",
    },
    {
      priority: 5,
      condition: "Secondary prevention",
      rationale: "Reduce recurrent stroke risk through lifestyle modification",
      timeframe: "Weeks 8-ongoing",
      expectedOutcome: "Improved cardiovascular fitness; reduced stroke risk",
    },
  ],
  contraindications: [
    {
      intervention: "Intense exercise during hyperglycemia",
      reason: "Worsens ischemic injury; impairs recovery",
      severity: "absolute",
      alternativeApproach:
        "Optimize glucose control first; then progress exercise",
    },
    {
      intervention: "Valsalva maneuver",
      reason: "Increases intracranial pressure; risk of recurrent stroke",
      severity: "absolute",
      alternativeApproach: "Continuous breathing during all exercises",
    },
    {
      intervention: "Rapid position changes",
      reason: "Autonomic dysfunction; orthostatic intolerance; syncope risk",
      severity: "relative",
      alternativeApproach: "Slow, controlled transitions with monitoring",
    },
    {
      intervention: "Weight-bearing with foot complications",
      reason: "Risk of ulcer formation and infection",
      severity: "absolute",
      alternativeApproach: "Non-weight-bearing exercises until foot healed",
    },
    {
      intervention: "Exercises without visual accommodation",
      reason: "Retinopathy and hemianopia increase fall risk",
      severity: "relative",
      alternativeApproach: "Modify environment; use verbal cues; ensure safety",
    },
  ],
  precautions: [
    "Monitor blood glucose before, during, and after therapy",
    "Watch for signs of hypoglycemia (tremor, confusion, sweating)",
    "Assess for diabetic foot complications; check skin integrity",
    "Screen for diabetic retinopathy; modify visual environment",
    "Monitor for signs of recurrent stroke (facial droop, arm weakness, speech changes)",
    "Assess autonomic function; use RPE instead of HR targets",
    "Educate on medication timing relative to therapy",
    "Monitor for depression; common post-stroke and in diabetes",
    "Ensure adequate hydration; diabetes increases dehydration risk",
    "Coordinate with medical team on glucose management during intensive therapy",
  ],
  expectedOutcomes: [
    "Improved motor recovery without complications",
    "Better glycemic control (HbA1c reduction of 0.5-1%)",
    "Increased functional independence (FIM score improvement)",
    "Improved balance and reduced fall risk",
    "Enhanced gait quality and walking distance",
    "Reduced pain and improved comfort",
    "Better medication adherence",
    "Reduced recurrent stroke risk",
    "Improved quality of life and community participation",
    "Return to meaningful activities",
  ],
  evidenceLevel: 1,
  source: "APTA Stroke Guidelines; ADA Diabetes and Stroke Standards",
  lastUpdated: new Date("2024-01-15"),
};

export const ptComorbidityModules: ComorbidityModule[] = [
  diabetesCardiacModule,
  copdCardiacModule,
  strokeDiabetesModule,
];

export function getComorbidityModuleById(
  id: string,
): ComorbidityModule | undefined {
  return ptComorbidityModules.find((m) => m.id === id);
}

export function getAllComorbidityModules(): ComorbidityModule[] {
  return ptComorbidityModules;
}

export function getModulesByCategory(category: string): ComorbidityModule[] {
  return ptComorbidityModules.filter((m) => m.category === category);
}

export function searchModules(query: string): ComorbidityModule[] {
  try {
    if (!query || typeof query !== "string") {
      return [];
    }
    const lowerQuery = query.toLowerCase();
    return ptComorbidityModules.filter(
      (m) =>
        m.title.toLowerCase().includes(lowerQuery) ||
        m.conditions.some((c) => c.toLowerCase().includes(lowerQuery)) ||
        m.category.toLowerCase().includes(lowerQuery),
    );
  } catch (error) {
    return [];
  }
}

export function getModulesByEvidenceLevel(
  level: 1 | 2 | 3,
): ComorbidityModule[] {
  return ptComorbidityModules.filter((m) => m.evidenceLevel === level);
}

export function getScenarios(moduleId: string): ComorbidityScenario[] {
  const module = getComorbidityModuleById(moduleId);
  return module?.scenarios || [];
}

export function getInteractionPatterns(moduleId: string): InteractionPattern[] {
  const module = getComorbidityModuleById(moduleId);
  return module?.interactionPatterns || [];
}

export function getAssessmentModifications(
  moduleId: string,
): AssessmentModification[] {
  const module = getComorbidityModuleById(moduleId);
  return module?.assessmentModifications || [];
}

export function getInterventionModifications(
  moduleId: string,
): InterventionModification[] {
  const module = getComorbidityModuleById(moduleId);
  return module?.interventionModifications || [];
}

export function getPrioritizationStrategies(
  moduleId: string,
): PrioritizationStrategy[] {
  const module = getComorbidityModuleById(moduleId);
  return module?.prioritizationStrategies || [];
}

export function getContraindications(moduleId: string): Contraindication[] {
  const module = getComorbidityModuleById(moduleId);
  return module?.contraindications || [];
}

export function getPrecautions(moduleId: string): string[] {
  const module = getComorbidityModuleById(moduleId);
  return module?.precautions || [];
}

export function getExpectedOutcomes(moduleId: string): string[] {
  const module = getComorbidityModuleById(moduleId);
  return module?.expectedOutcomes || [];
}

export function getCategories(): string[] {
  const categories = new Set(ptComorbidityModules.map((m) => m.category));
  return Array.from(categories).sort();
}
