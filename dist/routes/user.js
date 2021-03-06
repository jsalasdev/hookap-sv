"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CustomRouter_1 = require("../models/CustomRouter");
const User_1 = require("../models/User");
class User extends CustomRouter_1.CustomRouter {
    constructor() {
        super();
        this.getUsers = (req, res) => {
            let user = new User_1.UserModel({
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
exports.User = User;
