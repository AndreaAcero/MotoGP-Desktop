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
