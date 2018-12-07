import { Schema, model, Document } from 'mongoose';

export class ITobaccoBrand {
    createdAt: Date
    name: string
    picture: String
    
    constructor(
        data:{
            createdAt: Date
            name: string
            picture: String
        }
        ){
            this.createdAt = data.createdAt;
            this.name = data.name;
            this.picture = data.picture;
        }
    }
    
    const TobaccoBrandSchema = new Schema({
        createdAt: {type: Date,default: Date.now},
        name: {type: String, required: true},
        picture: String
    });
    
    TobaccoBrandSchema.methods.toJSON = function(){
        let obj = this.toObject();
        delete obj.createdAt;
        return obj;
    }
    
    export interface TobaccoBrandDocument extends ITobaccoBrand, Document {}
    
    export const TobaccoBrand = model<TobaccoBrandDocument>('TobaccoBrand', TobaccoBrandSchema);