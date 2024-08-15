import { useState } from 'react';
import { useAtom } from 'jotai';
import { authenticateUser } from '@/pages/api/authenticate';
import { isAuthenticatedAtom } from '@/store';
import Image from 'next/image'; //for faster loading
import BackgroundImage from '@/components/backgroundImage';



import { useRouter } from 'next/router';

export default function Login() {
  const [warning, setWarning] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [, setAuthenticated] = useAtom(isAuthenticatedAtom);

  async function handleSubmit(e) {
    e.preventDefault();

    /*try {
      await authenticateUser(user, password);
      router.push("/vehicles");
    } catch (err) {
      setWarning(err.message);
    }*/
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: user, password }),
        });
    
        if (res.ok) {
          const { token } = await res.json();
          setAuthenticated(true); // Update global authentication state, super important! Otherwise, you have to refresh first.
          localStorage.setItem('access_token', token);
          console.log('Stored Token:', localStorage.getItem('access_token')); // Debugging: Check if the token is stored
          router.push('/');
        } else {
          const error = await res.json();
          //setWarning(error.error);
          setWarning(typeof error.error === 'string' ? error.error : 'An unknown error occurred');
        }
      } catch (err) {
        setWarning(`ERROR: ${err.message}`);
      }
  }

  return (
    <div>
    <div className="min-h-screen bg-base-200 bg-cover bg-center border-2 border-black" style={{ backgroundImage: "url('/pexels-andre-furtado-43594-370717.webp')" }}>
    <div className="max-w-md mx-auto mt-32 p-6 flex flex-col items-center bg-gray-100 rounded-md shadow-md bg-opacity-60">
      <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full mb-4">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold">Login</h2>
          <p>Enter your login information below:</p>
        </div>
      </div>

      {warning && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4 w-full text-center">
          {warning}
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full">
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 mb-2">User:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={user}
            onChange={e => setUser(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 mb-2">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
    </div>
    <footer>
        <p className="text-xs text-center">Low Angle Photography of High Rise Building by Andre Furtado (https://www.pexels.com/photo/low-angle-photography-of-high-rise-building-370717/)
        </p>
      </footer>
    </div>
  );
}
