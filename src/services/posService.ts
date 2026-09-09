import type { Contact, NewSale, Product, Sale, SaleItem } from "@/domain/entities";
import type { ContactRepository, ProductRepository, SaleRepository } from "@/domain/repositories";

export interface CartLine {
  product: Product;
  quantity: number;
}

export class PosService {
  constructor(
    private readonly sales: SaleRepository,
    private readonly products: ProductRepository,
    private readonly contacts: ContactRepository,
  ) {}

  listProducts(): Promise<Product[]> {
    return this.products.list();
  }

  listContacts(): Promise<Contact[]> {
    return this.contacts.list();
  }

  listSales(): Promise<Sale[]> {
    return this.sales.list();
  }

  async checkout(cart: CartLine[], contact: Contact | null): Promise<Sale> {
    if (cart.length === 0) throw new Error("Cart is empty");

    for (const line of cart) {
      if (line.quantity <= 0) throw new Error(`Invalid quantity for ${line.product.name}`);
      if (line.quantity > line.product.stock) {
        throw new Error(`Not enough stock for ${line.product.name}`);
      }
    }

    const items: SaleItem[] = cart.map((line) => ({
      productId: line.product.id,
      productName: line.product.name,
      quantity: line.quantity,
      unitPrice: line.product.price,
    }));

    const newSale: NewSale = {
      contactId: contact?.id ?? null,
      contactName: contact?.name ?? null,
      items,
    };

    for (const line of cart) {
      await this.products.decreaseStock(line.product.id, line.quantity);
    }

    return this.sales.create(newSale);
  }

  cancelSale(id: string): Promise<Sale> {
    return this.sales.cancel(id);
  }
}
