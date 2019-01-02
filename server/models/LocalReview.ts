import { Schema, model, Document } from 'mongoose';

export class ILocalReview {
    
    createdAt: Date
    userId: number
    localId: number
    rating:number
    
    constructor(data: {
        createdAt: Date
        userId: number
        localId: number
        rating:number
        
    }){
        this.createdAt = data.createdAt;
        this.userId = data.userId;
        this.localId = data.localId;
        this.rating = data.rating;
    }
}

const LocalReviewSchema = new Schema({
    createdAt: {type: Date,default: Date.now},
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    localId: { type: Schema.Types.ObjectId, ref: 'Local', required: true },
    rating: { type: Number, required: true}
});
LocalReviewSchema.index({ userId: 1, localId: 1},{ unique: true })
export interface LocalReviewDocument extends ILocalReview, Document {}

export const LocalReview = model<LocalReviewDocument>('LocalReview', LocalReviewSchema);