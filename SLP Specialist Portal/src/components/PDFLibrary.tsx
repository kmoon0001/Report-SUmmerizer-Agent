import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Download, 
  Search, 
  ExternalLink, 
  BookOpen,
  ClipboardCheck,
  Activity,
  Brain,
  Wind,
  MessageCircle,
  ZoomIn,
  ZoomOut,
  X,
  Printer,
  Upload,
  Trash2,
  Eye
} from 'lucide-react';
import { cn } from '../lib/utils';
import { persistenceService, SavedPDF } from '../services/persistence-service';
import { PatientViewWrapper } from './layout/PatientViewWrapper';
import { useNotifications } from '../context/NotificationContext';

interface PDFResource {
  id: string;
  title: string;
  category: 'Assessment' | 'Handout' | 'Protocol' | 'Education' | 'Custom';
  url: string;
  description: string;
  icon: any;
  isCustom?: boolean;
}

const PDF_RESOURCES: PDFResource[] = [
  {
    id: 'yale-swallow',
    title: 'Yale Swallow Protocol',
    category: 'Assessment',
    url: 'https://www.yaleswallowprotocol.com/',
    description: 'The 3-ounce water swallow challenge for aspiration risk screening (Official Protocol).',
    icon: Activity
  },
  {
    id: 'eat-10',
    title: 'EAT-10 Assessment',
    category: 'Assessment',
    url: 'https://www.nestlehealthscience.us/brands/thickenup/eat-10',
    description: '10-item screening tool for dysphagia symptom severity (Landing Page).',
    icon: ClipboardCheck
  },
  {
    id: 'slums-exam',
    title: 'SLUMS Examination',
    category: 'Assessment',
    url: 'https://www.slu.edu/medicine/internal-medicine/geriatric-medicine/slums-exam.php',
    description: 'Saint Louis University Mental Status exam for cognitive screening (Landing Page).',
    icon: Brain
  },
  {
    id: 'guss-screen',
    title: 'GUSS Swallowing Screen',
    category: 'Assessment',
    url: 'https://www.guss-scale.com/',
    description: 'Gugging Swallowing Screen for acute stroke patients (Official Tool).',
    icon: Activity
  },
  {
    id: 'ohat-tool',
    title: 'OHAT Oral Health Tool',
    category: 'Assessment',
    url: 'https://www.health.gov.au/resources/publications/oral-health-assessment-tool-ohat',
    description: 'Oral Health Assessment Tool for dental and hygiene screening (Landing Page).',
    icon: FileText
  },
  {
    id: 'iddsi-handouts',
    title: 'IDDSI Framework',
    category: 'Handout',
    url: 'https://iddsi.org/Framework',
    description: 'Official IDDSI Framework and Descriptors (Landing Page).',
    icon: BookOpen
  },
  {
    id: 'emst-guide',
    title: 'EMST-150 User Guide',
    category: 'Protocol',
    url: 'https://www.emst150.com/',
    description: 'Instructions and resources for Expiratory Muscle Strength Training (Landing Page).',
    icon: Wind
  },
  {
    id: 'medicare-therapy',
    title: 'Medicare Therapy Guide',
    category: 'Education',
    url: 'https://www.medicare.gov/coverage/outpatient-therapy-services',
    description: 'Official Medicare information for outpatient therapy services.',
    icon: FileText
  },
  {
    id: 'sfa-worksheet',
    title: 'Semantic Feature Analysis',
    category: 'Handout',
    url: 'https://tactustherapy.com/what-is-sfa-semantic-feature-analysis-aphasia/',
    description: 'Treatment activity guide for word retrieval and semantic mapping (Landing Page).',
    icon: MessageCircle
  },
  {
    id: 'srt-template',
    title: 'Spaced Retrieval Template',
    category: 'Protocol',
    url: 'https://www.asha.org/practice-portal/clinical-topics/cognitive-communication/',
    description: 'Clinical resources for implementing Spaced Retrieval Training (ASHA Portal).',
    icon: ClipboardCheck
  },
  {
    id: 'cog-comm-checklist',
    title: 'Cognitive-Comm Checklist',
    category: 'Assessment',
    url: 'https://www.asha.org/practice-portal/clinical-topics/cognitive-communication/',
    description: 'Checklist for identifying cognitive-communication deficits (ASHA Portal).',
    icon: Brain
  },
  {
    id: 'wab-bedside',
    title: 'WAB-R Bedside Record Form',
    category: 'Assessment',
    url: 'https://www.pearsonassessments.com/store/usassessments/en/Store/Professional-Assessments/Speech-%26-Language/Western-Aphasia-Battery-Revised/p/100000171.html',
    description: 'Short bedside version of the Western Aphasia Battery - Revised (Publisher Info).',
    icon: MessageCircle
  },
  {
    id: 'bdae-short',
    title: 'BDAE-3 Short Form',
    category: 'Assessment',
    url: 'https://www.proedinc.com/products/boston-diagnostic-aphasia-examination-third-edition-bdae-3', 
    description: 'Short form of the Boston Diagnostic Aphasia Examination (Publisher Info).',
    icon: MessageCircle
  },
  {
    id: 'cape-v',
    title: 'CAPE-V Form',
    category: 'Assessment',
    url: 'https://www.asha.org/practice-portal/clinical-topics/voice-disorders/',
    description: 'Consensus Auditory-Perceptual Evaluation of Voice (ASHA Practice Portal).',
    icon: Activity
  },
  {
    id: 'vhi-10',
    title: 'Voice Handicap Index-10',
    category: 'Assessment',
    url: 'https://www.asha.org/practice-portal/clinical-topics/voice-disorders/',
    description: 'Patient-reported outcome measure for voice disorders (ASHA Practice Portal).',
    icon: Activity
  },
  {
    id: 'fda-2',
    title: 'Frenchay Dysarthria Assessment',
    category: 'Assessment',
    url: 'https://www.proedinc.com/products/frenchay-dysarthria-assessment-second-edition-fda-2',
    description: 'Standardized assessment for dysarthria (Publisher Info).',
    icon: Activity
  },
  {
    id: 'ciat-aphasia',
    title: 'Constraint-Induced Aphasia Therapy',
    category: 'Protocol',
    url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4588672/',
    description: 'Pilot trial of CIAT for chronic post-stroke aphasia (PDF).',
    icon: ClipboardCheck
  },
  {
    id: 'vnest-protocol',
    title: 'Verb Network Strengthening Treatment (VNeST)',
    category: 'Protocol',
    url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4151044/',
    description: 'Evidence-based treatment for lexical retrieval in aphasia (PMC Article).',
    icon: MessageCircle
  },
  {
    id: 'lpaa-aphasia',
    title: 'Life Participation Approach to Aphasia (LPAA)',
    category: 'Education',
    url: 'https://www.asha.org/practice-portal/clinical-topics/aphasia/life-participation-approach-to-aphasia/',
    description: 'Patient-driven service delivery model for aphasia (ASHA Portal).',
    icon: BookOpen
  },
  {
    id: 'alexia-assessment',
    title: 'Alexia Assessment and Treatment',
    category: 'Assessment',
    url: 'https://www.aphasia.org/',
    description: 'Evidence-based approaches for aphasia assessment and treatment (National Aphasia Association).',
    icon: Activity
  },
  {
    id: 'brain-behavior-relationships',
    title: 'Brain-Behavior Relationships',
    category: 'Education',
    url: 'https://www.neuroskills.com/brain-injury/brain-function/',
    description: 'Overview of brain damage and cognitive-communication impairment.',
    icon: Brain
  },
  {
    id: 'gcs-scale',
    title: 'Glasgow Coma Scale (GCS)',
    category: 'Assessment',
    url: 'https://www.glasgowcomascale.org/',
    description: 'Standardized scale for assessing level of consciousness (Official Website).',
    icon: Brain
  },
  {
    id: 'cam-icu-rass',
    title: 'CAM-ICU & RASS',
    category: 'Assessment',
    url: 'https://www.icudelirium.org/medical-professionals/delirium/monitoring-delirium-in-the-icu',
    description: 'Tools for monitoring delirium and sedation in the ICU (Landing Page).',
    icon: Activity
  },
  {
    id: 'moca-test',
    title: 'MoCA Assessment',
    category: 'Assessment',
    url: 'https://www.mocatest.org/',
    description: 'Montreal Cognitive Assessment official website and certification.',
    icon: Brain
  },
  {
    id: 'rancho-levels',
    title: 'Rancho Levels of Cognitive Functioning',
    category: 'Assessment',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK448182/',
    description: 'Clinical guide to the Rancho Los Amigos Scale (StatPearls).',
    icon: Brain
  },
  {
    id: 'vocal-hygiene',
    title: 'Taking Care of Your Voice',
    category: 'Handout',
    url: 'https://www.nidcd.nih.gov/health/taking-care-your-voice',
    description: 'Vocal hygiene tips and education from the NIDCD.',
    icon: Activity
  },
  {
    id: 'comm-boards',
    title: 'Communication Boards',
    category: 'Handout',
    url: 'https://www.patientprovidercommunication.org/covid-19-free-tools/',
    description: 'Free printable communication boards for acute care.',
    icon: MessageCircle
  },
  {
    id: 'swallow-exercises',
    title: 'Swallowing Exercises',
    category: 'Handout',
    url: 'https://www.mskcc.org/cancer-care/patient-education/swallowing-exercises-head-neck-cancer',
    description: 'Guide to common swallowing exercises (Masako, Shaker, etc.).',
    icon: Activity
  },
  {
    id: 'aphasia-tips',
    title: 'Aphasia Communication Tips',
    category: 'Handout',
    url: 'https://www.aphasia.org/aphasia-resources/communication-tips/',
    description: 'Practical strategies for families and caregivers of people with aphasia.',
    icon: MessageCircle
  },
  {
    id: 'speak-out-info',
    title: 'SPEAK OUT! Therapy',
    category: 'Education',
    url: 'https://parkinsonvoiceproject.org/program/speak-out/',
    description: 'Evidence-based speech treatment for Parkinson’s disease.',
    icon: Wind
  },
  {
    id: 'lsvt-loud-info',
    title: 'LSVT LOUD Therapy',
    category: 'Education',
    url: 'https://www.lsvtglobal.com/LSVTLOUD',
    description: 'Gold-standard voice treatment for Parkinson’s and other neurological conditions.',
    icon: Wind
  },
  {
    id: 'asha-swallowing',
    title: 'Swallowing Disorders in Adults',
    category: 'Education',
    url: 'https://www.asha.org/public/speech/swallowing/swallowing-disorders-in-adults/',
    description: 'Comprehensive guide to signs, causes, and treatments (ASHA).',
    icon: Activity
  },
  {
    id: 'passy-muir-info',
    title: 'Passy Muir Speaking Valves',
    category: 'Education',
    url: 'https://www.passy-muir.com/patient-education/',
    description: 'Patient education and resources for tracheostomy speaking valves.',
    icon: Wind
  },
  {
    id: 'tbi-cog-strategies',
    title: 'TBI Cognitive Strategies',
    category: 'Handout',
    url: 'https://www.brainline.org/article/cognitive-strategies-after-brain-injury',
    description: 'Practical tips for managing attention and memory after brain injury.',
    icon: Brain
  },
  {
    id: 'asha-doc-guide',
    title: 'SLP Documentation Guide',
    category: 'Education',
    url: 'https://www.asha.org/practice/reimbursement/medicare/slp_documentation/',
    description: 'ASHA guide for Medicare documentation and reimbursement.',
    icon: FileText
  },
  {
    id: 'asha-ethics',
    title: 'ASHA Code of Ethics',
    category: 'Education',
    url: 'https://www.asha.org/code-of-ethics/',
    description: 'The official ethical standards for speech-language pathologists.',
    icon: FileText
  },
  {
    id: 'icd-10-codes',
    title: 'ICD-10 SLP Codes',
    category: 'Education',
    url: 'https://www.asha.org/practice/reimbursement/coding/icd-10/',
    description: 'Quick reference for common SLP diagnosis codes.',
    icon: FileText
  },
  {
    id: 'informed-consent',
    title: 'Documenting Informed Consent',
    category: 'Education',
    url: 'https://www.medbridgeeducation.com/blog/2017/01/informed-consent-and-dysphagia-management/',
    description: 'Guide for documenting informed consent in dysphagia care.',
    icon: FileText
  }
];

