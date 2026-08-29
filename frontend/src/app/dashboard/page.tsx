'use client';

import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { useApplications } from '@/lib/hooks/useApplications';
import { useUpdateApplicationStatus } from '@/lib/hooks/useUpdateApplicationStatus';
import { useRequireAuth } from '@/lib/hooks/useRequireAuth';
import { KanbanColumn } from '@/components/KanbanColumn';

const COLUMNS = ['SAVED', 'APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED'] as const;

export default function DashboardPage() {
  const { isChecking } = useRequireAuth();
  const { data: applications, isLoading, error } = useApplications();
  const updateStatus = useUpdateApplicationStatus();

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    updateStatus.mutate({ id: active.id as string, status: over.id as string });
  }

  if (isChecking) return null;

  return (
    <main className="min-h-screen bg-slate-50 px-8 py-8">
      <h1 className="text-2xl font-semibold text-slate-900 mb-6">Dashboard</h1>

      {isLoading && <p className="text-slate-500">Loading...</p>}
      {error && <p className="text-red-600">Failed to load applications.</p>}

      {applications && (
        <DndContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4">
            {COLUMNS.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                applications={applications.filter((app) => app.status === status)}
              />
            ))}
          </div>
        </DndContext>
      )}
    </main>
  );
}