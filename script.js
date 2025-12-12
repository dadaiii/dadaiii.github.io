// script.js
// Centralise les comportements JS : lightbox, fullscreen PDF, et viewer page-by-page (PDF.js)

/* Lightbox */
function openLightbox(src) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.src = src;
    lightbox.style.display = 'flex';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function () {
    // Fermer la lightbox en cliquant en dehors de l'image
    const lb = document.getElementById('lightbox');
    if (lb) lb.addEventListener('click', function (e) {
        if (e.target === this) closeLightbox();
    });

    /* Fullscreen toggling for PDF containers */
    document.addEventListener('click', function (e) {
        if (!e.target.classList) return;
        if (e.target.classList.contains('pdf-fullscreen-btn')) {
            const btn = e.target;
            const container = btn.closest('.pdf-container');
            if (!container) return;
            const doc = document;
            const isFs = doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement;
            if (!isFs) {
                const request = container.requestFullscreen || container.webkitRequestFullscreen || container.mozRequestFullScreen || container.msRequestFullscreen;
                if (request) request.call(container);
            } else {
                const exit = doc.exitFullscreen || doc.webkitExitFullscreen || doc.mozCancelFullScreen || doc.msExitFullscreen;
                if (exit) exit.call(doc);
            }
        }
    });

    function updatePdfFsButtons() {
        const fsEl = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
        document.querySelectorAll('.pdf-fullscreen-btn').forEach(function (btn) {
            const parent = btn.closest('.pdf-container');
            if (!parent) return;
            if (fsEl && (fsEl === parent || fsEl.contains(parent))) {
                btn.classList.add('exit');
                // Use clear 'Quitter' label to avoid double 'x' conflict with viewer controls
                btn.textContent = 'Quitter';
            } else {
                btn.classList.remove('exit');
                btn.textContent = '⤢';
            }
        });
    }

    document.addEventListener('fullscreenchange', updatePdfFsButtons);
    document.addEventListener('webkitfullscreenchange', updatePdfFsButtons);
    document.addEventListener('mozfullscreenchange', updatePdfFsButtons);
    document.addEventListener('MSFullscreenChange', updatePdfFsButtons);

    // Try to initialize PDF.js viewer (page-by-page) for the built-in PDF iframe.
    // It will fall back to the iframe if loading fails (CORS / Drive access).
    initPdfPageViewer();
    // re-render when entering/exiting fullscreen so canvas fits the new size
    document.addEventListener('fullscreenchange', reRenderAllPdfViewers.bind(null));
    document.addEventListener('webkitfullscreenchange', reRenderAllPdfViewers.bind(null));
    document.addEventListener('mozfullscreenchange', reRenderAllPdfViewers.bind(null));
    document.addEventListener('MSFullscreenChange', reRenderAllPdfViewers.bind(null));
});

