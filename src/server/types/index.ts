export type NfItem = {
  code: string;
  description: string;
  amount: number;
  unit: string;
  value: number;
  totalValue: number;
};

export type Store = {
  name: string;
  cnpj: string;
  incricaoEstadual: string;
  address: string;
};

export type NfData = {
  key: string;
  version: string;
  env: string;
  csc: string;
  hash: string;
  number: string;
  series: string;
  date: string;
  protocol: string;
  store: Store;
  items: NfItem[];
};
