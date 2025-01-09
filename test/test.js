const assert = require('assert');
const { add } = require('../services/reservationservice');
const { delete: deleteReservation, getReservationByCatwayAndId, getAll } = require('../services/reservationservice');
const Catway = require('../models/catway');
const { addCatway, findCatwayById, findAll, updateCatwayState, deleteCatwayById } = require('../services/catwayservice');
const Reservations = require('../models/reservation');

// test d'ajout d'une réservation
describe('add reservation', () => {
    it('devrait créer une nouvelle réservation avec succès', async () => {
      const fakeCatway = { catwayNumber: '12345', _id: 'abc123' };
      const fakeReservation = {
        catwayNumber: fakeCatway.catwayNumber,
        clientName: 'John Doe',
        boatName: 'Sea Breeze',
        checkIn: '2025-01-10',
        checkOut: '2025-01-15'
      };
  
      // Simuler la méthode `findById` pour trouver un catway
      const findByIdOriginal = Catway.findById;
      Catway.findById = async (id) => {
        if (id === 'abc123') return fakeCatway;
        return null;
      };
  
      // Simuler la méthode `save` pour la réservation
      const saveOriginal = Reservations.prototype.save;
      Reservations.prototype.save = async function() {
        return {
          _id: '677c044a81a60bb61556840a', 
          boatName: 'Sea Breeze',
          catwayNumber: '12345',
          checkIn: new Date('2025-01-10'), 
          checkOut: new Date('2025-01-15'), 
          clientName: 'John Doe'
        };
      };
  
      const req = {
        params: { id: 'abc123' },
        body: fakeReservation
      };
  
      const res = {
        statusCode: null,
        data: null,
        status(code) {
          this.statusCode = code;
          return this;
        },
        json(data) {
          this.data = data;
        }
      };
  
      // Appeler la fonction à tester
      await add(req, res);
  
      // Comparer les résultats
      assert.strictEqual(res.statusCode, 201);
  
      // Extraire les données pertinentes de la réponse
      const responseData = {
        ...res.data._doc,  // Extraire _doc qui contient les données réelles
        checkIn: res.data.checkIn.toISOString().split('T')[0],  // Convertir la date en format string
        checkOut: res.data.checkOut.toISOString().split('T')[0], // Convertir la date en format string
        _id: res.data._id.toString()  // Convertir ObjectId en string
      };
  
      // Données attendues avec l'ID sous forme de chaîne et les dates en format string
      const expectedData = {
        ...fakeReservation,
        _id: undefined, // Ignorez l'ID pour la comparaison
      };
  
      // Comparer les données retournées avec les données attendues, en ignorant _id
      const { _id, ...expectedWithoutId } = expectedData;
      const { _id: responseId, ...responseWithoutId } = responseData;
  
      assert.deepEqual(responseWithoutId, expectedWithoutId);
  
      // Restaurer les méthodes originales
      Catway.findById = findByIdOriginal;
      Reservations.prototype.save = saveOriginal;
    });
  });

// test de suppression d'une réservation 
describe('delete reservation', () => {

    it('devrait supprimer la réservation avec succès', async () => {
      const fakeCatway = { _id: 'abc123', catwayNumber: '12345' };
      const fakeReservation = { _id: 'xyz456', deleteOne: async () => {} };
  
      // Simuler que le catway existe
      const findByIdOriginal = Catway.findById;
      Catway.findById = async (id) => id === 'abc123' ? fakeCatway : null;
  
      // Simuler que la réservation existe
      const findOneOriginal = Reservations.findOne;
      Reservations.findOne = async (query) => query._id === 'xyz456' ? fakeReservation : null;
  
      // Simuler la requête HTTP
      const req = {
        params: { id: 'abc123', idReservation: 'xyz456' }
      };
  
      const res = {
        statusCode: null,
        data: null,
        status(code) {
          this.statusCode = code;
          return this;
        },
        json(data) {
          this.data = data;
        }
      };
  
      // Appeler la fonction à tester
      await deleteReservation(req, res);
  
      // Vérifier les résultats
      assert.strictEqual(res.statusCode, 200);
      assert.deepStrictEqual(res.data, { message: 'Réservation supprimée avec succès.' });
  
      // Restaurer les méthodes originales
      Catway.findById = findByIdOriginal;
      Reservations.findOne = findOneOriginal;
    });
  });

