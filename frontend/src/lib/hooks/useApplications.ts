import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../api';

export interface Application {
  id: string;
  status: 'SAVED' | 'APPLIED' | 'INTERVIEW' | 'OFFER' | 'REJECTED';
  notes: string | null;
  appliedAt: string | null;
  createdAt: string;
  job: {
    id: string;
    title: string;
    company: string;
    location: string | null;
  };
}

export function useApplications() {
  return useQuery<Application[]>({
    queryKey: ['applications'],
    queryFn: () => apiFetch('/applications'),
  });
}