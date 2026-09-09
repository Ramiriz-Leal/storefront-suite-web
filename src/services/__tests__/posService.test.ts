import { describe, expect, it } from "vitest";
import type { Contact, NewContact, NewSale, Product, Sale } from "@/domain/entities";
import type { ContactRepository, ProductRepository, SaleRepository } from "@/domain/repositories";
import { PosService } from "@/services/posService";

class FakeProductRepository implements ProductRepository {
  constructor(public products: Product[]) {}

  async list(): Promise<Product[]> {
    return this.products;
  }

  async decreaseStock(productId: string, quantity: number): Promise<void> {
    const product = this.products.find((p) => p.id === productId);
    if (!product) throw new Error("not found");
    if (product.stock < quantity) throw new Error("Insufficient stock for " + product.name);
    product.stock -= quantity;
  }
}

class FakeSaleRepository implements SaleRepository {
  sales: Sale[] = [];

  async list(): Promise<Sale[]> {
    return this.sales;
  }

  async create(data: NewSale): Promise<Sale> {
    const total = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const sale: Sale = { ...data, id: `sale_${this.sales.length + 1}`, total, status: "completed", createdAt: new Date().toISOString() };
    this.sales.push(sale);
    return sale;
  }

  async cancel(id: string): Promise<Sale> {
    const sale = this.sales.find((s) => s.id === id)!;
    sale.status = "cancelled";
    return sale;
  }
}

class FakeContactRepository implements ContactRepository {
  async list(): Promise<Contact[]> {
    return [];
  }
  async getById(): Promise<Contact | null> {
    return null;
  }
  async create(data: NewContact): Promise<Contact> {
    return { ...data, id: "c1", createdAt: new Date().toISOString() };
  }
  async update(id: string, data: NewContact): Promise<Contact> {
    return { ...data, id, createdAt: new Date().toISOString() };
  }
  async remove(): Promise<void> {}
}

const product: Product = { id: "p1", name: "Widget", price: 10, stock: 5 };

describe("PosService.checkout", () => {
  it("creates a sale and decreases stock", async () => {
    const products = new FakeProductRepository([{ ...product }]);
    const sales = new FakeSaleRepository();
    const service = new PosService(sales, products, new FakeContactRepository());

    const sale = await service.checkout([{ product: products.products[0], quantity: 2 }], null);

    expect(sale.total).toBe(20);
    expect(products.products[0].stock).toBe(3);
  });

  it("rejects checkout when quantity exceeds stock", async () => {
    const products = new FakeProductRepository([{ ...product, stock: 1 }]);
    const service = new PosService(new FakeSaleRepository(), products, new FakeContactRepository());

    await expect(
      service.checkout([{ product: products.products[0], quantity: 2 }], null),
    ).rejects.toThrow("Not enough stock");
  });

  it("rejects checkout with an empty cart", async () => {
    const service = new PosService(new FakeSaleRepository(), new FakeProductRepository([]), new FakeContactRepository());

    await expect(service.checkout([], null)).rejects.toThrow("Cart is empty");
  });
});
