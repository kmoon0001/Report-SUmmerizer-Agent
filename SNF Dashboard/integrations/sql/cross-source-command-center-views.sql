CREATE OR ALTER VIEW mart.vw_CurrentResidentTherapyCoverage
AS
SELECT
    c.SnapshotDateKey,
    c.ResidentSourceId,
    c.ResidentName,
    c.UnitCode,
    COUNT(DISTINCT t.TherapyCaseKey) AS TherapyCaseCount,
    SUM(CASE WHEN t.TherapyCaseStatus = 'Active' THEN 1 ELSE 0 END) AS ActiveTherapyCaseCount,
    SUM(ISNULL(t.TreatmentMinutes, 0)) AS TotalTreatmentMinutes,
    SUM(ISNULL(t.TreatmentCount, 0)) AS TreatmentLineCount,
    COUNT(DISTINCT t.ClinicianKey) AS UniqueTherapyClinicians,
    MAX(t.TreatmentDateKey) AS LastTreatmentDateKey
FROM mart.vw_CurrentResidentCensusDetail c
LEFT JOIN mart.DimResident r
    ON r.ResidentSourceId = c.ResidentSourceId AND r.IsCurrent = 1
LEFT JOIN mart.FactTherapyCaseSnapshot t
    ON t.ResidentKey = r.ResidentKey AND t.SnapshotDateKey = c.SnapshotDateKey
GROUP BY
    c.SnapshotDateKey,
    c.ResidentSourceId,
    c.ResidentName,
    c.UnitCode;
GO

CREATE OR ALTER VIEW mart.vw_CurrentResidentTherapyCoverageByUnit
AS
SELECT
    SnapshotDateKey,
    UnitCode,
    COUNT(DISTINCT ResidentSourceId) AS ResidentsWithTherapy,
    SUM(ActiveTherapyCaseCount) AS ActiveTherapyCaseCount,
    SUM(TotalTreatmentMinutes) AS TotalTreatmentMinutes,
    SUM(TreatmentLineCount) AS TreatmentLineCount,
    SUM(UniqueTherapyClinicians) AS UniqueTherapyCliniciansAcrossResidents
FROM mart.vw_CurrentResidentTherapyCoverage
GROUP BY
    SnapshotDateKey,
    UnitCode;
GO

CREATE OR ALTER VIEW mart.vw_DocumentationOverdueByDiscipline
AS
SELECT
    f.SnapshotDateKey,
    d.DisciplineCode,
    COUNT(*) AS OverdueDocumentCount
FROM mart.FactDocumentationTask f
LEFT JOIN mart.DimDiscipline d
    ON d.DisciplineKey = f.DisciplineKey AND d.IsCurrent = 1
WHERE f.DocumentationStatus = 'Overdue'
GROUP BY
    f.SnapshotDateKey,
    d.DisciplineCode;
GO

CREATE OR ALTER VIEW mart.vw_CommandCenterResidentTherapyDocumentation
AS
SELECT
    c.SnapshotDateKey,
    c.ResidentSourceId,
    c.ResidentName,
    c.UnitCode,
    ISNULL(tc.ActiveTherapyCaseCount, 0) AS ActiveTherapyCaseCount,
    ISNULL(tc.TotalTreatmentMinutes, 0) AS TotalTreatmentMinutes,
    ISNULL(tc.TreatmentLineCount, 0) AS TreatmentLineCount,
    ISNULL(doc.OverdueDocumentCount, 0) AS OverdueDocumentCount
FROM mart.vw_CurrentResidentCensusDetail c
LEFT JOIN (
    SELECT
        SnapshotDateKey,
        ResidentSourceId,
        SUM(ActiveTherapyCaseCount) AS ActiveTherapyCaseCount,
        SUM(TotalTreatmentMinutes) AS TotalTreatmentMinutes,
        SUM(TreatmentLineCount) AS TreatmentLineCount
    FROM mart.vw_CurrentResidentTherapyCoverage
    GROUP BY SnapshotDateKey, ResidentSourceId
) tc
    ON tc.SnapshotDateKey = c.SnapshotDateKey
   AND tc.ResidentSourceId = c.ResidentSourceId
LEFT JOIN (
    SELECT
        f.SnapshotDateKey,
        r.ResidentSourceId,
        COUNT(*) AS OverdueDocumentCount
    FROM mart.FactDocumentationTask f
    INNER JOIN mart.DimResident r
        ON r.ResidentKey = f.ResidentKey AND r.IsCurrent = 1
    WHERE f.DocumentationStatus = 'Overdue'
    GROUP BY f.SnapshotDateKey, r.ResidentSourceId
) doc
    ON doc.SnapshotDateKey = c.SnapshotDateKey
   AND doc.ResidentSourceId = c.ResidentSourceId;
GO
