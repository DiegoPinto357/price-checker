import md5 from 'md5';

interface GetIndexEntryOptions {
  timestamp?: number;
  hash?: string;
}

export default <Data>(data: Data, options?: GetIndexEntryOptions) => {
  const timestamp = options?.timestamp ? options.timestamp : Date.now();
  const hash = options?.hash ? options?.hash : md5(JSON.stringify(data));
  return { timestamp, hash };
};
