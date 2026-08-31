import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '../api';

export function useUploadResume() {
  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return apiFetch('/resumes/upload', {
        method: 'POST',
        body: formData,
      });
    },
  });
}