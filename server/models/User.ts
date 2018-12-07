import { Schema, model, Document } from 'mongoose';

export class IUser {
    firstName: string
    lastName: string
    email: string
    provider: string
    providerId: string
    firstLogin: string
    userType: string
    createdAt: Date
    state:boolean
    picture: string
    hookahCounter: number
    favoriteLocals:number[]

    constructor(data: {
        firstName: string
        lastName: string
        email: string
        provider: string
        providerId: string
        firstLogin: string
        userType: string
        createdAt: Date
        state:boolean
        picture: string
        hookahCounter: number
        favoriteLocals:number[]
    }){
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.provider = data.provider;
        this.providerId = data.providerId;
        this.firstLogin = data.firstLogin;
        this.userType = data.userType;
        this.createdAt = data.createdAt;
        this.state = data.state;
        this.picture= data.picture;
        this.hookahCounter = data.hookahCounter;
        this.favoriteLocals = data.favoriteLocals;
    }

    // foo(): string {
    //     return this.name.uppercase() // whatever
    //  }

}

const validateTypeProfile = {
    values: ['TYPE_SOCIAL', 'TYPE_OWNER'],
    message: '{VALUE} no es un rol válido'
};

const UserSchema: Schema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    provider: String,
    providerId: { type: String, required:true, unique: true },
    firstLogin: { type: Boolean, default: true},
    userType: { type: String, default: 'TYPE_SOCIAL', enum: validateTypeProfile },
    createdAt: { type: Date, default: Date.now },
    state: { type: Boolean, default: true },
    picture: String,
    hookahCounter: { type: Number, default: 0},
    //probablemente tengan que ser únicos
    favoriteLocals: [
        {type: Schema.Types.ObjectId, ref: 'Local',
        required: false}
    ]
});

UserSchema.methods.toJSON = function(){
    let obj = this.toObject();
    delete obj.createdAt;
    return obj;
}

// register each method at schema
// schema.method('foo', User.prototype.foo)

export interface UserDocument extends IUser, Document {}

export const User = model<UserDocument>('User', UserSchema);