<?php
include 'conexion.php';

header('Content-Type: application/json');

// Simulación de pasarela de pago
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Validar datos del pago
    if (empty($data['carrito']) || empty($data['envio']) || empty($data['pago'])) {
        echo json_encode(['success' => false, 'error' => 'Datos incompletos']);
        exit;
    }
    
    // En un entorno real, aquí se conectaría con la pasarela de pago (Stripe, PayPal, etc.)
    // Simulamos un pago exitoso después de 1 segundo
    sleep(1);
    
    // Crear pedido en la base de datos
    $usuario_id = isset($data['usuario_id']) ? intval($data['usuario_id']) : null;
    $total = 0;
    
    foreach ($data['carrito'] as $item) {
        $total += $item['precio'] * $item['cantidad'];
    }
    
    $envio = $total > 50 ? 0 : 4.99;
    $total += $envio;
    
    $direccion = $conn->real_escape_string($data['envio']['direccion']);
    $ciudad = $conn->real_escape_string($data['envio']['ciudad']);
    $codigo_postal = $conn->real_escape_string($data['envio']['codigo_postal']);
    $pais = $conn->real_escape_string($data['envio']['pais']);
    $metodo_pago = $conn->real_escape_string($data['pago']['metodo']);
    
    // Insertar pedido
    $sql = "INSERT INTO pedidos (usuario_id, total, envio, direccion_envio, ciudad_envio, codigo_postal_envio, pais_envio, metodo_pago, estado)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'completado')";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("iddsssss", $usuario_id, $total, $envio, $direccion, $ciudad, $codigo_postal, $pais, $metodo_pago);
    $stmt->execute();
    $pedido_id = $stmt->insert_id;
    $stmt->close();
    
    // Insertar items del pedido
    foreach ($data['carrito'] as $item) {
        $producto_id = intval($item['id']);
        $cantidad = intval($item['cantidad']);
        $precio = floatval($item['precio']);
        $talla = isset($item['talla']) ? $conn->real_escape_string($item['talla']) : null;
        
        $sql = "INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio_unitario, talla)
                VALUES ($pedido_id, $producto_id, $cantidad, $precio, " . ($talla ? "'$talla'" : "NULL") . ")";
        $conn->query($sql);
        
        // Actualizar stock (simplificado)
        if ($talla) {
            $sql = "UPDATE producto_tallas SET stock = stock - $cantidad 
                    WHERE producto_id = $producto_id AND talla_id = (
                        SELECT id FROM tallas WHERE nombre = '$talla'
                    )";
        } else {
            $sql = "UPDATE productos SET stock = stock - $cantidad WHERE id = $producto_id";
        }
        $conn->query($sql);
    }
    
    // Devolver respuesta de éxito
    echo json_encode([
        'success' => true,
        'pedido_id' => $pedido_id,
        'total' => $total,
        'fecha' => date('Y-m-d H:i:s')
    ]);
} else {
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
}

$conn->close();
?>