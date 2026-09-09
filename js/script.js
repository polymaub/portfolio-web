/* =========================================================
   MENÚ MÓVIL
   Al hacer clic en el botón hamburguesa, se agrega/quita
   la clase "open" al menú, y el CSS se encarga de mostrarlo.
   ========================================================= */
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Cierra el menú móvil automáticamente al hacer clic en un link
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mainNav.classList.remove('open'));
});


/* =========================================================
   MODAL DE PIEZAS
   Cada tarjeta .project-card tiene datos guardados en
   atributos data-* (data-title, data-desc, etc). Cuando
   se hace clic, leemos esos datos y los mostramos en el modal.
   ========================================================= */
const modalOverlay = document.getElementById('modal-overlay');
const carouselViewport = document.getElementById('carousel-viewport');
const carouselDots = document.getElementById('carousel-dots');
const carouselPrev = document.getElementById('carousel-prev');
const carouselNext = document.getElementById('carousel-next');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalTools = document.getElementById('modal-tools');
const modalArtstation = document.getElementById('modal-artstation');
const modalSketchfab = document.getElementById('modal-sketchfab');
const modalClose = document.getElementById('modal-close');

const projectCards = document.querySelectorAll('.project-card');

// Estado del carrusel: qué lista de medios estamos mostrando, y en qué posición
let carouselItems = [];
let carouselIndex = 0;

function isVideo(path) {
  return path.trim().toLowerCase().endsWith('.mp4');
}

function renderCarouselItem() {
  const path = carouselItems[carouselIndex].trim();
  carouselViewport.innerHTML = ''; // limpiamos lo que hubiera antes

  if (isVideo(path)) {
    const video = document.createElement('video');
    video.src = path;
    video.controls = true;
    video.autoplay = true;
    video.loop = true;
    video.muted = true; // los navegadores solo autorreproducen si está muted
    carouselViewport.appendChild(video);
  } else {
    const img = document.createElement('img');
    img.src = path;
    img.alt = modalTitle.textContent;
    carouselViewport.appendChild(img);
  }

  // Actualiza los puntitos: cuál está activo
  [...carouselDots.children].forEach((dot, i) => {
    dot.classList.toggle('active', i === carouselIndex);
  });
}

function goToSlide(index) {
  carouselIndex = (index + carouselItems.length) % carouselItems.length; // ciclo infinito
  renderCarouselItem();
}

function openModal(card) {
  // Rellenamos el modal con los datos de la tarjeta clickeada
  carouselItems = card.dataset.media.split(',');
  carouselIndex = 0;

  // Construye un puntito por cada imagen/video de esta pieza
  carouselDots.innerHTML = '';
  carouselItems.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `Ver elemento ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    carouselDots.appendChild(dot);
  });

  modalTitle.textContent = card.dataset.title;
  modalDesc.textContent = card.dataset.desc;
  renderCarouselItem();

  // Las herramientas vienen separadas por " · ", las convertimos en tags
  modalTools.innerHTML = '';
  card.dataset.tools.split('·').forEach(tool => {
    const span = document.createElement('span');
    span.className = 'tag';
    span.textContent = tool.trim();
    modalTools.appendChild(span);
  });

  // Si una pieza no tiene link (data-artstation="#" o vacío), ocultamos ese botón en vez de mostrar uno roto
  modalArtstation.href = card.dataset.artstation;
  modalArtstation.style.display = (card.dataset.artstation && card.dataset.artstation !== '#') ? '' : 'none';

  modalSketchfab.href = card.dataset.sketchfab;
  modalSketchfab.style.display = (card.dataset.sketchfab && card.dataset.sketchfab !== '#') ? '' : 'none';

  modalOverlay.hidden = false;
  document.body.style.overflow = 'hidden'; // evita el scroll de fondo mientras el modal está abierto
}

function closeModal() {
  modalOverlay.hidden = true;
  document.body.style.overflow = '';
  carouselViewport.innerHTML = ''; // corta cualquier video que estuviera sonando/reproduciéndose
}

projectCards.forEach(card => {
  card.addEventListener('click', () => openModal(card));
});

carouselPrev.addEventListener('click', () => goToSlide(carouselIndex - 1));
carouselNext.addEventListener('click', () => goToSlide(carouselIndex + 1));

modalClose.addEventListener('click', closeModal);

// Cierra al hacer clic fuera del cuadro del modal (en el fondo oscuro)
modalOverlay.addEventListener('click', (event) => {
  if (event.target === modalOverlay) closeModal();
});

// Cierra al presionar la tecla Escape, navega con las flechas del teclado
document.addEventListener('keydown', (event) => {
  if (modalOverlay.hidden) return;
  if (event.key === 'Escape') closeModal();
  if (event.key === 'ArrowLeft') goToSlide(carouselIndex - 1);
  if (event.key === 'ArrowRight') goToSlide(carouselIndex + 1);
});
