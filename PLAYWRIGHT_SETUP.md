# Playwright Integration Tests - Setup Guide

This document describes the Playwright integration test setup for the Price Checker application.

> **Note:** These integration tests are for **local development only**. They are not run in CI/CD pipelines. The CI workflow (`test.yml`) only runs unit tests with Vitest. Use these E2E tests locally to debug the NF Scanner feature.

## Overview

The Playwright setup enables end-to-end integration testing of the application, particularly focusing on the NF Scanner feature. The tests simulate the complete user flow from scanning a QR code to saving the fetched data.

## What's Included

1. **Playwright Configuration** (`playwright.config.ts`)
   - Configured to use system Chrome browser
   - Auto-starts both backend server (port 3002) and frontend dev server (port 5174)
   - Test directory: `tests/e2e/`

2. **Integration Test for NF Scanner** (`tests/e2e/nf-scanner.spec.ts`)
   - Tests the complete QR code scanning flow
   - Mocks the BarcodeScanner component
   - Mocks storage and database operations
   - Tests both success and error scenarios

3. **Test Fixtures** (`tests/e2e/fixtures.ts`)
   - Reusable mock functions for QR scanner, storage, and database
   - Mock data for consistent testing

4. **NPM Scripts** (in `package.json`)
   - `npm run test:e2e` - Run all E2E tests
   - `npm run test:e2e:ui` - Run tests in interactive UI mode
   - `npm run test:e2e:debug` - Debug tests with Playwright Inspector

## Quick Start

### Prerequisites

- Node.js and npm installed
- Chrome/Chromium browser (usually pre-installed on most systems)

### Running Tests

1. Install dependencies (if not already done):
   ```bash
   npm install
   ```

2. Run the E2E tests:
   ```bash
   npm run test:e2e
   ```

The tests will:
- Automatically start the backend server (port 3002)
- Automatically start the frontend dev server (port 5174)
- Run all integration tests
- Generate an HTML report

### Viewing the Test Report

After running tests, view the HTML report:
```bash
npx playwright show-report
```

## Test Coverage

The integration tests cover:

1. **Full Flow Test**
   - Scanning a QR code (mocked)
   - Fetching data from the backend (real or mocked API)
   - Displaying the results in the UI
   - Saving the data (mocked storage/database)

2. **Error Handling**
   - Network failures
   - Invalid QR codes
   - API errors

3. **User Interactions**
   - Canceling after scanning
   - Navigation between app sections

## Debugging

### Use Playwright Inspector

For step-by-step debugging:
```bash
npm run test:e2e:debug
```

This opens an interactive debugger where you can:
- Step through test code
- Inspect DOM elements
- View console logs
- See network requests

### Run in Headed Mode

To see the browser while tests run:
```bash
npx playwright test --headed
```

### Run Specific Test

To run a single test file:
```bash
npx playwright test tests/e2e/nf-scanner.spec.ts
```

To run a specific test case:
```bash
npx playwright test -g "should scan QR code"
```

## Architecture

### Mocking Strategy

The tests use a layered mocking approach:

1. **QR Code Scanner**: Mocked at the browser level using `page.addInitScript()` to inject a mock BarcodeScanner object
2. **Storage/Database**: Mocked at the browser level, with operations logged to console
3. **API Responses**: Can be mocked using `page.route()` for consistent test data

### Why This Approach?

- **QR Scanner**: Requires a physical camera, so must be mocked
- **Storage/Database**: Prevents side effects and ensures test isolation
- **API**: Can use real API for integration testing, or mocked for unit-like testing

## Known Issues and Limitations

1. **Browser Installation**: If `npx playwright install` fails, the system Chrome browser is used automatically. This is configured in `playwright.config.ts`.

2. **Government Website Dependency**: Some tests may fail if:
   - The government website (sefaz.rs.gov.br) is down
   - The QR code used in tests expires
   - The website HTML structure changes

   **Solution**: Use mocked API responses instead of real requests

3. **Server Startup Time**: The webServer configuration has a 120-second timeout. If servers fail to start, increase this value in `playwright.config.ts`.

## Future Improvements

- [ ] Add visual regression testing
- [ ] Add performance testing
- [ ] Add accessibility testing with axe-core
- [ ] Add tests for other features (Products, Recipes, Meals Planner)
- [ ] Add CI/CD integration
- [ ] Add screenshot comparison tests

## Troubleshooting

### Tests timeout during startup

**Problem**: Tests fail with timeout errors during server startup.

**Solution**: 
1. Check if ports 3002 and 5174 are available
2. Increase timeout in `playwright.config.ts` webServer config
3. Manually start servers and run tests with `reuseExistingServer: true`

### BarcodeScanner mock not working

**Problem**: QR scanner doesn't trigger or fails.

**Solution**:
1. Verify the mock is injected in `beforeEach` hook
2. Check browser console for errors
3. Ensure the component is rendering before mock is applied

### Cannot find Chrome browser

**Problem**: Playwright fails to find a browser.

**Solution**:
1. Install Chrome: `sudo apt-get install google-chrome-stable`
2. Or install Playwright browsers: `npx playwright install chromium`

## Documentation

For more detailed information, see:
- [E2E Test README](./tests/e2e/README.md)
- [Playwright Documentation](https://playwright.dev/)

## Support

If you encounter issues with the Playwright setup, please:
1. Check the troubleshooting section above
2. Review test logs and HTML reports
3. Run tests with `--debug` flag for more details
