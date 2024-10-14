const myPlot = document.getElementById('myMap');

const coasterDataSorted = coasterData.slice().sort((a, b) => b.Speed - a.Speed);
const velocidad = coasterDataSorted.map(item => item.Speed);
const lon = coasterDataSorted.map(item => item.Lon);
const lat = coasterDataSorted.map(item => item.Lat);
const magnitud = coasterDataSorted.map(item => item.Speed * 0.15); // Ajustar escala de velocidad
const nombre = coasterDataSorted.map(item => item.coaster_name);

const data = [
    {
        type: 'scattergeo',
        mode: 'markers',
        lon: lon, 
        lat: lat,
        hoverinfo: 'none',
        marker: {
            color: magnitud,
            size: magnitud,
            colorscale: [[0, '#fff'], [1, '#000']],
            line: { color: 'black' }
        }
    }
];

const layout = {
    geo: {
        scope: 'world',
        showland: false, 
        projection: { type: 'natural earth' },
        countrycolor: 'black',
        borderrwidth: 1
    },

    margin: { l: 0, r: 0, b: 0, t: 0, pad: 0 },
    dragmode: false
};




Plotly.newPlot(myPlot, data, layout, { scrollZoom: false, displayModeBar: false });