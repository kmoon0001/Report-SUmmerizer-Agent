export interface Medication {
  name: string;
  category: string;
  sideEffects: string[];
  impact: string;
}

export interface LabValue {
  name: string;
  range: string;
  impact: string;
}

export interface ImagingModality {
  name: string;
  altName: string;
  description: string;
  indications: string[];
  slpRole: string;
  image: string;
  video?: string;
}

export interface Vital {
  name: string;
  range: string;
  interpretation: string;
  category: 'Dysphagia' | 'Trach/Vent' | 'General';
}

export const MED_DB: Medication[] = [
  { name: 'Lisinopril', category: 'ACE Inhibitor', sideEffects: ['Dry cough', 'Dizziness'], impact: 'Cough may mimic aspiration; dizziness affects balance/transfers.' },
  { name: 'Omeprazole', category: 'PPI', sideEffects: ['Dry mouth', 'Headache'], impact: 'Xerostomia can affect bolus formation.' },
  { name: 'Gabapentin', category: 'Anticonvulsant', sideEffects: ['Drowsiness', 'Dizziness'], impact: 'Reduced alertness for therapy; fall risk.' },
  { name: 'Donepezil', category: 'Cholinesterase Inhibitor', sideEffects: ['Nausea', 'Insomnia'], impact: 'Used for dementia; monitor for GI upset affecting intake.' },
  { name: 'Levodopa', category: 'Dopamine precursor', sideEffects: ['Dyskinesia', 'Hypotension'], impact: 'Timing with meals is critical for swallowing safety in Parkinson\'s.' },
  { name: 'Metoprolol', category: 'Beta-Blocker', sideEffects: ['Fatigue', 'Dizziness', 'Bradycardia'], impact: 'Reduced exercise tolerance; fatigue may limit therapy participation.' },
  { name: 'Furosemide', category: 'Diuretic', sideEffects: ['Dehydration', 'Electrolyte imbalance'], impact: 'Xerostomia and potential for acute confusion due to dehydration.' },
  { name: 'Alprazolam', category: 'Benzodiazepine', sideEffects: ['Sedation', 'Muscle weakness'], impact: 'Significant aspiration risk due to reduced alertness and pharyngeal weakness.' },
  { name: 'Warfarin', category: 'Anticoagulant', sideEffects: ['Bleeding risk'], impact: 'High risk for intracranial hemorrhage if falls occur.' },
  { name: 'Baclofen', category: 'Muscle Relaxant', sideEffects: ['Sedation', 'Drooling'], impact: 'May cause pharyngeal weakness or excessive secretions affecting swallow safety.' },
  { name: 'Quetiapine', category: 'Antipsychotic', sideEffects: ['Sedation', 'Tardive dyskinesia'], impact: 'Extrapyramidal symptoms can severely impact oral motor control.' },
  { name: 'Haloperidol', category: 'Antipsychotic', sideEffects: ['EPS', 'Tardive Dyskinesia', 'Sedation'], impact: 'Severe oral-motor impairment; high risk for pharyngeal phase dysphagia.' },
  { name: 'Oxycodone', category: 'Opioid', sideEffects: ['Sedation', 'Respiratory depression', 'Confusion'], impact: 'Reduced arousal for safe intake; increased aspiration risk.' },
  { name: 'Prednisone', category: 'Corticosteroid', sideEffects: ['Oral thrush', 'Muscle weakness', 'Hyperglycemia'], impact: 'Oral pain/candidiasis affecting intake; long-term use causes myopathy.' },
  { name: 'Atropine', category: 'Anticholinergic', sideEffects: ['Severe xerostomia', 'Confusion', 'Tachycardia'], impact: 'Inability to form/transit bolus; cognitive barriers to therapy participation.' },
  { name: 'Amlodipine', category: 'Calcium Channel Blocker', sideEffects: ['Peripheral edema', 'Gingival hyperplasia'], impact: 'Oral hygiene challenges; potential discomfort during oral care.' },
  { name: 'Sertraline', category: 'SSRI', sideEffects: ['Nausea', 'Tremors', 'Insomnia'], impact: 'Tremors affecting self-feeding; nausea impacting nutritional intake.' },
  { name: 'Tizanidine', category: 'Muscle Relaxant', sideEffects: ['Sedation', 'Dry mouth', 'Hypotension'], impact: 'Reduced arousal for therapy; significant xerostomia.' },
  { name: 'Gentamicin', category: 'Antibiotic', sideEffects: ['Ototoxicity', 'Nephrotoxicity'], impact: 'Potential for sudden sensorineural hearing loss or vestibular dysfunction.' },
  { name: 'Phenytoin', category: 'Anticonvulsant', sideEffects: ['Gingival hyperplasia', 'Ataxia', 'Confusion'], impact: 'Significant oral health/hygiene issues; balance and coordination deficits.' },
];

