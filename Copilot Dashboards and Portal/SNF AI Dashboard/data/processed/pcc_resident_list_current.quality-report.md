# PCC Resident Census Data Quality Report

Source file: D:\SNF AI Dashboard\data\processed\pcc_resident_list_current.normalized.csv

## Summary

- Rows: 8731
- Active: 162
- Discharged: 7416
- Unknown status: 1153
- Missing resident identifier: 0
- Missing location: 8564
- Missing admission date: 1153
- Active with missing location: 0
- Active with missing admission date: 0

## Top Unit Or Location Values

- <blank>: 8564
- D: 55
- A: 44
- B: 34
- C: 34

## Interpretation

- Missing resident identifiers block dependable conformed dimensions.
- Active residents without location should be treated as operational exceptions.
- Active residents without admission date weaken episode and length-of-stay analysis.
