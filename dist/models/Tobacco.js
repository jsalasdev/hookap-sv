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
let TobaccoSchema = new Schema({
    createdAt: { type: Date, default: Date.now },
    name: { type: String, required: true },
    isPremium: { type: Boolean, default: false, required: true },
    brand: { type: Schema.Types.ObjectId, ref: 'TobaccoBrand', required: true }
});
module.exports = mongoose.model('Tobacco', TobaccoSchema);
