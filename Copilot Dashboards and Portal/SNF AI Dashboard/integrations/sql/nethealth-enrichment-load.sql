IF OBJECT_ID('stg.NetHealthTherapyCensusNormalized', 'U') IS NULL
BEGIN
    CREATE TABLE stg.NetHealthTherapyCensusNormalized (
        NetHealthTherapyCensusNormalizedRowId BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        SourceFileName NVARCHAR(260) NOT NULL,
        LoadBatchId UNIQUEIDENTIFIER NOT NULL,
        SnapshotDateTime DATETIME2(0) NOT NULL,
        SnapshotDateKey INT NOT NULL,
        FacilityName NVARCHAR(200) NOT NULL,
        ResidentSourceId NVARCHAR(50) NOT NULL,
        ResidentDisplayName NVARCHAR(200) NULL,
        ResidentNameKey NVARCHAR(100) NULL,
        TherapyCaseSourceId NVARCHAR(64) NOT NULL,
        DisciplineCode NVARCHAR(20) NOT NULL,
        TherapyCaseStatus NVARCHAR(50) NOT NULL,
        CaseStartDate DATE NULL,
        CaseStartDateKey INT NULL,
        CaseEndDate DATE NULL,
        CaseEndDateKey INT NULL,
        ClinicianName NVARCHAR(200) NULL,
        IsOpenCase BIT NOT NULL,
        TreatmentDate DATE NULL,
        TreatmentDateKey INT NULL,
        TreatmentReceived NVARCHAR(400) NULL,
        ServiceCode NVARCHAR(100) NULL,
        Minutes INT NULL,
        WingCode NVARCHAR(50) NULL,
        ResponseToTreatment NVARCHAR(400) NULL,
        DisciplineSourceValue NVARCHAR(100) NULL,
        LoadedAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME()
    );
END;
GO

IF OBJECT_ID('stg.NetHealthDocumentationDueDatesNormalized', 'U') IS NULL
BEGIN
    CREATE TABLE stg.NetHealthDocumentationDueDatesNormalized (
        NetHealthDocumentationDueDatesNormalizedRowId BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        SourceFileName NVARCHAR(260) NOT NULL,
        LoadBatchId UNIQUEIDENTIFIER NOT NULL,
        SnapshotDateTime DATETIME2(0) NOT NULL,
        SnapshotDateKey INT NOT NULL,
        FacilityName NVARCHAR(200) NOT NULL,
        ResidentSourceId NVARCHAR(50) NOT NULL,
        TherapyCaseSourceId NVARCHAR(50) NULL,
        ClinicianSourceId NVARCHAR(50) NOT NULL,
        ClinicianName NVARCHAR(200) NULL,
        DisciplineCode NVARCHAR(20) NOT NULL,
        DocumentTypeName NVARCHAR(200) NOT NULL,
        DueDate DATE NULL,
        DueDateKey INT NULL,
        CompletedDate DATE NULL,
        CompletedDateKey INT NULL,
        DocumentationStatus NVARCHAR(50) NOT NULL,
        IsOutstanding BIT NOT NULL,
        LoadedAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME()
    );
END;
GO

