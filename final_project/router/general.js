const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const authenticatedUser = require("./auth_users.js").authenticatedUser;


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!authenticatedUser(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = parseInt(req.params.isbn)
  return res.status(200).json(books[isbn + '']);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const authorName = req.params.author;
  const bookArray = Object.values(books);
  
  return res.status(200).json(bookArray.find(book => book.author === authorName));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const titleName = req.params.title;
    const bookArray = Object.values(books);
    
    return res.status(200).json(bookArray.find(book => book.title === titleName));
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = parseInt(req.params.isbn)
    return res.status(200).json(books[isbn + ''].reviews);
});

module.exports.general = public_users;
