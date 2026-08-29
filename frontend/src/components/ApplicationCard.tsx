'use client';

import { useDraggable } from '@dnd-kit/core';
import { Application } from '@/lib/hooks/useApplications';
import { getCompanyInitials, getCompanyColor } from '@/lib/avatar';

export function ApplicationCard({ app }: { app: Application }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: app.id,
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)`, zIndex: 10 }
    : undefined;

  const color = getCompanyColor(app.job.company);

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={`bg-white rounded-lg border border-slate-200 shadow-sm p-3 mb-2 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start gap-2.5">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-semibold shrink-0 ${color.bg} ${color.text}`}
        >
          {getCompanyInitials(app.job.company)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-900 truncate">{app.job.title}</p>
          <p className="text-xs text-slate-500 truncate">{app.job.company}</p>
          {app.job.location && (
            <p className="text-xs text-slate-400 mt-0.5 truncate">{app.job.location}</p>
          )}
        </div>
      </div>
    </div>
  );
}