class Memoria {
    constructor() {
        console.log("Juego de memoria inicializado");
    }

    flipCard(card) {
        card.dataset.state = "flip";
        console.log("Carta volteada:", card);
    }
}
const juegoMemoria = new Memoria();