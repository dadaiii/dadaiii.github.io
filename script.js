document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour masquer tous les contenus dans la zone de contenu
    function hideAllContent() {
        document.querySelectorAll('#content .content-section').forEach(section => {
            section.classList.add('hidden');
        });
    }

    // Masque tout le contenu au chargement
    hideAllContent();

    // Liste des titres possibles
    const titles = [
        "ElisaLane.com"
    ];

    // Choisir un titre aléatoire
    document.title = titles[Math.floor(Math.random() * titles.length)];

    // Gestion des clics dans la sidebar pour les dossiers
    document.querySelectorAll('.sidebar .folder').forEach(folder => {
        folder.addEventListener('click', function(event) {
            event.stopPropagation(); // Empêche la propagation pour éviter de fermer le dossier
            const subFolder = this.querySelector('ul');
            if (subFolder) subFolder.style.display = subFolder.style.display === 'block' ? 'none' : 'block';
        });
    });

    // Gestion des clics sur les fichiers
    document.querySelectorAll('.sidebar .file').forEach(file => {
        file.addEventListener('click', function(event) {
            event.stopPropagation(); // Empêche la propagation pour ne pas fermer le dossier

            // Masquer tous les contenus avant d'afficher le nouveau
            hideAllContent();

            // Afficher la section associée au fichier cliqué
            const contentId = this.id.replace('file-', ''); // Exemple : 'file-seanmhathair-video' -> 'seanmhathair-video'
            const contentSection = document.getElementById(contentId);

            if (contentSection) {
                contentSection.classList.remove('hidden');

                // Mise à jour dynamique de l'iframe si la section contient une vidéo
                const iframe = contentSection.querySelector('iframe');
                const videoId = this.dataset.videoId; // Récupère l'ID YouTube depuis un attribut 'data-video-id'
                if (iframe && videoId) {
                    iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0&fs=1`;
                }
            }

            // Si sur mobile, ferme la sidebar après le clic
            if (window.innerWidth <= 768) {
                toggleSidebar(false); // Ferme la sidebar sur mobile
            }
        });
    });

    // Fonction pour afficher ou masquer la sidebar (Menu hamburger)
    function toggleSidebar(visible) {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('show', visible); // Ajoute ou enlève la classe 'show' pour contrôler l'affichage
    }

    // Fonction pour initialiser l'état de la flèche à gauche (position fermée)
    function initializeMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        if (menuToggle) {
            menuToggle.classList.remove('open');
            menuToggle.classList.add('close'); // Par défaut, flèche à gauche
        }
    }

    // Appel pour initialiser l'état de la flèche au chargement
    initializeMenu();

    // Gestion du clic sur le menu hamburger pour mobile
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            const sidebar = document.querySelector('.sidebar');
            const isSidebarVisible = sidebar.classList.contains('show'); // Vérifier si la sidebar est visible par la présence de la classe 'show'

            // 1. D'abord, change la position de la flèche
            if (isSidebarVisible) {
                // Si la sidebar est déjà visible, ferme le menu et repositionne la flèche
                menuToggle.classList.remove('open');
                menuToggle.classList.add('close');
            } else {
                // Si la sidebar est fermée, ouvre le menu et déplace la flèche
                menuToggle.classList.remove('close');
                menuToggle.classList.add('open');
            }

            // 2. Ensuite, affiche ou masque la sidebar
            toggleSidebar(!isSidebarVisible);
        });
    }

    // Ajout de défilement horizontal pour les sections avec overflow
    const contentSections = document.querySelectorAll('.content-section');
    contentSections.forEach(section => {
        // Si la section dépasse la largeur de l'écran, permet un défilement horizontal
        section.style.overflowX = 'auto';
        section.style.whiteSpace = 'nowrap'; // Empêche les sauts de ligne dans les éléments enfants
    });
});
