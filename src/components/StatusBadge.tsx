const STYLES: Record<string, string> = {
  open: "bg-accent text-accent-foreground",
  in_progress: "bg-warning/15 text-warning",
  closed: "bg-success/10 text-success",
  cancelled: "bg-destructive/10 text-destructive",
  completed: "bg-success/10 text-success",
};

const LABELS: Record<string, string> = {
  open: "Open",
  in_progress: "In progress",
  closed: "Closed",
  cancelled: "Cancelled",
  completed: "Completed",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`rounded px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wide ${STYLES[status] ?? "bg-muted text-muted-foreground"}`}>
      {LABELS[status] ?? status}
    </span>
  );
}
