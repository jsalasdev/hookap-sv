"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const Environment_1 = require("../config/Environment");
const ManageRouter_1 = require("../routes/ManageRouter");
const mongoose_1 = __importDefault(require("mongoose"));
class Server {
    constructor() {
        this.manageRouter = new ManageRouter_1.ManageRouter().export();
        this.app = express_1.default();
        this.port = Environment_1.SERVER_PORT;
        this.httpServer = new http_1.default.Server(this.app);
        this.routes();
        this.configureMongo();
    }
    configureMongo() {
        mongoose_1.default.connect(Environment_1.URL_DATABASE, { useNewUrlParser: true }, (err) => {
            if (err)
                throw err;
            console.log('Base de datos conectada.');
        });
    }
    routes() {
        this.app.use('/api', this.manageRouter);
    }
    static get instance() {
        return this._instance || (this._instance = new this());
    }
    start(callback) {
        this.httpServer.listen(this.port, callback);
    }
}
exports.default = Server;
