const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserCaptaincy = new Schema({
    name: {
        type : String,
        trim : true,
        required : [true, 'Le nom est requis']
    },
    email: {
        type : String,
        trim : true,
        required : [true, "L'email est requis"],
        unique : true,
        lowercase : true,
    },
    password: {
        type : String,
        trim : true,
        required : [true, "le mot de passe est requis"]
    }
}, {
    timestamps : true
}
);

/**
 * Middleware Mongoose qui s'exécute avant qu'un utilisateur ne soit enregistré dans la base de données.
 * Ce middleware est utilisé pour s'assurer que le mot de passe de l'utilisateur est toujours haché avant d'être enregistré.
 * 
 * @function preSave
 * @param {Function} next - Fonction callback pour passer au middleware suivant ou enregistrer l'utilisateur.
 */
UserCaptaincy.pre('save', async function(next) {
    /**
     * Vérifie si le champ `password` de l'utilisateur a été modifié.
     * Si le mot de passe n'a pas été modifié, la fonction appelle `next()` pour continuer sans hachage.
     */
    if (!this.isModified('password')) {
        return next();
    }

    /**
     * Si le mot de passe a été modifié, il est haché par bcrypt.
     * Le mot de passe haché remplace le mot de passe original dans le champ `password`.
     * 
     * @async
     * @returns {Promise<void>}
     */
    this.password = await bcrypt.hash(this.password, 10);

    // Après que le mot de passe soit haché, l'utilisateur est enregistré avec un mot de passe cypté dans la base de données.
    next();
});

/**
 * Méthode Mongoose qui permet de comparer le mot de passe donné avec le mot de passe haché stocké dans la base donnée.
 * 
 * @method comparePassword
 * @param {string} candidatePassword 
 * @returns {Promise<boolean>}
 */
UserCaptaincy.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('UserCaptaincy', UserCaptaincy);