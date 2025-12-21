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
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>observaciones guardado</title>
    <meta name ="author" content ="Andrea Acero Suárez" />
    <meta name ="description" content ="Guardado de observaciones" />
    <meta name="keywords" content="MotoGP, observaciones, facilitador, comentarios" />
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" /> 
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel='icon' href='../multimedia/favicon.ico' type='image/x-icon'>
</head>
<body>
    <h2>Observaciones guardado correctamente</h2>
    <p><a href="../index.html">Volver al inicio</a></p>
</body>
</html>
