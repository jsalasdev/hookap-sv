"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
class ITobaccoBrand {
    constructor(data) {
        this.createdAt = data.createdAt;
        this.name = data.name;
        this.picture = data.picture;
        this.isPremium = data.isPremium;
        this.tobaccos = data.tobaccos;
    }
}
exports.ITobaccoBrand = ITobaccoBrand;
const TobaccoBrandSchema = new mongoose_1.Schema({
    createdAt: { type: Date, default: Date.now },
    name: { type: String, required: true },
    isPremium: { type: Boolean, default: false, required: true },
    picture: String,
    tobaccos: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: 'Tobacco',
            required: false,
            unique: true }
    ]
});
TobaccoBrandSchema.methods.toJSON = function () {
    let obj = this.toObject();
    delete obj.createdAt;
    return obj;
};
exports.TobaccoBrand = mongoose_1.model('TobaccoBrand', TobaccoBrandSchema);
//# sourceMappingURL=TobaccoBrand.js.map