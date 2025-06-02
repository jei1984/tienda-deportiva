-- Creación de la base de datos
CREATE DATABASE IF NOT EXISTS tienda_deportiva;
USE tienda_deportiva;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    direccion TEXT,
    ciudad VARCHAR(100),
    codigo_postal VARCHAR(20),
    pais VARCHAR(50),
    telefono VARCHAR(20),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rol ENUM('admin', 'cliente') DEFAULT 'cliente'
);

-- Tabla de categorías
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    slug VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    imagen VARCHAR(255)
);

-- Tabla de productos
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    precio_anterior DECIMAL(10, 2),
    categoria_id INT,
    genero ENUM('hombre', 'mujer', 'unisex') DEFAULT 'unisex',
    imagen_principal VARCHAR(255) NOT NULL,
    stock INT DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0,
    num_valoraciones INT DEFAULT 0,
    destacado BOOLEAN DEFAULT FALSE,
    oferta BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- Tabla de imágenes adicionales de productos
CREATE TABLE producto_imagenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    imagen_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

-- Tabla de tallas
CREATE TABLE tallas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL,
    descripcion VARCHAR(50)
);

-- Tabla de relación producto-tallas
CREATE TABLE producto_tallas (
    producto_id INT NOT NULL,
    talla_id INT NOT NULL,
    stock INT DEFAULT 0,
    PRIMARY KEY (producto_id, talla_id),
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    FOREIGN KEY (talla_id) REFERENCES tallas(id)
);

-- Tabla de pedidos
CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('pendiente', 'procesando', 'enviado', 'completado', 'cancelado') DEFAULT 'pendiente',
    total DECIMAL(10, 2) NOT NULL,
    envio DECIMAL(10, 2) DEFAULT 0,
    direccion_envio TEXT NOT NULL,
    ciudad_envio VARCHAR(100) NOT NULL,
    codigo_postal_envio VARCHAR(20) NOT NULL,
    pais_envio VARCHAR(50) NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL,
    transaccion_id VARCHAR(100),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabla de items del pedido
CREATE TABLE pedido_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    talla VARCHAR(20),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Tabla de valoraciones
CREATE TABLE valoraciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    usuario_id INT NOT NULL,
    rating INT NOT NULL,
    comentario TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Insertar datos iniciales
INSERT INTO categorias (nombre, slug, descripcion) VALUES 
('Running', 'running', 'Ropa y calzado para corredores'),
('Fitness', 'fitness', 'Ropa y accesorios para entrenamiento en gimnasio'),
('Fútbol', 'futbol', 'Equipamiento para fútbol'),
('Yoga', 'yoga', 'Ropa y accesorios para yoga'),
('Tenis', 'tenis', 'Equipamiento para tenis'),
('Accesorios', 'accesorios', 'Accesorios deportivos varios');

INSERT INTO tallas (nombre, descripcion) VALUES 
('XS', 'Extra Small'),
('S', 'Small'),
('M', 'Medium'),
('L', 'Large'),
('XL', 'Extra Large'),
('XXL', 'Extra Extra Large'),
('36', 'Talla 36'),
('37', 'Talla 37'),
('38', 'Talla 38'),
('39', 'Talla 39'),
('40', 'Talla 40'),
('41', 'Talla 41'),
('42', 'Talla 42'),
('43', 'Talla 43'),
('44', 'Talla 44'),
('Única', 'Talla única');

-- Insertar productos de ejemplo
INSERT INTO productos (nombre, descripcion, precio, precio_anterior, categoria_id, genero, imagen_principal, stock, rating, num_valoraciones, destacado, oferta) VALUES 
('Camiseta Running Tech', 'Camiseta transpirable para running con tecnología de secado rápido.', 29.99, 39.99, 1, 'hombre', 'img/productos/camiseta-running-hombre.jpg', 100, 4.5, 24, TRUE, TRUE),
('Leggings Yoga Fit', 'Leggings cómodos y elásticos para yoga y pilates.', 34.99, NULL, 4, 'mujer', 'img/productos/leggings-yoga-mujer.jpg', 75, 4.8, 18, TRUE, FALSE),
('Zapatillas Running Pro', 'Zapatillas de running con amortiguación avanzada para mayor comodidad.', 89.99, 109.99, 1, 'unisex', 'img/productos/zapatillas-running.jpg', 50, 4.7, 32, TRUE, TRUE),
('Chándal Fitness', 'Conjunto de chándal para entrenamiento en gimnasio.', 59.99, NULL, 2, 'hombre', 'img/productos/chandal-fitness.jpg', 40, 4.3, 12, TRUE, FALSE),
('Top Deportivo', 'Top deportivo de soporte medio para entrenamientos intensos.', 24.99, NULL, 2, 'mujer', 'img/productos/top-deportivo.jpg', 60, 4.6, 15, FALSE, FALSE),
('Balón Fútbol Pro', 'Balón de fútbol profesional tamaño 5 para competición.', 39.99, 49.99, 3, 'unisex', 'img/productos/camisa-futbol.jpg', 30, 4.9, 8, FALSE, TRUE),
('Raqueta Tenis', 'Raqueta de tenis profesional con marco de grafito.', 79.99, NULL, 5, 'unisex', 'img/productos/raqueta-tenis.jpg', 25, 4.7, 10, FALSE, FALSE),
('Camisa Deportiva', 'Camisa deportiva y comoda para hacer ejercicio.', 45.99, NULL, 6, 'unisex', 'img/productos/camisa-deportiva.jpg', 45, 4.4, 7, FALSE, FALSE);
 
-- Insertar tallas para productos
INSERT INTO producto_tallas (producto_id, talla_id, stock) VALUES 
(1, 3, 25), (1, 4, 25), (1, 5, 25), (1, 6, 25),
(2, 1, 20), (2, 2, 20), (2, 3, 20), (2, 4, 15),
(3, 8, 5), (3, 9, 5), (3, 10, 5), (3, 11, 5), (3, 12, 5), (3, 13, 5), (3, 14, 5), (3, 15, 5), (3, 16, 5),
(4, 3, 10), (4, 4, 10), (4, 5, 10), (4, 6, 10),
(5, 1, 15), (5, 2, 15), (5, 3, 15), (5, 4, 15),
(6, 17, 30),
(7, 17, 25),
(8, 17, 45);