import { 
  Utensils, 
  Brain, 
  MessageCircle, 
  Wind, 
  Activity 
} from 'lucide-react';

export type DomainType = 'dysphagia' | 'cog_comm' | 'aphasia' | 'motor_speech' | 'voice';

export interface DomainData {
  id: DomainType;
  label: string;
  icon: any;
  color: string;
  image: string;
  authoritativeSources: { name: string; url: string }[];
}

export const DOMAIN_DATA: Record<DomainType, DomainData> = {
  dysphagia: {
    id: 'dysphagia',
    label: "Dysphagia",
    icon: Utensils,
    color: "bg-orange-50 text-orange-600 border-orange-200",
    image: "https://picsum.photos/seed/dysphagia/400/200",
    authoritativeSources: [
      { name: "ASHA Practice Portal: Dysphagia", url: "https://www.asha.org/practice-portal/clinical-topics/adult-dysphagia/" },
      { name: "CMS Guidelines: Dysphagia Therapy", url: "https://www.cms.gov/medicare-coverage-database/view/lcd.aspx?lcdid=33579" }
    ]
  },
  cog_comm: {
    id: 'cog_comm',
    label: "Cognitive-Comm",
    icon: Brain,
    color: "bg-purple-50 text-purple-600 border-purple-200",
    image: "https://picsum.photos/seed/cognition/400/200",
    authoritativeSources: [
      { name: "ASHA Practice Portal: Dementia", url: "https://www.asha.org/practice-portal/clinical-topics/dementia/" },
      { name: "ASHA Practice Portal: TBI", url: "https://www.asha.org/practice-portal/clinical-topics/traumatic-brain-injury-in-adults/" }
    ]
  },
  aphasia: {
    id: 'aphasia',
    label: "Aphasia / Language",
    icon: MessageCircle,
    color: "bg-blue-50 text-blue-600 border-blue-200",
    image: "https://picsum.photos/seed/language/400/200",
    authoritativeSources: [
      { name: "ASHA Practice Portal: Aphasia", url: "https://www.asha.org/practice-portal/clinical-topics/aphasia/" }
    ]
  },
  motor_speech: {
    id: 'motor_speech',
    label: "Motor Speech",
    icon: Wind,
    color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    image: "https://picsum.photos/seed/speech/400/200",
    authoritativeSources: [
      { name: "ASHA Practice Portal: Dysarthria", url: "https://www.asha.org/practice-portal/clinical-topics/dysarthria-in-adults/" },
      { name: "ASHA Practice Portal: Apraxia", url: "https://www.asha.org/practice-portal/clinical-topics/acquired-apraxia-of-speech/" }
    ]
  },
  voice: {
    id: 'voice',
    label: "Voice",
    icon: Activity,
    color: "bg-rose-50 text-rose-600 border-rose-200",
    image: "https://picsum.photos/seed/voice/400/200",
    authoritativeSources: [
      { name: "ASHA Practice Portal: Voice Disorders", url: "https://www.asha.org/practice-portal/clinical-topics/voice-disorders/" }
    ]
  }
};
