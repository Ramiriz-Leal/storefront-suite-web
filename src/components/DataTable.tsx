import type { ReactNode } from "react";

export interface DataTableColumn<T> {
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  actions?: (row: T) => ReactNode;
  emptyMessage?: string;
  loading?: boolean;
}

export function DataTable<T>({ columns, rows, rowKey, actions, emptyMessage = "No records found.", loading }: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card-1">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border/60 bg-muted/50">
            <tr>
              {columns.map((column) => (
                <th key={column.header} className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {column.header}
                </th>
              ))}
              {actions && <th className="px-5 py-2.5" />}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className="px-5 py-6 text-muted-foreground" colSpan={columns.length + (actions ? 1 : 0)}>
                  Loading…
                </td>
              </tr>
            )}
            {!loading && rows.length === 0 && (
              <tr>
                <td className="px-5 py-6 text-muted-foreground" colSpan={columns.length + (actions ? 1 : 0)}>
                  {emptyMessage}
                </td>
              </tr>
            )}
            {!loading &&
              rows.map((row, index) => (
                <tr
                  key={rowKey(row)}
                  className={`group border-b border-border/30 last:border-b-0 ${index % 2 === 1 ? "bg-muted/[0.15]" : "bg-card"}`}
                >
                  {columns.map((column) => (
                    <td key={column.header} className={`px-5 py-2.5 ${column.className ?? ""}`}>
                      {column.render(row)}
                    </td>
                  ))}
                  {actions && <td className="px-5 py-2.5 text-right">{actions(row)}</td>}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
