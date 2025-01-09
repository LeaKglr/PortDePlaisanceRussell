/*
  Formulaire pour afficher les détails d'une réservation.
  Evènement qui est déclenché lorsque le DOM de la page est complètement chargé.
*/
document.addEventListener('DOMContentLoaded', async () => {
    // Récupération de l'élèment dans le DOM.
    const reservationDetailsDiv = document.getElementById('reservationDetails');
  
    // Récupérer les paramètres catwayId et idReservation dans l'URL
    const params = new URLSearchParams(window.location.search);
    const catwayId = params.get('catwayId');
    const reservationId = params.get('idReservation');

    // Vérification de la présence des paramètres.
    if (!catwayId || !reservationId) {
        // Affichage d'un message d'erreur.
        reservationDetailsDiv.innerHTML = `<p style="color: red;">Paramètres de réservation manquants dans l'URL.</p>`;
        return; // L'exécution de la fonction est interrompue.
    }

    const token = localStorage.getItem('token'); // Récupérer le token JWT

    try {
        // Appel à l'API.
        const response = await fetch(`http://localhost:3001/api/catways/${catwayId}/reservations/${reservationId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json', // Spécifie que les données envoyées sont au format JSON.
            Authorization: `Bearer ${token}`, // Inclut le token JWT pour authentifier l'utilisateur.
        },
        });

        // Vérification de la réponse de l'API.
        if (!response.ok) {
            // Si aucune réservation n'est trouvé ou que le token n'est pas bon, un message d'erreur s'affiche.
            throw new Error('Réservation non trouvée ou accès non autorisé.');
        }

        // Si la vérification est succès, les données JSON renvoyées par l'API sont récupérées.
        const reservation = await response.json();

        // Afficher les détails de la réservation dans le DOM.
        reservationDetailsDiv.innerHTML = `
        <p><strong>Catway Number:</strong> ${reservation.catwayNumber}</p>
        <p><strong>Client Name:</strong> ${reservation.clientName}</p>
        <p><strong>Boat Name:</strong> ${reservation.boatName}</p>
        <p><strong>Check-In:</strong> ${new Date(reservation.checkIn).toLocaleDateString()}</p>
        <p><strong>Check-Out:</strong> ${new Date(reservation.checkOut).toLocaleDateString()}</p>
        `;
    } catch (error) {
        // Si une erreur survient lors de la requête ou du traitement des données, un message d'erreur est affiché.
        reservationDetailsDiv.innerHTML = `<p style="color: red;">Erreur : ${error.message}</p>`;
    }

    // Bouton de retour vers le dashboard
    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.addEventListener('click', () => {
        window.location.href = 'dashboard.html'; // Redirige vers le dashboard
        });
    }
  });
  