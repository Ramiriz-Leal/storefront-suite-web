import type { ReactNode } from "react";

interface PageHeaderProps {
  kicker?: string;
  title: ReactNode;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ kicker, title, description, actions }: PageHeaderProps) {
  return (
    <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
      <div>
        {kicker && <p className="app-eyebrow mb-1.5">{kicker}</p>}
        <h1 className="app-display">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
