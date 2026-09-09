import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Contact } from "@/domain/entities";
import type { CartLine } from "@/services/posService";
import { posService } from "@/services/container";

export function useProducts() {
  return useQuery({ queryKey: ["products"], queryFn: () => posService.listProducts() });
}

export function useSales() {
  return useQuery({ queryKey: ["sales"], queryFn: () => posService.listSales() });
}

export function useCheckout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cart, contact }: { cart: CartLine[]; contact: Contact | null }) =>
      posService.checkout(cart, contact),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useCancelSale() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => posService.cancelSale(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sales"] }),
  });
}
