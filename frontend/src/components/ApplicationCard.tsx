'use client';

import { useDraggable } from '@dnd-kit/core';
import { Application } from '@/lib/hooks/useApplications';

export function ApplicationCard({ app }: { app: Application }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: app.id,
  });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        zIndex: 10,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        background: 'white',
        padding: '0.75rem',
        borderRadius: '6px',
        marginBottom: '0.5rem',
        cursor: 'grab',
        opacity: isDragging ? 0.5 : 1,
        ...style,
      }}
    >
      <strong>{app.job.title}</strong>
      <p style={{ fontSize: '0.85rem', color: '#555' }}>{app.job.company}</p>
    </div>
  );
}