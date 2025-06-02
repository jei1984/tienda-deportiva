// Función para cargar los items del carrito
function cargarCarrito() {
    const contenedor = document.getElementById('cart-items');
    const resumen = document.querySelector('.cart-summary');
    
    if (!contenedor) return;
    
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <div class="empty-cart-message">
                <p>Tu carrito está vacío</p>
                <a href="productos.html" class="btn">Ver Productos</a>
            </div>
        `;
        resumen.style.display = 'none';
        return;
    }
    
    resumen.style.display = 'block';
    contenedor.innerHTML = '';
    
    let subtotal = 0;
    
    carrito.forEach(item => {
        const itemHTML = `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.imagen}" alt="${item.nombre}">
                <div class="cart-item-details">
                    <h3>${item.nombre}</h3>
                    <div class="price">${item.precio.toFixed(2)}€</div>
                    <div class="cart-item-quantity">
                        <button class="decrement">-</button>
                        <input type="number" value="${item.cantidad}" min="1">
                        <button class="increment">+</button>
                    </div>
                    <div class="cart-item-total">Total: ${(item.precio * item.cantidad).toFixed(2)}€</div>
                    <div class="cart-item-remove">Eliminar</div>
                </div>
            </div>
        `;
        contenedor.innerHTML += itemHTML;
        
        subtotal += item.precio * item.cantidad;
    });
    
    // Calcular envío (ejemplo: gratis para compras > 50€)
    const envio = subtotal > 50 ? 0 : 4.99;
    const total = subtotal + envio;
    
    // Actualizar resumen
    document.getElementById('subtotal').textContent = subtotal.toFixed(2) + '€';
    document.getElementById('shipping').textContent = envio.toFixed(2) + '€';
    document.getElementById('total').textContent = total.toFixed(2) + '€';
    
    // Agregar event listeners a los botones
    document.querySelectorAll('.increment').forEach(btn => {
        btn.addEventListener('click', incrementarCantidad);
    });
    
    document.querySelectorAll('.decrement').forEach(btn => {
        btn.addEventListener('click', decrementarCantidad);
    });
    
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', eliminarDelCarrito);
    });
    
    document.querySelectorAll('.cart-item-quantity input').forEach(input => {
        input.addEventListener('change', actualizarCantidadManual);
    });
    
    // Habilitar/deshabilitar botón de checkout
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.style.display = carrito.length > 0 ? 'block' : 'none';
    }
}

// Función para incrementar cantidad
function incrementarCantidad(e) {
    const itemId = parseInt(e.target.closest('.cart-item').getAttribute('data-id'));
    actualizarCantidad(itemId, 1);
}

// Función para decrementar cantidad
function decrementarCantidad(e) {
    const itemId = parseInt(e.target.closest('.cart-item').getAttribute('data-id'));
    actualizarCantidad(itemId, -1);
}

// Función para actualizar cantidad manualmente
function actualizarCantidadManual(e) {
    const itemId = parseInt(e.target.closest('.cart-item').getAttribute('data-id'));
    const nuevaCantidad = parseInt(e.target.value);
    
    if (isNaN(nuevaCantidad) || nuevaCantidad < 1) {
        e.target.value = 1;
        return;
    }
    
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const itemIndex = carrito.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        carrito[itemIndex].cantidad = nuevaCantidad;
        localStorage.setItem('carrito', JSON.stringify(carrito));
        cargarCarrito();
        actualizarContadorCarrito();
    }
}

// Función para actualizar cantidad
function actualizarCantidad(itemId, cambio) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const itemIndex = carrito.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        carrito[itemIndex].cantidad += cambio;
        
        // Eliminar si la cantidad es 0 o menos
        if (carrito[itemIndex].cantidad <= 0) {
            carrito.splice(itemIndex, 1);
        }
        
        localStorage.setItem('carrito', JSON.stringify(carrito));
        cargarCarrito();
        actualizarContadorCarrito();
    }
}

// Función para eliminar item del carrito
function eliminarDelCarrito(e) {
    const itemId = parseInt(e.target.closest('.cart-item').getAttribute('data-id'));
    
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito = carrito.filter(item => item.id !== itemId);
    
    localStorage.setItem('carrito', JSON.stringify(carrito));
    cargarCarrito();
    actualizarContadorCarrito();
    
    mostrarNotificacion('Producto eliminado del carrito');
}

// Función para actualizar el contador del carrito
function actualizarContadorCarrito() {
    const contadores = document.querySelectorAll('.cart-count');
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    
    contadores.forEach(contador => {
        contador.textContent = totalItems;
        contador.style.display = totalItems > 0 ? 'flex' : 'none';
    });
}

// Función para cargar el resumen del pedido en el checkout
function cargarResumenCheckout() {
    const contenedor = document.getElementById('order-items-list');
    if (!contenedor) return;
    
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let subtotal = 0;
    
    contenedor.innerHTML = '';
    
    carrito.forEach(item => {
        const itemHTML = `
            <div class="order-item">
                <img src="${item.imagen}" alt="${item.nombre}">
                <div class="order-item-details">
                    <h5>${item.nombre}</h5>
                    <div class="order-item-price">${item.precio.toFixed(2)}€ x ${item.cantidad}</div>
                </div>
                <div class="order-item-total">${(item.precio * item.cantidad).toFixed(2)}€</div>
            </div>
        `;
        contenedor.innerHTML += itemHTML;
        
        subtotal += item.precio * item.cantidad;
    });
    
    // Calcular envío (ejemplo: gratis para compras > 50€)
    const envio = subtotal > 50 ? 0 : 4.99;
    const total = subtotal + envio;
    
    // Actualizar totales
    document.getElementById('order-subtotal').textContent = subtotal.toFixed(2) + '€';
    document.getElementById('order-shipping').textContent = envio.toFixed(2) + '€';
    document.getElementById('order-total').textContent = total.toFixed(2) + '€';
}

// Función para manejar el proceso de checkout
function manejarCheckout() {
    const steps = document.querySelectorAll('.checkout-steps .step');
    const sections = document.querySelectorAll('.checkout-section');
    
    // Mostrar primera sección
    sections[0].classList.add('active');
    
    // Manejar botones de siguiente/anterior
    document.querySelectorAll('.btn-next').forEach(btn => {
        btn.addEventListener('click', function() {
            const nextSection = this.getAttribute('data-next');
            const currentSection = this.closest('.checkout-section');
            
            // Validar formulario antes de avanzar
            if (!validarFormulario(currentSection.id)) return;
            
            // Ocultar sección actual
            currentSection.classList.remove('active');
            
            // Mostrar siguiente sección
            document.getElementById(nextSection).classList.add('active');
            
            // Actualizar pasos
            steps.forEach(step => {
                if (step.getAttribute('data-step') === document.getElementById(nextSection).getAttribute('data-step')) {
                    step.classList.add('active');
                }
            });
            
            // Si es la sección de revisar pedido, cargar información
            if (nextSection === 'review-order') {
                cargarResumenCheckout();
                cargarInfoEnvioRevisar();
            }
        });
    });
    
    document.querySelectorAll('.btn-prev').forEach(btn => {
        btn.addEventListener('click', function() {
            const prevSection = this.getAttribute('data-prev');
            const currentSection = this.closest('.checkout-section');
            
            // Ocultar sección actual
            currentSection.classList.remove('active');
            
            // Mostrar sección anterior
            document.getElementById(prevSection).classList.add('active');
        });
    });
    
    // Manejar envío del formulario
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            procesarPago();
        });
    }
}

// Función para validar formulario
function validarFormulario(sectionId) {
    let valido = true;
    const section = document.getElementById(sectionId);
    
    if (sectionId === 'shipping-info') {
        const campos = ['nombre', 'direccion', 'ciudad', 'codigo-postal', 'pais', 'telefono', 'email'];
        
        campos.forEach(campo => {
            const input = document.getElementById(campo);
            if (!input.value.trim()) {
                input.style.borderColor = 'red';
                valido = false;
            } else {
                input.style.borderColor = '#ddd';
            }
        });
        
        // Validar email
        const email = document.getElementById('email');
        if (!/^\S+@\S+\.\S+$/.test(email.value)) {
            email.style.borderColor = 'red';
            valido = false;
        }
    }
    
    if (sectionId === 'payment-method') {
        const metodoPago = document.querySelector('input[name="metodo-pago"]:checked').value;
        
        if (metodoPago === 'tarjeta') {
            const camposTarjeta = ['numero-tarjeta', 'fecha-expiracion', 'cvv', 'nombre-tarjeta'];
            
            camposTarjeta.forEach(campo => {
                const input = document.getElementById(campo);
                if (!input.value.trim()) {
                    input.style.borderColor = 'red';
                    valido = false;
                } else {
                    input.style.borderColor = '#ddd';
                }
            });
            
            // Validar formato de fecha de expiración
            const fechaExp = document.getElementById('fecha-expiracion');
            if (!/^\d{2}\/\d{2}$/.test(fechaExp.value)) {
                fechaExp.style.borderColor = 'red';
                valido = false;
            }
        }
    }
    
    if (!valido) {
        mostrarNotificacion('Por favor, complete todos los campos requeridos correctamente');
    }
    
    return valido;
}

// Función para cargar información de envío en la sección de revisar
function cargarInfoEnvioRevisar() {
    const contenedor = document.getElementById('shipping-info-review');
    if (!contenedor) return;
    
    const nombre = document.getElementById('nombre').value;
    const direccion = document.getElementById('direccion').value;
    const ciudad = document.getElementById('ciudad').value;
    const codigoPostal = document.getElementById('codigo-postal').value;
    const pais = document.getElementById('pais').options[document.getElementById('pais').selectedIndex].text;
    const telefono = document.getElementById('telefono').value;
    const email = document.getElementById('email').value;
    
    contenedor.innerHTML = `
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Dirección:</strong> ${direccion}</p>
        <p><strong>Ciudad:</strong> ${ciudad}, ${codigoPostal}</p>
        <p><strong>País:</strong> ${pais}</p>
        <p><strong>Teléfono:</strong> ${telefono}</p>
        <p><strong>Email:</strong> ${email}</p>
    `;
}

// Función para procesar el pago (simulado)
function procesarPago() {
    // En un entorno real, aquí se conectaría con la pasarela de pago
    mostrarNotificacion('Procesando pago...');
    
    setTimeout(() => {
        // Simular éxito en el pago
        mostrarNotificacion('Pago realizado con éxito');
        
        // Guardar pedido en localStorage (en un entorno real, se enviaría al servidor)
        const pedido = {
            fecha: new Date().toISOString(),
            items: JSON.parse(localStorage.getItem('carrito')),
            envio: {
                nombre: document.getElementById('nombre').value,
                direccion: document.getElementById('direccion').value,
                ciudad: document.getElementById('ciudad').value,
                codigoPostal: document.getElementById('codigo-postal').value,
                pais: document.getElementById('pais').value,
                telefono: document.getElementById('telefono').value,
                email: document.getElementById('email').value
            },
            pago: {
                metodo: document.querySelector('input[name="metodo-pago"]:checked').value,
                total: parseFloat(document.getElementById('order-total').textContent.replace('€', ''))
            }
        };
        
        let historialPedidos = JSON.parse(localStorage.getItem('historialPedidos')) || [];
        historialPedidos.push(pedido);
        localStorage.setItem('historialPedidos', JSON.stringify(historialPedidos));
        
        // Vaciar carrito
        localStorage.removeItem('carrito');
        actualizarContadorCarrito();
        
        // Redirigir a página de confirmación (que no hemos implementado en este ejemplo)
        // window.location.href = 'confirmacion.html';
    }, 2000);
}

// Cargar carrito cuando la página esté lista
document.addEventListener('DOMContentLoaded', function() {
    cargarCarrito();
    actualizarContadorCarrito();
    
    // Si estamos en la página de checkout, manejar el proceso
    if (document.getElementById('checkout-form')) {
        manejarCheckout();
    }
});