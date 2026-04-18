
export interface DocumentContent {
  id: string;
  title: string;
  category: string;
  pages: string[];
}

export const DOCUMENTS: DocumentContent[] = [
  {
    id: '1',
    title: 'NetHealth Quick Start Guide',
    category: 'Guide',
    pages: [
      'Page 1: Introduction to NetHealth...',
      'Page 2: Logging in and Dashboard Overview...',
      'Page 3: Creating a New Patient Record...'
    ]
  },
  {
    id: '2',
    title: 'Documentation Best Practices',
    category: 'Best Practices',
    pages: [
      'Page 1: General Documentation Guidelines...',
      'Page 2: SOAP Note Format...',
      'Page 3: Common Pitfalls to Avoid...'
    ]
  },
  {
    id: '3',
    title: 'Aphasia Home Exercise Program (HEP)',
    category: 'Handout',
    pages: [
      'Page 1: Introduction to Aphasia...',
      'Page 2: Naming Exercises...',
      'Page 3: Sentence Completion...'
    ]
  },
  {
    id: '4',
    title: 'Cognitive Home Exercise Program (HEP)',
    category: 'Handout',
    pages: [
      'Page 1: Introduction to Cognitive Rehab...',
      'Page 2: Attention Tasks...',
      'Page 3: Memory Strategies...'
    ]
  }
];
