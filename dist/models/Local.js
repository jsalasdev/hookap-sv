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
        this.status = data.status;
        this.isPremium = data.isPremium;
        this.localSpace = data.localSpace;
        this.hasAirConditioner = data.hasAirConditioner;
        this.hasSoccer = data.hasSoccer;
        this.hasMusic = data.hasMusic;
    }
}
exports.ILocal = ILocal;
const validateLocalStatus = {
    values: ['PROCESSING', 'ACCEPTED', 'DELETED'],
    message: '{VALUE} no es un estado válido'
};
const LocalSchema = new mongoose_1.Schema({
    createdAt: { type: Date, default: Date.now },
    name: { type: String, required: true },
    availableHookahs: { type: Number, default: 0 },
    picture: { type: String, required: false },
    location: {
        description: String,
        type: {
            type: "String",
            required: true,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: [Number]
    },
    userOwner: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    tobaccos: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: 'Tobacco',
            required: false }
    ],
    premiumTobaccoPrice: { type: Number },
    tobaccoPrice: { type: Number },
    status: { type: String, default: 'PROCESSING', enum: validateLocalStatus },
    isPremium: { type: Boolean, default: false },
    localSpace: { type: Number },
    hasAirConditioner: { type: Boolean, default: false },
    hasSoccer: { type: Boolean, default: false },
    hasMusic: { type: Boolean, default: false },
});
LocalSchema.index({ 'location': '2dsphere' });
exports.Local = mongoose_1.model('Local', LocalSchema);
//# sourceMappingURL=Local.js.map