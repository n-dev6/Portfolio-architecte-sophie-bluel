document.addEventListener('DOMContentLoaded', () => {
const loginForm = document.querySelector('#login-form');
const loginEndPoint = 'http://localhost:5678/api/users/login'

loginForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Empêche la soumission du formulaire

  const username = loginForm.elements['email'].value;
  const password = loginForm.elements['password'].value;

  fetch(loginEndPoint, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${btoa(username + ':' + password)}`
    }
  })
  .then(response => {
    if (response.status === 200) {
      window.location.href = 'index.html'; // Redirige vers la page d'édition
    } else {
      const errorMessage = document.createElement('p');
      errorMessage.textContent = 'Erreur dans l’identifiant ou le mot de passe';
      loginForm.appendChild(errorMessage); // Ajoute le message d'erreur au formulaire
    }
  })
  .catch(error => {
    console.error(error);
  });
});
});