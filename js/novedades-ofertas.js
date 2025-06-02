// Datos de ejemplo (en un proyecto real, vendrían de una API o base de datos)
const productosNovedades = [
    {
        id: 9,
        nombre: "Camiseta deportiva manga larga",
        categoria: "running",
        precio: 89.99,
        imagen: "img/productos/camiseta.jpg",
        nuevo: true,
        fecha: "2025-05-01"
    },

    {
        id: 10,
        nombre: "conjunto leggins 2025",
        categoria: "yoga",
        precio: 99.99,
        imagen: "img/productos/leggins.jpg",
        nuevo: true,
        fecha: "2025-05-01"
    },
     
    {
        id: 11,
        nombre: "Conjuto deportivo Unisex",
        categoria: "running",
        precio: 149.99,
        imagen: "img/productos/conjunto.jpg",
        nuevo: true,
        fecha: "2025-05-01"
    },

    {
        id: 12,
        nombre: "Conjuto Deportivo para Mujer",
        categoria: "tenis",
        precio: 69.99,
        imagen: "img/productos/conjuntoshort.jpg",
        nuevo: true,
        fecha: "2025-05-01"
    },
     
     
    // + más productos...
];

const productosOfertas = productos.filter(p => p.oferta); // Filtra los productos con oferta

// Cargar novedades
function cargarNovedades() {
    const contenedor = document.getElementById('novedades-container');
    if (!contenedor) return;

    productosNovedades.forEach(producto => {
        contenedor.innerHTML += `
            <div class="product-card" data-id="${producto.id}" data-category="${producto.categoria}">
                <span class="badge new">Nuevo</span>
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <div class="product-info">
                    <h3>${producto.nombre}</h3>
                    <div class="price">${producto.precio.toFixed(2)}€</div>
                    <button class="btn add-to-cart">Añadir al Carrito</button>
                </div>
            </div>
        `;
    });
}

// Cargar ofertas
function cargarOfertas() {
    const contenedor = document.getElementById('ofertas-container');
    if (!contenedor) return;

    productosOfertas.forEach(producto => {
        contenedor.innerHTML += `
            <div class="product-card" data-id="${producto.id}">
                <span class="badge">Oferta</span>
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <div class="product-info">
                    <h3>${producto.nombre}</h3>
                    <div class="price">
                        ${producto.precio.toFixed(2)}€
                        <span class="old-price">${producto.precio_anterior.toFixed(2)}€</span>
                    </div>
                    <button class="btn add-to-cart">Añadir al Carrito</button>
                </div>
            </div>
        `;
    });
}

// Filtros para novedades
document.querySelectorAll('.btn-filter').forEach(btn => {
    btn.addEventListener('click', function() {
        const filter = this.getAttribute('data-filter');
        document.querySelectorAll('.product-card').forEach(card => {
            card.style.display = (filter === 'all' || card.getAttribute('data-category') === filter) 
                ? 'block' 
                : 'none';
        });
        
        // Actualizar botón activo
        document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    cargarNovedades();
    cargarOfertas();
    
    // Añadir eventos al carrito (si existe la función)
    if (typeof agregarAlCarrito === 'function') {
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', agregarAlCarrito);
        });
    }
});