document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('#login-form');
  const loginEndPoint = 'http://localhost:5678/api/users/login';
  let loggedIn = false;
  const adminToolbar = document.querySelector(".admin-editor-toolbar");

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Empêche la soumission du formulaire

    const username = loginForm.elements['email'].value;
    const password = loginForm.elements['password'].value;

    fetch(loginEndPoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: username,
        password: password
      })
    })
    .then(response => {
      if (response.status === 200) {
        loggedIn = true;
        console.log(loggedIn);
        window.location.replace('index.html');
      } else {
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'Erreur dans l’identifiant ou le mot de passe';
        loginForm.appendChild(errorMessage); // Ajoute le message d'erreur au formulaire
        loggedIn = false;
      }
  })
    .catch(error => {
      console.error(error);
    });
  });
});