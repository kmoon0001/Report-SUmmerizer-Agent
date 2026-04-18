CREATE OR ALTER VIEW mart.vw_CurrentResidentCensusDetail
AS
SELECT
    f.SnapshotDateTime,
    f.SnapshotDateKey,
    r.ResidentSourceId,
    r.ResidentName,
    r.ResidentDisplayName,
    r.AgeYears,
    u.FacilityName,
    u.FloorCode,
    u.UnitCode,
    f.RoomCode,
    f.BedCode,
    e.AdmissionDate,
    DATEDIFF(DAY, e.AdmissionDate, CAST(f.SnapshotDateTime AS DATE)) AS LengthOfStayDays,
    f.LocationRaw,
    f.StatusRaw
FROM mart.FactResidentCensusSnapshot f
INNER JOIN mart.DimResident r
    ON r.ResidentKey = f.ResidentKey
   AND r.IsCurrent = 1
INNER JOIN mart.DimEpisode e
    ON e.EpisodeKey = f.EpisodeKey
   AND e.IsCurrent = 1
LEFT JOIN mart.DimUnit u
    ON u.UnitKey = f.UnitKey
   AND u.IsCurrent = 1
WHERE f.IsCurrentResident = 1;
GO

CREATE OR ALTER VIEW mart.vw_CurrentResidentCensusByUnit
AS
SELECT
    SnapshotDateKey,
    FacilityName,
    FloorCode,
    UnitCode,
    COUNT(*) AS CurrentResidentCount,
    AVG(CAST(AgeYears AS DECIMAL(10,2))) AS AverageAgeYears,
    MIN(AdmissionDate) AS EarliestAdmissionDate,
    MAX(AdmissionDate) AS LatestAdmissionDate
FROM mart.vw_CurrentResidentCensusDetail
GROUP BY
    SnapshotDateKey,
    FacilityName,
    FloorCode,
    UnitCode;
GO

CREATE OR ALTER VIEW mart.vw_CurrentResidentRecentAdmissions
AS
SELECT
    SnapshotDateKey,
    FacilityName,
    FloorCode,
    UnitCode,
    ResidentSourceId,
    ResidentName,
    AdmissionDate,
    LengthOfStayDays
FROM mart.vw_CurrentResidentCensusDetail
WHERE AdmissionDate >= DATEADD(DAY, -30, CAST(SnapshotDateTime AS DATE));
GO

CREATE OR ALTER VIEW mart.vw_CurrentResidentCensusQualityExceptions
AS
SELECT
    SnapshotDateKey,
    ResidentSourceId,
    ResidentName,
    FacilityName,
    FloorCode,
    UnitCode,
    RoomCode,
    BedCode,
    AdmissionDate,
    CASE
        WHEN ResidentSourceId IS NULL OR ResidentSourceId = '' THEN 'MissingResidentSourceId'
        WHEN LocationRaw IS NULL OR LocationRaw = '' THEN 'MissingLocation'
        WHEN AdmissionDate IS NULL THEN 'MissingAdmissionDate'
        ELSE 'Other'
    END AS ExceptionType
FROM mart.vw_CurrentResidentCensusDetail
WHERE
    ResidentSourceId IS NULL OR ResidentSourceId = '' OR
    LocationRaw IS NULL OR LocationRaw = '' OR
    AdmissionDate IS NULL;
GO
