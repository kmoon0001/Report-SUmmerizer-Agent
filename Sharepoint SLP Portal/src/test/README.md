# Test Directory Structure

This directory contains all test files organized by test type following gold-standard testing practices.

## Directory Organization

```
src/test/
├── unit/              # Unit tests (70% of tests)
├── integration/       # Integration tests (20% of tests)
├── e2e/              # End-to-end tests (10% of tests)
├── functional/       # Requirement-based functional tests
├── smoke/            # Quick validation tests
├── regression/       # Regression tests (functional + visual)
├── uat/              # User acceptance tests
├── security/         # Security tests (OWASP)
├── performance/      # Performance tests (Lighthouse, load testing)
├── compliance/       # Compliance tests (HIPAA, Medicare, WCAG)
├── accessibility/    # Accessibility tests (axe-core, keyboard, screen reader)
└── setup.ts          # Global test setup

```

## Test Commands

```bash
# Run all tests
npm test

# Run specific test types
npm run test:unit
npm run test:integration
npm run test:e2e
npm run test:functional
npm run test:smoke
npm run test:regression
npm run test:uat
npm run test:security
npm run test:performance
npm run test:compliance
npm run test:accessibility

# Run all test types
npm run test:all

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

## Coverage Targets

- **Line Coverage**: 90% minimum
- **Branch Coverage**: 85% minimum
- **Function Coverage**: 95% minimum
- **Statement Coverage**: 90% minimum

## Test Frameworks

- **Unit/Integration/Functional**: Vitest + React Testing Library
- **Property-Based**: fast-check
- **E2E/UAT/Regression**: Playwright
- **Accessibility**: axe-core + @axe-core/playwright
- **Performance**: Lighthouse
- **Security**: Custom tests + npm audit + OWASP ZAP

## Reference

See `.kiro/specs/physical-therapy-portal-transformation/TESTING-STRATEGY.md` for complete testing strategy and best practices.
