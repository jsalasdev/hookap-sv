"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var CustomRouter = /** @class */ (function () {
    function CustomRouter() {
        var _this = this;
        /** Export internal router to be used as Express middleware */
        this.export = function () { return _this.router; };
        this.router = express_1.Router();
    }
    return CustomRouter;
}());
exports.CustomRouter = CustomRouter;
module.exports = {
    CustomRouter: CustomRouter
};
