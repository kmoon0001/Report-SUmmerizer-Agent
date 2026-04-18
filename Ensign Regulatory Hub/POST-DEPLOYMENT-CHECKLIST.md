# Post-Deployment Checklist
## SimpleLTC QM Coach V2

**Status:** PENDING - Agent publish failed, must fix errors first

---

## Phase 1: Pre-Deployment (CURRENT PHASE)

### Fix Blocking Errors
- [ ] **Topic Error:** Fix QM Orchestrator missing actions (7 condition branches)
- [ ] **Other Error:** Investigate and fix the 1 "Other Error" from publish dialog
- [ ] **Verify Fixes:** Confirm all errors resolved in Copilot Studio
- [ ] **Successful Publish:** Complete publish operation without errors

### Test Conversation Starters
Once published, test all 6 conversation starters:

1. [ ] **Facility QM risk review**
   - Prompt: "Review this facility's top Quality Measure risks from our latest SimpleLTC data and explain the likely clinical, process, and documentation drivers from a therapy perspective."
   - Expected: Routes to Facility QM Analysis topic
   - Verify: Proper data source handling, HIPAA compliance messaging

2. [ ] **Worsening QMs – therapy plan**
   - Prompt: "Analyze worsening QMs from my SimpleLTC export and recommend 7-, 30-, and 90-day therapy actions, including program focus, caseload mix, and coordination with nursing and MDS."
   - Expected: Routes to QM Data Upload & Decline Detection topic
   - Verify: 7-30-90 framework output, action plan structure

3. [ ] **Therapy QM action plan**
   - Prompt: "Build a regulatory-aligned QM action plan for therapy services that includes specific resident cohorts to target, recommended interventions, and how to partner with nursing and IDT."
   - Expected: Routes to QM Action Plan topic
   - Verify: Regulatory alignment, ONE Clinical Protocol citations

4. [ ] **Predicted vs actual QMs**
   - Prompt: "Compare predicted versus actual QM performance and highlight where therapy should prioritize interventions first, including suggestions for intensity, frequency, and discipline mix."
   - Expected: Routes to QM Data Upload & Decline Detection topic
   - Verify: Decline detection logic, priority ranking

5. [ ] **Resident outlier workflow**
   - Prompt: "Guide me through the approved secure workflow to review resident outliers that may be impacting QMs, and suggest how therapy should address each pattern you find."
   - Expected: Routes to Resident Outlier Analysis topic
   - Verify: HIPAA secure workflow messaging, PHI handling

6. [ ] **DoR QM briefing**
   - Prompt: "Draft a Director of Rehab summary of this facility's top QM concerns, likely drivers related to therapy, and recommended next steps to discuss with nursing and IDT leadership."
   - Expected: Routes to DoR Summary topic
   - Verify: Email format, multi-facility support

---

## Phase 2: Access & Permissions

### User Access Configuration
- [ ] **Identify User Groups:** Define which user groups need access
  - Regional Therapy Consultants
  - Therapy Leadership
  - Nursing Leadership
  - IDT Members
  - Facility Administrators

- [ ] **Assign Security Roles:** Configure Dataverse security roles
  - Basic User role for all agent users
  - System Administrator for agent owners/maintainers

- [ ] **Share Agent:** Use Copilot Studio "Share" feature
  - Navigate to Settings > Security
  - Add user groups or individual users
  - Set appropriate permissions (User vs Co-owner)

- [ ] **Test Access:** Have test users from each group verify they can:
  - See the agent in their Teams/M365 environment
  - Start conversations
  - Receive responses
  - Upload files (if applicable)

### Connection References & Flow Permissions
- [ ] **Verify Flow Connections:** Ensure all 10 Power Automate flows have valid connections
  - Facility Insight Dataverse Lookup
  - Resident Insight Dataverse Lookup
  - Power BI Facility Insight Query
  - QM Decline Detection Reporting
  - QM Email Generator
  - Upload Normalize Manual QM File
  - Route Clinical Intake and Handoff Data
  - Detect and Report Quality Measure Declines
  - (2 additional flows)

- [ ] **Connection Ownership:** Verify connections use appropriate service account or shared credentials
  - Review "Your agent runs tools that use the author's credentials" warning
  - Consider creating dedicated service account for production flows

