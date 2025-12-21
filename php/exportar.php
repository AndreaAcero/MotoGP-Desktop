<?php
require_once "configuracion.php";

if (isset($_GET['tabla'])) {
    $tabla = $_GET['tabla'];
    $config->exportarCSV($tabla); // Descarga automática del CSV
} else {
    echo "No se seleccionó ninguna tabla para exportar.";
}
?>