const SCENARIOS = {
  'Dysphagia Screening': ['yale-swallow', 'eat-10', 'guss-screen', 'asha-swallowing', 'informed-consent'],
  'Aphasia Assessment': ['wab-bedside', 'bdae-short', 'sfa-worksheet', 'aphasia-tips', 'ciat-aphasia', 'vnest-protocol'],
  'Cognitive Screening': ['slums-exam', 'cog-comm-checklist', 'gcs-scale', 'cam-icu-rass', 'moca-test', 'rancho-levels', 'tbi-cog-strategies'],
  'Voice & Airway': ['cape-v', 'vhi-10', 'vocal-hygiene', 'speak-out-info', 'lsvt-loud-info', 'passy-muir-info'],
  'Ethics & Billing': ['asha-ethics', 'icd-10-codes', 'asha-doc-guide']
};

export const PDFLibrary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [selectedPDF, setSelectedPDF] = useState<PDFResource | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [userPDFs, setUserPDFs] = useState<SavedPDF[]>([]);
  const [isPatientView, setIsPatientView] = useState(false);
  const { notify, confirm } = useNotifications();

  useEffect(() => {
    setUserPDFs(persistenceService.getPDFs());
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      notify('error', 'Please upload a PDF file.');
      return;
    }

    // Check size (2MB limit for localStorage safety)
    if (file.size > 2 * 1024 * 1024) {
      notify('error', 'File size exceeds 2MB limit for local storage.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result as string;
      const newPDF: SavedPDF = {
        id: Date.now().toString(),
        name: file.name,
        category: 'Custom',
        data: data,
        date: new Date().toISOString(),
        size: file.size
      };
      try {
        persistenceService.savePDF(newPDF);
        setUserPDFs(prev => [newPDF, ...prev]);
        notify('success', 'PDF uploaded successfully!');
      } catch (_err) {
        notify('error', 'Failed to save PDF. Storage quota might be full.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeletePDF = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const confirmed = await confirm({
      title: 'Delete PDF?',
      message: 'Are you sure you want to delete this PDF?',
      type: 'danger'
    });
    if (confirmed) {
      persistenceService.deletePDF(id);
      setUserPDFs(prev => prev.filter(p => p.id !== id));
      notify('success', 'PDF deleted.');
    }
  };

  const allResources: PDFResource[] = [
    ...(Array.isArray(userPDFs) ? userPDFs.map(pdf => ({
      id: pdf.id,
      title: pdf.name,
      category: 'Custom' as const,
      url: pdf.data,
      description: `Uploaded on ${new Date(pdf.date).toLocaleDateString()}`,
      icon: FileText,
      isCustom: true
    })) : []),
    ...PDF_RESOURCES
  ];

  const filteredResources = allResources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          res.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !activeCategory || res.category === activeCategory;
    const matchesScenario = !activeScenario || (activeScenario && SCENARIOS[activeScenario as keyof typeof SCENARIOS]?.includes(res.id));
    return matchesSearch && matchesCategory && matchesScenario;
  });

  const categories = Array.from(new Set(Array.isArray(allResources) ? allResources.map(r => r.category) : []));

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 10, 50));

  const renderContent = () => (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">PDF Resource Vault</h2>
          <p className="text-slate-500 font-medium">Quick access to assessments, handouts, and clinical protocols.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => setIsPatientView(true)}
            className="flex items-center gap-3 px-6 py-4 bg-emerald-100 text-emerald-700 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-emerald-200 transition-all shadow-lg shadow-emerald-100 min-h-[44px]"
          >
            <Eye className="w-5 h-5" />
            Patient View
          </button>
          <div className="relative">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="pdf-upload"
            />
            <label 
              htmlFor="pdf-upload"
              className="flex items-center gap-3 px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-blue-700 transition-colors cursor-pointer shadow-lg shadow-blue-200 min-h-[44px]"
            >
              <Upload className="w-5 h-5" />
              Upload PDF
            </label>
          </div>
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
            <input 
              type="text"
              placeholder="Search PDFs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-full sm:w-80 shadow-sm text-base min-h-[44px]"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button 
          onClick={() => setActiveCategory(null)}
          className={cn(
            "px-8 py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all border min-h-[44px]",
            !activeCategory 
              ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200" 
              : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
          )}
        >
          All Resources
        </button>
        {Array.isArray(categories) && categories.map(cat => (
          <button 
            key={cat}
            onClick={() => { setActiveCategory(cat); setActiveScenario(null); }}
            className={cn(
              "px-8 py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all border whitespace-nowrap min-h-[44px]",
              activeCategory === cat 
                ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200" 
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            )}
          >
            {cat}s
          </button>
        ))}
        {Object.keys(SCENARIOS).map(scenario => (
          <button 
            key={scenario}
            onClick={() => { setActiveScenario(scenario); setActiveCategory(null); }}
            className={cn(
              "px-8 py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all border whitespace-nowrap min-h-[44px]",
              activeScenario === scenario 
                ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200" 
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            )}
          >
            {scenario}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(filteredResources) && filteredResources.map((res, idx) => (
          <motion.div
            key={res.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all flex flex-col"
          >
            <div className="flex items-start justify-between mb-6">
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-3",
                res.category === 'Assessment' ? "bg-blue-50 text-blue-600" :
                res.category === 'Handout' ? "bg-emerald-50 text-emerald-600" :
                res.category === 'Protocol' ? "bg-orange-50 text-orange-600" :
                res.category === 'Custom' ? "bg-slate-100 text-slate-600" :
                "bg-purple-50 text-purple-600"
              )}>
                <res.icon className="w-7 h-7" />
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-slate-50 px-3 py-1 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {res.category}
                </div>
                {res.isCustom && (
                  <button 
                    onClick={(e) => handleDeletePDF(e, res.id)}
                    className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded-lg text-slate-300 transition-colors"
                    title="Delete PDF"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
              {res.title}
            </h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 flex-1">
              {res.description}
            </p>

            <div className="flex items-center gap-3 mt-auto">
              <button 
                onClick={() => setSelectedPDF(res)}
                className="flex-1 bg-slate-900 text-white py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200 min-h-[56px]"
              >
                <BookOpen className="w-5 h-5" />
                View PDF
              </button>
              {res.category === 'Handout' && (
                <button 
                  onClick={() => {
                    import('../utils/pdf-generator').then(mod => mod.generateHEP(res.title, [res.description]));
                  }}
                  className="w-14 h-14 rounded-2xl border border-emerald-200 flex items-center justify-center text-emerald-600 hover:bg-emerald-50 transition-all min-h-[56px]"
                  title="Download HEP"
                >
                  <Download className="w-6 h-6" />
                </button>
              )}
              <button 
                onClick={() => window.open(res.url, '_blank')}
                className="w-14 h-14 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all min-h-[56px]"
                title="Open in new tab"
              >
                <ExternalLink className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Search className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">No PDFs Found</h3>
          <p className="text-slate-500 font-medium">Try adjusting your search or category filters.</p>
        </div>
      )}

      {/* PDF Viewer Modal */}
      <AnimatePresence>
        {selectedPDF && (
          <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full h-full max-w-6xl rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    selectedPDF.category === 'Assessment' ? "bg-blue-100 text-blue-600" :
                    selectedPDF.category === 'Handout' ? "bg-emerald-100 text-emerald-600" :
                    "bg-slate-200 text-slate-600"
                  )}>
                    <selectedPDF.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{selectedPDF.title}</h3>
                    <p className="text-xs text-slate-500">{selectedPDF.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 mr-4">
                    <button onClick={handleZoomOut} className="p-2 hover:bg-slate-100 rounded-md text-slate-500">
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold text-slate-700 w-12 text-center">{zoomLevel}%</span>
                    <button onClick={handleZoomIn} className="p-2 hover:bg-slate-100 rounded-md text-slate-500">
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => window.print()}
                    className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors"
                    title="Print PDF"
                  >
                    <Printer className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => window.open(selectedPDF.url, '_blank')}
                    className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setSelectedPDF(null)}
                    className="p-2 hover:bg-red-50 hover:text-red-600 rounded-xl text-slate-400 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="flex-1 bg-slate-100 overflow-auto flex items-center justify-center p-8 relative">
                <div 
                  className="bg-white shadow-xl transition-transform origin-top w-full h-full flex flex-col items-center justify-center p-12"
                  style={{ 
                    transform: `scale(${zoomLevel / 100})` 
                  }}
                >
                  <div className="text-center space-y-4">
                    <FileText className="w-16 h-16 text-slate-300 mx-auto" />
                    <h3 className="text-xl font-bold text-slate-900">External Resource</h3>
                    <p className="text-slate-500 max-w-sm">This resource is hosted on an external website and cannot be displayed directly here.</p>
                    <button 
                      onClick={() => window.open(selectedPDF.url, '_blank')}
                      className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                    >
                      Open in New Tab
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      {isPatientView ? (
        <PatientViewWrapper title="PDF Resource Vault" onExit={() => setIsPatientView(false)}>
          {renderContent()}
        </PatientViewWrapper>
      ) : (
        renderContent()
      )}
    </>
  );
};
