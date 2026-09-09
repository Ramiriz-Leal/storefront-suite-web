import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { NewServiceOrder } from "@/domain/entities";
import { serviceOrderService } from "@/services/container";

const ORDERS_KEY = ["service-orders"];

export function useOpenServiceOrders() {
  return useQuery({ queryKey: [...ORDERS_KEY, "open"], queryFn: () => serviceOrderService.open() });
}

export function useServiceOrderHistory() {
  return useQuery({ queryKey: [...ORDERS_KEY, "history"], queryFn: () => serviceOrderService.history() });
}

export function useCreateServiceOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: NewServiceOrder) => serviceOrderService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ORDERS_KEY }),
  });
}

export function useStartServiceOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => serviceOrderService.start(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ORDERS_KEY }),
  });
}

export function useCloseServiceOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) => serviceOrderService.close(id, note),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ORDERS_KEY }),
  });
}

export function useCancelServiceOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) => serviceOrderService.cancel(id, note),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ORDERS_KEY }),
  });
}
