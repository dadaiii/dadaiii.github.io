document.addEventListener('DOMContentLoaded', function() {
    let activeFilter = null; // Utilisez une variable pour stocker le filtre actif

// Fonction pour afficher les images dans la galerie
function renderImages(filteredImages) {
    const portfolio = document.getElementById('portfolioContainer');
    portfolio.innerHTML = ''; // Clear previous content

    // Trier les images par année (ordre décroissant)
    filteredImages.sort((a, b) => b.year[0].localeCompare(a.year[0]));

    console.log("Images à afficher:", filteredImages); // Debugging

    // Vérifie si filteredImages est vide
    if (filteredImages.length === 0) {
        portfolio.innerHTML = '<p>Aucune image à afficher.</p>'; // Affiche un message si aucune image
        return; // Sortir de la fonction si aucune image
    }

    filteredImages.forEach(image => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('portfolio-item');

        const imgElement = document.createElement('img');
        imgElement.src = image.src;
        imgElement.alt = image.description; // Utilise la description spécifique de chaque image

        const infoCard = document.createElement('div');
        infoCard.classList.add('info-card');
        infoCard.innerHTML = `<p>${image.description}</p>`; // Utilise la description spécifique de chaque image

        itemElement.appendChild(imgElement);
        itemElement.appendChild(infoCard);

        // Ajout d'un événement pour l'affichage en plein écran
        imgElement.addEventListener('click', () => showLightbox(image));

        portfolio.appendChild(itemElement);
    });
}


    

    // Fonction pour filtrer les images en fonction des filtres actifs
function filterImages() {
    console.log('Active Filter:', activeFilter);

    const filteredImages = images.filter(image => {
        if (!activeFilter) return true; // Si aucun filtre n'est actif, afficher toutes les images

        const filterType = image[activeFilter.type];
        return Array.isArray(filterType) 
            ? filterType.includes(activeFilter.value)  // Vérifie si la valeur du filtre est présente dans le tableau
            : filterType === activeFilter.value;       // Pour les valeurs qui ne sont pas des tableaux
    });

    console.log('Filtered Images:', filteredImages);
    renderImages(filteredImages); // Affiche les images filtrées
}

    // Fonction pour basculer entre les vues en mosaïque et en grille
    function toggleView() {
        const portfolio = document.getElementById('portfolioContainer');
        const toggleButton = document.getElementById('toggleView');

        if (portfolio.classList.contains('mosaic')) {
            portfolio.classList.remove('mosaic');
            portfolio.classList.add('grid');
            toggleButton.textContent = 'Mosaïque';
        } else {
            portfolio.classList.remove('grid');
            portfolio.classList.add('mosaic');
            toggleButton.textContent = 'Liste';
        }

        filterImages(); // Re-render images after view toggle
    }

    // Fonction pour afficher l'image en plein écran (lightbox)
    function showLightbox(image) {
        const lightbox = document.getElementById('lightbox');
        if (!lightbox) return; // Check if lightbox element exists

        const lightboxImage = document.getElementById('lightboxImage');
        const lightboxInfoCard = document.getElementById('lightboxInfoCard');

        if (lightboxImage && lightboxInfoCard) {
            lightboxImage.src = image.src;
            lightboxInfoCard.innerHTML = `<p>${image.description}</p>`;
            lightbox.style.display = 'flex';
        }
    }

    // Fonction pour fermer la lightbox
    function closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.style.display = 'none';
        }
    }

    // Gestion des boutons de la barre latérale pour naviguer entre les sections
    const buttons = document.querySelectorAll('.buttons button');
    const sections = document.querySelectorAll('.content section');

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);

            // Cacher toutes les sections
            sections.forEach(section => {
                section.classList.add('hidden');
            });

            // Montrer la section cible
            targetElement.classList.remove('hidden');
            targetElement.scrollIntoView({ behavior: 'smooth' });
        });
    });

// Afficher la section "Accueil" par défaut
    const homeSection = document.getElementById('home');
    if (homeSection) {
        homeSection.classList.remove('hidden');
    }

    // Gestion des filtres
    const filters = document.querySelectorAll('.filter-group button');
    filters.forEach(filter => {
        filter.addEventListener('click', function() {
            if (this.classList.contains('active')) {
                // Désélectionner le filtre actuel
                this.classList.remove('active');
                activeFilter = null;
            } else {
                // Désélectionner tous les filtres
                filters.forEach(btn => {
                    btn.classList.remove('active');
                });

                // Sélectionner le filtre cliqué
                this.classList.add('active');
                activeFilter = { type: this.getAttribute('data-filter'), value: this.getAttribute('value') };
            }
            filterImages(); // Filtrer les images
        });
    });

    // Vérifiez si les éléments existent avant d'ajouter les événements
    const toggleViewButton = document.getElementById('toggleView');
    if (toggleViewButton) {
        toggleViewButton.addEventListener('click', toggleView);
    }

    const lightboxClose = document.getElementById('lightboxClose');
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    // Initial rendering of images
    renderImages(images);
});

