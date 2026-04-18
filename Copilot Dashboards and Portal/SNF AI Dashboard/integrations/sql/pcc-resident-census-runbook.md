# PCC Resident Census SQL Load Runbook

## Purpose

Define the exact first-load path from the landed PCC resident CSV into the SQL reporting mart.

## Preconditions

- raw source file landed:
  - `D:\SNF AI Dashboard\data\incoming\pcc_resident_list_current.csv`
- normalized file created:
  - `D:\SNF AI Dashboard\data\processed\pcc_resident_list_current.normalized.csv`
- active-only file created:
  - `D:\SNF AI Dashboard\data\processed\pcc_resident_list_current.active-only.csv`
- normalized file validated with:
  - [Test-PccResidentCensusNormalizedCsv.ps1](/d:/SNF%20AI%20Dashboard/scripts/Test-PccResidentCensusNormalizedCsv.ps1)
- data quality report created with:
  - [New-PccResidentCensusDataQualityReport.ps1](/d:/SNF%20AI%20Dashboard/scripts/New-PccResidentCensusDataQualityReport.ps1)

## SQL Objects

- schema:
  - `stg`
  - `mart`
- base DDL:
  - [pcc-resident-census-schema.sql](/d:/SNF%20AI%20Dashboard/integrations/sql/pcc-resident-census-schema.sql)
- load procedure and normalized staging table:
  - [pcc-resident-census-load.sql](/d:/SNF%20AI%20Dashboard/integrations/sql/pcc-resident-census-load.sql)
- report-ready views:
  - [pcc-resident-census-views.sql](/d:/SNF%20AI%20Dashboard/integrations/sql/pcc-resident-census-views.sql)
- validation query pack:
  - [pcc-resident-census-validation.sql](/d:/SNF%20AI%20Dashboard/integrations/sql/pcc-resident-census-validation.sql)

## Load Sequence

1. Execute [pcc-resident-census-schema.sql](/d:/SNF%20AI%20Dashboard/integrations/sql/pcc-resident-census-schema.sql)
2. Execute [pcc-resident-census-load.sql](/d:/SNF%20AI%20Dashboard/integrations/sql/pcc-resident-census-load.sql)
3. Execute [pcc-resident-census-views.sql](/d:/SNF%20AI%20Dashboard/integrations/sql/pcc-resident-census-views.sql)
4. Bulk-load `pcc_resident_list_current.active-only.csv` into `stg.PccResidentListNormalized`
5. Capture the `LoadBatchId` from the processed file
6. Execute:

```sql
EXEC mart.usp_LoadPccResidentCensus @LoadBatchId = 'PUT-LOAD-BATCH-ID-HERE';
```

Helper:

```powershell
powershell -ExecutionPolicy Bypass -File "D:\SNF AI Dashboard\scripts\Get-PccResidentCensusLoadBatchId.ps1"
```

Import helper:

```powershell
powershell -ExecutionPolicy Bypass -File "D:\SNF AI Dashboard\scripts\Import-PccResidentCensusToSqlStage.ps1" -ServerInstance "YOURSERVER" -DatabaseName "YOURDATABASE"
```

Load helper:

```powershell
powershell -ExecutionPolicy Bypass -File "D:\SNF AI Dashboard\scripts\Invoke-PccResidentCensusSqlLoad.ps1" -ServerInstance "YOURSERVER" -DatabaseName "YOURDATABASE"
```

## Validation Queries

### Row counts

```sql
SELECT COUNT(*) AS ResidentCount FROM mart.DimResident WHERE IsCurrent = 1;
SELECT COUNT(*) AS EpisodeCount FROM mart.DimEpisode WHERE IsCurrent = 1;
SELECT COUNT(*) AS UnitCount FROM mart.DimUnit WHERE IsCurrent = 1;
SELECT COUNT(*) AS SnapshotCount FROM mart.FactResidentCensusSnapshot;
```

### Active resident census

```sql
SELECT
    SnapshotDateKey,
    COUNT(*) AS ActiveResidentCount
FROM mart.FactResidentCensusSnapshot
WHERE IsCurrentResident = 1
GROUP BY SnapshotDateKey
ORDER BY SnapshotDateKey DESC;
```

### Unit distribution

```sql
SELECT *
FROM mart.vw_CurrentResidentCensusByUnit
ORDER BY SnapshotDateKey DESC, UnitCode;
```

### Recent admissions

```sql
SELECT *
FROM mart.vw_CurrentResidentRecentAdmissions
ORDER BY AdmissionDate DESC, ResidentName;
```

### Data quality exceptions

```sql
SELECT *
FROM mart.vw_CurrentResidentCensusQualityExceptions;
```

### Full validation pack

```sql
:r D:\SNF AI Dashboard\integrations\sql\pcc-resident-census-validation.sql
```

### Missing operational attributes

```sql
SELECT
    SUM(CASE WHEN IsCurrentResident = 1 AND (LocationRaw IS NULL OR LocationRaw = '') THEN 1 ELSE 0 END) AS ActiveMissingLocation,
    SUM(CASE WHEN IsCurrentResident = 1 AND AdmissionDateKey IS NULL THEN 1 ELSE 0 END) AS ActiveMissingAdmissionDate
FROM mart.FactResidentCensusSnapshot;
```

## Operational Rule

- do not load downstream resident census visuals until the normalized file passes contract validation
- do not treat missing resident source identifiers as acceptable in production loads
- do not backfill or invent room or bed values when the source is blank
