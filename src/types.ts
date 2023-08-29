interface Store {
  name: string;
  cnpj: string;
  incricaoEstadual: string;
  address: string;
}

export interface Nf {
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
}

export interface Product {
  code: string;
  description: string;
  amount: number;
  unit: string;
  value: number;
  totalValue: number;
}

export interface ProductHistoryItem {
  nfKey: string;
  date: string;
  amount: number;
  unit: string;
  value: number;
  totalValue: number;
}

export interface ProductHistory {
  code: string;
  description: string;
  history: ProductHistoryItem[];
}

export interface ProductHistoryWithIndex extends ProductHistory {
  timestamp: number;
  hash: string;
}
