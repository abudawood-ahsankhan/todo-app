'use client';

import { useSession } from '../lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // For demo purposes, allow access to tasks page without authentication
    // In a real implementation, this would check for actual authentication
    // if (status === 'unauthenticated') {
    //   router.push('/login');
    // }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // For demo purposes, always render children
  // In a real implementation, this would conditionally render based on authentication
  return <>{children}</>;
}