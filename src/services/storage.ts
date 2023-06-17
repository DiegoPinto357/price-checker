import axios from 'axios';
import { Product } from '../types';

const saveProducts = async (products: Product[]) => {
  for (const product of products) {
    const filename = `/products/${product.code}.json`;
    await axios.post('http://127.0.0.1:3001/storage/write-file', {
      filename,
      data: product,
    });
  }
};

export default {
  saveProducts,
};
