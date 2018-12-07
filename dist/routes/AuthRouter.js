"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomRouter_1 = require("../models/CustomRouter");
const Environment_1 = require("../config/Environment");
const axios = __importStar(require("axios"));
const User_1 = require("../models/User");
const Authentication_1 = require("../middlewares/Authentication");
function updateUserProfile(accessToken) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios.default.get(Environment_1.FACEBOOK_ENDPOINT_DATA + accessToken);
            return response.data;
        }
        catch (err) {
            return undefined;
        }
    });
}
class AuthRouter extends CustomRouter_1.CustomRouter {
    constructor() {
        super();
        //Modificar en el futuro: crear un verify para facebook y desacoplar logica de la ruta
        //Crear un base para los errores
        this.authWithFacebook = (req, res) => {
            let body = req.body;
            if (body === undefined || (body.access_token === undefined || body.access_token === '')) {
                return res.status(400).json({
                    ok: false,
                    error: 'Incorrect access token'
                });
            }
            else {
                let tokenToInspect = body.access_token;
                const URL = `${Environment_1.FACEBOOK_ENDPOINT_VERIFY}input_token=${tokenToInspect}&access_token=${Environment_1.FACEBOOK_APP_ID}|${Environment_1.FACEBOOK_APP_SECRET}`;
                axios.default.get(URL)
                    .then(resp => {
                    let userId = resp.data.data.user_id;
                    User_1.User.findOne({ providerId: userId }, (err, user) => {
                        if (err) {
                            return res.status(500).json({
                                ok: false,
                                error: {
                                    message: 'SERVER ERROR.'
                                }
                            });
                        }
                        if (!user) {
                            updateUserProfile(tokenToInspect).then(data => {
                                let newUser = new User_1.User({
                                    firstName: data.first_name,
                                    lastName: data.last_name,
                                    picture: data.picture.data.url,
                                    providerId: userId,
                                    provider: 'facebook'
                                });
                                newUser.save((err, userDB) => {
                                    if (err) {
                                        return res.status(500).json({
                                            ok: false,
                                            error: {
                                                message: 'SERVER ERROR.'
                                            }
                                        });
                                    }
                                    ;
                                    console.log(userDB);
                                    return res.json({
                                        ok: true,
                                        user: userDB,
                                        token: Authentication_1.generateToken(userDB)
                                    });
                                });
                            }).catch(err => {
                                return res.status(500).json({
                                    ok: false,
                                    error: {
                                        message: 'SERVER ERROR.'
                                    }
                                });
                            });
                        }
                        else {
                            return res.json({
                                ok: true,
                                user,
                                token: Authentication_1.generateToken(user)
                            });
                        }
                    });
                })
                    .catch(err => {
                    if (err.response) {
                        res.status(401).json({
                            ok: false,
                            error: err.response.data
                        });
                    }
                    else {
                        res.status(401).json({
                            ok: false,
                            error: {
                                message: 'SERVER ERROR.'
                            }
                        });
                    }
                });
            }
        };
        this.registerRoutes();
    }
    registerRoutes() {
        this.router.post('/', this.authWithFacebook);
    }
}
exports.AuthRouter = AuthRouter;
//# sourceMappingURL=AuthRouter.js.map