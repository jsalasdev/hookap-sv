"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = __importStar(require("mongoose"));
const Schema = mongoose.Schema;
let TobaccoBrandSchema = new Schema({
    createdAt: { type: Date, default: Date.now },
    name: { type: String, required: true },
});
module.exports = mongoose.model('TobaccoBrand', TobaccoBrandSchema);
//# sourceMappingURL=TobaccoBrand.js.map