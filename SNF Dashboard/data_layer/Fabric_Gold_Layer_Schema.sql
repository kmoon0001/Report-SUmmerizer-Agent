-- ==============================================================================
-- Microsoft Fabric: SNF Command Center Gold Layer Schema
-- Architecture: Healthcare Data Solutions (Aligned to FHIR/OMOP standards)
-- Storage: OneLake Delta Parquet (For Power BI Direct Lake & Copilot RAG)
-- Status: Production Blueprint
-- ==============================================================================

-- 1. DIMENSION: PATIENTS (Scrubbed for Copilot Studio Access)
CREATE TABLE Dim_Patient (
    PatientKey UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,
    MRN_Masked VARCHAR(50) NOT NULL, -- Format: ***-1234
    AgeAtAdmission INT NOT NULL,
    Gender VARCHAR(20),
    PrimaryLanguage VARCHAR(50),
    CodeStatus VARCHAR(50), -- e.g., Full Code, DNR
    IsHighRiskFall BIT DEFAULT 0,
    IsHighRiskElopement BIT DEFAULT 0,
    RowValidFrom DATETIME2,
    RowValidTo DATETIME2,
    IsCurrent BIT
);

-- 2. DIMENSION: FACILITY & UNITS
CREATE TABLE Dim_Facility (
    FacilityKey UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,
    UnitName VARCHAR(100) NOT NULL,
    Wing VARCHAR(100),
    BedCapacity INT,
    CurrentCensus INT,
    AcuityLevel VARCHAR(50)
);

-- 3. FACT: CLINICAL OBSERVATIONS (Vitals & Risk Scores)
CREATE TABLE Fact_ClinicalObservation (
    ObservationKey UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,
    PatientKey UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Dim_Patient(PatientKey),
    FacilityKey UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Dim_Facility(FacilityKey),
    ObservationDate DATETIME2 NOT NULL,
    Category VARCHAR(100) NOT NULL, -- e.g., 'Vital Signs', 'Risk Score', 'Neurological'
    MeasureName VARCHAR(100) NOT NULL, -- e.g., 'Systolic BP', 'Braden Scale'
    MeasureValue DECIMAL(10,2),
    MeasureStringValue VARCHAR(255),
    IsCriticalValue BIT DEFAULT 0,
    EnteredByRole VARCHAR(100)
);

-- 4. FACT: INCIDENTS & ESCALATIONS (Powers the Copilot Agent Alerts)
CREATE TABLE Fact_ClinicalIncident (
    IncidentKey UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,
    PatientKey UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Dim_Patient(PatientKey),
    FacilityKey UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Dim_Facility(FacilityKey),
    IncidentDate DATETIME2 NOT NULL,
    IncidentType VARCHAR(100) NOT NULL, -- e.g., 'Fall', 'Medication Error', 'Change in Condition'
    SeverityLevel VARCHAR(50) NOT NULL, -- e.g., 'Routine', 'Urgent', 'Emergency'
    AlertTrackingId VARCHAR(100),
    CopilotSessionId VARCHAR(100), -- Ties back to the Agent Telemetry
    IsResolved BIT DEFAULT 0,
    ResolvedDate DATETIME2
);

-- 5. FACT: THERAPY & REHAB (Powers Revenue/MDS Dashboard)
CREATE TABLE Fact_TherapySession (
    SessionKey UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,
    PatientKey UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Dim_Patient(PatientKey),
    SessionDate DATE NOT NULL,
    Discipline VARCHAR(50), -- e.g., 'PT', 'OT', 'SLP'
    MinutesDelivered INT NOT NULL,
    GoalProgress VARCHAR(100),
    TherapyPickupOpportunity BIT DEFAULT 0
);

-- 6. FACT: THERAPY RECERTIFICATION & DOCUMENTS (NetHealth Optima)
CREATE TABLE Fact_TherapyRecertification (
    DocumentKey UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,
    PatientKey UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Dim_Patient(PatientKey),
    Discipline VARCHAR(50), -- e.g., 'PT', 'OT', 'SLP'
    DueDate DATE NOT NULL,
    DocumentType VARCHAR(100), -- 'Progress Report', 'Recertification'
    Status VARCHAR(50), -- 'Pending', 'Signed', 'Overdue'
    AverageProgressScore DECIMAL(5,2), -- Average progress made in this period
    ReportingPeriodStart DATE,
    ReportingPeriodEnd DATE
);

-- 7. FACT: PATIENT APPOINTMENTS & LOA (PointClickCare)
CREATE TABLE Fact_PatientAppointments (
    AppointmentKey UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,
    PatientKey UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Dim_Patient(PatientKey),
    FacilityKey UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Dim_Facility(FacilityKey),
    AppointmentDate DATE NOT NULL,
    StartTime TIME,
    EndTime TIME,
    Location VARCHAR(100),
    Status VARCHAR(50) -- 'Out of Facility', 'Returned', 'Cancelled'
);

-- 8. FACT: STAFFING & WORKLOAD (Workday)
CREATE TABLE Fact_StaffingCoverage (
    StaffingKey UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,
    FacilityKey UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Dim_Facility(FacilityKey),
    ShiftDate DATE NOT NULL,
    ShiftType VARCHAR(50), -- 'Day', 'Evening', 'Night'
    Role VARCHAR(50), -- 'RN', 'LPN', 'CNA'
    StaffCount INT,
    PatientToStaffRatio DECIMAL(5,2),
    IsBelowMinimumSafeLevel BIT DEFAULT 0
);
