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
        event.stopPropagation();

        const subFolder = this.querySelector('ul');
        if (subFolder) {
            subFolder.style.display = subFolder.style.display === 'block' ? 'none' : 'block';
        }

        if (this.id && this.id.startsWith('le-film')) {
            const videoContent = document.getElementById('video-content');
            const videoPlayer = document.getElementById('film-player');
            let videoUrl = ""; 

            switch(this.id) {
                case "le-film-feutre":
                    videoUrl = "https://www.youtube.com/embed/MvvCZeqBebY"; 
                    break;
                case "le-film-fin":
                    videoUrl = "https://www.youtube.com/embed/D2OSE5Fnw7g"; 
                    break;
                case "le-film-seanmhathair":
                    videoUrl = "https://www.youtube.com/embed/bKtLhx3766s"; 
                    break;
                case "le-film-maison-poupees":
                    videoUrl = "https://www.youtube.com/embed/ID_MAISON_POUPEES"; 
                    break;
                case "le-film-camion":
                    videoUrl = "https://www.youtube.com/embed/ID_CAMION"; 
                    break;
            }

            videoPlayer.src = videoUrl;
            videoContent.style.display = 'block'; // Afficher le lecteur vidéo
        }
    });
});

