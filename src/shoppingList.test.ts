import { storage } from './proxies';
import { getShoppintList, setShoppingList } from './shoppingList';

type MockStorage = typeof storage & { clearFiles: () => void };

const mockStorage = storage as MockStorage;

vi.mock('./proxies/storage');

const defaultItems = [
  { name: 'Sululenta' },
  { name: 'Banana', checked: true },
  { name: 'Vinho', checked: true },
  { name: 'Chocolate' },
];

describe('shoppintList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStorage.clearFiles();
  });

  it('gets shopping list from file', async () => {
    await mockStorage.writeFile('shopping-list.json', defaultItems);
    const loadedItems = await getShoppintList();
    expect(loadedItems).toEqual(defaultItems);
  });

  it('keeps shopping list empty if shopping-list.json does not exists', async () => {
    const loadedItems = await getShoppintList();
    expect(loadedItems).toEqual([]);
  });

  it('sets shopping list', async () => {
    const newShoppingList = [
      ...defaultItems,
      { name: 'Queijo' },
      { name: 'Leite', checked: true },
    ];
    await setShoppingList(newShoppingList);
    const newLoadedShoppingList = await getShoppintList();
    expect(newLoadedShoppingList).toEqual(newShoppingList);
  });

  // sync on db
});