- [ ] **Dataverse Permissions:** Confirm agent has read/write access to required tables
  - Facility data tables
  - Resident data tables (with appropriate PHI controls)
  - QM metrics tables

### Outlook Shared Mailbox (PENDING IT ADMIN)
- [ ] **IT Admin Action Required:** Follow OUTLOOK-SHARED-MAILBOX-SETUP.md
- [ ] **Verify Email Flows:** Test DoR Summary Email generation
- [ ] **Confirm Send-As Permissions:** Verify emails send from correct address

---

## Phase 3: Monitoring & Analytics

### Usage Monitoring
- [ ] **Enable Analytics:** Verify analytics are collecting data
  - Navigate to Analytics tab in Copilot Studio
  - Confirm conversation sessions are being tracked
  - Check engagement rate calculations

- [ ] **Set Up Dashboards:** Create monitoring dashboards
  - Daily active users
  - Conversation volume by topic
  - Error rates and failure points
  - Average conversation length
  - User satisfaction scores

- [ ] **Configure Alerts:** Set up proactive monitoring
  - Alert on error rate > 10%
  - Alert on zero usage for 24 hours
  - Alert on satisfaction score < 60%

### Feedback Collection
- [ ] **Verify Feedback Settings:** Confirm feedback is enabled
  - Check Settings > Feedback in Copilot Studio
  - Verify thumbs up/down buttons appear in test chat

- [ ] **Review Feedback Process:** Establish feedback review cadence
  - Weekly review of negative feedback
  - Monthly analysis of improvement suggestions
  - Quarterly user satisfaction survey

### Performance Tracking
- [ ] **Baseline Metrics:** Capture initial performance metrics
  - Average response time
  - Topic completion rates
  - Flow success rates
  - Knowledge base hit rates

- [ ] **Set Performance Goals:**
  - Target: 90% conversation completion rate
  - Target: <5% error rate
  - Target: >70% user satisfaction
  - Target: <3 second average response time

---

## Phase 4: Maintenance & Support

### Regular Maintenance Schedule
- [ ] **Weekly Tasks:**
  - Review error logs and failed conversations
  - Check for new negative feedback
  - Verify all flows are running successfully
  - Monitor Dataverse connection health

- [ ] **Monthly Tasks:**
  - Review analytics and usage trends
  - Update knowledge base with new clinical protocols
  - Test conversation starters for accuracy
  - Review and update QM benchmarks

- [ ] **Quarterly Tasks:**
  - Comprehensive agent evaluation
  - Update ONE Clinical Protocols if new versions released
  - Review CMS regulatory changes
  - Conduct user satisfaction survey
  - Update agent instructions based on feedback

### Knowledge Base Maintenance
- [ ] **Content Updates:** Establish process for updating knowledge sources
  - Monitor CMS for QM measure definition changes
  - Track ONE Clinical Protocol updates
  - Update internal QM benchmarks quarterly

- [ ] **Duplicate Removal:** Address duplicate knowledge sources identified in review
  - Remove duplicate CMS MDS 3.0 QM User Manual entries
  - Consolidate overlapping protocol documents

### Support Structure
- [ ] **Define Support Tiers:**
  - **Tier 1:** End user questions (handled by local facility leadership)
  - **Tier 2:** Agent behavior issues (handled by Therapy Resources IT)
  - **Tier 3:** Technical/platform issues (handled by Power Platform admin)

- [ ] **Create Support Documentation:**
  - User guide for common workflows
  - FAQ document
  - Troubleshooting guide
  - Escalation procedures

- [ ] **Establish Support Contacts:**
  - Primary: [Name], [Email], [Phone]
  - Secondary: [Name], [Email], [Phone]
  - Power Platform Admin: [Name], [Email]
  - Microsoft Support: [Case submission process]

### Escalation Procedures
- [ ] **Define Escalation Triggers:**
  - Agent completely unavailable > 1 hour
  - Error rate > 25% for > 2 hours
  - Data integrity issue detected
  - PHI exposure incident
  - Regulatory compliance concern

