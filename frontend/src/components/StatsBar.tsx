import { Application } from '@/lib/hooks/useApplications';

export function StatsBar({ applications }: { applications: Application[] }) {
  const total = applications.length;
  const applied = applications.filter((a) => a.status !== 'SAVED').length;
  const interviews = applications.filter((a) => a.status === 'INTERVIEW').length;
  const offers = applications.filter((a) => a.status === 'OFFER').length;
  const responseRate = applied > 0 ? Math.round(((interviews + offers) / applied) * 100) : 0;

  const stats = [
    { label: 'Applications', value: total },
    { label: 'Applied', value: applied },
    { label: 'Interviews', value: interviews },
    { label: 'Offers', value: offers },
    { label: 'Response Rate', value: `${responseRate}%` },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-lg border border-slate-200 p-4"
        >
          <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
          <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}