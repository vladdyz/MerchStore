import DashboardHome from '../pages/index';
//import Login from '../pages/login';
import About from '../pages/about';
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { render, waitFor } from "@testing-library/react";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAtom } from 'jotai';
import { cartListAtom, isAuthenticatedAtom  } from '@/store';
import fetch from 'node-fetch';


// Polyfill fetch globally
global.fetch = fetch;

describe("Home Page", () => {
    let container;

    beforeEach(() => {
        // Mock the fetch call, this is because the API isnt instantaneous at pulling these during the page testing causing it to fail
        fetchMock.mockResponseOnce(JSON.stringify([
            {
                id: 2,
                title: "Mens Casual Premium Slim Fit T-Shirts",
                description: "Description for Product 2",
                price: 22.3,
                rating: { rate: 4.1 },
                image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg"
            },
            {
                id: 5,
                title: "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
                description: "Description for Product 5",
                price: 695,
                rating: { rate: 4.6 },
                image: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg"
            },
            {
                id: 7,
                title: "White Gold Plated Princess",
                description: "Description for Product 7",
                price: 9.99,
                rating: { rate: 3 },
                image: "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg"
            },
            {
                id: 11,
                title: "Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost SATA III 2.5",
                description: "Description for Product 11",
                price: 109,
                rating: { rate: 4.8 },
                image: "https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_.jpg"
            },
            {
                id: 15,
                title: "BIYLACLESEN Women's 3-in-1 Snowboard Jacket Winter Coats",
                description: "Description for Product 15",
                price: 56.99,
                rating: { rate: 2.6 },
                image: "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg"
            },
            {
                id: 16,
                title: "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket",
                description: "Description for Product 16",
                price: 29.95,
                rating: { rate: 2.9 },
                image: "https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_.jpg"
            },
        ]));

        ({ container } = render(<DashboardHome />));
    });
    //Check to see if the home page renders appropriately, it should load the Seneca image in the hero element
    test("Home page renders Seneca", async () => {
        await waitFor(() => {
            const seneca = container.querySelector('img[alt="Seneca College Logo"]');
            expect(seneca).toBeInTheDocument();
        });
    });
     //There should be a button that takes you to either the login page or the products selection in the hero element
    test("Home page contains a button in the hero element", async () => {
        await waitFor(() => {
            const homeButton = container.querySelector('.hero button');
            expect(homeButton).toBeInTheDocument();
        });
    });
    //All 6 of the featured products, which have been mocked in the fetch call, are displayed with their images
    test("All of the showcase images are displayed", async () => {
        await waitFor(() => {
            const images = container.querySelectorAll('img');
            expect(images.length).toBe(7); 
        });
    });
});


//Wont play nice with mongoose, way too annoying to do
/*describe("Login", () => {
    const {container} = render(<Login />);
    //The login page has a form element, if it is not found it means the page could not render correctly
    test("Login page should contain a form", async () => {
        await waitFor(() => {
            const form = container.querySelector('form');
            expect(form).toBeInTheDocument();
        });
    });
});
*/

describe("About", () => {
    let container;

    beforeEach(() => {
        const rendered = render(<About />);
        container = rendered.container;
    });
    test("About page contains the Seneca logo", async () => {
        await waitFor(() => {
            const seneca = container.querySelector('img[alt="Seneca College Logo"]');
            expect(seneca).toBeInTheDocument();
        });
    });
    test("About page contains a link to the auth/store", async () => {
        await waitFor(() => {
            const homeButton = container.querySelector('.hero button');
            expect(homeButton).toBeInTheDocument();
        });
    });
    test("About page contains a background image", async () => {
        await waitFor(() => {
            const bgDiv = container.querySelector('.hero.min-h-screen.bg-base-200.bg-cover.bg-center.border-2.border-black');
            expect(bgDiv).toHaveStyle('background-image: url("/lonely.gif")');
        });
    });
    test("Background image has a proper visible citation", async() =>{
        await waitFor(() => {
            const citation = container.querySelector('.text-xs.text-center')
            expect(citation).toBeInTheDocument();
        })
    })

});