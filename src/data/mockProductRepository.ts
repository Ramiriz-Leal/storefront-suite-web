import type { Product } from "@/domain/entities";
import type { ProductRepository } from "@/domain/repositories";
import { delay, loadFromStorage, saveToStorage } from "@/lib/mockStore";

const STORAGE_KEY = "demo.products";

const seed: Product[] = [
  { id: "prod_1", name: "Wireless Mouse", price: 89.9, stock: 40 },
  { id: "prod_2", name: "Mechanical Keyboard", price: 349.9, stock: 18 },
  { id: "prod_3", name: "USB-C Hub", price: 149.5, stock: 25 },
  { id: "prod_4", name: "27\" Monitor", price: 1299.0, stock: 8 },
  { id: "prod_5", name: "Noise Cancelling Headset", price: 599.0, stock: 12 },
];

export class MockProductRepository implements ProductRepository {
  private products: Product[] = loadFromStorage(STORAGE_KEY, seed);

  private persist(): void {
    saveToStorage(STORAGE_KEY, this.products);
  }

  async list(): Promise<Product[]> {
    return delay([...this.products]);
  }

  async decreaseStock(productId: string, quantity: number): Promise<void> {
    const product = this.products.find((p) => p.id === productId);
    if (!product) throw new Error(`Product ${productId} not found`);
    if (product.stock < quantity) throw new Error(`Insufficient stock for ${product.name}`);
    product.stock -= quantity;
    this.persist();
    return delay(undefined);
  }
}

export const productRepository = new MockProductRepository();
