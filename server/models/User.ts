import { model, Schema } from 'mongoose';

let validateTypeProfile = {
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
    hookahCounter: [ {
        createdAt: { type: Date, default: Date.now }
    }]
});

UserSchema.methods.toJSON = function(){
let obj = this.toObject();
 delete obj.createdAt;
 return obj;
}

export default model('User', UserSchema);