CREATE OR ALTER PROCEDURE mart.usp_LoadNetHealthTherapyCensus
    @LoadBatchId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    BEGIN TRANSACTION;

    ;WITH DisciplineSource AS (
        SELECT DISTINCT
            DisciplineCode,
            CASE DisciplineCode
                WHEN 'PT' THEN 'Physical Therapy'
                WHEN 'OT' THEN 'Occupational Therapy'
                WHEN 'ST' THEN 'Speech Therapy'
                WHEN 'Nursing' THEN 'Nursing'
                ELSE DisciplineCode
            END AS DisciplineName
        FROM stg.NetHealthTherapyCensusNormalized
        WHERE LoadBatchId = @LoadBatchId
    )
    MERGE mart.DimDiscipline AS target
    USING DisciplineSource AS source
      ON target.DisciplineCode = source.DisciplineCode AND target.IsCurrent = 1
    WHEN NOT MATCHED BY TARGET
      THEN INSERT (DisciplineCode, DisciplineName) VALUES (source.DisciplineCode, source.DisciplineName);

    ;WITH TherapyClinicianSource AS (
        SELECT DISTINCT
            CONCAT('THERAPY|', ISNULL(ClinicianName, 'Unknown')) AS ClinicianSourceId,
            ClinicianName,
            DisciplineCode
        FROM stg.NetHealthTherapyCensusNormalized
        WHERE LoadBatchId = @LoadBatchId
    )
    MERGE mart.DimClinician AS target
    USING TherapyClinicianSource AS source
      ON target.ClinicianSourceId = source.ClinicianSourceId AND target.IsCurrent = 1
    WHEN MATCHED THEN UPDATE SET
        target.ClinicianName = source.ClinicianName,
        target.DisciplineCode = source.DisciplineCode
    WHEN NOT MATCHED BY TARGET
      THEN INSERT (ClinicianSourceId, ClinicianName, DisciplineCode)
           VALUES (source.ClinicianSourceId, source.ClinicianName, source.DisciplineCode);

    ;WITH TherapyCaseSource AS (
        SELECT DISTINCT
            t.TherapyCaseSourceId,
            r.ResidentKey,
            d.DisciplineKey,
            c.ClinicianKey,
            t.CaseStartDateKey,
            t.TreatmentDateKey AS LastTreatmentDateKey
        FROM stg.NetHealthTherapyCensusNormalized t
        LEFT JOIN mart.DimResident r
            ON r.ResidentSourceId = t.ResidentSourceId AND r.IsCurrent = 1
        LEFT JOIN mart.DimDiscipline d
            ON d.DisciplineCode = t.DisciplineCode AND d.IsCurrent = 1
        LEFT JOIN mart.DimClinician c
            ON c.ClinicianSourceId = CONCAT('THERAPY|', ISNULL(t.ClinicianName, 'Unknown')) AND c.IsCurrent = 1
        WHERE t.LoadBatchId = @LoadBatchId
    )
    MERGE mart.DimTherapyCase AS target
    USING TherapyCaseSource AS source
      ON target.TherapyCaseSourceId = source.TherapyCaseSourceId AND target.IsCurrent = 1
    WHEN MATCHED THEN UPDATE SET
        target.ResidentKey = source.ResidentKey,
        target.DisciplineKey = source.DisciplineKey,
        target.ClinicianKey = source.ClinicianKey,
        target.CaseStartDateKey = source.CaseStartDateKey,
        target.LastTreatmentDateKey = source.LastTreatmentDateKey
    WHEN NOT MATCHED BY TARGET
      THEN INSERT (TherapyCaseSourceId, ResidentKey, DisciplineKey, ClinicianKey, CaseStartDateKey, LastTreatmentDateKey)
           VALUES (source.TherapyCaseSourceId, source.ResidentKey, source.DisciplineKey, source.ClinicianKey, source.CaseStartDateKey, source.LastTreatmentDateKey);

    INSERT INTO mart.FactTherapyCaseSnapshot (
        SnapshotDateKey,
        ResidentKey,
        TherapyCaseKey,
        DisciplineKey,
        ClinicianKey,
        TherapyCaseStatus,
        CaseStartDateKey,
        CaseEndDateKey,
        TreatmentDateKey,
        TreatmentMinutes,
        TreatmentCount,
        LoadBatchId
    )
    SELECT
        t.SnapshotDateKey,
        r.ResidentKey,
        tc.TherapyCaseKey,
        d.DisciplineKey,
        c.ClinicianKey,
        t.TherapyCaseStatus,
        t.CaseStartDateKey,
        t.CaseEndDateKey,
        t.TreatmentDateKey,
        t.Minutes,
        1,
        t.LoadBatchId
    FROM stg.NetHealthTherapyCensusNormalized t
    LEFT JOIN mart.DimResident r
        ON r.ResidentSourceId = t.ResidentSourceId AND r.IsCurrent = 1
    INNER JOIN mart.DimTherapyCase tc
        ON tc.TherapyCaseSourceId = t.TherapyCaseSourceId AND tc.IsCurrent = 1
    LEFT JOIN mart.DimDiscipline d
        ON d.DisciplineCode = t.DisciplineCode AND d.IsCurrent = 1
    LEFT JOIN mart.DimClinician c
        ON c.ClinicianSourceId = CONCAT('THERAPY|', ISNULL(t.ClinicianName, 'Unknown')) AND c.IsCurrent = 1
    WHERE t.LoadBatchId = @LoadBatchId;

    COMMIT TRANSACTION;
