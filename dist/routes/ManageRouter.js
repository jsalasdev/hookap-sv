"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CustomRouter_1 = require("../models/CustomRouter");
const UserRouter_1 = require("./UserRouter");
class ManageRouter extends CustomRouter_1.CustomRouter {
    constructor() {
        super();
        this.userRoutes = new UserRouter_1.UserRouter().export();
        this.registerRoutes();
    }
    registerRoutes() {
        this.router.use('/users', this.userRoutes);
        this.router.get('/', function (_, res) {
            res.header('Content-Type', 'text/plain');
            res.json('The API is working, but not for you ): !');
        });
    }
}
exports.ManageRouter = ManageRouter;
