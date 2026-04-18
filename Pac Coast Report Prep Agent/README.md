# SNF Rehab Agent - AI-Powered Documentation Assistant

## Overview
The SNF Rehab Agent is a Microsoft Copilot Studio-based AI assistant designed to support physical therapy (PT), occupational therapy (OT), and speech-language pathology (SLP) teams in skilled nursing facilities with clinical documentation.

## Key Features

### 🤖 AI-Powered Documentation Support
- Generates daily briefings for therapists summarizing patient caseloads
- Creates documentation support for evaluations, progress notes, recertifications, and discharges
- Provides medical necessity justification and skilled service bullets
- Identifies compliance flags and recommended actions

### 🔍 Explainable AI (XAI)
- **SHAP Values**: Shows which data points influenced each recommendation and by how much
- **Confidence Scoring**: Multi-dimensional confidence based on data completeness, model certainty, and historical accuracy
- **Evidence Chains**: Complete transparency of source data and reasoning steps
- **Counterfactual Scenarios**: "What-if" analysis showing decision boundaries

### 👥 Human-in-the-Loop (HITL)
- **Tier 1 - Pre-Generation Review**: Data validation before AI runs
- **Tier 2 - Post-Generation Review**: Clinician review with side-by-side comparison
- **Tier 3 - Supervisory Review**: Director of Rehab batch approval with risk stratification

### 🛡️ Enterprise-Grade Security & Compliance
- 21 CFR Part 11 compliant audit trails
- HIPAA-aligned data handling
- Microsoft Purview integration for AI governance
- Field-level security and DLP policies
- 7-year audit retention

### 📊 Continuous Learning
- Captures clinician edits and rejections
- Feeds back to model improvement pipeline
- A/B testing of prompt variations
- Drift detection and retraining triggers

## Architecture

### Technology Stack
- **Copilot Studio**: Conversational AI platform
- **Power Automate**: Workflow orchestration
- **Dataverse**: Data storage and management
- **Azure Machine Learning**: Model training and SHAP calculations
- **Microsoft Teams**: User interface via Adaptive Cards
- **Power BI**: Analytics and dashboards

### Data Flow
```
PCC/Optima (EHR) → Dataverse → Power Automate → Copilot Studio → Teams
                                      ↓
                              Azure ML (SHAP)
                                      ↓
                              Confidence Scoring
                                      ↓
                              HITL Review
                                      ↓
                              Finalized Documentation
```

## Getting Started

### Prerequisites
- Microsoft 365 E5 or Copilot Studio license
- Power Platform environment with Dataverse
- Azure subscription for ML components
- Microsoft Teams

### Installation
1. Import the managed solution from `solutions/` folder
2. Configure environment variables (see `docs/Configuration.md`)
3. Set up Dataverse tables (see `docs/Dataverse_Schema.md`)
4. Deploy Power Automate flows
5. Configure security roles and permissions
6. Register in Microsoft Purview AI Hub

### Configuration
See detailed configuration guide in `docs/Configuration.md` (to be created).

## Documentation

### Core Documentation
- **[Production Hardening Playbook](SNF_Copilot_Prod_Hardening_Playbook.md)**: Comprehensive guide for production deployment
- **[XAI Architecture](docs/XAI_Architecture.md)**: Explainable AI implementation details
- **[HITL Workflow Design](docs/HITL_Workflow_Design.md)**: Human-in-the-loop mechanisms
- **[Error Handling & Resilience](docs/Error_Handling_Resilience_Guide.md)**: Enterprise-grade error handling
- **[Automation & UX Enhancements](docs/Automation_UX_Enhancements.md)**: Zero-touch workflows and smart inputs
- **[Dataverse Schema](docs/Dataverse_Schema.md)**: Database structure and relationships
- **[Microsoft Learn Alignment](docs/Microsoft_Learn_Alignment.md)**: Compliance with Microsoft best practices
- **[Implementation Checklist](docs/Implementation_Checklist.md)**: Deployment guide
- **[Production Readiness Checklist](docs/Production_Readiness_Checklist.md)**: Pre-launch validation

