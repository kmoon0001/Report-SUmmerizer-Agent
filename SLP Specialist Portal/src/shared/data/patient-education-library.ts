/**
 * Patient Education Library
 * Condition-specific education materials for PT and OT
 * Sources: APTA, AOTA, clinical practice standards, evidence-based resources
 */

export type EducationContentType =
  | "condition-description"
  | "cause-prevention"
  | "treatment-options"
  | "recovery-timeline"
  | "home-program"
  | "safety-precautions"
  | "lifestyle-modification"
  | "exercise-instruction"
  | "equipment-guide"
  | "ergonomic-guide";
export type Discipline = "pt" | "ot" | "shared";
export type ReadingLevel =
  | "elementary"
  | "high-school"
  | "college"
  | "professional";

export interface PatientEducationContent {
  id: string;
  title: string;
  contentType: EducationContentType;
  discipline: Discipline;
  condition: string;
  readingLevel: ReadingLevel;
  description: string;
  content: string;
  keyPoints: string[];
  illustrations?: string[];
  printable: boolean;
  estimatedReadTime: number; // minutes
  source: string;
  citation: string;
  lastUpdated: Date;
  applicableTo: string[];
}

// Shared Education Content
const sharedEducationContent: PatientEducationContent[] = [
  {
    id: "edu-shared-001",
    title: "Understanding Stroke Recovery",
    contentType: "condition-description",
    discipline: "shared",
    condition: "stroke",
    readingLevel: "high-school",
    description: "Overview of stroke, types, and recovery process",
    content: `A stroke occurs when blood flow to the brain is blocked. This can happen in two ways:
    
1. Ischemic stroke: A blood clot blocks an artery (most common, 87% of strokes)
2. Hemorrhagic stroke: A blood vessel ruptures and bleeds into the brain

When brain cells don't get oxygen, they begin to die. The effects depend on which part of the brain was affected and how quickly treatment was received.

Recovery from stroke is possible because the brain can form new connections. With rehabilitation, many people regain lost abilities. Recovery is usually fastest in the first 3 months but can continue for years.`,
    keyPoints: [
      "Stroke is a medical emergency - call 911 immediately",
      "Time is critical - treatment within 3 hours improves outcomes",
      "Recovery varies by individual and stroke severity",
      "Rehabilitation is essential for recovery",
      "Family support improves outcomes",
    ],
    printable: true,
    estimatedReadTime: 5,
    source: "American Heart Association",
    citation: "AHA Stroke Recovery Guidelines",
    lastUpdated: new Date("2024-01-15"),
    applicableTo: ["stroke", "cerebrovascular-accident"],
  },
  {
    id: "edu-shared-002",
    title: "Fall Prevention at Home",
    contentType: "safety-precautions",
    discipline: "shared",
    condition: "fall-risk",
    readingLevel: "high-school",
    description: "Home safety modifications to prevent falls",
    content: `Falls are a leading cause of injury in older adults. Many falls can be prevented with simple home modifications:

LIGHTING:
- Install bright lights in hallways and bathrooms
- Use nightlights in bedrooms and bathrooms
- Ensure light switches are easily accessible

FLOORING:
- Remove throw rugs or secure them with non-slip tape
- Keep floors clear of clutter
- Use non-slip mats in bathrooms
- Repair loose floorboards or carpet

STAIRS:
- Install handrails on both sides
- Ensure stairs are well-lit
- Mark stair edges with contrasting tape
- Keep stairs clear of clutter

BATHROOMS:
- Install grab bars near toilet and tub
- Use non-slip mats in tub and shower
- Keep frequently used items at waist height
- Consider a shower chair or bench

BEDROOM:
- Keep a nightlight on
- Keep phone and lamp within reach
- Use a sturdy bed frame
- Consider a bed rail if needed`,
    keyPoints: [
      "Remove tripping hazards",
      "Improve lighting throughout home",
      "Install grab bars in bathrooms",
      "Wear proper footwear",
      "Use assistive devices as recommended",
    ],
    printable: true,
    estimatedReadTime: 8,
    source: "CDC",
    citation: "CDC Fall Prevention Guidelines",
    lastUpdated: new Date("2024-01-15"),
    applicableTo: ["fall-prevention", "balance-disorder", "geriatric"],
  },
  {
    id: "edu-shared-003",
    title: "Pain Management Strategies",
    contentType: "lifestyle-modification",
    discipline: "shared",
    condition: "chronic-pain",
    readingLevel: "high-school",
    description: "Non-medication strategies for managing chronic pain",
    content: `Chronic pain can be managed through multiple strategies beyond medication:

PHYSICAL STRATEGIES:
- Heat therapy: Apply heat for 15-20 minutes to reduce stiffness
- Cold therapy: Apply ice for 15-20 minutes to reduce inflammation
- Gentle stretching: Maintain flexibility and reduce tension
- Regular movement: Avoid prolonged immobility
- Proper posture: Reduce strain on joints and muscles

MENTAL STRATEGIES:
- Relaxation techniques: Deep breathing, progressive muscle relaxation
- Mindfulness: Focus on present moment without judgment
- Meditation: Regular practice reduces pain perception
- Visualization: Imagine pain-free activities

LIFESTYLE STRATEGIES:
- Sleep: Maintain consistent sleep schedule
- Exercise: Regular activity improves pain tolerance
- Nutrition: Anti-inflammatory diet may help
- Social engagement: Reduce isolation and depression
- Stress management: Reduce tension and pain amplification`,
    keyPoints: [
      "Pain is complex and multifactorial",
      "Multiple strategies work better than one alone",
      "Consistency is key to effectiveness",
      "Work with your healthcare team",
      "Gradual progression prevents setbacks",
    ],
    printable: true,
    estimatedReadTime: 7,
    source: "APTA",
    citation: "APTA Pain Management Guidelines",
    lastUpdated: new Date("2024-01-15"),
    applicableTo: ["chronic-pain", "pain-management"],
  },
];

