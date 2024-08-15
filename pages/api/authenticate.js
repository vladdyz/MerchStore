import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from "bcryptjs"
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import jwtDecode from 'jwt-decode';

console.log('Imported jwtDecode:', jwtDecode);
//const mongoose = require('mongoose');

/*
Next requires all .env variables to be prefixed by NEXT_PUBLIC
It separates them into:
.env (all environments), 
.env.development (development environment), 
and .env.production (production environment).

*/
const mongoString = process.env.NEXT_PUBLIC_MONGO;

const isBrowser = typeof window !== 'undefined';


export async function connect() {
    if (mongoose.connection.readyState >= 1) {
      return; // Already connected
    }

    try {
        console.log('MongoDB URI from authenticate.js:', mongoString);
        console.log('MongoDB URI from auth next_public:', process.env.NEXT_PUBLIC_MONGO);
        await mongoose.connect(mongoString, { dbName: 'Web422'}); //failing to specify the "Web422" database caused me a lot of grief
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        throw err; // Rethrow the error to be handled in the calling function
    }
}

//create a new user in the db using the req.body object passed in and hash the password before saving
export async function registerUser(userData ) {
    await connect();
    return new Promise(function (resolve, reject) {
        console.log(User); //debug
        //console.log(username, password, password2);
        console.log(userData); // Debugging userData

        let { username, password, password2 } = userData;

        if (password != password2) {
            reject("Passwords do not match");
        } else {

            bcrypt.hash(password, 10).then(hash=>{ // Hash the password using a Salt that was generated using 10 rounds
                
                password = hash;

                const newUser = new User({
                  username,
                  password,
                });
                
                //attempt to save the user to the db, may generate errors if improperly created or username is not unique
                newUser.save().then(() => {
                    resolve("User " + userData.userName + " successfully registered");
                }).catch(err => {
                    if (err.code == 11000) {
                        reject("User Name already taken");
                    } else {
                        reject("There was an error creating the user: " + err);
                    }
                });
            }).catch(err=>reject(err));
        }
    });      
};

//authenticate function, checks if user exists
export async function authenticateUser(userName, password) {
    await connect();
    return new Promise((resolve, reject) => {
      User.findOne({ username: userName })
        .then(user => {
          if (!user) {
            return reject('User not found');
          }
  
          // Compare password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return reject('Error comparing passwords'); 
  
            if (isMatch) {
              // Passwords match, generate a JWT
              const payload = { id: user._id, username: user.username };
              const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  
              resolve({ message: 'Authentication successful', token });
            } else {
              reject('Invalid credentials');
            }
          });
        })
        .catch(err => reject(err));
    });
  };

  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (err) {
      console.error('Error parsing JWT:', err);
      return null;
    }
  }


  export function setToken(token) {
    localStorage.setItem('access_token', token);
  }
  
  export function getToken() {
    return localStorage.getItem('access_token');
  }
  

  export function readToken() {
    if (isBrowser) {
      try {
        const token = localStorage.getItem('access_token');
        console.log("Read Token: ", token)
        if (token) {
          const decodedToken = parseJwt(token);
          return decodedToken;
        }
        return null;
      } catch (err) {
        console.error('Error decoding token:', err);
        return null;
      }
    }
    return null;
  }
  
  //checks if user is authenticated by reading the JWT token, 
  export function isAuthenticated() {
    const token = readToken();
    console.log('Token:', token); // Debugging: Check if the token is present
    return token ? true : false;
  }
  
  export function removeToken() {
    localStorage.removeItem('access_token');
  }
  
  /*module.exports = {
    connect,
    registerUser,
    authenticateUser,
    setToken,
    getToken,
    readToken,
    isAuthenticated,
    removeToken,
  };*/