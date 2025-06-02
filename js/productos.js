// Datos de productos (en un proyecto real, estos vendrían de una base de datos)
const productos = [
    {
        id: 1,
        nombre: "Camiseta Running Tech",
        categoria: "running",
        genero: "hombre",
        precio: 29.99,
        precio_anterior: 39.99,
        imagen: "img/productos/camiseta-running-hombre.jpg",
        descripcion: "Camiseta transpirable para running con tecnología de secado rápido.",
        tallas: ["S", "M", "L", "XL"],
        colores: ["Negro", "Azul", "Blanco"],
        rating: 4.5,
        destacado: true
    },
    {
        id: 2,
        nombre: "Leggings Yoga Fit",
        categoria: "yoga",
        genero: "mujer",
        precio: 34.99,
        imagen: "img/productos/leggings-yoga-mujer.jpg",
        descripcion: "Leggings cómodos y elásticos para yoga y pilates.",
        tallas: ["XS", "S", "M", "L"],
        colores: ["Negro", "Morado", "Verde"],
        rating: 4.8,
        destacado: true
    },
    {
        id: 3,
        nombre: " Conjuto y Zapatillas",
        categoria: "running",
        genero: "unisex",
        precio: 89.99,
        precio_anterior: 109.99,
        imagen: "img/productos/conjunto-zapatillas.jpg",
        descripcion: "Zapatillas de running con amortiguación avanzada para mayor comodidad.",
        tallas: ["38", "39", "40", "41", "42", "43", "44"],
        colores: ["Negro/Rojo", "Blanco/Azul", "Gris"],
        rating: 4.7,
        destacado: true,
        oferta: true
    },
    {
        id: 4,
        nombre: "Chándal Fitness",
        categoria: "fitness",
        genero: "hombre",
        precio: 59.99,
        imagen: "img/productos/chandal-fitness.jpg",
        descripcion: "Conjunto de chándal para entrenamiento en gimnasio.",
        tallas: ["S", "M", "L", "XL"],
        colores: ["Negro", "Gris", "Azul Marino"],
        rating: 4.3,
        destacado: true
    },
    {
        id: 5,
        nombre: "Top Deportivo",
        categoria: "fitness",
        genero: "mujer",
        precio: 24.99,
        imagen: "img/productos/top-deportivo.jpg",
        descripcion: "Top deportivo de soporte medio para entrenamientos intensos.",
        tallas: ["XS", "S", "M", "L"],
        colores: ["Negro", "Rosa", "Azul"],
        rating: 4.6
    },
    {
        id: 6,
        nombre: "camisa deportiva Pro",
        categoria: "futbol",
        genero: "unisex",
        precio: 39.99,
        precio_anterior: 49.99,
        imagen: "img/productos/camisa-futbol.jpg",
        descripcion: "camisa deportiva profesional  para competición.",
        rating: 4.9,
        oferta: true
    },
    {
        id: 7,
        nombre: "Short Deportivo",
        categoria: "tenis",
        genero: "unisex",
        precio: 79.99,
        imagen: "img/productos/short-tenis.jpg",
        descripcion: "Raqueta de tenis profesional con marco de grafito.",
        rating: 4.7
    },
    {
        id: 8,
        nombre: "Camisa Deportiva",
        categoria: "accesorios",
        genero: "unisex",
        precio: 45.99,
        imagen: "img/productos/camisa-deportiva.jpg",
        descripcion: "Mochila espaciosa con compartimento para zapatillas y equipo.",
        rating: 4.4
    }
];

// Función para cargar productos destacados en la página de inicio
function cargarProductosDestacados() {
    const contenedor = document.getElementById('featured-products');
    if (!contenedor) return;

    const destacados = productos.filter(producto => producto.destacado);
    
    destacados.forEach(producto => {
        const productoHTML = `
            <div class="product-card" data-id="${producto.id}">
                ${producto.oferta ? '<span class="badge">Oferta</span>' : ''}
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <div class="product-info">
                    <h3>${producto.nombre}</h3>
                    <div class="price">
                        ${producto.precio.toFixed(2)}€
                        ${producto.precio_anterior ? `<span class="old-price">${producto.precio_anterior.toFixed(2)}€</span>` : ''}
                    </div>
                    <div class="rating">
                        ${generarEstrellas(producto.rating)}
                    </div>
                    <button class="btn add-to-cart">Añadir al Carrito</button>
                </div>
            </div>
        `;
        contenedor.innerHTML += productoHTML;
    });

    // Agregar event listeners a los botones
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', agregarAlCarrito);
    });
}

