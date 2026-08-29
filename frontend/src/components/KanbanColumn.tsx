'use client';

import { useDroppable } from '@dnd-kit/core';
import { Application } from '@/lib/hooks/useApplications';
import { ApplicationCard } from './ApplicationCard';

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
      style={{
        flex: 1,
        background: isOver ? '#e0e7ff' : '#f4f4f4',
        padding: '1rem',
        borderRadius: '8px',
        minHeight: '300px',
        transition: 'background 0.15s',
      }}
    >
      <h2 style={{ fontSize: '1rem', marginBottom: '1rem' }}>
        {status} ({applications.length})
      </h2>
      {applications.map((app) => (
        <ApplicationCard key={app.id} app={app} />
      ))}
    </div>
  );
}