import { useState } from 'react';
import { useRouter } from 'next/router';
import { connect, registerUser } from '@/pages/api/authenticate';


export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [warning, setWarning] = useState('');
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setWarning(''); // Clear previous warning

    // Validation
    if (!username || !password || !confirmPassword) {
      setWarning('ERROR: All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setWarning('ERROR: Passwords do not match.');
      return;
    }

   /* try {
      console.log('Connecting to MongoDB...');
      await connect();
      console.log('Connected to MongoDB');
      await registerUser({ username, password, password2: confirmPassword });
      router.push('/login'); // Redirect to login page after successful registration
    } catch (err) {
      setWarning(`ERROR: ${err.message}`);
    }*/
      try {
        const res = await fetch('/api/auth/register', { //fetch from back-end API
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password, password2: confirmPassword }),
        });
        if (res.ok) {
            router.push('/');
          } else {
            const error = await res.json();
            setWarning(error.error);
          }
        } catch (err) {
          setWarning(`ERROR: ${err.message}`);
        }
  }

  return (
    <div>
    <div className="min-h-screen bg-base-200 bg-cover bg-center border-2 border-black" style={{ backgroundImage: "url('/pexels-catiamatos-1072179.webp')" }}>
    <div className="max-w-md mx-auto mt-32 p-4 bg-gray-100 rounded-md shadow-md bg-opacity-80">
        
      {warning && (
        <div className="text-red-600 mb-4">
          {warning}
        </div>
      )}
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Register
        </button>
      </form>
    </div>
    </div>
    <footer>
        <p className="text-xs text-center">Green Leaves by Cátia Matos (https://www.pexels.com/photo/green-leaves-1072179/)
        </p>
      </footer>
    </div>
  );
}
