document.addEventListener('DOMContentLoaded', function() {
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

    // Fonction pour masquer tous les contenus dans la zone de contenu
    function hideAllContent() {
        document.querySelectorAll('#content .content-section').forEach(section => {
            section.classList.add('hidden');
        });
    }

    // Gestion des clics dans la sidebar pour les dossiers
    document.querySelectorAll('.sidebar .folder').forEach(folder => {
        folder.addEventListener('click', function(event) {
            event.stopPropagation();  // Empêche la propagation pour éviter de fermer le dossier
            const subFolder = this.querySelector('ul');
            if (subFolder) subFolder.style.display = subFolder.style.display === 'block' ? 'none' : 'block';
        });
    });

    // Gestion des clics sur les fichiers
    document.querySelectorAll('.sidebar .file').forEach(file => {
        file.addEventListener('click', function(event) {
            event.stopPropagation();  // Empêche la propagation pour ne pas fermer le dossier

            // Masquer tous les contenus avant d'afficher le nouveau
            hideAllContent();

            // Afficher la section associée au fichier cliqué
            const contentId = this.id.replace('file-', ''); // 'file-seanmhathair-video' -> 'seanmhathair-video'
            const contentSection = document.getElementById(contentId);

            if (contentSection) {
                contentSection.classList.remove('hidden');
                if (contentSection.id === 'seanmhathair-video') {
                    // Mettre à jour l'iframe pour la vidéo de Seanmhathair
                    const iframe = contentSection.querySelector('iframe');
                    if (iframe) {
                        iframe.src = 'https://www.youtube.com/embed/bKtLhx3766s?rel=0&modestbranding=1&showinfo=0&fs=0';
                    }
                } else if (contentSection.id === 'fin-video') {
                    // Mettre à jour l'iframe pour la vidéo de fin
                    const iframe = contentSection.querySelector('iframe');
                    if (iframe) {
                        iframe.src = 'https://www.youtube.com/embed/D2OSE5Fnw7g?rel=0&modestbranding=1&showinfo=0&fs=0';
                    }
                }
            }
        });
    });
});
