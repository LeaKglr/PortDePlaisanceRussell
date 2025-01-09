const express = require('express');
const router = express.Router();
const serviceCatway = require('../services/catwayservice');
const private = require('../middlewares/private');

// Récupérer tous les catways
router.get('/', private.checkJWT, serviceCatway.findAll);

// Récupérer un catway grâce à son ID
router.get('/:id', private.checkJWT, serviceCatway.findCatwayById);

// Ajouter un nouveau catway
router.post('/', private.checkJWT, serviceCatway.addCatway);

// Mettre à jour un catway grâce à son ID
router.put('/:id', private.checkJWT, serviceCatway.updateCatwayState);
router.patch('/:id', private.checkJWT, serviceCatway.partialUpdate);

 // Supprimer un catway grâce à son ID
router.delete('/:id', private.checkJWT, serviceCatway.deleteCatwayById);

module.exports = router;