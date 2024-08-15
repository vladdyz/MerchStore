import { atom } from 'jotai';

async function defaultValues() {
    const results = [];
  
    /* This is just for testing purposes
    // Fetch Product 1
  
    const prod1Result = await fetch('https://dummyjson.com/products/1');
    const prod1 = await prod1Result.json();
  
    results.push(prod1);
  
    // Fetch Product 2
  
    const prod2Result = await fetch('https://dummyjson.com/products/2');
    const prod2 = await prod2Result.json();
  
    results.push(prod2);

    */
  
    return results;
  }

export const cartListAtom = atom(defaultValues());

//For using a global state to reflect the authentication of the user:
export const isAuthenticatedAtom = atom(false);