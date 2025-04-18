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
