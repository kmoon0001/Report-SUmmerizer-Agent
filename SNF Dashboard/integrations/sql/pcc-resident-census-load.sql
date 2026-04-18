/*
Load sequence for the first PCC resident census implementation.

Expected upstream file:
  D:\my agents copilot studio\SNF Dashboard\data\processed\pcc_resident_list_current.normalized.csv

Expected external load:
  normalized rows loaded into stg.PccResidentListNormalized before this script runs
*/

IF OBJECT_ID('stg.PccResidentListNormalized', 'U') IS NULL
BEGIN
    CREATE TABLE stg.PccResidentListNormalized (
        PccResidentListNormalizedRowId BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        SourceFileName NVARCHAR(260) NOT NULL,
        LoadBatchId UNIQUEIDENTIFIER NOT NULL,
        SnapshotDateTime DATETIME2(0) NOT NULL,
        SnapshotDateKey INT NOT NULL,
        FacilityName NVARCHAR(200) NOT NULL,
        ResidentDisplayName NVARCHAR(300) NOT NULL,
        ResidentName NVARCHAR(250) NOT NULL,
        ResidentSourceId NVARCHAR(50) NULL,
        AgeYears INT NULL,
        LocationRaw NVARCHAR(100) NULL,
        FloorCode NVARCHAR(20) NULL,
        UnitCode NVARCHAR(20) NULL,
        RoomCode NVARCHAR(20) NULL,
        BedCode NVARCHAR(20) NULL,
        AdmissionDate DATE NULL,
        AdmissionDateKey INT NULL,
        StatusRaw NVARCHAR(50) NULL,
        ResidentStatusNormalized NVARCHAR(30) NOT NULL,
        IsCurrentResident BIT NOT NULL,
        LoadedAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME()
    );
END;
GO

CREATE OR ALTER PROCEDURE mart.usp_LoadPccResidentCensus
    @LoadBatchId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRANSACTION;

    ;WITH ResidentSource AS (
        SELECT DISTINCT
            n.ResidentSourceId,
            n.ResidentName,
            n.ResidentDisplayName,
            n.AgeYears
        FROM stg.PccResidentListNormalized n
        WHERE n.LoadBatchId = @LoadBatchId
          AND n.ResidentSourceId IS NOT NULL
    )
    MERGE mart.DimResident AS target
    USING ResidentSource AS source
      ON target.ResidentSourceId = source.ResidentSourceId
     AND target.IsCurrent = 1
    WHEN MATCHED AND (
         ISNULL(target.ResidentName, '') <> ISNULL(source.ResidentName, '')
      OR ISNULL(target.ResidentDisplayName, '') <> ISNULL(source.ResidentDisplayName, '')
      OR ISNULL(target.AgeYears, -1) <> ISNULL(source.AgeYears, -1)
    )
      THEN UPDATE SET
         target.ResidentName = source.ResidentName,
         target.ResidentDisplayName = source.ResidentDisplayName,
         target.AgeYears = source.AgeYears
    WHEN NOT MATCHED BY TARGET
      THEN INSERT (ResidentSourceId, ResidentName, ResidentDisplayName, AgeYears)
           VALUES (source.ResidentSourceId, source.ResidentName, source.ResidentDisplayName, source.AgeYears);

    ;WITH UnitSource AS (
        SELECT DISTINCT
            n.FacilityName,
            NULLIF(n.FloorCode, '') AS FloorCode,
            NULLIF(n.UnitCode, '') AS UnitCode
        FROM stg.PccResidentListNormalized n
        WHERE n.LoadBatchId = @LoadBatchId
    )
    MERGE mart.DimUnit AS target
    USING UnitSource AS source
      ON target.FacilityName = source.FacilityName
     AND ISNULL(target.FloorCode, '') = ISNULL(source.FloorCode, '')
     AND ISNULL(target.UnitCode, '') = ISNULL(source.UnitCode, '')
     AND target.IsCurrent = 1
    WHEN NOT MATCHED BY TARGET
      THEN INSERT (FacilityName, FloorCode, UnitCode)
           VALUES (source.FacilityName, source.FloorCode, source.UnitCode);

    ;WITH EpisodeSource AS (
        SELECT DISTINCT
            r.ResidentKey,
            n.AdmissionDate,
            n.ResidentStatusNormalized
        FROM stg.PccResidentListNormalized n
        INNER JOIN mart.DimResident r
            ON r.ResidentSourceId = n.ResidentSourceId
           AND r.IsCurrent = 1
        WHERE n.LoadBatchId = @LoadBatchId
    )
    MERGE mart.DimEpisode AS target
    USING EpisodeSource AS source
      ON target.ResidentKey = source.ResidentKey
     AND ISNULL(target.AdmissionDate, '19000101') = ISNULL(source.AdmissionDate, '19000101')
     AND target.ResidentStatusNormalized = source.ResidentStatusNormalized
     AND target.IsCurrent = 1
    WHEN NOT MATCHED BY TARGET
      THEN INSERT (ResidentKey, AdmissionDate, ResidentStatusNormalized)
           VALUES (source.ResidentKey, source.AdmissionDate, source.ResidentStatusNormalized);

    INSERT INTO mart.FactResidentCensusSnapshot (
        SnapshotDateTime,
        SnapshotDateKey,
        ResidentKey,
        EpisodeKey,
        UnitKey,
        RoomCode,
        BedCode,
        AdmissionDateKey,
        IsCurrentResident,
        LocationRaw,
        StatusRaw,
        LoadBatchId
    )
    SELECT
        n.SnapshotDateTime,
        n.SnapshotDateKey,
        r.ResidentKey,
        e.EpisodeKey,
        u.UnitKey,
        NULLIF(n.RoomCode, ''),
        NULLIF(n.BedCode, ''),
        n.AdmissionDateKey,
        n.IsCurrentResident,
        NULLIF(n.LocationRaw, ''),
        NULLIF(n.StatusRaw, ''),
        n.LoadBatchId
    FROM stg.PccResidentListNormalized n
    INNER JOIN mart.DimResident r
        ON r.ResidentSourceId = n.ResidentSourceId
       AND r.IsCurrent = 1
    INNER JOIN mart.DimEpisode e
        ON e.ResidentKey = r.ResidentKey
       AND ISNULL(e.AdmissionDate, '19000101') = ISNULL(n.AdmissionDate, '19000101')
       AND e.ResidentStatusNormalized = n.ResidentStatusNormalized
       AND e.IsCurrent = 1
    LEFT JOIN mart.DimUnit u
        ON u.FacilityName = n.FacilityName
       AND ISNULL(u.FloorCode, '') = ISNULL(n.FloorCode, '')
       AND ISNULL(u.UnitCode, '') = ISNULL(n.UnitCode, '')
       AND u.IsCurrent = 1
    WHERE n.LoadBatchId = @LoadBatchId;

    COMMIT TRANSACTION;
END;
GO
