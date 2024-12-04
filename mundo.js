const continentSelect = document.getElementById('continentSelect');
const myPlot = document.getElementById('myMap');
const coastersList = document.getElementById('coastersList');  // Contenedor de la lista de montañas rusas
const hoverInfo = document.getElementById('hoverInfo'); // Contenedor de la información al pasar el cursor
let currentHoverIndex = null; // Variable para rastrear el índice actual de hover

function updateMap(continent) {
    let filteredData;

    if (continent === "World") {
        filteredData = coasterData.slice().sort((a, b) => b.Speed - a.Speed);
    } else {
        filteredData = coasterData
            .filter(coaster => coaster.Continent === continent)
            .sort((a, b) => b.Speed - a.Speed)
            .slice(0, 10);
    }

    coastersList.innerHTML = '<h2>Top 10</h2>';
    listItems = [];

    filteredData.slice(0, 10).forEach((coaster, index) => {
        const listItem = document.createElement('div');
        listItem.innerHTML = `
            <div class="ranked-item">
                <span class="rank">${index + 1}°</span>
                <span class="name">${coaster.coaster_name}</span>
            </div>
        `;
        listItem.classList.add('list-item');
        listItems.push(listItem); // Almacenar referencia del elemento

        // Evento de mouseover para la lista
        listItem.addEventListener('mouseover', () => {
            listItem.style.color = 'red';
            highlightMarker(index);
        });

        coastersList.appendChild(listItem);
    });

    const lon = filteredData.map(item => item.Lon);
    const lat = filteredData.map(item => item.Lat);
    let speedFactor;
    switch (continent) {
        case "north america": speedFactor = 0.2; break;
        case "south america": speedFactor = 0.35; break;
        case "oceania": speedFactor = 0.3; break;
        case "europe": speedFactor = 0.3; break;
        case "asia": speedFactor = 0.2; break;
        case "africa": speedFactor = 0.4; break;
        default: speedFactor = 0.15; break;
    }

    const magnitud = filteredData.map(item => item.Speed * speedFactor);
    const data = [
        {
            type: 'scattergeo',
            mode: 'markers',
            lon: lon,
            lat: lat,
            text: filteredData.map(item => item.coaster_name),
            customdata: filteredData.map((item, index) =>
                `<b>${item.coaster_name}</b><br>
                <span id="info">Ranking:</span> ${index + 1}<br>
                <span id="info">Ubicación:</span> ${item.Location}<br>
                <span id="info">Parque:</span> ${item.Park}<br>
                <span id="infor">Velocidad:</span> ${item.Speed} km/h`
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
            landcolor: 'rgba(0,0,0,0)',
            countrycolor: 'rgb(119, 119, 119)',
            countrywidth: 0.5,
            coastlinecolor: 'rgba(0,0,0,0)',
            showframe: false,
        },
        margin: { l: 0, r: 0, b: 0, t: 0, pad: 0 },
        dragmode: false
    };

    Plotly.newPlot(myPlot, data, layout, { scrollZoom: true, displayModeBar: false });

    // Evento plotly_hover para el mapa
    myPlot.on('plotly_hover', function(data) {
        const pointIndex = data.points[0].pointIndex;
        currentHoverIndex = pointIndex;
        highlightMarker(pointIndex);
        // Cambia el cursor a pointer
        myPlot.style.cursor = 'pointer';
    });

    // Evento plotly_unhover para el mapa
    myPlot.on('plotly_unhover', function() {
        resetHighlight();
        // Restablece el cursor a su estilo predeterminado
        myPlot.style.cursor = 'default';
    });

    // Evento plotly_click para la sonificación al hacer clic en un marcador
    myPlot.on('plotly_click', function(data) {
        const pointIndex = data.points[0].pointIndex;
        const selectedCoaster = filteredData[pointIndex];
        narrarYSonificar(selectedCoaster); // Combina narración y sonificación
    });

    // Función para resaltar marcador y mostrar información
    function highlightMarker(index) {
        if (listItems[index]) {
            listItems[index].style.color = 'red';
        }
        const newColors = magnitud.slice();
        newColors[index] = 'red';
        Plotly.restyle(myPlot, { 'marker.color': [newColors] });
        hoverInfo.innerHTML = data[0].customdata[index];
    }

    // Función para restaurar color de marcadores y limpiar información
    function resetHighlight() {
        if (currentHoverIndex !== null) {
            if (listItems[currentHoverIndex]) {
                listItems[currentHoverIndex].style.color = '';
            }
            const resetColors = magnitud.slice();
            Plotly.restyle(myPlot, { 'marker.color': [resetColors] });
            hoverInfo.innerHTML = '';
            currentHoverIndex = null;
        }
    }
}

// Evento de cambio en el selector de continente
continentSelect.addEventListener('change', function() {
    updateMap(this.value);
});

// Inicializar el mapa con la opción "World"
updateMap("World");