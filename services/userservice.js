const UserCaptaincy = require('../models/usercaptaincy');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'GTGh6rdP54GT76';
const mongoose = require('mongoose');
require('dotenv').config();

/**
 * # Récupère tous les utilisateurs avec les champs "name" et "email".
 *
 * @description
 * ## Vue d'ensemble
 * Cette fonction interroge la liste `UserCaptaincy` pour récupérer tous les utilisateurs enregistrés dans la base de données,
 * en sélectionnant uniquement les champs "name" et "email".
 *
 * 
 * @async
 * @function getAllUsers
 * @returns {Promise<Object[]>} - Une promesse qui se résout avec un tableau d'objets représentant les utilisateurs.
 * Chaque objet contient les champs `_id`, `name` et `email`.
 * @throws {Error} - Si une erreur survient lors de la récupération des utilisateurs.
 * 
 * 
 * ## Tutoriel
 * 1. S'assurer que la liste `UserCaptaincy` contient des données valides.
 * 2. Appeler cette fonction dans le service pour obtenir une liste d'utilisateurs de la capitainerie.
 *
 * @example
 * ## Exemple :
 * ```javascript
 * const { getAllUsers } = require('./path/to/your/service');
 *
 * async function afficherLaListeUtilisateurs() {
 *   try {
 *     const utilisateurs = await getAllUsers();
 *     console.log('Liste des utilisateurs :', utilisateurs);
 *   } catch (error) {
 *     console.error('Erreur lors de la récupération des utilisateurs :', error);
 *   }
 * }
 *
 * afficherLaListeUtilisateurs();
 * ```
 *
 * Exemple de sortie :
 * ```json
 * [
 *   { "_id": "60b8c89b5414c5195ca65d97", "name": "Alice", "email": "alice@example.com" },
 *   { "_id": "60b8c89b5414c5195ca65d98", "name": "Bob", "email": "bob@example.com" }
 * ]
 * ```
 *
 * Si une erreur survient, un message d'erreur apparaît :
 * ```text
 * Erreur lors de la récupération des utilisateurs : <message d'erreur>
 * ```
 * 
 * ## Glossaire 
 * - UserCaptaincy : utilisateur de la capitainerie.
 * - getAllUsers : liste des utilisateurs de la capitainerie.
 */
exports.getAllUsers = async () => {
    try {
      // Interroge la base de données pour récupérer tous les utilisateurs de la capitainerie avec les champs "name" et "email"
      return await UserCaptaincy.find({}, 'name email');
    } catch (error) {
      // Affiche une erreur si la récupération échoue.
      throw new Error('Erreur lors de la récupération des utilisateurs : ' + error.message);
    }
  };

/**
 * # Récupère un utilisateur spécifique à partir de son ID.
 *
 * @description
 * ## Vue d'ensemble
 * Cette fonction permet de rechercher un utilisateur dans la liste `UserCaptaincy` 
 * en fonction de son identifiant unique. Elle vérifie d'abord si l'ID fourni est valide 
 * avant de procéder à la recherche.
 *
 * 
 * @async
 * @function getById
 * @param {Object} req - L'objet de requête Express.
 * @param {Object} req.params - Les paramètres de la requête.
 * @param {Object} res - L'objet de réponse Express.
 * @returns {Promise<void>} - Retourne la réponse HTTP avec l'utilisateur trouvé ou un message d'erreur.
 * @throws {Error} - Si une erreur serveur survient lors de la récupération.
 * 
 * 
 * ## Tutoriel
 * 1. S'assurer que l'ID de l'utilisateur est valide et correspond à un ObjectId MongoDB.
 * 2. Appeler cette fonction avec un objet `req` contenant l'ID dans `req.params`.
 * 3. Les réponses possibles incluent :
 *    - Code 200 : L'utilisateur est retourné.
 *    - Code 400 : L'ID fourni est invalide.
 *    - Code 404 : Aucun utilisateur correspondant n'a été trouvé.
 *    - Code 500 : Une erreur interne du serveur s'est produite.
 *
 * @example
 * Exemple d'utilisation avec un routeur Express :
 * ```javascript
 * const UserCaptaincy = require('./path/to/your/service');
 *
 * router.get('/user/:id', UserCaptaincy.getById);
 * ```
 *
 * Exemple de réponse réussie (HTTP 200) :
 * ```json
 * {
 *   "_id": "60b8c89b5414c5195ca65d97",
 *   "name": "Alice",
 *   "email": "alice@example.com"
 * }
 * ```
 *
 * Exemple d'erreur (HTTP 400) :
 * ```json
 * { "message": "ID invalide." }
 * ```
 *
 * ## Glossaire 
 * id : Identifiant unique utilisé pour rechercher un utilisateur de la capitainerie dans la base de données.
 * UserCaptaincy : utilisateur de la capitainerie.
 */
