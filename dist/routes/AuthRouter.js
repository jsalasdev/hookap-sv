"use strict";
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
class AuthRouter extends CustomRouter_1.CustomRouter {
    constructor() {
        super();
        this.authWithFacebook = (req, res) => {
            let body = req.body;
            if (body === undefined || (body.token === undefined || body.token === '')) {
                return res.status(400).json({
                    ok: false,
                    error: 'Incorrect access token'
                });
            }
            else {
                let accessToken = body.token;
                const URL = Environment_1.FACEBOOK_ENDPOINT_VERIFY + accessToken;
                axios.default.get(URL)
                    .then(res => {
                    console.log(res);
                    //continue user manage....
                })
                    .catch(err => {
                    res.status(500).json({
                        ok: false,
                        error: 'Server error'
                    });
                });
            }
        };
        this.registerRoutes();
    }
    registerRoutes() {
        // this.router.get('/', this.authWithFacebook);
        this.router.post('/', this.authWithFacebook);
    }
}
exports.AuthRouter = AuthRouter;
//# sourceMappingURL=AuthRouter.js.map