class Circuito {
    #contenido;          // string del HTML
    #contenedorHTML;      // nodo DOM del HTML cargado

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

        // Si ya hay un contenedor HTML, eliminarlo
        if (this.#contenedorHTML) {
            this.#contenedorHTML.remove();
        }

        // Crear un nuevo contenedor y añadir los nodos del HTML
        this.#contenedorHTML = document.createElement("section");
        this.#contenedorHTML.append(...bodyOriginal.childNodes);

        main.appendChild(this.#contenedorHTML);
        this.arreglarRutas(this.#contenedorHTML);
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
    #contenidoSVG;        // string del SVG
    #contenedorSVG;        // nodo DOM del SVG

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

        // Si ya hay un SVG, eliminarlo
        if (this.#contenedorSVG) {
            this.#contenedorSVG.remove();
        }

        // Crear contenedor para el SVG
        this.#contenedorSVG = document.createElement("section");
        this.#contenedorSVG.appendChild(svg);

        main.appendChild(this.#contenedorSVG);
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const circuito = new Circuito();
    const cargadorSVG = new CargadorSVG();

    // Primer input = HTML
    const inputHTML = document.querySelector("main input[type='file']:first-of-type");
    inputHTML.addEventListener("change", (e) => {
        const archivo = e.target.files[0];
        circuito.leerArchivoHTML(archivo);
    });

    // Segundo input = SVG
    const inputSVG = document.querySelector("main input[type='file']:last-of-type");
    inputSVG.addEventListener("change", (e) => {
        const archivo = e.target.files[0];
        cargadorSVG.leerArchivoSVG(archivo);
    });
});
