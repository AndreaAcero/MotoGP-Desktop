class Circuito {
    #contenido;          
    #contenedorHTML;      

    constructor() {
        this.comprobarApiFile();
    }

    comprobarApiFile() {
        const main = document.querySelector("main");
        const p = document.createElement("p");

        if (window.File && window.FileReader && window.FileList && window.Blob) {
            p.textContent = "Este navegador soporta el API File.";
        } else {
            p.textContent = "¡¡¡ Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!";
        }

        main.appendChild(p);
    }

    leerArchivoHTML(archivo) {
        if (!archivo || archivo.type !== "text/html") return;

        const lector = new FileReader();
        lector.onload = () => {
            this.#contenido = lector.result;
            this.mostrarContenido();
        };
        lector.readAsText(archivo, "UTF-8");
    }

   mostrarContenido() {
    const parser = new DOMParser();
    const doc = parser.parseFromString(this.#contenido, "text/html");
    const bodyOriginal = doc.body;
    const main = document.querySelector("main");

    
    main.querySelectorAll("section").forEach(sec => sec.remove());

    Array.from(bodyOriginal.childNodes).forEach(node => {
        if (node.nodeName.toLowerCase() === "main") {
            Array.from(node.childNodes).forEach(n => main.appendChild(n));
        } else {
            main.appendChild(node);
        }
    });

    this.arreglarRutas(main);
}


    arreglarRutas(contenedor) {
        const elementos = contenedor.querySelectorAll("img, video source");
        elementos.forEach(el => {
            let ruta = el.getAttribute("src");
            if (ruta && ruta.startsWith("..")) {
                el.setAttribute("src", ruta.replace(/^\.\.\//, ""));
            }
        });
    }
}

class CargadorSVG {
    #contenidoSVG;        
    #contenedorSVG;        

    constructor() {
        this.#contenidoSVG = "";
    }

    leerArchivoSVG(archivo) {
        if (!archivo || archivo.type !== "image/svg+xml") {
            alert("Por favor, selecciona un archivo SVG válido.");
            return;
        }

        const lector = new FileReader();
        lector.onload = (e) => {
            this.#contenidoSVG = e.target.result;
            this.insertarSVG();
        };
        lector.readAsText(archivo);
    }

    insertarSVG() {
        const parser = new DOMParser();
        const doc = parser.parseFromString(this.#contenidoSVG, "image/svg+xml");
        const svg = doc.documentElement;

        const main = document.querySelector("main");
        const h3 = document.createElement('h3');
        h3.textContent = "Representación archivo SVG";
        if (this.#contenedorSVG) this.#contenedorSVG.remove();

        this.#contenedorSVG = document.createElement("section");
        this.#contenedorSVG.appendChild(h3);
        this.#contenedorSVG.appendChild(svg);

        main.appendChild(this.#contenedorSVG);
    }
}

class CargadorKML {
    #origen;   
    #tramos;   
    #polilineas; 
    #marcador;

    constructor() {
        this.#origen = null;
        this.#tramos = [];
        this.#polilineas = [];
        this.#marcador = null;
    }

    leerArchivoKML(archivo, mapa) {
        if (!archivo || !archivo.name.endsWith(".kml")) {
            alert("Por favor, selecciona un archivo KML válido.");
            return;
        }

        const lector = new FileReader();
        lector.onload = (e) => {
            const textoKML = e.target.result;

            setTimeout(() => {
                const parser = new DOMParser();
                const xml = parser.parseFromString(textoKML, "text/xml");

                const nodoOrigen = xml.querySelector("Point > coordinates");
                if (nodoOrigen) {
                    const [lon, lat] = nodoOrigen.textContent.trim().split(",");
                    this.#origen = { lat: parseFloat(lat), lon: parseFloat(lon) };
                }
                

                this.#tramos = [];
                const lineas = xml.querySelectorAll("LineString > coordinates");
                lineas.forEach((linea) => {
                    const pares = linea.textContent.trim().split(/\s+/);
                    const tramo = pares.filter((_, i) => i % 2 === 0).map(par => {
                        const [lon, lat] = par.split(",");
                        return { lat: parseFloat(lat), lon: parseFloat(lon) };
                    });
                    this.#tramos.push(tramo);
                });
                console.log("Origen:", this.#origen);
                console.log("Tramos:", this.#tramos);

                this.insertarCapaKML(mapa);
            }, 0);
        };
        lector.readAsText(archivo);
    }

    insertarCapaKML(mapa) {
    if (!this.#origen || this.#tramos.length === 0) {
        alert("Primero debes cargar un archivo KML válido.");
        return;
    }

    if (this.#marcador) this.#marcador.setMap(null);
    this.#polilineas.forEach(p => p.setMap(null));
    this.#polilineas = [];

    this.#marcador = new google.maps.Marker({
        position: { lat: this.#origen.lat, lng: this.#origen.lon },
        map: mapa,
        title: "Punto de inicio del circuito"
    });

    const primerTramo = this.#tramos[0];
    const caminoInicial = [
        { lat: this.#origen.lat, lng: this.#origen.lon },
        { lat: primerTramo[0].lat, lng: primerTramo[0].lon }
    ];
    const polilineaInicial = new google.maps.Polyline({
        path: caminoInicial,
        strokeWeight: 4,
        strokeColor: "#ff0000",
        map: mapa
    });
    this.#polilineas.push(polilineaInicial);
    this.#tramos.forEach(tramo => {
        const camino = tramo.map(p => ({ lat: p.lat, lng: p.lon }));
        const polilinea = new google.maps.Polyline({
            path: camino,
            strokeWeight: 4,
            strokeColor: "#ff0000",
            map: mapa
        });
        this.#polilineas.push(polilinea);
    }
    
);

    const limites = new google.maps.LatLngBounds();
    limites.extend(new google.maps.LatLng(this.#origen.lat, this.#origen.lon));
    this.#tramos.forEach(tramo => {
        tramo.forEach(p => limites.extend(new google.maps.LatLng(p.lat, p.lon)));
    });
    mapa.fitBounds(limites);
}

}

let mapaGoogle;

function initMap() {
    const divMapa = document.querySelector("body > div");
    if (!divMapa) {
        console.error("No se encontró el div del mapa");
        return;
    }
    console.log(divMapa);

    mapaGoogle = new google.maps.Map(divMapa, {
        center: { lat: 52.07031113181628, lng: -1.0135833960740852},
        zoom: 8
    });
}


document.addEventListener("DOMContentLoaded", () => {
    const circuito = new Circuito();
    const cargadorSVG = new CargadorSVG();
    const cargadorKML = new CargadorKML();

    const inputHTML = document.querySelector("main input[type='file']:first-of-type");
    inputHTML.addEventListener("change", (e) => {
        const archivo = e.target.files[0];
        circuito.leerArchivoHTML(archivo);
    });

    const inputSVG = document.querySelector("main input[type='file']:nth-of-type(2)");
    inputSVG.addEventListener("change", (e) => {
        const archivo = e.target.files[0];
        cargadorSVG.leerArchivoSVG(archivo);
    });

    const inputKML = document.querySelector("main input[type='file']:nth-of-type(3)");
    inputKML.addEventListener("change", (e) => {
        const archivo = e.target.files[0];
        cargadorKML.leerArchivoKML(archivo, mapaGoogle);
    });
});
