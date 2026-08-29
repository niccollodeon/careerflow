export function DashboardSkeleton() {
  return (
    <div className="flex gap-4">
      {[1, 2, 3, 4, 5].map((col) => (
        <div key={col} className="flex-1 rounded-lg p-3 min-h-[400px] bg-slate-100">
          <div className="h-4 w-20 bg-slate-200 rounded animate-pulse mb-4" />
          {[1, 2].map((card) => (
            <div key={card} className="bg-white rounded-lg border border-slate-200 p-3 mb-2">
              <div className="flex items-start gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-slate-200 animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-slate-200 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-slate-100 rounded animate-pulse w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}