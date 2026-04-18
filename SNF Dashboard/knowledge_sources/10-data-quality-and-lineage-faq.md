# Data Quality And Lineage FAQ

## Why can a dashboard number differ from the source system?

- The dashboard may use a different refresh time than the source system screen you are viewing.
- The dashboard may apply role, unit, or timeframe filters.
- The dashboard may exclude records that fail quality checks or are still incomplete.

## What should happen when key data is missing?

- High-risk workflows should flag the missing data and avoid overconfident conclusions.
- Critical data-quality failures should block downstream alerts or recommendations when policy requires it.

## What should users trust most?

- Structured source data and approved workflows should be treated as the highest-confidence inputs.
- AI-generated summaries should always be read with the underlying clinical context and policy guidance in mind.

