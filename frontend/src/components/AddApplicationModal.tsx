'use client';

import { useState } from 'react';
import { useQuickAdd } from '@/lib/hooks/useQuickAdd';

export function AddApplicationModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  const quickAdd = useQuickAdd();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    try {
      await quickAdd.mutateAsync({ title, company, description, location: location || undefined });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add application');
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Add Application</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            placeholder="Job title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
          <input
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
          <input
            placeholder="Location (optional)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border border-slate-300 text-slate-700 text-sm font-medium py-2 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={quickAdd.isPending}
              className="flex-1 rounded-md bg-slate-900 text-white text-sm font-medium py-2 hover:bg-slate-800 disabled:opacity-50"
            >
              {quickAdd.isPending ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}