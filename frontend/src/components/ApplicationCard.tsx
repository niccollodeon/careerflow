'use client';

import { useDraggable } from '@dnd-kit/core';
import { Application } from '@/lib/hooks/useApplications';

export function ApplicationCard({ app }: { app: Application }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: app.id,
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)`, zIndex: 10 }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={`bg-white rounded-md border border-slate-200 shadow-sm p-3 mb-2 cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <p className="text-sm font-medium text-slate-900">{app.job.title}</p>
      <p className="text-xs text-slate-500 mt-0.5">{app.job.company}</p>
    </div>
  );
}