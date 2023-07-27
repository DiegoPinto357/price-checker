import axios from 'axios';
import storage from '.';
import { Mock } from 'vitest';

vi.mock('axios');

describe('storage', () => {
  describe('web', () => {
    describe('writeFile', () => {
      it('calls endppoint to write a file', async () => {
        const filename = '/stuff/file.json';
        const data = {
          potato: true,
        };

        await storage.writeFile(filename, data);

        expect(axios.post).toBeCalledTimes(1);
        expect(axios.post).toBeCalledWith(
          'http://127.0.0.1:3001/storage/write-file',
          { filename, data }
        );
      });
    });

    describe('readFile', () => {
      it('calls endppoint to read a file', async () => {
        const data = { banana: false };
        (axios.get as Mock).mockResolvedValue({
          data,
        });

        const filename = '/stuff/file.json';

        const fileData = await storage.readFile(filename);

        expect(axios.get).toBeCalledTimes(1);
        expect(axios.get).toBeCalledWith(
          `http://127.0.0.1:3001/storage/read-file/${encodeURIComponent(
            filename
          )}`
        );
        expect(fileData).toEqual(data);
      });
    });
  });
});
