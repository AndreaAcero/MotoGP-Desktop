<?php 
session_start();
require_once "../cronometro.php";
require_once "configuracion.php";

if (!isset($_SESSION['inicio_prueba'], $_SESSION['id_preguntas'], $_SESSION['id_usuario'], $_SESSION['dispositivo'])) {
    die("Error: sesión incompleta.");
}

$db = new Configuracion();

if (isset($_POST['guardar'])) {

    // Parar cronómetro
    $cronometro = new Cronometro();
    $cronometro->setInicio($_SESSION['inicio_prueba']);
    $cronometro->parar();
    $tiempoTotal = intval($cronometro->getTiempo());

    // Datos del formulario
    $comentario = $_POST['comentario_usuario'];
    $mejora     = $_POST['propuesta_usuario'];
    $valoracion = floatval($_POST['valoracion']); // Decimal

    if ($valoracion < 0 || $valoracion > 10) {
        die("Valoración inválida");
    }

    $tareaCompletada = 1;

    // 🔹 PREPARE del insert en resultados_test
    $stmt = $db->conexion->prepare(
        "INSERT INTO resultados_test 
        (id_usuario, id_preguntas, dispositivo, tiempo_segundos, tarea_completada, comentario, propuesta_mejora, valoracion)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );

    if (!$stmt) {
        die("Error en prepare(): " . $db->conexion->error);
    }

    // Bind de variables
    $stmt->bind_param(
        "iisiissd",
        $_SESSION['id_usuario'],
        $_SESSION['id_preguntas'],
        $_SESSION['dispositivo'],
        $tiempoTotal,
        $tareaCompletada,
        $comentario,
        $mejora,
        $valoracion
    );

    // Ejecutar y verificar
    if (!$stmt->execute()) {
        die("Error al guardar el resultado: " . $stmt->error);
    }
    $_SESSION['id_resultado_test'] = $db->conexion->insert_id;
    $_SESSION['tiempo_final'] = $tiempoTotal; // también guardar el tiempo

    // Redirigir al observador
    header("Location: observador.php");
    exit();
}
?>


<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Valoración del usuario</title>
    <meta name ="author" content ="Andrea Acero Suárez" />
    <meta name ="description" content ="Interfaz que recoge la valoración del usuario a la aplicacion una vez realizada la prueba de usabilidad" />
    <meta name ="keywords" content ="valoracion, prueba, usabilidad, php" /> 
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" /> 
    <link rel='icon' href='../multimedia/favicon.ico' type='image/x-icon'>

</head>
<body>

<h1>Valoración del usuario</h1>

<form method="post">
    <label>Comentario:</label><br>
    <textarea name="comentario_usuario" required></textarea><br><br>

    <label>Propuesta de mejora:</label><br>
    <textarea name="propuesta_usuario" required></textarea><br><br>

    <label>Valoración (0-10):</label><br>
    <input type="number" name="valoracion" min="0" max="10" step="0.1" required><br><br>

    <button type="submit" name="guardar">Guardar y finalizar</button>
</form>

</body>
</html>
