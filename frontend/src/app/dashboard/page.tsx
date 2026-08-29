'use client';

import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { useApplications } from '@/lib/hooks/useApplications';
import { useUpdateApplicationStatus } from '@/lib/hooks/useUpdateApplicationStatus';
import { KanbanColumn } from '@/components/KanbanColumn';

const COLUMNS = ['SAVED', 'APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED'] as const;

export default function DashboardPage() {
  const { data: applications, isLoading, error } = useApplications();
  const updateStatus = useUpdateApplicationStatus();

  if (isLoading) return <p style={{ padding: '2rem' }}>Loading...</p>;
  if (error) return <p style={{ padding: '2rem' }}>Failed to load applications.</p>;

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const applicationId = active.id as string;
    const newStatus = over.id as string;

    updateStatus.mutate({ id: applicationId, status: newStatus });
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>
      <DndContext onDragEnd={handleDragEnd}>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          {COLUMNS.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              applications={applications?.filter((app) => app.status === status) ?? []}
            />
          ))}
        </div>
      </DndContext>
    </main>
  );
}