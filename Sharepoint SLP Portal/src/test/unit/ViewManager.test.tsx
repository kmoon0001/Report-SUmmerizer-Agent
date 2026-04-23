import { describe, it, expect, vi } from "vitest";
import { useDashboard } from "../../context/DashboardContext";
import { useDiscipline } from "../../context/DisciplineContext";
import { render, screen } from "@testing-library/react";
import { ViewManager } from "../../components/router/ViewManager";

// Mock dashboard context
vi.mock("../../context/DashboardContext", () => ({
  useDashboard: vi.fn(),
}));

// Mock discipline context
vi.mock("../../context/DisciplineContext", () => ({
  useDiscipline: vi.fn(),
}));

vi.mock("../../components/MotorSpeechModule", () => ({
  default: () => <div>Motor Speech Hub</div>,
}));
vi.mock("../../components/ClinicalCalculators", () => ({
  ClinicalCalculators: () => <div>Clinical Calculators</div>,
}));

// Mock all major components with default exports (for lazy loading)
vi.mock("../../components/Dashboard", () => ({
  default: () => <div>Dashboard View</div>,
}));
vi.mock("../../components/PatientProfiles", () => ({
  default: () => <div>Patient Profiles</div>,
}));
vi.mock("../../components/ProgressTracker", () => ({
  default: () => <div>Progress Tracker</div>,
}));
vi.mock("../../components/TherapyStudio", () => ({
  default: () => <div>Therapy Studio</div>,
}));
vi.mock("../../components/DocumentationStudio", () => ({
  default: () => <div>Documentation Studio</div>,
}));
vi.mock("../../components/AnatomyLab", () => ({
  default: () => <div>Anatomy Lab</div>,
}));
vi.mock("../../components/BrainAnatomyExplorer", () => ({
  default: () => <div>Brain Anatomy</div>,
}));
vi.mock("../../components/HandoutMaker", () => ({
  default: () => <div>Handout Maker</div>,
}));
vi.mock("../../components/ClinicalLibrary", () => ({
  default: () => <div>Clinical Library</div>,
}));
vi.mock("../../components/AssetGallery", () => ({
  default: () => <div>Asset Gallery</div>,
}));
vi.mock("../../components/DocumentationAssistant", () => ({
  default: () => <div>Documentation Assistant</div>,
}));
vi.mock("../../components/LocalAIModelManager", () => ({
  default: () => <div>Local AI Manager</div>,
}));
vi.mock("../../components/ClinicalMeds", () => ({
  default: () => <div>Clinical Meds</div>,
}));
vi.mock("../../components/HelpSupport", () => ({
  default: () => <div>Help Support</div>,
}));
vi.mock("../../components/MedicareHelper", () => ({
  default: () => <div>Medicare Helper</div>,
}));
vi.mock("../../components/PDFLibrary", () => ({
  default: () => <div>PDF Library</div>,
}));
vi.mock("../../components/CaseBrainstorm", () => ({
  default: () => <div>Case Brainstorm</div>,
}));
vi.mock("../../components/ClinicalQualityMeasuresHub", () => ({
  default: () => <div>Quality Measures</div>,
}));
vi.mock("../../components/UltraMISTProtocol", () => ({
  default: () => <div>UltraMIST Protocol</div>,
}));
vi.mock("../../components/PediatricPTHub", () => ({
  default: () => <div>Pediatric PT Hub</div>,
}));
vi.mock("../../components/OrthopedicHub", () => ({
  default: () => <div>Orthopedic Hub</div>,
}));
vi.mock("../../components/NeurologicalHub", () => ({
  default: () => <div>Neurological Hub</div>,
}));
vi.mock("../../components/GeriatricHub", () => ({
  default: () => <div>Geriatric Hub</div>,
}));
vi.mock("../../components/CardiopulmonaryVestibularHub", () => ({
  default: () => <div>Cardiopulmonary Hub</div>,
}));
vi.mock("../../components/SportsPelvicHealthHub", () => ({
  default: () => <div>Sports Pelvic Hub</div>,
}));
vi.mock("../../components/WoundCareHub", () => ({
  default: () => <div>Wound Care Hub</div>,
}));
vi.mock("../../components/PTComplianceCenter", () => ({
  default: () => <div>Compliance Center</div>,
}));
vi.mock("../../components/PTClinicalPathways", () => ({
  default: () => <div>Clinical Pathways</div>,
}));
vi.mock("../../components/ExerciseLibrary", () => ({
  default: () => <div>Exercise Library</div>,
}));
vi.mock("../../components/PTClinicalCalculators", () => ({
  default: () => <div>Clinical Calculators</div>,
}));
vi.mock("../../components/PatientEducationHub", () => ({
  default: () => <div>Patient Education</div>,
}));
vi.mock("../../components/PTCorner", () => ({
  default: () => <div>PT Corner</div>,
}));
vi.mock("../../components/PTMobilityGaitModule", () => ({
  default: () => <div>Mobility Gait</div>,
}));
vi.mock("../../components/HandTherapyHub", () => ({
  default: () => <div>Hand Therapy Hub</div>,
}));
vi.mock("../../components/PTMobilityAssistanceModule", () => ({
  default: () => <div>Mobility Assistance</div>,
}));
vi.mock("../../components/PTMotorControlModule", () => ({
  default: () => <div>Motor Control</div>,
}));
vi.mock("../../components/PTNeuromuscularModule", () => ({
  default: () => <div>Neuromuscular</div>,
}));
vi.mock("../../components/PTResourceCenter", () => ({
  default: () => <div>PT Resource Center</div>,
}));
vi.mock("../../components/PTBalanceFallPreventionModule", () => ({
  default: () => <div>Balance Falls</div>,
}));
vi.mock("../../components/PTPostOpRehabModule", () => ({
  default: () => <div>Post Op Rehab</div>,
}));
vi.mock("../../components/PTDeconditioningBedMobilityModule", () => ({
  default: () => <div>Bed Mobility</div>,
}));
vi.mock("../../components/PTTransferTrainingModule", () => ({
  default: () => <div>Transfer Training</div>,
}));
vi.mock("../../components/PTStairNegotiationModule", () => ({
  default: () => <div>Stair Negotiation</div>,
}));
vi.mock("../../components/PTADLTrainingModule", () => ({
  default: () => <div>ADL Training</div>,
}));
vi.mock("../../components/PTEnergyConservationModule", () => ({
  default: () => <div>Energy Conservation</div>,
}));
vi.mock("../../components/PTPositioningPressureReliefModule", () => ({
  default: () => <div>Positioning</div>,
}));
vi.mock("../../components/PTDementiaMobilityModule", () => ({
  default: () => <div>Dementia Mobility</div>,
}));
vi.mock("../../components/PTRespiratoryPTModule", () => ({
  default: () => <div>Respiratory PT</div>,
}));
vi.mock("../../components/PTContracturePreventionModule", () => ({
  default: () => <div>Contracture Prevention</div>,
}));
vi.mock("../../components/PTPainManagementModule", () => ({
  default: () => <div>Pain Management</div>,
}));
vi.mock("../../components/MedicareDocChecker", () => ({
  default: () => <div>Medicare Doc Checker</div>,
}));
vi.mock("../../components/DysphagiaHub", () => ({
  default: () => <div>Dysphagia Hub</div>,
}));
vi.mock("../../components/AphasiaTools", () => ({
  default: () => <div>Aphasia Tools</div>,
}));
vi.mock("../../components/CognitiveModule", () => ({
  default: () => <div>Cognitive Module</div>,
}));
vi.mock("../../components/VoiceModule", () => ({
  default: () => <div>Voice Module</div>,
}));
vi.mock("../../components/AACModule", () => ({
  default: () => <div>AAC Module</div>,
}));
vi.mock("../../components/MotorSpeechModule", () => ({
  default: () => <div>Motor Speech Hub</div>,
}));
vi.mock("../../components/TrachVentGuide", () => ({
  TrachVentGuide: () => <div>Trach Vent Guide</div>,
}));

