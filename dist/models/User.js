"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
class IUser {
    constructor(data) {
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.provider = data.provider;
        this.providerId = data.providerId;
        this.firstLogin = data.firstLogin;
        this.userType = data.userType;
        this.createdAt = data.createdAt;
        this.state = data.state;
        this.picture = data.picture;
        this.hookahCounter = data.hookahCounter;
        this.favoriteLocals = data.favoriteLocals;
    }
}
exports.IUser = IUser;
const validateTypeProfile = {
    values: ['TYPE_SOCIAL', 'TYPE_OWNER'],
    message: '{VALUE} no es un rol válido'
};
const UserSchema = new mongoose_1.Schema({
    firstName: String,
    lastName: String,
    email: String,
    provider: String,
    providerId: { type: String, required: true, unique: true },
    firstLogin: { type: Boolean, default: true },
    userType: { type: String, default: 'TYPE_SOCIAL', enum: validateTypeProfile },
    createdAt: { type: Date, default: Date.now },
    state: { type: Boolean, default: true },
    picture: String,
    hookahCounter: { type: Number, default: 0 },
    //probablemente tengan que ser únicos
    favoriteLocals: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: 'Local',
            required: false,
            unique: true }
    ]
});
UserSchema.methods.toJSON = function () {
    let obj = this.toObject();
    delete obj.createdAt;
    return obj;
};
exports.User = mongoose_1.model('User', UserSchema);
//# sourceMappingURL=User.js.map