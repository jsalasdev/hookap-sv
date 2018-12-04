import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

let TobaccoBrandSchema = new Schema({
    createdAt: {type: Date,default: Date.now},
    name: {type: String, required: true},
});

module.exports = mongoose.model('TobaccoBrand', TobaccoBrandSchema);