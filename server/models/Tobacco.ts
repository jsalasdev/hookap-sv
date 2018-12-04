import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

let TobaccoSchema = new Schema({
    createdAt: {type: Date,default: Date.now},
    name: {type: String, required: true},
    isPremium: { type: Boolean, default: false, required:true},
    brand: { type: Schema.Types.ObjectId, ref: 'TobaccoBrand', required: true}
});

module.exports = mongoose.model('Tobacco', TobaccoSchema);