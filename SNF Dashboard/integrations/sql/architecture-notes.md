# SQL Architecture Notes

## Use It For

- reporting tables
- operational joins that do not belong in Dataverse
- historical staging when needed

## Current First Build

The first implemented SQL path is:

- PCC resident census raw extract
- normalized staging file
- `stg.PccResidentListNormalized`
- `mart.DimResident`
- `mart.DimEpisode`
- `mart.DimUnit`
- `mart.FactResidentCensusSnapshot`

Net Health enrichment should layer onto this base after the first PCC census load is proven.
