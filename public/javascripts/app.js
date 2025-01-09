/*
  Formulaire de connexion et redirection vers le dashboard.
  Evènement qui est déclenché lorsque le DOM de la page est complètement chargé.
*/
document.addEventListener('DOMContentLoaded', () => {
  // Formulaire de connexion, récupération du formulaire HTML via l'ID
  const loginForm = document.getElementById('loginForm');

  // Vérifie que l'élèment existe
  if (loginForm) {
    
    // Ajout d'un gestionnaire d'évènement qui s'exécute à la soumission du formulaire.
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire.

      // Récupération des valeurs du formulaire saisie par l'utilisateur.
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        // Envoie une requête HTTP à l'API d'authentification.
        const response = await fetch('http://localhost:3001/api/auth/authenticate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        // Convertit la réponse JSON en objet JavaScript.
        const data = await response.json();

    // Vérifie que le code de statut HTTP est 200 (succès).
    if (response.ok) {
      // Affiche un message dans la console pour avertir que tout s'est bien passé.
      console.log('Authentification réussie:', data);

      // Récupère l'élèment dans le DOM.
      const errorMessage = document.getElementById('errorMessage');
      console.log('errorMessage element:', errorMessage); // Log pour vérifier s'il existe

      if (errorMessage) {
        errorMessage.textContent = ''; // Vide le message d'erreur en cas de succès
      }

      // Stocke le token JWT et l'email dans le localStorage pour une utilisation ultérieure.
      localStorage.setItem('token', data.token);
      localStorage.setItem('email', email);

      // Redirige l'utilisateur vers la page du tableau de bord
      window.location.href = '/dashboard.html';
    } else {
      // Affiche un message dans la console pour avertir d'une erreur.
      console.error('Erreur lors de la connexion:', data.message);

      // Récupère l'élèment dans le DOM.
      const errorMessage = document.getElementById('errorMessage');
      console.log('errorMessage element (en erreur):', errorMessage); // Log pour vérifier

      // Affiche un message d'erreur dans un élément avec l'ID
      if (errorMessage) {
        errorMessage.textContent = data.message || 'Échec de la connexion.';
      }
    }
  } catch (error) {
    console.error('Erreur réseau ou autre:', error);
    const errorMessage = document.getElementById('errorMessage');

    if (errorMessage) {
      errorMessage.textContent = 'Erreur serveur ou réseau. Veuillez réessayer plus tard.';
    }
  }
    });
  }

  // Déconnexion sur le tableau de bord 
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      // Suppression du token et retour à la page de connexion
      localStorage.removeItem('token');
      window.location.href = '/index.html';
    });
  }

  // Gestion du tableau de bord
  const welcomeMessage = document.getElementById('welcomeMessage');
  if (welcomeMessage) {
    // Vérification du token
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirection vers la page de connexion si non connecté
      window.location.href = '/index.html';
    } else {
      // Affiche un message de bienvenue (peut être remplacé par une requête API)
      welcomeMessage.textContent = `Bienvenue sur votre tableau de bord!`;
    }
  }
});

/* 
  Formulaire d'ajout d'un utilisateur.
  Evènement qui est déclenché lorsque le DOM de la page est complètement chargé.
*/
document.addEventListener('DOMContentLoaded', () => {
  // Gestionnaire pour le formulaire d'ajout d'utilisateur. On récupère les élèments dans le DOM via l'ID.
  const addUserForm = document.getElementById('addUserForm');
  const addUserMessage = document.getElementById('addUserMessage');

  // Vérification de l'existance du formulaire
  if (addUserForm) {
    // Ajout d'un gestionnaire d'évènement pour soumettre le formulaire/
    addUserForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire.

      // Récupérer les valeurs des champs saisies par l'utilisateur.
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        // Appeler l'API pour ajouter un utilisateur
        const response = await fetch('http://localhost:3001/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Inclure le token si nécessaire
          },
          body: JSON.stringify({ name, email, password })
        });

        // Convertit la réponse JSON en objet JavaScript.
        const result = await response.json();

        // Vérifie que la réponse HTTP a un code statut 200 (succès).
        if (response.ok) {
          // Affichage d'un texte de couleur vert
          addUserMessage.style.color = 'green';
          addUserMessage.textContent = 'Utilisateur ajouté avec succès !';
          addUserForm.reset(); // Réinitialise le formulaire
        } else {
          // Si la réponse API contient une erreur, affichage d'un texte de couleur rouge.
          addUserMessage.style.color = 'red';
          addUserMessage.textContent = `Erreur : ${result.message}`;
        }
      } catch (error) {
        // Si une erreur se produit pendant l'exécution de la requête, un message d'erreur s'affiche.
        addUserMessage.style.color = 'red';
        addUserMessage.textContent = `Erreur lors de la requête : ${error.message}`;
      }
    });
  }
});

