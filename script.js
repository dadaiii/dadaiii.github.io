document.addEventListener('DOMContentLoaded', function() {
    let activeFilter = null; // Utilisez une variable pour stocker le filtre actif

    // Fonction pour afficher les images dans la galerie
    function renderImages(filteredImages) {
        const portfolio = document.getElementById('portfolioContainer');
        portfolio.innerHTML = ''; // Clear previous content

        // Trier les images par année (ordre décroissant)
        filteredImages.sort((a, b) => b.year.localeCompare(a.year));

        filteredImages.forEach(image => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('portfolio-item');

            const imgElement = document.createElement('img');
            imgElement.src = image.src;
            imgElement.alt = 'Portfolio Image';

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
            return image[activeFilter.type] === activeFilter.value;
        });

        console.log('Filtered Images:', filteredImages);
        renderImages(filteredImages);
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
    { src: 'https://i.imgur.com/nUhl3ab.jpeg', year: '2024', type: 'Animation', medium: 'Numérique', project: 'Le Feutre', description: 'Une image random que j\'ai trouvée sur Imgur. Est-ce que c\'est de l\'IA ?' },
    { src: 'https://i.imgur.com/XkClidx.jpeg', year: '2023', type: 'Dessin', medium: 'Traditionnel', project: 'La Fin', description: 'Un Dragon ???????' },
    { src: 'https://i.imgur.com/4nXw7WM.jpeg', year: '2022', type: 'Illustration', medium: 'Numérique', project: 'Souvenir de la pierre', description: 'Description pour l\'image 3.' },
    { src: 'https://i.imgur.com/zVtvQGp.jpeg', year: '2021', type: 'Animation', medium: 'Traditionnel', project: 'Le Feutre', description: 'Description pour l\'image 4.' },
    { src: 'https://i.imgur.com/0lX2q4e.jpeg', year: '2024', type: 'Dessin', medium: 'Numérique', project: '', description: 'AAAAAAAAAAAAAAAAAAAAAAAAA' },
    { src: 'https://i.imgur.com/Ep7hxu9.jpeg', year: '2024', type: 'Dessin', medium: 'Numérique', project: 'Souvenir de la pierre', description: 'Description pour l\'image 6.' }
];
