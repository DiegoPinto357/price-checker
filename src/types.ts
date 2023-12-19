export type WithId<T> = { _id: string } & T;

export type WithIndex<T> = {
  index: {
    timestamp: number;
    hash: string;
  };
} & T;

type Store = {
  name: string;
  cnpj: string;
  incricaoEstadual: string;
  address: string;
};

export type Nf = {
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
  items: Product[];
};

export type Product = {
  code: string;
  description: string;
  amount: number;
  unit: string;
  value: number;
  totalValue: number;
};

export type ProductHistoryItem = {
  nfKey: string;
  date: string;
  amount: number;
  unit: string;
  value: number;
  totalValue: number;
};

export type ProductHistory = {
  code: string;
  description: string;
  history: ProductHistoryItem[];
};

export type ShoppingListItem = {
  name: string;
  checked?: boolean;
};
