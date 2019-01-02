"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
class ITobacco {
    constructor(data) {
        this.name = data.name;
        this.createdAt = data.createdAt;
        this.brand = data.brand;
    }
}
exports.ITobacco = ITobacco;
const TobaccoSchema = new mongoose_1.Schema({
    createdAt: { type: Date, default: Date.now },
    name: { type: String, required: true },
    brand: { type: mongoose_1.Schema.Types.ObjectId, ref: 'TobaccoBrand', required: true }
});
TobaccoSchema.methods.toJSON = function () {
    let obj = this.toObject();
    delete obj.createdAt;
    return obj;
};
exports.Tobacco = mongoose_1.model('Tobacco', TobaccoSchema);
//# sourceMappingURL=Tobacco.js.map