import storage from '.';

describe('storage', () => {
  describe('web', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    describe('writeFile', () => {
      it('writes a JSON file to localStorage', async () => {
        const filename = '/stuff/file.json';
        const data = {
          potato: true,
        };

        await storage.writeFile(filename, data);

        const storedData = localStorage.getItem(filename);
        expect(storedData).toBeDefined();
        expect(JSON.parse(storedData!)).toEqual(data);
      });

      it('writes a string file to localStorage', async () => {
        const filename = '/stuff/file.csv';
        const data = 'id,timestamp,hash\n1,123,abc';

        await storage.writeFile(filename, data);

        const storedData = localStorage.getItem(filename);
        expect(storedData).toBe(data);
      });
    });

    describe('readFile', () => {
      it('reads a JSON file from localStorage', async () => {
        const data = { banana: false };
        const filename = '/stuff/file.json';
        localStorage.setItem(filename, JSON.stringify(data));

        const fileData = await storage.readFile(filename);

        expect(fileData).toEqual(data);
      });

      it('reads a string file from localStorage', async () => {
        const data = 'id,timestamp,hash\n1,123,abc';
        const filename = '/stuff/file.csv';
        localStorage.setItem(filename, data);

        const fileData = await storage.readFile(filename);

        expect(fileData).toBe(data);
      });

      it('returns undefined for non-existent file', async () => {
        const filename = '/stuff/nonexistent.json';

        const fileData = await storage.readFile(filename);

        expect(fileData).toBeUndefined();
      });
    });
  });
});
