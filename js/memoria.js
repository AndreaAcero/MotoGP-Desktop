class Memoria {
    #tablero_bloqueado = true;
    #primera_carta = null;
    #segunda_carta = null;
    #cronometro = null;

    constructor() {
        console.log("Juego de memoria inicializado");
        this.#cronometro = new Cronometro();

        this.#barajarCartas();
        this.#tablero_bloqueado = false;

        // Iniciar cronómetro
        this.#cronometro.arrancar();

        // Registrar eventos de click en las cartas
        const cartas = document.querySelectorAll('main article');
        cartas.forEach(carta => {
            carta.addEventListener('click', () => this.voltearCarta(carta));
        });

        // Actualizar cronómetro en el párrafo
        const parrafoTiempo = document.querySelector('main p');
        this.#cronometro.onActualizar = (texto) => parrafoTiempo.textContent = texto;
    }

    voltearCarta(carta) {
        if (this.#tablero_bloqueado) return;
        if (carta.classList.contains("revelada")) return;
        if (carta.getAttribute("data-estado") === "volteada") return;

        carta.setAttribute("data-estado", "volteada");

        if (!this.#primera_carta) {
            this.#primera_carta = carta;
            return;
        }

        this.#segunda_carta = carta;
        this.#comprobarPareja();
        this.#comprobarJuego();
    }

    #barajarCartas() {
        const contenedor = document.querySelector('main');
        const cartas = Array.from(contenedor.querySelectorAll('article'));
        for (let i = cartas.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            contenedor.appendChild(cartas[j]);
            cartas[j] = cartas[i];
        }
    }

    #reiniciarTablero() {
        this.#tablero_bloqueado = false;
        this.#primera_carta = null;
        this.#segunda_carta = null;
    }

    #deshabilitarCartas() {
        if (this.#primera_carta && this.#segunda_carta) {
            this.#primera_carta.classList.add("revelada");
            this.#segunda_carta.classList.add("revelada");
            this.#reiniciarTablero();
        }
    }

    #cubrirCartas() {
        this.#tablero_bloqueado = true;
        setTimeout(() => {
            if (this.#primera_carta && this.#segunda_carta) {
                this.#primera_carta.setAttribute("data-estado", "oculto");
                this.#segunda_carta.setAttribute("data-estado", "oculto");
            }
            this.#reiniciarTablero();
        }, 1500);
    }

    #comprobarPareja() {
        if (!this.#primera_carta || !this.#segunda_carta) return;

        const img1 = this.#primera_carta.querySelector('img').getAttribute('src');
        const img2 = this.#segunda_carta.querySelector('img').getAttribute('src');

        (img1 === img2) ? this.#deshabilitarCartas() : this.#cubrirCartas();
    }

    #comprobarJuego() {
        const cartas = document.querySelectorAll('main article');
        const todasReveladas = Array.from(cartas).every(carta => carta.classList.contains('revelada'));

        if (todasReveladas) {
            this.#cronometro.parar();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Memoria();
});
