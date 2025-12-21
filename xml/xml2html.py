# xml2html.py
# -*- coding: utf-8 -*-
"""
Genera un archivo InfoCircuito.html a partir de circuitoEsquema.xml
Sin usar id ni class, mantiene la estructura semántica y enlaces a CSS y multimedia.
"""

import xml.etree.ElementTree as ET

class Html:
    def __init__(self, titulo="InfoCircuito"):
        self.lineas = []
        self.addLine("<!DOCTYPE html>")
        self.addLine('<html lang="es">')
        self.addLine("<head>")
        self.addLine("    <meta charset='UTF-8'>")
        self.addLine("    <meta name='viewport' content='width=device-width, initial-scale=1.0'>")
        self.addLine(f"    <title>{titulo}</title>")
        self.addLine("    <link rel='stylesheet' href='../estilo/estilo.css'>")
        self.addLine("    <link rel='stylesheet' href='../estilo/layout.css'>")
        self.addLine("    <meta name='author' content='Andrea Acero Suárez' />")
        self.addLine("    <meta name='description' content='Información detallada del circuito, galerías de fotos y videos, y clasificación del Mundial de MotoGP' />")
        self.addLine("    <meta name='keywords' content='MotoGP, circuito, Silverstone, pilotos, clasificación, fotos, videos' />")
        self.addLine("    <link rel='icon' href='../multimedia/favicon.ico' type='image/x-icon' />")
        self.addLine("</head>")
        self.addLine("<body>")
        self.addLine("<main>")


    # -------------------------------
    # Utilidades internas
    # -------------------------------
    def addLine(self, texto):
        self.lineas.append(texto)

    def addSection(self, titulo, nivel=2):
        self.addLine("<section>")
        self.addLine(f"  <h{nivel}>{titulo}</h{nivel}>")

    def endSection(self):
        self.addLine("</section>")

    def addParagraph(self, texto):
        self.addLine(f"<p>{texto}</p>")

    def addList(self, elementos):
        self.addLine("<ul>")
        for e in elementos:
            self.addLine(f"  <li>{e}</li>")
        self.addLine("</ul>")

    def addReferences(self, urls):
        """Genera aside sin clase ni id"""
        self.addLine("<aside>")
        self.addLine("<h3>Referencias</h3>")
        self.addLine("<ul>")
        for u in urls:
            self.addLine(f"  <li><a href='{u}' target='_blank' rel='noopener noreferrer'>{u}</a></li>")
        self.addLine("</ul>")
        self.addLine("</aside>")

    def addImages(self, rutas):
        """Galería de fotos sin id ni class"""
        self.addLine("<section>")
        self.addLine("  <h3>Galería de fotos</h3>")
        for r in rutas:
            nombre = r.split('/')[-1].split('.')[0].replace('_', ' ').capitalize()
            self.addLine("  <figure>")
            self.addLine(f"    <img src='{r}' alt='{nombre}' loading='lazy'>")
            self.addLine(f"    <figcaption>{nombre}</figcaption>")
            self.addLine("  </figure>")
        self.addLine("</section>")

    def addVideos(self, rutas):
        """Galería de videos sin id ni class"""
        self.addLine("<section>")
        self.addLine("  <h3>Galería de videos</h3>")
        for r in rutas:
            nombre = r.split('/')[-1].split('.')[0].replace('_', ' ').capitalize()
            self.addLine("  <figure>")
            self.addLine("    <video controls>")
            self.addLine(f"      <source src='{r}' type='video/mp4'>")
            self.addLine("      Tu navegador no soporta video HTML5.")
            self.addLine("    </video>")
            self.addLine(f"    <figcaption>{nombre}</figcaption>")
            self.addLine("  </figure>")
        self.addLine("</section>")

    def escribir(self, archivo):
        """Cierra las etiquetas y guarda el HTML"""
        self.addLine("</main>")
        self.addLine("</body>")
        self.addLine("</html>")
        with open(archivo, "w", encoding="utf-8") as f:
            f.write("\n".join(self.lineas))
        print(f"✅ Archivo '{archivo}' generado correctamente.")

# --------------------------------------------------
# Función principal
# --------------------------------------------------
def main():
    xml_file = "circuitoEsquema.xml"
    tree = ET.parse(xml_file)
    root = tree.getroot()
    ns = {'ns': 'http://www.uniovi.es'}

    html = Html(titulo="Información del Circuito")

    # Información del circuito
    html.addSection("Información del circuito")
    datos = [
        ("Nombre", root.find('ns:nombre', ns).text),
        ("Longitud", f"{root.find('ns:longitud', ns).text} metros"),
        ("Anchura", f"{root.find('ns:anchura', ns).text} metros"),
        ("Fecha", root.find('ns:fecha', ns).text),
        ("Hora", root.find('ns:hora', ns).text),
        ("Número de vueltas", root.find('ns:numVueltas', ns).text),
        ("Localidad", root.find('ns:localidad', ns).text),
        ("País", root.find('ns:pais', ns).text),
        ("Patrocinador", root.find('ns:patrocinador', ns).text)
    ]
    for etiqueta, valor in datos:
        html.addParagraph(f"<strong>{etiqueta}:</strong> {valor}")
    html.endSection()

    # Referencias
    referencias = [r.text for r in root.findall('.//ns:referencias/ns:referencia', ns)]
    if referencias:
        html.addReferences(referencias)

    # Galería de fotos
    fotos = [f.text for f in root.findall('.//ns:galeriaFotos/ns:foto', ns)]
    if fotos:
        html.addImages(fotos)

    # Galería de videos
    videos = [v.text for v in root.findall('.//ns:galeriaVideos/ns:video', ns)]
    if videos:
        html.addVideos(videos)

    # Vencedor
    html.addSection("Vencedor de la carrera")
    ganador = root.find('.//ns:vencedor/ns:nombre', ns).text
    tiempo = root.find('.//ns:vencedor/ns:tiempo', ns).text
    html.addParagraph(f"<strong>{ganador}</strong> — Tiempo: {tiempo}")
    html.endSection()

    # Clasificación Mundial
    pilotos = root.findall('.//ns:clasificacionMundial/ns:piloto', ns)
    html.addSection("Clasificación Mundial")
    html.addLine("<table>")
    html.addLine("<thead><tr><th>Posición</th><th>Piloto</th><th>Puntos</th></tr></thead>")
    html.addLine("<tbody>")
    for p in pilotos:
        pos = p.attrib.get("posicion")
        nombre = p.find('ns:nombre', ns).text
        puntos = p.find('ns:puntos', ns).text
        html.addLine(f"<tr><td>{pos}</td><td>{nombre}</td><td>{puntos}</td></tr>")
    html.addLine("</tbody></table>")
    html.endSection()

    # Guardar HTML
    html.escribir("InfoCircuito.html")

if __name__ == "__main__":
    main()
