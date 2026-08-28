async function getHealth() {
  const res = await fetch('http://localhost:3000/health', { cache: 'no-store' });
  return res.json();
}

export default async function Home() {
  const health = await getHealth();

  return (
    <main style={{ padding: '2rem' }}>
      <h1>CareerFlow</h1>
      <p>Backend status: {health.status}</p>
      <p>Server time: {health.timestamp}</p>
    </main>
  );
}