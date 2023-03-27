document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('#login-form');
  const loginEndPoint = 'http://localhost:5678/api/users/login';
  let loggedIn = false;
  const adminToolbar = document.querySelector(".admin-editor-toolbar");
  const loginParagraphe = document.querySelector(".login-head-paragraphe");
  const logoutParagraphe = document.querySelector(".logout-head-paragraphe");
  const modal = document.querySelector('.modal');
 
  

  if (window.location.pathname.includes('login.html')) {
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
          return response.json(); // extraire le corps de la réponse sous forme d'objet JavaScript
        } else {
          throw new Error('Erreur dans l’identifiant ou le mot de passe');
        }
      })
      .then(data => {
        const token = data.token; // extraire le token de l'objet JavaScript retourné
        sessionStorage.setItem('token', token);
        console.log(token);
        console.log(loggedIn);
        window.location.href = 'index.html';
        loggedIn = true;
      })
      .catch(error => {
        console.error(error);
      });
    });
  } 
  else {
    const token = sessionStorage.getItem('token');
    const buttonContainer = document.querySelector('.button');
    const modifyFigure = document.querySelector('.modify-figure-text');
    const loggedModifyText = document.querySelector(".logged-modify-text")
    const loggedModifyIcon = document.querySelector('.logo-modify-login');
  
    if (token) {
      loginParagraphe.classList.add('loggedIn')
      logoutParagraphe.classList.add('loggedIn')
      adminToolbar.classList.add('loggedIn');
      modifyFigure.classList.add('loggedIn');
      loggedModifyText.classList.add('loggedIn');
      loggedModifyIcon.classList.add('loggedIn');    
      buttonContainer.classList.add('invisible');
      console.log(token);
      console.log("logged");
      modal.style.display ='none'
      
    } else {
      
      loginParagraphe.classList.remove('loggedIn')
      logoutParagraphe.classList.remove('loggedIn')
    }
  }

  if (logoutParagraphe) {
    logoutParagraphe.addEventListener('click', (event) => {
      event.preventDefault();
  
      // Supprimer le token de la session storage
      sessionStorage.removeItem('token');
  
      // Rediriger l'utilisateur vers la page de connexion
      window.location.href = 'login.html';
    });
  }
});


