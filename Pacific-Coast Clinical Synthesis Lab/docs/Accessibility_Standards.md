# Accessibility Standards for Adaptive Cards

## Overview

This document defines accessibility standards for all Adaptive Cards in the SNF Rehab Agent, ensuring WCAG 2.1 AA compliance and alignment with Microsoft Learn best practices for inclusive design.

---

## Core Accessibility Principles

### 1. Perceivable
- All information must be presentable in ways users can perceive
- Don't rely on color alone to convey information
- Provide text alternatives for non-text content

### 2. Operable
- All functionality must be operable via keyboard
- Users must have enough time to read and interact
- Don't cause seizures or physical reactions

### 3. Understandable
- Text must be readable and understandable
- Pages must operate predictably
- Help users avoid and correct mistakes

### 4. Robust
- Content must be compatible with assistive technologies
- Use semantic markup
- Validate HTML/JSON

---

## Adaptive Card Accessibility Requirements

### Images

**Requirement**: All images must have meaningful alt text

**Implementation**:
```json
{
  "type": "Image",
  "url": "https://example.com/logo.png",
  "altText": "SNF Rehab Agent logo - AI-powered documentation assistant",
  "size": "Medium",
  "style": "Person"
}
```

**Guidelines**:
- Alt text should describe the purpose, not just appearance
- Keep alt text concise (under 125 characters)
- Don't start with "Image of..." or "Picture of..."
- For decorative images, use empty altText: ""

**Examples**:

✅ **Good**:
```json
{
  "type": "Image",
  "url": "high-priority-icon.png",
  "altText": "High priority indicator - certification ending soon",
  "size": "Small"
}
```

❌ **Bad**:
```json
{
  "type": "Image",
  "url": "high-priority-icon.png",
  "altText": "icon",
  "size": "Small"
}
```

---

### Text Blocks

**Requirement**: Use semantic headings and proper hierarchy

**Implementation**:
```json
{
  "type": "TextBlock",
  "text": "Patient Summary",
  "weight": "Bolder",
  "size": "Large",
  "wrap": true
}
```

**Guidelines**:
- Use size and weight to create visual hierarchy
- Don't skip heading levels
- Keep line length under 80 characters
- Use wrap: true for long text

**Heading Hierarchy**:
```json
// H1 - Page/Section Title
{
  "type": "TextBlock",
  "text": "Daily Briefing",
  "weight": "Bolder",
  "size": "ExtraLarge"
}

// H2 - Subsection
{
  "type": "TextBlock",
  "text": "High Priority Patients",
  "weight": "Bolder",
  "size": "Large"
}

// H3 - Sub-subsection
{
  "type": "TextBlock",
  "text": "Patient Details",
  "weight": "Bolder",
  "size": "Medium"
}

// Body text
{
  "type": "TextBlock",
  "text": "Patient is making good progress...",
  "size": "Default",
  "wrap": true
}
```

---

### Color and Contrast

**Requirement**: Don't rely on color alone; ensure sufficient contrast

**Implementation**:
```json
// Status indicators with text + color
{
  "type": "TextBlock",
  "text": "✓ Approved",
  "color": "Good",
  "weight": "Bolder"
}

{
  "type": "TextBlock",
  "text": "⚠ Needs Review",
  "color": "Warning",
  "weight": "Bolder"
}

{
  "type": "TextBlock",
  "text": "✗ Rejected",
  "color": "Attention",
  "weight": "Bolder"
}
```

**Guidelines**:
- Always include text/icon with color
- Use semantic colors (Good, Warning, Attention)
- Don't use color as the only indicator
- Ensure 4.5:1 contrast ratio for text

**Color Combinations**:

| Use Case | Text | Background | Icon | Example |
|----------|------|------------|------|---------|
| Success | "✓ Approved" | Default | ✓ | Green text + checkmark |
| Warning | "⚠ Needs Review" | Default | ⚠ | Yellow text + warning |
| Error | "✗ Failed" | Default | ✗ | Red text + X mark |
| Info | "ℹ Information" | Default | ℹ | Blue text + info |

---

### Actions and Buttons

**Requirement**: All actions must have descriptive titles and tooltips

**Implementation**:
```json
{
  "type": "ActionSet",
  "actions": [
    {
      "type": "Action.Submit",
      "title": "Approve Recommendation",
      "data": {
        "action": "approve"
      },
      "style": "positive",
      "tooltip": "Approve this AI-generated recommendation and send to EMR",
      "ariaLabel": "Approve recommendation button - sends approved note to electronic medical record"
    }
  ]
}
```

**Guidelines**:
- Use action verbs (Approve, Review, Edit, Cancel)
- Provide tooltips for context
- Use ariaLabel for screen readers
- Make touch targets at least 44x44 pixels
- Use style: "positive" for primary actions

**Button Labels**:

✅ **Good**:
```json
{
  "type": "Action.Submit",
  "title": "Approve Recommendation",
  "tooltip": "Approve and send to EMR"
}
```

