/**
 * PT Comorbidity Management - Extended Modules (3-5)
 * Stroke+Diabetes, Arthritis+Osteoporosis, Depression+Chronic Pain
 */

import { ComorbidityModule } from "./pt-comorbidity-management";

export const strokeDiabetesModule: ComorbidityModule = {
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
