"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./models/server"));
const server = server_1.default.instance;
server.start(() => {
    console.log(`Server corriendo en el puerto ${server.port}`);
});
//# sourceMappingURL=Index.js.map