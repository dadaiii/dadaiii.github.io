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
        "Bienvenue sur le site de Elisa!",
        "Site 100% humain!",
        "Site garanti sans colorant!",
        "WOW UN VISITEUR!!!!",
        "Merci de regarder mon site :)"
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
        });
    });
});
