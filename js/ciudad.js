class Ciudad {
    #nombre;
    #pais;
    #gentilicio;
    #poblacion;
    #coordenadas;

    #datosCarrera; 
    #datosEntrenos;
    #datosEntrenosProcesados;

    #fechaCarrera;
    #fechaInicioEntrenos;
    #fechaFinEntrenos;
    #horaCarrera;

    constructor(nombre, pais, gentilicio) {
        this.#nombre = nombre;
        this.#pais = pais;
        this.#gentilicio = gentilicio;
        this.#poblacion = 0;
        this.#coordenadas = { lat: 0, lon: 0 };
    }

    setAtributos(poblacion, lat, lon) {
        this.#poblacion = poblacion;
        this.#coordenadas.lat = lat;
        this.#coordenadas.lon = lon;
    }

    setFechas(fechaCarrera, horaCarrera, fechaInicioEntrenos, fechaFinEntrenos) {
        this.#fechaCarrera = fechaCarrera;
        this.#horaCarrera = horaCarrera;
        this.#fechaInicioEntrenos = fechaInicioEntrenos;
        this.#fechaFinEntrenos = fechaFinEntrenos;
    }

    mostrarInformacionBasica() {
        const main = document.querySelector('main');

        const seccion = document.createElement('section');
        main.appendChild(seccion);

        const h3 = document.createElement('h3');
        h3.textContent = `Información de la ciudad: ${this.#nombre}`;
        seccion.appendChild(h3);

        const p = document.createElement('p');
        p.textContent = `La ciudad de ${this.#nombre} se encuentra en ${this.#pais}.`;
        seccion.appendChild(p);

        const ul = document.createElement('ul');
        ul.innerHTML = `<li>Gentilicio: ${this.#gentilicio}</li><li>Población: ${this.#poblacion}</li>`;
        seccion.appendChild(ul);

        const coords = document.createElement('p');
        coords.textContent = `Coordenadas: Latitud ${this.#coordenadas.lat}, Longitud ${this.#coordenadas.lon}`;
        seccion.appendChild(coords);
    }

    // --- MÉTODOS DE METEOROLOGÍA ---

    getMeteorologiaCarrera(fecha) {
        const url = "https://archive-api.open-meteo.com/v1/archive";

        return $.getJSON(url, {
            latitude: this.#coordenadas.lat,
            longitude: this.#coordenadas.lon,
            start_date: fecha,
            end_date: fecha,
            hourly: "temperature_2m,apparent_temperature,rain,relativehumidity_2m,windspeed_10m,winddirection_10m",
            daily: "sunrise,sunset",
            timezone: "Europe/London"
        })
        .done((data) => {
            console.log("Datos meteorológicos del día de la carrera:", data);
            this.#datosCarrera = data;
        })
        .fail((jqxhr, textStatus, error) => {
            console.error("Error al obtener los datos meteorológicos:", error);
        });
    }

    procesarJSONCarrera() {
        if (!this.#datosCarrera || !this.#datosCarrera.hourly) return null;

        const d = this.#datosCarrera;
        return d.hourly.time.map((hora, i) => ({
            hora: hora,
            temperatura2m: d.hourly.temperature_2m[i],
            sensacionTermica: d.hourly.apparent_temperature[i],
            lluvia: d.hourly.rain[i],
            humedad2m: d.hourly.relativehumidity_2m[i],
            velocidadViento10m: d.hourly.windspeed_10m[i],
            direccionViento10m: d.hourly.winddirection_10m[i],
            sunrise: d.daily.sunrise[0],
            sunset: d.daily.sunset[0]
        }));
    }

   mostrarMeteorologiaCarrera(datos) {
    if (!datos || datos.length === 0) return;

    const main = document.querySelector('main');
    const seccion = document.createElement('section');
    main.appendChild(seccion);

    const h3 = document.createElement('h3');
    h3.textContent = "Datos meteorológicos del día de la carrera";
    seccion.appendChild(h3);

    const primeraHora = datos[0];
    const pSol = document.createElement('p');
    pSol.innerHTML = `<strong>Amanecer:</strong> ${primeraHora.sunrise}<br><strong>Atardecer:</strong> ${primeraHora.sunset}`;
    seccion.appendChild(pSol);

    const h4Lista = document.createElement('h4');
    h4Lista.textContent = `Condiciones meteorológicas del día ${this.#fechaCarrera} a las ${this.#horaCarrera}`;
    seccion.appendChild(h4Lista);

    const horaCarreraCompleta = `${this.#fechaCarrera}T${this.#horaCarrera}`;
    const datoHoraCarrera = datos.find(d => d.hora === horaCarreraCompleta);

    const ul = document.createElement('ul');

    if (datoHoraCarrera) {
        ul.innerHTML = `
            <li><strong>Hora:</strong> ${datoHoraCarrera.hora}</li>
            <li><strong>Temperatura:</strong> ${datoHoraCarrera.temperatura2m} °C</li>
            <li><strong>Sensación térmica:</strong> ${datoHoraCarrera.sensacionTermica} °C</li>
            <li><strong>Lluvia:</strong> ${datoHoraCarrera.lluvia} mm</li>
            <li><strong>Humedad:</strong> ${datoHoraCarrera.humedad2m} %</li>
            <li><strong>Velocidad del viento:</strong> ${datoHoraCarrera.velocidadViento10m} km/h</li>
            <li><strong>Dirección del viento:</strong> ${datoHoraCarrera.direccionViento10m} °</li>
        `;
    } else {
        ul.innerHTML = `<li>No hay datos para la hora de la carrera (${this.#horaCarrera})</li>`;
    }

    seccion.appendChild(ul);
}


    getMeteorologiaEntrenos(fechaInicio, fechaFin) {
        const url = "https://archive-api.open-meteo.com/v1/archive";

        return $.getJSON(url, {
            latitude: this.#coordenadas.lat,
            longitude: this.#coordenadas.lon,
            start_date: fechaInicio,
            end_date: fechaFin,
            hourly: "temperature_2m,rain,windspeed_10m,relativehumidity_2m",
            timezone: "Europe/London"
        })
        .done((data) => {
            console.log("Datos meteorológicos de los entrenamientos:", data);
            this.#datosEntrenos = data;
        })
        .fail((jqxhr, textStatus, error) => {
            console.error("Error al obtener los datos de entrenamientos:", error);
        });
    }

    procesarJSONEntrenos() {
        if (!this.#datosEntrenos || !this.#datosEntrenos.hourly) return null;

        const hourly = this.#datosEntrenos.hourly;
        const horas = hourly.time;
        const temperaturas = hourly.temperature_2m;
        const lluvias = hourly.rain;
        const vientos = hourly.windspeed_10m;
        const humedades = hourly.relativehumidity_2m;

        const datosPorDia = {};

        horas.forEach((hora, i) => {
            const dia = hora.split("T")[0];
            if (!datosPorDia[dia]) {
                datosPorDia[dia] = { temperatura: [], lluvia: [], viento: [], humedad: [] };
            }
            datosPorDia[dia].temperatura.push(temperaturas[i]);
            datosPorDia[dia].lluvia.push(lluvias[i]);
            datosPorDia[dia].viento.push(vientos[i]);
            datosPorDia[dia].humedad.push(humedades[i]);
        });

        const mediasPorDia = Object.entries(datosPorDia).map(([dia, valores]) => {
            const media = arr => (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2);
            return {
                dia,
                temperaturaMedia: media(valores.temperatura),
                lluviaMedia: media(valores.lluvia),
                vientoMedio: media(valores.viento),
                humedadMedia: media(valores.humedad)
            };
        });

        this.#datosEntrenosProcesados = mediasPorDia;
        return mediasPorDia;
    }

    mostrarMeteorologiaEntrenos(datos) {
    if (!datos || datos.length === 0) return;

    const main = document.querySelector('main');
    const seccion = document.createElement('section');
    main.appendChild(seccion);

    const h3 = document.createElement('h3');
    h3.textContent = "Medias meteorológicas de los entrenamientos";
    seccion.appendChild(h3);

    datos.forEach(d => {
        const tituloDia = document.createElement('h4');
        tituloDia.textContent = `Fecha: ${d.dia}`;
        const ul = document.createElement('ul');
        ul.innerHTML = `
            <li><strong>Temperatura media:</strong> ${d.temperaturaMedia} °C</li>
            <li><strong>Lluvia media:</strong> ${d.lluviaMedia} mm</li>
            <li><strong>Viento medio:</strong> ${d.vientoMedio} km/h</li>
            <li><strong>Humedad media:</strong> ${d.humedadMedia} %</li>
        `;
        seccion.appendChild(tituloDia);
        seccion.appendChild(ul);
    });
}

}

// --- Uso ---
document.addEventListener('DOMContentLoaded', async () => {
    const ciudad = new Ciudad("Towcester", "Reino Unido", "Towcesterian");
    ciudad.setAtributos(150000, 52.13, -0.99);
    ciudad.setFechas("2025-05-25", "15:00", "2025-05-22", "2025-05-24");

    // Primero se muestra la info básica
    ciudad.mostrarInformacionBasica();

    await ciudad.getMeteorologiaCarrera("2025-05-25");
    ciudad.mostrarMeteorologiaCarrera(ciudad.procesarJSONCarrera());

    await ciudad.getMeteorologiaEntrenos("2025-05-22", "2025-05-24");
    ciudad.mostrarMeteorologiaEntrenos(ciudad.procesarJSONEntrenos());
});
