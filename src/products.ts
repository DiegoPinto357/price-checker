import { storage } from './proxies';
import { Product } from './types';

export const saveProducts = async (products: Product[], nfKey: string) => {
  for (const product of products) {
    const filename = `/products/${product.code}.json`;
    await storage.writeFile(filename, { ...product, nfKey });
  }
};
