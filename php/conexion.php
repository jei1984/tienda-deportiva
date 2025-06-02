<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "tienda_deportiva";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Establecer el charset a utf8
$conn->set_charset("utf8");
?>