// PT-Specific Education Content
const ptEducationContent: PatientEducationContent[] = [
  {
    id: "edu-pt-001",
    title: "Low Back Pain: Causes and Prevention",
    contentType: "cause-prevention",
    discipline: "pt",
    condition: "low-back-pain",
    readingLevel: "high-school",
    description: "Understanding low back pain and prevention strategies",
    content: `Low back pain is one of the most common conditions affecting adults. Understanding the causes can help prevent future episodes.

COMMON CAUSES:
- Muscle strain: Overuse or sudden movement
- Disc problems: Herniation or degeneration
- Arthritis: Wear and tear of joints
- Poor posture: Chronic stress on spine
- Weak core: Inadequate support for spine
- Repetitive activities: Cumulative stress

PREVENTION STRATEGIES:
1. Maintain good posture: Keep spine neutral
2. Strengthen core: Regular core exercises
3. Stretch regularly: Maintain flexibility
4. Lift properly: Bend knees, keep load close
5. Stay active: Regular movement prevents stiffness
6. Manage weight: Reduces stress on spine
7. Ergonomic workspace: Proper desk and chair setup
8. Stress management: Tension increases pain`,
    keyPoints: [
      "Most low back pain improves with conservative treatment",
      "Early intervention prevents chronicity",
      "Core strength is essential for prevention",
      "Posture and body mechanics matter",
      "Stay active during recovery",
    ],
    printable: true,
    estimatedReadTime: 6,
    source: "APTA",
    citation: "APTA Low Back Pain CPG",
    lastUpdated: new Date("2024-01-15"),
    applicableTo: ["low-back-pain", "lumbar-spine"],
  },
  {
    id: "edu-pt-002",
    title: "Shoulder Pain: Home Exercise Program",
    contentType: "home-program",
    discipline: "pt",
    condition: "shoulder-pain",
    readingLevel: "high-school",
    description: "Home exercises for shoulder pain and mobility",
    content: `These exercises should be performed daily for best results. Start with 10 repetitions and gradually increase.

PENDULUM EXERCISES (Gravity-assisted):
1. Bend forward at waist, let arm hang
2. Make small circles with arm
3. Perform 10 circles each direction
4. Repeat 2-3 times daily

WALL SLIDES (Shoulder flexion):
1. Stand with back against wall
2. Slide arms up wall, keeping elbows slightly bent
3. Go as high as comfortable without pain
4. Slide back down slowly
5. Repeat 10 times, 2-3 times daily

CROSS-BODY STRETCH (Shoulder stretch):
1. Bring arm across body at shoulder height
2. Use other hand to gently pull arm closer
3. Hold 30 seconds
4. Repeat 3 times each side, 2 times daily

EXTERNAL ROTATION (Rotator cuff):
1. Lie on side with elbow bent 90 degrees
2. Rotate forearm upward toward ceiling
3. Hold 2 seconds at top
4. Return to start
5. Repeat 10 times, 2-3 times daily`,
    keyPoints: [
      "Perform exercises daily for best results",
      "Stop if pain increases significantly",
      "Gradual progression prevents re-injury",
      "Consistency is more important than intensity",
      "Contact therapist if no improvement in 2 weeks",
    ],
    printable: true,
    estimatedReadTime: 5,
    source: "APTA",
    citation: "APTA Shoulder Pain Guidelines",
    lastUpdated: new Date("2024-01-15"),
    applicableTo: ["shoulder-pain", "rotator-cuff"],
  },
  {
    id: "edu-pt-003",
    title: "Knee Osteoarthritis: Activity Modification",
    contentType: "lifestyle-modification",
    discipline: "pt",
    condition: "knee-osteoarthritis",
    readingLevel: "high-school",
    description: "Activity modifications for knee osteoarthritis",
    content: `Knee osteoarthritis can be managed through activity modification and strengthening:

ACTIVITIES TO AVOID:
- High-impact activities: Running, jumping
- Prolonged standing: Causes inflammation
- Stairs: Use ramps or elevators when possible
- Kneeling: Puts pressure on joint
- Squatting: Increases joint stress

RECOMMENDED ACTIVITIES:
- Walking: Low-impact, maintains fitness
- Swimming: Excellent for strength without impact
- Cycling: Strengthens muscles without impact
- Water aerobics: Combines strength and cardio
- Tai Chi: Improves balance and flexibility

PAIN MANAGEMENT:
- Ice after activity: 15-20 minutes
- Heat before activity: Improves mobility
- Compression: Reduces swelling
- Elevation: Reduces inflammation
- Weight management: Reduces joint stress

ASSISTIVE DEVICES:
- Cane: Reduces load on knee
- Knee brace: Provides support
- Proper footwear: Cushioning reduces impact
- Shoe inserts: Corrects alignment`,
    keyPoints: [
      "Stay active with low-impact activities",
      "Strengthen muscles around knee",
      "Manage weight to reduce stress",
      "Use assistive devices as needed",
      "Consistency prevents progression",
    ],
    printable: true,
    estimatedReadTime: 6,
    source: "APTA",
    citation: "APTA Knee OA CPG",
    lastUpdated: new Date("2024-01-15"),
    applicableTo: ["knee-osteoarthritis", "knee-pain"],
  },
];

