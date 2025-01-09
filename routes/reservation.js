const express = require('express');
const Reservation = require('../services/reservationservice');
const router = express.Router();
const private = require('../middlewares/private');

// Récupère toutes les réservations
router.get('/reservations', private.checkJWT, Reservation.getAll);

// Permet d'ajouter une réservation
router.post('/:id/reservations', private.checkJWT, Reservation.add);

// Permet de récupère une réservation via un catway
router.get('/:id/reservations/:idReservation', private.checkJWT, Reservation.getReservationByCatwayAndId);

// Permet de supprimer une réservation.
router.delete('/:id/reservations/:idReservation', private.checkJWT, Reservation.delete)

module.exports = router;