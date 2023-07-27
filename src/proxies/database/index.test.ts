import { Capacitor } from '@capacitor/core';
import axios from 'axios';
import { DatabaseProxy } from '.';
import { Mock } from 'vitest';

vi.mock('@capacitor/core');
vi.mock('axios');

const databaseName = 'products';
const collectionName = 'items';

const serverHost = 'http://127.0.0.1:3001';

let databaseProxy: DatabaseProxy;

describe('database proxy', () => {
  describe('web', () => {
    beforeAll(async () => {
      (Capacitor.getPlatform as Mock).mockReturnValue('web');
      databaseProxy = (await import('.')).default;
    });

    it('calls find server endpoint', async () => {
      const filter = { code: '52472544243' };
      await databaseProxy.find(databaseName, collectionName, filter);

      expect(axios.post).toBeCalledTimes(1);
      expect(axios.post).toBeCalledWith(`${serverHost}/database/find`, {
        databaseName,
        collectionName,
        filter,
      });
    });

    it('calls findOne server endpoint', async () => {
      //FIXME vi.clearAllMocks not working
      (axios.post as Mock).mockClear();

      const filter = { code: '52472544243' };
      await databaseProxy.findOne(databaseName, collectionName, filter);

      expect(axios.post).toBeCalledTimes(1);
      expect(axios.post).toBeCalledWith(`${serverHost}/database/findOne`, {
        databaseName,
        collectionName,
        filter,
      });
    });

    it('calls insertOne server endpoint', async () => {
      //FIXME vi.clearAllMocks not working
      (axios.post as Mock).mockClear();

      const document = { code: '52472544243' };
      await databaseProxy.insertOne(databaseName, collectionName, document);

      expect(axios.post).toBeCalledTimes(1);
      expect(axios.post).toBeCalledWith(`${serverHost}/database/insertOne`, {
        databaseName,
        collectionName,
        document,
      });
    });

    it('calls updateOne server endpoint', async () => {
      //FIXME vi.clearAllMocks not working
      (axios.post as Mock).mockClear();

      const filter = { code: '52472544243', banana: false };
      const update = { banana: true };
      await databaseProxy.updateOne(
        databaseName,
        collectionName,
        filter,
        update
      );

      expect(axios.post).toBeCalledTimes(1);
      expect(axios.post).toBeCalledWith(`${serverHost}/database/updateOne`, {
        databaseName,
        collectionName,
        filter,
        update,
      });
    });
  });
});
