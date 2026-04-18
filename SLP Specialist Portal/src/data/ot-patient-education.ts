/**
 * OT Module 9: Patient Education
 * Comprehensive patient education materials for occupational therapy
 * Evidence-based from AOTA and clinical best practices
 */

export interface OTPatientEducation {
  id: string;
  title: string;
  topic: string;
  category: string;
  description: string;
  targetAudience: string;
  keyPoints: string[];
  homeExercises: {
    name: string;
    description: string;
    frequency: string;
    duration: string;
  }[];
  precautions: string[];
  whenToContact: string[];
  resources: string[];
  readingLevel: string;
  estimatedReadTime: string;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const otPatientEducationData: OTPatientEducation[] = [
  {
    id: "ot-edu-001",
    title: "Understanding Hand Therapy",
    topic: "Hand Therapy",
    category: "hand-therapy",
    description: "Education about hand therapy, recovery, and rehabilitation",
    targetAudience: "Patients with hand injury or surgery",
    keyPoints: [
      "Hand therapy is essential for recovery",
      "Early intervention improves outcomes",
      "Consistent exercise is important",
      "Swelling management is critical",
      "Recovery takes time and patience",
    ],
    homeExercises: [
      {
        name: "Finger Flexion Exercises",
        description: "Gently bend fingers and hold for 5 seconds",
        frequency: "3-4 times daily",
        duration: "10-15 repetitions",
      },
      {
        name: "Grip Strengthening",
        description: "Squeeze therapy putty or ball gently",
        frequency: "2-3 times daily",
        duration: "10-15 repetitions",
      },
      {
        name: "Swelling Management",
        description: "Elevate hand and apply ice as directed",
        frequency: "Multiple times daily",
        duration: "15-20 minutes",
      },
    ],
    precautions: [
      "Follow weight-bearing restrictions",
      "Avoid excessive swelling",
      "Monitor for infection signs",
      "Protect healing tissues",
      "Avoid re-injury",
    ],
    whenToContact: [
      "Increased pain or swelling",
      "Signs of infection",
      "Unable to move fingers",
      "Numbness or tingling",
      "Fever develops",
    ],
    resources: [
      "Hand Therapy Exercise Guide",
      "Swelling Management Techniques",
      "Return to Activity Guidelines",
    ],
    readingLevel: "General Public",
    estimatedReadTime: "10-15 minutes",
    source: "AOTA Patient Education Materials",
    citation: "AOTA (2023). Hand Therapy Patient Education.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-edu-002",
    title: "Managing Arthritis with Occupational Therapy",
    topic: "Arthritis Management",
    category: "arthritis-management",
    description:
      "Education about arthritis management and occupational therapy strategies",
    targetAudience: "Patients with arthritis",
    keyPoints: [
      "Occupational therapy reduces arthritis pain",
      "Joint protection is important",
      "Energy conservation helps",
      "Adaptive equipment improves function",
      "Consistency improves outcomes",
    ],
    homeExercises: [
      {
        name: "Range of Motion Exercises",
        description: "Gentle movements through full range of motion",
        frequency: "Daily",
        duration: "10-15 minutes",
      },
      {
        name: "Joint Protection Techniques",
        description: "Use proper body mechanics and techniques",
        frequency: "Throughout day",
        duration: "Ongoing",
      },
      {
        name: "Energy Conservation",
        description: "Pace activities and take rest breaks",
        frequency: "Throughout day",
        duration: "Ongoing",
      },
    ],
    precautions: [
      "Avoid high-impact activities",
      "Use proper body mechanics",
      "Pace activities appropriately",
      "Apply heat or cold as needed",
      "Take rest breaks",
    ],
    whenToContact: [
      "Pain increases significantly",
      "Swelling worsens",
      "Unable to perform daily activities",
      "New joint involvement",
      "Fever develops",
    ],
    resources: [
      "Arthritis Exercise Guide",
      "Joint Protection Techniques",
      "Adaptive Equipment Guide",
    ],
    readingLevel: "General Public",
    estimatedReadTime: "12-15 minutes",
    source: "AOTA Patient Education Materials",
    citation: "AOTA (2023). Arthritis Management Patient Education.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-edu-003",
    title: "Stroke Recovery and Occupational Therapy",
    topic: "Stroke Recovery",
    category: "stroke-recovery",
    description:
      "Education for stroke survivors about recovery and occupational therapy",
    targetAudience: "Stroke survivors and family members",
    keyPoints: [
      "Recovery is possible with consistent therapy",
      "Neuroplasticity allows brain to rewire",
      "Early intervention improves outcomes",
      "Family involvement supports recovery",
      "Emotional support is important",
    ],
    homeExercises: [
      {
        name: "Affected Arm Exercises",
        description: "Gentle movements of affected arm with support",
        frequency: "3-4 times daily",
        duration: "10-15 minutes",
      },
      {
        name: "Affected Hand Exercises",
        description: "Gentle movements of affected hand",
        frequency: "3-4 times daily",
        duration: "10-15 minutes",
      },
      {
        name: "Functional Activities",
        description: "Practice ADL tasks with affected side",
        frequency: "Throughout day",
        duration: "Ongoing",
      },
    ],
    precautions: [
      "Prevent falls with safety measures",
      "Monitor for shoulder pain",
      "Avoid overuse of affected side",
      "Watch for signs of depression",
      "Monitor blood pressure",
    ],
    whenToContact: [
      "Signs of another stroke",
      "Severe pain develops",
      "Unable to perform exercises",
      "Signs of depression or anxiety",
      "Difficulty with swallowing",
    ],
    resources: [
      "Stroke Recovery Timeline",
      "Home Safety Modifications",
      "Caregiver Support Resources",
    ],
    readingLevel: "General Public",
    estimatedReadTime: "15-20 minutes",
    source: "AOTA Patient Education Materials",
    citation: "AOTA (2023). Stroke Recovery Patient Education.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-edu-004",
    title: "Sensory Processing and Occupational Therapy",
    topic: "Sensory Processing",
    category: "sensory-processing",
    description:
      "Education about sensory processing and occupational therapy strategies",
    targetAudience: "Patients with sensory processing concerns",
    keyPoints: [
      "Sensory processing affects daily function",
      "Occupational therapy helps with sensory issues",
      "Sensory strategies improve performance",
      "Environmental modification helps",
      "Consistency improves outcomes",
    ],
    homeExercises: [
      {
        name: "Sensory Diet Activities",
        description: "Structured sensory input activities",
        frequency: "2-3 times daily",
        duration: "10-15 minutes",
      },
      {
        name: "Environmental Modification",
        description: "Adjust lighting, sound, and other sensory input",
        frequency: "Throughout day",
        duration: "Ongoing",
      },
      {
        name: "Coping Strategies",
        description: "Use techniques to manage sensory input",
        frequency: "Throughout day",
        duration: "Ongoing",
      },
    ],
    precautions: [
      "Avoid overwhelming sensory input",
      "Monitor for sensory overload",
      "Provide quiet breaks",
      "Respect sensory preferences",
      "Avoid forcing exposure",
    ],
    whenToContact: [
      "Increased sensory sensitivity",
      "Behavioral changes",
      "Unable to manage sensory input",
      "Increased anxiety or stress",
      "Sleep disturbances",
    ],
    resources: [
      "Sensory Diet Guide",
      "Environmental Modification Tips",
      "Coping Strategy Resources",
    ],
    readingLevel: "General Public",
    estimatedReadTime: "12-15 minutes",
    source: "AOTA Patient Education Materials",
    citation: "AOTA (2023). Sensory Processing Patient Education.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-edu-005",
    title: "Adaptive Equipment and Assistive Devices",
    topic: "Adaptive Equipment",
    category: "adaptive-equipment",
    description: "Education about adaptive equipment and assistive devices",
    targetAudience: "Patients needing adaptive equipment",
    keyPoints: [
      "Adaptive equipment improves independence",
      "Proper fit is important",
      "Training is essential",
      "Maintenance is necessary",
      "Equipment can be adjusted",
    ],
    homeExercises: [
      {
        name: "Equipment Practice",
        description: "Practice using adaptive equipment",
        frequency: "Daily",
        duration: "10-15 minutes",
      },
      {
        name: "Functional Activities",
        description: "Use equipment for ADL tasks",
        frequency: "Throughout day",
        duration: "Ongoing",
      },
      {
        name: "Problem-Solving",
        description: "Troubleshoot equipment issues",
        frequency: "As needed",
        duration: "Varies",
      },
    ],
    precautions: [
      "Ensure proper fit",
      "Check for safety",
      "Maintain equipment",
      "Follow usage guidelines",
      "Report problems",
    ],
    whenToContact: [
      "Equipment not fitting properly",
      "Equipment malfunction",
      "Safety concerns",
      "Unable to use equipment",
      "Need for adjustment",
    ],
    resources: [
      "Equipment User Guide",
      "Maintenance Instructions",
      "Troubleshooting Guide",
    ],
    readingLevel: "General Public",
    estimatedReadTime: "10-12 minutes",
    source: "AOTA Patient Education Materials",
    citation: "AOTA (2023). Adaptive Equipment Patient Education.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-edu-006",
    title: "Cognitive Strategies and Occupational Therapy",
    topic: "Cognitive Strategies",
    category: "cognitive-strategies",
    description: "Education about cognitive strategies and memory techniques",
    targetAudience: "Patients with cognitive concerns",
    keyPoints: [
      "Cognitive strategies improve function",
      "Memory techniques help",
      "Organization improves performance",
      "Consistency is important",
      "Adaptation is possible",
    ],
    homeExercises: [
      {
        name: "Memory Techniques",
        description: "Practice memory strategies",
        frequency: "Daily",
        duration: "10-15 minutes",
      },
      {
        name: "Organization Activities",
        description: "Organize daily tasks and items",
        frequency: "Daily",
        duration: "10-15 minutes",
      },
      {
        name: "Problem-Solving Practice",
        description: "Practice problem-solving skills",
        frequency: "2-3 times weekly",
        duration: "10-15 minutes",
      },
    ],
    precautions: [
      "Avoid frustration",
      "Use realistic expectations",
      "Take breaks as needed",
      "Celebrate successes",
      "Adjust strategies as needed",
    ],
    whenToContact: [
      "Increased confusion",
      "Memory worsening",
      "Unable to use strategies",
      "Increased frustration",
      "Behavioral changes",
    ],
    resources: [
      "Memory Strategy Guide",
      "Organization Tips",
      "Problem-Solving Resources",
    ],
    readingLevel: "General Public",
    estimatedReadTime: "12-15 minutes",
    source: "AOTA Patient Education Materials",
    citation: "AOTA (2023). Cognitive Strategies Patient Education.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-edu-007",
    title: "Work and Occupational Therapy",
    topic: "Work and Occupational Therapy",
    category: "work-occupational-therapy",
    description: "Education about work-related occupational therapy",
    targetAudience: "Patients returning to work",
    keyPoints: [
      "Occupational therapy supports work return",
      "Gradual return is safer",
      "Ergonomics prevents injury",
      "Communication is important",
      "Pacing prevents overuse",
    ],
    homeExercises: [
      {
        name: "Job-Specific Exercises",
        description: "Exercises simulating work activities",
        frequency: "3-4 times weekly",
        duration: "20-30 minutes",
      },
      {
        name: "Conditioning Exercises",
        description: "General conditioning to build work capacity",
        frequency: "3-4 times weekly",
        duration: "20-30 minutes",
      },
      {
        name: "Ergonomic Setup",
        description: "Optimize workstation setup",
        frequency: "Daily",
        duration: "Ongoing",
      },
    ],
    precautions: [
      "Follow work restrictions",
      "Use proper body mechanics",
      "Take frequent breaks",
      "Avoid overuse",
      "Report pain or symptoms",
    ],
    whenToContact: [
      "Pain increases at work",
      "Unable to perform job duties",
      "Symptoms worsen",
      "New pain develops",
      "Unable to progress",
    ],
    resources: [
      "Work Conditioning Program",
      "Ergonomic Assessment",
      "Return to Work Timeline",
    ],
    readingLevel: "General Public",
    estimatedReadTime: "10-15 minutes",
    source: "AOTA Patient Education Materials",
    citation: "AOTA (2023). Work and Occupational Therapy Patient Education.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-edu-008",
    title: "Pediatric Development and Occupational Therapy",
    topic: "Pediatric Development",
    category: "pediatric-development",
    description: "Education for parents about pediatric occupational therapy",
    targetAudience: "Parents of children in occupational therapy",
    keyPoints: [
      "Early intervention is important",
      "Play-based learning is effective",
      "Parental involvement supports progress",
      "Development is individual",
      "Consistency helps progress",
    ],
    homeExercises: [
      {
        name: "Play-Based Activities",
        description: "Structured play activities for development",
        frequency: "Daily",
        duration: "15-20 minutes",
      },
      {
        name: "Motor Skill Practice",
        description: "Practice motor skills through play",
        frequency: "Daily",
        duration: "10-15 minutes",
      },
      {
        name: "Sensory Activities",
        description: "Sensory play for development",
        frequency: "Daily",
        duration: "10-15 minutes",
      },
    ],
    precautions: [
      "Age-appropriate activities",
      "Safety first",
      "Avoid pressure",
      "Celebrate progress",
      "Adjust as needed",
    ],
    whenToContact: [
      "Developmental concerns",
      "Behavioral changes",
      "Unable to participate",
      "Regression in skills",
      "Safety concerns",
    ],
    resources: [
      "Developmental Milestone Guide",
      "Play Activity Ideas",
      "Parent Support Resources",
    ],
    readingLevel: "General Public",
    estimatedReadTime: "12-15 minutes",
    source: "AOTA Patient Education Materials",
    citation: "AOTA (2023). Pediatric Development Patient Education.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-edu-009",
    title: "Mental Health and Occupational Therapy",
    topic: "Mental Health",
    category: "mental-health",
    description: "Education about mental health and occupational therapy",
    targetAudience: "Patients with mental health concerns",
    keyPoints: [
      "Occupational therapy supports mental health",
      "Meaningful activities help",
      "Coping strategies are important",
      "Social engagement helps",
      "Recovery is possible",
    ],
    homeExercises: [
      {
        name: "Meaningful Activities",
        description: "Engage in meaningful occupations",
        frequency: "Daily",
        duration: "20-30 minutes",
      },
      {
        name: "Coping Strategies",
        description: "Practice coping techniques",
        frequency: "Daily",
        duration: "10-15 minutes",
      },
      {
        name: "Social Engagement",
        description: "Participate in social activities",
        frequency: "2-3 times weekly",
        duration: "30-60 minutes",
      },
    ],
    precautions: [
      "Avoid isolation",
      "Monitor mood",
      "Seek support",
      "Take medications as prescribed",
      "Report concerns",
    ],
    whenToContact: [
      "Mood worsens",
      "Increased isolation",
      "Suicidal thoughts",
      "Medication concerns",
      "Crisis situation",
    ],
    resources: [
      "Mental Health Resources",
      "Coping Strategy Guide",
      "Support Group Information",
    ],
    readingLevel: "General Public",
    estimatedReadTime: "12-15 minutes",
    source: "AOTA Patient Education Materials",
    citation: "AOTA (2023). Mental Health Patient Education.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-edu-010",
    title: "Aging and Occupational Therapy",
    topic: "Aging",
    category: "aging",
    description: "Education about aging and occupational therapy",
    targetAudience: "Older adults and caregivers",
    keyPoints: [
      "Occupational therapy supports healthy aging",
      "Activity is important",
      "Social engagement helps",
      "Adaptation is possible",
      "Independence can be maintained",
    ],
    homeExercises: [
      {
        name: "Physical Activity",
        description: "Regular physical activity for health",
        frequency: "Daily",
        duration: "30 minutes",
      },
      {
        name: "Cognitive Activity",
        description: "Mental stimulation activities",
        frequency: "Daily",
        duration: "20-30 minutes",
      },
      {
        name: "Social Engagement",
        description: "Social activities and connections",
        frequency: "2-3 times weekly",
        duration: "30-60 minutes",
      },
    ],
    precautions: [
      "Monitor safety",
      "Prevent falls",
      "Maintain independence",
      "Stay engaged",
      "Seek support",
    ],
    whenToContact: [
      "Functional decline",
      "Fall risk increase",
      "Social isolation",
      "Cognitive changes",
      "Health concerns",
    ],
    resources: ["Healthy Aging Guide", "Activity Ideas", "Senior Resources"],
    readingLevel: "General Public",
    estimatedReadTime: "12-15 minutes",
    source: "AOTA Patient Education Materials",
    citation: "AOTA (2023). Aging Patient Education.",
    lastUpdated: new Date("2024-01-15"),
  },
];

/**
 * Get OT patient education material by ID
 */
export function getOTPatientEducationById(
  id: string,
): OTPatientEducation | undefined {
  return otPatientEducationData.find((pe) => pe.id === id);
}

/**
 * Get OT patient education materials by category
 */
export function getOTPatientEducationByCategory(
  category: string,
): OTPatientEducation[] {
  return otPatientEducationData.filter((pe) => pe.category === category);
}

/**
 * Search OT patient education materials
 */
export function searchOTPatientEducation(query: string): OTPatientEducation[] {
  const lowerQuery = query.toLowerCase();
  return otPatientEducationData.filter(
    (pe) =>
      pe.title.toLowerCase().includes(lowerQuery) ||
      pe.topic.toLowerCase().includes(lowerQuery) ||
      pe.description.toLowerCase().includes(lowerQuery),
  );
}

/**
 * Get all OT patient education materials
 */
export function getAllOTPatientEducation(): OTPatientEducation[] {
  return otPatientEducationData;
}

/**
 * Get OT patient education categories
 */
export function getOTPatientEducationCategories(): string[] {
  return Array.from(new Set(otPatientEducationData.map((pe) => pe.category)));
}

/**
 * Get OT patient education materials for topic
 */
export function getOTPatientEducationForTopic(
  topic: string,
): OTPatientEducation[] {
  return otPatientEducationData.filter((pe) =>
    pe.topic.toLowerCase().includes(topic.toLowerCase()),
  );
}
