'use strict';

const bodyParser = require('body-parser');
const morgan = require('morgan');

const expressValidator = require('express-validator');
const FileStreamRotator = require('file-stream-rotator');
const methodOverride = require('method-override');
const fs = require('fs');

const helmet = require('helmet');

const loggerInit = require('./logger');
const logDirectory = './log';

const routes = require('../app/routes');

module.exports = (app) => {
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(bodyParser.json());
    app.use(methodOverride(function (req, res) {
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
            const method = req.body._method;
            delete req.body._method;
            return method;
        }
	}));

    app.use(expressValidator());

    // Use helmet to secure Express headers
    app.use(helmet.frameguard());
    app.use(helmet.xssFilter());
    app.use(helmet.noSniff());
    app.use(helmet.ieNoOpen());
    app.disable('x-powered-by');

    // Initialize logger
    let logger = (app.get('env')) ? loggerInit(app.get('env')): loggerInit();
    global.logger = logger;

    // Create log files
    let checkLogDir = fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

    if (checkLogDir) {
        var accessLogStream = FileStreamRotator.getStream({
            date_format: 'YYYYMMDD',
            filename: logDirectory + '/access-%DATE%.log',
            frequency: 'weekly',
            verbose: false
        });
    }

    app.use(morgan('combined', { stream: accessLogStream }));

    // Route to the users handler
    routes(app);

    app.use((req, res, next) => {
        let err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // Error handlers 
    if (app.get('env') === 'development') {
        app.use((err, req, res, next) => {
            res.status(err.status || 500).
            json({
                message: err.message,
                error: err
            });
        });
    }

    app.use((err, req, res, next) => {
        res.status(err.status || 500).
        json({
            message: err.message
        });
    });
 };