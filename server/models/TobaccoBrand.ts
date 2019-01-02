import { Schema, model, Document } from 'mongoose';

export class ITobaccoBrand {
    createdAt: Date
    name: string
    isPremium: boolean
    picture: String
    tobaccos: number[]

    constructor(
        data:{
            createdAt: Date
            name: string
            picture: String
            isPremium: boolean
            tobaccos: number[]
        }
        ){
            this.createdAt = data.createdAt;
            this.name = data.name;
            this.picture = data.picture;
            this.isPremium = data.isPremium
            this.tobaccos = data.tobaccos
        }
    }
    
    const TobaccoBrandSchema = new Schema({
        createdAt: {type: Date,default: Date.now},
        name: {type: String, required: true},
        isPremium: { type: Boolean, default: false, required:true},
        picture: String,
        tobaccos: [
            {type: Schema.Types.ObjectId, ref: 'Tobacco',
            required: false,
            unique: true}
        ]
    });
    
    TobaccoBrandSchema.methods.toJSON = function(){
        let obj = this.toObject();
        delete obj.createdAt;
        return obj;
    }
    
    export interface TobaccoBrandDocument extends ITobaccoBrand, Document {}
    
    export const TobaccoBrand = model<TobaccoBrandDocument>('TobaccoBrand', TobaccoBrandSchema);