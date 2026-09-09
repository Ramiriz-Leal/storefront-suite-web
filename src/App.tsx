import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ContactsPage } from "@/pages/ContactsPage";
import { PosPage } from "@/pages/PosPage";
import { PosHistoryPage } from "@/pages/PosHistoryPage";
import { ServiceOrdersPage } from "@/pages/ServiceOrdersPage";
import { ServiceOrderHistoryPage } from "@/pages/ServiceOrderHistoryPage";

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/contacts" replace />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/pos" element={<PosPage />} />
        <Route path="/pos/history" element={<PosHistoryPage />} />
        <Route path="/service-orders" element={<ServiceOrdersPage />} />
        <Route path="/service-orders/history" element={<ServiceOrderHistoryPage />} />
        <Route path="*" element={<Navigate to="/contacts" replace />} />
      </Route>
    </Routes>
  );
}
