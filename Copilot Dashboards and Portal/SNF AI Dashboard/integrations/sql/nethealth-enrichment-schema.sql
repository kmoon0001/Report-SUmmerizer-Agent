CREATE TABLE mart.DimDiscipline (
    DisciplineKey INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    DisciplineCode NVARCHAR(20) NOT NULL,
    DisciplineName NVARCHAR(100) NOT NULL,
    IsCurrent BIT NOT NULL DEFAULT 1
);
GO

CREATE UNIQUE INDEX UX_DimDiscipline_Current
ON mart.DimDiscipline (DisciplineCode, IsCurrent);
GO

CREATE TABLE mart.DimClinician (
    ClinicianKey INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    ClinicianSourceId NVARCHAR(50) NOT NULL,
    ClinicianName NVARCHAR(200) NULL,
    DisciplineCode NVARCHAR(20) NULL,
    IsCurrent BIT NOT NULL DEFAULT 1
);
GO

CREATE UNIQUE INDEX UX_DimClinician_Current
ON mart.DimClinician (ClinicianSourceId, IsCurrent);
GO

CREATE TABLE mart.DimDocumentType (
    DocumentTypeKey INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    DocumentTypeName NVARCHAR(200) NOT NULL,
    IsCurrent BIT NOT NULL DEFAULT 1
);
GO

CREATE UNIQUE INDEX UX_DimDocumentType_Current
ON mart.DimDocumentType (DocumentTypeName, IsCurrent);
GO

CREATE TABLE mart.DimTherapyCase (
    TherapyCaseKey INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    TherapyCaseSourceId NVARCHAR(64) NOT NULL,
    ResidentKey INT NULL,
    DisciplineKey INT NULL,
    ClinicianKey INT NULL,
    CaseStartDateKey INT NULL,
    LastTreatmentDateKey INT NULL,
    IsCurrent BIT NOT NULL DEFAULT 1,
    CONSTRAINT FK_DimTherapyCase_DimResident FOREIGN KEY (ResidentKey) REFERENCES mart.DimResident(ResidentKey),
    CONSTRAINT FK_DimTherapyCase_DimDiscipline FOREIGN KEY (DisciplineKey) REFERENCES mart.DimDiscipline(DisciplineKey),
    CONSTRAINT FK_DimTherapyCase_DimClinician FOREIGN KEY (ClinicianKey) REFERENCES mart.DimClinician(ClinicianKey)
);
GO

CREATE UNIQUE INDEX UX_DimTherapyCase_Current
ON mart.DimTherapyCase (TherapyCaseSourceId, IsCurrent);
GO

CREATE TABLE mart.FactTherapyCaseSnapshot (
    TherapyCaseSnapshotKey BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    SnapshotDateKey INT NOT NULL,
    ResidentKey INT NULL,
    TherapyCaseKey INT NOT NULL,
    DisciplineKey INT NULL,
    ClinicianKey INT NULL,
    TherapyCaseStatus NVARCHAR(50) NOT NULL,
    CaseStartDateKey INT NULL,
    CaseEndDateKey INT NULL,
    TreatmentDateKey INT NULL,
    TreatmentMinutes INT NULL,
    TreatmentCount INT NOT NULL DEFAULT 1,
    LoadBatchId UNIQUEIDENTIFIER NOT NULL,
    LoadedAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_FactTherapyCaseSnapshot_DimResident FOREIGN KEY (ResidentKey) REFERENCES mart.DimResident(ResidentKey),
    CONSTRAINT FK_FactTherapyCaseSnapshot_DimTherapyCase FOREIGN KEY (TherapyCaseKey) REFERENCES mart.DimTherapyCase(TherapyCaseKey),
    CONSTRAINT FK_FactTherapyCaseSnapshot_DimDiscipline FOREIGN KEY (DisciplineKey) REFERENCES mart.DimDiscipline(DisciplineKey),
    CONSTRAINT FK_FactTherapyCaseSnapshot_DimClinician FOREIGN KEY (ClinicianKey) REFERENCES mart.DimClinician(ClinicianKey)
);
GO

CREATE TABLE mart.FactDocumentationTask (
    DocumentationTaskKey BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    SnapshotDateKey INT NOT NULL,
    ResidentKey INT NULL,
    TherapyCaseKey INT NULL,
    ClinicianKey INT NOT NULL,
    DisciplineKey INT NULL,
    DocumentTypeKey INT NOT NULL,
    DueDateKey INT NULL,
    CompletedDateKey INT NULL,
    DocumentationStatus NVARCHAR(50) NOT NULL,
    IsOutstanding BIT NOT NULL,
    LoadBatchId UNIQUEIDENTIFIER NOT NULL,
    LoadedAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_FactDocumentationTask_DimResident FOREIGN KEY (ResidentKey) REFERENCES mart.DimResident(ResidentKey),
    CONSTRAINT FK_FactDocumentationTask_DimTherapyCase FOREIGN KEY (TherapyCaseKey) REFERENCES mart.DimTherapyCase(TherapyCaseKey),
    CONSTRAINT FK_FactDocumentationTask_DimClinician FOREIGN KEY (ClinicianKey) REFERENCES mart.DimClinician(ClinicianKey),
    CONSTRAINT FK_FactDocumentationTask_DimDiscipline FOREIGN KEY (DisciplineKey) REFERENCES mart.DimDiscipline(DisciplineKey),
    CONSTRAINT FK_FactDocumentationTask_DimDocumentType FOREIGN KEY (DocumentTypeKey) REFERENCES mart.DimDocumentType(DocumentTypeKey)
);
GO
