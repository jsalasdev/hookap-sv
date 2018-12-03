"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var Environment_1 = require("../config/Environment");
var ManageRouter_1 = require("../routes/ManageRouter");
var Server = /** @class */ (function () {
    function Server() {
        this.manageRouter = new ManageRouter_1.ManageRouter().export();
        this.app = express_1.default();
        this.port = Environment_1.SERVER_PORT;
        this.httpServer = new http_1.default.Server(this.app);
        this.routes();
    }
    Server.prototype.routes = function () {
        this.app.use('/api', this.manageRouter);
    };
    Object.defineProperty(Server, "instance", {
        get: function () {
            return this._instance || (this._instance = new this());
        },
        enumerable: true,
        configurable: true
    });
    Server.prototype.start = function (callback) {
        this.httpServer.listen(this.port, callback);
    };
    return Server;
}());
exports.default = Server;
