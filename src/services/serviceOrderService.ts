import type { NewServiceOrder, ServiceOrder, ServiceOrderStatus } from "@/domain/entities";
import type { ServiceOrderRepository } from "@/domain/repositories";

export class ServiceOrderService {
  constructor(private readonly repository: ServiceOrderRepository) {}

  list(): Promise<ServiceOrder[]> {
    return this.repository.list();
  }

  open(): Promise<ServiceOrder[]> {
    return this.list().then((orders) => orders.filter((o) => o.status === "open" || o.status === "in_progress"));
  }

  history(): Promise<ServiceOrder[]> {
    return this.list().then((orders) => orders.filter((o) => o.status === "closed" || o.status === "cancelled"));
  }

  async create(data: NewServiceOrder): Promise<ServiceOrder> {
    if (!data.description.trim()) throw new Error("Description is required");
    return this.repository.create(data);
  }

  start(id: string): Promise<ServiceOrder> {
    return this.repository.changeStatus(id, "in_progress", "Work started");
  }

  close(id: string, note: string): Promise<ServiceOrder> {
    return this.repository.changeStatus(id, "closed", note || "Order closed");
  }

  cancel(id: string, note: string): Promise<ServiceOrder> {
    return this.repository.changeStatus(id, "cancelled", note || "Order cancelled");
  }

  changeStatus(id: string, status: ServiceOrderStatus, note: string): Promise<ServiceOrder> {
    return this.repository.changeStatus(id, status, note);
  }
}
