<?php
require_once "configuracion.php";
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Configuración Test</title>
    <link rel="stylesheet" href="estilo/estilo.css">
</head>
<body>
    <h1>Configuración de la Base de Datos</h1>

    <form method="post">
        <button name="reiniciar">Reiniciar Tablas</button>
        <button name="eliminar">Eliminar Base de Datos</button>
    </form>

    <h2>Exportar datos</h2>
    <form method="post">
        <select name="tabla">
            <option value="usuarios">Usuarios</option>
            <option value="resultados_test">Resultados Test</option>
            <option value="observaciones_facilitador">Observaciones</option>
        </select>
        <button name="exportar">Exportar CSV</button>
    </form>

    <?php
    if (isset($_POST['reiniciar'])) {
        $config->reiniciarTablas();
    }
    if (isset($_POST['eliminar'])) {
        $config->eliminarBaseDatos();
    }
    if (isset($_POST['exportar'])) {
        $config->exportarCSV($_POST['tabla']);
    }
    ?>
</body>
</html>

