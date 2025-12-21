class Cronometro {
    #tiempo = 0;
    #inicio = null;
    #corriendo = null;
    #usandoTemporal = false;

    onActualizar = null;

    constructor() {}

    arrancar() {
        try {
            this.#corriendo = setInterval(this.#actualizar.bind(this), 100);

            if (typeof Temporal !== "undefined" && Temporal.Now) {
                this.#inicio = Temporal.Now.instant();
                this.#usandoTemporal = true;
            } else {
                throw new Error("Temporal no disponible");
            }
        } catch (error) {
            this.#inicio = new Date();
            this.#usandoTemporal = false;
        }
    }

    #actualizar() {
        try {
            let ahora;
            if (this.#usandoTemporal) {
                ahora = Temporal.Now.instant();
                this.#tiempo = ahora.epochMilliseconds - this.#inicio.epochMilliseconds;
            } else {
                ahora = new Date();
                this.#tiempo = ahora - this.#inicio;
            }
        } catch (error) {
            console.error("Error al actualizar el cronómetro:", error);
        }

        this.#emitir();
    }

    #emitir() {
        if (typeof this.onActualizar === "function") {
            this.onActualizar(this.formatear());
        }
    }

    formatear() {
        const totalMs = this.#tiempo;
        const minutos = parseInt(totalMs / 60000);
        const segundos = parseInt((totalMs % 60000) / 1000);
        const decimas = parseInt((totalMs % 1000) / 100);
        const mm = String(minutos).padStart(2, '0');
        const ss = String(segundos).padStart(2, '0');
        return `${mm}:${ss}.${decimas}`;
    }

    parar() {
        clearInterval(this.#corriendo);
        this.#corriendo = null;
        this.#emitir();
    }

    reiniciar() {
        clearInterval(this.#corriendo);
        this.#corriendo = null;
        this.#tiempo = 0;
        this.#emitir();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const miCronometro = new Cronometro();

    const botones = document.querySelectorAll('main button');
    const parrafoTiempo = document.querySelector('main p');

    miCronometro.onActualizar = (textoTiempo) => {
        parrafoTiempo.textContent = textoTiempo;
    };

    botones[0].addEventListener('click', () => miCronometro.arrancar());
    botones[1].addEventListener('click', () => miCronometro.parar());
    botones[2].addEventListener('click', () => miCronometro.reiniciar());
});
