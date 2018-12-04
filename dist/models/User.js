"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
let validateTypeProfile = {
    values: ['TYPE_SOCIAL', 'TYPE_OWNER'],
    message: '{VALUE} no es un rol válido'
};
const UserSchema = new mongoose_1.Schema({
    name: String,
    email: String,
    facebookProvider: String,
    firstLogin: { type: Boolean, default: true },
    userType: { type: String, default: 'TYPE_SOCIAL', enum: validateTypeProfile },
    createdAt: { type: Date, default: Date.now },
    state: { type: Boolean, default: true },
    imgProfile: String,
    hookahCounter: [{
            createdAt: { type: Date, default: Date.now }
        }]
});
UserSchema.methods.toJSON = function () {
    let obj = this.toObject();
    delete obj.idFacebook;
    delete obj.createdAt;
    return obj;
};
exports.default = mongoose_1.model('User', UserSchema);
//# sourceMappingURL=User.js.map