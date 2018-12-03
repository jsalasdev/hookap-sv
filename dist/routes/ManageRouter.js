"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var CustomRouter_1 = require("../models/CustomRouter");
var user_1 = require("./user");
var ManageRouter = /** @class */ (function (_super) {
    __extends(ManageRouter, _super);
    function ManageRouter() {
        var _this = _super.call(this) || this;
        _this.userRoutes = new user_1.User().export();
        _this.registerRoutes();
        return _this;
    }
    ManageRouter.prototype.registerRoutes = function () {
        this.router.use('/users', this.userRoutes);
        this.router.get('/', function (_, res) {
            res.header('Content-Type', 'text/plain');
            res.json('The API is working!');
        });
    };
    return ManageRouter;
}(CustomRouter_1.CustomRouter));
exports.ManageRouter = ManageRouter;
