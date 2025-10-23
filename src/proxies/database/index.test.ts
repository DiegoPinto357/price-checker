import axios from 'axios';
import { Mock } from 'vitest';
import { SERVER_HOST } from '../../config';
import { Find, FindOne, Insert, InsertOne, UpdateOne } from './types';

vi.mock('axios');

const databaseName = 'products';
const collectionName = 'items';

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

describe('database proxy', () => {
  beforeAll(async () => {
    databaseProxy = await importProxyWithoutCache();
  });

  it('calls find server endpoint', async () => {
    const filter = { code: '52472544243' };
    await databaseProxy.find(databaseName, collectionName, filter);

    expect(axios.post).toBeCalledTimes(1);
    expect(axios.post).toBeCalledWith(`${SERVER_HOST}/database/find`, {
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
    expect(axios.post).toBeCalledWith(`${SERVER_HOST}/database/findOne`, {
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
    expect(axios.post).toBeCalledWith(`${SERVER_HOST}/database/insert`, {
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
    expect(axios.post).toBeCalledWith(`${SERVER_HOST}/database/insertOne`, {
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
    expect(axios.post).toBeCalledWith(`${SERVER_HOST}/database/updateOne`, {
      databaseName,
      collectionName,
      filter,
      update,
    });
  });
});
