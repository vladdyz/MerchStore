import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAtom } from 'jotai';
import { cartListAtom, isAuthenticatedAtom  } from '@/store'; // used in /components/ProductBox.js
import 'dotenv/config';
import Image from 'next/image'; //for faster loading

export default function DashboardHome() {
  const [products, setProducts] = useState([]);
  const [authenticated] = useAtom(isAuthenticatedAtom); // Check authentication status to conditionally display
                                                        // or hide elements depending on the auth state 

  useEffect(() => {
    // Fetch the products data from the API
    fetch('https://fakestoreapi.com/products')
      .then(response => response.json())
      .then(data => {
        // Filter products by the specified IDs
        const filteredProducts = data.filter(item => [2, 5, 7, 11, 15, 16].includes(item.id));
        setProducts(filteredProducts);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

   //Assignment 4 update: Added a button in the modal window to add to cart
   const [cartList, setCartList] = useAtom(cartListAtom);
   function addToCart(product) {
       setCartList([...cartList, product]);
     }



  return (
    <div>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">
              <Image className="object-cover" src="/2560px-Seneca_College_logo.svg.png" alt="Seneca College Logo" 
               layout="instrinsic"  width={2560} height={1440} objectFit="cover" objectPosition="center" priority/>
            </h1>
            <p className="py-6">We sell consumer goods now, not just education!</p>
            {!authenticated ? (
              <Link href="/login">
                <button className="btn btn-primary">
                  Login to check out our selection
                </button>
              </Link>
            ) : (
              <Link href="/products">
                <button className="btn btn-primary">
                  Check out our selection
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
      <p className="text-6xl font-bold text-center">Popular Products</p>
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map(product => (
            <div key={product.id} className="bg-white shadow-md rounded-lg p-4 flex flex-col h-full">
            <div className="flex justify-center items-center mb-4">
              <img 
                src={product.image} 
                alt={product.title} 
                className="w-48 h-48 object-contain"
              />
            </div>
            <h2 className="text-lg font-semibold mb-2">{product.title}</h2>
            <p className="text-gray-700 mb-2 text-sm">{product.description}</p>
            <div className="flex justify-between items-center mb-4">
              <p className="text-lg font-bold">${product.price}</p>
              <p className="text-gray-700">Rating: {product.rating.rate}</p>
            </div>
            {authenticated && (
                <button
                  className="btn btn-outline-success border rounded px-3 py-1 bg-green-500 text-white hover:bg-green-600 mt-auto mx-auto w-1/2"
                  onClick={(e) => addToCart(product)}
                >
                  Add to Cart
                </button>
              )}
          </div>
          ))}
        </div>
      </div>
    </div>
  );
}