- [ ] **Escalation Path:**
  1. Local facility reports to Therapy Resources support
  2. Therapy Resources IT investigates
  3. If platform issue, escalate to Power Platform admin
  4. If critical, engage Microsoft Premier Support
  5. If PHI/compliance issue, immediately notify Compliance Officer

---

## Phase 5: Compliance & Security

### HIPAA Compliance Verification
- [ ] **PHI Handling Audit:** Verify PHI is handled per HIPAA requirements
  - Confirm resident-specific workflows use approved secure process
  - Verify no PHI in logs or exported content
  - Test PHI detection guardrail (Global.PHIDetected)

- [ ] **Access Audit:** Review who has access to agent and underlying data
  - Document all users with agent access
  - Document all users with Dataverse access
  - Verify minimum necessary access principle

- [ ] **Encryption Verification:** Confirm data encryption
  - Data at rest (Dataverse)
  - Data in transit (API calls)
  - Backup encryption

### Security Monitoring
- [ ] **Enable Audit Logging:** Verify audit logs are enabled
  - Dataverse audit logging
  - Power Platform audit logging
  - Flow run history retention

- [ ] **Regular Security Reviews:**
  - Monthly: Review access logs for anomalies
  - Quarterly: Review security role assignments
  - Annually: Full security audit

---

## Phase 6: Documentation

### User Documentation
- [ ] **Create User Guide:** Comprehensive guide for end users
  - How to access the agent
  - Overview of 6 conversation starters
  - Step-by-step workflows
  - Best practices for prompting
  - Data upload procedures

- [ ] **Create Quick Reference:** One-page quick start guide
  - Most common use cases
  - Key prompts to try
  - Where to get help

### Technical Documentation
- [ ] **Architecture Diagram:** Document system architecture
  - Agent components
  - Flow integrations
  - Dataverse schema
  - External dependencies

- [ ] **Runbook:** Operational procedures
  - How to publish updates
  - How to troubleshoot common issues
  - How to update knowledge base
  - How to modify flows

- [ ] **Change Log:** Maintain version history
  - Document all changes to agent
  - Track knowledge base updates
  - Record flow modifications

---

## Phase 7: Training & Adoption

### User Training
- [ ] **Schedule Training Sessions:** Organize training for user groups
  - Regional Therapy Consultants (primary users)
  - Therapy Leadership
  - Nursing Leadership

- [ ] **Create Training Materials:**
  - Recorded demo videos
  - Live training presentation
  - Hands-on practice scenarios

- [ ] **Measure Adoption:**
  - Track unique users per week
  - Monitor conversation volume trends
  - Survey users on adoption barriers

### Champion Program
- [ ] **Identify Champions:** Select power users from each region
- [ ] **Champion Training:** Provide advanced training
- [ ] **Champion Support:** Establish regular check-ins

---

## Success Criteria

### Week 1 Post-Launch
- [ ] Zero critical errors
- [ ] All 6 conversation starters tested and working
- [ ] At least 10 unique users
- [ ] Feedback mechanism confirmed working

### Month 1 Post-Launch
- [ ] 50+ unique users
- [ ] 200+ conversations
- [ ] <5% error rate
- [ ] >70% user satisfaction
- [ ] All flows running successfully

### Quarter 1 Post-Launch
- [ ] 100+ unique users
- [ ] 1000+ conversations
- [ ] Documented ROI (time saved, quality improvements)
- [ ] User adoption >80% of target audience
- [ ] Knowledge base updated at least once

---

## Current Status Summary

**Phase:** Pre-Deployment (Phase 1)
**Blocking Issues:** 2 errors preventing publish
**Next Action:** Fix QM Orchestrator topic errors and investigate "Other Errors"
**Estimated Time to Production:** 2-4 hours (depending on error complexity)

**Once Errors Fixed:**
1. Publish agent
2. Test all 6 conversation starters
3. Begin Phase 2 (Access & Permissions)
4. Work through remaining checklist items

---

## Notes

- This checklist assumes the agent is being deployed to the "Therapy AI Agents Dev" environment
- Production deployment may require additional governance approvals
- Some items (like Outlook shared mailbox) have external dependencies
- Prioritize HIPAA compliance items before broad user rollout
- Consider phased rollout (pilot group → regional → full deployment)