// test d'affichage des détails d'une réservation
describe('getReservationByCatwayAndId', () => {

    it('devrait retourner la réservation avec succès si elle est trouvée', async () => {
      const fakeCatway = { _id: 'abc123', catwayNumber: '12345' };
      const fakeReservation = { _id: 'xyz456', clientName: 'John Doe', boatName: 'Boat 1' };
  
      // Simuler la méthode `findById` de Catway pour retourner un catway trouvé
      const findByIdOriginalCatway = Catway.findById;
      Catway.findById = async () => fakeCatway; // Catway trouvé
  
      // Simuler la méthode `findById` de Reservations pour retourner une réservation trouvée
      const findByIdOriginalReservation = Reservations.findById;
      Reservations.findById = async () => fakeReservation; // Réservation trouvée
  
      // Simuler une requête HTTP
      const req = {
        params: { id: 'abc123', idReservation: 'xyz456' }
      };
  
      const res = {
        statusCode: null,
        data: null,
        status(code) {
          this.statusCode = code;
          return this;
        },
        json(data) {
          this.data = data;
        }
      };
  
      // Appeler la fonction à tester
      await getReservationByCatwayAndId(req, res);
  
      // Vérifier les résultats
      assert.strictEqual(res.statusCode, 200);
      assert.deepStrictEqual(res.data, fakeReservation);
  
      // Restaurer les méthodes originales
      Catway.findById = findByIdOriginalCatway;
      Reservations.findById = findByIdOriginalReservation;
    });
  });

// test liste de l'ensemble des réservation 
describe('getAll', () => {
    it('devrait retourner toutes les réservations avec succès', async () => {
      // Simuler des réservations
      const fakeReservations = [
        { _id: 'abc123', clientName: 'John Doe', boatName: 'Boat 1', checkIn: '2025-01-01', checkOut: '2025-01-05' },
        { _id: 'def456', clientName: 'Jane Doe', boatName: 'Boat 2', checkIn: '2025-02-01', checkOut: '2025-02-05' }
      ];
  
      // Simuler la méthode `find` pour retourner des réservations
      const findOriginal = Reservations.find;
      Reservations.find = async () => fakeReservations; // Simuler une réponse de la base de données
  
      // Simuler une requête HTTP
      const req = {};
  
      const res = {
        statusCode: null,
        data: null,
        status(code) {
          this.statusCode = code;
          return this;
        },
        json(data) {
          this.data = data;
        }
      };
  
      // Appeler la fonction à tester
      await getAll(req, res);
  
      // Vérifier les résultats
      assert.strictEqual(res.statusCode, 200);
      assert.deepStrictEqual(res.data, fakeReservations);
  
      // Restaurer la méthode originale
      Reservations.find = findOriginal;
    });
  });

// test de création d'un catway
describe('addCatway', () => {
    it('devrait ajouter un catway avec succès', async () => {
      const fakeCatway = {
        catwayNumber: '123',
        catwayState: 'Disponible',
        type: 'Type A',
      };
  
      // Simuler la méthode save de Catway en utilisant une version simplifiée
      const saveStub = async function() {
        return {
          _id: 'abc123',
          catwayNumber: fakeCatway.catwayNumber,
          catwayState: fakeCatway.catwayState,
          type: fakeCatway.type,
        };
      };

      Catway.prototype.save = saveStub;
  
      const req = {
        body: fakeCatway,
      };
  
      const res = {
        statusCode: null,
        data: null,
        status(code) {
          this.statusCode = code;
          return this;
        },
        json(data) {
          this.data = data;
        },
      };
  
      // Appeler la fonction addCatway
      await addCatway(req, res);
  
      // Vérifier que le statut de la réponse est 201 (création réussie)
      assert.strictEqual(res.statusCode, 201);
  
      // Accéder à l'objet retourné sans les métadonnées Mongoose internes
      const responseData = {
        ...res.data.catway._doc,  // Extraire _doc qui contient les données réelles
        _id: res.data.catway._id.toString(),  // Convertir l'ObjectId en chaîne
      };
  
      const expectedData = {
        _id: 'abc123',  // ID attendu
        catwayNumber: '123',
        catwayState: 'Disponible',
        type: 'Type A',
      };
  
      const { _id, ...expectedWithoutId } = expectedData;
      const { _id: responseId, ...responseWithoutId } = responseData;
  
      // Comparer les données retournées avec les données attendues
      assert.deepEqual(responseWithoutId, expectedWithoutId);
  
      // Restaurer la méthode save originale après le test
      delete Catway.prototype.save;
    });
  });

