<?php
include 'conexion.php';

header('Content-Type: application/json');

// Obtener productos
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $categoria = isset($_GET['categoria']) ? $_GET['categoria'] : null;
    $genero = isset($_GET['genero']) ? $_GET['genero'] : null;
    $orden = isset($_GET['orden']) ? $_GET['orden'] : 'popularidad';
    
    $sql = "SELECT p.*, c.nombre as categoria_nombre FROM productos p 
            JOIN categorias c ON p.categoria_id = c.id 
            WHERE 1=1";
    
    if ($categoria) {
        $sql .= " AND c.slug = '" . $conn->real_escape_string($categoria) . "'";
    }
    
    if ($genero) {
        $sql .= " AND p.genero = '" . $conn->real_escape_string($genero) . "'";
    }
    
    switch ($orden) {
        case 'precio-asc':
            $sql .= " ORDER BY p.precio ASC";
            break;
        case 'precio-desc':
            $sql .= " ORDER BY p.precio DESC";
            break;
        case 'novedades':
            $sql .= " ORDER BY p.fecha_creacion DESC";
            break;
        default:
            $sql .= " ORDER BY p.rating DESC, p.num_valoraciones DESC";
    }
    
    $result = $conn->query($sql);
    
    $productos = array();
    while ($row = $result->fetch_assoc()) {
        $productos[] = $row;
    }
    
    echo json_encode($productos);
}

// Crear producto (solo admin)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verificar autenticación y permisos aquí
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    $nombre = $conn->real_escape_string($data['nombre']);
    $descripcion = $conn->real_escape_string($data['descripcion']);
    $precio = floatval($data['precio']);
    $categoria_id = intval($data['categoria_id']);
    $genero = $conn->real_escape_string($data['genero']);
    $imagen = $conn->real_escape_string($data['imagen']);
    $stock = intval($data['stock']);
    $destacado = isset($data['destacado']) ? 1 : 0;
    $oferta = isset($data['oferta']) ? 1 : 0;
    
    $sql = "INSERT INTO productos (nombre, descripcion, precio, categoria_id, genero, imagen_principal, stock, destacado, oferta)
            VALUES ('$nombre', '$descripcion', $precio, $categoria_id, '$genero', '$imagen', $stock, $destacado, $oferta)";
    
    if ($conn->query($sql) {
        $producto_id = $conn->insert_id;
        echo json_encode(['success' => true, 'id' => $producto_id]);
    } else {
        echo json_encode(['success' => false, 'error' => $conn->error]);
    }
}

$conn->close();
?>