const bookController = require('../controllers/book');

module.exports = (app) => {
    'use strict';
	/*
	  GET http://localhost:8080/api/external-books?name=:nameOfABook
	  GET http://localhost:8080/api/v1/books/:id
	  PATCH http://localhost:8080/api/v1/books/:id
	  POST http://localhost:8080/api/v1/books
	  DELETE http://localhost:8080/api/v1/books/:id
	*/
    app.get('/api/external-books', bookController.find);
    app.get('/api/v1/books', bookController.getAll);
    app.get('/api/v1/books/:id', bookController.booksById, bookController.getOne);
    app.put('/api/v1/books/:id', bookController.booksById, bookController.update);
    app.post('/api/v1/books', bookController.create);
    app.delete('/api/v1/books/:id', bookController.booksById, bookController.delete);
};
