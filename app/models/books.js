'use strict';

const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
const config  = require('../../config');

/* 
    The user profile can be updated to
    include more details of the user after signup 
*/
const booksSchema = new mongoose.Schema({
    name: String,
    isbn: String,
    authors: [String],
    country: String,
    number_of_pages: Number,
    publisher: String,
    release_date: String,

}, { timestamps: false });

booksSchema.set('toJSON', {
    virtuals: true,
    versionKey: false
});

const Books = mongoose.model('Books', booksSchema);

module.exports = Books;
