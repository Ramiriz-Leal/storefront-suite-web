import { useCancelSale, useSales } from "@/hooks/usePos";
import { StatusBadge } from "@/components/StatusBadge";
import { PageHeader } from "@/components/PageHeader";

function formatCurrency(value: number): string {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function PosHistoryPage() {
  const { data: sales = [], isLoading } = useSales();
  const cancelSale = useCancelSale();

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        kicker="Point of sale"
        title={
          <>
            Sales <em>history</em>
          </>
        }
        description="All sales recorded by the point of sale."
      />

      <div className="space-y-3">
        {isLoading && <p className="text-sm text-muted-foreground">Loading sales...</p>}
        {!isLoading && sales.length === 0 && <p className="text-sm text-muted-foreground">No sales yet.</p>}
        {sales.map((sale) => (
          <div key={sale.id} className="app-card p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">{sale.contactName ?? "Walk-in customer"}</p>
                <p className="text-xs text-muted-foreground">{new Date(sale.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={sale.status} />
                <span className="font-semibold">{formatCurrency(sale.total)}</span>
              </div>
            </div>
            <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
              {sale.items.map((item) => (
                <li key={item.productId} className="flex justify-between">
                  <span>
                    {item.quantity} x {item.productName}
                  </span>
                  <span>{formatCurrency(item.quantity * item.unitPrice)}</span>
                </li>
              ))}
            </ul>
            {sale.status === "completed" && (
              <button
                onClick={() => cancelSale.mutate(sale.id)}
                className="mt-3 text-sm font-medium text-destructive hover:underline"
              >
                Cancel sale
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
