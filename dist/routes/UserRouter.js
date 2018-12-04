"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomRouter_1 = require("../models/CustomRouter");
const User_1 = __importDefault(require("../models/User"));
class UserRouter extends CustomRouter_1.CustomRouter {
    constructor() {
        super();
        this.getUserById = (req, res) => {
            let id = req.params.id;
            if (!id) {
                return res.status(400).json({
                    ok: false,
                    error: 'User id expected.'
                });
            }
            User_1.default.findById(id)
                .exec((err, user) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                if (!user) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'User not exists.'
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
        this.router.get('/:id', this.getUserById);
    }
}
exports.UserRouter = UserRouter;
//# sourceMappingURL=UserRouter.js.map