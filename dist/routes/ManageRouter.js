"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CustomRouter_1 = require("../models/CustomRouter");
const UserRouter_1 = require("./UserRouter");
const AuthRouter_1 = require("./AuthRouter");
class ManageRouter extends CustomRouter_1.CustomRouter {
    constructor() {
        super();
        this.userRoutes = new UserRouter_1.UserRouter().export();
        this.authRoutes = new AuthRouter_1.AuthRouter().export();
        this.registerRoutes();
    }
    registerRoutes() {
        this.router.use('/users', this.userRoutes);
        this.router.use('/login', this.authRoutes);
        this.router.get('/', function (_, res) {
            res.header('Content-Type', 'text/plain');
            res.json('The API is working, but not for you ): !');
        });
    }
}
exports.ManageRouter = ManageRouter;
//# sourceMappingURL=ManageRouter.js.map