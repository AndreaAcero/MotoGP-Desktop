class Noticia{

    #busqueda;
    #url;
    #noticias;
    constructor(buqueda, url){
        this.#busqueda = buqueda;
        this.#url = url;
    }

    
    buscar() {
        const urlCompleta = `${this.#url}&search=${encodeURIComponent(this.#busqueda)}`;

        return fetch(urlCompleta)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error en la petición: ${response.status}`);
                }
                return response.json(); 
            })
            .catch(error => console.error("Error al obtener noticias:", error));
    }

    procesarInformacion(json) {
        if (!json || !json.data) return;

        this.#noticias = json.data.map(noticia => ({
            titulo: noticia.title,
            entradilla: noticia.description,
            enlace: noticia.url,
            fuente: noticia.source
        }));

        console.log("Noticias procesadas:", this.#noticias);
    }

  mostrarNoticias() {
    const main = document.querySelector('main');

    // Crear la segunda sección solo si no existe
    let section = main.querySelectorAll('section')[1];
    if (!section) {
        section = document.createElement('section');
        main.appendChild(section);
        
        // Añadir encabezado de la sección
        const h2 = document.createElement('h2');
        h2.textContent = "Últimas noticias MotoGP 2025"; 
        section.appendChild(h2);
    }
    // Limpiar artículos previos
    section.querySelectorAll('article').forEach(a => a.remove());

    this.#noticias.forEach(noticia => {
        const article = document.createElement('article');

        const h3 = document.createElement('h3');
        h3.textContent = noticia.titulo;

        const pEntradilla = document.createElement('p');
        pEntradilla.textContent = noticia.entradilla;

        const enlace = document.createElement('a');
        enlace.href = noticia.enlace;
        enlace.target = "_blank";
        enlace.textContent = "Leer más";

        const pFuente = document.createElement('p');
        pFuente.textContent = `Fuente: ${noticia.fuente}`;

        article.append(h3, pEntradilla, enlace, pFuente);
        section.appendChild(article);
    });
}



}
$(document).ready(function() {
    const miNoticia = new Noticia(
        "MotoGP",
        "https://api.thenewsapi.com/v1/news/all?api_token=J4w1psyq3yd1cIjfX6TPefAKQf4cRILLVrZ22kOP&language=es&limit=5"
   );

    miNoticia.buscar().then(data => {
        miNoticia.procesarInformacion(data);
        miNoticia.mostrarNoticias();
    });
});