/* Minimal PDF.js page-by-page viewer
   This tries to fetch the PDF by converting the Google Drive preview URL to a direct download link.
   If loading via PDF.js fails (CORS or fetch error), we keep the iframe as-is.
*/
async function initPdfPageViewer() {
    const pdfContainers = document.querySelectorAll('.pdf-container');
    if (!pdfContainers.length) return;

    // Load PDF.js from CDN
    const pdfjsUrl = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.9.179/pdf.min.js';
    try {
        if (typeof window.pdfjsLib === 'undefined') {
            await loadScript(pdfjsUrl);
        }
        // set worker
        if (window.pdfjsLib && window.pdfjsLib.GlobalWorkerOptions) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.9.179/pdf.worker.min.js';
        }
    } catch (err) {
        // Can't load pdf.js -> leave iframe as-is
        return;
    }

    pdfContainers.forEach(async (container) => {
        const iframe = container.querySelector('iframe.pdf-embed');
        if (!iframe) return;
        const src = iframe.src;

        // Try to extract Google Drive ID and convert to direct download link
        const driveIdMatch = src.match(/\/d\/(.*?)\//);
        let pdfUrl = null;
        if (driveIdMatch && driveIdMatch[1]) {
            const id = driveIdMatch[1];
            pdfUrl = `https://drive.google.com/uc?export=download&id=${id}`;
        } else {
            // Not a drive link - try to use the iframe src directly
            pdfUrl = src;
        }

        // Create controls and canvas
        const viewer = document.createElement('div');
        viewer.className = 'pdf-viewer';
        viewer.innerHTML = `
            <div class="pdf-controls">
                <button class="pdf-prev">‹</button>
                <span class="pdf-page-info">Page <span class="pdf-current">1</span> / <span class="pdf-total">?</span></span>
                <button class="pdf-next">›</button>
            </div>
            <canvas class="pdf-canvas" aria-label="PDF Viewer"></canvas>
        `;
        // Insert viewer before the iframe
        container.insertBefore(viewer, iframe);

        const canvas = viewer.querySelector('canvas.pdf-canvas');
        const ctx = canvas.getContext('2d');
        const prevBtn = viewer.querySelector('.pdf-prev');
        const nextBtn = viewer.querySelector('.pdf-next');
        const currentEl = viewer.querySelector('.pdf-current');
        const totalEl = viewer.querySelector('.pdf-total');

        // Try to load the PDF
        let pdfDoc = null;
        try {
            pdfDoc = await window.pdfjsLib.getDocument({ url: pdfUrl }).promise;
        } catch (err) {
            // Could not load via pdf.js (probably CORS or permission) -> remove viewer and keep iframe
            viewer.remove();
            return;
        }

        let pageNum = 1;
        // expose data on the container to enable re-rendering after resize
        container._pdfDoc = pdfDoc;
        container._pageNum = pageNum;
        const renderPage = async (num) => {
            const page = await pdfDoc.getPage(num);
            const viewport = page.getViewport({ scale: 1 });
            // scale to container width
            const containerWidth = container.clientWidth;
            const scale = containerWidth / viewport.width * 0.95; // small margin
            const scaledViewport = page.getViewport({ scale });
            canvas.width = scaledViewport.width;
            canvas.height = scaledViewport.height;
            const renderContext = {
                canvasContext: ctx,
                viewport: scaledViewport
            };
            await page.render(renderContext).promise;
            currentEl.textContent = num;
            // store current page
            container._pageNum = num;
        };

        totalEl.textContent = pdfDoc.numPages;

        prevBtn.addEventListener('click', function () {
            if (pageNum <= 1) return;
            pageNum--;
            renderPage(pageNum);
        });
        nextBtn.addEventListener('click', function () {
            if (pageNum >= pdfDoc.numPages) return;
            pageNum++;
            renderPage(pageNum);
        });

        // Touch swipe navigation (mobile)
        let touchStartX = 0;
        canvas.addEventListener('touchstart', function (e) {
            if (e.touches && e.touches.length) touchStartX = e.touches[0].clientX;
        });
        canvas.addEventListener('touchend', function (e) {
            const touchEndX = e.changedTouches[0].clientX;
            const dx = touchEndX - touchStartX;
            if (dx < -40) { // swipe left -> next
                if (pageNum < pdfDoc.numPages) { pageNum++; renderPage(pageNum); }
            } else if (dx > 40) { // swipe right -> prev
                if (pageNum > 1) { pageNum--; renderPage(pageNum); }
            }
        });

        // Initial render
        renderPage(pageNum);

        // Hide the original iframe to avoid double UI
        iframe.style.display = 'none';
        // add a reference to the render function for external calls (resize/orientation)
        container._renderPage = renderPage;
    });

    // re-rendering is handled at the global level using reRenderAllPdfViewers
}

function loadScript(url) {
    return new Promise(function (resolve, reject) {
        const s = document.createElement('script');
        s.src = url;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
    });
}

// small throttle to avoid hogging CPU on resize
function throttle(fn, wait) {
    let last = 0;
    return function (...args) {
        const now = Date.now();
        if (now - last >= wait) {
            last = now;
            fn.apply(this, args);
        }
    };
}

// Re-render all viewers on resize/orientation change so the canvas scales properly
function reRenderAllPdfViewers() {
    document.querySelectorAll('.pdf-container').forEach((container) => {
        if (container._renderPage && container._pageNum) {
            // render with the current page
            try { container._renderPage(container._pageNum); } catch (e) { /* ignore */ }
        }
    });
}

window.addEventListener('resize', throttle(reRenderAllPdfViewers, 160));
window.addEventListener('orientationchange', reRenderAllPdfViewers);

/* Expose for debugging */
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
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
    const isResponsive = window.innerWidth <= 768; // Vérifie si l'écran est en mode responsive

    if (isResponsive) {
        // Affiche uniquement la première image en mode responsive
        carouselImages.innerHTML = `
            <img src="${images[currentIndex]}" alt="Image du projet Seanmathair" onclick="openLightbox('${images[currentIndex]}')">
        `;
    } else {
        // Affiche deux images côte à côte en mode normal 
        carouselImages.innerHTML = `
            <img src="${images[currentIndex]}" alt="Image du projet Seanmathair" onclick="openLightbox('${images[currentIndex]}')">
            <img src="${images[(currentIndex + 1) % images.length]}" alt="Image du projet Seanmathair" onclick="openLightbox('${images[(currentIndex + 1) % images.length]}')">
        `;
    }
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

window.addEventListener("resize", updateCarousel);
