<?php
session_start();
require_once "configuracion.php";

if (!isset($_POST['comentarios']) || !isset($_POST['id_resultado'])) {
    die("Error en los datos enviados.");
}

$comentario = trim($_POST['comentarios']);
$idResultado = intval($_POST['id_resultado']);

$db = new Configuracion();

$stmt = $db->conexion->prepare(
    "INSERT INTO observaciones_facilitador (id_resultados, comentarios_facilitador)
     VALUES (?, ?)"
);

$stmt->bind_param("is", $idResultado, $comentario);
$stmt->execute();

echo "<h2>Comentario guardado correctamente</h2>";
echo '<a href="../index.html">Volver al inicio</a>';
