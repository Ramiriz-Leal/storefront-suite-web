import type {
  Contact,
  NewContact,
  NewSale,
  NewServiceOrder,
  Product,
  Sale,
  ServiceOrder,
  ServiceOrderStatus,
} from "./entities";

export interface ContactRepository {
  list(): Promise<Contact[]>;
  getById(id: string): Promise<Contact | null>;
  create(data: NewContact): Promise<Contact>;
  update(id: string, data: NewContact): Promise<Contact>;
  remove(id: string): Promise<void>;
}

export interface ProductRepository {
  list(): Promise<Product[]>;
  decreaseStock(productId: string, quantity: number): Promise<void>;
}

export interface SaleRepository {
  list(): Promise<Sale[]>;
  create(data: NewSale): Promise<Sale>;
  cancel(id: string): Promise<Sale>;
}

export interface ServiceOrderRepository {
  list(): Promise<ServiceOrder[]>;
  create(data: NewServiceOrder): Promise<ServiceOrder>;
  changeStatus(id: string, status: ServiceOrderStatus, note: string): Promise<ServiceOrder>;
}
