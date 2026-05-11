/* =========================================================
   ESTADO GLOBAL
   ========================================================= */
let isServiceModalClosing = false;
let isGalleryModalClosing = false;
let currentGalleryIndex = 0;

/* =========================================================
   DATOS DE LA GALERÍA - ACTUALIZADO A 26
   ========================================================= */
const galleryItems = [];
for (let i = 1; i <= 26; i++) {
    galleryItems.push({
        src: `images/photo${i}.jpg`, // Ruta dinámica para photo1 a photo26
        title: `Modelo ${i}`
    });
}

/* =========================================================
   INICIALIZAR ÍCONOS LUCIDE
   ========================================================= */
document.addEventListener("DOMContentLoaded", function () {
    if (window.lucide) {
        lucide.createIcons();
    }
});

/* =========================================================
   CONTROL DEL MODAL DE CONTACTO
   ========================================================= */
function toggleModal() {
    const modal = document.getElementById("contactModal");
    if (!modal) return;
    modal.classList.toggle("hidden");
    const isHidden = modal.classList.contains("hidden");
    document.body.style.overflow = isHidden ? "" : "hidden";
}

/* =========================================================
   CONTROL DE LA SECCIÓN LEGAL
   ========================================================= */
function toggleLegal() {
    const legalSection = document.getElementById("legalSection");
    if (!legalSection) return;
    legalSection.classList.toggle("hidden");
}

/* =========================================================
   OBSERVADOR DEL MODAL DE CONTACTO
   ========================================================= */
const observer = new MutationObserver(() => {
    const modal = document.getElementById("contactModal");
    const serviceModal = document.getElementById("serviceModal");
    const galleryModal = document.getElementById("galleryModal");
    if (!modal) return;

    const contactIsOpen = !modal.classList.contains("hidden");
    const serviceIsOpen = serviceModal && !serviceModal.classList.contains("hidden");
    const galleryIsOpen = galleryModal && !galleryModal.classList.contains("hidden");

    document.body.style.overflow = (contactIsOpen || serviceIsOpen || galleryIsOpen) ? "hidden" : "";
});

document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("contactModal");
    if (modal) {
        observer.observe(modal, { attributes: true, attributeFilter: ["class"] });
    }
});

/* =========================================================
   MODAL DE SERVICIOS
   ========================================================= */
function openServiceModal(title, image, description) {
    const modal = document.getElementById("serviceModal");
    const overlay = document.getElementById("serviceModalOverlay");
    const panel = document.getElementById("serviceModalPanel");
    const modalTitle = document.getElementById("serviceModalTitle");
    const modalImage = document.getElementById("serviceModalImage");
    const modalDescription = document.getElementById("serviceModalDescription");

    if (!modal || !overlay || !panel) return;

    modalTitle.textContent = title;
    modalImage.src = image;
    modalDescription.textContent = description;

    modal.classList.remove("hidden");
    requestAnimationFrame(() => {
        overlay.classList.remove("opacity-0");
        panel.classList.remove("opacity-0", "scale-95", "translate-y-4");
        panel.classList.add("opacity-100", "scale-100", "translate-y-0");
    });
}

function closeServiceModal() {
    const modal = document.getElementById("serviceModal");
    const overlay = document.getElementById("serviceModalOverlay");
    const panel = document.getElementById("serviceModalPanel");
    if (!modal || isServiceModalClosing) return;

    isServiceModalClosing = true;
    overlay.classList.add("opacity-0");
    panel.classList.add("opacity-0", "scale-95", "translate-y-4");

    setTimeout(() => {
        modal.classList.add("hidden");
        isServiceModalClosing = false;
    }, 300);
}

/* =========================================================
   MODAL DE GALERÍA (ZOOM)
   ========================================================= */
function openGalleryModal(index) {
    const modal = document.getElementById("galleryModal");
    const overlay = document.getElementById("galleryModalOverlay");
    const panel = document.getElementById("galleryModalPanel");

    if (!modal || !galleryItems[index]) return;

    currentGalleryIndex = index;
    updateGalleryModalContent();

    modal.classList.remove("hidden");
    requestAnimationFrame(() => {
        overlay.classList.remove("opacity-0");
        panel.classList.add("opacity-100", "scale-100", "translate-y-0");
    });
}

function updateGalleryModalContent() {
    const modalImage = document.getElementById("galleryModalImage");
    const modalTitle = document.getElementById("galleryModalTitle");
    const item = galleryItems[currentGalleryIndex];
    if (modalImage && item) {
        modalImage.src = item.src;
        modalTitle.textContent = item.title;
    }
}

function showNextGalleryImage() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
    updateGalleryModalContent();
}

function showPrevGalleryImage() {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
    updateGalleryModalContent();
}

function closeGalleryModal() {
    const modal = document.getElementById("galleryModal");
    if (!modal || isGalleryModalClosing) return;
    isGalleryModalClosing = true;
    modal.classList.add("hidden");
    isGalleryModalClosing = false;
}

/* =========================================================
   CARRUSEL AUTOMÁTICO - CORREGIDO PARA 26 FOTOS
   ========================================================= */
document.addEventListener("DOMContentLoaded", function () {
    const track = document.getElementById("seasonCarouselTrack");
    const prevBtn = document.getElementById("seasonPrevBtn");
    const nextBtn = document.getElementById("seasonNextBtn");

    if (!track) return;

    let autoScrollSpeed = 0.5; // Ajusta la velocidad aquí
    let isPaused = false;
    let currentTranslate = 0;
    
    // CAMBIO CLAVE: Ahora cuenta las 26 imágenes correctamente
    const totalItems = 26; 

    function getCardStep() {
        const firstCard = track.querySelector(".season-card");
        return firstCard ? firstCard.offsetWidth + 24 : 244;
    }

    function loopCarousel() {
        if (!isPaused) {
            currentTranslate -= autoScrollSpeed;
            const resetPoint = getCardStep() * totalItems;

            // Reinicia cuando llega al final de las 26 fotos
            if (Math.abs(currentTranslate) >= resetPoint) {
                currentTranslate = 0;
            }
            track.style.transform = `translate3d(${currentTranslate}px, 0, 0)`;
        }
        requestAnimationFrame(loopCarousel);
    }

    // Controles manuales
    if (nextBtn) nextBtn.addEventListener("click", () => { currentTranslate -= getCardStep(); });
    if (prevBtn) prevBtn.addEventListener("click", () => { currentTranslate += getCardStep(); });

    track.addEventListener("mouseenter", () => isPaused = true);
    track.addEventListener("mouseleave", () => isPaused = false);

    loopCarousel();
});

/* =========================================================
   CIERRE CON TECLADO
   ========================================================= */
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeGalleryModal();
        closeServiceModal();
        const contactModal = document.getElementById("contactModal");
        if (contactModal) contactModal.classList.add("hidden");
    }
    if (e.key === "ArrowRight") showNextGalleryImage();
    if (e.key === "ArrowLeft") showPrevGalleryImage();
});