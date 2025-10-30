class Memoria {
    constructor() {
        console.log("Juego de memoria inicializado");
    }

    voltearCarta(card) {
        card.setAttribute("data-Estado", "revelado");
         console.log("Carta volteada:", card);
    }
}
const juegoMemoria = new Memoria();