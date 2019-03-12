'use strict';

const pick = require('lodash.pick');
const find = require('lodash.find');
const Books = require('../models/books');
const needle = require('needle');

exports.getAll = (req, res) => {
    Books.find({}, function(err, books) {
    
        const allBooks = books.map(each => {
            each = each.toJSON()
            delete each._id
            return each;
        });    

        res.status(200).json({
            status_code: 200,
            status: "success",
            data: allBooks
        }) 
    });
}

exports.create = (req, res) => {
    req.assert('name', 'Name cannot be blank').notEmpty();
    req.assert('isbn', 'isbn is not valid').notEmpty();
    req.assert('authors', 'Authors cannot be blank').notEmpty();
    req.assert('country', 'Country cannot be blank').notEmpty();
    req.assert('number_of_pages', 'Number of pages cannot be blank').notEmpty();
    req.assert('publisher', 'Publisher cannot be blank').notEmpty();
    req.assert('release_date', 'Release date cannot be blank').notEmpty();

    const errors = req.validationErrors();
    if (errors) return res.status(400).json(errors);
 
    const newBook = pick(req.body, [
        'name', 'isbn', 'authors', 'country', 'number_of_pages', 'publisher', 'release_date'
    ]);

    const book = new Books(newBook);

    book.save(err => {
        if (err) throw err
        res.status(201).json({
            status_code: 201,
            status: "success",
            data: [newBook]
        })
    });
}

exports.find = (req, res) => {
    const queryString = req.query.name ? `?name=${req.query.name}`: '';
    
    const reqOptions = {
        headers: { 'content-type': 'application/json' }
    }

    const baseUrl = "https://www.anapioficeandfire.com/api/books";

    needle.get(`${baseUrl}${queryString}`, reqOptions, function(err, resp) {
        if (err) return res.status(400).json(err);
        const books = resp.body.length? resp.body.map(each => {
            return {
                name: each.name,
                isbn: each.isbn,
                authors: each.authors,
                number_of_pages: each.numberOfPages,
                publisher: each.publisher,
                country: each.country,
                release_date: each.released,
            }
        }) : [];

        res.status(200).json({
            status_code: 200,
            status: "success",
            data: books
        })
    });
}

exports.booksById = (req, res, next) => {
    Books.findById(req.params.id).then(book  => {
        if (book) {
            req.book = book.toJSON();
            delete req.book._id
            return next()
        }
        
        return res.status(400).json({
            status_code: 400,
            status: "failed",
            message: "Book does not exist",
            data: []
        })
    })
    .catch(err => {
        throw err
    });
}

exports.getOne = (req, res) => {
    return res.status(200).json({
        status_code: 200,
        status: "success",
        data: req.book || []
    })
}

exports.update = (req, res) => {
    Books.findOneAndUpdate({_id: req.params.id}, {$set: req.body}, {new: true}).then(doc => {
        if(doc) {
            return res.status(200).json({
                status_code: 200,
                status: "success",
                message: `The book ${req.book.name} was updated successfully`,
                data: doc.toJSON()
            });
        }
    })
    .catch(err => {
        return res.status(400).json({
            status_code: 400,
            status: "failed",
            message: "Could not update book",
            data: []
        })
    });
}

exports.delete = (req, res) => {
    Books.findOneAndDelete({_id: req.params.id }).then(book => {
        if (book) {
            return res.json({
                status_code: 204,
                status: "success",
                message: `The book ${req.book.name} was deleted successfully`,
                data: []
            });
        }
    })
    .catch(err => {
        return res.status(400).json({
            status_code: 400,
            status: "failed",
            message: "Could not delete book",
            data: []
        })
    });
}

