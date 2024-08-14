import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { cartListAtom, isAuthenticatedAtom  } from '@/store';
import { isAuthenticated, removeToken } from '@/pages/api/authenticate'; //for conditional navbar links display
import Image from 'next/image'; //for faster loading

export default function Layout({ children }) {
  const router = useRouter();
  const [productId, setProductId] = useState('');
  const [cartList] = useAtom(cartListAtom);
  const [authenticated, setAuthenticated] = useAtom(isAuthenticatedAtom);

  useEffect(() => {
    // Check authentication status when the component mounts
    setAuthenticated(isAuthenticated());
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      setAuthenticated(isAuthenticated());
    };
  
    // Listen for localStorage changes
    window.addEventListener('storage', handleStorageChange);
  
    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleSearchChange = (e) => {
    setProductId(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    router.push(`/products?search=${productId}`);
  };

  return (
    <>
      <header className="flex justify-between items-center p-4 bg-gray-100">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">
            <p className="text-red-600 inline">Seneca</p> Store
          </h1>
          <nav className="flex space-x-4">
            <Link href="/" className="text-blue-500 hover:underline">Home</Link>
            <Link href="/about" className="text-blue-500 hover:underline">About</Link>
            {authenticated && (
              <>
                <Link href="/products" className="text-blue-500 hover:underline">Products</Link>
                <Link href="/cart" className="text-blue-500 hover:underline">
                  Shopping Cart <span>({cartList.length})</span>
                </Link>
              </>
            )}
          </nav>
        </div>
        <div className="flex items-center space-x-4">
        {!authenticated ? (
            <>
              <Link href="/login" className="text-blue-500 hover:underline">Login</Link>
              <Link href="/register" className="text-blue-500 hover:underline">Register</Link>
            </>
          ) : (
            <button
              className="text-blue-500 hover:underline"
              onClick={() => {
                removeToken();
                setAuthenticated(false);  // Clear the token on logout
                router.push('/login');
              }}
               data-cy="logout-button"
            >
              Logout
            </button>
          )}
             {authenticated && (
              
            <form className="flex space-x-2" id="searchForm" onSubmit={handleSearchSubmit}>
            <input
              className="border rounded px-2 py-1"
              type="search"
              placeholder="Product ID (Number)"
              id="productId"
              aria-label="Search"
              value={productId}
              onChange={handleSearchChange}
            />
            <button className="border rounded px-4 py-1 bg-green-500 text-white hover:bg-green-600" type="submit">
              Search
            </button>
          </form>
             )}
        </div>
      </header>
      <main className="p-4">
        {children}
      </main>
    </>
  );
}
