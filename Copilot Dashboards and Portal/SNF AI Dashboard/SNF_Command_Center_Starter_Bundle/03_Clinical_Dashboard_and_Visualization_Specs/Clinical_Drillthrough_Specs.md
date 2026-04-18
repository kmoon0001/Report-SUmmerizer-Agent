# Clinical Drillthrough Specs

## Purpose

Define how patient, unit, and cohort drillthrough should preserve context and remain clinically relevant.

## Required Context To Preserve

- patient or unit scope
- selected timeframe
- current role perspective
- current care phase when applicable
- originating page

## Navigation Rules

- always provide a one-click return path
- do not lose the active filter set without explicit user choice
- warn before leaving a patient-specific context if the destination changes the security scope

## Security Rules

- apply patient assignment and consent checks before rendering drillthrough detail
- hide restricted content if the destination page has broader access than the source page