exports.getById = async (req, res, next) => {
    const { id } = req.params;

    // Vérifie si l'ID est un ObjectId MongoDB qui est valide
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID invalide.' });
    }

    try {
        // Recherche l'utilisateur par son ID.
        const user = await UserCaptaincy.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        // Retourne l'utilisateur trouvé.
        return res.status(200).json(user);
    } catch (error) {
        // Affiche un message si il y a une erreur serveur.
        return res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur', error: error.message });
    }
};

/**
 * # Ajoute un nouvel utilisateur à la liste `UserCaptaincy`.
 *
 * @description
 * ## Vue d'ensemble 
 * Cette fonction prend les informations d'un utilisateur de la capitainerie (nom, email, mot de passe) 
 * et les enregistre dans la base de données MongoDB. Elle vérifie que tous les champs 
 * requis sont fournis avant de procéder à l'enregistrement.
 *
 * 
 * @async
 * @function add
 * @param {Object} req - L'objet de requête Express.
 * @param {Object} req.body - Le corps de la requête contenant les données de l'utilisateur.
 * @param {string} req.body.name - Le nom de l'utilisateur.
 * @param {string} req.body.email - L'email de l'utilisateur.
 * @param {string} req.body.password - Le mot de passe de l'utilisateur.
 * @param {Object} res - L'objet de réponse Express.
 * @returns {Promise<void>} - Retourne la réponse HTTP avec l'utilisateur créé ou un message d'erreur.
 * @throws {Error} - Si une erreur serveur survient lors de l'ajout.
 * 
 * 
 * ## Tutoriel
 * 1. S'assurer que le client envoie les valeurs suivantes :
 *    - `name` : Le nom de l'utilisateur de la capitainerie.
 *    - `email` : L'email de l'utilisateur de la capitainerie.
 *    - `password` : Le mot de passe de l'utilisateur de la capitainerie.
 * 2. Appeler cette fonction via une route Express qui accepte une requête POST.
 * 3. Les réponses possibles de la requête :
 *    - Code 201 : L'utilisateur a été créé avec succès.
 *    - Code 400 : Un ou plusieurs champs sont manquants.
 *    - Code 500 : Une erreur interne du serveur s'est produite.
 *
 * @example
 * Exemple d'utilisation avec un routeur Express :
 * ```javascript
 * const UserCaptaincy = require('./path/to/your/service');
 *
 * router.post('/user', UserCaptaincy.add);
 * ```
 *
 * Exemple de requête réussie (HTTP 201) :
 * ```json
 * {
 *   "name": "Alice",
 *   "email": "alice@example.com",
 *   "password": "hashedpassword123",
 *   "_id": "60b8c89b5414c5195ca65d97",
 *   "createdAt": "2025-01-09T15:59:14.626Z",
 *   "updatedAt": "2025-01-09T15:59:14.626Z",
 *   "__v": 0
 * }
 * ```
 *
 * Exemple d'erreur (HTTP 400) :
 * ```json
 * { "message": "Tous les champs (name, email, password) sont requis." }
 * ```
 *
 * ## Glossaire
 * - UserCaptaincy : utilisateur de la capitainerie
 * - JSON : Format de données utilisé pour transmettre les informations de l'utilisateur.
 * 
 */