// OT-Specific Education Content
const otEducationContent: PatientEducationContent[] = [
  {
    id: "edu-ot-001",
    title: "Energy Conservation Techniques",
    contentType: "lifestyle-modification",
    discipline: "ot",
    condition: "fatigue",
    readingLevel: "high-school",
    description: "Techniques to conserve energy during daily activities",
    content: `Energy conservation helps manage fatigue and allows participation in meaningful activities:

PLANNING:
- Plan activities in advance
- Prioritize important tasks
- Break large tasks into smaller steps
- Schedule rest breaks between activities
- Avoid rushing

PACING:
- Work at a comfortable pace
- Take frequent short breaks
- Alternate heavy and light tasks
- Avoid peak fatigue times for important tasks
- Listen to your body

ORGANIZATION:
- Keep frequently used items at waist height
- Arrange workspace to minimize reaching
- Use labor-saving devices
- Delegate tasks when possible
- Simplify routines

BODY MECHANICS:
- Sit while working when possible
- Use proper posture
- Avoid unnecessary movements
- Use assistive devices
- Avoid holding breath during exertion

ACTIVITY MODIFICATION:
- Use lightweight tools
- Reduce number of steps in tasks
- Combine activities when possible
- Use adaptive equipment
- Ask for help when needed`,
    keyPoints: [
      "Energy is a limited resource",
      "Planning prevents fatigue",
      "Pacing allows more activity",
      "Organization reduces effort",
      "Assistive devices save energy",
    ],
    printable: true,
    estimatedReadTime: 7,
    source: "AOTA",
    citation: "AOTA Energy Conservation Guidelines",
    lastUpdated: new Date("2024-01-15"),
    applicableTo: ["fatigue", "chronic-illness", "post-viral"],
  },
  {
    id: "edu-ot-002",
    title: "Adaptive Equipment Guide: Self-Care",
    contentType: "equipment-guide",
    discipline: "ot",
    condition: "functional-limitation",
    readingLevel: "high-school",
    description: "Guide to adaptive equipment for self-care activities",
    content: `Adaptive equipment can help maintain independence in self-care:

DRESSING:
- Reacher/grabber: Retrieve items from floor
- Sock aid: Put on socks without bending
- Shoehorn: Put on shoes with limited reach
- Button hook: Fasten buttons with limited dexterity
- Zipper pull: Operate zippers with limited grip

BATHING:
- Shower chair: Sit while bathing
- Grab bars: Prevent falls
- Non-slip mat: Prevent slipping
- Long-handled sponge: Reach back and legs
- Handheld showerhead: Easier to control

GROOMING:
- Long-handled mirror: See without bending
- Electric toothbrush: Easier to use
- Adapted comb/brush: Easier to grip
- Adapted razor: Easier to control
- Makeup applicators: Easier to use

TOILETING:
- Raised toilet seat: Easier to sit/stand
- Toilet frame: Provides support
- Bidet: Easier hygiene
- Toilet paper holder: Easier to reach
- Wipes dispenser: Easier to access

FEEDING:
- Adaptive utensils: Easier to grip
- Plate guard: Prevents food from sliding
- Non-slip mat: Keeps plate in place
- Weighted utensils: Reduce tremor
- Cup with handles: Easier to hold`,
    keyPoints: [
      "Equipment maintains independence",
      "Proper fit is essential",
      "Trial before purchase when possible",
      "Insurance may cover some items",
      "Occupational therapist can recommend specific items",
    ],
    printable: true,
    estimatedReadTime: 8,
    source: "AOTA",
    citation: "AOTA Adaptive Equipment Guidelines",
    lastUpdated: new Date("2024-01-15"),
    applicableTo: ["functional-limitation", "disability", "aging"],
  },
  {
    id: "edu-ot-003",
    title: "Cognitive Strategies for Memory",
    contentType: "lifestyle-modification",
    discipline: "ot",
    condition: "cognitive-impairment",
    readingLevel: "high-school",
    description: "Strategies to improve memory and cognitive function",
    content: `Cognitive strategies can help compensate for memory difficulties:

EXTERNAL MEMORY AIDS:
- Written lists: Keep track of tasks
- Calendar: Track appointments and events
- Notebook: Write down important information
- Alarm reminders: Set alerts for tasks
- Photos: Visual reminders of routines

ORGANIZATION STRATEGIES:
- Consistent routines: Reduce decision-making
- Designated places: Always put items in same spot
- Labels: Identify contents of containers
- Color coding: Organize by category
- Simplified environment: Reduce clutter

ATTENTION STRATEGIES:
- Minimize distractions: Quiet environment
- One task at a time: Focus on single activity
- Frequent breaks: Prevent fatigue
- Optimal time of day: Do important tasks when alert
- Reduce multitasking: Complete one task before starting another

LEARNING STRATEGIES:
- Repetition: Practice new information
- Association: Link new info to known info
- Chunking: Break information into smaller pieces
- Visualization: Create mental images
- Teach others: Reinforces learning

DAILY ROUTINE:
- Morning routine: Establish consistent start
- Medication management: Use pill organizer
- Meal planning: Reduce decision-making
- Evening routine: Prepare for next day
- Sleep schedule: Consistent bedtime`,
    keyPoints: [
      "External aids are more reliable than memory",
      "Routines reduce cognitive load",
      "Environment affects performance",
      "Consistency improves function",
      "Multiple strategies work better than one",
    ],
    printable: true,
    estimatedReadTime: 8,
    source: "AOTA",
    citation: "AOTA Cognitive Strategy Guidelines",
    lastUpdated: new Date("2024-01-15"),
    applicableTo: ["cognitive-impairment", "memory-loss", "dementia"],
  },
];

