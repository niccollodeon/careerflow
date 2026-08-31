'use client';

import { useState } from 'react';
import { useRequireAuth } from '@/lib/hooks/useRequireAuth';
import { useUploadResume } from '@/lib/hooks/useUploadResume';
import { useMatchScore } from '@/lib/hooks/useMatchScore';
import Link from 'next/link';

export default function MatchPage() {
  const { isChecking } = useRequireAuth();
  const uploadResume = useUploadResume();
  const matchScore = useMatchScore();

  const [resumeId, setResumeId] = useState<string | null>(null);
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [error, setError] = useState('');

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    matchScore.reset();
    try {
      const result = await uploadResume.mutateAsync(file);
      setResumeId(result.id);
      setResumeFileName(result.fileName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    }
  }

  async function handleScore() {
    if (!resumeId || !jobDescription.trim()) return;
    setError('');
    try {
      await matchScore.mutateAsync({ resumeId, jobDescription });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scoring failed');
    }
  }

  function handleTryAnother() {
    setJobDescription('');
    matchScore.reset();
  }

  if (isChecking) return null;

  const result = matchScore.data;

  return (
    <main className="min-h-screen bg-slate-50 px-8 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Resume Match</h1>
            <p className="text-sm text-slate-500 mt-1">
              See how well your resume matches a job description.
            </p>
          </div>
          <Link href="/dashboard" className="text-sm text-slate-600 hover:text-slate-900">
            ← Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              1. Upload your resume (PDF)
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              disabled={uploadResume.isPending}
              className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-slate-900 file:text-white hover:file:bg-slate-800 cursor-pointer"
            />
            {uploadResume.isPending && (
              <p className="text-xs text-slate-400 mt-2">Uploading and extracting text...</p>
            )}
            {resumeFileName && !uploadResume.isPending && (
              <p className="text-xs text-emerald-600 mt-2">✓ {resumeFileName} ready</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">
                2. Paste the job description
              </label>
              {result && (
                <button
                  onClick={handleTryAnother}
                  className="text-xs text-slate-500 hover:text-slate-900"
                >
                  Try another job description
                </button>
              )}
            </div>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={8}
              placeholder="Paste the full job posting text here..."
              disabled={!resumeId}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            onClick={handleScore}
            disabled={!resumeId || !jobDescription.trim() || matchScore.isPending}
            className="w-full rounded-md bg-slate-900 text-white text-sm font-medium py-2.5 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {matchScore.isPending ? 'Calculating...' : 'Calculate Match Score'}
          </button>
        </div>

        {matchScore.isPending && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 mt-6 animate-pulse">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-slate-200 shrink-0" />
              <div className="space-y-2">
                <div className="h-3 w-24 bg-slate-200 rounded" />
                <div className="h-3 w-40 bg-slate-100 rounded" />
              </div>
            </div>
            <div className="h-3 w-32 bg-slate-200 rounded mb-3" />
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-slate-100 rounded-full" />
              <div className="h-6 w-20 bg-slate-100 rounded-full" />
              <div className="h-6 w-14 bg-slate-100 rounded-full" />
            </div>
          </div>
        )}

        {result && !matchScore.isPending && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 mt-6">
            <div className="flex items-center gap-4 mb-6">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold shrink-0 ${
                  result.score >= 70
                    ? 'bg-emerald-100 text-emerald-700'
                    : result.score >= 40
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-rose-100 text-rose-700'
                }`}
              >
                {result.score}%
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Match Score</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {result.matchedSkills.length} of {result.totalRequiredSkills} required skills found
                </p>
              </div>
            </div>

            {result.matchedSkills.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  Strong Matches
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.matchedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-full px-2.5 py-1"
                    >
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {result.missingSkills.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  Missing / Weak
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {result.missingSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 text-xs font-medium bg-amber-50 text-amber-700 rounded-full px-2.5 py-1"
                    >
                      ⚠ {skill}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-slate-400 italic">
                  If you have experience with these, consider adding them explicitly to your resume — they may be filtered on by keyword before a human ever reads it.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}