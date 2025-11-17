import xml.etree.ElementTree as ET

# Cargar XML
tree = ET.parse('circuitoEsquema.xml')
root = tree.getroot()
ns = {'ns': 'http://www.uniovi.es'}

with open('circuito.kml', 'w', encoding='utf-8') as f:
    f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    f.write('<kml xmlns="http://www.opengis.net/kml/2.2">\n')
    f.write('  <Document>\n')

    # --- Placemark del punto de origen ---
    punto_origen = root.find('.//ns:puntoOrigen', ns)
    if punto_origen is not None:
        lon = punto_origen.find('ns:longitud', ns).text
        lat = punto_origen.find('ns:latitud', ns).text
        alt = punto_origen.find('ns:altitud', ns).text
        f.write('    <Placemark>\n')
        f.write('      <name>Punto de Origen</name>\n')
        f.write('      <Point>\n')
        f.write('        <coordinates>{},{},{}</coordinates>\n'.format(lon, lat, alt))
        f.write('      </Point>\n')
        f.write('    </Placemark>\n')

    # --- Placemark del circuito (LineString) ---
    f.write('    <Placemark>\n')
    f.write('      <name>Silverstone Circuit</name>\n')
    f.write('      <LineString>\n')
    f.write('        <altitudeMode>absolute</altitudeMode>\n')
    f.write('        <coordinates>\n')

    last_coords = None
    for tramo in root.findall('.//ns:tramos/ns:tramo', ns):
        lon = tramo.find('ns:longitud', ns).text
        lat = tramo.find('ns:latitud', ns).text
        alt = tramo.find('ns:altitud', ns).text
        coords = f"{lon},{lat},{alt}"
        if coords != last_coords:  # evita duplicados consecutivos
            f.write(f"          {coords}\n")
            last_coords = coords

    f.write('        </coordinates>\n')
    f.write('      </LineString>\n')
    f.write('    </Placemark>\n')

    f.write('  </Document>\n')
    f.write('</kml>\n')
