<?php
session_start();
require_once "../cronometro.php";
require_once "configuracion.php";

if (!isset($_SESSION['id_usuario'])) {
    die("Error: no hay usuario en sesión.");
}

$db = new Configuracion();

// ======= INICIAR CRONO =======
if (isset($_POST['iniciar'])) {
    $cronometro = new Cronometro();
    $cronometro->arrancar();
    $_SESSION['inicio_prueba'] = $cronometro->getInicio();
}

// ======= GUARDAR PREGUNTAS =======
if (isset($_POST['guardar_preguntas'])) {

    if (!isset($_SESSION['inicio_prueba'])) {
        die("Error: no se inició el cronómetro.");
    }

    // Recoger respuestas
    $p1  = $_POST['p1'] ?? '';
    $p2  = $_POST['p2'] ?? '';
    $p3  = $_POST['p3'] ?? '';
    $p4  = $_POST['p4'] ?? '';
    $p5  = $_POST['p5'] ?? '';
    $p6  = $_POST['p6'] ?? '';
    $p7  = $_POST['p7'] ?? '';
    $p8  = $_POST['p8'] ?? '';
    $p9  = $_POST['p9'] ?? '';
    $p10 = $_POST['p10'] ?? '';

    // Insertar SOLO preguntas
    $stmt = $db->conexion->prepare(
        "INSERT INTO preguntas_test 
        (id_usuario, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );


    $stmt->bind_param(
        "issssssssss",
        $_SESSION['id_usuario'],
        $p1, $p2, $p3, $p4, $p5, $p6, $p7, $p8, $p9, $p10
    );

    $stmt->execute();

    // Guardar el id generado para usarlo en la segunda página
    $_SESSION['id_preguntas'] = $db->conexion->insert_id;

    // Ir a valoración
    header("Location: valoracion.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Preguntas del test</title>
    <meta name ="author" content ="Andrea Acero Suárez" />
    <meta name ="description" content ="Interfaz creada con PHP para realizar pruebas de usabilidad, interfaz con las preguntas" />
    <meta name ="keywords" content ="preguntas, prueba, usabilidad, test" /> 
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" /> 
    <link rel='icon' href='../multimedia/favicon.ico' type='image/x-icon'>

</head>
<body>

<h1>Prueba de Usabilidad</h1>

<form method="post">
    <button type="submit" name="iniciar">Iniciar prueba</button>
</form>

<form method="post">

    <
    <fieldset>
        <legend>Preguntas del test</legend>

        <label>1. ¿Quién es el piloto principal?</label><br>
        <input type="text" name="p1"><br><br>

        <label>2. ¿Cuál es la longitud del circuito?</label><br>
        <input type="text" name="p2"><br><br>

        <label>3. ¿Qué información meteorológica se muestra?</label><br>
        <input type="text" name="p3"><br><br>

        <label>4. ¿Dónde se encuentra el circuito?</label><br>
        <input type="text" name="p4"><br><br>

        <label>5. ¿Cuántos puntos tiene el primer clasificado?</label><br>
        <input type="text" name="p5"><br><br>

        <label>6. ¿Qué imagen aparece primero en el juego?</label><br>
        <input type="text" name="p6"><br><br>

        <label>7. ¿Qué botón inicia el cronómetro?</label><br>
        <input type="text" name="p7"><br><br>

        <label>8. ¿Cuánto tardaste en el juego de memoria?</label><br>
        <input type="text" name="p8"><br><br>

        <label>9. ¿Cuál fue la temperatura el día de la carrera?</label><br>
        <input type="text" name="p9"><br><br>

        <label>10. ¿Tiempo del ganador?</label><br>
        <input type="text" name="p10"><br><br>
    </fieldset>
    <button type="submit" name="guardar_preguntas">Ir a valoración</button>

</form>

</body>
</html>