/* 
  Formulaire de modification d'un utilisateur grâce à son ID.
  On vient récupérer le formulaire HTML qui va permettre la modification des données de l'utilisateur.
  On attache une fonction à l'évènement de soumission du formulaire.
*/
document.getElementById('updateUserForm').addEventListener('submit', async (event) => {
  event.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire.

  // Récupérer les données du formulaire saisies par l'utilisateur.
  const userId = document.getElementById('updateUserId').value;
  const name = document.getElementById('updateName').value;
  const email = document.getElementById('updateEmail').value;

  // Construire les données à envoyer. 
  const updatedData = {};
  if (name) updatedData.name = name;
  if (email) updatedData.email = email;

  // Envoie d'une requête PUT à l'API.
  try {
    const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    // Vérification du code statut succès.
    if (response.ok) {
      // Convertit la réponse JSON en objet JavaScript.
      const data = await response.json();
      // Affiche un message de succès
      document.getElementById('updateMessage').textContent = `Utilisateur modifié avec succès : ${JSON.stringify(data)}`;
      document.getElementById('updateMessage').style.color = 'green';
    } else {
      // Les détails de l'erreur sont extraits de la réponse.
      const errorData = await response.json();
      // Affiche un message d'erreur.
      document.getElementById('updateMessage').textContent = `Erreur : ${errorData.message}`;
      document.getElementById('updateMessage').style.color = 'red';
    }
  } catch (error) {
    // Si un erreur se produit en dehors de la réponse HTTP, un message d'erreur s'affiche.
    document.getElementById('updateMessage').textContent = `Erreur de connexion : ${error.message}`;
    document.getElementById('updateMessage').style.color = 'red';
  }
});

/* 
  Formulaire pour supprimer un utilisateur grâce à son ID.
  On vient récupérer le formulaire HTML qui va permettre la suppression des données de l'utilisateur.
  On attache une fonction à l'évènement de soumission du formulaire.
*/
document.getElementById('deleteUserForm').addEventListener('submit', async (event) => {
  event.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire.

  const userId = document.getElementById('userId').value; // Récupérer l'ID de l'utilisateur.
  const deleteMessage = document.getElementById('deleteMessage'); // Zone pour afficher les messages.
  try {
    const token = localStorage.getItem('token'); // Récupérer le token JWT stocké.
    console.log('Token récupéré:', token); // Affiche le token dans la console pour le débogage.

    // Appel à l'API pour supprimer l'utilisateur.
    const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Inclut le token JWT pour authentifier l'utilisateur.
      },
    });

    // Vérifie que le code statut est succès.
    if (response.ok) {
      // Convertit la réponse JSON en objet JavaScript.
      const data = await response.json();
      // Affiche un message de succès.
      deleteMessage.style.color = 'green';
      deleteMessage.textContent = `Utilisateur supprimé avec succès : ${data.name}`;
    } else {
      //  Récupère les détails de l'erreur envoyés par le serveur.
      const errorData = await response.json();
      // Affiche un message d'erreur retourné par l'API.
      deleteMessage.style.color = 'red';
      deleteMessage.textContent = `Erreur : ${errorData.message}`;
    }
  } catch (error) {
    // Si une erreur se produit en dehors de l'API, affiche un message d'erreur.
    deleteMessage.style.color = 'red';
    deleteMessage.textContent = `Erreur lors de la suppression : ${error.message}`;
  }
});

/* 
  Formulaire pour ajouter un catway.
  Evènement qui est déclenché lorsque le DOM de la page est complètement chargé.
*/
document.addEventListener('DOMContentLoaded', () => {
  // Sélection du formulaire HTML avec l'ID.
  const addCatwayForm = document.getElementById('addCatwayForm');

  // Vérifie si le formulaire existe.
  if (addCatwayForm) {
    // L'événement se déclenche lorsque l'utilisateur soumet le formulaire.
    addCatwayForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire.

      // Récupération des valeurs des champs du formulaire.
      const catwayNumber = document.getElementById('catwayNumber').value;
      const catwayState = document.getElementById('catwayState').value;
      const type = document.getElementById('Type').value;
      const message = document.getElementById('addCatwayMessage');

      try {
        // Récupère le token JWT.
        const token = localStorage.getItem('token');

        // Si le token est manquant, un message s'affiche dans la console.
        if (!token) {
          console.error("Token manquant");
          return;  // Empêche la requête si le token est manquant.
        }

        // Appel à l'API.
        const response = await fetch('http://localhost:3001/api/catways', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Inclut le token JWT pour authentifier l'utilisateur.
          },
          body: JSON.stringify({ catwayNumber, catwayState, type }),
        });

        // Vérifie que le code statut est succès.
        if (response.ok) {
          // Affichage d'un message succès.
          message.textContent = 'Catway ajouté avec succès.';
          message.style.color = 'green';
        } else {
          // Récupère les détails de l'erreur en JSON.
          const error = await response.json();
          // Affichage d'un message erreur.
          message.textContent = `Erreur : ${error.message}`;
          message.style.color = 'red';
        }
      } catch (error) {
        message.textContent = `Erreur : ${error.message}`;
        message.style.color = 'red';
      }

      // Réinitialise les champs du formulaire.
      addCatwayForm.reset();
    });
  } else {
    // Si le formulaire est introuvable dans DOM, affichage d'un message dans la console.
    console.error('Formulaire non trouvé');
  }
});

