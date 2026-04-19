# Knowledge Source Descriptions Reference
# Use these to update Name and Description fields in Copilot Studio Knowledge tab
# Per Microsoft Learn: descriptions should be detailed and explain WHEN the agent should use the source

## ONE Clinical Protocols

**ONE Clinical Protocol Fall Prevention**
> Evidence-based clinical protocol for fall risk assessment, individualized fall prevention plans, balance and gait training, environmental modification, and post-fall management in skilled nursing facilities. Use when the agent needs to recommend fall prevention interventions, assistive device evaluations, medication review for fall risk, or post-fall investigation protocols. Supports the falls with major injury QM domain which carries the highest Five-Star weight.

**ONE Clinical Protocol Wound Prevention and Care**
> Evidence-based clinical protocol for wound prevention, pressure injury staging, treatment interventions, and healing monitoring in skilled nursing facilities. Use when the agent needs to recommend wound care strategies, support surface selection, repositioning schedules, nutrition interventions for wound healing, or pressure ulcer prevention programs. Supports QM domains including new or worsened pressure ulcers and skin integrity.

**ONE Clinical Protocol Bladder Health**
> Evidence-based clinical protocol for bladder health assessment, toileting programs, pelvic floor strengthening, and continence management in skilled nursing facilities. Use when the agent needs to recommend bladder retraining, catheter reduction strategies, or incontinence interventions. Supports the low-risk incontinence QM domain and connects to therapy-nursing collaboration on toileting schedules.

**ONE Clinical Protocol Behavior Management**
> Evidence-based clinical protocol for behavioral assessment, non-pharmacological intervention strategies, sensory approaches, and interdisciplinary behavioral management in skilled nursing facilities. Use when the agent needs to recommend behavioral alternatives to antipsychotic medications, gradual dose reduction support, or structured activity programs. Supports the antipsychotic use QM domain.

**ONE Clinical Protocol Contracture Management**
> Evidence-based clinical protocol for contracture prevention, range of motion programs, splinting protocols, and positioning strategies in skilled nursing facilities. Use when the agent needs to recommend contracture management interventions, maintenance therapy programs per Jimmo v. Sebelius, or ADL preservation strategies. Supports the ADL decline QM domain.

**ONE Clinical Protocol Pain Management**
> Evidence-based clinical protocol for pain assessment, multimodal pain management, and functional outcome tracking in skilled nursing facilities. Use when the agent needs to recommend pain interventions, non-pharmacological strategies, therapy-based pain management, or pain reassessment schedules. Supports the moderate to severe pain QM domain.

**ONE Clinical Protocol Seating and Positioning**
> Evidence-based clinical protocol for wheelchair seating assessments, positioning interventions, and pressure redistribution strategies in skilled nursing facilities. Use when the agent needs to recommend seating evaluations, cushion selection, tilt-in-space positioning, or postural support for residents with pressure ulcer risk, contractures, or functional decline. Supports QM domains including pressure ulcers, ADL decline, and falls prevention.

**ONE Clinical Protocol Nutrition and Hydration**
> Evidence-based clinical protocol for nutrition screening, hydration monitoring, weight management, and dietary interventions in skilled nursing facilities. Use when the agent needs to recommend nutrition-related interventions for residents with weight loss, malnutrition risk, wound healing needs, or dehydration concerns. Supports the weight loss QM domain.

**ONE Clinical Protocol Respiratory**
> Evidence-based clinical protocol for respiratory assessment, breathing exercises, airway clearance techniques, and pulmonary rehabilitation in skilled nursing facilities. Use when the agent needs to recommend respiratory interventions, oxygen management strategies, or pulmonary function monitoring for residents with COPD, pneumonia, or other respiratory conditions.

**ONE Clinical Protocol Oral Hygiene**
> Evidence-based clinical protocol for oral health assessment, hygiene interventions, and dysphagia-related oral care in skilled nursing facilities. Use when the agent needs to recommend oral hygiene programs, dental screening referrals, or oral care interventions for residents with swallowing difficulties or aspiration risk.

