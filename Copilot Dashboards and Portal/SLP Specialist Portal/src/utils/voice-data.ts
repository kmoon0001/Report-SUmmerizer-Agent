export const VOICE_DATA = {
  pathologies: [
    {
      name: 'Vocal Fold Nodules',
      description: 'Bilateral, symmetric calloused-like growths on the vocal folds.',
      etiology: 'Phonotrauma (chronic)',
      treatment: 'Voice therapy (primary), surgery (rare)'
    },
    {
      name: 'Vocal Fold Polyps',
      description: 'Unilateral, fluid-filled lesions, often larger than nodules.',
      etiology: 'Phonotrauma (acute or chronic)',
      treatment: 'Surgery + Voice therapy'
    },
    {
      name: 'Vocal Fold Paralysis',
      description: 'Lack of movement in one or both folds due to nerve damage.',
      etiology: 'Surgical trauma (thyroid), viral, idiopathic',
      treatment: 'Injection medialization, thyroplasty, voice therapy'
    },
    {
      name: 'Muscle Tension Dysphonia (MTD)',
      description: 'Excessive laryngeal muscle tension without structural pathology.',
      etiology: 'Stress, compensatory patterns',
      treatment: 'Laryngeal massage, Resonant Voice Therapy'
    }
  ],
  capeV: [
    { id: 'overall', label: 'Overall Severity', description: 'Global perception of voice quality.' },
    { id: 'roughness', label: 'Roughness', description: 'Perceived irregularity in the voicing source.' },
    { id: 'breathiness', label: 'Breathiness', description: 'Audible air escape in the voice.' },
    { id: 'strain', label: 'Strain', description: 'Perception of excessive vocal effort (hyperfunction).' },
    { id: 'pitch', label: 'Pitch', description: 'Perceptual correlate of fundamental frequency.' },
    { id: 'loudness', label: 'Loudness', description: 'Perceptual correlate of intensity.' }
  ],
  vhi10: [
    { id: 1, text: 'My voice makes it difficult for people to hear me.' },
    { id: 2, text: 'People have difficulty understanding me in a noisy room.' },
    { id: 3, text: 'My family has difficulty hearing me when I call them throughout the house.' },
    { id: 4, text: 'I use the phone less often than I would like to.' },
    { id: 5, text: 'I tend to avoid groups of people because of my voice.' },
    { id: 6, text: 'I speak with friends, neighbors, or relatives less often because of my voice.' },
    { id: 7, text: 'People ask me to repeat myself when speaking face-to-face.' },
    { id: 8, text: 'My voice difficulties restrict my personal and social life.' },
    { id: 9, text: 'I feel left out of conversations because of my voice.' },
    { id: 10, text: 'My voice problem causes me to lose income.' }
  ],
  acousticNorms: [
    { measure: 'Fundamental Frequency (F0)', male: '100-120 Hz', female: '180-220 Hz' },
    { measure: 'Jitter (Frequency Perturbation)', norm: '< 1.040%', description: 'Cycle-to-cycle variation in frequency.' },
    { measure: 'Shimmer (Amplitude Perturbation)', norm: '< 3.810%', description: 'Cycle-to-cycle variation in amplitude.' },
    { measure: 'HNR (Harmonic-to-Noise Ratio)', norm: '> 20 dB', description: 'Ratio of periodic to aperiodic energy.' }
  ]
};
