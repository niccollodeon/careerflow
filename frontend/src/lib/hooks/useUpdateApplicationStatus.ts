import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../api';

interface UpdateStatusInput {
  id: string;
  status: string;
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: UpdateStatusInput) =>
      apiFetch(`/applications/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}