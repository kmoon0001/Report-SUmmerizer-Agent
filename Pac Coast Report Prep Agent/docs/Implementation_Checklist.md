# Implementation Checklist for SNF Rehab Agent

## Pre-Deployment

### Environment Setup
- [ ] Provision Power Platform environment with Dataverse
- [ ] Enable Dataverse auditing
- [ ] Configure environment variables
- [ ] Set up Azure ML workspace
- [ ] Create service principals and app registrations
- [ ] Configure network security and firewall rules

### Security & Compliance
- [ ] Complete AI Impact Assessment in Compliance Manager
- [ ] Register agent in Microsoft Purview AI Hub
- [ ] Configure DLP policies for clinical data
- [ ] Apply sensitivity labels to Dataverse tables
- [ ] Set up field-level security
- [ ] Enable Purview DSPM for AI
- [ ] Configure audit log retention (7 years)
- [ ] Execute Business Associate Agreement (BAA) with Microsoft

### Dataverse Configuration
- [ ] Create all tables per schema (see `Dataverse_Schema.md`)
- [ ] Configure relationships between tables
- [ ] Create indexes for performance
- [ ] Set up data retention policies
- [ ] Configure security roles
- [ ] Enable auditing on all tables
- [ ] Test backup and restore procedures

### Power Automate Flows
- [ ] Import all workflow JSON files
- [ ] Configure connection references
- [ ] Set up Azure ML endpoint connections
- [ ] Configure Teams webhook URLs
- [ ] Test error handling and retries
- [ ] Enable flow analytics
- [ ] Document flow dependencies

### Copilot Studio Agent
- [ ] Import agent configuration
- [ ] Configure authentication (Integrated, Always)
- [ ] Set up access control (GroupMembership)
- [ ] Import all topics
- [ ] Configure generative AI settings
- [ ] Test conversation flows
- [ ] Publish to Teams channel

### Azure Machine Learning
- [ ] Deploy SHAP calculation endpoint
- [ ] Deploy confidence scoring endpoint
- [ ] Set up model monitoring
- [ ] Configure drift detection
- [ ] Create retraining pipeline
- [ ] Test model versioning
- [ ] Document model card

### Teams Integration
- [ ] Create Teams channel for DOR reviews
- [ ] Configure bot permissions
- [ ] Test Adaptive Card rendering
- [ ] Set up notification webhooks
- [ ] Test mobile experience
- [ ] Configure deep linking

### Power BI Dashboards
- [ ] Create HITL Effectiveness Dashboard
- [ ] Create Model Performance Dashboard
- [ ] Create Clinician Adoption Dashboard
- [ ] Create Compliance & Audit Dashboard
- [ ] Configure DirectQuery connections
- [ ] Set up incremental refresh
- [ ] Test row-level security

## Testing Phase

### Functional Testing
- [ ] Test Tier 1 HITL (Pre-Generation Review)
- [ ] Test Tier 2 HITL (Post-Generation Review)
- [ ] Test Tier 3 HITL (DOR Supervisory Review)
- [ ] Test SHAP explanation generation
- [ ] Test confidence score calculation
- [ ] Test audit logging
- [ ] Test learning event capture
- [ ] Test all error scenarios

### Integration Testing
- [ ] Test PCC/Optima → Dataverse integration
- [ ] Test Dataverse → Power Automate → Copilot Studio flow
- [ ] Test Azure ML endpoint calls
- [ ] Test Teams notifications
- [ ] Test Power BI data refresh
- [ ] Test end-to-end workflows

### Security Testing
- [ ] Penetration testing
- [ ] Vulnerability scanning
- [ ] Authentication and authorization testing
- [ ] Data encryption verification
- [ ] Audit log integrity testing
- [ ] DLP policy effectiveness testing

### Accessibility Testing
- [ ] WCAG 2.1 AA compliance audit
- [ ] Screen reader testing (NVDA, JAWS)
- [ ] Keyboard navigation testing
- [ ] Color contrast verification
- [ ] Mobile accessibility testing
- [ ] Test with assistive technology users

### Clinical Validation
- [ ] Pilot with 3-5 therapists
- [ ] Validate clinical accuracy of outputs
- [ ] Test medical necessity language
- [ ] Verify compliance flag accuracy
- [ ] Measure time savings
- [ ] Collect clinician feedback
- [ ] Adjust prompts based on feedback

### Performance Testing
- [ ] Load testing (concurrent users)
- [ ] Stress testing (peak loads)
- [ ] Response time measurement
- [ ] Database query optimization
- [ ] Flow execution time analysis
- [ ] Identify and resolve bottlenecks

## Training & Documentation

### User Training
- [ ] Create therapist training videos
- [ ] Create DOR training videos
- [ ] Develop quick reference guides
- [ ] Conduct live training sessions
- [ ] Create FAQ document
- [ ] Set up support channels

