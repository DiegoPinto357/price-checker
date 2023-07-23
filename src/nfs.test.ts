import { storage } from './proxies';
import { saveNf } from './nfs';
import nfData from '../mockData/nf/nfData.json';

vi.mock('./proxies/storage');

describe('nfs', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    const date = new Date(2023, 6, 17, 18, 4, 26, 234);
    vi.setSystemTime(date);
  });

  it('save nf file', async () => {
    await saveNf(nfData);

    expect(storage.writeFile).toBeCalledWith(`/nfs/${nfData.key}.json`, nfData);
    expect(storage.writeFile).toBeCalledWith(
      '/nfs/index.csv',
      '43230693015006003210651210008545221815897062, 1689627866234, a85bcdc4b11f56ebce0eea5fd6a9c6ed\n'
    );
  });

  it('does not add index entry if it already exists', async () => {
    const indefFilname = '/nfs/index.csv';
    const currentIndeFileContent =
      '43230693015006003210651210008545221815897062, 1689627665234, a85bcdc4b11f56ebce0eea5fd6a9c6ed\n';
    await storage.writeFile(indefFilname, currentIndeFileContent);

    await saveNf(nfData);

    const newIndexFileContent = await storage.readFile<string>(indefFilname);
    expect(newIndexFileContent).toBe(currentIndeFileContent);
  });
});
