import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { NewContact } from "@/domain/entities";
import { contactService } from "@/services/container";

const CONTACTS_KEY = ["contacts"];

export function useContacts() {
  return useQuery({ queryKey: CONTACTS_KEY, queryFn: () => contactService.list() });
}

export function useCreateContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: NewContact) => contactService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CONTACTS_KEY }),
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: NewContact }) => contactService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CONTACTS_KEY }),
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => contactService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CONTACTS_KEY }),
  });
}
