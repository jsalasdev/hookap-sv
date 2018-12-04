import { model, Schema } from 'mongoose';

let validateTypeProfile = {
    values: ['TYPE_SOCIAL', 'TYPE_OWNER'],
    message: '{VALUE} no es un rol válido'
};

const UserSchema: Schema = new Schema({
    email: String ,
    idFacebook: Number,
    userType: { type: String, default: 'TYPE_SOCIAL', enum: validateTypeProfile },
    createdAt: { type: Date, default: Date.now },
    state: { type: Boolean, default: true },
    imgProfile: String,
    hookahCounter: [ {
        createdAt: { type: Date, default: Date.now }
    }]
});

UserSchema.methods.toJSON = function(){
let obj = this.toObject();
 delete obj.idFacebook;
 delete obj.createdAt;
 return obj;
}

export default model('User', UserSchema);