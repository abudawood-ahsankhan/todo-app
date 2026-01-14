'use client';

// Temporary mock implementation to avoid import errors
// This simulates the Better Auth API until the import issue is resolved

import { createContext, useContext, useEffect, useState } from 'react';

// Define session types
interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}

interface Session {
  user: User;
  expiresAt: string;
  token: string;
}

// Context for session management
interface SessionContextType {
  session: Session | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

// Session provider component
export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  // Simulate session loading and state
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<SessionContextType['status']>('loading');

  useEffect(() => {
    // Simulate checking for existing session
    const checkSession = () => {
      // In a real implementation, this would check for actual session
      // For now, we'll just set it to unauthenticated after a brief delay
      setTimeout(() => {
        setStatus('unauthenticated');
      }, 300);
    };

    checkSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    // Simulate signing in - in a real implementation, this would call the API
    setStatus('authenticated');
    const mockSession: Session = {
      user: {
        id: 'mock-user-id',
        email,
        name: email.split('@')[0], // Use part of email as name
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      token: 'mock-jwt-token-for-testing'
    };
    setSession(mockSession);
    return { session: mockSession };
  };

  const signOut = async () => {
    // Simulate signing out - in a real implementation, this would call the API
    setSession(null);
    setStatus('unauthenticated');
  };

  return (
    <SessionContext.Provider value={{
      session,
      status,
      signIn,
      signOut
    }}>
      {children}
    </SessionContext.Provider>
  );
};

// Custom hook to use session context
export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return {
    data: context.session,
    status: context.status,
    signIn: context.signIn,
    signOut: context.signOut,
  };
};

// Helper function to get JWT token from session
export const getSessionToken = async (): Promise<string | null> => {
  // In a real implementation, this would get the actual session token
  // For now, return the mock token if available
  const context = SessionContext._currentValue as SessionContextType | undefined;
  return context?.session?.token || null;
};

// Function to check session validity
export const checkSession = async (): Promise<Session | null> => {
  const context = SessionContext._currentValue as SessionContextType | undefined;
  return context?.session || null;
};

// Direct API functions (these will use the context)
export const signIn = async (email: string, password: string) => {
  // This function requires context, so we'll throw an error if used improperly
  throw new Error('signIn requires component context. Use useSession hook instead.');
};

export const signOut = async () => {
  // This function requires context, so we'll throw an error if used improperly
  throw new Error('signOut requires component context. Use useSession hook instead.');
};