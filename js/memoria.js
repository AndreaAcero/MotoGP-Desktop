class Memoria {
    constructor() {
        console.log("Juego de memoria inicializado");
        this.tablero_bloqueado = true;
        this.primera_carta = null;
        this.segunda_carta = null;
        this.barajarCartas();
        this.tablero_bloqueado = false;
        this.cronometro = new Cronometro();
        this.cronometro.arrancar();
    }

    voltearCarta(carta) {
        if (this.tablero_bloqueado) return;
        if(carta.classList.contains("revelada")) return;
        if(carta.getAttribute("data-Estado") === "volteada") return;

        carta.setAttribute("data-Estado", "volteada");
        if (!this.primera_carta) {
            this.primera_carta = carta;
            return;
        }
        this.segunda_carta = carta;
        this.comprobarPareja();


    }

    barajarCartas(){
        const contenedor = document.querySelector('main');

        // Obtener todas las cartas como array
        const cartas = Array.from(contenedor.querySelectorAll('article'));       
        for(let i = cartas.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * (i + 1));
            contenedor.appendChild(cartas[j]);
            cartas[j] = cartas[i];
        }
    }

    reiniciarTablero(){
        this.tablero_bloqueado = true;
        this.primera_carta = null;
        this.segunda_carta = null;
        this.tablero_bloqueado = false;
    }

    deshabilitarCartas(){
        if(this.primera_carta && this.segunda_carta){
           this.primera_carta.classList.add("revelada");
            this.segunda_carta.classList.add("revelada");
            this.reiniciarTablero();
        }
    }

     comprobarJuego() {
        const cartas = document.querySelectorAll('main article');
        const todasReveladas = Array.from(cartas).every(carta => carta.classList.contains('revelada'));

        if (todasReveladas) {
            alert("¡Felicidades! Has completado el juego de memoria.");
        }
        this.cronometro.parar();
    }

    cubrirCartas(){
        this.tablero_bloqueado = true;
        setTimeout(() => {
            if(this.primera_carta && this.segunda_carta){
                this.primera_carta.setAttribute("data-Estado", "oculto");
                this.segunda_carta.setAttribute("data-Estado", "oculto");
            }
             this.reiniciarTablero();

        }, 1500);
    }

     comprobarPareja() {
        if (!this.primera_carta || !this.segunda_carta) return;

        const imgPrimera = this.primera_carta.querySelector('img').getAttribute('src');
        const imgSegunda = this.segunda_carta.querySelector('img').getAttribute('src');

        (imgPrimera === imgSegunda) ? this.deshabilitarCartas() : this.cubrirCartas();
    }



}
const juegoMemoria = new Memoria();