### Technical Documentation
- [ ] Document architecture diagrams
- [ ] Create runbooks for common issues
- [ ] Document incident response procedures
- [ ] Create change management process
- [ ] Document disaster recovery plan
- [ ] Create API documentation

### Compliance Documentation
- [ ] Document AI governance framework
- [ ] Create audit procedures
- [ ] Document data retention policies
- [ ] Create privacy impact assessment
- [ ] Document security controls
- [ ] Create compliance reporting templates

## Deployment

### Pilot Deployment
- [ ] Deploy to pilot facility
- [ ] Monitor for 2 weeks
- [ ] Collect metrics and feedback
- [ ] Address issues and concerns
- [ ] Refine workflows based on learnings
- [ ] Document lessons learned

### Production Deployment
- [ ] Deploy to production environment
- [ ] Configure production connections
- [ ] Enable production monitoring
- [ ] Activate audit logging
- [ ] Send go-live communications
- [ ] Provide on-call support

### Post-Deployment
- [ ] Monitor system health (first 48 hours)
- [ ] Review audit logs daily (first week)
- [ ] Collect user feedback
- [ ] Address urgent issues
- [ ] Schedule follow-up training
- [ ] Plan first optimization cycle

## Ongoing Operations

### Daily Operations
- [ ] Monitor system health dashboard
- [ ] Review error logs
- [ ] Check HITL metrics
- [ ] Monitor model performance
- [ ] Respond to support tickets

### Weekly Operations
- [ ] Review learning events
- [ ] Analyze clinician feedback
- [ ] Check for drift indicators
- [ ] Review security alerts
- [ ] Update documentation as needed

### Monthly Operations
- [ ] Generate compliance reports
- [ ] Review model performance trends
- [ ] Analyze HITL effectiveness
- [ ] Conduct security reviews
- [ ] Plan prompt optimizations

### Quarterly Operations
- [ ] Model performance review
- [ ] Fairness and bias audit
- [ ] Accessibility audit
- [ ] Security assessment
- [ ] Compliance certification
- [ ] Stakeholder review meeting

### Annual Operations
- [ ] Comprehensive AI impact assessment
- [ ] Full security audit
- [ ] Regulatory compliance review
- [ ] Disaster recovery drill
- [ ] Model retraining evaluation
- [ ] Strategic roadmap update

## Continuous Improvement

### Model Improvement
- [ ] Analyze learning events monthly
- [ ] Identify prompt improvement opportunities
- [ ] A/B test prompt variations
- [ ] Retrain models when drift detected
- [ ] Update SHAP calculations
- [ ] Refine confidence scoring

### Workflow Optimization
- [ ] Streamline HITL processes
- [ ] Reduce cognitive load for clinicians
- [ ] Optimize Adaptive Card designs
- [ ] Improve error messages
- [ ] Enhance mobile experience
- [ ] Add keyboard shortcuts

### Feature Enhancements
- [ ] Interactive SHAP visualizations
- [ ] Voice input capability
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Predictive analytics
- [ ] Additional EHR integrations

## Success Metrics

### Clinical Metrics
- [ ] Time savings per therapist per day
- [ ] Documentation completeness improvement
- [ ] Medical necessity approval rate
- [ ] Compliance flag accuracy
- [ ] Clinician satisfaction score

### Technical Metrics
- [ ] System uptime (target: 99.9%)
- [ ] Average response time (target: <3 seconds)
- [ ] Error rate (target: <1%)
- [ ] HITL approval rate (target: >80%)
- [ ] Model confidence accuracy (calibration)

### Compliance Metrics
- [ ] Audit trail completeness (target: 100%)
- [ ] HITL adherence rate (target: 100%)
- [ ] Security incident count (target: 0)
- [ ] DLP policy violations (target: 0)
- [ ] Regulatory findings (target: 0)

### Adoption Metrics
- [ ] Active user count
- [ ] Daily briefing usage rate
- [ ] Feature utilization rates
- [ ] Training completion rate
- [ ] Support ticket volume

## Sign-Off

### Pre-Deployment Sign-Off
- [ ] Technical Owner: _____________________ Date: _______
- [ ] Business Owner: _____________________ Date: _______
- [ ] Compliance Officer: __________________ Date: _______
- [ ] Security Officer: ____________________ Date: _______
- [ ] Clinical Leadership: _________________ Date: _______

### Post-Deployment Sign-Off
- [ ] Pilot Success Confirmation: ___________ Date: _______
- [ ] Production Readiness: ________________ Date: _______
- [ ] Go-Live Approval: ____________________ Date: _______

---

**Document Version**: 1.0  
**Last Updated**: 2026-04-16  
**Next Review**: 2026-07-16
