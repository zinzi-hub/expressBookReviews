const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Get all books - using async/await
public_users.get('/',async function (req, res) {
  try {
    let myPromise = new Promise((resolve,reject)=>{
        resolve(books);
    });
    let result = await myPromise;
    return res.status(200).json(result);
  } catch(e){ return res.status(500).json({message:e}); }
});

// Get book by ISBN - using Promise
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let myPromise = new Promise((resolve,reject)=>{
    if(books[isbn]){ resolve(books[isbn]); }
    else{ reject({message:"Book not found"}); }
  });
  myPromise.then((result)=>{ return res.status(200).json(result); })
 .catch((err)=>{ return res.status(404).json(err); });
});

// Get books by author - using async/await
public_users.get('/author/:author',async function (req, res) {
  const author = req.params.author;
  try {
    let filtered = [];
    let myPromise = new Promise((resolve)=>{
        for(let isbn in books){
            if(books[isbn].author === author){ filtered.push(books[isbn]); }
        }
        resolve(filtered);
    });
    let result = await myPromise;
    return res.status(200).json(result);
  } catch(e){ return res.status(500).json({message:e}); }
});

// Get books by title - using async/await
public_users.get('/title/:title',async function (req, res) {
  const title = req.params.title;
  try {
    let filtered = [];
    let promise = new Promise((resolve)=>{
        for(let isbn in books){
            if(books[isbn].title === title){ filtered.push(books[isbn]); }
        }
        resolve(filtered);
    });
    let result = await promise;
    return res.status(200).json(result);
  } catch(e){ return res.status(500).json({message:e}); }
});

// Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(books[isbn]){ return res.status(200).json(books[isbn].reviews); }
  else{ return res.status(404).json({message:"Book not found"}); }
});

module.exports.general = public_users;