export const LAB_DB: LabValue[] = [
  { name: 'Albumin', range: '3.4 - 5.4 g/dL', impact: 'Low levels indicate chronic malnutrition; affects wound healing and muscle strength.' },
  { name: 'Prealbumin', range: '15 - 36 mg/dL', impact: 'Best indicator of current nutritional status and response to nutrition support.' },
  { name: 'BUN', range: '7 - 20 mg/dL', impact: 'High levels suggest dehydration or kidney issues. Dehydration causes xerostomia/confusion.' },
  { name: 'WBC', range: '4.5 - 11.0 x10^9/L', impact: 'Elevated indicates infection (UTI, Pneumonia). Causes acute confusion/delirium.' },
  { name: 'Sodium', range: '135 - 145 mEq/L', impact: 'Imbalance causes significant cognitive changes, lethargy, and potential seizures.' },
  { name: 'Potassium', range: '3.5 - 5.0 mEq/L', impact: 'Imbalance affects muscle contraction and cardiac rhythm.' },
  { name: 'Magnesium', range: '1.7 - 2.2 mg/dL', impact: 'Low levels cause tremors, muscle weakness, and cardiac arrhythmias.' },
  { name: 'Calcium', range: '8.5 - 10.2 mg/dL', impact: 'Hypercalcemia causes confusion/lethargy; Hypocalcemia causes muscle spasms.' },
  { name: 'Hemoglobin', range: '12 - 17.5 g/dL', impact: 'Low levels (Anemia) cause significant fatigue and reduced endurance for therapy.' },
  { name: 'Platelets', range: '150 - 450 x10^3/µL', impact: 'Low levels increase risk of spontaneous bleeding or bruising during transfers.' },
  { name: 'Creatinine', range: '0.6 - 1.2 mg/dL', impact: 'Elevated levels indicate impaired kidney function, affecting drug clearance.' },
  { name: 'Glucose', range: '70 - 100 mg/dL (fasting)', impact: 'Hyper/hypoglycemia causes confusion, dizziness, and altered mental status.' },
  { name: 'HbA1c', range: '< 5.7% (Normal)', impact: 'High levels (>6.5%) indicate poor diabetes control; risk for neuropathy and slow healing.' },
  { name: 'B12', range: '200 - 900 pg/mL', impact: 'Low levels cause "reversible dementia," memory loss, and peripheral neuropathy.' },
  { name: 'TSH', range: '0.4 - 4.0 mIU/L', impact: 'Hypothyroidism causes lethargy, cognitive slowing, and depression.' },
  { name: 'INR', range: '0.8 - 1.1 (Normal)', impact: 'Elevated (e.g., >3.0) indicates high bleeding risk; relevant for post-surgical or stroke patients.' },
  { name: 'Bicarbonate (CO2)', range: '23 - 29 mEq/L', impact: 'High levels suggest respiratory compensation (CO2 retention) or metabolic alkalosis.' },
];

