import { useEffect, useState } from 'react';
import { CheckboxGroup, Checkbox } from '@nextui-org/react';
import Typography from '../lib/Typography';
import PriceChart from './PriceChart';
import { getProductsListFromLocal } from '../../products';
import { ProductHistory } from '../../types';

const mapData = (label: string, data: { date: string; value: number }[]) => ({
  label,
  serie: data.map(({ date, value }) => ({
    date,
    value,
  })),
});

const Products = () => {
  // TODO use react-query
  const [products, setProducts] = useState<ProductHistory[]>([]);
  const [selectedProductsIds, setSelectedProductsIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setProducts(await getProductsListFromLocal());
    };
    fetchProducts();
  }, []);

  // const product = products[32];
  const selectedProducts = products
    .filter(({ code }) => selectedProductsIds.includes(code))
    .map(({ description, history }) => mapData(description, history));

  console.log(selectedProducts);

  return (
    <div>
      <Typography className="mx-4" variant="h1">
        Produtos
      </Typography>

      <div className="flex gap-4 mx-4">
        <div className="max-w-xs overflow-y-scroll max-h-[90vh]">
          <CheckboxGroup
            label="Produtos"
            onValueChange={setSelectedProductsIds}
          >
            {products.map(({ code, description }) => (
              <Checkbox key={code} value={code} disableAnimation>
                {description}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </div>
        {selectedProducts.length > 0 ? (
          <div className="grow">
            Preços
            <PriceChart data={selectedProducts} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Products;
