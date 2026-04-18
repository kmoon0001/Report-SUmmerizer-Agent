SELECT COUNT(*) AS ResidentCount
FROM mart.DimResident
WHERE IsCurrent = 1;
GO

SELECT COUNT(*) AS EpisodeCount
FROM mart.DimEpisode
WHERE IsCurrent = 1;
GO

SELECT COUNT(*) AS UnitCount
FROM mart.DimUnit
WHERE IsCurrent = 1;
GO

SELECT COUNT(*) AS SnapshotCount
FROM mart.FactResidentCensusSnapshot;
GO

SELECT
    SnapshotDateKey,
    COUNT(*) AS ActiveResidentCount
FROM mart.FactResidentCensusSnapshot
WHERE IsCurrentResident = 1
GROUP BY SnapshotDateKey
ORDER BY SnapshotDateKey DESC;
GO

SELECT *
FROM mart.vw_CurrentResidentCensusByUnit
ORDER BY SnapshotDateKey DESC, UnitCode;
GO

SELECT *
FROM mart.vw_CurrentResidentRecentAdmissions
ORDER BY AdmissionDate DESC, ResidentName;
GO

SELECT *
FROM mart.vw_CurrentResidentCensusQualityExceptions;
GO
