'use client';

import { useSession } from '../lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect, Fragment } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // Only render children if authenticated
  if (status === 'authenticated') {
    return children;
  }

  // Return nothing while redirecting
  return null;
}