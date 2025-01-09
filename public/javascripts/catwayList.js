/* 
    Formulaire pour afficher la liste des catways.
    Evènement qui est déclenché lorsque le DOM de la page est complètement chargé.
*/
document.addEventListener('DOMContentLoaded', async () => {
    // Récupération de l'élément du DOM.
    const catwayListDiv = document.getElementById('catwayList');
    const token = localStorage.getItem('token'); // Récupérer le token JWT.

    // Si le token est manquant, un message d'erreur s'affiche. 
    if (!token) {
        catwayListDiv.innerHTML = '<p>Token manquant. Vous devez vous connecter.</p>';
        return; // Empêche la requête si le token est manquant.
    }

    try {
        // Appel à l'API.
        const response = await fetch('http://localhost:3001/api/catways', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Inclut le token JWT pour authentifier l'utilisateur.
            },
        });

        // Si une erreur survient, un message d'erreur s'affiche.
        if (!response.ok) {
            throw new Error('Impossible de récupérer la liste des catways');
        }

        // Récupération des catways en JSON.
        const catways = await response.json();
        
        // Si aucun catways n'est enregistré dans la base de données, un message s'affichera.
        if (catways.length === 0) {
            catwayListDiv.innerHTML = '<p>Aucun catway trouvé.</p>';
        } else {
            // Si un ou plusieurs catways ont été trouvé, la liste s'affichera.
            const catwayListHtml = catways.map(catway => `
                <div>
                    <h3>Numéro du catway: ${catway.catwayNumber}</h3>
                    <p>Type: ${catway.type}</p>
                    <p>État: ${catway.catwayState}</p>
                    <a href="catwayDetails.html?catwayId=${catway._id}">Voir les détails</a>
                </div>
            `).join('');
            catwayListDiv.innerHTML = catwayListHtml;
        }

    } catch (error) {
        catwayListDiv.innerHTML = `<p style="color: red;">Erreur: ${error.message}</p>`;
    }

    // Bouton permettant de revenir au tableau de bord.
    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.location.href = 'dashboard.html'; // Redirige vers le dashboard
        });
    }
});
