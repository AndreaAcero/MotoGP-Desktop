class Ciudad {
    #nombre;
    #pais;
    #gentilicio;
    #poblacion;
    #coordenadas;
    #datosCarrera; 
    #datosProcesados;
    #datosEntrenos;
    #datosEntrenosProcesados;
    constructor(nombre, pais, gentilicio) {
        this.#nombre = nombre;
        this.#pais = pais;
        this.#gentilicio = gentilicio;
        this.#poblacion = 0;
        this.#coordenadas = { lat: 0, lon: 0 };
        this.#datosCarrera = null;
        this.#datosProcesados = null;
    }

    setAtributos(poblacion, lat, lon) {
        this.#poblacion = poblacion;
        this.#coordenadas.lat = lat;
        this.#coordenadas.lon = lon;
    }

    getNombre() {
        return this.#nombre;
    }

    getPais() {
        return this.#pais;
    }

    getGentilicioPoblacion() {
        return { gentilicio: this.#gentilicio, poblacion: this.#poblacion };
    }

    getCoordenadas() {
        return { lat: this.#coordenadas.lat, lon: this.#coordenadas.lon };
    }

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
        if (!this.#datosCarrera) return null;

        const data = this.#datosCarrera;

        // Datos diarios
        const sunrise = data.daily?.sunrise?.[0] || null;
        const sunset = data.daily?.sunset?.[0] || null;

        // Datos horarios
        const hourly = data.hourly || {};
        const horas = hourly.time || [];
        const temperaturas = hourly.temperature_2m || [];
        const sensaciones = hourly.apparent_temperature || [];
        const lluvias = hourly.rain || [];
        const humedades = hourly.relativehumidity_2m || [];
        const vientos = hourly.windspeed_10m || [];
        const direcciones = hourly.winddirection_10m || [];

        const datosHorarios = horas.map((hora, i) => ({
            hora: hora,
            temperatura: temperaturas[i],
            sensacion: sensaciones[i],
            lluvia: lluvias[i],
            humedad: humedades[i],
            viento: vientos[i],
            direccionViento: direcciones[i]
        }));

        this.#datosProcesados = {
            sunrise,
            sunset,
            horarios: datosHorarios
        };

        console.log("Datos procesados del día de la carrera:", this.#datosProcesados);
        return this.#datosProcesados;
    }

    getDatosProcesados() {
        return this.#datosProcesados;
    }

    mostrarMeteorologiaCarrera(datos) {
    if (!datos) return;

    const $section = $('[data-contenedor-ciudad]');
    $section.empty(); 

    const $h3 = $('<h3>Datos meteorológicos del día de la carrera</h3>');
    $section.append($h3);

    const $pSol = $(`
        <p>
            <strong>Amanecer:</strong> ${datos.sunrise}<br>
            <strong>Atardecer:</strong> ${datos.sunset}
        </p>
    `);
    $section.append($pSol);

    const $tabla = $(`
        <table>
            <thead>
                <tr>
                    <th>Hora</th>
                    <th>Temp (°C)</th>
                    <th>Sensación térmica (°C)</th>
                    <th>Lluvia (mm)</th>
                    <th>Humedad (%)</th>
                    <th>Viento (km/h)</th>
                    <th>Dirección (°)</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    `);

    datos.horarios.slice(0, 10).forEach(d => {
        const $fila = $(`
            <tr>
                <td>${d.hora}</td>
                <td>${d.temperatura}</td>
                <td>${d.sensacion}</td>
                <td>${d.lluvia}</td>
                <td>${d.humedad}</td>
                <td>${d.viento}</td>
                <td>${d.direccionViento}</td>
            </tr>
        `);
        $tabla.find('tbody').append($fila);
    });

    $section.append($tabla);
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
        this.#datosEntrenos = data;  // Guardamos el objeto JSON recibido
    })
    .fail((jqxhr, textStatus, error) => {
        console.error("Error al obtener los datos de entrenamientos:", error);
    });
}

procesarJSONEntrenos() {
    if (!this.#datosEntrenos || !this.#datosEntrenos.hourly) {
        console.error("No hay datos de entrenamientos para procesar");
        return null;
    }

    const hourly = this.#datosEntrenos.hourly;
    const horas = hourly.time;
    const temperaturas = hourly.temperature_2m;
    const lluvias = hourly.rain;
    const vientos = hourly.windspeed_10m;
    const humedades = hourly.relativehumidity_2m;

    // Objeto para agrupar datos por día
    const datosPorDia = {};

    horas.forEach((hora, i) => {
        const dia = hora.split("T")[0]; // Ej: "2025-07-31"
        if (!datosPorDia[dia]) {
            datosPorDia[dia] = {
                temperatura: [],
                lluvia: [],
                viento: [],
                humedad: []
            };
        }
        datosPorDia[dia].temperatura.push(temperaturas[i]);
        datosPorDia[dia].lluvia.push(lluvias[i]);
        datosPorDia[dia].viento.push(vientos[i]);
        datosPorDia[dia].humedad.push(humedades[i]);
    });

    // Calcular medias
    const mediasPorDia = Object.entries(datosPorDia).map(([dia, valores]) => {
        const media = (arr) => (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2);
        return {
            dia,
            temperaturaMedia: media(valores.temperatura),
            lluviaMedia: media(valores.lluvia),
            vientoMedio: media(valores.viento),
            humedadMedia: media(valores.humedad)
        };
    });

    // Guardar en un atributo privado
    this.#datosEntrenosProcesados = mediasPorDia;
    console.log("Datos procesados de entrenamientos:", mediasPorDia);

    return mediasPorDia;
}

mostrarMeteorologiaEntrenos(datos) {
    if (!datos || datos.length === 0) {
        console.warn("No hay datos de entrenamientos para mostrar.");
        return;
    }

    const $section = $('[data-contenedor-ciudad]');

    // Añadir un título
    const $h3 = $('<h3>Medias meteorológicas de los entrenamientos</h3>');
    $section.append($h3);

    // Crear tabla
    const $tabla = $(`
        <table>
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Temperatura media (°C)</th>
                    <th>Lluvia media (mm)</th>
                    <th>Viento medio (km/h)</th>
                    <th>Humedad media (%)</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    `);

    // Rellenar la tabla con los datos procesados
    datos.forEach(d => {
        const $fila = $(`
            <tr>
                <td>${d.dia}</td>
                <td>${d.temperaturaMedia}</td>
                <td>${d.lluviaMedia}</td>
                <td>${d.vientoMedio}</td>
                <td>${d.humedadMedia}</td>
            </tr>
        `);
        $tabla.find('tbody').append($fila);
    });

    $section.append($tabla);
}


}
document.addEventListener('DOMContentLoaded', () => {
    const ciudad = new Ciudad("Towcester", "Reino Unido", "Towcesterian");
    ciudad.setAtributos(150000, 52.13, -0.99);

    const fechaCarrera = "2025-08-03";
    const fechaInicioEntrenos = "2025-07-31";
    const fechaFinEntrenos = "2025-08-02";

    const $section = $('[data-contenedor-ciudad]');
    $section.empty();

    const $intro = $(`<p>La ciudad de ${ciudad.getNombre()} se encuentra en ${ciudad.getPais()}.</p>`);
    $section.append($intro);

    const info = ciudad.getGentilicioPoblacion();
    const $ul = $(`<ul><li>Gentilicio: ${info.gentilicio}</li><li>Población: ${info.poblacion}</li></ul>`);
    $section.append($ul);

    const coords = ciudad.getCoordenadas();
    const $pCoords = $(`<p>Coordenadas: Latitud ${coords.lat}, Longitud ${coords.lon}</p>`);
    $section.append($pCoords);

    // Obtener y mostrar datos de la carrera
    ciudad.getMeteorologiaCarrera(fechaCarrera).done(() => {
        const datosCarrera = ciudad.procesarJSONCarrera();
        ciudad.mostrarMeteorologiaCarrera(datosCarrera);
    });

    // Obtener y mostrar datos de los entrenamientos
    ciudad.getMeteorologiaEntrenos(fechaInicioEntrenos, fechaFinEntrenos).done(() => {
        const datosEntrenos = ciudad.procesarJSONEntrenos();
        ciudad.mostrarMeteorologiaEntrenos(datosEntrenos);
    });
});
