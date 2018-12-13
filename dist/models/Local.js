"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
class ILocal {
    constructor(data) {
        this.createdAt = data.createdAt;
        this.name = data.name;
        this.availableHookahs = data.availableHookahs;
        this.picture = data.picture;
        this.userOwner = data.userOwner;
        this.location = data.location;
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
    picture: { type: String, required: false },
    location: {
        description: String,
        latLng: {
            lat: Number,
            lng: Number
        }
    },
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