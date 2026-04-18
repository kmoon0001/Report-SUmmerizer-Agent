# Copilot Studio Workflow

## Local Editing

- Make repo changes first.
- Keep names canonical and descriptive.
- Prefer modular topic and workflow files.

## Live Validation

- Run preview in the Copilot Studio extension.
- Review the diff before applying.
- Apply changes in the extension.
- Publish with `pac copilot publish`.
- Confirm health with `pac copilot status`.

## Browser Checks

- Use Playwright to verify the live Copilot Studio web experience when UI confirmation matters.
- Check that the first turn is choice-driven.
- Check that recovery paths do not strand the user.

