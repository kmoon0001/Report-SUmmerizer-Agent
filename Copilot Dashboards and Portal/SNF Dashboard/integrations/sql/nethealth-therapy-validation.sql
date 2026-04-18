SELECT
    SnapshotDateKey,
    COUNT(*) AS TherapyLineCount,
    COUNT(DISTINCT TherapyCaseSourceId) AS TherapyCaseCount,
    COUNT(DISTINCT ResidentSourceId) AS ResidentCount,
    SUM(ISNULL(Minutes, 0)) AS TotalTreatmentMinutes
FROM stg.NetHealthTherapyCensusNormalized
GROUP BY SnapshotDateKey
ORDER BY SnapshotDateKey DESC;
GO

SELECT TOP (100)
    ResidentSourceId,
    ResidentDisplayName,
    DisciplineCode,
    TreatmentDate,
    Minutes,
    ClinicianName,
    WingCode
FROM stg.NetHealthTherapyCensusNormalized
ORDER BY SnapshotDateKey DESC, ResidentDisplayName, TreatmentDate;
GO

SELECT
    t.SnapshotDateKey,
    COUNT(*) AS FactRowCount,
    COUNT(DISTINCT t.TherapyCaseKey) AS DistinctTherapyCases,
    COUNT(DISTINCT t.ResidentKey) AS DistinctResidents,
    SUM(ISNULL(t.TreatmentMinutes, 0)) AS TotalTreatmentMinutes
FROM mart.FactTherapyCaseSnapshot t
GROUP BY t.SnapshotDateKey
ORDER BY t.SnapshotDateKey DESC;
GO

SELECT TOP (100)
    c.ResidentSourceId,
    c.ResidentName,
    c.UnitCode,
    c.ActiveTherapyCaseCount,
    c.TotalTreatmentMinutes,
    c.TreatmentLineCount,
    c.UniqueTherapyClinicians,
    c.LastTreatmentDateKey
FROM mart.vw_CurrentResidentTherapyCoverage c
ORDER BY c.SnapshotDateKey DESC, c.TotalTreatmentMinutes DESC, c.ResidentName;
GO