❌ **Bad**:
```json
{
  "type": "Action.Submit",
  "title": "OK",
  "tooltip": "Submit"
}
```

---

### FactSets and Tables

**Requirement**: Use semantic markup for data tables

**Implementation**:
```json
{
  "type": "FactSet",
  "facts": [
    {
      "title": "Patient ID:",
      "value": "ABC-123-XYZ"
    },
    {
      "title": "Confidence Score:",
      "value": "87% (High)"
    },
    {
      "title": "Cert End Date:",
      "value": "2026-04-22 (5 days)"
    }
  ]
}
```

**Guidelines**:
- Use FactSet for key-value pairs
- Include units in values (e.g., "87%", "5 days")
- Keep titles concise
- Use semantic labels (not "Field 1", "Value 1")

---

### Containers

**Requirement**: Use containers for logical grouping with semantic meaning

**Implementation**:
```json
{
  "type": "Container",
  "style": "emphasis",
  "items": [
    {
      "type": "TextBlock",
      "text": "High Priority Alert",
      "weight": "Bolder",
      "size": "Medium"
    },
    {
      "type": "TextBlock",
      "text": "This patient's certification ends in 5 days. Immediate action required.",
      "wrap": true
    }
  ]
}
```

**Guidelines**:
- Use style: "emphasis" for important information
- Use separator: true to visually separate sections
- Group related items together
- Use spacing: "Medium" or "Large" between sections

---

### Input Fields

**Requirement**: All inputs must have labels and error messages

**Implementation**:
```json
{
  "type": "Input.Text",
  "id": "clinicalNotes",
  "label": "Clinical Notes",
  "placeholder": "Enter your clinical observations...",
  "isRequired": true,
  "errorMessage": "Clinical notes are required for approval",
  "multiline": true,
  "maxLength": 1000
}
```

**Guidelines**:
- Always include label (not just placeholder)
- Use isRequired: true for mandatory fields
- Provide clear errorMessage
- Use placeholder for format hints
- Set maxLength to prevent overflow

---

### Keyboard Navigation

**Requirement**: All interactive elements must be keyboard accessible

**Implementation**:
```json
{
  "type": "ActionSet",
  "actions": [
    {
      "type": "Action.Submit",
      "title": "Approve (Alt+A)",
      "data": {
        "action": "approve"
      }
    },
    {
      "type": "Action.Submit",
      "title": "Edit (Alt+E)",
      "data": {
        "action": "edit"
      }
    },
    {
      "type": "Action.Submit",
      "title": "Reject (Alt+R)",
      "data": {
        "action": "reject"
      }
    }
  ]
}
```

**Guidelines**:
- Support keyboard shortcuts (document them)
- Ensure logical tab order
- Don't trap keyboard focus
- Provide skip links for long content

---

## Screen Reader Optimization

### Announcements

**Requirement**: Important state changes must be announced

**Implementation**:
```json
{
  "type": "TextBlock",
  "text": "✓ Recommendation approved successfully",
  "weight": "Bolder",
  "color": "Good",
  "id": "successMessage",
  "ariaLabel": "Success: Recommendation has been approved and sent to EMR"
}
```

### Live Regions

For dynamic content updates:
```json
{
  "type": "Container",
  "id": "statusUpdate",
  "items": [
    {
      "type": "TextBlock",
      "text": "Processing your request...",
      "id": "statusText"
    }
  ]
}
```

---

## Testing Checklist

### Automated Testing
- [ ] Validate JSON schema
- [ ] Check color contrast ratios
- [ ] Verify alt text presence
- [ ] Test with accessibility scanner

### Manual Testing
- [ ] Navigate with keyboard only
- [ ] Test with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Zoom to 200% and verify readability
- [ ] Test with high contrast mode
- [ ] Verify focus indicators visible

### User Testing
- [ ] Test with users who have visual impairments
- [ ] Test with users who have motor impairments
- [ ] Test with users who have cognitive impairments
- [ ] Test with users who have hearing impairments

---

## Common Patterns

### Patient Card (Accessible)

