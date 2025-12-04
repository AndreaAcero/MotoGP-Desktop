<?php
class Configuracion {
    private $host = "localhost";
    private $usuario = "DBUSER2025";
    private $password = "DBPSWD2025";
    private $baseDatos = "uo287876_bd"; 
    public $conexion;

    public function __construct() {
        $this->conexion = new mysqli($this->host, $this->usuario, $this->password, $this->baseDatos);
        if ($this->conexion->connect_error) {
            die("Error de conexión: " . $this->conexion->connect_error);
        }
    }

    public function reiniciarTablas() {
        // corregido: la tabla REAL es datos_usuario
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

    public function exportarCSV($tabla) {
        $archivo = $tabla . ".csv";
        $result = $this->conexion->query("SELECT * FROM $tabla");

        if ($result) {
            $fp = fopen($archivo, 'w');

            // Sacar cabeceras
            $row = $result->fetch_assoc();
            if ($row) {
                fputcsv($fp, array_keys($row));
                fputcsv($fp, $row);

                while ($row = $result->fetch_assoc()) {
                    fputcsv($fp, $row);
                }
            }
            fclose($fp);

            echo "Datos de $tabla exportados a $archivo correctamente.<br>";
        } else {
            echo "Error al exportar $tabla: " . $this->conexion->error . "<br>";
        }
    }

    public function __destruct() {
        $this->conexion->close();
    }
}

$config = new Configuracion();
?>