exports.add = async (req, res, next) => {
    const { name, email, password } = req.body;

    // Vérifie que tous les champs sont fournis.
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Tous les champs (name, email, password) sont requis.' });
    }

    try {
        // Création d'un nouvel utilisateur de la capitainerie.
        const userCaptaincy = new UserCaptaincy({
            name,
            email,
            password,
        });

        // Sauvegarde l'utilisateur de la capitainerie dans la base de données.
        await userCaptaincy.save();
        // Retourne l'utilisateur créé.
        return res.status(201).json(userCaptaincy);
    } catch (error) {
        // Affiche un message si il y a une erreur serveur.
        return res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'utilisateur', error: error.message });
    }
};

/**
 * # Met à jour les informations d'un utilisateur existant dans la collection `UserCaptaincy`.
 *
 * @description
 * ## Vue d'ensemble
 * Cette fonction permet de modifier les champs `name` et `email` d'un utilisateur de la capitainerie
 * par son `id`. Si l'utilisateur n'existe pas, une réponse avec un code HTTP 404 est renvoyée.
 *
 * @async
 * @function updateUser
 * @param {Object} req - L'objet de requête Express.
 * @param {Object} req.params - Les paramètres de la requête.
 * @param {string} req.params.id - L'identifiant unique de l'utilisateur à mettre à jour.
 * @param {Object} req.body - Le corps de la requête contenant les données à mettre à jour.
 * @param {string} [req.body.name] - Le nouveau nom de l'utilisateur.
 * @param {string} [req.body.email] - Le nouvel email de l'utilisateur.
 * @param {Object} res - L'objet de réponse Express.
 * @returns {Promise<void>} - Retourne la réponse HTTP avec l'utilisateur mis à jour ou un message d'erreur.
 * @throws {Error} - Si une erreur serveur survient lors de la mise à jour.
 * 
 * ## Tutoriel
 * 1. S'assurer que le client envoie un objet JSON contenant les champs à mettre à jour :
 *    - `name` : Le nouveau nom de l'utilisateur (optionnel).
 *    - `email` : Le nouvel email de l'utilisateur (optionnel).
 * 2. Appeler cette fonction via une route Express qui accepte une requête PUT ou PATCH.
 * 3. Les réponses possibles de la requête :
 *    - Code 200 : L'utilisateur a été mis à jour avec succès.
 *    - Code 404 : L'utilisateur n'a pas été trouvé.
 *    - Code 500 : Une erreur interne du serveur s'est produite.
 *
 * @example
 * Exemple d'utilisation avec un routeur Express :
 * ```javascript
 * const UserCaptaincy = require('./path/to/your/service');
 *
 * router.put('/user/:id', UserCaptaincy.updateUser);
 * ```
 *
 * Exemple de requête réussie (HTTP 200) :
 * ```json
 * {
 *   "_id": "60b8c89b5414c5195ca65d97",
 *   "name": "Alice Updated",
 *   "email": "alice.updated@example.com",
 *   "password": "hashedpassword123",
 *   "createdAt": "2024-12-29T14:31:17.341Z",
 *   "updatedAt": "2025-01-09T16:05:47.477Z",
 *   "__v": 0
 * }
 * ```
 *
 * Exemple d'erreur (HTTP 404) :
 * ```json
 * { "message": "Utilisateur non trouvé" }
 * ```
 *
 * ## Glossaire
 * - UserCaptaincy : Modèle Mongoose représentant un utilisateur dans l'application.
 * - JSON: Format de données utilisé pour transmettre les informations de l'utilisateur de la capitainerie.
 * - findByIdAndUpdate : Méthode Mongoose pour rechercher par un ID et mettre à jour.
 *
 */
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    // Mise à jour de l'utilisateur avec les nouvelles données.
    const updatedUser = await UserCaptaincy.findByIdAndUpdate(
      id,
      { name, email },
      { new: true } // Retourne l'utilisateur mis à jour
    );

    // Si l'utilisateur n'est pas trouvé, affichage d'un message.
    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Réponse avec l'utilisateur mis à jour.
    res.status(200).json(updatedUser);
  } catch (error) {
    // Affiche un message si il y a une erreur serveur.
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur", error: error.message });
  }
};

