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
});
