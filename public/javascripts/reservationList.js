/* 
    Formulaire pour afficher la liste des réservations.
    Evènement qui est déclenché lorsque le DOM de la page est complètement chargé.
*/
document.addEventListener('DOMContentLoaded', async () => {
  // Récupération de l'élément du DOM.
    const reservationsListDiv = document.getElementById('reservationsList');
    
    const token = localStorage.getItem('token'); // Récupérer le token JWT
  
    // Si le token est manquant ou mauvais, un message d'erreur s'affiche. 
    if (!token) {
        alert('Token non trouvé, veuillez vous reconnecter.');
        return; // Empêche la requête si le token est manquant.
      }

    try {
      // Appel à l'API.
      const response = await fetch('http://localhost:3001/api/catways/reservations', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,  // Inclut le token JWT pour authentifier l'utilisateur.
          'Content-Type': 'application/json', // Spécifie que les données envoyées sont au format JSON.
        },
      });
      
      // Si une erreur survient, un message d'erreur s'affiche.
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des réservations');
      }

      // Récupération des réservations en JSON.
      const reservations = await response.json();
  
      // Si aucune réservations n'est enregistré dans la base de données, un message s'affichera.
      if (reservations.length === 0) {
        reservationsListDiv.innerHTML = '<p>Aucune réservation trouvée.</p>';
        return;
      }
  
      // Afficher les réservations dans un tableau
      const table = `
        <table>
          <thead>
            <tr>
              <th>Catway Number</th>
              <th>Client Name</th>
              <th>Boat Name</th>
              <th>Check-in Date</th>
              <th>Check-out Date</th>
            </tr>
          </thead>
          <tbody>
            ${reservations.map(reservation => `
              <tr>
                <td>${reservation.catwayNumber}</td>
                <td>${reservation.clientName}</td>
                <td>${reservation.boatName}</td>
                <td>${new Date(reservation.checkIn).toLocaleDateString()}</td>
                <td>${new Date(reservation.checkOut).toLocaleDateString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      reservationsListDiv.innerHTML = table;
  
    } catch (error) {
      reservationsListDiv.innerHTML = `<p style="color: red;">Erreur : ${error.message}</p>`;
    }

    // Bouton permettant de revenir au tableau de bord.
    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.location.href = 'dashboard.html'; // Redirige vers le dashboard
        });
    }
  });
  