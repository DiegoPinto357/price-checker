import { Capacitor } from '@capacitor/core';
import { NodeJS } from 'capacitor-nodejs';
import axios from 'axios';
import { Mock } from 'vitest';
import { Find, FindOne, Insert, InsertOne, UpdateOne } from './types';

vi.mock('@capacitor/core');
vi.mock('capacitor-nodejs');
vi.mock('axios');

const uuid = '1b355435-1914-4e06-bbfc-4ebe291656bb';
vi.mock('uuid', () => ({ v4: () => uuid }));

type MockNodeJS = typeof NodeJS & {
  triggerReply: (channelName: string, data?: unknown) => void;
};

const databaseName = 'products';
const collectionName = 'items';

const serverHost = 'http://127.0.0.1:3002';

interface DatabaseProxy {
  find: Find;
  findOne: FindOne;
  insert: Insert;
  insertOne: InsertOne;
  updateOne: UpdateOne;
}

let databaseProxy: DatabaseProxy;

const importProxyWithoutCache = async () => {
  const timestamp = Date.now();
  const path = `.?${timestamp}`;
  return (await import(path)).default;
};

const setupIpcReply = (channelName: string, data?: unknown) => {
  return setTimeout(
    () =>
      (NodeJS as MockNodeJS).triggerReply(`${channelName}-reply-${uuid}`, data),
    1
  );
};

describe('database proxy', () => {
  describe('web', () => {
    beforeAll(async () => {
      (Capacitor.getPlatform as Mock).mockReturnValue('web');
      databaseProxy = await importProxyWithoutCache();
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

    it('calls insert server endpoint', async () => {
      //FIXME vi.clearAllMocks not working
      (axios.post as Mock).mockClear();

      const documents = [
        { code: '52472544243' },
        { code: '52467542623' },
        { code: '12467542582' },
      ];
      await databaseProxy.insert(databaseName, collectionName, documents);

      expect(axios.post).toBeCalledTimes(1);
      expect(axios.post).toBeCalledWith(`${serverHost}/database/insert`, {
        databaseName,
        collectionName,
        documents,
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
      const update = { $set: { banana: true } };
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

  describe('mobile', () => {
    let replyTimer: NodeJS.Timeout;

    beforeAll(async () => {
      (Capacitor.getPlatform as Mock).mockReturnValue('android');
      databaseProxy = await importProxyWithoutCache();
    });

    beforeEach(() => {
      clearTimeout(replyTimer);
      vi.clearAllMocks();
    });

    it('sends find IPC event', async () => {
      const resultData = [{ data: 'test' }];
      const channelName = 'post:database/find';
      replyTimer = setupIpcReply(channelName, resultData);

      const filter = { code: '52472544243' };
      const result = await databaseProxy.find(
        databaseName,
        collectionName,
        filter
      );

      expect(NodeJS.send).toBeCalledTimes(1);
      expect(NodeJS.send).toBeCalledWith({
        eventName: channelName,
        args: [uuid, { collectionName, databaseName, filter }],
      });
      expect(result).toEqual(resultData);
    });

    it('sends findOne IPC event', async () => {
      const resultData = { data: 'test' };
      const channelName = 'post:database/findOne';
      replyTimer = setupIpcReply(channelName, resultData);

      const filter = { code: '52472544243' };
      const result = await databaseProxy.findOne(
        databaseName,
        collectionName,
        filter
      );

      expect(NodeJS.send).toBeCalledTimes(1);
      expect(NodeJS.send).toBeCalledWith({
        eventName: channelName,
        args: [uuid, { collectionName, databaseName, filter }],
      });
      expect(result).toEqual(resultData);
    });

    it('sends insert IPC event', async () => {
      const channelName = 'post:database/insert';
      replyTimer = setupIpcReply(channelName);

      const documents = [
        { code: '52472544243' },
        { code: '52467542623' },
        { code: '12467542582' },
      ];
      await databaseProxy.insert(databaseName, collectionName, documents);

      expect(NodeJS.send).toBeCalledTimes(1);
      expect(NodeJS.send).toBeCalledWith({
        eventName: channelName,
        args: [uuid, { collectionName, databaseName, documents }],
      });
    });

    it('sends insertOne IPC event', async () => {
      const channelName = 'post:database/insertOne';
      replyTimer = setupIpcReply(channelName);

      const document = { code: '52472544243' };
      await databaseProxy.insertOne(databaseName, collectionName, document);

      expect(NodeJS.send).toBeCalledTimes(1);
      expect(NodeJS.send).toBeCalledWith({
        eventName: channelName,
        args: [uuid, { collectionName, databaseName, document }],
      });
    });

    it('sends updateOne IPC event', async () => {
      const channelName = 'post:database/updateOne';
      replyTimer = setupIpcReply(channelName);

      const filter = { code: '52472544243', banana: false };
      const update = { $set: { banana: true } };
      const options = { upsert: true };
      await databaseProxy.updateOne(
        databaseName,
        collectionName,
        filter,
        update,
        options
      );

      expect(NodeJS.send).toBeCalledTimes(1);
      expect(NodeJS.send).toBeCalledWith({
        eventName: channelName,
        args: [uuid, { collectionName, databaseName, filter, update, options }],
      });
    });
  });
});