END;
GO

CREATE OR ALTER PROCEDURE mart.usp_LoadNetHealthDocumentationDueDates
    @LoadBatchId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    BEGIN TRANSACTION;

    ;WITH DisciplineSource AS (
        SELECT DISTINCT
            DisciplineCode,
            CASE DisciplineCode
                WHEN 'PT' THEN 'Physical Therapy'
                WHEN 'OT' THEN 'Occupational Therapy'
                WHEN 'ST' THEN 'Speech Therapy'
                WHEN 'Nursing' THEN 'Nursing'
                ELSE DisciplineCode
            END AS DisciplineName
        FROM stg.NetHealthDocumentationDueDatesNormalized
        WHERE LoadBatchId = @LoadBatchId
    )
    MERGE mart.DimDiscipline AS target
    USING DisciplineSource AS source
      ON target.DisciplineCode = source.DisciplineCode AND target.IsCurrent = 1
    WHEN NOT MATCHED BY TARGET
      THEN INSERT (DisciplineCode, DisciplineName) VALUES (source.DisciplineCode, source.DisciplineName);

    ;WITH ClinicianSource AS (
        SELECT DISTINCT
            ClinicianSourceId,
            ClinicianName,
            DisciplineCode
        FROM stg.NetHealthDocumentationDueDatesNormalized
        WHERE LoadBatchId = @LoadBatchId
    )
    MERGE mart.DimClinician AS target
    USING ClinicianSource AS source
      ON target.ClinicianSourceId = source.ClinicianSourceId AND target.IsCurrent = 1
    WHEN MATCHED THEN UPDATE SET
        target.ClinicianName = source.ClinicianName,
        target.DisciplineCode = source.DisciplineCode
    WHEN NOT MATCHED BY TARGET
      THEN INSERT (ClinicianSourceId, ClinicianName, DisciplineCode)
           VALUES (source.ClinicianSourceId, source.ClinicianName, source.DisciplineCode);

    ;WITH DocumentTypeSource AS (
        SELECT DISTINCT DocumentTypeName
        FROM stg.NetHealthDocumentationDueDatesNormalized
        WHERE LoadBatchId = @LoadBatchId
    )
    MERGE mart.DimDocumentType AS target
    USING DocumentTypeSource AS source
      ON target.DocumentTypeName = source.DocumentTypeName AND target.IsCurrent = 1
    WHEN NOT MATCHED BY TARGET
      THEN INSERT (DocumentTypeName) VALUES (source.DocumentTypeName);

    INSERT INTO mart.FactDocumentationTask (
        SnapshotDateKey,
        ResidentKey,
        TherapyCaseKey,
        ClinicianKey,
        DisciplineKey,
        DocumentTypeKey,
        DueDateKey,
        CompletedDateKey,
        DocumentationStatus,
        IsOutstanding,
        LoadBatchId
    )
    SELECT
        d.SnapshotDateKey,
        r.ResidentKey,
        tc.TherapyCaseKey,
        c.ClinicianKey,
        dd.DisciplineKey,
        dt.DocumentTypeKey,
        d.DueDateKey,
        d.CompletedDateKey,
        d.DocumentationStatus,
        d.IsOutstanding,
        d.LoadBatchId
    FROM stg.NetHealthDocumentationDueDatesNormalized d
    LEFT JOIN mart.DimResident r
        ON r.ResidentSourceId = d.ResidentSourceId AND r.IsCurrent = 1
    LEFT JOIN mart.DimTherapyCase tc
        ON tc.TherapyCaseSourceId = d.TherapyCaseSourceId AND tc.IsCurrent = 1
    INNER JOIN mart.DimClinician c
        ON c.ClinicianSourceId = d.ClinicianSourceId AND c.IsCurrent = 1
    LEFT JOIN mart.DimDiscipline dd
        ON dd.DisciplineCode = d.DisciplineCode AND dd.IsCurrent = 1
    INNER JOIN mart.DimDocumentType dt
        ON dt.DocumentTypeName = d.DocumentTypeName AND dt.IsCurrent = 1
    WHERE d.LoadBatchId = @LoadBatchId;

    COMMIT TRANSACTION;
END;
GO
