const express = require('express');
const router = express.Router();
const UserCaptaincy = require('../services/userservice');
const { body, validationResult } = require('express-validator');
const private = require('../middlewares/private');

// Permet de récupérer tous les utilisateurs de la capitainerie.
router.get('/', async (req, res) => {
  try {
    const users = await UserCaptaincy.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error: error.message });
  }
});

// Permet de récupérer un utilisateur de la capitainerie en particulier.
router.get('/:id', private.checkJWT, UserCaptaincy.getById);

// Permet d'ajouter un utilisateur de la capitainerie dans la base de données.
router.post(
  '/',
  [
      body('name').notEmpty().withMessage('Le nom est requis'),
      body('email').isEmail().withMessage('L\'email doit être valide'),
      body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit comporter au moins 6 caractères'),
  ],
  async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }

      UserCaptaincy.add(req, res);
  }
);

// Permet de modifier les informations concernant un utilisateur de la capitainerie en particulier.
router.put('/:id', UserCaptaincy.updateUser);

// Suppression d'un utilisateur par son ID
router.delete('/:id', private.checkJWT, UserCaptaincy.deleteUserById);


module.exports = router;
