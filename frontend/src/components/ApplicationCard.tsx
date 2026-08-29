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
      className={`group bg-white rounded-lg border border-slate-200 shadow-sm p-3 mb-2 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-slate-300 transition-all ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start gap-2.5">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-semibold shrink-0 ${color.bg} ${color.text}`}
        >
          {getCompanyInitials(app.job.company)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-900 truncate">{app.job.title}</p>
          <p className="text-xs text-slate-500 truncate">{app.job.company}</p>
          {app.job.location && (
            <p className="text-xs text-slate-400 mt-0.5 truncate">{app.job.location}</p>
          )}

          <div className="max-h-0 group-hover:max-h-20 overflow-hidden transition-all duration-200">
            <div className="pt-2 mt-2 border-t border-slate-100 space-y-1">
              {app.appliedAt && (
                <p className="text-xs text-slate-400">
                  Applied {new Date(app.appliedAt).toLocaleDateString()}
                </p>
              )}
              {app.notes && (
                <p className="text-xs text-slate-500 line-clamp-2">{app.notes}</p>
              )}
              {!app.appliedAt && !app.notes && (
                <p className="text-xs text-slate-300 italic">No notes yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}