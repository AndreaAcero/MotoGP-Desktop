# xml2altimetria.py
# -*- coding: utf-8 -*-
"""
Genera un archivo SVG con la altimetría de un circuito a partir de circuitoEsquema.xml
y colorea los tramos según el sector. Considera el puntoOrigen como primer punto.
"""

import xml.etree.ElementTree as ET

# Colores por sector
COLOR_SECTOR = {
    "1": "green",
    "2": "orange",
    "3": "red"
}

# Clase SVG
class Svg(object):
    def __init__(self):
        self.raiz = ET.Element('svg', xmlns="http://www.w3.org/2000/svg", version="2.0")

    def addLine(self, x1, y1, x2, y2, stroke="black", strokeWidth="1"):
        ET.SubElement(self.raiz, 'line',
                      x1=str(x1), y1=str(y1),
                      x2=str(x2), y2=str(y2),
                      stroke=stroke, strokeWidth=str(strokeWidth))

    def addText(self, texto, x, y, fontFamily="Verdana", fontSize="12", style="none"):
        ET.SubElement(self.raiz, 'text',
                      x=str(x), y=str(y),
                      fontFamily=fontFamily,
                      fontSize=str(fontSize),
                      style=style).text = texto

    def escribir(self, nombreArchivoSVG):
        arbol = ET.ElementTree(self.raiz)
        ET.indent(arbol)
        arbol.write(nombreArchivoSVG, encoding='utf-8', xml_declaration=True)


def main():
    # Leer XML
    xml_file = "circuitoEsquema.xml"
    tree = ET.parse(xml_file)
    root = tree.getroot()
    ns = {'ns': 'http://www.uniovi.es'}

    # Tomar puntoOrigen
    origen = root.find('ns:puntoOrigen', ns)
    origen_dist = 0.0
    origen_alt = float(origen.find('ns:altitud', ns).text)
    distancias = [origen_dist]
    altitudes = [origen_alt]
    sectores = [None]  # Punto origen no tiene sector

    # Extraer tramos
    tramos = root.findall('.//ns:tramos/ns:tramo', ns)
    total_dist = 0.0
    for tramo in tramos:
        distancia = float(tramo.find('ns:distancia', ns).text)
        total_dist += distancia
        alt = float(tramo.find('ns:altitud', ns).text)
        sector = tramo.attrib.get('sector', "1")

        distancias.append(total_dist)
        altitudes.append(alt)
        sectores.append(sector)

    # Escalar para SVG
    ancho_svg = 1000
    alto_svg = 400
    max_dist = max(distancias)
    min_alt = min(altitudes)
    max_alt = max(altitudes)

    # Convertir a coordenadas SVG
    puntos_svg = []
    for d, a in zip(distancias, altitudes):
        x = d / max_dist * ancho_svg
        y = alto_svg - ((a - min_alt) / (max_alt - min_alt) * alto_svg)
        puntos_svg.append((x, y))

    # Crear SVG
    svg = Svg()
    # Dibujar ejes
    svg.addLine(0, 0, 0, alto_svg, stroke="black", strokeWidth="2")
    svg.addLine(0, alto_svg, ancho_svg, alto_svg, stroke="black", strokeWidth="2")

    # Dibujar cada tramo según sector
    for i in range(1, len(puntos_svg)):
        x1, y1 = puntos_svg[i-1]
        x2, y2 = puntos_svg[i]
        sector = sectores[i] if sectores[i] is not None else "1"
        color = COLOR_SECTOR.get(sector, "black")
        svg.addLine(x1, y1, x2, y2, stroke=color, strokeWidth=2)

    # Etiquetas de altitud
    svg.addText(f"Alt max: {max_alt:.2f} m", 10, 20, fontSize="14")
    svg.addText(f"Alt min: {min_alt:.2f} m", 10, alto_svg - 10, fontSize="14")

    # Guardar SVG
    svg.escribir("altimetria.svg")
    print("Archivo 'altimetria.svg' generado correctamente.")


if __name__ == "__main__":
    main()
