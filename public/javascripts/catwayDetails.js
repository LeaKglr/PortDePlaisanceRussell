/**
 * Formulaire pour afficher les détails d'un catway grâce à son ID.
 * Evènement qui est déclenché lorsque le DOM de la page est complètement chargé.
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Récupération du paramètre catwayId de l'URL
    const params = new URLSearchParams(window.location.search);
    const catwayId = params.get('catwayId'); 
  
    // Vérification de la présence du paramètre.
    if (!catwayId) {
      console.error('Aucun ID de catway trouvé dans l\'URL');
      return; // L'exécution de la fonction est interrompue si aucun catway n'a été trouvé.
    }
  
     // Récupération d'un élément dans le DOM.
    const catwayDetailsDiv = document.getElementById('catwayDetails');
    const token = localStorage.getItem('token'); // Récupère le token JWT.
  
    // Appel à l'API.
    try {
      const response = await fetch(`http://localhost:3001/api/catways/${catwayId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Inclut le token JWT pour authentifier l’utilisateur.
        },
      });
  
      // Vérifie si la réponse de l'API est correcte.
      if (!response.ok) {
        throw new Error('Catway non trouvé');
      }
  
       // Si le réponse est réussi : les données JSON renvoyées par l'API sont récupérées.
      const catway = await response.json();
  
      // Affichage des détails du catway dans le DOM.
      catwayDetailsDiv.innerHTML = `
        <p><strong>Catway ID :</strong> ${catway._id}</p>
        <p><strong>Numéro du catway :</strong> ${catway.catwayNumber}</p>
        <p><strong>Type :</strong> ${catway.type}</p>
        <p><strong>Description :</strong> ${catway.catwayState}</p>
      `;
    } catch (error) {
      // Si une erreur survient lors de la requête ou du traitement des données, un message d'erreur est affiché.
      catwayDetailsDiv.innerHTML = `<p style="color: red;">Erreur : ${error.message}</p>`;
    }

    // Gestionnaire d'événements pour le bouton "Retour"
    const backButton = document.getElementById('backButton');
  if (backButton) {
    backButton.addEventListener('click', () => {
      // Redirige vers le dashboard
      window.location.href = 'dashboard.html'; 
    });
  }
  });

/*
  Formulaire pour enregistrer une réservation.
  Evènement qui est déclenché lorsque le DOM de la page est complètement chargé.
*/
  document.addEventListener('DOMContentLoaded', () => {
    // Récupération des éléments du DOM.
    const reservationForm = document.getElementById('reservationForm');
    const reservationMessage = document.getElementById('reservationMessage');
  
    // Ajout d'un gestionnaire d'évènement qui s'exécute à la soumission du formulaire.
    reservationForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire.
  
      // Récupérer l'ID du catway depuis l'URL
      const urlParams = new URLSearchParams(window.location.search);
      const catwayId = urlParams.get('catwayId'); // Récupère le paramètre 'catwayId' dans l'URL
  
      // Vérification de la présence du paramètre.
      if (!catwayId) {
        // Affichage d'un message d'erreur si aucun ID n'a été trouvé.
        reservationMessage.textContent = 'Catway ID manquant.';
        reservationMessage.style.color = 'red';
        return; // L'exécution de la fonction est interrompue.
      }
  
      // Récupérer les valeurs du formulaire fournis par l'utilisateur.
      const catwayNumberReservation = document.getElementById('catwayNumberReservation').value;
      const clientName = document.getElementById('clientName').value;
      const boatName = document.getElementById('boatName').value;
      const checkIn = document.getElementById('checkIn').value;
      const checkOut = document.getElementById('checkOut').value;
  
      
      try {
        const token = localStorage.getItem('token'); // Récupérer le token JWT
        
        // Appel à l'API.
        const response = await fetch(`http://localhost:3001/api/catways/${catwayId}/reservations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // Spécifie que les données envoyées sont au format JSON.
            Authorization: `Bearer ${token}`, // Inclut le token JWT pour authentifier l’utilisateur.
          },
          body: JSON.stringify({ catwayNumberReservation, clientName, boatName, checkIn, checkOut }),
        });
  
        // Vérifie si le code statut est succès.
        if (response.ok) {
          // Affiche un message succès si c'est un code succès.
          reservationMessage.textContent = 'Réservation ajoutée avec succès!';
          reservationMessage.style.color = 'green';
        } else {
          // Récupère les détails de l’erreur en JSON depuis la réponse de l’API.
          const error = await response.json();
          // Affiche un message erreur. 
          reservationMessage.textContent = `Erreur : ${error.message}`;
          reservationMessage.style.color = 'red';
        }
      } catch (error) {
        reservationMessage.textContent = `Erreur : ${error.message}`;
        reservationMessage.style.color = 'red';
      }
    });
  });