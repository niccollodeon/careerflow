import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '../api';

interface MatchScoreInput {
  resumeId: string;
  jobDescription: string;
}

interface MatchScoreResult {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  totalRequiredSkills: number;
}

export function useMatchScore() {
  return useMutation<MatchScoreResult, Error, MatchScoreInput>({
    mutationFn: (dto) =>
      apiFetch('/matching/score', {
        method: 'POST',
        body: JSON.stringify(dto),
      }),
  });
}