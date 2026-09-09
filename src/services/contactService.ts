import type { Contact, NewContact } from "@/domain/entities";
import type { ContactRepository } from "@/domain/repositories";

export class ContactService {
  constructor(private readonly repository: ContactRepository) {}

  list(): Promise<Contact[]> {
    return this.repository.list();
  }

  async create(data: NewContact): Promise<Contact> {
    this.validate(data);
    return this.repository.create(data);
  }

  async update(id: string, data: NewContact): Promise<Contact> {
    this.validate(data);
    return this.repository.update(id, data);
  }

  remove(id: string): Promise<void> {
    return this.repository.remove(id);
  }

  private validate(data: NewContact): void {
    if (!data.name.trim()) throw new Error("Name is required");
    if (!data.document.trim()) throw new Error("Document is required");
    if (!/^\S+@\S+\.\S+$/.test(data.email)) throw new Error("Email is invalid");
  }
}
