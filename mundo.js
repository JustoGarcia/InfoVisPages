const continentSelect = document.getElementById('continentSelect');
const myPlot = document.getElementById('myMap');
const svgImage = document.getElementById('context'); // Referencia a la imagen SVG

function updateMap(continent) {
    let filteredData;

    // Filtrar datos según el continente o "World"
    if (continent === "World") {
        // Mostrar las 10 montañas rusas más rápidas del mundo
        filteredData = coasterData.slice().sort((a, b) => b.Speed - a.Speed);
        svgImage.style.display = "block"; // Mostrar la imagen SVG
    } else {
        // Filtrar las 10 montañas rusas más rápidas del continente seleccionado
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
            speedFactor = 0.2; // Aumenta el factor de velocidad para Norteamérica
            break;
        case "south america":
            speedFactor = 0.35; // Aumenta el factor de velocidad para Sudamérica
            break;
        case "oceania":
            speedFactor = 0.3; // Factor de velocidad para Oceanía
            break;
        case "europe":
            speedFactor = 0.3; // Factor de velocidad para Europa
            break;
        case "asia":
            speedFactor = 0.2 // Factor de velocidad para Asia
            break;
        case "africa":
            speedFactor = 0.4; // Factor de velocidad para África
            break;
        default:
            speedFactor = 0.15; // Factor estándar para otros continentes o el mundo
            break;
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
            }
        }
    ];

    // Configuración específica del layout
    const layout = (continent === "World") ? {
        geo: {
            scope: 'world',
            projection: { type: 'natural earth' },
            showland: false,
            // showcountries: true,
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
}

// Evento de cambio en el selector de continente
continentSelect.addEventListener('change', function() {
    updateMap(this.value);
});

// Inicializar el mapa con la opción "World"
updateMap("World");
