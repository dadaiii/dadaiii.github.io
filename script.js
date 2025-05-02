window.addEventListener('DOMContentLoaded', () => {
    const articles = document.querySelectorAll('.article-container');
    const hash = window.location.hash;

    if (hash) {
        // Cacher tous les articles d'abord
        articles.forEach(article => {
            article.style.display = 'none';
        });

        // Afficher l'article correspondant à l'ID dans l'URL
        const targetArticle = document.querySelector(hash);
        if (targetArticle) {
            targetArticle.style.display = 'block';
        }
    } else {
        // Si aucune ancre n'est spécifiée, tout est caché
        articles.forEach(article => {
            article.style.display = 'none';
        });
    }

    // Liste des textes de bienvenue
    const welcomeMessages = [
        "Bienvenue sur Elisalane.com, y'a plein de trucs à voir :)",
        "Merci de passer par mon site ! Il est pas fou mais il est à moi.",
        "Il vous plait mon site ? C'est moi qui l'ai fait !",
        "Merci de visiter Elisalane.com ! C'est ici que je partage mes créations.",
        "Promis je suis plus douée en animation qu'en html."
    ];

    // Sélectionne un message aléatoire
    const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];

    // Affiche le message dans la section de bienvenue
    document.getElementById("welcome-text").querySelector("p").textContent = randomMessage;
});


// Carrousel d'images pour souvenirs de la pierre
let currentIndex = 0;

// Définissez les images uniquement ici
const images = [
    "https://imgur.com/it4jsei.jpg",
    "https://imgur.com/TOy635P.jpg",
    "https://imgur.com/PVYyIvX.jpg",
    "https://imgur.com/Wd0zgdn.jpg",
    "https://imgur.com/FQ2IbmG.jpg",
    "https://imgur.com/KDunwJf.jpg",
    "https://imgur.com/FRsPyl8.jpg",
    "https://imgur.com/6PGPRRW.jpg",
    "https://imgur.com/LQuXTYW.jpg",
    "https://imgur.com/gRbP12j.jpg",
    "https://imgur.com/ileEkmp.jpg",
    "https://imgur.com/g9eDNtr.jpg",
    "https://imgur.com/yLyt99R.jpg",
    "https://imgur.com/y8b1sD7.jpg",
    "https://imgur.com/9pYEHHu.jpg",
    "https://imgur.com/DH9jNhy.jpg",
    "https://imgur.com/DORZIgs.jpg",
    "https://imgur.com/GSmFi9z.jpg",
    "https://imgur.com/Y7CwFyF.jpg",
    "https://imgur.com/rXpSsNC.jpg",
    "https://imgur.com/ijEpP4H.jpg",
    "https://imgur.com/BO0aIwj.jpg",
    "https://imgur.com/DwFWKQU.jpg",
    "https://imgur.com/K3dEghy.jpg",
    "https://imgur.com/YNS8QkK.jpg",
    "https://imgur.com/vSqSUZq.jpg",
    "https://imgur.com/PrF9WTm.jpg",
    "https://imgur.com/yL4sK5I.jpg",
    "https://imgur.com/AHkRRh3.jpg",
    "https://imgur.com/z48B40I.jpg",
    "https://imgur.com/jnlpsXi.jpg",
    "https://imgur.com/jZZzNZw.jpg",
    "https://imgur.com/axTZWzF.jpg",
    "https://imgur.com/jgLWhfq.jpg",
    "https://imgur.com/QdxAnKh.jpg",
    "https://imgur.com/zkJrLMX.jpg",
    "https://imgur.com/YhJ1TDx.jpg",
    "https://imgur.com/hgur9zK.jpg",
    "https://imgur.com/94E2gOz.jpg",
    "https://imgur.com/RyYRtHC.jpg",
    "https://imgur.com/FGwaUyk.jpg",
    "https://imgur.com/n3rcwKm.jpg",
    "https://imgur.com/AJGpNAK.jpg",
    "https://imgur.com/Jt4o0Ru.jpg",
    "https://imgur.com/gJ5hJjK.jpg",
    "https://imgur.com/4CQfYeh.jpg",
    "https://imgur.com/un6EWP0.jpg",
    "https://imgur.com/LMsAjQ1.jpg",
    "https://imgur.com/sNMyihZ.jpg",
    "https://imgur.com/VJrDrWU.jpg",
    "https://imgur.com/lk4GnOY.jpg",
    "https://imgur.com/PwY2XlO.jpg",
    "https://imgur.com/E9ERNeH.jpg",
    "https://imgur.com/yzy72aB.jpg",
    "https://imgur.com/zJFsx1l.jpg"
];

// Fonction pour précharger les images
function preloadImages(imageUrls) {
    imageUrls.forEach((url) => {
        const img = new Image();
        img.src = url;
    });
}

function updateCarousel() {
    const carouselImages = document.querySelector(".carousel-images");
    carouselImages.innerHTML = `
        <img src="${images[currentIndex]}" alt="Image du projet Seanmathair" onclick="openLightbox('${images[currentIndex]}')">
        <img src="${images[(currentIndex + 1) % images.length]}" alt="Image du projet Seanmathair" onclick="openLightbox('${images[(currentIndex + 1) % images.length]}')">
    `;
}

function prevImages(event) {
    if (event) event.preventDefault(); // Empêche le comportement par défaut
    currentIndex = (currentIndex - 2 + images.length) % images.length;
    updateCarousel();
}

function nextImages(event) {
    if (event) event.preventDefault(); // Empêche le comportement par défaut
    currentIndex = (currentIndex + 2) % images.length;
    updateCarousel();
}

// Initialisation du carrousel
document.addEventListener("DOMContentLoaded", () => {
    preloadImages(images); // Précharge toutes les images
    updateCarousel(); // Initialise le carrousel
});
