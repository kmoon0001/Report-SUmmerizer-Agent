export const MEDICARE_KNOWLEDGE_BASE = {
  chapter15: {
    title: "Medicare Benefit Policy Manual, Chapter 15 - Covered Medical and Other Health Services",
    sections: [
      {
        id: "220",
        title: "Coverage of Outpatient Rehabilitation Therapy Services (PT, OT, SLP)",
        content: `
          Medicare Part B pays for outpatient rehabilitation services, including Speech-Language Pathology (SLP), when they are reasonable and necessary.
          Requirements:
          1. The patient must be under the care of a physician or non-physician practitioner (NPP).
          2. Services must be furnished under a written plan of care (POC) established and periodically reviewed by a physician/NPP or the therapist providing the services.
          3. The services must require the skills of a qualified therapist.
          4. The services must be reasonable and necessary for the treatment of the patient's illness or injury.
          
          Certification of the POC is required within 30 days of the initial therapy treatment. Recertification is required at least every 90 days.
          Progress reports must be written by the clinician at least once every 10 treatment days.
        `
      },
      {
        id: "230",
        title: "Practice of Speech-Language Pathology",
        content: `
          Speech-language pathology services are those services provided within the scope of practice of speech-language pathologists. 
          Covered services include evaluation and treatment of speech, language, voice, communication, and swallowing disorders.
          The services must be of such a level of complexity and sophistication or the condition of the patient must be such that the services required can be safely and effectively performed only by a qualified therapist.
        `
      }
    ]
  },
  jimmo: {
    title: "Jimmo v. Sebelius Settlement Agreement",
    content: `
      The Jimmo v. Sebelius settlement clarified that the Medicare program covers skilled nursing care and skilled therapy services (PT, OT, SLP) under Medicare's skilled nursing facility, home health, and outpatient therapy benefits when a patient needs skilled care in order to maintain function or to prevent or slow decline or deterioration (provided all other coverage criteria are met).
      
      Key Takeaways:
      - An "Improvement Standard" cannot be applied to deny Medicare coverage.
      - Medicare coverage depends on whether the *skills of a therapist* are required to perform a safe and effective maintenance program.
      - Documentation must clearly show why the specialized skills, knowledge, and judgment of an SLP are necessary to maintain the patient's current condition or prevent/slow further deterioration. Routine exercises that can be performed safely by unskilled personnel or caregivers are not covered.
    `
  },
  noridian: {
    title: "Noridian Local Coverage Determinations (LCD) for SLP",
    content: `
      Noridian serves as a Medicare Administrative Contractor (MAC). Their guidelines stipulate:
      - Medical necessity must be clearly documented. The documentation must support that the patient has a specific diagnosis or condition that requires SLP intervention.
      - Baseline data must be established during the initial evaluation to measure progress (or maintenance, per Jimmo).
      - Treatment goals must be functional, measurable, and have a specific timeframe.
      - Daily treatment notes must include the date, specific interventions provided, total time spent, and the signature/credentials of the treating clinician.
      - Dysphagia treatment requires objective evidence of a swallowing disorder (e.g., clinical bedside swallow evaluation or instrumental assessment like MBSS/FEES) and a clear risk of aspiration or nutritional compromise.
    `
  }
};
