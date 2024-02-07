const express = require('express');
const axios = require('axios');
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

// get the book list with Axios
public_users.get('/books', function (req, res) {
    axios.get('https://samueljperry-5000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai')
        .then(response => {
            res.send(JSON.stringify(response.data, null, 4));
            console.log("Promise for Task 10 resolved");
        })
        .catch(error => {
            // Handle error
            console.error('Error fetching books:', error);
            res.status(500).send('Error fetching books');
        });
});

// Get book details based on ISBN added axios
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = parseInt(req.params.isbn)
    axios.get('https://samueljperry-5000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai')
    .then(response => {
        res.status(200).json(response.data[isbn + '']);
        console.log("Promise for Task 11 resolved");
    })
    .catch(error => {
        // Handle error
        console.error('Error fetching books:', error);
        res.status(500).send('Error fetching books');
    });
 });

  
// Get book details based on author added axios
public_users.get('/author/:author',function (req, res) {
  const authorName = req.params.author;
  axios.get('https://samueljperry-5000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai')
  .then(response => {
    const bookArray = Object.values(response.data);
      res.status(200).json(bookArray.find(book => book.author === authorName));
      console.log("Promise for Task 12 resolved");
  })
  .catch(error => {
      // Handle error
      console.error('Error fetching books:', error);
      res.status(500).send('Error fetching books');
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const titleName = req.params.title;
    axios.get('https://samueljperry-5000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai')
    .then(response => {
      const bookArray = Object.values(response.data);
        res.status(200).json(bookArray.find(book => book.title === titleName));
        console.log("Promise for Task 13 resolved");
    })
    .catch(error => {
        // Handle error
        console.error('Error fetching books:', error);
        res.status(500).send('Error fetching books');
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = parseInt(req.params.isbn)
    return res.status(200).json(books[isbn + ''].reviews);
});

module.exports.general = public_users;
