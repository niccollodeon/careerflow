'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useRequireAuth() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.replace('/login');
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect -- bootstrapping auth state from localStorage, which is only available client-side after mount; there's no server-renderable alternative here
    setIsChecking(false);
  }, [router]);

  return { isChecking };
}