import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../api';

interface QuickAddInput {
  title: string;
  company: string;
  description: string;
  location?: string;
  sourceUrl?: string;
}

export function useQuickAdd() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: QuickAddInput) =>
      apiFetch('/applications/quick-add', {
        method: 'POST',
        body: JSON.stringify(dto),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}