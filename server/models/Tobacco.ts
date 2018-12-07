import { Schema, model, Document } from 'mongoose';

export class ITobacco {
    createdAt: Date
    name: string
    isPremium: boolean
    brand: number
    
    constructor( data:{
        createdAt: Date
        name: string
        isPremium: boolean
        brand: number
    }){
        this.name = data.name;
        this.createdAt = data.createdAt;
        this.isPremium = data.isPremium;
        this.brand = data.brand;
    }
}

const TobaccoSchema = new Schema({
    createdAt: {type: Date,default: Date.now},
    name: {type: String, required: true},
    isPremium: { type: Boolean, default: false, required:true},
    brand: { type: Schema.Types.ObjectId, ref: 'TobaccoBrand', required: true}
});

TobaccoSchema.methods.toJSON = function(){
    let obj = this.toObject();
    delete obj.createdAt;
    return obj;
}

// register each method at schema
// schema.method('foo', User.prototype.foo)

export interface TobaccoDocument extends ITobacco, Document {}

export const Tobacco = model<TobaccoDocument>('Tobacco', TobaccoSchema);