"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class CustomRouter {
    constructor() {
        /** Export internal router to be used as Express middleware */
        this.export = () => this.router;
        this.router = express_1.Router();
    }
}
exports.CustomRouter = CustomRouter;
module.exports = {
    CustomRouter
};
