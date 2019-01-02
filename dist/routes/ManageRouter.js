"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CustomRouter_1 = require("../models/CustomRouter");
const UserRouter_1 = require("./UserRouter");
const AuthRouter_1 = require("./AuthRouter");
const LocalRouter_1 = require("./LocalRouter");
const TobaccoRouter_1 = require("./TobaccoRouter");
class ManageRouter extends CustomRouter_1.CustomRouter {
    constructor() {
        super();
        this.userRoutes = new UserRouter_1.UserRouter().export();
        this.authRoutes = new AuthRouter_1.AuthRouter().export();
        this.localRoutes = new LocalRouter_1.LocalRouter().export();
        this.tobaccoRoutes = new TobaccoRouter_1.TobaccoRouter().export();
        this.registerRoutes();
    }
    registerRoutes() {
        this.router.use('/locals', this.localRoutes);
        this.router.use('/tobaccos', this.tobaccoRoutes);
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