# E2E Integration Tests with Playwright

This directory contains end-to-end integration tests for the Price Checker application using Playwright.

> **Note:** These integration tests are for **local development only**. They are not run in CI/CD pipelines. Use these tests locally to debug and test the NF Scanner feature.

## Setup

The Playwright setup is already configured. The project is configured to use the system's Chrome browser by default, so browser installation is optional.

### Optional: Install Playwright browsers

If you want to use Playwright's bundled browsers instead of the system browser:

```bash
npx playwright install chromium
```

Or install all browsers:

```bash
npx playwright install
```

**Note:** If you encounter download errors, the system's Chrome browser will be used automatically.

## Running Tests

### Run all E2E tests

```bash
npm run test:e2e
```

### Run tests in UI mode (interactive)

```bash
npm run test:e2e:ui
```

### Debug tests

```bash
npm run test:e2e:debug
```

### Run tests in headed mode (see the browser)

```bash
npx playwright test --headed
```

## Test Structure

### NF Scanner Integration Test (`nf-scanner.spec.ts`)

This test validates the complete flow of the NF Scanner feature:

1. **Scanning a QR code** - Simulates scanning a QR code from a nota fiscal
2. **Fetching data** - Makes a real HTTP request to fetch data from the backend server (which in turn scrapes the government website)
3. **Displaying results** - Validates that the fetched data is correctly displayed in the UI
4. **Saving data** - Validates that the data can be saved to the database

#### Test Cases

1. **Full flow test** - Tests the complete flow from scan to save
2. **Error handling** - Tests how the app handles errors when fetching data
3. **Data display validation** - Validates that fetched data is correctly displayed
4. **Cancel functionality** - Tests the ability to cancel after scanning

#### Mocking Strategy

- **QR Code Scanner**: The `BarcodeScanner` component is mocked to return a predefined QR code URL
- **Storage**: Storage operations are logged but not persisted (mocked)
- **Database**: Database operations are logged but not persisted (mocked)
- **API Requests**: By default, real API requests are made. Individual tests can override this with `page.route()` to mock responses

#### Valid QR Code for Testing

The tests use a valid QR code URL that can fetch real data from the government website:

```
https://www.sefaz.rs.gov.br/NFCE/NFCE-COM.aspx?p=43230693015006003210651210008545221815897062|2|1|1|F45F565F22E7784B638952FF47C3870F93E7212C
```

**Note**: This QR code may expire or the government website may change, which could cause tests to fail. In such cases, you can:
1. Update the QR code URL with a valid one
2. Mock the API response using `page.route()` as shown in the test examples

## Configuration

The Playwright configuration is in `playwright.config.ts` at the root of the project. Key settings:

- **Base URL**: `http://127.0.0.1:5174` (Vite dev server)
- **Web Server**: Automatically starts the backend server and Vite dev server before running tests
- **Browser**: Tests run in Chromium by default
- **Timeout**: 120 seconds for starting servers

## Debugging

### Using Playwright Inspector

```bash
npm run test:e2e:debug
```

This opens the Playwright Inspector, which allows you to:
- Step through tests
- See what the browser is doing
- Inspect locators
- View console logs

### View test report

After running tests, view the HTML report:

```bash
npx playwright show-report
```

### Screenshots and videos

Playwright automatically captures:
- Screenshots on failure
- Traces on first retry (can be viewed with `npx playwright show-trace`)

## Troubleshooting

### Tests fail with timeout errors

- Make sure the dev server is running properly
- Increase timeout in `playwright.config.ts`
- Check if the backend server (port 3002) is responding

### BarcodeScanner mock not working

- Check that the mock is being injected in `page.addInitScript()`
- Verify that the component is using the mocked version

### Government website is down

- Use mocked API responses instead of real requests
- Update the test to expect error handling

## Best Practices

1. **Isolate tests**: Each test should be independent and not rely on previous tests
2. **Use stable locators**: Prefer `getByRole()`, `getByTestId()`, and `getByText()` over CSS selectors
3. **Mock external dependencies**: Mock the QR scanner, storage, and database to avoid side effects
4. **Handle async operations**: Use `waitFor` and `expect` with timeouts
5. **Test error cases**: Don't just test the happy path

## Future Improvements

- Add visual regression testing
- Add performance testing
- Add accessibility testing with `@axe-core/playwright`
- Add more edge cases (network failures, invalid data, etc.)
- Add tests for other features (products, recipes, meals planner)
