import { FormEvent, useState } from "react";
import { Plus } from "lucide-react";
import type { Contact, NewContact } from "@/domain/entities";
import { useContacts, useCreateContact, useDeleteContact, useUpdateContact } from "@/hooks/useContacts";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type DataTableColumn } from "@/components/DataTable";
import { Modal } from "@/components/Modal";
import { ConfirmDialog } from "@/components/ConfirmDialog";

const EMPTY_FORM: NewContact = { name: "", document: "", email: "", phone: "" };

export function ContactsPage() {
  const { data: contacts = [], isLoading } = useContacts();
  const createContact = useCreateContact();
  const updateContact = useUpdateContact();
  const deleteContact = useDeleteContact();

  const [form, setForm] = useState<NewContact>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Contact | null>(null);

  function openCreateForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError(null);
    setFormOpen(true);
  }

  function openEditForm(contact: Contact) {
    setEditingId(contact.id);
    setForm({ name: contact.name, document: contact.document, email: contact.email, phone: contact.phone });
    setError(null);
    setFormOpen(true);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      if (editingId) {
        await updateContact.mutateAsync({ id: editingId, data: form });
      } else {
        await createContact.mutateAsync(form);
      }
      setFormOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    await deleteContact.mutateAsync(pendingDelete.id);
    setPendingDelete(null);
  }

  const columns: DataTableColumn<Contact>[] = [
    { header: "Name", render: (c) => <span className="font-medium">{c.name}</span> },
    { header: "Document", render: (c) => <span className="font-mono text-xs text-muted-foreground">{c.document}</span> },
    { header: "Email", render: (c) => c.email },
    { header: "Phone", render: (c) => c.phone },
  ];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        kicker="Customers & suppliers"
        title={
          <>
            Manage your <em>contacts</em>
          </>
        }
        description="Register and keep track of everyone you do business with."
        actions={
          <button onClick={openCreateForm} className="app-btn-primary">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New contact</span>
          </button>
        }
      />

      <DataTable
        columns={columns}
        rows={contacts}
        rowKey={(c) => c.id}
        loading={isLoading}
        emptyMessage="No contacts yet. Create the first one."
        actions={(contact) => (
          <div className="flex justify-end gap-3 opacity-0 transition-opacity group-hover:opacity-100">
            <button className="text-xs font-medium text-primary hover:underline" onClick={() => openEditForm(contact)}>
              Edit
            </button>
            <button className="text-xs font-medium text-destructive hover:underline" onClick={() => setPendingDelete(contact)}>
              Delete
            </button>
          </div>
        )}
      />

      <Modal open={formOpen} title={editingId ? "Edit contact" : "New contact"} onClose={() => setFormOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="app-label">Name</label>
            <input
              className="app-input mt-1"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="app-label">Document</label>
            <input
              className="app-input mt-1"
              value={form.document}
              onChange={(e) => setForm({ ...form, document: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="app-label">Email</label>
            <input
              type="email"
              className="app-input mt-1"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="app-label">Phone</label>
            <input
              className="app-input mt-1"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setFormOpen(false)} className="app-btn-secondary">
              Cancel
            </button>
            <button type="submit" className="app-btn-primary">
              {editingId ? "Save changes" : "Add contact"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete contact"
        description={
          <>
            Delete <strong className="font-semibold text-foreground underline">{pendingDelete?.name}</strong>? This
            cannot be undone.
          </>
        }
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
