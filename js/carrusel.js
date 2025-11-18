class Carrusel {

    #busqueda;
    #actual;
    #maximo;
    #fotos;
    constructor(busqueda, actual, maximo){
        this.#busqueda = busqueda;
        this.#actual = actual;
        this.#maximo = maximo;
        this.#fotos=[];
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
    mostrarFotografias() {
        if (!this.#fotos || this.#fotos.length === 0) return;

        const main = document.querySelector('main');
        let section = main.querySelector('section');

        if (!section) {
            section = document.createElement('section');
            main.appendChild(section);
            
            // Añadir encabezado de la sección
            const h2 = document.createElement('h2');
            h2.textContent = "Galeria de imagenes MotoGP"; 
            section.appendChild(h2);
        }

        // Crear el primer artículo
        this.#mostrarFotoActual(section);

        // Iniciar el carrusel
        setInterval(() => this.cambiarFotografia(section), 3000);
    }

    #mostrarFotoActual(section) {
        const foto = this.#fotos[this.#actual];

        const article = document.createElement('article');
        const h2 = document.createElement('h2');
        h2.textContent = `Imágenes del circuito de ${this.#busqueda}`;

        const img = document.createElement('img');
        img.src = foto.imagen;
        img.alt = foto.titulo;

        article.appendChild(h2);
        article.appendChild(img);

        section.innerHTML = ''; // Limpiar contenido previo
        section.appendChild(article);
        console.log(`Mostrando foto ${this.#actual + 1} de ${img.src }`);
    }

    cambiarFotografia(section) {
        if (!this.#fotos || this.#fotos.length === 0) return;

        this.#actual = (this.#actual + 1) % this.#fotos.length;
        this.#mostrarFotoActual(section);
    }


}
$(document).ready(function() {
    const carruselMotoGP = new Carrusel( "motogp, Silverstone", 0, 5);

    carruselMotoGP.getFotografias().done((data) => {
        carruselMotoGP.procesarJSONFotografias(data);
        carruselMotoGP.mostrarFotografias();
    });
});


