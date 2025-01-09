const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Reservations = new Schema({
    catwayNumber: {
        type : Number,
    },
    clientName: {
        type : String,
        trim : true, 
        required : [true, 'Le nom du client est requis'],
    },
    boatName: {
        type : String,
        trim : true,
        required : [true, 'Le nom du bateau amarré est requis'],
    },
    checkIn : {
        type : Date,
        required : [true, "Une date de début de réservation est requise."],
    },
    checkOut : {
        type : Date,
        required : [true, "Une date de fin de réservation est requise."],
        validate: {
            validator: function(value) {
              // Vérifie que la date de fin est postérieure à la date de début
              return this.checkIn < value;
            },
            message: 'La date de fin doit être postérieure à la date de début.'
          }
    },
});

module.exports = mongoose.model('Reservation', Reservations);