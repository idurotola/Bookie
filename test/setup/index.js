process.env.NODE_ENV = 'test';

const config = require('../../config');
const DatabaseCleaner = require('database-cleaner'); 
const databaseCleaner = new DatabaseCleaner('mongodb');

const f = require('factory-girl');
const Factory = f.factory;
const adapter = new f.MongooseAdapter();
const Books = require('../../app/models/books');

const connect = require('mongodb').connect;
Factory.setAdapter(adapter);

module.exports.cleanDatabase = (cb) => {
    // Prepare the database for integration testing.
    connect(config.dbUrl, function(err, db) {
        databaseCleaner.clean(db, function() {
            db.close();
            cb();
        });
    });
}

module.exports.seedDatabase = (cb) => {
    Factory.define('books', Books, {
        name: Factory.chance('name'),
        isbn: "978-7066719488",
        authors: [Factory.chance('name')],
        number_of_pages: 500,
        publisher: "Test Publisher",
        country: "Test Country",
        release_date: "2019-08-02"
    });

    Factory.build('books').then(book => {
       cb(book);
    });
}
