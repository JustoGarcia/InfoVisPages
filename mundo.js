const continentSelect = document.getElementById('continentSelect');
const myPlot = document.getElementById('myMap');
const svgImage = document.getElementById('context'); // Referencia a la imagen SVG

function updateMap(continent) {
    let filteredData;

    // Filtrar datos según el continente o "World"
    if (continent === "World") {
        filteredData = coasterData.slice().sort((a, b) => b.Speed - a.Speed);
        svgImage.style.display = "block"; // Mostrar la imagen SVG
    } else {
        filteredData = coasterData
            .filter(coaster => coaster.Continent === continent)
            .sort((a, b) => b.Speed - a.Speed)
            .slice(0, 10);
        svgImage.style.display = "none"; // Ocultar la imagen SVG
    }

    // Extraer coordenadas, velocidad y nombres para el mapa
    const lon = filteredData.map(item => item.Lon);
    const lat = filteredData.map(item => item.Lat);
    const nombre = filteredData.map(item => item.coaster_name);

    // Definir el factor de escala en función del continente
    let speedFactor;
    switch (continent) {
        case "north america":
            speedFactor = 0.2; break;
        case "south america":
            speedFactor = 0.35; break;
        case "oceania":
            speedFactor = 0.3; break;
        case "europe":
            speedFactor = 0.3; break;
        case "asia":
            speedFactor = 0.2; break;
        case "africa":
            speedFactor = 0.4; break;
        default:
            speedFactor = 0.15; break;
    }

    // Aplicar el factor de escala a cada velocidad
    const magnitud = filteredData.map(item => item.Speed * speedFactor);

    // Configuración de datos de Plotly
    const data = [
        {
            type: 'scattergeo',
            mode: 'markers',
            lon: lon,
            lat: lat,
            text: filteredData.map(item =>
                `${item.coaster_name}<br>Location: ${item.Location}<br>Park: ${item.Park}<br>Speed: ${item.Speed} km/h`
            ),
            hoverinfo: 'text',
            marker: {
                color: magnitud,
                size: magnitud,
                colorscale: [[0, '#fff'], [1, '#000']],
                line: { color: 'black' }
            },
            customdata: filteredData.map(item => item.Speed) // Añadir la velocidad como customdata
        }
    ];

    // Configuración específica del layout
    const layout = (continent === "World") ? {
        geo: {
            scope: 'world',
            projection: { type: 'natural earth' },
            showland: false,
            borderrwidth: 1,
            showframe: false,
            lataxis: { range: [-60, 90] }
        },
        margin: { l: 0, r: 0, b: 0, t: 0, pad: 0 },
        dragmode: false
    } : (continent === "oceania") ? {
        geo: {
            scope: 'world',
            projection: { type: 'natural earth' },
            showland: true,
            showcountries: true,
            landcolor: 'rgb(243,243,243)',
            countrycolor: 'rgb(119, 119, 119)',
            countrywidth: 0.5,
            coastlinecolor: 'rgba(0,0,0,0)',
            showframe: false,
            lataxis: { range: [-40, -10] },
            lonaxis: { range: [100, 170] }
        },
        margin: { l: 0, r: 0, b: 0, t: 0, pad: 0 },
        dragmode: false
    } : {
        geo: {
            scope: continent,
            projection: { type: 'natural earth' },
            showland: true,
            showcountries: true,
            landcolor: 'rgb(243,243,243)',
            countrycolor: 'rgb(119, 119, 119)',
            countrywidth: 0.5,
            coastlinecolor: 'rgba(0,0,0,0)',
            showframe: false,
        },
        margin: { l: 0, r: 0, b: 0, t: 0, pad: 0 },
        dragmode: false
    };

    // Renderizar el mapa con los datos y el layout
    Plotly.newPlot(myPlot, data, layout, { scrollZoom: true, displayModeBar: false });

    // Evento para reproducir sonido al hacer clic en un marcador
    myPlot.on('plotly_click', function(data) {
        const point = data.points[0];
        const speed = point.customdata; // Obtiene la velocidad de la montaña rusa
        playSoundForSpeed(speed); // Llama a la función de sonificación en sonification.js
    });
}

// Evento de cambio en el selector de continente
continentSelect.addEventListener('change', function() {
    updateMap(this.value);
});

// Inicializar el mapa con la opción "World"
updateMap("World");
