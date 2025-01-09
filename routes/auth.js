const express = require('express');
const router = express.Router();
const authController = require('../services/userservice');

// Permet une authentification de l'utilisateur.
router.post('/authenticate', authController.authenticate);
router.get('/me', authController.me); // Route pour récupérer l'utilisateur connecté


module.exports = router;