/**
 * # Supprime un utilisateur en fonction de son ID.
 *
 * @description
 * ## Vue d'ensemble
 * Cette fonction permet de rechercher un utilisateur dans la liste `UserCaptaincy` 
 * et de le supprimer si celui-ci existe. Une réponse est renvoyée en cas de succès ou d'erreur.
 *
 * 
 * @async
 * @function deleteUserById
 * @param {Object} req - L'objet de requête Express.
 * @param {Object} req.params - Les paramètres de la requête.
 * @param {string} req.params.id - L'identifiant unique de l'utilisateur à supprimer.
 * @param {Object} res - L'objet de réponse Express.
 * @returns {Promise<void>} - Retourne la réponse HTTP avec un message de succès ou une erreur.
 * @throws {Error} - Si une erreur serveur survient lors de la suppression.
 * 
 * 
 * ## Tutoriel
 * 1. S'assurer que le client envoie une requête DELETE avec un paramètre d'URL contenant l'ID de l'utilisateur.
 * 2. Appeler cette fonction dans une route Express :
 *    - Si l'utilisateur existe, il sera supprimé et un message de confirmation sera renvoyé.
 *    - Si l'utilisateur n'est pas trouvé, une réponse avec un code 404 sera renvoyée.
 *    - En cas d'erreur serveur, un code 500 sera retourné avec le détail de l'erreur.
 *
 * @example
 * Exemple d'utilisation avec Express :
 * ```javascript
 * const UserCaptaincy = require('./path/to/your/service');
 *
 * router.delete('/user/:id', UserCaptaincy.deleteUserById);
 * ```
 *
 * Exemple de requête réussie (HTTP 200) :
 * ```json
 * {
 *   "message": "Utilisateur supprimé avec succès.",
 *   "name": "John Doe"
 * }
 * ```
 *
 * Exemple d'erreur (HTTP 404) :
 * ```json
 * { "message": "Utilisateur non trouvé." }
 * ```
 *
 * Exemple d'erreur serveur (HTTP 500) :
 * ```json
 * { "message": "Erreur lors de la suppression de l'utilisateur.", "error": "Détails de l'erreur" }
 * ```
 *
 * ## Glossaire
 * - UserCaptaincy : Modèle Mongoose représentant un utilisateur de la capitainerie dans la base de données.
 * - findById : Méthode Mongoose pour rechercher par un ID.
 * - findByIdAndDelete : Méthode Mongoose pour supprimer en fonction d'un ID.
 */
exports.deleteUserById = async (req, res) => {
  try {
    const userId = req.params.id;  // Récupère l'ID de l'utilisateur à supprimer.
    const userToDelete = await UserCaptaincy.findById(userId); // Recherche l'utilisateur dans la base de données.
    
    if (!userToDelete) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Suppression de l'utilisateur de la capitainerie.
    const deletedUser = await UserCaptaincy.findByIdAndDelete(userId); // Supprimer l'utilisateur

    // Réponse positive 
    res.status(200).json({ message: "Utilisateur supprimé avec succès.", name: deletedUser.name });
  } catch (err) {
    // Affiche un message si il y a une erreur.
    res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur.", error: err.message });
  }
};