const setActiveView = vi.fn();

import { Discipline } from "../../types/discipline";

const renderView = (view: string, discipline: Discipline = "slp") => {
  vi.mocked(useDashboard).mockReturnValue({
    activeView: view,
    setActiveView,
    viewParams: {},
  } as any);

  vi.mocked(useDiscipline).mockReturnValue({
    currentDiscipline: discipline,
    switchDiscipline: vi.fn(),
    config: { hubs: [], tools: [], resources: [], assessmentTools: [], interventionLibrary: [], cptCodes: [], complianceRules: [] } as any,
    getDisciplineConfig: vi.fn(),
    isAuthorized: true,
    setIsAuthorized: vi.fn(),
  });

  return render(<ViewManager />);
};

describe("ViewManager — PT Discipline", () => {
  it("renders PT clinical-calculators", async () => {
    renderView("clinical-calculators", "pt");
    expect(
      await screen.findByText("Clinical Calculators", {}, { timeout: 15000 }),
    ).toBeInTheDocument();
  });

  it("renders orthopedic-hub", async () => {
    renderView("orthopedic-hub", "pt");
    expect(
      await screen.findByText("Orthopedic Hub", {}, { timeout: 15000 }),
    ).toBeInTheDocument();
  });
});

describe("ViewManager — SLP Discipline", () => {
  it("renders SLP clinical-calculators", async () => {
    renderView("clinical-calculators", "slp");
    expect(
      await screen.findByText("Clinical Calculators", {}, { timeout: 15000 }),
    ).toBeInTheDocument();
  });

  it("renders dysphagia-hub", async () => {
    renderView("dysphagia-hub", "slp");
    expect(
      await screen.findByText("Dysphagia Hub", {}, { timeout: 15000 }),
    ).toBeInTheDocument();
  });

  it("renders aphasia-hub", async () => {
    renderView("aphasia-hub", "slp");
    expect(
      await screen.findByText("Aphasia Tools", {}, { timeout: 15000 }),
    ).toBeInTheDocument();
  });

  it("renders motor-speech-hub", async () => {
    renderView("motor-speech-hub", "slp");
    expect(
      await screen.findByText(/Motor Speech Hub/i, {}, { timeout: 15000 }),
    ).toBeInTheDocument();
  });

  it("renders trach-vent-hub", async () => {
    renderView("trach-vent-hub", "slp");
    expect(
      await screen.findByText("Trach Vent Guide", {}, { timeout: 15000 }),
    ).toBeInTheDocument();
  });
});

describe("ViewManager — OT Discipline", () => {
  it("renders hand-therapy-hub", async () => {
    renderView("hand-therapy-hub", "ot");
    expect(
      await screen.findByText("Hand Therapy Hub", {}, { timeout: 15000 }),
    ).toBeInTheDocument();
  });
});

describe("ViewManager — General", () => {
  it("renders unknown view with fallback text", async () => {
    renderView("unknown-view");
    expect(
      await screen.findByText("View: unknown-view", {}, { timeout: 15000 }),
    ).toBeInTheDocument();
  });
});
