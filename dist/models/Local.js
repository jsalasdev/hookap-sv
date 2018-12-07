"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
class ILocal {
    constructor(data) {
        this.createdAt = data.createdAt;
        this.name = data.name;
        this.availableHookahs = data.availableHookahs;
        this.postalCode = data.postalCode;
        this.lat = data.lat;
        this.lng = data.lng;
        this.country = data.country;
        this.locality = data.locality;
        this.imgProfile = data.imgProfile;
        this.userOwner = data.userOwner;
        this.premiumTobaccoPrice = data.premiumTobaccoPrice;
        this.tobaccoPrice = data.tobaccoPrice;
        this.tobaccos = data.tobaccos;
    }
}
exports.ILocal = ILocal;
const LocalSchema = new mongoose_1.Schema({
    createdAt: { type: Date, default: Date.now },
    name: { type: String, required: true },
    availableHookahs: { type: Number, default: 0 },
    postalCode: { type: String, required: false },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    country: { type: String, required: false },
    locality: { type: String, required: false },
    imgProfile: { type: String, required: false },
    userOwner: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    tobaccos: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: 'Tobacco',
            required: false }
    ]
});
LocalSchema.methods.toJSON = function () {
    let obj = this.toObject();
    delete obj.createdAt;
    return obj;
};
exports.Local = mongoose_1.model('Local', LocalSchema);
//# sourceMappingURL=Local.js.map