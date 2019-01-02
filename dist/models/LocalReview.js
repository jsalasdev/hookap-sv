"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
class ILocalReview {
    constructor(data) {
        this.createdAt = data.createdAt;
        this.userId = data.userId;
        this.localId = data.localId;
        this.rating = data.rating;
    }
}
exports.ILocalReview = ILocalReview;
const LocalReviewSchema = new mongoose_1.Schema({
    createdAt: { type: Date, default: Date.now },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    localId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Local', required: true },
    rating: { type: Number, required: true }
});
LocalReviewSchema.index({ userId: 1, localId: 1 }, { unique: true });
exports.LocalReview = mongoose_1.model('LocalReview', LocalReviewSchema);
//# sourceMappingURL=LocalReview.js.map