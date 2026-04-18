# File And Image Interaction Model

## Purpose

Define how the assistant should request, validate, and route uploaded files and images.

## Allowed Starter Types

- CSV for structured exports
- PDF for policies, reports, and summaries
- images for approved clinical or environmental review workflows

## Request Pattern

- ask for the exact file type needed
- explain why it is needed
- explain size or content constraints
- confirm that PHI should only be uploaded through approved channels

## Validation Rules

- reject unsupported file types
- reject files missing required columns or unreadable content
- explain the exact correction needed
- route valid files to the corresponding workflow input record

