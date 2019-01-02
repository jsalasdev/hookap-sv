import { Schema, model, Document } from 'mongoose';

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
    isPremium: boolean
    localSpace:number
    hasAirConditioner:boolean
    hasSoccer:boolean
    hasMusic:boolean
    
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
        isPremium: boolean
        localSpace:number
        hasAirConditioner:boolean
        hasSoccer:boolean
        hasMusic:boolean
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
        this.isPremium = data.isPremium;
        this.localSpace = data.localSpace;
        this.hasAirConditioner = data.hasAirConditioner;
        this.hasSoccer = data.hasSoccer;
        this.hasMusic = data.hasMusic;
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
    status: { type: String, default: 'PROCESSING', enum: validateLocalStatus },
    isPremium: { type: Boolean, default: false },
    localSpace: {type: Number},
    hasAirConditioner: { type: Boolean, default: false },
    hasSoccer: { type: Boolean, default: false },
    hasMusic: { type: Boolean, default: false },
});
LocalSchema.index({'location': '2dsphere'});

export interface LocalDocument extends ILocal, Document {}

export const Local = model<LocalDocument>('Local', LocalSchema);
