<?php
session_start();
require_once "configuracion.php";

if (!isset($_POST['comentarios']) || !isset($_POST['id_test'])) {
    die("Error en los datos enviados.");
}

$comentario = $_POST['comentarios'];
$id = intval($_POST['id_test']);

$db = new Configuracion();

$stmt = $db->conexion->prepare(
    "INSERT INTO observaciones_facilitador (id_test, comentario) VALUES (?, ?)"
);
$stmt->bind_param("is", $id, $comentario);
$stmt->execute();

echo "<h2>Comentario guardado correctamente</h2>";
echo "<a href='../index.html'>Volver al inicio</a>";
?>
