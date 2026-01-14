'use client';

import { useSession } from '../lib/auth';
import { useRouter } from 'next/navigation';

export default function Navigation() {
  const { signOut } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      // Redirect to login after successful sign out
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if sign out fails, redirect to login
      router.push('/login');
    }
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-xl font-bold">Todo App</div>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}