"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//=================================
// PORT
//=================================
exports.SERVER_PORT = Number(process.env.PORT) || 3000;
//=================================
// ENVIRONMENT
//=================================
exports.NODE_ENV = process.env.NODE_ENV || 'dev';
//=================================
// TOKEN EXPIRES
//=================================
//60segs * 60min * 24h * 30 days
exports.TOKEN_EXPIRATION = 60 * 60 * 24 * 30;
//=================================
// SEED TOKEN
//=================================
exports.SEED = process.env.SEED || 'my-secret-dev';
if (process.env.NODE_ENV === 'dev') {
    exports.URL_DATABASE = 'mongodb://localhost:27017/cafe';
}
else {
    exports.URL_DATABASE = process.env.MONGO_URI;
}
