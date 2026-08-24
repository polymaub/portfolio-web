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
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalTools = document.getElementById('modal-tools');
const modalArtstation = document.getElementById('modal-artstation');
const modalSketchfab = document.getElementById('modal-sketchfab');
const modalClose = document.getElementById('modal-close');

const projectCards = document.querySelectorAll('.project-card');

function openModal(card) {
  // Rellenamos el modal con los datos de la tarjeta clickeada
  modalTitle.textContent = card.dataset.title;
  modalDesc.textContent = card.dataset.desc;

  // Las herramientas vienen separadas por " · ", las convertimos en tags
  modalTools.innerHTML = '';
  card.dataset.tools.split('·').forEach(tool => {
    const span = document.createElement('span');
    span.className = 'tag';
    span.textContent = tool.trim();
    modalTools.appendChild(span);
  });

  modalArtstation.href = card.dataset.artstation;
  modalSketchfab.href = card.dataset.sketchfab;

  modalOverlay.hidden = false;
  document.body.style.overflow = 'hidden'; // evita el scroll de fondo mientras el modal está abierto
}

function closeModal() {
  modalOverlay.hidden = true;
  document.body.style.overflow = '';
}

projectCards.forEach(card => {
  card.addEventListener('click', () => openModal(card));
});

modalClose.addEventListener('click', closeModal);

// Cierra al hacer clic fuera del cuadro del modal (en el fondo oscuro)
modalOverlay.addEventListener('click', (event) => {
  if (event.target === modalOverlay) closeModal();
});

// Cierra al presionar la tecla Escape
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modalOverlay.hidden) closeModal();
});
