# Fabric Architecture Notes

## Real-Time Pattern

- Eventstream for ingest
- Eventhouse / KQL for low-latency point queries
- Lakehouse for curated and historical analytics
- Real-Time Dashboard for live operational views
- Data Activator for rule-based actions
- Reflex for predictive analytics on streams

## Capacity Note

- Keep an eye on Fabric capacity planning early.
- Use the smallest capacity that still supports the expected live event volume and dashboard refresh behavior.

