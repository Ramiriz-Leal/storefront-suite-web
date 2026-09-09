import type { Contact, NewContact } from "@/domain/entities";
import type { ContactRepository } from "@/domain/repositories";
import { delay, loadFromStorage, newId, saveToStorage } from "@/lib/mockStore";

const STORAGE_KEY = "demo.contacts";

const seed: Contact[] = [
  {
    id: "contact_seed1",
    name: "Alex Morgan",
    document: "123.456.789-00",
    email: "alex.morgan@example.com",
    phone: "(11) 91234-5678",
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
  },
  {
    id: "contact_seed2",
    name: "Priya Nair",
    document: "987.654.321-00",
    email: "priya.nair@example.com",
    phone: "(21) 99876-5432",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

export class MockContactRepository implements ContactRepository {
  private contacts: Contact[] = loadFromStorage(STORAGE_KEY, seed);

  private persist(): void {
    saveToStorage(STORAGE_KEY, this.contacts);
  }

  async list(): Promise<Contact[]> {
    return delay([...this.contacts].sort((a, b) => a.name.localeCompare(b.name)));
  }

  async getById(id: string): Promise<Contact | null> {
    return delay(this.contacts.find((c) => c.id === id) ?? null);
  }

  async create(data: NewContact): Promise<Contact> {
    const contact: Contact = { ...data, id: newId("contact"), createdAt: new Date().toISOString() };
    this.contacts.push(contact);
    this.persist();
    return delay(contact);
  }

  async update(id: string, data: NewContact): Promise<Contact> {
    const index = this.contacts.findIndex((c) => c.id === id);
    if (index === -1) throw new Error(`Contact ${id} not found`);
    const updated: Contact = { ...this.contacts[index], ...data };
    this.contacts[index] = updated;
    this.persist();
    return delay(updated);
  }

  async remove(id: string): Promise<void> {
    this.contacts = this.contacts.filter((c) => c.id !== id);
    this.persist();
    return delay(undefined);
  }
}

export const contactRepository = new MockContactRepository();
