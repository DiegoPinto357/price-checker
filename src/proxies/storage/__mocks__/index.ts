let files: Record<string, string> = {};

const writeFile = vi.fn(async (filename: string, data: unknown) => {
  files[filename] = JSON.stringify(data);
});

const readFile = vi.fn(async (filename: string): Promise<unknown> => {
  const file = files[filename];
  return file ? JSON.parse(files[filename]) : undefined;
});

const clearFiles = () => {
  files = {};
};

export default {
  writeFile,
  readFile,

  clearFiles,
};
