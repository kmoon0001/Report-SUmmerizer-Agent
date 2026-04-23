import React from "react";
import { HandoutMaker } from "../HandoutMaker";
import { ClinicalLibrary } from "../ClinicalLibrary";
import { AssetGallery } from "../AssetGallery";
import { DocumentationAssistant } from "../DocumentationAssistant";
import { VoiceModule } from "../VoiceModule";
import { LocalAIModelManager } from "../LocalAIModelManager";
import { IDDSIGourmetGuide } from "../IDDSIGourmetGuide";
import { ClinicalMeds } from "../ClinicalMeds";
import { HelpSupport } from "../HelpSupport";
import { TherapyStudio } from "../TherapyStudio";
import { DocumentationStudio } from "../DocumentationStudio";
import { AnatomyLab } from "../AnatomyLab";

import { BrainAnatomyExplorer } from "../BrainAnatomyExplorer";

import { ThreeWayEval } from "../ThreeWayEval";
import { Dashboard } from "../Dashboard";
import { PatientProfiles } from "../PatientProfiles";
import { ProgressTracker } from "../ProgressTracker";
import { SubspecialtyDetail } from "../SubspecialtyDetail";
import { TrachVentGuide } from "../TrachVentGuide";
import { AACModule } from "../AACModule";
import { CaseBrainstorm } from "../CaseBrainstorm";
import { ClinicalPathways } from "../ClinicalPathways";
import { MedicareHelper } from "../MedicareHelper";
import { ComplianceCenter } from "../ComplianceCenter";
import { GoalGenerator } from "../GoalGenerator";
import { NetHealthHelp } from "../NetHealthHelp";
import { ModuleErrorBoundary } from "../ModuleErrorBoundary";
import { EnsignSLPCorner } from "../EnsignSLPCorner";
import { SLPLife } from "../SLPLife";
import { ClinicalCalculators } from "../ClinicalCalculators";
import { PDFLibrary } from "../PDFLibrary";
import { DysarthriaEval } from "../DysarthriaEval";
import { AphasiaTools } from "../AphasiaTools";
import { DysphagiaHub } from "../DysphagiaHub";
import { InstrumentalsGuide } from "../InstrumentalsGuide";
import { ClinicalExams } from "../ClinicalExams";
import { MedicareDocChecker } from "../MedicareDocChecker";
import { MotorSpeechModule } from "../MotorSpeechModule";
import { CognitiveModule } from "../CognitiveModule";
import { SLPChat } from "../SLPChat";
import { TreatmentIdeas } from "../TreatmentIdeas";
import { SLP_DATA } from "../../data/slp-data";

import { ClinicalReference } from "../ClinicalReference";

interface ViewManagerProps {
  activeView: string;
  setActiveView: (view: string, params?: any) => void;
  viewParams: any;
}

export const ViewManager: React.FC<ViewManagerProps> = ({
  activeView,
  setActiveView,
  viewParams
}) => {
  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'patient-profiles':
        return <PatientProfiles />;
      case 'progress-tracker':
        return <ProgressTracker />;
      case 'three-way-eval':
        return <ThreeWayEval />;
      case 'iddsi-guide':
      case 'iddsi-gourmet':
        return <IDDSIGourmetGuide />;
      case 'therapy-studio':
        return <TherapyStudio />;
      case 'documentation-studio':
        return <DocumentationStudio />;
      case 'anatomy-lab':
        return <AnatomyLab />;
      case 'stroke-anatomy':
        return <BrainAnatomyExplorer />;
      case 'handout-maker':
        return <HandoutMaker />;
      case 'rag-library':
        return <ClinicalLibrary onBack={() => setActiveView('dashboard')} />;
      case 'asset-gallery':
        return <AssetGallery onBack={() => setActiveView('dashboard')} />;
      case 'documentation-assistant':
        return <DocumentationAssistant />;
      case 'voice-module':
        return <VoiceModule />;
      case 'local-ai-manager':
        return <LocalAIModelManager />;
      case 'medical':
        return <ClinicalMeds onBack={() => setActiveView('dashboard')} />;
      case 'clinical-reference':
        return <ClinicalReference />;
      case 'help':
        return <HelpSupport 
          onBack={() => setActiveView('dashboard')}
        />;
      default: {
        // Handle dynamic category views
        const category = SLP_DATA.find(c => c.id === activeView);
        if (category) {
          switch (category.component) {
            case 'SubspecialtyDetail':
              return <SubspecialtyDetail id={category.id} onNavigate={setActiveView} />;
            case 'TrachVentGuide':
              return <TrachVentGuide />;
            case 'AnatomyLab':
              return <AnatomyLab />;
            case 'AACModule':
              return <AACModule />;
            case 'CaseBrainstorm':
              return <CaseBrainstorm />;
            case 'ClinicalPathways':
              return <ClinicalPathways />;
            case 'MedicareHelper':
              return <MedicareHelper />;
            case 'ComplianceCenter':
              return <ComplianceCenter />;
            case 'DocumentationStudio':
              return <DocumentationStudio />;
            case 'TherapyStudio':
              return <TherapyStudio />;
            case 'GoalGenerator':
              return <GoalGenerator initialTask={viewParams?.task} initialDomain={viewParams?.domain} />;
            case 'HandoutMaker':
              return <HandoutMaker />;
            case 'ClinicalMeds':
              return <ClinicalMeds onBack={() => setActiveView('dashboard')} />;
            case 'NetHealthHelp':
              return <NetHealthHelp />;
            case 'EnsignSLPCorner':
              return <EnsignSLPCorner />;
            case 'ClinicalLibrary':
              return <ClinicalLibrary onBack={() => setActiveView('dashboard')} />;
            case 'SLPLife':
              return <SLPLife />;
            case 'ClinicalCalculators':
              return <ClinicalCalculators />;
            case 'PDFLibrary':
              return <PDFLibrary />;
            case 'DysarthriaEval':
              return <DysarthriaEval />;
            case 'AphasiaTools':
              return <AphasiaTools />;
            case 'DysphagiaHub':
              return <DysphagiaHub />;
            case 'InstrumentalsGuide':
              return <InstrumentalsGuide />;
            case 'MotorSpeechModule':
              return <MotorSpeechModule setActiveView={setActiveView} />;
            case 'CognitiveModule':
              return <CognitiveModule setActiveView={setActiveView} />;
            case 'VoiceModule':
              return <VoiceModule />;
            case 'ClinicalExams':
              return <ClinicalExams />;
            case 'SLPChat':
              return <SLPChat />;
            case 'TreatmentIdeas':
              return <TreatmentIdeas categoryId={viewParams?.categoryId} />;
            default:
              return <SubspecialtyDetail id={category.id} onNavigate={setActiveView} />;
          }
        }
        return <div>View: {activeView}</div>;
      }
    }
  };

  return (
    <ModuleErrorBoundary>
      {renderView()}
    </ModuleErrorBoundary>
  );
};
