document.addEventListener('DOMContentLoaded', function () {
    
    // Fonction pour masquer tous les contenus dans la zone de contenu
    function hideAllContent() {
        document.querySelectorAll('#content .content-section').forEach(section => {
            section.classList.add('hidden');
        });
    }

    // Masquer tout le contenu au chargement
    hideAllContent();

    // Affiche la section "Ma bande démo" par défaut
    const defaultFileId = "file-bande-demo-video"; // ID du fichier par défaut dans la sidebar
    const defaultFile = document.getElementById(defaultFileId);

    if (defaultFile) {
        const contentId = "bande-demo-video"; // ID de la section associée
        const contentSection = document.getElementById(contentId);

        if (contentSection) {
            contentSection.classList.remove('hidden'); // Affiche la section associée
        }

        // Si c'est une vidéo, configure l'iframe
        const iframe = contentSection.querySelector('iframe');
        const videoId = defaultFile.dataset.videoId; // Récupère l'ID YouTube depuis l'attribut 'data-video-id'
        if (iframe && videoId) {
            iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0&fs=1`;
        }

        // Ajoute la classe 'active' au bouton "bande demo" par défaut
        defaultFile.classList.add('active');
    }

    // Liste des titres possibles
    const titles = ["ElisaLane.com"];
    document.title = titles[Math.floor(Math.random() * titles.length)];

    // Gestion des clics dans la sidebar pour les dossiers
    document.querySelectorAll('.sidebar .folder').forEach(folder => {
        folder.addEventListener('click', function (event) {
            event.stopPropagation(); // Empêche la propagation pour éviter de fermer le dossier
            const subFolder = this.querySelector('ul');
            if (subFolder) subFolder.style.display = subFolder.style.display === 'block' ? 'none' : 'block';
        });
    });

    // Gestion des clics sur les fichiers
    document.querySelectorAll('.sidebar .file').forEach(file => {
        file.addEventListener('click', function (event) {
            event.stopPropagation(); // Empêche la propagation pour ne pas fermer le dossier

            // Masquer tous les contenus avant d'afficher le nouveau
            hideAllContent();

            // Afficher la section associée au fichier cliqué
            const contentId = this.id.replace('file-', ''); // Exemple : 'file-feutre-video' -> 'feutre-video'
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

            // Retirer la classe 'active' de tous les fichiers
            document.querySelectorAll('.sidebar li.file').forEach(f => f.classList.remove('active'));

            // Ajouter la classe 'active' au fichier cliqué
            this.classList.add('active');

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

    // Gestion du clic sur le menu hamburger pour mobile
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            const sidebar = document.querySelector('.sidebar');
            const isSidebarVisible = sidebar.classList.contains('show'); // Vérifier si la sidebar est visible par la présence de la classe 'show'

            // Ouvrir ou fermer la sidebar
            toggleSidebar(!isSidebarVisible);

            // Changer l'icône de la flèche
            if (isSidebarVisible) {
                menuToggle.classList.remove('close');
                menuToggle.classList.add('open');
            } else {
                menuToggle.classList.remove('open');
                menuToggle.classList.add('close');
            }
        });
    }

    // Ajout de défilement horizontal pour les sections avec overflow
    const contentSections = document.querySelectorAll('.content-section');
    contentSections.forEach(section => {
        // Si la section dépasse la largeur de l'écran, permet un défilement horizontal
        section.style.overflowX = 'auto';
        section.style.whiteSpace = 'nowrap'; // Empêche les sauts de ligne dans les éléments enfants
    });

    const files = document.querySelectorAll('.sidebar li.file'); // Sélectionne tous les fichiers

    files.forEach(file => {
        file.addEventListener('click', () => {
            // Retirer la classe active de tous les fichiers
            files.forEach(f => f.classList.remove('active'));

            // Ajouter la classe active à l'élément cliqué
            file.classList.add('active');
        });
    });

});
