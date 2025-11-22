<?php
// Clase Clasificaciones
class Clasificaciones {
    private $documento;
     public function __construct(){
        $this->documento = "xml/circuitoEsquema.xml";
    }

    public function consultar() {
        if (!file_exists($this->documento)) {
            return false; // archivo no encontrado
        }

        // Carga el XML como objeto SimpleXML
        $xml = simplexml_load_file($this->documento);
        return $xml;
    }

    public function getGanador() {
        if (!file_exists($this->documento)) return false;

        $xml = simplexml_load_file($this->documento);
        $ns = $xml->getNamespaces(true);
        $xml->registerXPathNamespace('u', $ns['']);

        $vencedor = $xml->xpath('//u:vencedor')[0];
        if ($vencedor) {
            return [
                'nombre' => (string)$vencedor->nombre,
                'tiempo' => (string)$vencedor->tiempo
            ];
        }
        return false;
    }

     public function getClasificacionMundial() {
        if (!file_exists($this->documento)) return false;

        $xml = simplexml_load_file($this->documento);
        $ns = $xml->getNamespaces(true);
        $xml->registerXPathNamespace('u', $ns['']);

        $clasificacion = [];
        $pilotos = $xml->xpath('//u:clasificacionMundial/u:piloto');
        foreach ($pilotos as $piloto) {
            $clasificacion[] = [
                'posicion' => (string)$piloto['posicion'],
                'nombre' => (string)$piloto->nombre,
                'puntos' => (string)$piloto->puntos
            ];
        }
        return $clasificacion;
    }
}

$clasificaciones = new Clasificaciones();
$ganador = $clasificaciones->getGanador();
$mundial = $clasificaciones->getClasificacionMundial();
?>

<!DOCTYPE HTML>

<html lang="es">
<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>MotoGP-Clasificaciones</title>
    <meta name ="author" content ="Andrea Acero Suárez" />
    <meta name ="description" content ="Información de clasificaciones del proyecto MotoGP-Desktop" />
    <meta name="keywords" content="MotoGP, clasificaciones, pilotos, equipos, temporada, puntuaciones" />
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" /> 
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
   <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="icon" href="multimedia/favicon.ico" type="image/x-icon" />
</head>

<body>
    <header>
    <!-- Datos con el contenidos que aparece en el navegador -->
     <h1><a href="index.html">MotoGP Desktop</a></h1>
    <nav>
        <a href="piloto.html" title="Información del piloto">Piloto</a>  
        <a href="circuito.html" title="Información del circuito">Circuito</a>  
        <a href="meteorologia.html" title="Información de Meteorología">Meteorología</a>  
        <a href="clasificaciones.php" title="Información de clasificaciones" class="active">Clasificaciones</a>  
        <a href="juegos.html" title="Información de juegos">Juegos</a>  
        <a href="ayuda.html" title="Información de ayuda">Ayuda</a>  
    </nav>
    </header>
    <p>Estás en: <a href="index.html">Inicio</a> &gt;&gt; <strong>Clasificaciones</strong></p>
    <main>
    <h2>Clasificaciones de MotoGP-Desktop</h2>
     <section>
        <h3>Ganador de la carrera</h3>
        <?php if ($ganador): ?>
                <p><strong>Nombre:</strong> <?= htmlspecialchars($ganador['nombre']) ?></p>
                <p><strong>Tiempo:</strong> <?= htmlspecialchars($ganador['tiempo']) ?></p>
        <?php else: ?>
            <p>No se pudo obtener el ganador.</p>
        <?php endif; ?>
    </section>
    <section>
        <h3>Clasificaciones completas</h3>
        <?php if ($mundial && count($mundial) > 0): ?>
            <table>
                <thead>
                    <tr>
                        <th>Posición</th>
                        <th>Piloto</th>
                        <th>Puntos</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($mundial as $piloto): ?>
                        <tr>
                            <td><?= htmlspecialchars($piloto['posicion']) ?></td>
                            <td><?= htmlspecialchars($piloto['nombre']) ?></td>
                            <td><?= htmlspecialchars($piloto['puntos']) ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php else: ?>
            <p>No hay datos de la clasificación mundial.</p>
        <?php endif; ?>
        </section>
    </main>
</body>
</html>