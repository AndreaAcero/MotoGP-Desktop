<?php
session_start();

if (!isset($_SESSION['id_resultado_test'])) {
    die("Error: no hay resultado asociado a esta prueba.");
}

$idResultado = $_SESSION['id_resultado_test'];
$tiempo = $_SESSION['tiempo_final'];
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Observaciones del facilitador</title>
    <meta name ="author" content ="Andrea Acero Suárez" />
    <meta name ="description" content ="Interfaz creada con php para guardar observaciones del observador" />
    <meta name ="keywords" content ="observador, prueba, php, comentarios" /> 
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" /> 
    <link rel="stylesheet" href="../estilo/estilo.css">
    <link rel='icon' href='../multimedia/favicon.ico' type='image/x-icon'>

</head>
<body>

<h1>Observaciones del Facilitador</h1>

<p><strong>Tiempo empleado por el usuario:</strong> <?= htmlspecialchars($tiempo) ?> segundos</p>

<form action="guardar_observacion.php" method="post">

    <label for="comentarios">Comentarios del facilitador:</label><br>
    <textarea id="comentarios" name="comentarios" rows="6" cols="60" required></textarea>

    <input type="hidden" name="id_resultado" value="<?= $idResultado ?>">

    <br><br>
    <button type="submit">Guardar comentario</button>
</form>

</body>
</html>