/**
 * # Authentifie un utilisateur avec son email et son mot de passe.
 *
 * @description
 * ## Vue d'ensemble
 * Cette fonction vérifie que l'email et le mot de passe envoyés par l'utilisateur de la capitainerie correspondent
 * aux informations d'un utilisateur existant dans la base de données. Si l'authentification est réussie,
 * un token JWT est généré et renvoyé dans la réponse. Si l'authentification échoue, un message d'erreur est renvoyé.
 *
 * 
 * @async
 * @function authenticate
 * @param {Object} req - L'objet de requête Express.
 * @param {Object} req.body - Le corps de la requête contenant les informations d'authentification.
 * @param {string} req.body.email - L'email de l'utilisateur.
 * @param {string} req.body.password - Le mot de passe de l'utilisateur.
 * @param {Object} res - L'objet de réponse Express.
 * @returns {Promise<void>} - Retourne une réponse HTTP avec un message d'authentification réussie ou une erreur.
 * @throws {Error} - Si une erreur serveur survient lors de l'authentification.
 * 
 * 
 * ## Tutoriel
 * 1. S'assurer que l'utilisateur envoie une requête POST (par exemple `/authenticate`).
 * 2. Les champs `email` et `password` doivent être inclus dans le corps de la requête.
 * 3. Si l'utilisateur est trouvé et que le mot de passe est correct, un token JWT sera généré et renvoyé.
 * 4. Le token doit être envoyé dans les futures requêtes pour accéder aux routes protégées.
 *
 * @example
 * Exemple d'utilisation avec Express :
 * ```javascript
 * const authController = require('./path/to/your/service');
 *
 * router.post('/login', authController.authenticate);
 * ```
 *
 * Exemple de requête réussie (HTTP 200) :
 * ```json
 * {
 *   "message": "Authentification réussie",
 *   "token": "jwt_token_here"
 * }
 * ```
 *
 * Exemple d'erreur (HTTP 400) si les champs sont manquants :
 * ```json
 * {
 *   "message": "Tous les champs sont requis."
 * }
 * ```
 *
 * Exemple d'erreur (HTTP 404) si l'utilisateur n'est pas trouvé :
 * ```json
 * {
 *   "message": "user_not_found"
 * }
 * ```
 *
 * Exemple d'erreur (HTTP 403) si le mot de passe est incorrect :
 * ```json
 * {
 *   "message": "wrong_credentials"
 * }
 * ```
 *
 * Exemple d'erreur serveur (HTTP 501) :
 * ```json
 * {
 *   "message": "Détails de l'erreur"
 * }
 * ```
 *
 * ## Glossaire
 * - UserCaptaincy : Modèle Mongoose représentant un utilisateur de la capitainerie dans la base de données.
 * - bcrypt.compare : Méthode de bcrypt pour comparer un mot de passe en clair avec un mot de passe hashé.
 * - JWT (JSON Web Token) : Un token signé permettant de vérifier l'identité d'un utilisateur lors de requêtes futures.
 * - SECRET_KEY : Clé secrète utilisée pour signer le JWT.
 */
exports.authenticate = async (req, res, next) => {
  const {email, password} = req.body;

  // Vérifie que les champs sont tous fournis.
  if (!email || !password) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
}

  try {
    // Recherche de l'utilisateur dans la base de données.
    const user = await UserCaptaincy.findOne({ email }, '-__v -createdAt -updatedAt');

        // Vérifie si l'utilisateur existe
        if (!user) {
            return res.status(404).json({ message: 'user_not_found' });
        }

        // Vérifie si le mot de passe est correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        // Si le mot de passe est incorrect, renvoie une erreur
        if (!isPasswordCorrect) {
            return res.status(403).json({ message: 'wrong_credentials' });
        }

        // Génère le token JWT
        const expiresIn = 24 * 60 * 60;
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            SECRET_KEY|| 'default_secret',
            { expiresIn: expiresIn }
        );

        // Renvoie le token dans l'en-tête Authorization et dans la réponse
        res.header('Authorization', 'Bearer' + token)

        return res.status(200).json({
            message: 'Authentification réussie',
            token: token,
        });
  } catch(error) {
    // Affiche un message si il y a une erreur serveur.
    return res.status(501).json(error);
  }
};

