'use strict';

const dbHelper = require('./setup'); 
const request = require('supertest');
const expect = require('expect.js');
const app = require('../index.js').app;

describe('BOOK Tests:', function() {

    before(function(done) {
        dbHelper.cleanDatabase(() => {
            done();
        });
    });

    describe('POST', function() {
        let newBook;
        before(function(done) {
            dbHelper.seedDatabase((book) => {
                newBook = book;
                done();
            }); 
        })
        it('should create a book on the database', function(done) {
            request(app)
                .post('/api/v1/books')
                .send(newBook)
                .expect(201)
                .then(res => {
                    expect(res.body.status).to.be('success');
                    expect(res.body.status_code).to.be(201);
                    done();
                });
        });
    });


    describe('GET', function() {
        it('should fetch books from the database', function(done) {
            request(app)
                .get('/api/v1/books')
                .expect(200)
                .then(res => {
                    expect(res.body.data.length).not.to.be(0);
                    expect(res.body.status).to.be('success');
                    expect(res.body.status_code).to.be(200);
                    done();
                });
        });
        
        it('should find a book by name', function(done) {
            request(app)
                .get('/api/external-books?name=Game of thrones')
                .expect(200)
                .then(res => {
                    expect(res.body.status).to.be('success');
                    expect(res.body.status_code).to.be(200);
                    done();
                });
        });

        describe('should fetch one book from the database', function(done) {
            let sampleBook;
            before(function(done) {
               request(app)
                .get('/api/v1/books')
                .expect(200)
                .then(res => {
                    sampleBook = res.body.data[0]
                    done();
                }); 
            });

            it('should fetch one book from the database', function(done) {
                request(app)
                    .get(`/api/v1/books/${sampleBook.id}`)
                    .expect(200)
                    .then(res => {
                        expect(res.body.status).to.be('success');
                        expect(res.body.status_code).to.be(200);
                        done();
                    });
            });
            
        });
    });

    describe('UPDATE', function() {
        describe('should update a book by id', function(done) {
            let sampleBook;
            before(function(done) {
               request(app)
                .get('/api/v1/books')
                .expect(200)
                .then(res => {
                    sampleBook = res.body.data[0]
                    done();
                }); 
            });

            it('should update one book on the database', function(done) {
                request(app)
                    .put(`/api/v1/books/${sampleBook.id}`)
                    .send({
                        country: "Test Country Updated"
                    })
                    .expect(200)
                    .then(res => {
                        expect(res.body.status).to.be('success');
                        expect(res.body.status_code).to.be(200);
                        expect(res.body.message).to.be(`The book ${sampleBook.name} was updated successfully`)
                        expect(res.body.data.country).to.be("Test Country Updated")
                        done();
                    });
            });
        });
    });

    describe('DELETE', function() {
        describe('should delete a book by id', function(done) {
            let sampleBook;
            before(function(done) {
               request(app)
                .get('/api/v1/books')
                .expect(200)
                .then(res => {
                    sampleBook = res.body.data[0]
                    done();
                }); 
            });

            it('should delete one book from the database', function(done) {
                request(app)
                    .delete(`/api/v1/books/${sampleBook.id}`)
                    .expect(200)
                    .then(res => {
                        expect(res.body.status).to.be('success');
                        expect(res.body.status_code).to.be(204);
                        expect(res.body.message).to.be(`The book ${sampleBook.name} was deleted successfully`)
                        done();
                    });
            });
            
        });
    });
});


