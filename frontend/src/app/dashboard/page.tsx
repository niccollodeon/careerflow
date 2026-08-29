'use client';

import { useApplications } from '@/lib/hooks/useApplications';

const COLUMNS = ['SAVED', 'APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED'] as const;

export default function DashboardPage() {
  const { data: applications, isLoading, error } = useApplications();

  if (isLoading) return <p style={{ padding: '2rem' }}>Loading...</p>;
  if (error) return <p style={{ padding: '2rem' }}>Failed to load applications.</p>;

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        {COLUMNS.map((status) => {
          const columnApps = applications?.filter((app) => app.status === status) ?? [];

          return (
            <div
              key={status}
              style={{ flex: 1, background: '#f4f4f4', padding: '1rem', borderRadius: '8px', minHeight: '300px' }}
            >
              <h2 style={{ fontSize: '1rem', marginBottom: '1rem' }}>
                {status} ({columnApps.length})
              </h2>
              {columnApps.map((app) => (
                <div
                  key={app.id}
                  style={{ background: 'white', padding: '0.75rem', borderRadius: '6px', marginBottom: '0.5rem' }}
                >
                  <strong>{app.job.title}</strong>
                  <p style={{ fontSize: '0.85rem', color: '#555' }}>{app.job.company}</p>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </main>
  );
}