const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });

public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let filtered_books = {};
  for(let key in books){
    if(books[key].author === author){
        filtered_books[key] = books[key];
    }
  }
  res.send(filtered_books);
});

public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let filtered_books = {};
  for(let key in books){
    if(books[key].title === title){
        filtered_books[key] = books[key];
    }
  }
  res.send(filtered_books);
});

public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

// Task 10 - Get all books using async
public_users.get('/books', async function (req, res) {
  const getBooks = () => {
    return new Promise((resolve, reject) => {
      resolve(books);
    });
  };
  const result = await getBooks();
  res.send(JSON.stringify(result, null, 4));
});

// Task 11 - Get by ISBN - Using Promises
public_users.get('/async-isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const getByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
      if (books[isbn]) resolve(books[isbn]);
      else reject("Not found");
    });
  };
  getByISBN(isbn).then(r => res.send(r)).catch(e => res.status(404).json({message:e}));
});

// Task 12 - Get by Author - Using async/await
async function getBookByAuthor(author){
  return new Promise((resolve, reject) => {
    let filtered = {};
    for(let key in books){
      if(books[key].author === author) filtered[key]=books[key];
    }
    if(Object.keys(filtered).length>0) resolve(filtered);
    else reject("Author not found");
  });
}
public_users.get('/async-author/:author', async function (req, res) {
  const author = req.params.author;
  (async()=>{
    let booksByAuthor = await getBookByAuthor(author);
    res.send(booksByAuthor);
  })();
});

// Task 13 - Get by Title - Using async/await
async function getBookByTitle(title){
  return new Promise((resolve, reject) => {
    let filtered = {};
    for(let key in books){
      if(books[key].title === title) filtered[key]=books[key];
    }
    if(Object.keys(filtered).length>0) resolve(filtered);
    else reject("Title not found");
  });
}
public_users.get('/async-title/:title', async function (req, res) {
  const title = req.params.title;
  (async()=>{
    let booksByTitle = await getBookByTitle(title);
    res.send(booksByTitle);
  })();
});

module.exports.general = public_users;
