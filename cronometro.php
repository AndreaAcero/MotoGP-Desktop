<?php
// Clase Cronometro
class Cronometro {

    private $tiempo;   // tiempo total contado
    private $inicio;   // instante de arranque

    public function __construct() {
        $this->tiempo = 0;
        $this->inicio = 0;
    }

    public function arrancar() {
        $this->inicio = microtime(true);
    }

    public function parar() {
        $fin = microtime(true);
        $this->tiempo = $fin - $this->inicio;
    }

    public function mostrar() {
        $t = $this->tiempo;

        $min = floor($t / 60);
        $seg = floor($t % 60);
        $dec = floor(($t - floor($t)) * 10);

        return sprintf("%02d:%02d.%d", $min, $seg, $dec);
    }

    public function getTiempo() { return $this->tiempo; }
    public function getInicio() { return $this->inicio; }
    public function setTiempo($t) { $this->tiempo = $t; }
    public function setInicio($i) { $this->inicio = $i; }
}

?>