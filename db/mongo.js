require('dotenv').config(); // Charge le fichier .env

/**
 * Importation de la bibliothèque mongoose pour interagir avec MongoDB.
 * Mongoose simplifie les opérations de gestion de base de données en fournissant une API pour définir des modèles et interagir avec MongoDB.
*/
const mongoose = require('mongoose');

/**
 * Options de connexion à MongoDB, définissant des paramètres spécifiques pour la connexion à la base de données.
 * @type {Object}
 * @property {boolean} useNewUrlParser - Indique si le parseur d'URL de MongoDB doit utiliser le nouveau comportement.
 * @property {string} dbName - Nom de la base de données à utiliser dans MongoDB.
*/
const clientOptions = {
    useNewUrlParser : true,
    dbName : 'apinode'
}

/**
 * Fonction asynchrone pour initialiser la connexion à la base de données MongoDB.
 * Cette fonction utilise mongoose pour se connecter à la base de données MongoDB en utilisant une URL définie dans les variables d'environnement.
 * En cas de succès, un message de confirmation est affiché dans le terminal. En cas d'échec, l'erreur est capturée et affichée.
 *
 * @async
 * @function initClientDbConnection
 * @returns {Promise<void>} Une promesse qui se résout lorsque la connexion est réussie ou rejette une erreur en cas de problème.
 * @throws {Error} Si la connexion échoue, une erreur est levée avec le détail du problème.
*/

// On exporte la fonction initClientDbConnection pour pouvoir l'utiliser ailleurs dans l'application.
exports.initClientDbConnection = async () => {
    try {
        /*
         * Utilisation de mongoose pour pouvoir se connecter à la base de données MongoDB. L'URL de connexion est récupérée 
         * depuis la variable d'environnement qui est défini dans .env. Lorsque la connexion est réussie, on peut appercevoir 
         * "Connected" dans le terminal.
         */
        await mongoose.connect(process.env.URL_MONGO, clientOptions)
        console.log('Connected');
    } catch (error) {
        //  Si une erreur se produit lors de la connexion, l'erreur est capturée et affichée. 
        console.log(error);
        throw error;
    }
}