### Topics (Copilot Studio)
- `AutomatedWorkflowOrchestrator.mcs.yml`: Proactive daily briefings with zero user input
- `SmartPatientSelector.mcs.yml`: Intelligent patient selection (replaces free-text)
- `IntelligentTextEditor.mcs.yml`: Rich editing with AI suggestions and templates
- `XAI_ExplanationGenerator.mcs.yml`: Generates SHAP explanations
- `HITL_PreGenerationReview.mcs.yml`: Tier 1 data validation
- `HITL_PostGenerationReview.mcs.yml`: Tier 2 output review
- `HITL_DORSupervisoryReview.mcs.yml`: Tier 3 supervisory approval
- `GracefulDegradation.mcs.yml`: Fallback functionality when services unavailable
- `OnError.mcs.yml`: Comprehensive error handling with retry logic

### Workflows (Power Automate)
- `AutomatedTherapistDailyWorkflow.json`: Fully automated daily briefing generation
- `CalculateSHAPValues.json`: Computes feature importance
- `CalculateConfidenceScore.json`: Multi-dimensional confidence scoring
- `LogHITLDecision.json`: Comprehensive audit logging
- `EnhancedRetryLogic.json`: Exponential backoff with circuit breaker
- `CheckSystemHealth.json`: Service health monitoring

## Usage

### For Therapists
1. Receive daily briefing in Teams
2. Review AI-generated documentation with confidence scores
3. View SHAP explanations to understand reasoning
4. Edit, approve, or reject outputs
5. Finalized documentation ready for use

### For Directors of Rehab
1. Access DOR dashboard in Teams
2. Review high-risk cases flagged by AI
3. Spot-check medium and low-risk cases
4. Batch approve or return for revision
5. Monitor quality metrics and trends

### For AI Team
1. Monitor model performance in Power BI
2. Review learning events from clinician feedback
3. Analyze drift and fairness metrics
4. Trigger retraining when needed
5. Update prompts based on patterns

## Compliance & Governance

### Regulatory Alignment
- ✅ 21 CFR Part 11 (Electronic Signatures)
- ✅ HIPAA (Privacy and Security)
- ✅ CMS Documentation Guidelines
- ✅ Microsoft Responsible AI Standard v2

### Best Practices
- ✅ Copilot Studio best practices
- ✅ Power Automate best practices
- ✅ Healthcare AI guidance
- ✅ WCAG 2.1 AA accessibility

### Audit & Monitoring
- Complete audit trail of all AI interactions
- Real-time dashboards for HITL metrics
- Quarterly model performance reviews
- Annual compliance assessments

## Development

### Repository Structure
```
.
├── SNF Rehab Agent/
│   ├── topics/              # Copilot Studio topics
│   ├── workflows/           # Power Automate flows
│   ├── agent.mcs.yml        # Agent configuration
│   └── settings.mcs.yml     # Agent settings
├── docs/                    # Documentation
│   ├── XAI_Architecture.md
│   ├── HITL_Workflow_Design.md
│   ├── Dataverse_Schema.md
│   └── Microsoft_Learn_Alignment.md
├── SNF_Copilot_Prod_Hardening_Playbook.md
└── README.md
```

### Contributing
1. Follow Microsoft Learn best practices
2. Maintain HITL mechanisms for all changes
3. Update documentation with code changes
4. Test with de-identified data only
5. Ensure accessibility compliance

### Testing
- Unit tests for Power Automate flows
- Integration tests for end-to-end workflows
- Accessibility testing with assistive technologies
- Clinical validation with licensed therapists
- Security penetration testing

## Support

### Issues & Questions
- Technical issues: Contact IT support
- Clinical questions: Contact Director of Rehab
- Compliance concerns: Contact Compliance Officer
- AI/ML questions: Contact AI Team

### Training Resources
- Clinician training videos (to be created)
- DOR dashboard guide (to be created)
- HITL workflow quick reference (to be created)

## Roadmap

### Phase 1 (Current)
- ✅ Core HITL workflows
- ✅ SHAP-based explanations
- ✅ Confidence scoring
- ✅ Audit logging

### Phase 2 (Q2 2026)
- 🔄 Interactive SHAP visualizations
- 🔄 Mobile app for therapists
- 🔄 Voice input for documentation
- 🔄 Multi-language support

### Phase 3 (Q3 2026)
- 📋 Predictive analytics for outcomes
- 📋 Automated goal progression tracking
- 📋 Integration with additional EHR systems
- 📋 Advanced fairness monitoring

## License
Proprietary - Internal use only

## Acknowledgments
- Built following Microsoft Learn guidance
- Implements Microsoft Responsible AI Standard v2
- Aligned with healthcare AI best practices
- Designed with input from clinical experts

---

**Version**: 1.0.0  
**Last Updated**: 2026-04-16  
**Maintained By**: AI Development Team