/**
 * # Récupère les informations de l'utilisateur actuellement authentifié à partir du token JWT.
 *
 * @description
 * ## Vue d'ensemble
 * Cette fonction permet à l'utilisateur d'obtenir ses propres informations en utilisant un token JWT dans l'en-tête `Authorization`.
 * Le token est décodé pour récupérer l'ID de l'utilisateur et ses informations sont retournées. Si le token est invalide ou expiré, 
 * une erreur est renvoyée.
 *
 * 
 * @async
 * @function me
 * @param {Object} req - L'objet de requête Express.
 * @param {Object} req.headers - Les en-têtes HTTP de la requête.
 * @param {string} req.headers.authorization - Le token JWT dans le format `Bearer <token>`.
 * @param {Object} res - L'objet de réponse Express.
 * @returns {Promise<void>} - Retourne les informations de l'utilisateur ou une erreur en cas d'échec.
 * @throws {Error} - Si le token est invalide ou expiré, une erreur de session est levée.
 * 
 * 
 * ## Tutoriel
 * 1. L'utilisateur doit envoyer une requête GET `/me` avec le token JWT dans l'en-tête `Authorization` sous la forme `Bearer <token>`.
 * 2. La fonction vérifie que le token est valide et récupère l'utilisateur correspondant à l'ID contenu dans le token.
 * 3. Si l'utilisateur est trouvé, ses informations (à l'exception du mot de passe) sont retournées.
 * 4. Si le token est invalide ou expiré, une erreur est renvoyée.
 *
 * @example
 * Exemple d'utilisation avec Express :
 * ```javascript
 * const authController = require('./path/to/your/service');
 *
 * router.get('/me', authController.me);
 * ```
 *
 * Exemple de requête réussie (HTTP 200) :
 * ```json
 * {
 *   "_id": "user_id",
 *   "name": "John Doe",
 *   "email": "john.doe@example.com"
 * }
 * ```
 *
 * Exemple d'erreur (HTTP 404) si l'utilisateur n'est pas trouvé :
 * ```json
 * {
 *   "message": "Utilisateur non trouvé"
 * }
 * ```
 *
 * Exemple d'erreur (HTTP 401) si le token est invalide ou expiré :
 * ```json
 * {
 *   "message": "Session invalide ou expirée"
 * }
 * ```
 *
 * ## Glossaire
 * - UserCaptaincy : Modèle Mongoose représentant un utilisateur dans la base de données.
 * - JWT (JSON Web Token) : Token signé utilisé pour authentifier un utilisateur. Il contient des informations sur l'utilisateur (ex. `userId`) et peut être utilisé pour vérifier l'identité de l'utilisateur lors de chaque requête.
 * - SECRET_KEY : Clé secrète utilisée pour vérifier la validité du JWT.
 * - authorization header : En-tête HTTP utilisé pour transmettre le token JWT dans les requêtes sécurisées.
 */
exports.me = async (req, res) => {
    // Récupère le token JWT depuis l'en-tête Authorization
    const token = req.headers.authorization.split(' ')[1];
  
    try {
      // Vérifie la validité du token en le décodant avec la clé secrète.
      const decoded = jwt.verify(token, SECRET_KEY);
       // Recherche l'utilisateur de la capitainerie dans la base de données en utilisant l'ID du token sans le mot de passe..
      const user = await UserCaptaincy.findById(decoded.userId, '-password');
      if (!user) {
        // Si l'utilisateur n'est pas trouvé, renvoie une erreur 404
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      // Si la requête est une succès, renvoie les informations de l'utilisateur (sans le mot de passe)
      res.status(200).json(user);
    } catch (error) {
      // Si le token est invalide ou expiré, renvoie une erreur 401
      res.status(401).json({ message: 'Session invalide ou expirée' });
    }
  };
