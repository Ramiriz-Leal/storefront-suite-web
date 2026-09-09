import { FormEvent, useState } from "react";
import { useContacts } from "@/hooks/useContacts";
import {
  useCloseServiceOrder,
  useCreateServiceOrder,
  useOpenServiceOrders,
  useStartServiceOrder,
} from "@/hooks/useServiceOrders";
import { StatusBadge } from "@/components/StatusBadge";
import { PageHeader } from "@/components/PageHeader";

export function ServiceOrdersPage() {
  const { data: orders = [], isLoading } = useOpenServiceOrders();
  const { data: contacts = [] } = useContacts();
  const createOrder = useCreateServiceOrder();
  const startOrder = useStartServiceOrder();
  const closeOrder = useCloseServiceOrder();

  const [contactId, setContactId] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [closingNotes, setClosingNotes] = useState<Record<string, string>>({});

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    const contact = contacts.find((c) => c.id === contactId);
    if (!contact) {
      setError("Select a customer");
      return;
    }
    try {
      await createOrder.mutateAsync({ contactId: contact.id, contactName: contact.name, description });
      setContactId("");
      setDescription("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create order");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        kicker="Field service"
        title={
          <>
            Service <em>orders</em>
          </>
        }
        description="Open and track ongoing service orders."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="app-card space-y-3 p-4">
            <div>
              <label className="app-label">Customer</label>
              <select
                className="app-input mt-1"
                value={contactId}
                onChange={(e) => setContactId(e.target.value)}
              >
                <option value="">Select a customer</option>
                {contacts.map((contact) => (
                  <option key={contact.id} value={contact.id}>
                    {contact.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="app-label">Description</label>
              <textarea
                className="app-input mt-1 h-20 py-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button type="submit" className="app-btn-primary">
              Open order
            </button>
          </form>
        </div>

        <div className="space-y-3 lg:col-span-2">
          {isLoading && <p className="text-sm text-muted-foreground">Loading orders...</p>}
          {!isLoading && orders.length === 0 && <p className="text-sm text-muted-foreground">No open orders.</p>}
          {orders.map((order) => (
            <div key={order.id} className="app-card p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{order.contactName}</p>
                  <p className="text-sm text-muted-foreground">{order.description}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {order.status === "open" && (
                  <button onClick={() => startOrder.mutate(order.id)} className="app-btn-secondary">
                    Start work
                  </button>
                )}
                {order.status === "in_progress" && (
                  <>
                    <input
                      placeholder="Closing note"
                      value={closingNotes[order.id] ?? ""}
                      onChange={(e) => setClosingNotes({ ...closingNotes, [order.id]: e.target.value })}
                      className="app-input h-9 min-w-[150px] flex-1"
                    />
                    <button
                      onClick={() => closeOrder.mutate({ id: order.id, note: closingNotes[order.id] ?? "" })}
                      className="app-btn-primary"
                    >
                      Close order
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
