"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./models/server"));
const bodyParser = require("body-parser");
const cors = require("cors");
const server = server_1.default.instance;
//Parser 
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());
//Cors conf
server.app.use(cors({ origin: true, credentials: true }));
server.start(() => {
    console.log(`Server corriendo en el puerto ${server.port}`);
});