```json
{
  "type": "AdaptiveCard",
  "version": "1.5",
  "body": [
    {
      "type": "Container",
      "style": "emphasis",
      "items": [
        {
          "type": "ColumnSet",
          "columns": [
            {
              "type": "Column",
              "width": "auto",
              "items": [
                {
                  "type": "Image",
                  "url": "patient-icon.png",
                  "altText": "Patient icon",
                  "size": "Small"
                }
              ]
            },
            {
              "type": "Column",
              "width": "stretch",
              "items": [
                {
                  "type": "TextBlock",
                  "text": "John Smith (Token: ABC-123)",
                  "weight": "Bolder",
                  "size": "Medium"
                },
                {
                  "type": "TextBlock",
                  "text": "High Priority - Cert ends in 5 days",
                  "color": "Warning",
                  "isSubtle": true
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "TextBlock",
      "text": "Patient Details",
      "weight": "Bolder",
      "size": "Medium",
      "spacing": "Medium"
    },
    {
      "type": "FactSet",
      "facts": [
        {
          "title": "Discipline:",
          "value": "Physical Therapy"
        },
        {
          "title": "Session Count:",
          "value": "12 sessions"
        },
        {
          "title": "Goal Progress:",
          "value": "75% complete"
        },
        {
          "title": "Confidence Score:",
          "value": "87% (High confidence)"
        }
      ]
    },
    {
      "type": "Container",
      "separator": true,
      "spacing": "Medium",
      "items": [
        {
          "type": "TextBlock",
          "text": "AI Recommendation",
          "weight": "Bolder",
          "size": "Medium"
        },
        {
          "type": "TextBlock",
          "text": "Continue current treatment plan with focus on gait training and balance exercises. Patient is making good progress toward goals.",
          "wrap": true
        }
      ]
    }
  ],
  "actions": [
    {
      "type": "Action.Submit",
      "title": "✓ Approve (Alt+A)",
      "style": "positive",
      "tooltip": "Approve this recommendation and send to EMR",
      "ariaLabel": "Approve button - sends approved note to electronic medical record",
      "data": {
        "action": "approve"
      }
    },
    {
      "type": "Action.Submit",
      "title": "✎ Edit (Alt+E)",
      "tooltip": "Edit this recommendation before approving",
      "ariaLabel": "Edit button - opens editor to modify recommendation",
      "data": {
        "action": "edit"
      }
    },
    {
      "type": "Action.Submit",
      "title": "✗ Reject (Alt+R)",
      "style": "destructive",
      "tooltip": "Reject this recommendation",
      "ariaLabel": "Reject button - discards this recommendation",
      "data": {
        "action": "reject"
      }
    }
  ]
}
```

---

### Error Card (Accessible)

```json
{
  "type": "AdaptiveCard",
  "version": "1.5",
  "body": [
    {
      "type": "Container",
      "style": "attention",
      "items": [
        {
          "type": "TextBlock",
          "text": "⚠ Something Went Wrong",
          "weight": "Bolder",
          "size": "Large",
          "color": "Attention"
        },
        {
          "type": "TextBlock",
          "text": "I'm having trouble completing your request right now. This is usually temporary.",
          "wrap": true,
          "spacing": "Small"
        }
      ]
    },
    {
      "type": "TextBlock",
      "text": "What you can do:",
      "weight": "Bolder",
      "spacing": "Medium"
    },
    {
      "type": "TextBlock",
      "text": "• Try again in a few minutes\n• Continue with other tasks\n• Contact support if this keeps happening",
      "wrap": true
    },
    {
      "type": "Container",
      "separator": true,
      "spacing": "Medium",
      "items": [
        {
          "type": "TextBlock",
          "text": "Reference Code: ABC-123-XYZ",
          "size": "Small",
          "isSubtle": true
        },
        {
          "type": "TextBlock",
          "text": "(Share this code with support for faster help)",
          "size": "Small",
          "isSubtle": true
        }
      ]
    }
  ],
  "actions": [
    {
      "type": "Action.Submit",
      "title": "Try Again",
      "tooltip": "Retry the failed operation",
      "ariaLabel": "Try again button - retries the operation",
      "data": {
        "action": "retry"
      }
    },
    {
      "type": "Action.Submit",
      "title": "Contact Support",
      "tooltip": "Get help from support team",
      "ariaLabel": "Contact support button - opens escalation form",
      "data": {
        "action": "escalate"
      }
    }
  ]
}
```

---

## Compliance

### WCAG 2.1 AA Requirements

| Criterion | Status | Notes |
|-----------|--------|-------|
| 1.1.1 Non-text Content | ✅ | All images have alt text |
| 1.3.1 Info and Relationships | ✅ | Semantic structure used |
| 1.4.1 Use of Color | ✅ | Color not sole indicator |
| 1.4.3 Contrast (Minimum) | ✅ | 4.5:1 ratio maintained |
| 2.1.1 Keyboard | ✅ | All functions keyboard accessible |
| 2.4.1 Bypass Blocks | ✅ | Logical heading structure |
| 2.4.3 Focus Order | ✅ | Logical tab order |
| 2.4.4 Link Purpose | ✅ | Descriptive action titles |
| 2.4.6 Headings and Labels | ✅ | Descriptive headings |
| 3.3.1 Error Identification | ✅ | Clear error messages |
| 3.3.2 Labels or Instructions | ✅ | All inputs labeled |
| 4.1.2 Name, Role, Value | ✅ | ARIA labels provided |

---

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Microsoft Accessibility](https://www.microsoft.com/accessibility)
- [Adaptive Cards Accessibility](https://docs.microsoft.com/en-us/adaptive-cards/designer)

---

**Document Version**: 1.0  
**Last Updated**: 2026-04-17  
**Status**: Final  
**Next Review**: 2026-05-17  
**Owner**: UX Team
