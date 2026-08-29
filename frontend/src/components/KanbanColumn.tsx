'use client';

import { useDroppable } from '@dnd-kit/core';
import { Application } from '@/lib/hooks/useApplications';
import { ApplicationCard } from './ApplicationCard';

const STATUS_LABELS: Record<string, string> = {
  SAVED: 'Saved',
  APPLIED: 'Applied',
  INTERVIEW: 'Interview',
  OFFER: 'Offer',
  REJECTED: 'Rejected',
};

export function KanbanColumn({
  status,
  applications,
}: {
  status: string;
  applications: Application[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 rounded-lg p-3 min-h-[400px] transition-colors ${
        isOver ? 'bg-indigo-50 ring-2 ring-indigo-200' : 'bg-slate-100'
      }`}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-sm font-semibold text-slate-700">
          {STATUS_LABELS[status] ?? status}
        </h2>
        <span className="text-xs font-medium text-slate-500 bg-white rounded-full px-2 py-0.5">
          {applications.length}
        </span>
      </div>

      {applications.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-6">No applications</p>
      ) : (
        applications.map((app) => <ApplicationCard key={app.id} app={app} />)
      )}
    </div>
  );
}