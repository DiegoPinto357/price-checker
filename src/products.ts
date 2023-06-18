import { storage } from './proxies';
import { Nf, Product, ProductHistory } from './types';

export const saveProducts = async (products: Product[], nfData: Nf) => {
  for (const product of products) {
    const filename = `/products/${product.code}.json`;

    const productHistory: ProductHistory = {
      code: product.code,
      description: product.description,
      history: [
        {
          nfKey: nfData.key,
          date: nfData.date,
          amount: product.amount,
          unit: product.unit,
          value: product.value,
          totalValue: product.totalValue,
        },
      ],
    };

    await storage.writeFile<ProductHistory>(filename, productHistory);
  }
};
