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
    const returnContent = document.querySelector(".return-modal-projet")
    const addPicture = document.querySelector(".button-add-picture");
    const fileInput = document.querySelector('#image');
    const submitProjet = document.querySelector(".submit-projet")
    const hidingPreviewPhoto = document.querySelector(".add-picture-hiding")




    submitProjet.addEventListener('click', ()=> {
      uploadProjet()
    })

    fileInput.addEventListener("input", (event) => {
      if (!fileInput.value) {
        // L'utilisateur a annulé l'upload
        hidingPreviewPhoto.style.display = 'flex';
      }
      else{
        hidingPreviewPhoto.style.display ='none'
      }
    });

    fileInput.addEventListener("change", (event) => {
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", (event) => {
        // Créer un élément img pour afficher la prévisualisation
        const img = document.createElement("img");
        img.src = event.target.result;
        // Remplacer l'icône par l'image prévisualisée
        const icon = addPicture.querySelector("i");
        icon.replaceWith(img);
      });
      reader.readAsDataURL(file);
    });
    
    addPicture.addEventListener("click", (event) => {
      event.preventDefault()  
      fileInput.click();
      updatePreviewImage(document.querySelector('#preview-image'));
    });
    
    

    returnContent.addEventListener('click', () =>{
      modal.style.display = 'block'
      modalContent.style.display ='block';
      modalPhoto.style.display ='none'
    });


    openModal.addEventListener('click', () => {
      modal.style.display = 'block'
      modalContent.style.display ='block';
      modalPhoto.style.display ='none'
      fetchWorks();
    });

    close.addEventListener('click', () => {
      modal.style.display = 'none';  

    });
    
    addPhoto.addEventListener('click', (event) =>{
      
      modalContent.style.display ='none'
      modalPhoto.style.display ='flex'
      loadCategorieModal()

    });

    closeContent.addEventListener('click',() =>{
      modalPhoto.style.display = 'none';
      modal.style.display ='none';
     });



  }
  

  function uploadProjet() {
    const fileInput = document.querySelector('#image');
    const file = fileInput.files[0];  
    // Vérifier si un fichier a été sélectionné
    if (!file) {
      console.error('Aucun fichier sélectionné');
      return;
    }
    // Récupérer les autres champs de formulaire
    const titleInput = document.querySelector('#title');
    const categorySelect = document.querySelector('#categorie-projet');
    const selectedCategory = categorySelect.value;    
    const title = titleInput.value;
    
    // Créer un objet FormData pour envoyer le fichier à l'API
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);
    if (selectedCategory) {
      formData.append('category', selectedCategory);
    }
    
    // Envoyer la requête POST à l'API
    
    fetch("http://localhost:5678/api/works", {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        // Traitement de la réponse de l'API
        console.log(data);
      })
      .catch(error => {
        // Gestion des erreurs
        console.error(error);
        alert('Une erreur s\'est produite lors de l\'envoi de la photo. Veuillez réessayer plus tard.');
      });
  }

//Mehode pour recupérer les données de categorie a l'api
function loadCategorieModal(){
  fetch(categorieEndPoint)
  .then(response => response.json())
  .then(categories => {
  const select = document.querySelector('#categorie-projet');
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.name;
      select.appendChild(option);
    });
  });
  }

  function updatePreviewImage(img) {
    const fileInput = document.querySelector('#image');
    
    fileInput.addEventListener("change", (event) => {
      const file = fileInput.files[0];
      
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          img.src = reader.result;
        }
        reader.readAsDataURL(file);
      }
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




