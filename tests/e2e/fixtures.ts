import { Page } from '@playwright/test';

/**
 * Mock the BarcodeScanner component to simulate a QR code scan.
 * This is necessary because the actual barcode scanner requires a camera.
 */
export async function mockQrCodeScanner(page: Page, qrCodeData: string) {
  await page.addInitScript((data) => {
    // Mock the Capacitor BarcodeScanner API
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).Capacitor = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(window as any).Capacitor,
      getPlatform: () => 'web',
    };
    
    // Mock the BarcodeScanner module
    const mockBarcodeScanner = {
      checkPermission: async () => ({ granted: true }),
      hideBackground: () => { /* no-op */ },
      showBackground: () => { /* no-op */ },
      stopScan: () => { /* no-op */ },
      startScan: async () => ({
        hasContent: true,
        content: data,
      }),
    };
    
    // Inject into window for module imports
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).BarcodeScanner = mockBarcodeScanner;
  }, qrCodeData);
}

/**
 * Mock storage and database operations.
 * In a real scenario, these would be mocked at the API level.
 */
export async function mockStorageAndDatabase(page: Page) {
  await page.addInitScript(() => {
    // Mock storage operations
    const mockStorage = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      writeFile: async (path: string, data: any) => {
        console.log(`[MOCK] Writing to storage: ${path}`, data);
        return true;
      },
      readFile: async (path: string) => {
        console.log(`[MOCK] Reading from storage: ${path}`);
        return null;
      },
    };
    
    // Mock database operations
    const mockDatabase = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      insertOne: async (db: string, collection: string, data: any) => {
        console.log(`[MOCK] Inserting into ${db}.${collection}`, data);
        return { insertedId: 'mock-id' };
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      findOne: async (db: string, collection: string, query: any) => {
        console.log(`[MOCK] Finding one in ${db}.${collection}`, query);
        return null;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      find: async (db: string, collection: string, query: any) => {
        console.log(`[MOCK] Finding in ${db}.${collection}`, query);
        return [];
      },
    };
    
    // Store mocks on window for access
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__mockStorage = mockStorage;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__mockDatabase = mockDatabase;
  });
}

/**
 * Valid QR code URL that can be used for testing.
 * This is a real QR code from a nota fiscal.
 * 
 * Note: This QR code may expire or the government website may change.
 */
export const VALID_QR_CODE_URL = 
  'https://www.sefaz.rs.gov.br/NFCE/NFCE-COM.aspx?p=43230693015006003210651210008545221815897062|2|1|1|F45F565F22E7784B638952FF47C3870F93E7212C';

/**
 * Mock NF data that matches the structure returned by the backend.
 */
export const MOCK_NF_DATA = {
  key: '43230693015006003210651210008545221815897062',
  version: '2',
  env: '1',
  csc: '1',
  hash: 'F45F565F22E7784B638952FF47C3870F93E7212C',
  number: '854522',
  series: '121',
  date: '13/06/2023 20:19:31',
  protocol: '143230954047438',
  store: {
    name: 'COMPANHIA ZAFFARI COMERCIO E INDUSTRIA',
    cnpj: '93.015.006/0032-10',
    incricaoEstadual: '0962638145',
    address: 'AV IPIRANGA, 5200, JARDIM BOTANICO, PORTO ALEGRE, RS'
  },
  items: [
    {
      code: '7896333041307',
      description: 'AG MINERAL TUTTIBLU S/GAS 5L',
      amount: 2,
      unit: 'UN',
      value: 5.49,
      totalValue: 10.98
    },
    {
      code: '7896083800018',
      description: 'AG SANITARIA QBOA 1L',
      amount: 1,
      unit: 'UN',
      value: 4.49,
      totalValue: 4.49
    }
  ]
};
