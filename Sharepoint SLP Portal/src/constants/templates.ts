export interface DocumentationTemplate {
  id: string;
  name: string;
  category: 'Evaluation' | 'Treatment' | 'Progress' | 'Recertification' | 'Plan of Care' | 'Discharge';
  elements: string[];
}

export const SLP_TEMPLATES: DocumentationTemplate[] = [
  {
    id: 'dysphagia-eval',
    name: 'Dysphagia Evaluation',
    category: 'Evaluation',
    elements: ['Patient History', 'Oral Mech Exam', 'Swallow Function', 'Recommendations', 'Plan of Care']
  },
  {
    id: 'dysarthria-eval',
    name: 'Dysarthria Evaluation',
    category: 'Evaluation',
    elements: ['Patient History', 'Oral Motor Exam', 'Speech Subsystems', 'Intelligibility', 'Recommendations']
  },
  {
    id: 'aphasia-eval',
    name: 'Aphasia Evaluation',
    category: 'Evaluation',
    elements: ['Patient History', 'Language Assessment', 'Auditory Comprehension', 'Verbal Expression', 'Recommendations']
  },
  {
    id: 'cognitive-comm-eval',
    name: 'Cognitive-Communication Evaluation',
    category: 'Evaluation',
    elements: ['Patient History', 'Cognitive Assessment', 'Attention/Memory', 'Executive Function', 'Recommendations']
  },
  {
    id: 'fluency-eval',
    name: 'Fluency Evaluation',
    category: 'Evaluation',
    elements: ['Patient History', 'Fluency Analysis', 'Secondary Behaviors', 'Impact on Communication', 'Recommendations']
  },
  {
    id: 'aac-eval',
    name: 'AAC Evaluation',
    category: 'Evaluation',
    elements: ['Patient History', 'Communication Needs', 'Access Methods', 'Device Trials', 'Recommendations']
  },
  {
    id: 'pediatric-feeding-eval',
    name: 'Pediatric Feeding Evaluation',
    category: 'Evaluation',
    elements: ['Patient History', 'Feeding/Swallowing Observation', 'Sensory/Motor Assessment', 'Recommendations', 'Plan of Care']
  },
  {
    id: 'vocal-fold-paralysis',
    name: 'Vocal Fold Paralysis Assessment',
    category: 'Evaluation',
    elements: ['Clinical History', 'Laryngeal Function', 'Respiratory Support', 'Acoustic/Perceptual Analysis', 'Recommendations']
  },
  {
    id: 'daily-note-voice',
    name: 'Daily Note - Voice',
    category: 'Treatment',
    elements: ['Subjective', 'Objective', 'Assessment', 'Plan']
  },
  {
    id: 'daily-note-dysphagia',
    name: 'Daily Note - Dysphagia',
    category: 'Treatment',
    elements: ['Subjective', 'Objective', 'Assessment', 'Plan']
  },
  {
    id: 'daily-note-cognitive',
    name: 'Daily Note - Cognitive',
    category: 'Treatment',
    elements: ['Subjective', 'Objective', 'Assessment', 'Plan']
  },
  {
    id: 'progress-note',
    name: 'Progress Note',
    category: 'Progress',
    elements: ['Summary of Progress', 'Standardized Testing', 'Current Status', 'Recommendations']
  },
  {
    id: 'recertification-language',
    name: 'Recertification - Language',
    category: 'Recertification',
    elements: ['Clinical Justification', 'Functional Goals', 'Progress Summary', 'Plan of Care']
  },
  {
    id: 'recertification-dysphagia',
    name: 'Recertification - Dysphagia',
    category: 'Recertification',
    elements: ['Clinical Justification', 'Functional Goals', 'Progress Summary', 'Plan of Care']
  },
  {
    id: 'discharge-summary',
    name: 'Discharge Summary',
    category: 'Discharge',
    elements: ['Reason for Discharge', 'Summary of Treatment', 'Final Status', 'Recommendations/Follow-up']
  },
  {
    id: 'poc',
    name: 'Plan of Care',
    category: 'Plan of Care',
    elements: ['Diagnosis', 'Long Term Goals', 'Short Term Goals', 'Frequency/Duration']
  }
];
