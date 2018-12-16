import { Schema, model, Document } from 'mongoose';
import { Double } from 'mongodb';

export class ILocal {
    createdAt: Date
    name: string
    availableHookahs: number
    location :{
        description: String,
        type: {
            type: "String",
            required: true,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: [Number]
    }
    picture: string
    userOwner: number
    premiumTobaccoPrice: number
    tobaccoPrice: number
    tobaccos:number[]
    status:string
    
    constructor(data:{
        createdAt: Date
        name: string
        availableHookahs: number
        location :{
            description: String,
            type: {
                type: "String",
                required: true,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: [Number]
        }
        picture: string
        userOwner: number
        premiumTobaccoPrice: number
        tobaccoPrice: number
        tobaccos:number[]
        status:string
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
        this.status = data.status;
    }
}

const validateLocalStatus = {
    values: ['PROCESSING', 'ACCEPTED','DELETED'],
    message: '{VALUE} no es un estado válido'
};

const LocalSchema = new Schema({
    createdAt: {type: Date,default: Date.now},
    name: {type: String, required: true},
    availableHookahs: {type: Number,default: 0},
    picture: {type: String,required:false},
    location :{
        description: String,
        type: {
            type: "String",
            required: true,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: [Number]
    },
    userOwner: {
        type: Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    tobaccos: [
        {type: Schema.Types.ObjectId, ref: 'Tobacco',
        required: false}
    ],
    premiumTobaccoPrice: {type: Number},
    tobaccoPrice: {type: Number},
    status: { type: String, default: 'PROCESSING', enum: validateLocalStatus }
});
LocalSchema.index({'location': '2dsphere'});
LocalSchema.methods.toJSON = function(){
    let obj = this.toObject();
    delete obj.createdAt;
    return obj;
}

export interface LocalDocument extends ILocal, Document {}

export const Local = model<LocalDocument>('Local', LocalSchema);
