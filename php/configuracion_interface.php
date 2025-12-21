<?php
require_once "configuracion.php";
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Configuración Test</title>
    <link rel="stylesheet" href="estilo/estilo.css">
    <link rel='icon' href='../multimedia/favicon.ico' type='image/x-icon'>
    <meta name ="author" content ="Andrea Acero Suárez" />
    <meta name ="description" content ="Interfaz para configurar la base de datos para las pruebas de usabilidad" />
    <meta name ="keywords" content ="base de datos, datos, pruebas, usabilidad, php" /> 
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" /> 
</head>
<body>
    <h1>Configuración de la Base de Datos</h1>

    <form method="post">
        <button name="reiniciar">Reiniciar Tablas</button>
        <button name="eliminar">Eliminar Base de Datos</button>
    </form>

    <h2>Exportar datos</h2>
    <form method="get" action="exportar.php">
        <select name="tabla">
            <option value="datos_usuario">Usuarios</option>
            <option value="resultados_test">Resultados Test</option>
            <option value="observaciones_facilitador">Observaciones Facilitador</option>
            <option value="preguntas_test">Preguntas Test</option>
        </select>
        <button type="submit">Exportar CSV</button>
    </form>

    <?php
    if (isset($_POST['reiniciar'])) {
        $config->reiniciarTablas();
    }

    if (isset($_POST['eliminar'])) {
        $config->eliminarBaseDatos();
    }
    ?>
</body>
</html>
