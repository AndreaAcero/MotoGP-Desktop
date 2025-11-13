class Carrusel {

    #busqueda;
    #actual;
    #maximo;
    #fotos;
    constructor(busqueda, actual, maximo){
        this.#busqueda = busqueda;
        this.#actual = actual;
        this.#maximo = maximo;
    }

    getFotografias() {
    const flickrAPI = "https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";

    // Devolver la Promise del AJAX
    return $.getJSON(flickrAPI, {
        tags: this.#busqueda,
        tagmode: "all",
        format: "json"
    })
    .done((data) => {
        console.log("Objeto JSON recibido de Flickr:", data);
    })
    .fail((jqxhr, textStatus, error) => {
        console.error("Error al obtener fotos de Flickr:", error);
    });
}


   procesarJSONFotografias(data) {
    if (!data || !data.items) return;

    this.#fotos = data.items.slice(0, 5).map(item => ({
        imagen: item.media.m.replace("_m.", "_z."), 
        titulo: item.title,
        enlace: item.link,
        autor: item.author
    }));

    console.log("Fotos procesadas para el carrusel:", this.#fotos);
}
    mostrarFotografias(){
        if(this.#fotos.length === 0) return;

        const foto = this.#fotos[this.#actual];

        const $article = $("<article></article>");
        const $h2 = $(`<h2>Imágenes del circuito de ${this.#busqueda}</h2>`);
        const $img = $(`<img src="${foto}" alt=" ${foto.titulo}">`);
        $article.append($h2);
        $article.append($img);

        $('main section').first().html($article);

        setInterval(this.cambiarFotografia.bind(this), 3000);

    }

    cambiarFotografia(){
        if(this.#fotos.length === 0) return;
        this.#actual = (this.#actual + 1) % this.#fotos.length;
        const foto = this.#fotos[this.#actual];
    $('main img').attr('src', foto.imagen).attr('alt', foto.titulo);

    }

    

}
$(document).ready(function() {
    const carruselMotoGP = new Carrusel( "motogp, Silverstone", 0, 5);

    carruselMotoGP.getFotografias().done((data) => {
        carruselMotoGP.procesarJSONFotografias(data);
        carruselMotoGP.mostrarFotografias();
    });
});