// Función para cargar todos los productos en la página de productos
function cargarTodosLosProductos() {
    const contenedor = document.getElementById('all-products');
    if (!contenedor) return;

    // Obtener parámetros de la URL para filtros
    const urlParams = new URLSearchParams(window.location.search);
    const categoria = urlParams.get('categoria');
    const genero = urlParams.get('genero');

    let productosFiltrados = [...productos];
    
    // Aplicar filtros
    if (categoria) {
        productosFiltrados = productosFiltrados.filter(p => p.categoria === categoria);
    }
    
    if (genero) {
        productosFiltrados = productosFiltrados.filter(p => p.genero === genero);
    }

    // Ordenar productos
    const sortBy = document.getElementById('sort-by') ? document.getElementById('sort-by').value : 'popularidad';
    
    switch(sortBy) {
        case 'precio-asc':
            productosFiltrados.sort((a, b) => a.precio - b.precio);
            break;
        case 'precio-desc':
            productosFiltrados.sort((a, b) => b.precio - a.precio);
            break;
        case 'novedades':
            // Aquí podríamos ordenar por fecha de lanzamiento si tuviéramos ese campo
            productosFiltrados.sort((a, b) => b.id - a.id);
            break;
        default:
            // Por defecto ordenar por rating (popularidad)
            productosFiltrados.sort((a, b) => b.rating - a.rating);
    }

    // Mostrar productos
    contenedor.innerHTML = '';
    
    if (productosFiltrados.length === 0) {
        contenedor.innerHTML = '<p class="no-products">No se encontraron productos con los filtros seleccionados.</p>';
        return;
    }

    productosFiltrados.forEach(producto => {
        const productoHTML = `
            <div class="product-card" data-id="${producto.id}">
                ${producto.oferta ? '<span class="badge">Oferta</span>' : ''}
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <div class="product-info">
                    <h3>${producto.nombre}</h3>
                    <div class="price">
                        ${producto.precio.toFixed(2)}€
                        ${producto.precio_anterior ? `<span class="old-price">${producto.precio_anterior.toFixed(2)}€</span>` : ''}
                    </div>
                    <div class="rating">
                        ${generarEstrellas(producto.rating)}
                    </div>
                    <button class="btn add-to-cart">Añadir al Carrito</button>
                </div>
            </div>
        `;
        contenedor.innerHTML += productoHTML;
    });

    // Agregar event listeners a los botones
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', agregarAlCarrito);
    });
}

// Función auxiliar para generar estrellas de rating
function generarEstrellas(rating) {
    let estrellas = '';
    const estrellasLlenas = Math.floor(rating);
    const mediaEstrella = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
        if (i <= estrellasLlenas) {
            estrellas += '<i class="fas fa-star"></i>';
        } else if (i === estrellasLlenas + 1 && mediaEstrella) {
            estrellas += '<i class="fas fa-star-half-alt"></i>';
        } else {
            estrellas += '<i class="far fa-star"></i>';
        }
    }
    
    return estrellas;
}

// Función para agregar producto al carrito
function agregarAlCarrito(e) {
    const productoId = parseInt(e.target.closest('.product-card').getAttribute('data-id'));
    const producto = productos.find(p => p.id === productoId);
    
    if (!producto) return;
    
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Verificar si el producto ya está en el carrito
    const itemExistente = carrito.find(item => item.id === productoId);
    
    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: 1
        });
    }
    
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
    
    // Mostrar notificación
    mostrarNotificacion(`${producto.nombre} añadido al carrito`);
}

// Función para mostrar notificación
function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion';
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.classList.add('mostrar');
    }, 10);
    
    setTimeout(() => {
        notificacion.classList.remove('mostrar');
        setTimeout(() => {
            document.body.removeChild(notificacion);
        }, 300);
    }, 3000);
}

// Cargar productos cuando la página esté lista
document.addEventListener('DOMContentLoaded', function() {
    cargarProductosDestacados();
    cargarTodosLosProductos();
    
    // Event listener para el selector de ordenación
    const sortSelect = document.getElementById('sort-by');
    if (sortSelect) {
        sortSelect.addEventListener('change', cargarTodosLosProductos);
    }
});


