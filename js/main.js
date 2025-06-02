// Función para mostrar/ocultar menú en móviles
function toggleMenu() {
    const nav = document.querySelector('nav ul');
    nav.classList.toggle('active');
}

// Función para inicializar el carrusel de productos destacados
function inicializarCarrusel() {
    // Implementación de un carrusel simple
    // (En un proyecto real podrías usar una librería como Swiper)
}

// Función para manejar el scroll y efectos parallax
function manejarScroll() {
    // Efectos de scroll podrían ir aquí
}

// Función para inicializar toda la funcionalidad
function inicializar() {
    // Agregar event listener para el menú móvil
    const menuBtn = document.querySelector('.menu-btn');
    if (menuBtn) {
        menuBtn.addEventListener('click', toggleMenu);
    }
    
    // Inicializar carrusel si existe
    if (document.querySelector('.hero-slider')) {
        inicializarCarrusel();
    }
    
    // Manejar scroll
    window.addEventListener('scroll', manejarScroll);
    
    // Actualizar contador del carrito
    actualizarContadorCarrito();
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializar);