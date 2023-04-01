
const workEndPoint = "http://localhost:5678/api/works";
const categorieEndPoint = "http://localhost:5678/api/categories";


document.addEventListener("DOMContentLoaded", () => {
  
  const modal = document.querySelector('.modal');
  modal.style.display = 'none';


  fetchWorks();
  const buttonAll = document.querySelector('.allButton');
  buttonAll.addEventListener('click', () => fetchWorks());
  fetch(categorieEndPoint)
  .then(response => response.json())
  .then(categories => {

    // sélectionner l'élément parent des boutons
    const buttonContainer = document.querySelector('.button');

    // créer les boutons pour chaque catégorie
    categories.forEach(category => {
      // créer un élément de bouton
      const button = document.createElement('button');
      // ajouter le texte pour le bouton
      button.textContent = category.name;
      // ajouter un écouteur d'événements pour le clic sur le bouton
      button.addEventListener('click', () => {
        // récupérer l'identifiant de la catégorie sélectionnée
        const categoryId = category.id;
        fetchWorks(categoryId);
        // filtrer les projets en fonction de la catégorie sélectionnée
        // (code à implémenter)
      });
    
      
      // ajouter le bouton à l'élément parent
      buttonContainer.appendChild(button);
    });
  
  })
  .catch(error => console.error(error));

});



// récupérer les données de l'API

function fetchWorks(categoryId){
  fetch(workEndPoint)
  .then(response => response.json())
  .then(works => {
    const filteredWorks = categoryId ? works.filter(work => work.categoryId == categoryId): works;
    const gallery = document.querySelector(".gallery");
    // ajouter la figure à la page
    removeAllChildNodes(gallery);
    
    filteredWorks.forEach(work => {
      // transformation du work en figure html   
      const figure = createFigure(work);
      gallery.appendChild(figure);
    });
  });
}

function createFigure(work){
  const figure = document.createElement('figure');
  const img = document.createElement('img');
  img.src = work.imageUrl;
  img.alt = work.title;
  const figcaption = document.createElement('figcaption');
  figcaption.textContent = work.title;
  figure.appendChild(img);
  figure.appendChild(figcaption);
  return figure;
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