// test liste de l'ensemble des catways
describe('findAll', () => {

    it('devrait récupérer tous les catways avec succès', async () => {
      const fakeCatways = [
        { _id: 'abc123', catwayNumber: '1', catwayState: 'Disponible', type: 'Type A' },
        { _id: 'def456', catwayNumber: '2', catwayState: 'Occupé', type: 'Type B' }
      ];
  
      // Simuler la méthode find de Catway
      const originalFind = Catway.find; // Sauvegarder la méthode d'origine
      Catway.find = async () => fakeCatways; // Remplacer temporairement la méthode find
  
      // Appeler la fonction à tester
      const result = await findAll();
  
      // Vérifier les résultats
      assert.deepStrictEqual(result, fakeCatways);
  
      // Restaurer la méthode originale
      Catway.find = originalFind;
    });
  });
  
// test de récupération des détails d'un catway 
describe('findCatwayById', () => {
    it('devrait retourner un catway trouvé avec succès', async () => {
      // Simuler un catway trouvé
      const fakeCatway = { _id: '123', name: 'Catway1' };
  
      // Simuler la méthode `findById` pour retourner un catway trouvé
      const findByIdOriginal = Catway.findById;
      Catway.findById = async (id) => {
        if (id === '123') return fakeCatway;
        return null;
      };
  
      // Simuler une requête HTTP
      const req = {
        params: { id: '123' },
      };
  
      const res = {
        statusCode: null,
        data: null,
        status(code) {
          this.statusCode = code;
          return this;
        },
        json(data) {
          this.data = data;
        }
      };
  
      // Appeler la fonction à tester
      await findCatwayById(req, res);
  
      // Vérifier les résultats
      assert.strictEqual(res.statusCode, 200);
      assert.deepStrictEqual(res.data, fakeCatway);
  
      // Restaurer la méthode originale
      Catway.findById = findByIdOriginal;
    });
  });

// test de modification de la description de l'état d'un catway
describe('updateCatwayState', () => {
    it('devrait mettre à jour un catway avec succès', async () => {
      // Simuler un catway avant la mise à jour
      const fakeCatway = { _id: '123', catwayState: 'active' };
  
      // Simuler la méthode `findByIdAndUpdate` pour retourner un catway mis à jour
      const findByIdAndUpdateOriginal = Catway.findByIdAndUpdate;
      Catway.findByIdAndUpdate = async (id, updateData) => {
        if (id === '123') {
          return { ...fakeCatway, ...updateData }; // Retourner le catway mis à jour
        }
        return null;
      };
  
      // Simuler une requête HTTP
      const req = {
        params: { id: '123' },
        body: { catwayState: 'inactive' }, // L'état mis à jour
      };
  
      const res = {
        statusCode: null,
        data: null,
        status(code) {
          this.statusCode = code;
          return this;
        },
        json(data) {
          this.data = data;
        }
      };
  
      // Appeler la fonction à tester
      await updateCatwayState(req, res);
  
      // Vérifier les résultats
      assert.strictEqual(res.statusCode, 200);
      assert.deepStrictEqual(res.data, {
        message: "Catway mis à jour avec succès.",
        catway: { _id: '123', catwayState: 'inactive' },
      });
  
      // Restaurer la méthode originale
      Catway.findByIdAndUpdate = findByIdAndUpdateOriginal;
    });
  });

// test de suppression d'un catway
describe('deleteCatwayById', () => {
    it('devrait supprimer un catway avec succès', async () => {
      // Simuler un catway trouvé
      const fakeCatway = { _id: '123', catwayState: 'active' };
  
      // Simuler la méthode `findById` pour retourner un catway trouvé
      const findByIdOriginal = Catway.findById;
      Catway.findById = async (id) => {
        if (id === '123') return fakeCatway;
        return null;
      };
  
      // Simuler la méthode `findOneAndDelete` pour supprimer un catway
      const findOneAndDeleteOriginal = Catway.findOneAndDelete;
      Catway.findOneAndDelete = async (query) => {
        if (query._id === '123') return fakeCatway; // Retourner le catway supprimé
        return null;
      };
  
      // Simuler une requête HTTP
      const req = {
        params: { id: '123' }, // Paramètre `id` dans l'URL
      };
  
      const res = {
        statusCode: null,
        data: null,
        status(code) {
          this.statusCode = code;
          return this;
        },
        json(data) {
          this.data = data;
        }
      };
  
      // Appeler la fonction à tester
      await deleteCatwayById(req, res);
  
      // Vérifier les résultats
      assert.strictEqual(res.statusCode, 200);
      assert.deepStrictEqual(res.data, { message: "Catway supprimé avec succès." });
  
      // Restaurer les méthodes originales
      Catway.findById = findByIdOriginal;
      Catway.findOneAndDelete = findOneAndDeleteOriginal;
    });
  });