**ONE Clinical Protocol Low Vision**
> Evidence-based clinical protocol for low vision assessment, environmental modification, adaptive equipment, and functional training in skilled nursing facilities. Use when the agent needs to recommend vision-related interventions, lighting modifications, magnification aids, or safety adaptations for residents with visual impairment. Supports fall prevention and ADL independence.

**ONE Clinical Protocol Sensory Integration**
> Evidence-based clinical protocol for sensory processing assessment, sensory diet development, environmental adaptation, and therapeutic sensory interventions in skilled nursing facilities. Use when the agent needs to recommend sensory-based approaches for residents with dementia, behavioral challenges, or sensory processing difficulties. Supports behavioral management and fall prevention.

**ONE Clinical Protocol Lymphedema**
> Evidence-based clinical protocol for lymphedema assessment, compression therapy, manual lymphatic drainage, and exercise programs in skilled nursing facilities. Use when the agent needs to recommend lymphedema management strategies, edema reduction interventions, or skin integrity monitoring for residents with lymphatic conditions.

**ONE Clinical Protocol Falls System Review**
> Evidence-based clinical protocol for systematic facility-wide fall prevention program review, post-fall analysis, and environmental safety assessment in skilled nursing facilities. Use when the agent needs to recommend system-level fall prevention strategies, post-fall huddle protocols, or facility-wide environmental safety audits. Complements the individual Fall Prevention protocol.

## Authored Agent Knowledge Docs

**QM Measure Definitions and Calculation Rules**
> Complete definitions of all CMS nursing home quality measures including numerator and denominator rules, exclusion criteria, and clinical relevance for therapy teams. Use when the agent needs to explain what a specific QM measures, how it is calculated, which MDS items drive it, or why a facility rate is high. Covers all long-stay measures LS-01 through LS-15 and short-stay measures SS-01 through SS-05.

**QM Target Benchmarks CMS National and Internal**
> Reference document containing CMS national average benchmarks, internal organizational targets, and concern level classification rules for all long-stay and short-stay nursing home quality measures. Use when the agent needs to compare a facility QM rate against national averages, assign concern levels (High, Moderate, Low), evaluate Five-Star QM rating impact, or determine whether a facility is above or below target on any specific measure.

**QM Action Plan SOP 7-30-90 Framework**
> Standard operating procedure defining the 7-30-90 day action plan framework for quality measure improvement in skilled nursing facilities. Use when the agent generates action plans, assigns owners and due dates, applies escalation rules, or structures clinical interventions into immediate quick wins (7-day), workflow redesign (30-day), and stabilization (90-day) phases. Includes HITL approval requirements and role assignments.

**QM Decline Detection Rules and Thresholds**
> Rules, thresholds, and lookback logic for detecting quality measure declines in skilled nursing facility performance data. Use when the agent needs to determine if a QM rate constitutes a decline, calculate severity scores, compare predicted versus actual rates, or route users to appropriate intervention workflows based on decline severity. Defines acute spike, sustained worsening, and threshold breach criteria.

**QM Driver Taxonomy and Root Cause Library**
> Structured library of root-cause drivers categorized as Clinical, Process, and Documentation for each quality measure domain including Falls, Pressure Ulcers, ADL Decline, Antipsychotic Use, and Incontinence. Use when the agent performs driver analysis, needs to identify likely root causes for high or worsening QMs, map drivers to CMS F-tags, or recommend validation audits. Each driver links to specific ONE Clinical Protocols.

**Resident Outlier Review Protocol HIPAA Compliant**
> HIPAA-compliant protocol for conducting resident-specific quality measure outlier analysis in skilled nursing facilities. Use when the agent performs resident-level reviews, needs to validate required data fields, apply HIPAA minimum necessary standards, generate therapy and nursing coaching recommendations, or structure resident outlier reports. Defines prohibited PHI fields and approved data sources.

**DoR Summary Email Template and Examples**
> Templates and audience-specific formatting rules for Director of Rehab summary emails covering single-facility and multi-facility QM performance. Use when the agent generates DoR summary communications, needs to format facility performance tables, assign priority actions, or adapt output for different audiences including DoR, Regional Consultant, Administrator, or IDT leadership.

**Data Dictionary for Upload and Query Workflows**
> Column definitions and validation rules for SimpleLTC CSV exports, resident exports, Power BI query responses, and Dataverse entity fields. Use when the agent validates uploaded files, maps data columns, screens for prohibited PHI fields, or interprets query response fields during upload and analysis workflows.

