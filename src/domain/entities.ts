export interface Contact {
  id: string;
  name: string;
  document: string;
  email: string;
  phone: string;
  createdAt: string;
}

export type NewContact = Omit<Contact, "id" | "createdAt">;

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export type SaleStatus = "completed" | "cancelled";

export interface Sale {
  id: string;
  contactId: string | null;
  contactName: string | null;
  items: SaleItem[];
  total: number;
  status: SaleStatus;
  createdAt: string;
}

export type NewSale = Omit<Sale, "id" | "total" | "status" | "createdAt">;

export type ServiceOrderStatus = "open" | "in_progress" | "closed" | "cancelled";

export interface ServiceOrderEvent {
  status: ServiceOrderStatus;
  note: string;
  at: string;
}

export interface ServiceOrder {
  id: string;
  contactId: string;
  contactName: string;
  description: string;
  status: ServiceOrderStatus;
  history: ServiceOrderEvent[];
  createdAt: string;
  updatedAt: string;
}

export type NewServiceOrder = Pick<ServiceOrder, "contactId" | "contactName" | "description">;
