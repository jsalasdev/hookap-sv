import { Schema, model, Document } from 'mongoose';

export class ILocal {
    createdAt: Date
    name: string
    availableHookahs: number
    postalCode: number
    lat: number
    lng: number
    country: string
    locality: string
    imgProfile: string
    userOwner: number
    premiumTobaccoPrice: number
    tobaccoPrice: number
    tobaccos:number[]
    
    constructor(data:{
        createdAt: Date
        name: string
        availableHookahs: number
        postalCode: number
        lat: number
        lng: number
        country: string
        locality: string
        imgProfile: string
        userOwner: number
        premiumTobaccoPrice: number
        tobaccoPrice: number
        tobaccos:number[]
    }){
        this.createdAt = data.createdAt;
        this.name = data.name;
        this.availableHookahs = data.availableHookahs;
        this.postalCode = data.postalCode;
        this.lat = data.lat;
        this.lng = data.lng;
        this.country = data.country;
        this.locality = data.locality;
        this.imgProfile = data.imgProfile;
        this.userOwner = data.userOwner;
        this.premiumTobaccoPrice = data.premiumTobaccoPrice;
        this.tobaccoPrice = data.tobaccoPrice;
        this.tobaccos = data.tobaccos;
    }
}

const LocalSchema = new Schema({
    createdAt: {type: Date,default: Date.now},
    name: {type: String, required: true},
    availableHookahs: {type: Number,default: 0},
    postalCode: { type: String, required:false },
    lat: { type: Number, required:true},
    lng: { type: Number, required:true},
    country: {type: String,required:false},
    locality: {type: String,required:false},
    imgProfile: {type: String,required:false},
    userOwner: {
        type: Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    tobaccos: [
        {type: Schema.Types.ObjectId, ref: 'Tobacco',
        required: false}
    ]
});

LocalSchema.methods.toJSON = function(){
    let obj = this.toObject();
    delete obj.createdAt;
    return obj;
}

export interface LocalDocument extends ILocal, Document {}

export const Local = model<LocalDocument>('Local', LocalSchema);
