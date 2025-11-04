class Cronometro{
    constructor(){
        this.tiempo = 0;
        this.inicio = null;
        this.corriendo = null;
        this.usandoTemporal = false; 
    }
    
    arrancar(){
        try {
            this.corriendo = setInterval(this.actualizar.bind(this), 100);
            // Comprobamos si el objeto Temporal existe
            if (typeof Temporal !== "undefined" && Temporal.Now) {
                // Si está disponible, usamos Temporal para obtener el instante actual
                this.inicio = Temporal.Now.instant();
                this.usandoTemporal = true;
            } else {
                // Si no está disponible, lanzamos un error para pasar al catch
                throw new Error("Temporal no disponible");
            }
        } catch (error) {
            // Fallback: usamos el objeto Date
            this.inicio = new Date();
        }

        console.log("Cronómetro arrancado en:", this.inicio);
    }

    actualizar(){
        let ahora;
        //if (this.corriendo) return;
        try{
            if (this.usandoTemporal) {
                ahora = Temporal.Now.instant();
                this.tiempo = ahora.epochMilliseconds - this.inicio.epochMilliseconds;
            } else {
                const ahora = new Date();
                this.tiempo = ahora - this.inicio;
            }
        } catch (error) {
            console.error("Error al actualizar el cronómetro:", error);
        }
        
        console.log("Tiempo transcurrido (ms):", this.tiempo);
    }

    mostrar(){
        let totalMilisegundos = this.tiempo;
        let minutos = parseInt(totalMilisegundos / 60000); // 1 minuto = 60000 ms
        let segundos = parseInt((totalMilisegundos % 60000) / 1000); // segundos restantes
        let decimas = parseInt((totalMilisegundos % 1000) / 100); // décimas de segundo
        let mm = String(minutos).padStart(2, '0');
        let ss = String(segundos).padStart(2, '0');
        let sDecima = String(decimas);
        let tiempoFormateado = `${mm}:${ss}.${sDecima}`;
        document.querySelector('main p').textContent = tiempoFormateado;
    }

    parar() {
        this.mostrar();
        clearInterval(this.corriendo);
        this.corriendo = null; 
    }

    reiniciar(){
        clearInterval(this.corriendo);
        this.corriendo=null;
        this.tiempo=0;
        this.mostrar();
    }



}