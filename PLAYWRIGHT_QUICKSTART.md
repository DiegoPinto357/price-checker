# Quick Start: Running Playwright Tests

This is a quick reference for running the Playwright integration tests.

> **Note:** These integration tests are for **local development only**. They are not run in CI/CD pipelines. CI runs only unit tests (`npm test`). Use these E2E tests locally to debug and test the NF Scanner feature.

## Prerequisites

Just make sure you have dependencies installed:

```bash
npm install
```

The tests use your system's Chrome browser, so no additional browser installation is needed.

## Running Tests

### Run all E2E tests

```bash
npm run test:e2e
```

This will:
1. Start the backend server on port 3002
2. Start the frontend dev server on port 5174  
3. Run all integration tests
4. Generate an HTML report

### Run tests interactively

```bash
npm run test:e2e:ui
```

This opens Playwright's UI mode where you can:
- See all tests and their status
- Run individual tests
- Watch test execution in real-time
- View traces and screenshots

### Debug a specific test

```bash
npm run test:e2e:debug
```

This opens the Playwright Inspector for step-by-step debugging.

## What the Tests Do

The integration tests for NF Scanner:

1. **Mock the QR code scanner** - Simulates scanning a valid nota fiscal QR code
2. **Fetch real data** - Makes actual HTTP requests to the backend (which scrapes the government website)
3. **Validate the UI** - Checks that the fetched data is displayed correctly
4. **Mock storage/database** - Prevents actual writes while testing the save flow

## Test Cases

1. ✅ Complete flow from scan to save
2. ✅ Error handling when API fails  
3. ✅ Data display validation with mocked responses
4. ✅ Cancel functionality after scanning

## Viewing Results

After running tests, view the HTML report:

```bash
npx playwright show-report
```

## Common Issues

**Servers fail to start**: 
- Check if ports 3002 and 5174 are available
- Or start servers manually in separate terminals and use `SKIP_WEBSERVER=1 npm run test:e2e`

**Test timeout**:
- The government website might be slow or unavailable
- Tests have built-in retry logic (2 retries)

**Need to update QR code**:
- Edit the `VALID_QR_CODE_URL` in `tests/e2e/fixtures.ts`

## More Information

For detailed documentation, see:
- [PLAYWRIGHT_SETUP.md](./PLAYWRIGHT_SETUP.md) - Complete setup guide
- [tests/e2e/README.md](./tests/e2e/README.md) - Test-specific documentation