// Combined library
const allEducationContent: PatientEducationContent[] = [
  ...sharedEducationContent,
  ...ptEducationContent,
  ...otEducationContent,
];

/**
 * Get education content by ID
 */
export function getEducationContentById(
  id: string,
): PatientEducationContent | undefined {
  return allEducationContent.find((c) => c.id === id);
}

/**
 * Get education content by condition
 */
export function getEducationContentByCondition(
  condition: string,
): PatientEducationContent[] {
  return allEducationContent.filter((c) => c.applicableTo.includes(condition));
}

/**
 * Get education content by type
 */
export function getEducationContentByType(
  type: EducationContentType,
): PatientEducationContent[] {
  return allEducationContent.filter((c) => c.contentType === type);
}

/**
 * Get education content by discipline
 */
export function getEducationContentByDiscipline(
  discipline: Discipline,
): PatientEducationContent[] {
  return allEducationContent.filter(
    (c) => c.discipline === discipline || c.discipline === "shared",
  );
}

/**
 * Get education content by reading level
 */
export function getEducationContentByReadingLevel(
  level: ReadingLevel,
): PatientEducationContent[] {
  return allEducationContent.filter((c) => c.readingLevel === level);
}

/**
 * Search education content
 */
export function searchEducationContent(
  query: string,
): PatientEducationContent[] {
  const lowerQuery = query.toLowerCase();
  return allEducationContent.filter(
    (c) =>
      c.title.toLowerCase().includes(lowerQuery) ||
      c.description.toLowerCase().includes(lowerQuery) ||
      c.condition.toLowerCase().includes(lowerQuery),
  );
}

/**
 * Get printable education content
 */
export function getPrintableEducationContent(): PatientEducationContent[] {
  return allEducationContent.filter((c) => c.printable);
}

/**
 * Get all education content
 */
export function getAllEducationContent(): PatientEducationContent[] {
  return allEducationContent;
}

/**
 * Get shared education content
 */
export function getSharedEducationContent(): PatientEducationContent[] {
  return sharedEducationContent;
}

/**
 * Get PT education content
 */
export function getPTEducationContent(): PatientEducationContent[] {
  return ptEducationContent;
}

/**
 * Get OT education content
 */
export function getOTEducationContent(): PatientEducationContent[] {
  return otEducationContent;
}