// Données des images
const images = [

    { src: 'https://i.imgur.com/PeWfcLp.jpeg', year: ['2024'], type: 'Dessin', medium: 'Traditionnel', description: 'Exercice de modèle vivant. Mon professeur de dessin.' },
    { src: 'https://i.imgur.com/k1XvpsX.jpeg', year: ['2024'], type: 'Dessin', medium: 'Traditionnel', description: 'Exercice de modèle vivant. Mon professeur de dessin.' },
    { src: 'https://i.imgur.com/yVrFmd0.jpeg', year: ['2024'], type: 'Dessin', medium: 'Traditionnel', description: 'Exercice de modèle vivant. Mon professeur de dessin.' },
    { src: 'https://i.imgur.com/cXx1Wb5.jpeg', year: ['2024'], type: 'Dessin', medium: 'Traditionnel', description: 'Exercice de modèle vivant. Portrait rapide. Juliette ma camarade de classe.' },

    { src: 'https://i.imgur.com/IoRUZav.jpeg', year: ['2024'], type: ['Dessin','Illustration'], medium: 'Traditionnel', description: 'Ma participation au Disney art challenge 2024 sur le thème de l\'adolescence' },

    { src: 'https://i.imgur.com/73m069P.jpeg', year: ['2023'], type: 'Dessin', medium: ['Traditionnel','Numérique'], description: 'Illustration d\'un personnage pour un jeu de rôle sur le thème des contes. Alice au pays des merveilles' },
    { src: 'https://i.imgur.com/etTZ0FR.jpeg', year: ['2023'], type: 'Dessin', medium: ['Traditionnel','Numérique'], description: 'Illustration d\'un personnage pour un jeu de rôle sur le thème des contes. Mulan' },
    { src: 'https://i.imgur.com/2yLbjUl.jpeg', year: ['2023'], type: 'Dessin', medium: ['Traditionnel','Numérique'], description: 'Illustration d\'un personnage pour un jeu de rôle sur le thème des contes. Le chapelier fou.' },
    { src: 'https://i.imgur.com/xE481an.jpeg', year: ['2023'], type: 'Dessin', medium: ['Traditionnel','Numérique'], description: 'Illustration d\'un personnage pour un jeu de rôle sur le thème des contes. Le marchand de sable.' },

    { src: 'https://i.imgur.com/WeRXqt7.jpeg', year: ['2022'], type: '3D', medium: ['Numérique'], project: 'La Fin', description: 'Rendu du personnage principal de mon film de 2e année à Waide Somme. Raymond le projectionniste maudit. Design, modélisation, rig et texturing.' },
    { src: 'https://i.imgur.com/4eAFGmc.jpeg', year: ['2022'], type: '3D', medium: ['Numérique'], project: 'La Fin', description: 'Rendu du personnage principal de mon film de 2e année à Waide Somme. Raymond le projectionniste maudit. Design, modélisation, rig et texturing.' },
    { src: 'https://i.imgur.com/t7OZu7Y.jpeg', year: ['2022'], type: '3D', medium: ['Numérique'], project: 'La Fin', description: 'Rendu du décor de mon film de 2e année à Waide Somme. La façade du cinéma. Design, modélisation et texturing.' },
    { src: 'https://i.imgur.com/LOWAHl2.jpeg', year: ['2022'], type: '3D', medium: ['Numérique'], project: 'La Fin', description: 'Rendu du décor de mon film de 2e année à Waide Somme. La façade du cinéma. Design, modélisation et texturing.' },
    { src: 'https://i.imgur.com/JLrnHCX.jpeg', year: ['2022'], type: '3D', medium: ['Numérique'], project: 'La Fin', description: 'Une image de mon film de 2e année à Waide Somme. Design, modélisation, rig et texturing du personnage et des décors.' },
    { src: 'https://i.imgur.com/HKBJVT9.jpeg', year: ['2022'], type: '3D', medium: ['Numérique'], project: 'La Fin', description: 'Rendu d\'un props de mon film de 2e année à Waide Somme. Un cendrier. Design, modélisation et texturing.' },

    
    { src: 'https://i.imgur.com/xrK2n5w.jpeg', year: ['2021'], type: ['Dessin','Illustration'], medium: ['Numérique','Traditionnel'], project: '', description: 'Aquarelle et photographie.' },
    { src: 'https://i.imgur.com/T81gPYH.jpeg', year: ['2021'], type: ['Dessin','Illustration'], medium: ['Numérique'], project: '', description: 'Dessin numérique sur une image du film "Perfection" de Richard Shepard.' },
    { src: 'https://i.imgur.com/mLV2xJo.jpeg', year: ['2021'], type: ['Dessin','Illustration'], medium: ['Numérique'], project: '', description: 'Dessiné sur Krita. Personnages par bybatcher.github.io' },
];

//    { src: 'https://i.imgur.com/XkClidx.jpeg', year: '2023', type: 'Dessin', medium: 'Traditionnel', project: 'La Fin', description: 'Un Dragon ???????' },
//    { src: 'https://i.imgur.com/4nXw7WM.jpeg', year: '2022', type: 'Illustration', medium: 'Numérique', project: 'Souvenir de la pierre', description: 'Description pour l\'image 3.' },
//    { src: 'https://i.imgur.com/zVtvQGp.jpeg', year: '2021', type: 'Animation', medium: 'Traditionnel', project: 'Le Feutre', description: 'Description pour l\'image 4.' },
//    { src: 'https://i.imgur.com/0lX2q4e.jpeg', year: '2024', type: 'Dessin', medium: 'Numérique', project: '', description: 'AAAAAAAAAAAAAAAAAAAAAAAAA' },
//    { src: 'https://i.imgur.com/Ep7hxu9.jpeg', year: '2024', type: 'Dessin', medium: 'Numérique', project: 'Souvenir de la pierre', description: 'Description pour l\'image 6.' }

