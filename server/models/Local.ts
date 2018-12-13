import { Schema, model, Document } from 'mongoose';

export class ILocal {
    createdAt: Date
    name: string
    availableHookahs: number
    location :{
        description: string,
        latLng: {
            lat:number,
            lng:number
        }
    }
    picture: string
    userOwner: number
    premiumTobaccoPrice: number
    tobaccoPrice: number
    tobaccos:number[]
    
    constructor(data:{
        createdAt: Date
        name: string
        availableHookahs: number
        location :{
            description: string,
            latLng: {
                lat:number,
                lng:number
            }
        }
        picture: string
        userOwner: number
        premiumTobaccoPrice: number
        tobaccoPrice: number
        tobaccos:number[]
    }){
        this.createdAt = data.createdAt;
        this.name = data.name;
        this.availableHookahs = data.availableHookahs;
        this.picture = data.picture;
        this.userOwner = data.userOwner;
        this.location = data.location;
        this.premiumTobaccoPrice = data.premiumTobaccoPrice;
        this.tobaccoPrice = data.tobaccoPrice;
        this.tobaccos = data.tobaccos;
    }
}

const LocalSchema = new Schema({
    createdAt: {type: Date,default: Date.now},
    name: {type: String, required: true},
    availableHookahs: {type: Number,default: 0},
    picture: {type: String,required:false},
    location :{
        description: String,
        latLng: {
            lat: Number,
            lng:Number
        }
    },
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
