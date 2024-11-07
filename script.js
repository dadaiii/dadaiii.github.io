// Liste des titres possibles
const titles = [
    "Bienvenue sur le site de Elisa!",
    "Site 100% humain!",
    "Site garantis sans colorant!",
    "WOW UN VISITEUR!!!!",
    "Merci de regarder mon site :)"
];

// Choisir un titre aléatoire
const randomTitle = titles[Math.floor(Math.random() * titles.length)];

// Appliquer le titre sélectionné
document.title = randomTitle;

// Sélectionne tous les éléments ayant la classe "folder" dans la sidebar
document.querySelectorAll('.sidebar .folder').forEach(folder => {
    folder.addEventListener('click', function(event) {
        // Empêche la propagation du clic aux éléments parents
        event.stopPropagation();

        // Sélectionne le sous-dossier (ul) suivant le dossier cliqué
        const subFolder = this.querySelector('ul');
        if (subFolder) {
            // Change l'état d'affichage du sous-dossier (affiche ou masque)
            subFolder.style.display = subFolder.style.display === 'block' ? 'none' : 'block';
        }

        // Si le dossier cliqué est "Le film", afficher le lecteur vidéo
        if (this.id && this.id.startsWith('le-film')) {
            const videoContent = document.getElementById('video-content');
            const videoPlayer = document.getElementById('film-player');
            let videoUrl = ""; // Variable pour l'URL de la vidéo

            // Définir l'URL de la vidéo YouTube en fonction du dossier
            switch(this.id) {
                case "le-film-feutre":
                    videoUrl = "https://www.youtube.com/embed/D2OSE5Fnw7g"; // Remplacez par l'ID réel de YouTube
                    break;
                case "le-film-fin":
                    videoUrl = "https://www.youtube.com/embed/D2OSE5Fnw7g"; // ID de la vidéo "La fin"
                    break;
                case "le-film-seanmhathair":
                    videoUrl = "https://www.youtube.com/embed/ID_SEANMHATHAIR"; // Remplacez par l'ID réel de YouTube
                    break;
                case "le-film-maison-poupees":
                    videoUrl = "https://www.youtube.com/embed/ID_MAISON_POUPEES"; // Remplacez par l'ID réel de YouTube
                    break;
                case "le-film-camion":
                    videoUrl = "https://www.youtube.com/embed/ID_CAMION"; // Remplacez par l'ID réel de YouTube
                    break;
            }

            // Mettre à jour la source de la vidéo
            videoPlayer.src = videoUrl;

            // Afficher le contenu vidéo
            videoContent.style.display = 'block'; // Rendre visible le lecteur vidéo
        }
    });
});
