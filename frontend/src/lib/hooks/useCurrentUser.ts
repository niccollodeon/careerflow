import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../api';

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => apiFetch('/auth/me'),
  });
}