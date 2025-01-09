const jwt = require('jsonwebtoken'); // Module qui permet de créer et de vérifier des JWT.
const SECRET_KEY = process.env.JWT_SECRET || 'GTGh6rdP54GT76'; // Clé secrète pour signer et vérifier le JWT. 
const dotenv = require('dotenv');

dotenv.config();

/**
 * Middleware pour vérifier et renouveler le token JWT dans les requêtes HTTP.
 * Ce middleware protège l'accès aux routes en s'assurant qu'un token valide est présent dans l'en-tête.
 * Si le token est valide, il ajoute un nouveau token dans l'en-tête de la réponse.
 * Si le token est invalide ou manquant, une erreur est renvoyée avec un code d'état approprié.
 *
 * @async
 * @function checkJWT
 * @param {Object} req - L'objet de la requête HTTP.
 * @param {Object} res - L'objet de la réponse HTTP.
 * @param {Function} next - La fonction de rappel pour passer à l'étape suivante de la chaîne de middlewares.
 * @returns {void}
*/

exports.checkJWT = async (req, res, next) => {

  // Recherche du token dans l'en-tête de la requête.
  let token = req.headers['x-access-token'] || req.headers['authorization'];
  
  // Si un token est trouvé et qu'il commence par "Bearer", cette condition enlève le préfixe Bearer pour extraire que le token.
  if (!!token && token.startsWith('Bearer')) {
    token = token.slice(7, token.lenght);
  }

  /* 
    Si le token est présent, la fonction vérifie si le token est valide en utilisant la clé secrète.
    */
  if (token) {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if(err) {
        // Si le token est invalide, renvoie une erreur 401.
        return res.status(401).json('token_not_valid');
      } else {
        // Si le token est valide, ajoute les informations décodées à la requête.
        req.decoded = decoded;

        // Calcul de la durée de validité du nouveau token (24 heures).
        const expiresIn = 24 * 60 * 60;
        // Génère un nouveau token avec les mêmes informations utilisateur.
        const newToken = jwt.sign({
          user : decoded.user
        },
        SECRET_KEY,
        { 
          // Un nouveau token est généré toutes les 24h.
          expiresIn: expiresIn 
        });

        // Le nouveau token est ajouté dans l'en-tête de la réponse HTTP
        res.header('Authorization', 'Bearer' + newToken);

        // Si tout se passe bien, la fonction appelle next(), ce qui permet à la requête de passer à la prochaine étape.
        next();
      }
    })
  } else {
    // Si le token n'est pas trouvé dans les en-têtes de la requête : un status 401 (Unauthorized) est renvoyé avec le message "token_required".
    return res.status(401).json('token_required');
  }
}
