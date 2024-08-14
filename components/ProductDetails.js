import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from "next/link";
import { useAtom } from 'jotai';
import { cartListAtom } from '@/store'; // used in /components/ProductBox.js

//Render products through the useEffect below, either rendering all (setProducts) or using a query string Product ID(setFilteredProducts)
//Additionally, two more methods to account for the modal window (setSelectedPost and setIsModalOpen)
export default function PostTable() {
    const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { search } = router.query;
//Fetch the data from the API, passing it through two different methods (filter/no filter)
  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(response => response.json())
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);
  //if there'a a query string passed into this route, filter the data based on the value of the productID passed in
  //this will only display those products with a corresponding product ID to the one searched for by the user
  useEffect(() => {
    if (search) {
      const filtered = products.filter(item => item.id === parseInt(search));
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [search, products]);

    const handleRowClick = (post) => { //eventlistener onClick function for table rows, to open the modal window
        setSelectedPost(post);
        setIsModalOpen(true);
    };

    const closeModal = () => { //clicking anywhere outside of the modal window should close it
        setIsModalOpen(false);
        setSelectedPost(null);
    };
    //return the table filled by the fake clothing store API items
    //bottom half is my modal window code from Assignment 2 reformatted slightly
    //Assignment 4 update: Added a button in the modal window to add to cart
    const [cartList, setCartList] = useAtom(cartListAtom);
    function addToCart(product, e) { //The function now accepts the product object and an event object as arguments
        e.stopPropagation(); // This was added to prevent the event from bubbling up, since the row also has a click handler (modal window) & clicking the button would trigger both
        setCartList([...cartList, product]);
      }
      //Below is the code to display all of the mapped products in a table, with shopping cart functionality 
      //The second section of the return statement is the code for the modal window content
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border-collapse">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border">ID</th>
                        <th className="py-2 px-4 border">Title</th>
                        <th className="py-2 px-4 border">Price</th>
                        <th className="py-2 px-4 border">Description</th>
                        <th className="py-2 px-4 border">Image</th>
                        <th className="py-2 px-4 border">Category</th>
                        <th className="py-2 px-4 border">Rating</th>
                        <th className="py-2 px-4 border">Count</th>
                        <th className="py-2 px-4 border">Purchase</th>
                    </tr>
                </thead>
                <tbody>
                {filteredProducts.map(item => (
                        <tr key={item.id} data-id={item.id} onClick={() => handleRowClick(item)} className="cursor-pointer hover:bg-gray-200">
                            <td className="py-2 px-4 border">{item.id}</td>
                            <td className="py-2 px-4 border">{item.title}</td>
                            <td className="py-2 px-4 border">${item.price}</td>
                            <td className="py-2 px-4 border">{item.description}</td>
                            <td className="py-2 px-4 border">
                                <div className="w-48 h-48 flex justify-center items-center overflow-hidden">
                                    <img 
                                        src={item.image} 
                                        alt={item.title} 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </td>
                            <td className="py-2 px-4 border">{item.category}</td>
                            <td className="py-2 px-4 border">{item.rating.rate}</td>
                            <td className="py-2 px-4 border">{item.rating.count}</td>
                            <td className="py-2 px-4 border">
                                <button className="btn btn-outline-success border rounded px-3 py-0 bg-green-500 text-white hover:bg-green-600 mx-auto d-block flex" 
                                onClick={(e) => addToCart(item, e)} >Add to Cart
                                </button>
                             </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && selectedPost && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center" onClick={closeModal}>
                    <div className="bg-white rounded-lg overflow-hidden w-3/4 max-w-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="px-4 py-2 flex justify-between items-center border-b">
                            <h2 className="text-xl font-semibold">{selectedPost.title}</h2>
                            <button onClick={closeModal} className="text-gray-600 hover:text-gray-800">&times;</button>
                        </div>
                        <div className="p-4">
                            <ul className="list-group">
                                <li className="list-group-item">
                                    <strong>Rating: </strong> {selectedPost.rating.rate}<br />
                                    <img className="img-responsive w-60 h-60 rounded mx-auto d-block flex fit-content" src={selectedPost.image} alt={selectedPost.title} /><br />
                                    <strong>Price: </strong> ${selectedPost.price} <br />
                                    <strong>Description: </strong> {selectedPost.description}<br />
                                    <strong>Category: </strong> {selectedPost.category}<br />
                                    <strong>ID: </strong> {selectedPost.id}<br />
                                    <strong>Count: </strong> {selectedPost.rating.count}<br />
                                    <button className="btn btn-outline-success border rounded px-3 py-0 bg-green-500 text-white hover:bg-green-600 mx-auto d-block flex" 
                                    onClick={(e) => addToCart(selectedPost, e)} >Add to Cart
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