/* 
  Formulaire pour modifier la description de l'état d'un catway grâce à son ID :
  Evènement qui est déclenché lorsque le DOM de la page est complètement chargé.
*/
document.addEventListener('DOMContentLoaded', () => {
  // Récupération du formulaire HTML avec l'ID.
  const updateCatwayForm = document.getElementById('updateCatwayForm');

  // Vérifie que le formulaire existe.
  if (updateCatwayForm) {
    // Événement déclenché lorsque le formulaire est soumis.
    updateCatwayForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire.

      // Récupération des valeurs saisies dans le formulaire par l'utilisateur.
      const catwayId = document.getElementById('catwayId').value;
      const newDescription = document.getElementById('newCatwayState').value;
      const message = document.getElementById('updateCatwayMessage');

      try {
        const token = localStorage.getItem('token'); // Récupère le token JWT stocké.

        // Appel à l'API.
        const response = await fetch(`http://localhost:3001/api/catways/${catwayId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json', // Spécifie que les données envoyées sont au format JSON.
            Authorization: `Bearer ${token}`, // Inclut le token JWT pour authentifier l’utilisateur.
          },
          body: JSON.stringify({ catwayState: newDescription }),
        });

        // Vérifie si le code statut est succès.
        if (response.ok) {
          // Affiche un message succès.
          message.textContent = 'Catway modifié avec succès.';
          message.style.color = 'green';
        } else {
          // Récupère les détails de l’erreur en JSON depuis la réponse de l’API.
          const error = await response.json();
          // Affiche un message erreur. 
          message.textContent = `Erreur : ${error.message}`;
          message.style.color = 'red';
        }
      } catch (error) {
        message.textContent = `Erreur : ${error.message}`;
        message.style.color = 'red';
      }

      // Réinitialise les champs de formulaire après soumission.
      updateCatwayForm.reset();
    });
  } else {
    // Affiche un message dans la console si le formulaire n'existe pas.
    console.error('Formulaire de mise à jour du catway non trouvé');
  }
});

/* 
  Formulaire pour supprimer un catway grâce à son ID.
  On vient récupérer le formulaire HTML qui va permettre la suppression d'un catway.
  On attache une fonction à l'évènement de soumission du formulaire.
*/
document.getElementById('deleteCatwayForm').addEventListener('submit', async (event) => {
  event.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire.

  // Récupération de la valeur dans le champs de formulaire.
  const id = document.getElementById('deleteCatwayId').value;
  const message = document.getElementById('deleteCatwayMessage');

  try {
    const token = localStorage.getItem('token'); // Récupère le token JWT stocké.

    // Appel à l'API.
    const response = await fetch(`http://localhost:3001/api/catways/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json', // Spécifie que les données envoyées sont au format JSON.
        Authorization: `Bearer ${token}`, // Inclut le token JWT pour authentifier l’utilisateur.
      },
    });

    // Vérifie si le code statut est succès.
    if (response.ok) {
      // Affiche un message succès.
      message.textContent = 'Catway supprimé avec succès.';
      message.style.color = 'green';
        
    } else {
      // Récupère les détails de l’erreur renvoyée par l’API.
      const error = await response.json();
      // Affiche un message erreur.
      message.textContent = `Erreur : ${error.message}`;
      message.style.color = 'red';
    }
  } catch (error) {
    message.textContent = `Erreur : ${error.message}`;
    message.style.color = 'red';
  }

  // Réinitialise les champs de formulaire après soumission du formulaire.
  document.getElementById('deleteCatwayForm').reset();
});