**Governance and Operational Runbook**
> Governance framework, validation checklists, exception handling rules, HIPAA and CMS compliance requirements, incident response procedures, and maintenance schedule for the SimpleLTC QM Coach agent. Use when the agent needs to apply governance principles, handle data exceptions, follow compliance requirements, guide users to escalation paths, or reference pre-publish and post-publish validation procedures.

## CMS Regulatory References

**CMS MDS 3.0 Quality Measures Users Manual v18**
> Official CMS MDS 3.0 Quality Measures Users Manual version 18.0 containing detailed specifications for all nursing home quality measure calculations, risk adjustment models, and reporting rules. Use when the agent needs authoritative calculation details, measure specifications, or technical documentation for any QM numerator, denominator, exclusion, or risk adjustment question.

**CMS SNF QM Calculations and Reporting Manual v7**
> CMS SNF quality measure calculations and reporting users manual version 7.0 with detailed measure calculation logic, data submission requirements, and reporting timelines. Use when the agent needs technical calculation procedures, data submission deadlines, or reporting cycle details for skilled nursing facility quality measures.

**CMS Five Star Quality Rating System Overview**
> CMS official overview of the Five-Star Quality Rating System for nursing homes including health inspection, staffing, and quality measure rating components. Use when the agent needs to explain how QM rates affect star ratings, interpret Five-Star scoring methodology, or assess the impact of QM changes on a facility overall rating.

**CMS Jimmo v Sebelius Settlement FAQs**
> Official CMS frequently asked questions about the Jimmo v. Sebelius settlement agreement clarifying that Medicare coverage for skilled therapy and nursing services is based on need for skilled care, not improvement potential. Use when the agent needs authoritative Jimmo guidance for maintenance therapy justification.

**CMS Jimmo Settlement Program Manual Clarifications**
> CMS fact sheet clarifying Medicare Benefit Policy Manual revisions resulting from the Jimmo v. Sebelius settlement. Use when the agent needs to explain how CMS updated coverage criteria to remove the improvement standard for skilled therapy and nursing services in SNF, home health, and outpatient settings.

**CMS Nursing Home Data Dictionary**
> CMS official data dictionary for nursing home datasets including field definitions, data types, and coding conventions used in MDS assessments and quality measure reporting. Use when the agent needs to interpret data fields, validate upload column mappings, or explain CMS data element definitions.

**CMS Section GG Self Care and Mobility Decision Tree**
> CMS decision tree for coding MDS Section GG self-care and mobility functional assessment items. Use when the agent needs to interpret functional status scores, explain Section GG coding rules, or validate ADL and mobility data used in quality measure calculations and therapy outcome tracking.

**CFRs Medicare Part B Skilled Maintenance Therapy**
> Code of Federal Regulations sections applicable to Medicare Part B skilled maintenance therapy coverage in skilled nursing facilities. Use when the agent needs to cite specific federal regulations supporting maintenance therapy coverage, Jimmo v. Sebelius compliance, or Medicare Part B therapy billing requirements.

**Medicare Part B Maintenance Therapy Guidelines Jimmo Standard**
> Medicare Part B maintenance therapy coverage guidelines based on the Jimmo v. Sebelius settlement. Use when the agent needs to justify skilled maintenance therapy coverage, explain that Medicare coverage is based on need for skilled care not improvement potential, or cite Jimmo standards for therapy documentation.

## Website Sources

**CMS nursing home quality measures** (https://www.cms.gov/medicare/quality)
> CMS nursing home quality measure definitions and calculation rules used with SimpleLTC exports and Power BI dashboards to identify declining resident and facility outcomes. Use when the agent needs current CMS quality measure specifications, reporting requirements, or measure update announcements for skilled nursing facilities.

**CMS quality safety oversight** (https://www.cms.gov/medicare/quality-safety-oversight-general-information)
> CMS quality and safety oversight information for nursing homes including survey and certification guidance, enforcement actions, and regulatory compliance resources. Use when the agent needs to reference survey-related quality standards, F-tag guidance context, or CMS oversight and enforcement information.
