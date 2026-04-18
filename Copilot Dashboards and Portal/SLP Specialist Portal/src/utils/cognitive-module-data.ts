export const COGNITIVE_MODULE_DATA = {
  screeners: [
    {
      name: 'MoCA (Montreal Cognitive Assessment)',
      description: 'Rapid screening for mild cognitive impairment.',
      cutoffs: [
        { score: '26-30', interpretation: 'Normal' },
        { score: '18-25', interpretation: 'Mild Cognitive Impairment' },
        { score: '10-17', interpretation: 'Moderate Cognitive Impairment' },
        { score: '<10', interpretation: 'Severe Cognitive Impairment' }
      ],
      domains: ['Visuospatial', 'Naming', 'Memory', 'Attention', 'Language', 'Abstraction', 'Delayed Recall', 'Orientation']
    },
    {
      name: 'SLUMS Examination',
      description: 'Saint Louis University Mental Status.',
      cutoffs: [
        { score: '27-30', interpretation: 'Normal (High School Education)' },
        { score: '21-26', interpretation: 'MNCD (Mild Neurocognitive Disorder)' },
        { score: '1-20', interpretation: 'Dementia' }
      ],
      domains: ['Orientation', 'Memory', 'Attention', 'Executive Function']
    }
  ],
  safetyScenarios: [
    {
      title: 'Kitchen Safety',
      scenario: 'You are boiling water on the stove and the phone rings in the other room. What do you do?',
      correctResponse: 'Turn off the stove before leaving the kitchen.',
      rationale: 'Prevents fire hazard and ensures safety during divided attention.'
    },
    {
      title: 'Medication Management',
      scenario: 'You realize you missed your morning dose of medication. It is now 2:00 PM. What is your first step?',
      correctResponse: 'Check the prescription label or call the pharmacist/doctor.',
      rationale: 'Ensures clinical safety and prevents double-dosing or missed therapeutic windows.'
    },
    {
      title: 'Emergency Response',
      scenario: 'You smell smoke coming from the basement. You are home alone. What do you do?',
      correctResponse: 'Exit the house immediately and call 911 from outside.',
      rationale: 'Prioritizes immediate life safety over investigation.'
    }
  ],
  executiveLab: [
    {
      id: 'bill-pay',
      title: 'Bill Paying Simulation',
      task: 'Sort these 5 bills by due date and write "checks" for the total amount.',
      complexity: 'Moderate',
      skills: ['Organization', 'Sequencing', 'Calculation']
    },
    {
      id: 'med-sort',
      title: 'Medication Sorting',
      task: 'Fill a 7-day pill box based on these 3 prescription labels.',
      complexity: 'High',
      skills: ['Attention to Detail', 'Memory', 'Problem Solving']
    },
    {
      id: 'travel-plan',
      title: 'Travel Planning',
      task: 'Find the fastest bus route from Point A to Point B using this schedule.',
      complexity: 'High',
      skills: ['Executive Function', 'Information Synthesis']
    }
  ]
};
