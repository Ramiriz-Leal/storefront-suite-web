import { useState } from "react";
import type { Contact } from "@/domain/entities";
import { useContacts } from "@/hooks/useContacts";
import { useCheckout, useProducts } from "@/hooks/usePos";
import type { CartLine } from "@/services/posService";
import { PageHeader } from "@/components/PageHeader";

function formatCurrency(value: number): string {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function PosPage() {
  const { data: products = [], isLoading: loadingProducts } = useProducts();
  const { data: contacts = [] } = useContacts();
  const checkout = useCheckout();

  const [cart, setCart] = useState<CartLine[]>([]);
  const [contactId, setContactId] = useState<string>("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const selectedContact: Contact | null = contacts.find((c) => c.id === contactId) ?? null;
  const total = cart.reduce((sum, line) => sum + line.quantity * line.product.price, 0);

  function addToCart(productId: string) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    setCart((prev) => {
      const existing = prev.find((line) => line.product.id === productId);
      if (existing) {
        return prev.map((line) =>
          line.product.id === productId ? { ...line, quantity: line.quantity + 1 } : line,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }

  function updateQuantity(productId: string, quantity: number) {
    setCart((prev) =>
      prev
        .map((line) => (line.product.id === productId ? { ...line, quantity } : line))
        .filter((line) => line.quantity > 0),
    );
  }

  async function handleCheckout() {
    setFeedback(null);
    try {
      await checkout.mutateAsync({ cart, contact: selectedContact });
      setCart([]);
      setContactId("");
      setFeedback({ type: "success", message: "Sale completed successfully." });
    } catch (err) {
      setFeedback({ type: "error", message: err instanceof Error ? err.message : "Checkout failed" });
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        kicker="Register a sale"
        title={
          <>
            Point of <em>sale</em>
          </>
        }
        description="Pick products to build the current sale."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {loadingProducts && <p className="col-span-full text-sm text-muted-foreground">Loading products...</p>}
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product.id)}
                disabled={product.stock === 0}
                className="app-card app-card-hover p-4 text-left disabled:cursor-not-allowed disabled:opacity-50"
              >
                <p className="font-medium">{product.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{formatCurrency(product.price)}</p>
                <p className="mt-1 text-xs text-muted-foreground">{product.stock} in stock</p>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="app-card p-4">
            <h2 className="font-semibold">Current sale</h2>

            <label className="app-label mt-4 block">Customer (optional)</label>
            <select
              className="app-input mt-1"
              value={contactId}
              onChange={(e) => setContactId(e.target.value)}
            >
              <option value="">Walk-in customer</option>
              {contacts.map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.name}
                </option>
              ))}
            </select>

            <div className="mt-4 space-y-2">
              {cart.length === 0 && <p className="text-sm text-muted-foreground">Cart is empty.</p>}
              {cart.map((line) => (
                <div key={line.product.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">{line.product.name}</p>
                    <p className="text-muted-foreground">{formatCurrency(line.product.price)} each</p>
                  </div>
                  <input
                    type="number"
                    min={0}
                    max={line.product.stock}
                    value={line.quantity}
                    onChange={(e) => updateQuantity(line.product.id, Number(e.target.value))}
                    className="app-input w-16 text-right"
                  />
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="font-medium">Total</span>
              <span className="text-lg font-semibold">{formatCurrency(total)}</span>
            </div>

            {feedback && (
              <p className={`mt-3 text-sm ${feedback.type === "success" ? "text-success" : "text-destructive"}`}>
                {feedback.message}
              </p>
            )}

            <button
              onClick={handleCheckout}
              disabled={cart.length === 0 || checkout.isPending}
              className="app-btn-primary mt-4 w-full"
            >
              {checkout.isPending ? "Processing..." : "Complete sale"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
