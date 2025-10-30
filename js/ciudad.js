
class Ciudad{
    
     constructor(nombre, pais, gentilicio){
        this.nombre = nombre;
        this.pais = pais;
        this.gentilicio = gentilicio;

        this.poblacion = 0;
        this.coordenadas = {lat: 0, lon: 0};
    }

    setAtributos(poblacion, lat, lon){
        this.poblacion = poblacion;
        this.coordenadas.lat = lat;
        this.coordenadas.lon = lon;
    }
    
    getNombre(){
        return this.nombre;
    }
    
    getPais(){
        return this.pais;
    }

    getGentilicioPoblacion(){
        return `<ul><li>Gentilicio: ${this.gentilicio}</li><li>Población: ${this.poblacion}</li></ul>`;
    }
    getCoordenadas(){
        const p = document.createElement("p");
        p.textContent = `Coordenadas de ${this.nombre}: Latitud: ${this.coordenadas.lat} - Longitud: ${this.coordenadas.lon}`;
        document.body.insertBefore(p, document.body.firstChild);
    
    }

}