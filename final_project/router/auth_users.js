const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const review = req.query.review;
  const isbn = req.params.isbn;
  const username = req.session.authorization;
  const book = books[isbn];

  if (!review) {
    return res.status(400).json({message: "Please add a review"});
  }

  if (!book) {
      return res.status(404).json({message: `Book with isbn ${isbn} not found`});
  }

  if (book.reviews[username]) {
      book.reviews[username] = review;
      return res.status(200).json({message: `Your review for the book with isbn ${isbn} has been modified`})
  } else {
      book.reviews[username] = review;
      return res.status(200).json({message: `Your review for the book with isbn ${isbn} has been added`})
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({message: `Book with isbn ${isbn} not found`});
  }

  if (book.reviews[username]) {
    delete book.reviews[username];
    return res.status(200).json({message: `Review for book with isbn ${isbn} deleted successfully`});
  } else {
    return res.status(404).json({message: `Review not found for book with isbn ${isbn}`});
  }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;