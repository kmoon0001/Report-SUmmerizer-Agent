/**
 * PT Module 9: Patient Education
 * Comprehensive patient education materials for physical therapy
 * Evidence-based education from APTA and clinical best practices
 */

export interface PTPatientEducation {
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

const ptPatientEducationData: PTPatientEducation[] = [
  {
    id: "pt-edu-001",
    title: "Understanding Low Back Pain",
    topic: "Low Back Pain",
    category: "pain-management",
    description:
      "Comprehensive education about low back pain causes, prevention, and management strategies",
    targetAudience: "Patients with acute or chronic low back pain",
    keyPoints: [
      "Low back pain is common and usually improves with activity",
      "Proper posture and body mechanics reduce pain",
      "Regular exercise strengthens supporting muscles",
      "Stress management helps reduce pain perception",
      "Most low back pain resolves within 6-12 weeks",
    ],
    homeExercises: [
      {
        name: "Pelvic Tilts",
        description: "Lying on back, gently tilt pelvis to engage core muscles",
        frequency: "2-3 times daily",
        duration: "10-15 repetitions",
      },
      {
        name: "Quadruped Marching",
        description:
          "On hands and knees, lift one leg at a time while maintaining neutral spine",
        frequency: "2-3 times daily",
        duration: "10-15 repetitions per leg",
      },
      {
        name: "Walking",
        description: "Regular walking at comfortable pace to maintain mobility",
        frequency: "Daily",
        duration: "20-30 minutes",
      },
    ],
    precautions: [
      "Avoid heavy lifting",
      "Use proper body mechanics",
      "Take frequent position changes",
      "Apply ice for acute pain",
      "Avoid prolonged sitting",
    ],
    whenToContact: [
      "Pain worsens despite treatment",
      "Numbness or tingling develops",
      "Loss of bowel/bladder control",
      "Fever accompanies pain",
      "Pain radiates down leg",
    ],
    resources: [
      "APTA Patient Education Resources",
      "Back Pain Self-Management Guide",
      "Posture and Body Mechanics Video",
    ],
    readingLevel: "General Public",
    estimatedReadTime: "10-15 minutes",
    source: "APTA Patient Education Materials",
    citation:
      "American Physical Therapy Association (2023). Low Back Pain Patient Education.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-edu-002",
    title: "Recovering from Knee Surgery",
    topic: "Knee Surgery Recovery",
    category: "post-operative",
    description:
      "Guide for patients recovering from knee surgery including ACL reconstruction and meniscus repair",
    targetAudience: "Post-operative knee surgery patients",
    keyPoints: [
      "Recovery takes time and patience",
      "Follow weight-bearing restrictions",
      "Swelling management is important",
      "Progressive exercise improves outcomes",
      "Return to activities is gradual",
    ],
    homeExercises: [
      {
        name: "Quadriceps Sets",
        description: "Tighten thigh muscle and hold for 5 seconds",
        frequency: "3-4 times daily",
        duration: "10-15 repetitions",
      },
      {
        name: "Straight Leg Raises",
        description: "Lying down, lift straight leg while keeping knee locked",
        frequency: "2-3 times daily",
        duration: "10-15 repetitions",
      },
      {
        name: "Heel Slides",
        description: "Lying down, slide heel toward buttock to bend knee",
        frequency: "2-3 times daily",
        duration: "10-15 repetitions",
      },
    ],
    precautions: [
      "Follow weight-bearing restrictions",
      "Use crutches as directed",
      "Wear brace as prescribed",
      "Avoid twisting motions",
      "Monitor for increased swelling",
    ],
    whenToContact: [
      "Increased pain or swelling",
      "Fever develops",
      "Incision shows signs of infection",
      "Unable to move knee",
      "Calf pain or swelling",
    ],
    resources: [
      "Post-operative Recovery Timeline",
      "Swelling Management Techniques",
      "Return to Activity Guidelines",
    ],
    readingLevel: "General Public",
    estimatedReadTime: "12-18 minutes",
    source: "APTA Post-operative Education Materials",
    citation:
      "American Physical Therapy Association (2023). Knee Surgery Recovery Guide.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-edu-003",
    title: "Stroke Recovery and Rehabilitation",
    topic: "Stroke Recovery",
    category: "neurological",
    description:
      "Education for stroke survivors and caregivers about recovery process and rehabilitation",
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
        name: "Affected Leg Exercises",
        description: "Gentle movements of affected leg with support",
        frequency: "3-4 times daily",
        duration: "10-15 minutes",
      },
      {
        name: "Walking Practice",
        description:
          "Walking with appropriate assistive device and supervision",
        frequency: "Daily",
        duration: "20-30 minutes",
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
    source: "APTA Neurological Education Materials",
    citation:
      "American Physical Therapy Association (2023). Stroke Recovery Guide.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-edu-004",
    title: "Fall Prevention for Older Adults",
    topic: "Fall Prevention",
    category: "safety",
    description:
      "Comprehensive guide for fall prevention strategies and home safety modifications",
    targetAudience: "Older adults and caregivers",
    keyPoints: [
      "Falls are preventable",
      "Home modifications reduce fall risk",
      "Balance and strength training helps",
      "Proper footwear is important",
      "Vision and hearing checks are essential",
    ],
    homeExercises: [
      {
        name: "Balance Exercises",
        description: "Standing exercises to improve balance and stability",
        frequency: "Daily",
        duration: "10-15 minutes",
      },
      {
        name: "Strength Training",
        description: "Exercises to strengthen legs and core muscles",
        frequency: "3-4 times weekly",
        duration: "15-20 minutes",
      },
      {
        name: "Walking Program",
        description: "Regular walking to maintain strength and balance",
        frequency: "Daily",
        duration: "30 minutes",
      },
    ],
    precautions: [
      "Use assistive device if needed",
      "Ensure adequate lighting",
      "Remove tripping hazards",
      "Wear appropriate footwear",
      "Take medications as prescribed",
    ],
    whenToContact: [
      "Fall occurs",
      "Increased fear of falling",
      "Unable to perform exercises",
      "New dizziness or balance problems",
      "Vision or hearing changes",
    ],
    resources: [
      "Home Safety Checklist",
      "Balance Exercise Video",
      "Fall Prevention Tips",
    ],
    readingLevel: "General Public",
    estimatedReadTime: "10-15 minutes",
    source: "APTA Geriatric Education Materials",
    citation:
      "American Physical Therapy Association (2023). Fall Prevention Guide.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-edu-005",
    title: "Managing Arthritis Pain",
    topic: "Arthritis Management",
    category: "pain-management",
    description:
      "Education about arthritis types, pain management, and exercise strategies",
    targetAudience: "Patients with arthritis",
    keyPoints: [
      "Exercise reduces arthritis pain",
      "Heat and cold therapy helps",
      "Weight management reduces joint stress",
      "Proper body mechanics protects joints",
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
        name: "Strengthening Exercises",
        description: "Exercises to strengthen muscles supporting joints",
        frequency: "3-4 times weekly",
        duration: "15-20 minutes",
      },
      {
        name: "Low-Impact Aerobic Activity",
        description: "Walking, swimming, or cycling at comfortable pace",
        frequency: "Daily",
        duration: "20-30 minutes",
      },
    ],
    precautions: [
      "Avoid high-impact activities",
      "Use proper body mechanics",
      "Pace activities appropriately",
      "Apply ice after activity if needed",
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
      "Pain Management Strategies",
    ],
    readingLevel: "General Public",
    estimatedReadTime: "12-15 minutes",
    source: "APTA Rheumatology Education Materials",
    citation:
      "American Physical Therapy Association (2023). Arthritis Management Guide.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-edu-006",
    title: "Posture and Body Mechanics",
    topic: "Posture",
    category: "prevention",
    description:
      "Guide to proper posture and body mechanics for daily activities",
    targetAudience: "General population and patients with postural issues",
    keyPoints: [
      "Good posture reduces pain and injury",
      "Proper mechanics protect spine",
      "Ergonomics prevents work-related injury",
      "Awareness improves posture",
      "Strengthening supports good posture",
    ],
    homeExercises: [
      {
        name: "Posture Awareness",
        description: "Regular checks and corrections of posture throughout day",
        frequency: "Throughout day",
        duration: "Ongoing",
      },
      {
        name: "Core Strengthening",
        description:
          "Exercises to strengthen core muscles that support posture",
        frequency: "3-4 times weekly",
        duration: "15-20 minutes",
      },
      {
        name: "Stretching",
        description: "Stretches for tight muscles that affect posture",
        frequency: "Daily",
        duration: "10-15 minutes",
      },
    ],
    precautions: [
      "Avoid slouching",
      "Take frequent position changes",
      "Use proper ergonomics at work",
      "Adjust computer setup",
      "Use supportive furniture",
    ],
    whenToContact: [
      "Persistent pain develops",
      "Unable to maintain posture",
      "Numbness or tingling",
      "Headaches worsen",
      "Breathing difficulty",
    ],
    resources: [
      "Ergonomic Setup Guide",
      "Posture Correction Exercises",
      "Workplace Modifications",
    ],
    readingLevel: "General Public",
    estimatedReadTime: "10-12 minutes",
    source: "APTA Orthopedic Education Materials",
    citation:
      "American Physical Therapy Association (2023). Posture and Body Mechanics Guide.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-edu-007",
    title: "Shoulder Pain Management",
    topic: "Shoulder Pain",
    category: "pain-management",
    description:
      "Education about shoulder pain causes and conservative management strategies",
    targetAudience: "Patients with shoulder pain",
    keyPoints: [
      "Shoulder pain often improves with conservative treatment",
      "Proper mechanics prevent shoulder injury",
      "Strengthening improves shoulder stability",
      "Flexibility is important for shoulder health",
      "Gradual progression prevents re-injury",
    ],
    homeExercises: [
      {
        name: "Pendulum Exercises",
        description: "Gentle circular motions of arm to mobilize shoulder",
        frequency: "3-4 times daily",
        duration: "5-10 minutes",
      },
      {
        name: "Shoulder Strengthening",
        description:
          "Exercises to strengthen rotator cuff and shoulder muscles",
        frequency: "3-4 times weekly",
        duration: "15-20 minutes",
      },
      {
        name: "Shoulder Stretching",
        description: "Gentle stretches to improve shoulder flexibility",
        frequency: "Daily",
        duration: "10-15 minutes",
      },
    ],
    precautions: [
      "Avoid overhead activities initially",
      "Use proper lifting mechanics",
      "Avoid sleeping on affected shoulder",
      "Apply ice after activity",
      "Avoid heavy lifting",
    ],
    whenToContact: [
      "Pain worsens despite treatment",
      "Unable to move arm",
      "Numbness or tingling develops",
      "Swelling increases",
      "Pain radiates down arm",
    ],
    resources: [
      "Shoulder Exercise Program",
      "Proper Lifting Techniques",
      "Activity Modification Strategies",
    ],
    readingLevel: "General Public",
    estimatedReadTime: "10-15 minutes",
    source: "APTA Orthopedic Education Materials",
    citation:
      "American Physical Therapy Association (2023). Shoulder Pain Management Guide.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-edu-008",
    title: "Dizziness and Balance Problems",
    topic: "Dizziness",
    category: "neurological",
    description:
      "Education about dizziness causes and vestibular rehabilitation strategies",
    targetAudience: "Patients with dizziness and balance problems",
    keyPoints: [
      "Dizziness is treatable",
      "Vestibular rehabilitation is effective",
      "Gradual exposure helps adaptation",
      "Balance training improves stability",
      "Most dizziness improves with treatment",
    ],
    homeExercises: [
      {
        name: "Gaze Stabilization Exercises",
        description: "Exercises to improve eye-head coordination",
        frequency: "3-4 times daily",
        duration: "10-15 minutes",
      },
      {
        name: "Balance Exercises",
        description: "Exercises to improve balance and reduce dizziness",
        frequency: "Daily",
        duration: "15-20 minutes",
      },
      {
        name: "Habituation Exercises",
        description: "Controlled exposure to movements that trigger dizziness",
        frequency: "3-4 times daily",
        duration: "10-15 minutes",
      },
    ],
    precautions: [
      "Avoid sudden head movements",
      "Use assistive device if needed",
      "Ensure safe environment",
      "Avoid driving if dizzy",
      "Take breaks if exercises cause dizziness",
    ],
    whenToContact: [
      "Severe dizziness develops",
      "Dizziness worsens",
      "Hearing loss occurs",
      "Severe headache develops",
      "Vision changes",
    ],
    resources: [
      "Vestibular Exercise Program",
      "Dizziness Management Tips",
      "Balance Training Video",
    ],
    readingLevel: "General Public",
    estimatedReadTime: "12-15 minutes",
    source: "APTA Vestibular Education Materials",
    citation:
      "American Physical Therapy Association (2023). Dizziness and Balance Guide.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-edu-009",
    title: "Returning to Work After Injury",
    topic: "Return to Work",
    category: "work-related",
    description: "Guide for safe return to work after injury or illness",
    targetAudience: "Patients returning to work",
    keyPoints: [
      "Gradual return to work is safer",
      "Modified duties help transition",
      "Proper ergonomics prevents re-injury",
      "Communication with employer is important",
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
        name: "Stretching and Flexibility",
        description: "Stretches to maintain flexibility for work tasks",
        frequency: "Daily",
        duration: "10-15 minutes",
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
    source: "APTA Work Rehabilitation Education Materials",
    citation:
      "American Physical Therapy Association (2023). Return to Work Guide.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-edu-010",
    title: "Exercise and Physical Activity Benefits",
    topic: "Exercise Benefits",
    category: "prevention",
    description:
      "Education about benefits of regular exercise and physical activity",
    targetAudience: "General population",
    keyPoints: [
      "Regular exercise improves health",
      "Physical activity reduces disease risk",
      "Exercise improves mental health",
      "Consistency is key to benefits",
      "Any activity is better than none",
    ],
    homeExercises: [
      {
        name: "Aerobic Activity",
        description: "Walking, cycling, or swimming at moderate intensity",
        frequency: "Most days of week",
        duration: "30 minutes",
      },
      {
        name: "Strength Training",
        description: "Exercises to build and maintain muscle",
        frequency: "2-3 times weekly",
        duration: "20-30 minutes",
      },
      {
        name: "Flexibility Training",
        description: "Stretching and flexibility exercises",
        frequency: "Daily",
        duration: "10-15 minutes",
      },
    ],
    precautions: [
      "Start slowly if sedentary",
      "Warm up before exercise",
      "Cool down after exercise",
      "Listen to your body",
      "Consult doctor if needed",
    ],
    whenToContact: [
      "Chest pain during exercise",
      "Severe shortness of breath",
      "Dizziness or fainting",
      "Joint pain that persists",
      "Unable to exercise safely",
    ],
    resources: [
      "Exercise Guidelines",
      "Beginner Fitness Program",
      "Activity Tracking Tools",
    ],
    readingLevel: "General Public",
    estimatedReadTime: "10-12 minutes",
    source: "APTA Health Promotion Education Materials",
    citation:
      "American Physical Therapy Association (2023). Exercise Benefits Guide.",
    lastUpdated: new Date("2024-01-15"),
  },
];

/**
 * Get patient education material by ID
 */
export function getPTPatientEducationById(
  id: string,
): PTPatientEducation | undefined {
  return ptPatientEducationData.find((pe) => pe.id === id);
}

/**
 * Get patient education materials by category
 */
export function getPTPatientEducationByCategory(
  category: string,
): PTPatientEducation[] {
  return ptPatientEducationData.filter((pe) => pe.category === category);
}

/**
 * Search patient education materials
 */
export function searchPTPatientEducation(query: string): PTPatientEducation[] {
  const lowerQuery = query.toLowerCase();
  return ptPatientEducationData.filter(
    (pe) =>
      pe.title.toLowerCase().includes(lowerQuery) ||
      pe.topic.toLowerCase().includes(lowerQuery) ||
      pe.description.toLowerCase().includes(lowerQuery),
  );
}

/**
 * Get all patient education materials
 */
export function getAllPTPatientEducation(): PTPatientEducation[] {
  return ptPatientEducationData;
}

/**
 * Get patient education categories
 */
export function getPTPatientEducationCategories(): string[] {
  return Array.from(new Set(ptPatientEducationData.map((pe) => pe.category)));
}

/**
 * Get patient education materials for topic
 */
export function getPTPatientEducationForTopic(
  topic: string,
): PTPatientEducation[] {
  return ptPatientEducationData.filter((pe) =>
    pe.topic.toLowerCase().includes(topic.toLowerCase()),
  );
}