export const IMAGING_DB: ImagingModality[] = [
  {
    name: 'VFSS (Videofluoroscopic Swallow Study)',
    altName: 'Modified Barium Swallow (MBS)',
    description: 'A dynamic X-ray procedure that provides a real-time view of the oral, pharyngeal, and esophageal phases of swallowing.',
    indications: ['Suspected pharyngeal dysphagia', 'Aspiration risk', 'Structural abnormalities', 'Evaluation of compensatory strategies.'],
    slpRole: 'Primary clinician conducting the study, often in collaboration with a radiologist. Responsible for interpreting physiology and recommending diet/strategies.',
    image: 'https://picsum.photos/seed/swallow-xray-fluoroscopy/600/400',
    video: 'https://example.com/vfss-sample.mp4'
  },
  {
    name: 'FEES (Fiberoptic Endoscopic Evaluation of Swallowing)',
    altName: 'Endoscopic Swallow Study',
    description: 'A procedure where a flexible endoscope is passed transnasally to view the pharynx and larynx before and after the swallow.',
    indications: ['Bedside evaluation needed', 'Secretions management concerns', 'Voice/laryngeal concerns', 'Biofeedback therapy.'],
    slpRole: 'Independent or collaborative procedure. Allows for direct visualization of anatomy and residue without radiation exposure.',
    image: 'https://picsum.photos/seed/larynx-endoscopy-medical/600/400',
    video: 'https://example.com/fees-sample.mp4'
  },
  {
    name: 'CT Head / Brain',
    altName: 'Computed Tomography',
    description: 'Cross-sectional X-ray imaging used to detect acute hemorrhage, large infarcts, or structural lesions.',
    indications: ['Acute stroke symptoms', 'Traumatic Brain Injury (TBI)', 'Sudden cognitive decline.'],
    slpRole: 'Reviewing reports to correlate lesion location with expected deficits (e.g., Left MCA stroke -> Aphasia).',
    image: 'https://picsum.photos/seed/ct-scan-brain-axial/600/400'
  },
  {
    name: 'CT Brain',
    altName: 'Computed Tomography',
    description: 'Cross-sectional X-ray imaging used to detect acute hemorrhage, large infarcts, or structural lesions.',
    indications: ['Acute stroke symptoms', 'Traumatic Brain Injury (TBI)', 'Sudden cognitive decline.'],
    slpRole: 'Reviewing reports to correlate lesion location with expected deficits (e.g., Left MCA stroke -> Aphasia).',
    image: 'https://picsum.photos/seed/ct-scan-brain-axial/600/400'
  },
  {
    name: 'MRI Brain',
    altName: 'Magnetic Resonance Imaging',
    description: 'High-resolution imaging using magnetic fields to visualize soft tissue, small infarcts, and white matter tracts.',
    indications: ['Subacute stroke', 'Dementia differential diagnosis', 'Tumor staging', 'Multiple Sclerosis.'],
    slpRole: 'Understanding neuroanatomical correlates of communication and swallowing disorders for targeted therapy.',
    image: 'https://picsum.photos/seed/mri-brain-scan-sagittal/600/400'
  },
  {
    name: 'CXR (Chest X-Ray)',
    altName: 'Chest Radiograph',
    description: 'Static imaging of the lungs, heart, and chest wall to identify pneumonia, pleural effusion, or cardiomegaly.',
    indications: ['Suspected aspiration pneumonia', 'Shortness of breath', 'Cough.'],
    slpRole: 'Monitoring for infiltrates (especially RLL) as a clinical indicator of potential aspiration history.',
    image: 'https://picsum.photos/seed/chest-xray-lungs-heart/600/400'
  }
];

export const VITAL_DB: Vital[] = [
  { name: 'Heart Rate (HR)', range: '60-100 bpm', interpretation: 'Elevated HR may indicate distress, infection, or pain, impacting therapy tolerance.', category: 'General' },
  { name: 'Respiratory Rate (RR)', range: '12-20 bpm', interpretation: 'High RR (>20) increases aspiration risk during swallow; low RR may indicate respiratory failure.', category: 'General' },
  { name: 'O2 Saturation (SpO2)', range: '>92-95%', interpretation: 'Drop during swallow may indicate aspiration; baseline <90% requires O2 support.', category: 'General' },
  { name: 'Temperature', range: '97.8-99.1°F', interpretation: 'Fever (>100.4°F) increases metabolic demand and aspiration pneumonia risk.', category: 'General' },
  { name: 'Cuff Pressure', range: '20-30 cmH2O', interpretation: 'High pressure causes tracheal injury; low pressure increases aspiration risk.', category: 'Trach/Vent' },
  { name: 'FiO2', range: '21% (Room Air)', interpretation: 'Higher FiO2 indicates respiratory compromise, impacting therapy endurance.', category: 'Trach/Vent' },
  { name: 'PEEP', range: '5-20 cmH2O', interpretation: 'Higher PEEP indicates more severe lung injury, impacting speech/swallow coordination.', category: 'Trach/Vent' },
];
