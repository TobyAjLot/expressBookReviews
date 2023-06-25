const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
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
  //Write your code here
  return res.status(200).send(JSON.stringify(books,null,4));
});

// Using Promise
/*
public_users.get("/", function (req, res) {
    new Promise(function(resolve, reject){
        const bookList = JSON.stringify(books,null,4)
        resolve(bookList)
    })
    .then(function(bookList) {
        return res.status(200).send(bookList)
    })
    .catch(function(err) {
        return res.status(500).json({message: "Cannot fetch book list at the moment, please try later"});
    })
})
*/

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json({book});
  } else {
    return res.status(404).json({message: "Book not found"});
  }
 });

// Using promise
/*
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  new Promise(function(resolve, reject) {
    const book = books[isbn];
    if (book) {
      resolve({book});
    } else {
      reject({message: "Book not found"});
    }
  })
  .then(function(foundBook) {
    return res.status(200).json(foundBook);
  })
  .catch(function(err) {
    return res.status(404).json(err);
  });
});
*/

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const booksAuthor = Object.values(books).filter(book => book.author === author);
  if (booksAuthor.length > 0) {
      return res.status(200).json({books: booksAuthor});
  } else {
    return res.status(404).json({message: `Book with author name ${author} does not exist`});
  }
});

// Using Promise
/* public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  new Promise(function(resolve, reject) {
    const booksAuthor = Object.values(books).filter(book => book.author === author);
    if (booksAuthor.length > 0) {
      resolve({books: booksAuthor});
    } else {
      reject({message: `Book with author name ${author} does not exist`});
    }
  })
  .then(function(foundBook) {
    return res.status(200).json(foundBook);
  })
  .catch(function(err) {
    return res.status(404).json(err);
  });
});
*/

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const booksTitle = Object.values(books).filter(book => book.title === title);
  if (booksTitle.length > 0) {
    return res.status(200).json({books: booksTitle});
} else {
  return res.status(404).json({message: `Book with author name ${title} does not exist`});
}
});

// Using Promise
/* public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  new Promise(function(resolve, reject) {
    const booksTitle = Object.values(books).filter(book => book.title === title);
    if (booksTitle.length > 0) {
      resolve({books: booksTitle});
    } else {
      reject({message: `Book with author name ${title} does not exist`});
    }
  })
  .then(function(foundBook) {
    return res.status(200).json(foundBook);
  })
  .catch(function(err) {
    return res.status(404).json(err);
  });
});
*/

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book && Object.keys(book.reviews).length > 0) {
    return res.status(200).json({reviews: book.reviews});
  } else if (book && Object.keys(book.reviews).length === 0) {
      console.log(book.reviews)
    return res.status(200).json({message: `No reviews found for the book: ${book.title}`});
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
