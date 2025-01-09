const Reservations = require('../models/reservation');
const Catway = require('../models/catway');

/**
 * # Ajoute une nouvelle réservation à un catway.
 *
 * @description
 * ## Vue d'ensemble
 * Cette fonction permet de créer une réservation associée à un catway spécifique en utilisant l'ID
 * du catway fourni dans les paramètres de l'URL. Les informations de la réservation sont passées
 * dans le corps de la requête. Si le catway existe, la réservation est ajoutée et renvoyée.
 *
 * 
 * @async
 * @function add
 * @param {Object} req - La requête HTTP.
 * @param {Object} req.params - Les paramètres de la requête.
 * @param {string} req.params.id - L'ID du catway pour lequel la réservation est créée.
 * @param {Object} req.body - Les informations de la réservation.
 * @param {string} req.body.clientName - Le nom du client.
 * @param {string} req.body.boatName - Le nom du bateau.
 * @param {string} req.body.checkIn - La date d'arrivée.
 * @param {string} req.body.checkOut - La date de départ.
 * @param {Object} res - La réponse HTTP.
 * @returns {Object} - Retourne l'objet de la réservation créée.
 * @throws {Error} - Si une erreur se produit lors de la création de la réservation.
 * 
 * 
 * ## Tutoriel
 * 1. Envoyer une requête POST à l'API avec l'ID du catway dans les paramètres de l'URL.
 * 2. Inclure les informations dans le corps de la requête :
 *    - `clientName`: Le nom du client.
 *    - `boatName`: Le nom du bateau.
 *    - `checkIn`: La date d'arrivée (format ISO 8601 recommandé).
 *    - `checkOut`: La date de départ (format ISO 8601 recommandé).
 *
 * @example
 * Exemple de requête avec cURL :
 * ```bash
 * POST http://localhost:3001/api/catways/60b8c89b5414c5195ca65d99/reservations
 * Content-Type: application/json
 *
 * {
 *   "clientName": "Jean Dupont",
 *   "boatName": "L'Hirondelle",
 *   "checkIn": "2025-01-15T10:00:00Z",
 *   "checkOut": "2025-01-20T10:00:00Z"
 * }
 * ```
 *
 * Exemple de réponse réussie :
 * ```json
 * {
 *   "_id": "60c8f89a5414c5195ca67d80",
 *   "catwayNumber": 123,
 *   "clientName": "Jean Dupont",
 *   "boatName": "L'Hirondelle",
 *   "checkIn": "2025-01-15T10:00:00Z",
 *   "checkOut": "2025-01-20T10:00:00Z"
 * }
 * ```
 *
 * Si le catway n'existe pas, une erreur 404 est renvoyée :
 * ```json
 * {
 *   "message": "Catway non trouvé."
 * }
 * ```
 *
 * ## Glossaire :
 * - Catway : petit appontement pour amarrer un bateau.
 * - catwyaNumber : numéro de pont.
 */
exports.add = async (req, res) => {
    const catwayId = req.params.id; // On récupère l'ID du catway depuis l'URL
    const { clientName, boatName, checkIn, checkOut } = req.body;
  
    try {
      // Vérifie si le catway existe
      const catway = await Catway.findById(catwayId);
      if (!catway) {
        return res.status(404).json({ message: 'Catway non trouvé.' });
      }
  
      // Crée une nouvelle réservation
      const newReservation = new Reservations({
        catwayNumber: catway.catwayNumber, // Associe la réservation au numéro du catway
        clientName,
        boatName,
        checkIn,
        checkOut
      });
  
      await newReservation.save();
      return res.status(201).json(newReservation);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur lors de la création de la réservation.', error });
    }
  };


/**
 * # Supprime une réservation spécifique associée à un catway.
 *
 * @description
 * ## Vue d'ensemble
 * Cette fonction permet de supprimer une réservation identifiée par son ID et associée
 * à un catway spécifique, également identifié par son ID. Si l'un des deux IDs est
 * invalide ou inexistant, une erreur est renvoyée.
 *
 * @async
 * @function delete
 * @param {Object} req - La requête HTTP.
 * @param {Object} req.params - Les paramètres de la requête.
 * @param {string} req.params.id - L'ID du catway.
 * @param {string} req.params.idReservation - L'ID de la réservation.
 * @param {Object} res - La réponse HTTP.
 * @returns {Object} - Retourne un message de succès ou une erreur.
 * @throws {Error} - Si une erreur se produit lors de la suppression.
 * 
 * ## Tutoriel
 * 1. Envoyer une requête DELETE à l'API avec les IDs du catway et de la réservation
 *    dans les paramètres de l'URL.
 *
 * @example
 * Exemple de requête avec cURL :
 * ```bash
 * DELETE http://localhost:3001/api/catways/60b8c89b5414c5195ca65d99/reservations/60b9c89b5414c5195ca67e01
 * ```
 *
 * Exemple de réponse réussie :
 * ```json
 * {
 *   "message": "Réservation supprimée avec succès."
 * }
 * ```
 *
 * Si le catway ou la réservation n'existe pas, une erreur 404 est renvoyée :
 * ```json
 * {
 *   "message": "Catway non trouvé."
 * }
 * ```
 * ou
 * ```json
 * {
 *   "message": "Réservation non trouvée."
 * }
 * ```
 *
 * ## Glossaire
 * - Catway : petit appontement pour amarrer un bateau.
 * - ID : identifiant unique utilisé pour récupérer un catway ou une réservation spécifique.
 *
 */
