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
var User = /** @class */ (function (_super) {
    __extends(User, _super);
    function User() {
        var _this = _super.call(this) || this;
        _this.getUsers = function (req, res) {
            res.json({
                ok: true,
                clients: 'Its works'
            });
        };
        _this.registerRoutes();
        return _this;
    }
    User.prototype.registerRoutes = function () {
        this.router.get('/', this.getUsers);
    };
    return User;
}(CustomRouter_1.CustomRouter));
exports.User = User;
