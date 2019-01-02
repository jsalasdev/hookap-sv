import { Schema, model, Document } from 'mongoose';

export class ILocalFollow {
    
    createdAt: Date
    userId: number
    localId: number
    
    constructor(data: {
        createdAt: Date
        userId: number
        localId: number
    }){
        this.createdAt = data.createdAt;
        this.userId = data.userId;
        this.localId = data.localId;
    }

}

const LocalFollowSchema = new Schema({
    createdAt: {type: Date,default: Date.now},
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    localId: { type: Schema.Types.ObjectId, ref: 'Local', required: true }
});
LocalFollowSchema.index({ userId: 1, localId: 1},{ unique: true })
export interface LocalFollowDocument extends ILocalFollow, Document {}

export const LocalFollow = model<LocalFollowDocument>('LocalFollow', LocalFollowSchema);