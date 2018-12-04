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
        this.getUsers = (req, res) => {
            let user = new User_1.default({
                email: 'dasdas'
            });
            res.json({
                ok: true,
                user
            });
        };
        this.registerRoutes();
    }
    registerRoutes() {
        this.router.get('/', this.getUsers);
    }
}
exports.UserRouter = UserRouter;
