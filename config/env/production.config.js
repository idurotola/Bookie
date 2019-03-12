'use strict';

module.exports = {
    port: process.env.PORT || process.env.NODE_PORT || 4000,
    bcrypt: {
        hashRounds: 10
    },
    dbUrl: process.env.DATABASE_URL,
    auth: {
        signKey: process.env.AUTH_SIGN_KEY,
        tokenTTL: 1000 * 60 * 60 * 1 * 1 // 1 hour
    }
};