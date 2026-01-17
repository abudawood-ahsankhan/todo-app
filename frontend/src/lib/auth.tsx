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
    // Check for existing session in localStorage
    const checkSession = () => {
      // Check if there's a stored token
      if (typeof window !== 'undefined') {
        const storedToken = localStorage.getItem('mock-jwt-token');
        if (storedToken) {
          // For mock implementation, we'll consider it valid if it exists
          // We'll create a mock session based on the token
          const tokenParts = storedToken.split('-');
          const userId = tokenParts[2] || 'mock-user-id';
          const mockSession: Session = {
            user: {
              id: userId,
              email: 'user@example.com', // Default email
              name: 'User',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
            token: storedToken
          };
          setSession(mockSession);
          setStatus('authenticated');
          return;
        }
      }
      setStatus('unauthenticated');
    };

    checkSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    // Simulate signing in - in a real implementation, this would call the API
    setStatus('authenticated');
    const userId = `user-${Date.now()}`; // Generate a unique user ID
    const mockSession: Session = {
      user: {
        id: userId,
        email,
        name: email.split('@')[0], // Use part of email as name
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      token: `mock-jwt-${userId}`
    };
    setSession(mockSession);
    // Store the token in localStorage for API client access
    localStorage.setItem('mock-jwt-token', mockSession.token);
    return { session: mockSession };
  };

  const signOut = async () => {
    // Simulate signing out - in a real implementation, this would call the API
    setSession(null);
    setStatus('unauthenticated');
    // Clear the token from localStorage
    localStorage.removeItem('mock-jwt-token');
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
  // For now, return the mock token from localStorage
  if (typeof window !== 'undefined') {
    return localStorage.getItem('mock-jwt-token') || null;
  }
  return null;
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