document.addEventListener("DOMContentLoaded", () => {
const token = sessionStorage.getItem('token');  
const workEndPoint = "http://localhost:5678/api/works";
const categorieEndPoint = "http://localhost:5678/api/categories";

  if (token) {
    const openModal = document.querySelector("li.projet-modify-text");
    const modal = document.querySelector('.modal');
    const close = document.querySelector('.close');
    const closeContent = document.querySelector(".close-content-photo")
    const addPhoto = document.querySelector(".button-add-photo")
    const modalContent = document.querySelector(".modal-content")
    const modalPhoto = document.querySelector(".modal-content-photo")


    openModal.addEventListener('click', () => {
      modal.style.display = 'block'
      modalContent.style.display ='block';
      modalPhoto.style.display ='none'
      fetchWorks();
    });

    close.addEventListener('click', () => {
      modal.style.display = 'none';  

    });
    
    addPhoto.addEventListener('click', () =>{
      modalContent.style.display ='none'
      modalPhoto.style.display ='flex'

    });

    closeContent.addEventListener('click',() =>{
      modalPhoto.style.display = 'none';
      modal.style.display ='none';
     });

  }
  



function fetchWorks(categoryId){
  fetch(workEndPoint)
  .then(response => response.json())
  .then(works => {
    const filteredWorks = categoryId ? works.filter(work => work.categoryId == categoryId): works;
    const galleryModal = document.querySelector(".gallery-modal")
    removeAllChildNodes(galleryModal);
    // ajouter la figure à la page
    
    filteredWorks.forEach(work => {
      // transformation du work en figure html
     
      const figure = createFigure(work);
      galleryModal.appendChild(figure);
    });
  });
}

function createFigure(work){
  const figure = document.createElement('figure');
  const img = document.createElement('img');
  img.src = work.imageUrl;
  img.alt = work.title;
  img.classList.add('work-image-modal'); // Ajouter la classe .work-image
  const figcaption = document.createElement('figcaption');
  figcaption.textContent = "editer";
  figure.appendChild(img);
  figure.appendChild(figcaption);
  return figure;
}
});

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}



