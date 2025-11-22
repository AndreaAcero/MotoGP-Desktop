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


$mensaje = "Esperando acción del usuario...";

// Crear cronómetro
$cronometro = new Cronometro();

// Recuperar valores anteriores si existen
if (isset($_POST["tiempoGuardado"])) {
    $cronometro->setTiempo(floatval($_POST["tiempoGuardado"]));
}
if (isset($_POST["inicioGuardado"])) {
    $cronometro->setInicio(floatval($_POST["inicioGuardado"]));
}

if (count($_POST) > 0) {

    if (isset($_POST["arrancar"])) {
        $cronometro->arrancar();
        $mensaje = "Cronómetro arrancado.";
    }

    if (isset($_POST["parar"])) {
        $cronometro->parar();
        $mensaje = "Cronómetro detenido.";
    }

    if (isset($_POST["mostrar"])) {
        $mensaje = "Tiempo transcurrido: " . $cronometro->mostrar();
    }
}

echo "
<!DOCTYPE html>
<html lang='es'>
<head>
    <meta charset='UTF-8'>
    <title>Cronómetro PHP</title>
    <link rel='stylesheet' href='estilo/estilo.css'>
    <link rel='stylesheet' href='estilo/layout.css'>
    <link rel='icon' href='multimedia/favicon.ico' type='image/x-icon'>
</head>

<body>
<header>
    <h1><a href='index.html'>MotoGP Desktop</a></h1>
    <nav>
        <a href='piloto.html' title='Información del piloto'>Piloto</a> 
        <a href='circuito.html' title='Información del circuito'>Circuito</a> 
        <a href='meteorologia.html' title='Información de Meteorología'>Meteorología</a> 
        <a href='clasificaciones.php' title='Información de clasificaciones'>Clasificaciones</a> 
        <a href='juegos.html' title='Información de juegos' class='active'>Juegos</a> 
        <a href='ayuda.html' title='Información de ayuda'>Ayuda</a>
    </nav>
</header>

<p>Estás en: <a href='index.html'>Inicio</a> &gt;&gt; <a href='juegos.html'>Juegos</a> &gt;&gt; <strong>Cronómetro PHP</strong></p>

<main>
    <h2>Cronómetro PHP</h2>

    <form action='#' method='post'>
        <div>
            <input type='submit' name='arrancar' value='Arrancar' class='button'/>
            <input type='submit' name='parar' value='Parar' class='button'/>
            <input type='submit' name='mostrar' value='Mostrar' class='button'/>
        </div>

        <!-- Guardamos valores internos para mantener el estado -->
        <input type='hidden' name='tiempoGuardado' value='" . $cronometro->getTiempo() . "'>
        <input type='hidden' name='inicioGuardado' value='" . $cronometro->getInicio() . "'>
    </form>

    <h3>Resultado</h3>
    <p>$mensaje</p>
</main>
</body>
</html>
";
?>