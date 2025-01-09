const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Catway = new Schema({
    catwayNumber: {
        type : Number,
        required : [true, 'Le numéro du catway est requis.'],
        unique : true,
    },
    type: {
        type : String,
        enum: ['long', 'short'],
        required : [true, 'Le type est requis.']
    },
    catwayState: {
        type : String,
        trim : true,
        required : [true, 'L\'était du catway est requis.']
    }
});

module.exports = mongoose.model('Catway', Catway);