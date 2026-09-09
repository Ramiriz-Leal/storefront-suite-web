import type { NewServiceOrder, ServiceOrder, ServiceOrderStatus } from "@/domain/entities";
import type { ServiceOrderRepository } from "@/domain/repositories";
import { delay, loadFromStorage, newId, saveToStorage } from "@/lib/mockStore";

const STORAGE_KEY = "demo.serviceOrders";

const ALLOWED_TRANSITIONS: Record<ServiceOrderStatus, ServiceOrderStatus[]> = {
  open: ["in_progress", "cancelled"],
  in_progress: ["closed", "cancelled"],
  closed: [],
  cancelled: [],
};

export class MockServiceOrderRepository implements ServiceOrderRepository {
  private orders: ServiceOrder[] = loadFromStorage(STORAGE_KEY, [] as ServiceOrder[]);

  private persist(): void {
    saveToStorage(STORAGE_KEY, this.orders);
  }

  async list(): Promise<ServiceOrder[]> {
    return delay(
      [...this.orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    );
  }

  async create(data: NewServiceOrder): Promise<ServiceOrder> {
    const now = new Date().toISOString();
    const order: ServiceOrder = {
      ...data,
      id: newId("os"),
      status: "open",
      history: [{ status: "open", note: "Order opened", at: now }],
      createdAt: now,
      updatedAt: now,
    };
    this.orders.push(order);
    this.persist();
    return delay(order);
  }

  async changeStatus(id: string, status: ServiceOrderStatus, note: string): Promise<ServiceOrder> {
    const order = this.orders.find((o) => o.id === id);
    if (!order) throw new Error(`Service order ${id} not found`);
    const allowed = ALLOWED_TRANSITIONS[order.status];
    if (!allowed.includes(status)) {
      throw new Error(`Cannot move service order from "${order.status}" to "${status}"`);
    }
    order.status = status;
    order.updatedAt = new Date().toISOString();
    order.history.push({ status, note, at: order.updatedAt });
    this.persist();
    return delay(order);
  }
}

export const serviceOrderRepository = new MockServiceOrderRepository();
