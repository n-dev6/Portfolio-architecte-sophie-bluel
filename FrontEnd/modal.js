document.addEventListener("DOMContentLoaded", () => {
  const token = sessionStorage.getItem('token');  
  const workEndPoint = "http://localhost:5678/api/works";
  const categorieEndPoint = "http://localhost:5678/api/categories";
  
  
  
  
  
  if (token){
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
    let categorieAlreadyLoad = false
    const previewImage = document.querySelector('#preview-image');
    const successBtn = document.querySelector("#btn-success");
    const errorBtn = document.querySelector("#btn-error");
    
    document.addEventListener('click', function(event) {
      // vérifie si l'élément cliqué est dans la modal
      console.log(event.target)
      console.log(event.target.closest(".modal"))
      
      if (!event.target.classList.contains("modal") && !event.target.classList.contains("fa-trash") && !event.target.closest('.modal')){
        // fermer la modal
        
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
       
        
      }
    });
    
    
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
        
      });
      reader.readAsDataURL(file);
    });
    
    addPicture.addEventListener("click", (event) => {
      event.preventDefault()  
      fileInput.click();
      updatePreviewImage(document.querySelector('#preview-image'));
    });
    
    //attention les categories ce charge deux fois
    
    returnContent.addEventListener('click', () =>{
      modal.style.display = 'block'
      modalContent.style.display ='block';
      modalPhoto.style.display ='none'
      updateModal()
      form = document.querySelector('#add-projet-form')
      form.reset()
      removePreviewImage(previewImage);
      hidingPreviewPhoto.style.display = 'flex';
      successBtn.style.display='none'
      fetchWorksMenu()
      
    });
    
    
    openModal.addEventListener('click', (event) => {
      modal.style.display = 'block'
      modalContent.style.display ='block';
      modalPhoto.style.display ='none'
      fetchWorks();
      successBtn.style.display='none'
      errorBtn.style.display='none'
      document.body.classList.add('modal-open'); 
      event.stopPropagation(); 
    });
    
    close.addEventListener('click', () => {
      document.body.classList.remove('modal-open');
      modal.style.display = 'none';
      successBtn.style.display='none'
      fetchWorksMenu()
      
    });
    
    addPhoto.addEventListener('click', (event) =>{
      modalContent.style.display ='none'
      modalPhoto.style.display ='flex'
      if (!categorieAlreadyLoad){
        loadCategorieModal()
        categorieAlreadyLoad = true
      }
      updateModal()
      form = document.querySelector('#add-projet-form')
      form.reset()
      removePreviewImage(previewImage);
      hidingPreviewPhoto.style.display = 'flex';
    });
    
    closeContent.addEventListener('click',() =>{
      document.body.classList.remove('modal-open');
      modalPhoto.style.display = 'none';
      modal.style.display ='none';
      fetchWorksMenu()
    }); 
  }
  
  //Fonctions
  
  function removePreviewImage(img) {
    img.src = '';
  }
  
  function updateModal(categoryId) {
    fetchWorks(categoryId);
  }
  
  function deleteWork(workId) {
    fetch("http://localhost:5678/api/works/"+ '/' + workId, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
    
  })
  .then(data => {
    console.log(data);
    fetchWorksMenu()
    // Mettre à jour l'affichage ou faire d'autres traitements en cas de succès
  })
  .catch(error => {
    console.error(error);
    // Gérer les erreurs
  });
}


function uploadProjet() {
  const fileInput = document.querySelector('#image');
  const file = fileInput.files[0];
  const successBtn = document.querySelector("#btn-success");
  const errorBtn = document.querySelector("#btn-error");
  
  
  // Vérifier si un fichier a été sélectionné
  if (!file) {
    console.error('Aucun fichier sélectionné');
    errorBtn.style.display='block'
    // affiche le bouton en none aprés 5sec
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
  else{
    errorBtn.style.textContent ='Veuillez selectionner une catègorie'
    errorBtn.style.display='block'   
  }
  
  // Envoyer la requête POST à l'API
  sessionStorage.getItem(token)
  console.log(token)  
  const headers = new Headers(); 
  // Ajouter le token à l'en-tête
  headers.append('Authorization', `Bearer ${token}`); 
  // Envoyer la requête POST à l'API avec les en-têtes
  fetch("http://localhost:5678/api/works", {
  method: 'POST',
  headers: headers,
  body: formData,
})
.then(response => response.json())
.then(data => {
  // Traitement de la réponse de l'API
  console.log(data);
  fetchWorksMenu()
  successBtn.style.display ='block'
  
  
})
.catch(error => {
  // Gestion des erreurs
  console.error(error);
  alert('Une erreur s\'est produite lors de l\'envoi de la photo. Veuillez réessayer plus tard.');
  errorBtn.style.display='block'
  setTimeout(() => {
    errorBtn.style.display = 'none';
  }, 5000);    
});
}

function fetchWorksMenu(categoryId){
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
      categorieAlreadyLoad = true
    });
  });
}
// affiche l'image 
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
      const deleteIcon = document.createElement('i')
      deleteIcon.className = 'fa fa-trash'
      deleteIcon.style.cursor = 'pointer'; // ajout d'un style cursor pointer pour indiquer que l'icône est cliquable
      deleteIcon.addEventListener('click', (event) => {
        // supprimer le travail associé au clic sur l'icône de la corbeille
        deleteWork(work.id);
        // supprimer la figure correspondante de la page

        galleryModal.removeChild(figure);
    
      });
      figure.appendChild(deleteIcon);
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




