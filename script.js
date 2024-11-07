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
    });
});
