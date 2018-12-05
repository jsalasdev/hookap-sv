"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Environment_1 = require("../config/Environment");
exports.verifyJwt = (req, res, next) => {
    let token = req.get('token') || '';
    if (token === '') {
        return res.status(401).json({
            ok: false,
            error: {
                message: 'Token no válido'
            }
        });
    }
    else {
        jsonwebtoken_1.default.verify(token, Environment_1.SEED, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    ok: false,
                    error: {
                        message: 'Token no válido'
                    }
                });
            }
            req.user = decoded.user;
            next();
        });
    }
};
exports.generateToken = (user) => {
    return jsonwebtoken_1.default.sign({
        user
    }, Environment_1.SEED, { expiresIn: Environment_1.TOKEN_EXPIRATION });
};
//# sourceMappingURL=Authentication.js.map