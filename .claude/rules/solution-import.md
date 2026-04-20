When importing or managing Power Platform solutions:

- Use pac solution import for solution imports
- Use pac solution list to verify current solutions in environment
- Use pac solution export for backups before major changes
- Connection references must be resolved post-import via settings files or pac connection
- Verify solution components after import: pac solution component list
- For unpacked solutions: pac solution pack before import, pac solution unpack after export
- Track solution settings in *_Settings.json files at repo root