exports.delete = async (req, res ) => {
  const { id, idReservation } = req.params;

  if (!id || !idReservation) {
    return res.status(400).json({ message: 'Veuillez fournir les IDs du catway et de la réservation.' });
  }

  try {
    // Vérifie que le catway existe grâce à son ID présent dans la base de données.
    const catway = await Catway.findById(id);
    if (!catway) {
      return res.status(404).json({ message: 'Catway non trouvé.' });
    }

    // Vérifie que la réservation existe grâce à son ID présent dans la base de données.
    const reservation = await Reservations.findOne({_id: idReservation});

    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée.' });
    }

    // Suppression de la réservation
    await reservation.deleteOne();

    return res.status(200).json({ message: 'Réservation supprimée avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression :', error);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

/**
 * # Récupère une réservation spécifique associée à un catway.
 *
 * @description
 * ## Vue d'ensemble
 * Cette fonction permet de vérifier l'existence d'un catway puis de récupérer
 * une réservation associée, identifiée par son ID.
 *
 * 
 * @async
 * @function getReservationByCatwayAndId
 * @param {Object} req - La requête HTTP.
 * @param {Object} req.params - Les paramètres de la requête.
 * @param {string} req.params.id - L'ID du catway.
 * @param {string} req.params.idReservation - L'ID de la réservation.
 * @param {Object} res - La réponse HTTP.
 * @returns {Object} - Retourne la réservation trouvée.
 * @throws {Error} - Si une erreur se produit lors de la récupération.
 * 
 * 
 * ## Tutoriel
 * 1. Envoyer une requête GET à l'API avec les IDs du catway et de la réservation
 *    dans les paramètres de l'URL.
 *
 * @example
 * Exemple de requête avec cURL :
 * ```bash
 * curl -X GET http://localhost:3001/api/catways/60b8c89b5414c5195ca65d99/reservations/60b9c89b5414c5195ca67e01
 * ```
 *
 * Exemple de réponse réussie :
 * ```json
 * {
 *   "_id": "60b9c89b5414c5195ca67e01",
 *   "catwayNumber": 37,
 *   "clientName": "Benjamin Franklin",
 *   "boatName": "New England Courant",
 *   "checkIn": "2025-01-04T00:00:00.000Z", 
 *   "checkOut": "2025-02-04T00:00:00.000Z", 
 *   "__v": 0
 * }
 * ```
 *
 * Si le catway ou la réservation n'existe pas, une erreur 404 est renvoyée :
 * ```json
 * {
 *   "message": "Catway non trouvé."
 * }
 * ```
 * ou
 * ```json
 * {
 *   "message": "Réservation non trouvée."
 * }
 * ```
 *
 * ## Glossaire
 * - Catway : petit appontement pour amarrer un bateau.
 * - ID : identifiant unique utilisé pour récupérer un catway ou une réservation spécifique.
 */
exports.getReservationByCatwayAndId = async (req, res) => {
    const { id, idReservation } = req.params;

  try {
    // Récupère le catway pour vérifier qu'il existe
    const catway = await Catway.findById(id);
    if (!catway) {
      return res.status(404).json({ message: 'Catway non trouvé.' });
    }

    // Récupère la réservation associée
    const reservation = await Reservations.findById(idReservation);
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée.' });
    }

    // Retourne la réservation associée au catway.
    res.status(200).json(reservation);
  } catch (error) {
    console.error('Erreur lors de la récupération de la réservation :', error);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
  };


/**
 * # Récupère toutes les réservations.
 *
 * @description
 * ## Vue d'ensemble
 * Cette fonction permet de récupérer toutes les réservations stockées dans la base de données
 * et de les renvoyer sous forme de réponse JSON.
 *
 * 
 * @async
 * @function getAll
 * @param {Object} res - La réponse HTTP.
 * @returns {void}
 * @throws {Error} - Si une erreur survient lors de la récupération des données.
 * 
 * 
 * ## Tutoriel
 * 1. Envoyer une requête GET à l'API sans paramètres.
 *
 * @example
 * Exemple de requête avec cURL :
 * ```bash
 * curl -X GET http://localhost:3001/api/reservations
 * ```
 *
 * Exemple de réponse réussie :
 * ```json
 * [
 *   {
 *     "_id": new ObjectId('67797be13ff4c780b4b4b3fd'), 
 *     "catwayNumber": 35,
 *     "clientName": 'Martin Luther King', 
 *     "boatName": 'Tennessee', 
 *     "checkIn": 2025-01-06T00:00:00.000Z,
 *     "checkOut": 2025-02-06T00:00:00.000Z,
 *     __v: 0
 *   },
 *   {
 *     "_id": new ObjectId('67797b9b3ff4c780b4b4b3f8'), 
 *     "catwayNumber": 36,
 *     "clientName": 'Abraham Lincoln', 
 *     "boatName": 'USA', 
 *     "checkIn": 2025-01-05T00:00:00.000Z,
 *     "checkOut": 2025-02-05T00:00:00.000Z,
 *     __v: 0
 *   }
 * ]
 * ```
 *
 * Si une erreur survient, un message avec le code d'erreur est renvoyé :
 * ```json
 * {
 *   "message": "Erreur lors de la récupération des réservations",
 *   "error": "Détails de l'erreur..."
 * }
 * ```
 *
 * ## Glossaire
 * - checkIn : date d'entrée.
 * - checkOut : date de sortie.
 */
exports.getAll = async (req, res, next) => {
  try {
    const reservations = await Reservations.find(); // Récupère toutes les réservations
      
    // Affiche toutes les réservations de la base de données.
    res.status(200).json(reservations);
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des réservations', error });
  }
};
