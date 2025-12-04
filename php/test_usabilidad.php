<?php
session_start();
require_once "../cronometro.php";
require_once "configuracion.php";

$db = new Configuracion();

// Validar que el usuario llegó desde test_usuario.php
if (!isset($_SESSION['id_usuario']) || !isset($_SESSION['dispositivo'])) {
    die("Error: no se han recibido los datos del usuario.");
}

// ======= INICIAR PRUEBA =======
if (isset($_POST['iniciar'])) {
    $cronometro = new Cronometro();
    $cronometro->arrancar();

    $_SESSION['inicio_prueba'] = $cronometro->getInicio();
    $_SESSION['test_iniciado'] = true;
}


// ======= TERMINAR PRUEBA =======
if (isset($_POST['terminar'])) {

    if (!isset($_SESSION['inicio_prueba'])) {
        die("Error: la prueba no fue iniciada.");
    }

    // Parar cronómetro
    $cronometro = new Cronometro();
    $cronometro->setInicio($_SESSION['inicio_prueba']);
    $cronometro->parar();
    $tiempoTotal = intval($cronometro->getTiempo());

    // Recoger campos obligatorios del test
    $comentarioUsuario = $_POST['comentario_usuario'] ?? '';
    $propuestaMejora   = $_POST['propuesta_usuario'] ?? '';
    $valoracion        = $_POST['valoracion'] ?? '';

    if ($valoracion === "" || !is_numeric($valoracion) || $valoracion < 0 || $valoracion > 10) {
        die("Error: la valoración debe estar entre 0 y 10.");
    }

    $tareaCompletada = 1;
    $idUsuario = $_SESSION['id_usuario'];
    $dispositivo = $_SESSION['dispositivo'];

    // Insertar en BD con tu estructura REAL
    $stmt = $db->conexion->prepare(
        "INSERT INTO resultados_test 
        (id_usuario, dispositivo, tiempo_segundos, tarea_completada, comentario, propuesta_mejora, valoracion)
        VALUES (?, ?, ?, ?, ?, ?, ?)"
    );

    

    $stmt->bind_param(
        "isisssd",
        $idUsuario,
        $dispositivo,
        $tiempoTotal,
        $tareaCompletada,
        $comentarioUsuario,
        $propuestaMejora,
        $valoracion
    );


    $stmt->execute();

    $_SESSION['id_resultado_test'] = $db->conexion->insert_id;
    $_SESSION['tiempo_final'] = $tiempoTotal;

    // Redirigir al formulario del observador
    header("Location: observador.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Prueba de Usabilidad - MotoGP Desktop</title>
    <link rel="stylesheet" href="../estilo/estilo.css">
</head>
<body>

<h1>Prueba de Usabilidad – MotoGP Desktop</h1>

<form action="test_usabilidad.php" method="post">

    <p><button type="submit" name="iniciar">Iniciar prueba</button></p>

    <fieldset>
        <legend>Preguntas del test</legend>

        <p>(Las respuestas NO se guardan, solo sirven para realizar la tarea de la prueba)</p>

        <label>1. ¿Quién es el piloto principal descrito en la sección "Piloto"?</label><br>
        <input type="text" name="p1"><br><br>

        <label>2. ¿Cuál es la longitud del circuito mostrado en la sección "Circuito"?</label><br>
        <input type="text" name="p2" ><br><br>

        <label>3. ¿Qué información meteorológica se muestra?</label><br>
        <input type="text" name="p3" ><br><br>

        <label>4. ¿Dónde se encuentra el circuito que se muestra en la sección "Circuito"?</label><br>
        <input type="text" name="p4" ><br><br>

        <label>5. ¿Cuántos puntos tiene el primer clasificado?</label><br>
        <input type="text" name="p5" ><br><br>

        <label>6. En el juego de memoria, ¿qué imagen aparece primero?</label><br>
        <input type="text" name="p6" ><br><br>

        <label>7. En el cronómetro, ¿qué botón debes pulsar para empezar a medir el tiempo?</label><br>
        <input type="text" name="p7" ><br><br>

        <label>8. ¿Cuánto tardaste en completar el juego de memoria?</label><br>
        <input type="text" name="p8" ><br><br>

        <label>9. ¿Cuál es la temperatura que hubo el día de la carrera?</label><br>
        <input type="text" name="p9" ><br><br>

        <label>10. ¿Cuánto tiempo tardo el ganador de la carrera en completarlaº?</label><br>
        <input type="text" name="p10" ><br><br>
    </fieldset>

    <fieldset>
        <legend>Valoración del usuario</legend>

        <label>Comentario del usuario:</label><br>
        <textarea name="comentario_usuario" rows="4"></textarea><br><br>

        <label>Propuesta de mejora del usuario:</label><br>
        <textarea name="propuesta_usuario" rows="4"></textarea><br><br>

        <label>Valoración de la aplicación (0 – 10):</label><br>
        <input type="number" name="valoracion" min="0" max="10" step="0.1" ><br><br>
    </fieldset>

    <p><button type="submit" name="terminar">Terminar prueba</button></p>

</form>

</body>
</html>
