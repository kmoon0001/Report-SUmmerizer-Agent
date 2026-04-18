CREATE SCHEMA stg;
GO

CREATE SCHEMA mart;
GO

CREATE TABLE stg.PccResidentList (
    PccResidentListRowId BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    SourceFileName NVARCHAR(260) NOT NULL,
    SourceExtractedAt DATETIME2(0) NOT NULL,
    SourceFacilityName NVARCHAR(200) NOT NULL,
    SourceReportName NVARCHAR(200) NOT NULL,
    ResidentDisplayName NVARCHAR(300) NOT NULL,
    AgeText NVARCHAR(50) NULL,
    LocationRaw NVARCHAR(100) NULL,
    AdmissionDateText NVARCHAR(50) NULL,
    StatusRaw NVARCHAR(50) NULL,
    LoadBatchId UNIQUEIDENTIFIER NOT NULL,
    LoadedAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

CREATE TABLE mart.DimResident (
    ResidentKey INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    ResidentSourceId NVARCHAR(50) NOT NULL,
    ResidentName NVARCHAR(250) NOT NULL,
    ResidentDisplayName NVARCHAR(300) NOT NULL,
    AgeYears INT NULL,
    EffectiveStartDate DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    EffectiveEndDate DATETIME2(0) NULL,
    IsCurrent BIT NOT NULL DEFAULT 1
);
GO

CREATE UNIQUE INDEX UX_DimResident_Current
ON mart.DimResident (ResidentSourceId, IsCurrent);
GO

CREATE TABLE mart.DimUnit (
    UnitKey INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    FacilityName NVARCHAR(200) NOT NULL,
    FloorCode NVARCHAR(20) NULL,
    UnitCode NVARCHAR(20) NULL,
    EffectiveStartDate DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    EffectiveEndDate DATETIME2(0) NULL,
    IsCurrent BIT NOT NULL DEFAULT 1
);
GO

CREATE UNIQUE INDEX UX_DimUnit_Current
ON mart.DimUnit (FacilityName, FloorCode, UnitCode, IsCurrent);
GO

CREATE TABLE mart.DimEpisode (
    EpisodeKey INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    ResidentKey INT NOT NULL,
    AdmissionDate DATE NULL,
    ResidentStatusNormalized NVARCHAR(30) NOT NULL,
    EffectiveStartDate DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    EffectiveEndDate DATETIME2(0) NULL,
    IsCurrent BIT NOT NULL DEFAULT 1,
    CONSTRAINT FK_DimEpisode_DimResident FOREIGN KEY (ResidentKey) REFERENCES mart.DimResident(ResidentKey)
);
GO

CREATE TABLE mart.FactResidentCensusSnapshot (
    ResidentCensusSnapshotKey BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    SnapshotDateTime DATETIME2(0) NOT NULL,
    SnapshotDateKey INT NOT NULL,
    ResidentKey INT NOT NULL,
    EpisodeKey INT NOT NULL,
    UnitKey INT NULL,
    RoomCode NVARCHAR(20) NULL,
    BedCode NVARCHAR(20) NULL,
    AdmissionDateKey INT NULL,
    IsCurrentResident BIT NOT NULL,
    LocationRaw NVARCHAR(100) NULL,
    StatusRaw NVARCHAR(50) NULL,
    SourceSystem NVARCHAR(50) NOT NULL DEFAULT 'PCC',
    LoadBatchId UNIQUEIDENTIFIER NOT NULL,
    LoadedAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_FactResidentCensusSnapshot_DimResident FOREIGN KEY (ResidentKey) REFERENCES mart.DimResident(ResidentKey),
    CONSTRAINT FK_FactResidentCensusSnapshot_DimEpisode FOREIGN KEY (EpisodeKey) REFERENCES mart.DimEpisode(EpisodeKey),
    CONSTRAINT FK_FactResidentCensusSnapshot_DimUnit FOREIGN KEY (UnitKey) REFERENCES mart.DimUnit(UnitKey)
);
GO

CREATE INDEX IX_FactResidentCensusSnapshot_SnapshotDateTime
ON mart.FactResidentCensusSnapshot (SnapshotDateTime);
GO

CREATE INDEX IX_FactResidentCensusSnapshot_CurrentResident
ON mart.FactResidentCensusSnapshot (IsCurrentResident, SnapshotDateKey);
GO
