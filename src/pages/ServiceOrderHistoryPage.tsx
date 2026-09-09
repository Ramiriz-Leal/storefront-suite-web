import { useServiceOrderHistory } from "@/hooks/useServiceOrders";
import { StatusBadge } from "@/components/StatusBadge";
import { PageHeader } from "@/components/PageHeader";

export function ServiceOrderHistoryPage() {
  const { data: orders = [], isLoading } = useServiceOrderHistory();

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        kicker="Field service"
        title={
          <>
            Orders <em>history</em>
          </>
        }
        description="Closed and cancelled service orders."
      />

      <div className="space-y-3">
        {isLoading && <p className="text-sm text-muted-foreground">Loading history...</p>}
        {!isLoading && orders.length === 0 && <p className="text-sm text-muted-foreground">No closed orders yet.</p>}
        {orders.map((order) => (
          <div key={order.id} className="app-card p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">{order.contactName}</p>
                <p className="text-sm text-muted-foreground">{order.description}</p>
              </div>
              <StatusBadge status={order.status} />
            </div>
            <ol className="mt-3 space-y-1 border-l border-border pl-3 text-xs text-muted-foreground">
              {order.history.map((event, index) => (
                <li key={index}>
                  <span className="font-medium text-foreground">{event.status}</span> &middot; {event.note} &middot;{" "}
                  {new Date(event.at).toLocaleString()}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}