/* 
  Formulaire pour afficher les détails d'un catway grâce à son ID.
  Evènement qui est déclenché lorsque le DOM de la page est complètement chargé.
*/
document.addEventListener('DOMContentLoaded', () => {
  // Récupération des éléments du DOM.
  const detailsCatwayForm = document.getElementById('detailsCatway');
  const catwayDetailsDiv = document.getElementById('catwayDetails');

  // Vérification de l'existance du formulaire.
  if (detailsCatwayForm) {
    // Lorsqu'un utilisateur soumet le formulaire, l'évènement est intercepté.
    detailsCatwayForm.addEventListener('submit', (event) => {
      event.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire.
  
      // Récupère les valeurs du champ de formulaire du catway fourni par l'utilisateur.
      const catwayId = document.getElementById('catwayDetailsId').value; 

      // Si l'ID n'est pas fourni, un message d'erreur apparaît.
      if (!catwayId) {
        catwayDetailsDiv.innerHTML = `<p style="color: red;">Veuillez saisir un ID de catway.</p>`;
        return; // L'exécution de la fonction est interrompue.
      }

      // Redirection vers la page catwayDetails.html avec l'ID dans l'URL
      window.location.href = `catwayDetails.html?catwayId=${catwayId}`;
    });
  }
});

/* 
  Formulaire pour afficher les détails d'une réservation grâce à son ID.
  Evènement qui est déclenché lorsque le DOM de la page est complètement chargé.
*/
document.addEventListener('DOMContentLoaded', () => {
  // Récupération des éléments du DOM.
  const reservationForm = document.getElementById('reservationIdForm');

  // Vérification de l'existance du formulaire.
  if (reservationForm) {
    // Lorsqu'un utilisateur soumet le formulaire, l'évènement est intercepté.
    reservationForm.addEventListener('submit', (event) => {
      event.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire.

      // Récupère les valeurs du champ de formulaire fourni par l'utilisateur.
      const catwayId = document.getElementById('catwayIdReservation').value.trim();
      const reservationId = document.getElementById('reservationId').value.trim();

      // Si les ID ne sont pas fournis, message d'alert est affiché.
      if (!catwayId || !reservationId) {
        alert("Veuillez saisir les IDs requis.");
        return; // L'exécution de la fonction est interrompue.
      }

      // Redirection vers reservationDetails.html avec les paramètres dans l'URL
      window.location.href = `reservationDetails.html?catwayId=${catwayId}&idReservation=${reservationId}`;
    });
  }
});

/* 
  Formulaire pour supprimer une réservation grâce à son ID.
  Evènement qui est déclenché lorsque le DOM de la page est complètement chargé.
*/
document.addEventListener('DOMContentLoaded', () => {
  // Récupération des éléments du DOM.
  const deleteReservationForm = document.getElementById('deleteReservationForm');
  const deleteReservationMessage = document.getElementById('deleteReservationMessage');

  // Vérification de l'existance du formulaire.
  if (deleteReservationForm) {
    // Lorsqu'un utilisateur soumet le formulaire, l'évènement est intercepté.
    deleteReservationForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire.

      // Récupère les valeurs du champ de formulaire fourni par l'utilisateur.
      const catwayId = document.getElementById('catwayIdSupprimer').value;
      const idReservation = document.getElementById('deleteReservationId').value;

      // Si les IDs ne sont pas fourmis, un message d'erreur apparaît.
      if (!catwayId || !idReservation) {
        deleteReservationMessage.textContent = "Veuillez fournir les IDs du catway et de la réservation.";
        deleteReservationMessage.style.color = "red";
        return; // L'exécution de la fonction est interrompue.
      }

      try {
        const token = localStorage.getItem('token'); // Récupère le token JWT.

        // Appel à l'API.
        const response = await fetch(`http://localhost:3001/api/catways/${catwayId}/reservations/${idReservation}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`, // Inclut le token JWT pour authentifier l’utilisateur.
          },
        });

        // Vérifie que le code statut est succès.
        if (response.ok) {
          // Affichage d'un message succès.
          deleteReservationMessage.textContent = "La réservation a été supprimée avec succès.";
          deleteReservationMessage.style.color = "green";
        } else {
          // Récupère les détails de l'erreur en JSON.
          const error = await response.json();
          // Affichage d'un message erreur.
          deleteReservationMessage.textContent = `Erreur : ${error.message}`;
          deleteReservationMessage.style.color = "red";
        }
      } catch (error) {
        deleteReservationMessage.textContent = `Erreur : ${error.message}`;
        deleteReservationMessage.style.color = "red";
      }
      
      // Réinitialise les champs du formulaire.
      document.getElementById('deleteReservationForm').reset();

    });
  }
});



