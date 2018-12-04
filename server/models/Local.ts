import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

let LocalSchema = new Schema({
    createdAt: {type: Date,default: Date.now},
    name: {type: String, required: true},
    availableHookahs: {type: Number,default: 0},
    postalCode: { type: String, required:false },
    lat: { type: Number, required:true},
    lng: { type: Number, required:true},
    country: {type: String,required:false},
    locality: {type: String,required:false},
    imgProfile: {type: String,required:false},
    user: {
        type: Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    tobaccos: [
        {type: Schema.Types.ObjectId, ref: 'Tobacco',
        required: false}
    ]
    //add tobbacos
});

module.exports = mongoose.model('Local',LocalSchema);