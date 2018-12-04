"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//=================================
// PORT
//=================================
exports.SERVER_PORT = Number(process.env["PORT"]) || 3000;
//=================================
// ENVIRONMENT
//=================================
exports.NODE_ENV = process.env["NODE_ENV"] || 'dev';
//=================================
// TOKEN EXPIRES
//=================================
//60segs * 60min * 24h * 30 days
exports.TOKEN_EXPIRATION = 60 * 60 * 24 * 30;
//=================================
// SEED TOKEN
//=================================
exports.SEED = process.env["SEED"] || 'my-secret-dev';
//=================================
// FACEBOOK PROVIDER
//=================================
exports.FACEBOOK_APP_ID = process.env["FACEBOOK_APP_ID"] || 2258510817725939;
exports.FACEBOOK_APP_SECRET = process.env["FACEBOOK_APP_SECRET"] || '311de2eaaefd25371885c5d8991e71b1';
exports.FACEBOOK_ENDPOINT_VERIFY = 'https://graph.accountkit.com/v1.0/me/?access_token=';
//=================================
// DATABASE
//=================================
exports.URL_DATABASE = '';
if (exports.NODE_ENV === 'dev') {
    exports.URL_DATABASE = 'mongodb://localhost:27017/hookify';
}
else {
    exports.URL_DATABASE = process.env["MONGO_URI"] || '';
}
//# sourceMappingURL=Environment.js.map