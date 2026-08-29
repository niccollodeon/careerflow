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

    setIsChecking(false);
  }, [router]);

  return { isChecking };
}