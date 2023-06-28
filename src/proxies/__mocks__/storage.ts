interface StringIndexed {
  [key: string]: unknown;
}

let files: StringIndexed = {};

const writeFile = vi.fn(async (filename: string, data: unknown) => {
  files[filename] = data;
});

const readFile = vi.fn(async (filename: string): Promise<unknown> => {
  return files[filename];
});

const clearFiles = () => {
  files = {};
};

export default {
  writeFile,
  readFile,

  clearFiles,
};
