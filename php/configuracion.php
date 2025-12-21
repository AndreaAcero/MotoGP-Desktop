<?php
class Configuracion {
    private $host = "localhost";
    private $usuario = "DBUSER2025";
    private $password = "DBPSWD2025";
    private $baseDatos = "uo287876_bd"; 
    public $conexion;

    // Tablas permitidas para exportar
    private $tablasPermitidas = ['datos_usuario', 'observaciones_facilitador', 'preguntas_test', 'resultados_test'];

    public function __construct() {
        $this->conexion = new mysqli($this->host, $this->usuario, $this->password, $this->baseDatos);
        if ($this->conexion->connect_error) {
            die("Error de conexión: " . $this->conexion->connect_error);
        }
    }

    public function reiniciarTablas() {
        $tablas = ['observaciones_facilitador', 'resultados_test', 'datos_usuario'];

        foreach ($tablas as $tabla) {
            $sql = "TRUNCATE TABLE $tabla";
            if (!$this->conexion->query($sql)) {
                echo "Error al vaciar $tabla: " . $this->conexion->error . "<br>";
            }
        }
        echo "Tablas reiniciadas correctamente.<br>";
    }

    public function eliminarBaseDatos() {
        $sql = "DROP DATABASE IF EXISTS ".$this->baseDatos;
        if ($this->conexion->query($sql)) {
            echo "Base de datos eliminada correctamente.<br>";
        } else {
            echo "Error al eliminar la base de datos: " . $this->conexion->error . "<br>";
        }
    }

    // Exportar CSV y forzar descarga
    public function exportarCSV($tabla) {
        if (!in_array($tabla, $this->tablasPermitidas)) {
            die("Error: la tabla '$tabla' no es válida para exportar.");
        }

        $result = $this->conexion->query("SELECT * FROM $tabla");

        if ($result) {
            // Headers para descarga
            header('Content-Type: text/csv; charset=utf-8');
            header('Content-Disposition: attachment; filename=' . $tabla . '.csv');

            $fp = fopen('php://output', 'w');

            // Cabeceras
            $row = $result->fetch_assoc();
            if ($row) {
                fputcsv($fp, array_keys($row)); // Cabeceras
                fputcsv($fp, $row); // Primer registro
                while ($row = $result->fetch_assoc()) {
                    fputcsv($fp, $row);
                }
            }

            fclose($fp);
            exit; // Detener cualquier salida adicional
        } else {
            die("Error al exportar $tabla: " . $this->conexion->error);
        }
    }

    public function __destruct() {
        $this->conexion->close();
    }
}

$config = new Configuracion();
?>
