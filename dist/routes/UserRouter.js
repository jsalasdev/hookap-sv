"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomRouter_1 = require("../models/CustomRouter");
const User_1 = __importDefault(require("../models/User"));
const Authentication_1 = require("../middlewares/Authentication");
class UserRouter extends CustomRouter_1.CustomRouter {
    constructor() {
        super();
        this.addHookahCounter = (req, res) => {
            let user = req.user;
            if (user !== undefined) {
                let hookahCounter = user.hookahCounter;
                let newCount = Date.now();
                if (hookahCounter.length > 0) {
                    let aux = hookahCounter[hookahCounter.length - 1];
                    console.log(Date.now() - aux.createdAt);
                    //30min de diferencia entre fumadas
                }
                User_1.default.findById(user._id, (err, user) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            error: {
                                message: 'SERVER ERROR.'
                            }
                        });
                    }
                    else {
                        user.hookahCounter.push(newCount);
                        user.save;
                    }
                });
            }
            res.status(200).json({
                ok: true,
                error: {
                    message: 'testing'
                }
            });
        };
        this.getUserById = (req, res) => {
            let id = req.params.id;
            if (!id) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'User id expected.'
                    }
                });
            }
            User_1.default.findById(id)
                .exec((err, user) => {
                if (err || !user) {
                    return res.status(400).json({
                        ok: false,
                        error: {
                            message: 'User not found.'
                        }
                    });
                }
                res.json({
                    ok: true,
                    user
                });
            });
        };
        this.registerRoutes();
    }
    registerRoutes() {
        this.router.get('/:id', Authentication_1.verifyJwt, this.getUserById);
        this.router.post('/hookah/counter', Authentication_1.verifyJwt, this.addHookahCounter);
    }
}
exports.UserRouter = UserRouter;
//# sourceMappingURL=UserRouter.js.map