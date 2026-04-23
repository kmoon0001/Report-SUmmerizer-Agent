export const MOTOR_SPEECH_DATA = {
  dysarthriaTypes: [
    {
      type: 'Flaccid',
      lesion: 'Lower Motor Neuron',
      characteristics: ['Hypernasality', 'Breathy voice', 'Imprecise consonants', 'Nasal emission'],
      causes: ['Myasthenia Gravis', 'Bulbar Palsy', 'Surgical trauma']
    },
    {
      type: 'Spastic',
      lesion: 'Bilateral Upper Motor Neuron',
      characteristics: ['Strained-strangled voice', 'Slow rate', 'Monopitch', 'Monoloudness'],
      causes: ['Stroke', 'TBI', 'Primary Lateral Sclerosis']
    },
    {
      type: 'Ataxic',
      lesion: 'Cerebellum',
      characteristics: ['Irregular articulatory breakdowns', 'Excess/equal stress', 'Vowel distortions'],
      causes: ['Cerebellar stroke', 'Multiple Sclerosis', 'Alcohol abuse']
    },
    {
      type: 'Hypokinetic',
      lesion: 'Basal Ganglia (Dopamine depletion)',
      characteristics: ['Monopitch', 'Monoloudness', 'Reduced stress', 'Short rushes of speech', 'Rapid rate'],
      causes: ['Parkinson\'s Disease']
    },
    {
      type: 'Hyperkinetic',
      lesion: 'Basal Ganglia (Excess dopamine)',
      characteristics: ['Involuntary movements', 'Variable rate', 'Inappropriate silences', 'Voice stoppages'],
      causes: ['Huntington\'s Disease', 'Dystonia']
    },
    {
      type: 'Mixed',
      lesion: 'Multiple systems',
      characteristics: ['Combination of types'],
      causes: ['ALS (Spastic-Flaccid)', 'MS (Spastic-Ataxic)']
    }
  ],
  apraxiaMarkers: [
    { id: 'inconsistent', label: 'Inconsistent Errors', description: 'Repeated attempts at the same word result in different error patterns.' },
    { id: 'groping', label: 'Articulatory Groping', description: 'Visible or audible searching for articulatory postures.' },
    { id: 'prosody', label: 'Prosodic Abnormalities', description: 'Slow rate, syllable segregation, and equalized stress.' },
    { id: 'length', label: 'Length Effect', description: 'Increased errors as word length or complexity increases.' },
    { id: 'automatic', label: 'Automatic-Volitional Gap', description: 'Better performance on automatic speech (e.g., counting) than volitional speech.' }
  ],
  dttcPrinciples: [
    { step: 1, title: 'Simultaneous Production', description: 'Therapist and patient produce the target together at a slow rate.' },
    { step: 2, title: 'Immediate Imitation', description: 'Patient imitates immediately after the therapist\'s model.' },
    { step: 3, title: 'Delayed Imitation', description: 'Patient imitates after a 1-3 second delay.' },
    { step: 4, title: 'Spontaneous Production', description: 'Patient produces the target in response to a question or picture.' }
  ]
};
