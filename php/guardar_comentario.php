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

?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Comentario guardado</title>
    <meta name ="author" content ="Andrea Acero Suárez" />
    <meta name ="description" content ="Guardado de comentarios" />
    <meta name="keywords" content="MotoGP, observaciones, facilitador, comentarios" />
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" /> 
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel='icon' href='../multimedia/favicon.ico' type='image/x-icon'>
</head>
<body>
    <h2>Comentario guardado correctamente</h2>
    <p><a href="../index.html">Volver al inicio</a></p>
</body>
</html>