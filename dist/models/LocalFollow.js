"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
class ILocalFollow {
    constructor(data) {
        this.createdAt = data.createdAt;
        this.userId = data.userId;
        this.localId = data.localId;
    }
}
exports.ILocalFollow = ILocalFollow;
const LocalFollowSchema = new mongoose_1.Schema({
    createdAt: { type: Date, default: Date.now },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    localId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Local', required: true }
});
LocalFollowSchema.index({ userId: 1, localId: 1 }, { unique: true });
exports.LocalFollow = mongoose_1.model('LocalFollow', LocalFollowSchema);
//# sourceMappingURL=LocalFollow.js.map