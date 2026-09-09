import { describe, expect, it } from "vitest";
import type { Contact, NewContact } from "@/domain/entities";
import type { ContactRepository } from "@/domain/repositories";
import { ContactService } from "@/services/contactService";

class FakeContactRepository implements ContactRepository {
  contacts: Contact[] = [];

  async list(): Promise<Contact[]> {
    return this.contacts;
  }

  async getById(id: string): Promise<Contact | null> {
    return this.contacts.find((c) => c.id === id) ?? null;
  }

  async create(data: NewContact): Promise<Contact> {
    const contact: Contact = { ...data, id: `id_${this.contacts.length + 1}`, createdAt: new Date().toISOString() };
    this.contacts.push(contact);
    return contact;
  }

  async update(id: string, data: NewContact): Promise<Contact> {
    const index = this.contacts.findIndex((c) => c.id === id);
    this.contacts[index] = { ...this.contacts[index], ...data };
    return this.contacts[index];
  }

  async remove(id: string): Promise<void> {
    this.contacts = this.contacts.filter((c) => c.id !== id);
  }
}

const validContact: NewContact = {
  name: "Jordan Lee",
  document: "111.222.333-44",
  email: "jordan.lee@example.com",
  phone: "(11) 90000-0000",
};

describe("ContactService", () => {
  it("creates a contact when data is valid", async () => {
    const repository = new FakeContactRepository();
    const service = new ContactService(repository);

    const created = await service.create(validContact);

    expect(created.name).toBe("Jordan Lee");
    expect(repository.contacts).toHaveLength(1);
  });

  it("rejects a contact with an invalid email", async () => {
    const service = new ContactService(new FakeContactRepository());

    await expect(service.create({ ...validContact, email: "not-an-email" })).rejects.toThrow("Email is invalid");
  });

  it("rejects a contact with an empty name", async () => {
    const service = new ContactService(new FakeContactRepository());

    await expect(service.create({ ...validContact, name: "  " })).rejects.toThrow("Name is required");
  });
});
