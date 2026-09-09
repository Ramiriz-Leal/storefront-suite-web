import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { ClipboardList, History, LayoutGrid, ShoppingCart, Wrench } from "lucide-react";

const NAV_ITEMS = [
  { to: "/contacts", label: "Contacts", icon: ClipboardList },
  { to: "/pos", label: "Point of Sale", icon: ShoppingCart },
  { to: "/pos/history", label: "Sales History", icon: History },
  { to: "/service-orders", label: "Service Orders", icon: Wrench },
  { to: "/service-orders/history", label: "Orders History", icon: LayoutGrid },
];

export function Layout() {
  const [expanded, setExpanded] = useState(false);
  const asideRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (expanded && asideRef.current && !asideRef.current.contains(event.target as Node)) {
        setExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [expanded]);

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-[420px] w-[420px] rounded-full bg-accent/40 blur-3xl" />
      </div>

      <aside
        ref={asideRef}
        onClick={() => setExpanded(true)}
        className={`fixed left-0 top-0 z-20 flex h-dvh flex-col border-r border-border bg-card transition-[width] duration-300 ${
          expanded ? "w-[232px] cursor-default" : "w-16 cursor-pointer"
        }`}
      >
        <div className="flex items-center gap-2.5 px-4 py-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
            S
          </div>
          {expanded && (
            <div className="overflow-hidden">
              <p className="whitespace-nowrap text-sm font-semibold">
                Storefront<span className="text-primary">Suite</span>
              </p>
              <p className="whitespace-nowrap text-[11px] text-muted-foreground">Frontend demo</p>
            </div>
          )}
        </div>

        <div className="h-px bg-border" />

        <nav className="flex flex-1 flex-col gap-1 px-2.5 py-3">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `relative flex h-9 items-center gap-3 overflow-hidden rounded-md px-2.5 text-sm font-medium transition-colors ${
                    isActive ? "bg-muted text-primary" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && <span className="absolute left-0 top-1 h-7 w-[2px] rounded-full bg-primary" />}
                    <Icon className="ml-1 h-4 w-4 shrink-0" />
                    {expanded && <span className="whitespace-nowrap">{item.label}</span>}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <main className="ml-16 min-h-screen">
        <div className="mx-auto max-w-[1280px] px-4 py-8 md:px-9">
          <section className="animate-fade-in">
            <Outlet />
          </section>
        </div>
      </main>
    </div>
  );
}
