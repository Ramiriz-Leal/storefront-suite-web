import type { NewSale, Sale } from "@/domain/entities";
import type { SaleRepository } from "@/domain/repositories";
import { delay, loadFromStorage, newId, saveToStorage } from "@/lib/mockStore";

const STORAGE_KEY = "demo.sales";

export class MockSaleRepository implements SaleRepository {
  private sales: Sale[] = loadFromStorage(STORAGE_KEY, [] as Sale[]);

  private persist(): void {
    saveToStorage(STORAGE_KEY, this.sales);
  }

  async list(): Promise<Sale[]> {
    return delay(
      [...this.sales].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    );
  }

  async create(data: NewSale): Promise<Sale> {
    const total = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const sale: Sale = {
      ...data,
      id: newId("sale"),
      total,
      status: "completed",
      createdAt: new Date().toISOString(),
    };
    this.sales.push(sale);
    this.persist();
    return delay(sale);
  }

  async cancel(id: string): Promise<Sale> {
    const sale = this.sales.find((s) => s.id === id);
    if (!sale) throw new Error(`Sale ${id} not found`);
    sale.status = "cancelled";
    this.persist();
    return delay(sale);
  }
}

export const saleRepository = new MockSaleRepository();
