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
    const $main = $('main');

    // Crear la segunda sección solo si no existe
    let $section = $main.find('section').eq(1); // segunda sección
    if ($section.length === 0) {
        $section = $('<section></section>');
        $main.append($section);
    }

    $section.find('article').remove();

    this.#noticias.forEach(noticia => {
        const $article = $('<article></article>');
        const $titulo = $('<h3></h3>').text(noticia.titulo);
        const $entradilla = $('<p></p>').text(noticia.entradilla);
        const $enlace = $('<a></a>').attr('href', noticia.enlace).attr('target','_blank').text('Leer más');
        const $fuente = $('<p></p>').text(`Fuente: ${noticia.fuente}`);

        $article.append($titulo, $entradilla, $enlace, $fuente);
        $section.append($article);
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